const express = require("express");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const Bootcomp = require("../models/Bootcomp");
const { protect, authorize } = require("../middleware/auth");

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
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoupload);

// get bootcamps within a specific area range
router.route("/radius/:zipcode/:distance").get(getBootcampswithin);

router
  .route("/")
  .get(
    advancedResults(Bootcomp, {
      path: "courses",
      select: "title description duration",
    }),
    getbootcomps
  )
  .post(protect, authorize("publisher", "admin"), createbootcomp);
router
  .route("/:id")
  .get(getbootcomp)
  .patch(protect, authorize("publisher", "admin"), updatebootcomp)
  .delete(protect, authorize("publisher", "admin"), deletebootcomp);

module.exports = router;
