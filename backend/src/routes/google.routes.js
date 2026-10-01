import { Router } from "express";
import {
  handleGoogleOAuthCallback,
  redirectToGoogleAuthorization,
} from "../controllers/google.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import { getCurrentUser, logoutCurrentUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/google", redirectToGoogleAuthorization);

router.get("/google/callback", handleGoogleOAuthCallback);

router.get("/me", authenticateUser, getCurrentUser);

router.post("/logout", authenticateUser, logoutCurrentUser);

export default router;