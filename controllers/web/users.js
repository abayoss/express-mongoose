const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../../models/User");

module.exports = {
  getLogin: (req, res) => {
    res.render("users/login");
  },
  getRegister: (req, res) => {
    res.render("users/register");
  },
  login: (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/posts",
      failureRedirect: "/users/login",
      failureFlash: true
    })(req, res, next);
  },
  register: (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
      errors.push({ text: "Passwords do not match" });
    }

    if (req.body.password.length < 4) {
      errors.push({ text: "Password must be at least 4 characters" });
    }

    if (errors.length > 0) {
      res.render("users/register", {
        errors: errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
      });
    } else {
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          req.flash("error_msg", "Email already regsitered");
          res.redirect("/users/register");
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("/users/login");
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
    }
  },
  logOut: (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  }
};
