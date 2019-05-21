const Post = require("../../models/post");

module.exports = {
  getPosts: (req, res, next) => {
    Post.find({ creator: req.user.id })
      .then(posts => {
        res.render("posts/index", {
          posts
        });
      })
      .catch(err => res.status(404).json({ message: "no posts here" }));
  },
  getUpdatePost : (req, res, next) => {
    Post.findOne({ _id: req.params.id })
      .then(post => {
        res.render("posts/edit", {
          post
        });
      })
      .catch(err => res.status(404).json({ ErrorMessage: "post not found !" }));
  },
  // getPost: (req, res, next) => {
  //   Post.findOne({ _id: req.params.id })
  //     .then(post => {
  //       res.json({
  //         message: "Post Found :",
  //         post
  //       });
  //     })
  //     .catch(err => res.status(404).json({ ErrorMessage: "post not found !" }));
  // },
  getAddPost: (req, res) => {
    res.render("posts/add");
  },
  addPost: (req, res, next) => {
    let errors = [];

    if (!req.body.title) {
      errors.push({ text: "Please add a title" });
    }
    if (!req.body.content) {
      errors.push({ text: "Please add some content" });
    }

    if (errors.length > 0) {
      res.render("posts/add", {
        errors: errors,
        title: req.body.title,
        content: req.body.content
      });
    } else {
      const url = req.protocol + "://" + req.get("host");
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        image: url + "/images/posts/NoImage.jpg",
        creator: req.user.id || req.body.creator
      });
      if (req.file) {
        post.image = url + "/images/posts/dev/" + req.file.filename;
      }
      post
        .save()
        .then(post => {
          req.flash("success_msg", "Video post added");
          res.redirect("/posts");
        })
        .catch(err => res.status(404).json({ ErrorMessage: err.message }));
    }
  },
  UpdatePost: (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    Post.findOne({
      _id: req.params.id
    })
      .then(post => {
        if (req.file) {
          post.image = url + "/images/posts/dev/" + req.file.filename;
        }
        post.title = req.body.title;
        post.content = req.body.content;

        post
          .save()
          .then(result => {
            req.flash("success_msg", "post updated sucessfuly");
            res.redirect('/posts');
          })
          .catch(err => res.status(404).json({ ErrorMessage: err.message }));
      })
      .catch(err => res.status(404).json({ ErrorMessage: err.message }));
  },
  deletePost: (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
      .then(result => res.redirect('/posts'))
      .catch(err => res.status(404).json({ ErrorMessage: err.message }));
  }
};
