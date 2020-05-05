const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  getMe, 
  forgotPassword,
  resetPassword,
  updateuser,
  updatePassword,
  logOut,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.get("/me", protect, getMe);
router.put("/updateuser", protect, updateuser);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
