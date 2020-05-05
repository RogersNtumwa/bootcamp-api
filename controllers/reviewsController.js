const Review = require("../models/Review");
const Bootcomp = require("../models/Bootcomp");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");

// @desc    get all reviews
// @route   GET/api/vi/reviews
// @route   GET/api/vi/bootcamp/bootcampid/reviews
// @access  public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).send({
      status: "success",
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).send(res.advancedResults);
  }
});

// @desc    get a review
// @route   GET/api/vi/review/id
// @access   public
exports.getReview = asyncHandler(async (req, res, next) => {
  const data = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!data)
    return next(
      new errorResponse(`No review found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data,
  });
});

// @desc    create a review
// @route   /api/vi/bootcamps/bootcampId/reviews
// @access   private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  // add user to req.body
  req.body.user = req.user.id;

  const bootcamp = await Bootcomp.findById(req.body.bootcamp);
  if (!bootcamp)
    return next(
      new errorResponse(`No Bootcamp found with id ${req.params.id}`, 404)
    );

  const data = await Review.create(req.body);
  res.status(201).send({
    status: "success",
    count: data.length,
    data,
  });
});

// @desc   update a review
// @route   /api/vi/review/id
// @access   private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let data = await Review.findById(req.params.id);

  // Ensure that the user owns this bootcamp
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`You are not allowed to edit this review `, 403)
    );
  }
  data = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data)
    return next(
      new errorResponse(`No Review found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data,
  });
});

// @desc    delete a review
// @route   /api/vi/review/id
// @access   private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let data = await Review.findById(req.params.id);

  // Ensure that the user owns this bootcamp
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`You are not allowed to delete this review `, 403)
    );
  }

  data = await Review.findByIdAndRemove(req.params.id);
  if (!data)
    return next(
      new errorResponse(`No Review found with id ${req.params.id}`, 404)
    );

  res.status(200).send({
    status: "success",
    data: {},
  });
});
