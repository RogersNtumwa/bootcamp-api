const { Bootcomp } = require("../models/Bootcomp");

// @desc   get all bootcomps
// @route   /api/vi/bootcomps
// @access   public
exports.getbootcomps = async (req, res) => {
  try {
    const data = await Bootcomp.find();
    res.status(200).send({
      status: "success",
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(400).send({
      status: "fail",
      data: {
        error: error.errmsg,
      },
    });
  }
};

// @desc   get asingle bootcomps
// @route   /api/vi/bootcomps/id
// @access   public
exports.getbootcomp = async (req, res) => {
  try {
    const data = await Bootcomp.findById(req.params.id);
    if (!data)
      return res.status(404).send({
        status: "fail",
        message: "Bootcomp with specified ID not found",
      });
    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(404).send({
      status: "fail",
      data: {
        error: error.errmsg,
      },
    });
  }
};
// @desc   create a bootcomp
// @route   /api/vi/bootcomps
// @access   private
exports.createbootcomp = async (req, res) => {
  try {
    const bootcomp = await Bootcomp.create(req.body);
    res.status(201).send({
      status: "success",
      data: bootcomp,
    });
  } catch (error) {
    res.status(400).send({
      status: "fail",
      data: {
        error: error.errmsg,
      },
    });
  }
};

// @desc   update a bootcomp
// @route   /api/vi/bootcomps/id
// @access   private
exports.updatebootcomp = async (req, res) => {
  try {
    const data = await Bootcomp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data)
      return res.status(404).send({
        status: "fail",
        message: "Bootcomp with specified ID not found",
      });
    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(304).send({
      status: "fail",
      data: {
        error: error.errmsg,
      },
    });
  }
};

// @desc   delete a bootcomp
// @route   /api/vi/bootcomps/id
// @access   private
exports.deletebootcomp = async (req, res) => {
  try {
    const data = await Bootcomp.findByIdAndRemove(req.params.id);
    if (!data)
      return res.status(404).send({
        status: "fail",
        message: "Bootcomp with specified ID not found",
      });
    res.status(200).send({
      status: "success",
      data: {},
    });
  } catch (error) {
    res.status(304).send({
      status: "fail",
      data: {
        error: error.errmsg,
      },
    });
  }
};
