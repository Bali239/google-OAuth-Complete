import googleClient from "../config/google.js";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import createToken from "../utils/createToken.js"


dotenv.config();

export const googleGenerateAuthUrl = (req, res) => {
  const authorizationUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
  });

  res.redirect(authorizationUrl);
}

export const googleCallback = async (req, res) => {
   try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        message: "Authorization code is missing",
      });
    }

    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      return res.status(401).json({
        message: "Google did not return an ID token",
      });
    }
    // Verify the ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

     // Get verified identity information
    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      picture,
    } = payload;

    let user = await User.findOne({ googleId }); 
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        picture,
      });
    }
    const token = createToken(user._id);
    res.cookie("accessToken", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 15 * 60 * 1000,
});
    res.json({
      message: "Google login successful",
      user: {
        id: user._id,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    res.status(500).json({
      message: "Google authentication failed",
    });
  }
}