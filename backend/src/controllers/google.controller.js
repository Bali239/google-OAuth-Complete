import googleClient from "../config/google.js";
import User from "../models/user.model.js";
import createAccessToken from "../utils/createToken.js";

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
      return response.status(400).json({
        message: "Authorization code is missing",
      });
    }

    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      return response.status(401).json({
        message: "Google did not return an ID token",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const verifiedIdentity = ticket.getPayload();

    if (!verifiedIdentity?.sub || !verifiedIdentity.email || !verifiedIdentity.name) {
      return response.status(401).json({
        message: "Google account information is incomplete",
      });
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

    const accessToken = createAccessToken(authenticatedUser._id);
    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return response.json({
      message: "Google login successful",
      user: {
        id: authenticatedUser._id,
        googleId: authenticatedUser.googleId,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        picture: authenticatedUser.picture,
      },
    });
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    return response.status(500).json({
      message: "Google authentication failed",
    });
  }
};