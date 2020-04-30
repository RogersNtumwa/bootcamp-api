const { Bootcomp } = require("../models/Bootcomp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// @desc   get all bootcomps
// @route   /api/vi/bootcomps
// @access   public
exports.getbootcomps = asyncHandler(async (req, res) => {
  let query;
  const reqQuery = { ...req.query };

  let removefields = ["sort", "select", "page", "limit"];

  // loop over removefields and delete them from querystring
  removefields.forEach((params) => delete reqQuery[params]);

  // create a query String
  let queryStr = JSON.stringify(reqQuery);

  // creating operators like gt/lte etc
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Bootcomp.find(JSON.parse(queryStr));
  // SELECT
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // SORT
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // pAGINATION
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcomp.countDocuments();
  query.skip(startIndex).limit(limit);

  // executing the query
  const data = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).send({
    status: "success",
    count: data.length,
    pagination,
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
