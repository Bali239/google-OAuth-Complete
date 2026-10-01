import Router from "express"
import { googleGenerateAuthUrl, googleCallback } from "../controllers/google.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import { getUser } from "../controllers/user.controller.js"
const router = Router()

router.get("/google", googleGenerateAuthUrl);

router.get("/google/callback", googleCallback);

router.get("/api/auth/me", authMiddleware, getUser);

router.post("/api/auth/logout", authMiddleware, (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({
    message: "Logged out successfully",
  });
});

export default router;