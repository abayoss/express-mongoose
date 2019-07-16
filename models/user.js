const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  email: { type: String, required: true },
  password: String,
  googleID: String,
  facebookID: String,
  firstName: String,
  lastName: String,
  image: String
});

userSchema.pre("save", function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hashedPassword) => {
      if (err) throw err;
      this.password = hashedPassword;
      next();
    });
  });
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    console.log(error);
  }
};
module.exports = mongoose.model("users", userSchema);
