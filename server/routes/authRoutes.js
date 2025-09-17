// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser } = require('../controllers/authController');

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// module.exports = router;

///////////////
// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
} = require("../controllers/authController");

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Google login user
router.post("/google", googleLogin);

module.exports = router;
