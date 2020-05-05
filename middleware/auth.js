const asyncHandler = require("./async");
const jwt = require("jsonwebtoken");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // set token from Bearer token from header
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.token) {
  //   // set token from cookie
  //   token = req.cookies.token;
  // }

  // Ensure token exists
  if (!token) {
    return next(
      new errorResponse(`You have no permissions to this route`, 401)
    );
  }

  try {
    // Verift token
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(
      new errorResponse(`You have no permissions to this route`, 401)
    );
  }
});

// Grant access to cetain roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorResponse(`You have no permissions to this route`, 403)
      );
    }
    next();
  };
};
