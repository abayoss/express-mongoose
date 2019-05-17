const Post = require("../models/posts");

exports.addPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: url + "/images/posts/NoImage.jpg",
    creator: req.userData.creator
  });
  if (req.file) {
    post.image = url + "/images/posts/dev/" + req.file.filename;
  }
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
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      creator: req.userData.userId
    })
    if ( req.file ) {
      const url = req.protocol + "://" + req.get("host");
      post.image = url + "/images/posts/" + req.file.filename
    }
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if ( result.n > 0 ){
        res.json({
          message: 'post Updated !',
          post
        });
      } else {
          res.status(401).json({
            message: 'Not Autorized !',
            post
          });
      }
    }).catch( err => {
      res.status(500).json({
        message: 'post Edit failed !'
      })
    });
  };
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.json({
        message: "all posts:",
        posts
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
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.json({
          message: "post Deleted !"
        });
      } else {
        res.status(401).json({
          message: "Not Autorized !",
          post
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "post Deletion failed !"
      });
    });
};
