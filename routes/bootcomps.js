const express = require("express");
const router = express.Router();
const {
  getbootcomps,
  createbootcomp,
  getbootcomp,
  updatebootcomp,
  deletebootcomp,
  getBootcampswithin,
} = require("../controllers/bootcomps");

router.route("/radius/:zipcode/:distance").get(getBootcampswithin);

router.route("/").get(getbootcomps).post(createbootcomp);
router
  .route("/:id")
  .get(getbootcomp)
  .patch(updatebootcomp)
  .delete(deletebootcomp);

module.exports = router;
