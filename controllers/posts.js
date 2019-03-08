const Post = require("../models/posts");

exports.addPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    creator: req.body.creator
  });
  post
    .save()
    .then(post => {
      res.json({
        message: "post add",
        post
      });
    })
    .catch(err => res.status(404).json({ ErrorMessage: err.message }));
};

exports.UpdatePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id
  })
    .then(post => {
      (post.title = req.body.title),
        (post.content = req.body.content),
        (post.image = req.body.image),
        (post.creator = req.body.creator);

      post
        .save()
        .then(result => {
          res.json({
            message: "post updated",
            post
          });
        })
        .catch(err => res.status(404).json({ ErrorMessage: err.message }));
    })
    .catch(err => res.status(404).json({ ErrorMessage: err.message }));
};
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(post => {
      res.json({
        message: "all posts:",
        post
      });
    })
    .catch(err => res.status(404).json({ message: "no posts here" }));
};

exports.getPost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      res.json({
        message: "Post Found :",
        post
      });
    })
    .catch(err => res.status(404).json({ ErrorMessage: "user not found !" }));
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => res.status(202).json({ message: "post deleted" }))
    .catch(err => res.status(404).json({ ErrorMessage: err.message }));
};
