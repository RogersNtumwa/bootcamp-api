// @desc   get all bootcomps
// @route   /api/vi/bootcomps
// @access   public
exports.getbootcomps = (req, res) => {
  res.status(200).send({
    status: "success",
    data: "All your bootcomps",
  });
};

// @desc   get asingle bootcomps
// @route   /api/vi/bootcomps/id
// @access   public
exports.getbootcomp = (req, res) => {
  res.status(200).send({
    status: "success",
    data: "All your bootcomps",
  });
};
// @desc   create a bootcomp
// @route   /api/vi/bootcomps
// @access   private
exports.createbootcomp = (req, res) => {
  res.status(200).send({
    status: "success",
    data: "All your bootcomps",
  });
};

// @desc   update a bootcomp
// @route   /api/vi/bootcomps/id
// @access   private
exports.updatebootcomp = (req, res) => {
  res.status(200).send({
    status: "success",
    data: "All your bootcomps",
  });
};

// @desc   delete a bootcomp
// @route   /api/vi/bootcomps/id
// @access   private
exports.deletebootcomp = (req, res) => {
  res.status(200).send({
    status: "success",
    data: "Deleting a bootcomp",
  });
};
