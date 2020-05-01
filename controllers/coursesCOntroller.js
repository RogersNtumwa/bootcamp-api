const Courses = require("../models/Course");
const Bootcomp = require("../models/Bootcomp");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");

// @desc   get all courses
// @route   /api/vi/cpurses
// @access   public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Courses.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const data = await query;
  res.status(200).send({
    status: "success",
    count: data.length,
    data,
  });
});

// @desc   get a course
// @route   /api/vi/courses/id
// @access   public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const data = await Courses.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!data)
    return next(
      new errorResponse(`No Course found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data,
  });
});

// @desc    create a course
// @route   /api/vi/bootcamps/bootcampId/courses
// @access   private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcomp.findById(req.body.bootcamp);
  if (!bootcamp)
    return next(
      new errorResponse(`No Bootcamp found with id ${req.params.id}`, 404)
    );

  const data = await Courses.create(req.body);
  res.status(201).send({
    status: "success",
    count: data.length,
    data,
  });
});

// @desc   update a bootcomp
// @route   /api/vi/courses/id
// @access   private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const data = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data)
    return next(
      new errorResponse(`No Course found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data,
  });
});

// @desc   delete a course
// @route   /api/vi/courses/id
// @access   private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const data = await Courses.findByIdAndRemove(req.params.id);
  if (!data)
    return next(
      new errorResponse(`No Course found with id ${req.params.id}`, 404)
    );
  res.status(200).send({
    status: "success",
    data: {},
  });
});
