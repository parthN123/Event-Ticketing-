const roleMiddleware = (roles) => (req, res, next) => {
  try {
    // 1. Verify user exists in request
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "User authentication required",
        hint: "Ensure authMiddleware runs before roleMiddleware"
      });
    }

    // 2. Verify role exists in user object
    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: "User role missing",
        hint: "Ensure JWT token includes 'role' field"
      });
    }

    // 3. Check if user has required role
    if (!roles.includes(req.user.role)) {
      console.warn(`Unauthorized access attempt by ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: "Access denied",
        requiredRoles: roles,
        currentRole: req.user.role
      });
    }

    // 4. Role check passed
    console.log(`Access granted to ${req.user.role}`);
    next();
  } catch (err) {
    console.error("Role middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Role verification failed",
      error: err.message
    });
  }
};

module.exports = roleMiddleware;