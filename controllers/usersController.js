const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");

// @desc   Get all users
// @route  GET /api/vi/auth/users
// @access   private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advancedResults);
});

// @desc   Get a single user
// @route  GET /api/vi/auth/users/:id
// @access   private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new errorResponse(`User not found`, 404));
  }
  res.status(200).send({
    status: "success",
    data: user,
  });
});

// @desc   Create new User
// @route  POST/api/vi/auth/users
// @access   private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).send({
    status: "success",
    data: user,
  });
});

// @desc   update a user
// @route   PUT/api/vi/auth/users/:id
// @access   private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).send({
    status: "success",
    data: user,
  });
});

// @desc   delete a user
// @route   DELETE/api/vi/auth/users/:id
// @access   private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return next(
      new errorResponse(`No user found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data: {},
  });
});
