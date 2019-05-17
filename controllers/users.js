const jwt = require("jsonwebtoken");

const bcryptjs = require("bcryptjs");

const User = require("../models/user");

module.exports = {
  userLogin: (req, res, next) => {
    // compare password to DB hashed password
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: "invalid loging credentials !"
          });
        }
        return bcryptjs.compare(req.body.password, user.password);
      })
      .then(result => {
        // const decPass = sc.encrypt(req.body.password);
        if (!result) {
          return res.status(404).json({
            message: "invalid loging credentials !"
          });
        }
        const token = jwt.sign(
          { email: req.body.email, userId: user.id },
          process.env.JWT_KEY,
          { expiresIn: "10h" }
        );
        res.status(200).json({
          token,
          expiresIn: 3600,
          userId: user.id
        });
      })
      // catch errors
      .catch(err => {
        res.status(404).json({
          message: "invalid loging credentials !",
          rerror: err
        });
      });
  },

  createUser: (req, res, next) => {
    bcryptjs.hash(req.body.password, 10).then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(200).json({
            message: "user created",
            result
          });
        })
        .catch(err => {
          res.status(404).json({
            message: "email invalid or already in use",
            rerror: err
          });
        });
    });
  }
};
