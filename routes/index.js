const routes = require("express").Router();
const apiPosts = require("./api/posts");
const apiIdeas = require("./api/ideas");
const posts = require("./web/posts");
const ideas = require("./web/ideas");
const users = require("./web/users");
const { ensureAuthenticated } = require("../helpers/auth");

const Post = require('../models/post');

// ===== Engine rendered Routes
routes.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

// About
routes.get("/about", (req, res) => {
  res.render("about");
});

routes.use("/posts", ensureAuthenticated, posts);
routes.use("/ideas", ensureAuthenticated, ideas);
routes.use("/users", users);

// ===== API routes
routes.use("/api/posts", apiPosts);
routes.use("/api/ideas", apiIdeas);

// export routes
module.exports = routes;
