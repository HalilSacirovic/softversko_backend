const express = require("express");
const {
  getUserProfile,
  signUp,
  confirmEmail,
  login,
} = require("../controllers/userController");
const router = express.Router();

router.get("/userprofile/:id", getUserProfile);
router.post("/signup", signUp);
router.get("/confirm", confirmEmail);
router.post("/login", login);

module.exports = router;
