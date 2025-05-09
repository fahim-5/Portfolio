const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Get the token from the header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_jwt_key_for_portfolio"
    );

    // Add the user info to the request
    req.user = {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  authenticateToken,
};
