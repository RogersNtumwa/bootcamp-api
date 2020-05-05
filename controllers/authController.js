const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");

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

// @desc     LoggOut user / Clear cookie
// @route    Get/api/vi/auth/logout
// @access   private
exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).send({
    status: "success",
    data: {},
  });
});

// @desc     Get Current logged in user
// @route    Get/api/vi/auth/me
// @access   private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).send({
    status: "success",
    data: user,
  });
});

// @desc     update userDetails
// @route    Get/api/vi/auth/updateuser
// @access   private
exports.updateuser = asyncHandler(async (req, res, next) => {
  const filedsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, filedsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).send({
    status: "success",
    data: user,
  });
});

// @desc     update user password
// @route    put/api/vi/auth/updatepassword
// @access   private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // check passwaord
  if (!user.matchPassword(req.body.currentPassword)) {
    return next(errorResponse(`Invalid password`, 401));
  }
  user.password = req.body.newpassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc   forgot password
// @route   Get/api/vi/auth/forgotPassword
// @access   private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // Check if user exists
  if (!user) {
    return next(new errorResponse(`Invalid email ${req.body.email}`, 404));
  }
  // Get reset token
  const resetToken = user.getPasswordResetToken();
  console.log(resetToken);

  await user.save({ validateBeforeSave: false });
  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `YOu are receiving this email because you (or someone else)
    requested a reset password. Please click the link below to reset your
    password \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password token",
      message,
    });
    res.status(200).send({
      status: "success",
      data: "Email successfully sent",
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new errorResponse("Email not sent", 500));
  }

  // res.status(200).send({
  //   status: "success",
  //   data: user,
  // });
});

// @desc    Reset PAssword
// @route   PUT/api/vi/auth/resetpassword/:resettoken
// @access  public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashedtoken
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  // Check if user exists
  if (!user) {
    return next(new errorResponse(`Invalid token`, 404));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

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
