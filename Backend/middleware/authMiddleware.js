const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Check for token in multiple locations
  const token = req.header("x-auth-token") || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Authorization token required",
      hint: "Include 'x-auth-token' header or 'Authorization: Bearer <token>'"
    });
  }

  try {
    // 2. Verify token with enhanced error handling
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Validate token structure
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: "Malformed token payload",
        hint: "Token must contain 'id' and 'role' fields"
      });
    }

    // 4. Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    // 5. Specific error messages
    let message = "Invalid token";
    if (err.name === "TokenExpiredError") {
      message = "Token expired";
    } else if (err.name === "JsonWebTokenError") {
      message = "Token verification failed";
    }

    res.status(401).json({ 
      success: false,
      message,
      error: err.message
    });
  }
};

module.exports = authMiddleware;