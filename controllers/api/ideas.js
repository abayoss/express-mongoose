// Load Idea Model
const Idea = require("../../models/Idea");

module.exports = {
  getIdeas: (req, res) => {
    Idea.find()
      .sort({ date: "desc" })
      .then(ideas => {
        res.status(200).json({
          ideas
        });
      });
  },
  getIdea: (req, res) => {
    Idea.findOne({
      _id: req.params.id
    }).then(idea => {
      res.status(200).json({
        idea
      });
    });
  },
  addIdea: (req, res) => {
    if (!req.body.title) {
      res.status(200).json({
        error: "Please add a title"
      });
    }
    if (!req.body.details) {
      res.status(200).json({
        error: "Please add some details"
      });
    }
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id || null
    };
    new Idea(newUser).save().then(idea => {
      res.status(200).json({
        message: "idea added",
        idea
      });
    });
  },
  editIdea: (req, res) => {
    Idea.findOne({
      _id: req.params.id
    }).then(idea => {
      // new values
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save().then(idea => {
        res.status(200).json({
          message: "idea updated",
          idea
        });
      });
    });
  },
  deleteIdea: (req, res) => {
    Idea.remove({ _id: req.params.id }).then(() => {
      res.status(200).json({
        message: "Video idea removed",
        idea
      });
    });
  }
};
