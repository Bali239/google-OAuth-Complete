import googleClient from "../config/google.js";
import User from "../models/user.model.js";
import { welcomeEmail } from "../emails/welcome.email.js";
import { sendEmail } from "../services/email.service.js";
import createAccessToken from "../utils/createToken.js";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const redirectToLoginWithError = (response, errorCode) => {
  const loginUrl = new URL("/", frontendUrl);
  loginUrl.searchParams.set("error", errorCode);
  return response.redirect(loginUrl.toString());
};

export const redirectToGoogleAuthorization = (request, response) => {
  const authorizationUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
  });

  return response.redirect(authorizationUrl);
};

export const handleGoogleOAuthCallback = async (request, response) => {
  try {
    const { code } = request.query;

    if (!code) {
      return redirectToLoginWithError(response, "missing_code");
    }

    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      return redirectToLoginWithError(response, "missing_id_token");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const verifiedIdentity = ticket.getPayload();

    if (!verifiedIdentity?.sub || !verifiedIdentity.email || !verifiedIdentity.name) {
      return redirectToLoginWithError(response, "incomplete_account");
    }

    const { sub: googleId, email, name, picture } = verifiedIdentity;
    let authenticatedUser = await User.findOne({ googleId });

    if (!authenticatedUser) {
      authenticatedUser = await User.create({
        googleId,
        email,
        name,
        picture,
      });
    }

    if (!authenticatedUser.welcomeEmailSentAt) {
      try {
        await sendEmail({ to: email, ...welcomeEmail(name) });
        authenticatedUser.welcomeEmailSentAt = new Date();
        await authenticatedUser.save();
      } catch (emailError) {
        console.error("Welcome email delivery failed:", emailError);
      }
    }

    const accessToken = createAccessToken(authenticatedUser._id);
    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return response.redirect(new URL("/dashboard", frontendUrl).toString());
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    return redirectToLoginWithError(response, "google_auth_failed");
  }
};