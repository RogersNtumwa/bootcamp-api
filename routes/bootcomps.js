const express = require("express");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const Bootcomp = require("../models/Bootcomp");

const {
  getbootcomps,
  createbootcomp,
  getbootcomp,
  updatebootcomp,
  deletebootcomp,
  getBootcampswithin,
  bootcampPhotoupload,
} = require("../controllers/bootcomps");

// other resources
const courseRouter = require("./courses");

// get course for specific bootcamps
router.use("/:bootcampId/courses", courseRouter);

// upload photo
router.route("/:id/photo").put(bootcampPhotoupload);

// get bootcamps within a specific area range
router.route("/radius/:zipcode/:distance").get(getBootcampswithin);

router.route("/").get(advancedResults(Bootcomp, {
  path: 'courses',
  select:"title description duration"
}),getbootcomps).post(createbootcomp);
router
  .route("/:id")
  .get(getbootcomp)
  .patch(updatebootcomp)
  .delete(deletebootcomp);

module.exports = router;
