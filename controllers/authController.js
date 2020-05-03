const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc   register a user
// @route  POST /api/vi/users/register
// @access   public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponse(user, 200, res);
});

// @desc   login user
// @route   POST/api/vi/auth/login
// @access   public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new errorResponse(`PLease enter email and  password`, 400));
  }
  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorResponse(`Invalid email or password`, 401));
  }
  // Match password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new errorResponse(`Invalid email or password`, 401));
  }
  sendTokenResponse(user, 200, res);
});

// Get token from model, Create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).send({
    status: "success",
    token,
  });
};

// @desc   Get Current logged in user
// @route   Get/api/vi/auth/me
// @access   private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).send({
    status: "success",
    data: user,
  });
});
