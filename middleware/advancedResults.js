const advancedResults = (model, populate) => async (req, res, next) => {
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
  query = model.find(JSON.parse(queryStr));

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

  if (populate) {
    query = query.populate(populate);
  }

  // pAGINATION
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query.skip(startIndex).limit(limit);

  // executing the query
  const results = await query;

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

  res.advancedResults = {
    status: "success",
    count: results.length,
    pagination,
    data: results,
  };

  next();
};
module.exports = advancedResults;
