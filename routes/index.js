const express = require("express"),
  router = express.Router();

// Routes
const authRouter = require("./auth"),
  dreamsRouter = require("./dreams");

// Helpers
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

// models
const Dream = require("../models/dream");

router.get("/", ensureGuest, (req, res) => {
  res.render("index/welcome");
});

router.get("/search", (req, res) => {
  res.render("index/search");
});
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Dream.find({ creator: req.user.id })
    .populate("creator")
    .then(dreams => {
      res.render("index/dashboard", { dreams });
    });
});

router.use("/auth", authRouter);
router.use("/dreams", dreamsRouter);

module.exports = router;
