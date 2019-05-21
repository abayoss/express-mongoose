// Load Idea Model
const Idea = require("../../models/Idea");
const Post = require("../../models/post");

module.exports = {
  getIdeas: (req, res) => {
    Idea.find({ user: req.user.id })
      .sort({ date: "desc" })
      .then(ideas => {
        res.render("ideas/index", {
          ideas: ideas
        });
      });
  },
  getIdea : (req, res) => {
    Idea.findOne({
      _id: req.params.id
    }).then(idea => {
      if (idea.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        res.redirect("/ideas");
      } else {
        res.render("ideas/edit", {
          idea: idea
        });
      }
    });
  },
  getAddIdea: (req, res) => {
    res.render("ideas/add");
  },
  addIdea: (req, res) => {
    let errors = [];
  
    if (!req.body.title) {
      errors.push({ text: "Please add a title" });
    }
    if (!req.body.details) {
      errors.push({ text: "Please add some details" });
    }
  
    if (errors.length > 0) {
      res.render("ideas/add", {
        errors: errors,
        title: req.body.title,
        details: req.body.details
      });
    } else {
      const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: req.user.id
      };
      new Idea(newUser).save().then(idea => {
        req.flash("success_msg", "Video idea added");
        res.redirect("/ideas");
      });
    }
  },
  editIdea : (req, res) => {
    Idea.findOne({
      _id: req.params.id
    }).then(idea => {
      // new values
      idea.title = req.body.title;
      idea.details = req.body.details;
  
      idea.save().then(idea => {
        req.flash("success_msg", "Video idea updated");
        res.redirect("/ideas");
      });
    });
  },
  deleteIdea :  (req, res) => {
    Idea.remove({ _id: req.params.id }).then(() => {
      req.flash("success_msg", "Video idea removed");
      res.redirect("/ideas");
    });
  }
};
