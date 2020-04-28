const morgan = require("morgan");

exports.logger = (req, res, next) => {
  next();
};
