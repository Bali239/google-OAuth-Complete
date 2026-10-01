import User from "../models/user.model.js";

export const getCurrentUser = async (request, response) => {
  try {
    const currentUser = await User.findById(request.authenticatedUserId).select("-__v");

    if (!currentUser) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    return response.json({
      user: currentUser,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return response.status(500).json({
      message: "Failed to get current user",
    });
  }
};

export const logoutCurrentUser = (request, response) => {
  response.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response.json({
    message: "Logged out successfully",
  });
};