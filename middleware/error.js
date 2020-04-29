const errorResponse = require("../utils/errorResponse");

const errorhandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // log to the console for the dev
  console.log(err.stack.red);

  // mongoose dab objectId
  if (err.name === "CastError") {
    const message = `No Resource found with id ${err.value}`;
    error = new errorResponse(message, 404);
  }

  // Mongoose depulicate key
  if (err.code === 11000) {
    const message = `Resource already exists`;
    error = new errorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new errorResponse(message, 400);
  }
  res.status(error.statusCode || 500).send({
    status: "fail",
    error: error.message || "Server Error",
  });
};

module.exports = errorhandler;
