const { Bootcomp } = require("../models/Bootcomp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc   get all bootcomps
// @route   /api/vi/bootcomps
// @access   public
exports.getbootcomps = asyncHandler(async (req, res) => {
  const data = await Bootcomp.find();
  res.status(200).send({
    status: "success",
    count: data.length,
    data,
  });
});

// @desc   get asingle bootcomps
// @route   /api/vi/bootcomps/id
// @access   public
exports.getbootcomp = asyncHandler(async (req, res, next) => {
  const data = await Bootcomp.findById(req.params.id);
  if (!data)
    return next(
      new errorResponse(`No bootcomp found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data,
  });
});
// @desc   create a bootcomp
// @route   /api/vi/bootcomps
// @access   private
exports.createbootcomp = asyncHandler(async (req, res, next) => {
  const bootcomp = await Bootcomp.create(req.body);
  res.status(201).send({
    status: "success",
    data: bootcomp,
  });
});

// @desc   update a bootcomp
// @route   /api/vi/bootcomps/id
// @access   private
exports.updatebootcomp = asyncHandler(async (req, res, next) => {
  const data = await Bootcomp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data)
    return next(
      new errorResponse(`No bootcomp found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data,
  });
});

// @desc   delete a bootcomp
// @route   /api/vi/bootcomps/id
// @access   private
exports.deletebootcomp = asyncHandler(async (req, res, next) => {
  const data = await Bootcomp.findByIdAndRemove(req.params.id);
  if (!data)
    return next(
      new errorResponse(`No bootcomp found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data: {},
  });
});
