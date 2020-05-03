const Bootcomp = require("../models/Bootcomp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const path = require("path");

// @desc   get all bootcomps
// @route   /api/vi/bootcomps
// @access   public
exports.getbootcomps = asyncHandler(async (req, res) => {
  res.status(200).send(res.advancedResults);
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
  // add user to req.body
  req.body.user = req.user.id;
  const publishedBootcamp = await Bootcomp.findOne({ user: req.user.id });

  // if user is not an admin , they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new errorResponse(
        `User with ${req.user.id} has already published bootcamp`,
        400
      )
    );
  }

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
  let data = await Bootcomp.findById(req.params.id);

  if (!data)
    return next(
      new errorResponse(`No bootcomp found with id ${req.params.id}`, 404)
    );

  // Ensure that the user owns this bootcamp
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`You are not allowed to edit this bootcamp`, 403)
    );
  }

  data = await Bootcomp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({
    status: "success",
    data,
  });
});

// @desc   delete a bootcomp
// @route   /api/vi/bootcomps/id
// @access   private
exports.deletebootcomp = asyncHandler(async (req, res, next) => {
  const data = await Bootcomp.findById(req.params.id);
  if (!data)
    return next(
      new errorResponse(`No bootcomp found with id ${req.params.id}`, 404)
    );
  // Ensure that the user owns this bootcamp
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`You are not allowed to edit this bootcamp`, 403)
    );
  }
  data.remove();
  res.status(200).send({
    status: "success",
    data: {},
  });
});

// @desc   Get data with in a radius
// @route   /api/vi/bootcomps/radius/:zipcode/:distance
// @access   private
exports.getBootcampswithin = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcomp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).send({
    status: "success",
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc   upload bootcamp photo
// @route   /api/vi/bootcomps/:id/photo
// @access   private
exports.bootcampPhotoupload = asyncHandler(async (req, res, next) => {
  const data = await Bootcomp.findById(req.params.id);
  if (!data)
    return next(
      new errorResponse(`No bootcomp found with id ${req.params.id}`, 404)
    );
  // Ensure that the user owns this bootcamp
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(`You are not allowed to edit this bootcamp`, 403)
    );
  }
  if (!req.files) {
    return next(new errorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  // Check that file is an image
  if (!file.mimetype.startsWith("image")) {
    return next(new errorResponse(`Please upload an image file`, 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new errorResponse(`image file is too large`, 400));
  }

  // Create custom file name
  file.name = `photo_${data._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(
        new errorResponse(`No bootcomp found with id ${req.params.id}`, 404)
      );
    }

    await Bootcomp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
    res.status(200).send({
      status: "success",
      data: file.name,
    });
  });
});
