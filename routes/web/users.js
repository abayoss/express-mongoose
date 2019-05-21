const express = require("express");
const usersController = require("../../controllers/web/users");
const router = express.Router();

// User Login Route
router.get("/login", usersController.getLogin);

// User Register Route
router.get("/register", usersController.getRegister);

// Login Form POST
router.post("/login", usersController.login);

// Register Form POST
router.post("/register", usersController.register);

// Logout User
router.get("/logout", usersController.logOut);

module.exports = router;
