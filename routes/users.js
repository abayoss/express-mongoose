const express = require("express"),
  router = express(),
  usersController = require("../controllers/users");
  
// user routes:
router.post("/signup", usersController.createUser);
router.post("/login", usersController.userLogin);

module.exports = router;
