const express = require("express");
const router = express.Router();
const {
  getbootcomps,
  createbootcomp,
  getbootcomp,
  updatebootcomp,
  deletebootcomp,
} = require("../controllers/bootcomps");

router.route("/").get(getbootcomps).post(createbootcomp);
router
  .route("/:id")
  .get(getbootcomp)
  .patch(updatebootcomp)
  .delete(deletebootcomp);

module.exports = router;
