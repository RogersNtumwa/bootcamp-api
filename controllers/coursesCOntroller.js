const Courses = require("../models/Course");
const Bootcomp = require("../models/Bootcomp");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");

// @desc   get all courses
// @route   /api/vi/cpurses
// @access   public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Courses.find({ bootcamp: req.params.bootcampId });
    return res.status(200).send({
      status: "success",
      count: courses.length,
      courses,
    });
  } else {
    res.status(200).send(res.advancedResults);
  }
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
  // add user to req.body
  req.body.user = req.user.id;

  const bootcamp = await Bootcomp.findById(req.body.bootcamp);
  if (!bootcamp)
    return next(
      new errorResponse(`No Bootcamp found with id ${req.params.id}`, 404)
    );

  // Ensure that the user owns this bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(
        `You are not allowed to add acourse to this bootcamp`,
        403
      )
    );
  }

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
  let data = await Courses.findById(req.params.id);

  // Ensure that the user owns this bootcamp
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`You are not allowed to edit this course `, 403)
    );
  }
  data = await Courses.findByIdAndUpdate(req.params.id, req.body, {
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
  let data = await Courses.findById(req.params.id);

  // Ensure that the user owns this bootcamp
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`You are not allowed to delete this course `, 403)
    );
  }

  data = await Courses.findByIdAndRemove(req.params.id);
  if (!data)
    return next(
      new errorResponse(`No Course found with id ${req.params.id}`, 404)
    );

  res.status(200).send({
    status: "success",
    data: {},
  });
});
