import jwt from "jsonwebtoken";

const authenticateUser = (request, response, next) => {
  try {
    const accessToken = request.cookies?.accessToken;

    if (!accessToken) {
      return response.status(401).json({
        message: "Authentication required",
      });
    }

    const verifiedTokenPayload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );

    if (typeof verifiedTokenPayload === "string" || !verifiedTokenPayload.userId) {
      return response.status(401).json({
        message: "Invalid or expired authentication token",
      });
    }

    request.authenticatedUserId = verifiedTokenPayload.userId;

    next();
  } catch {
    return response.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
};

export default authenticateUser;