const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  console.log(`Auth middleware called for ${req.method} ${req.originalUrl}`);
  

    // Detailed error message
    let errorMessage = "Invalid or expired token";
    
    if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token format or signature";
    } else if (error.name === "TokenExpiredError") {
      errorMessage = "Token has expired";
    }
    
    return res.status(403).json({
      success: false,
      message: errorMessage,
      error: error.name,
      path: req.originalUrl,
      method: req.method
    });
  }
};

// Public-access version of the middleware that doesn't reject requests without tokens
const optionalAuth = (req, res, next) => {
  console.log(`Optional auth middleware called for ${req.method} ${req.originalUrl}`);
  
  // Get the token from the header
  const authHeader = req.headers["authorization"];
  console.log("Authorization header for optional auth:", authHeader ? "Present" : "Missing");
  
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  
  if (!token) {
    console.log("No token provided for optional auth - continuing as public access");
    return next();
  }
  
  try {
    // JWT Secret
    const jwtSecret = process.env.JWT_SECRET || "your_secret_jwt_key_for_portfolio";
    
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Add the user info to the request
    req.user = {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin || false,
    };
    
    console.log(`User authenticated (optional): userId=${decoded.userId}, isAdmin=${decoded.isAdmin || false}`);
    next();
  } catch (error) {
    console.log("Optional auth token invalid, continuing as public access:", error.message);
    next(); // Continue anyway since auth is optional
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
