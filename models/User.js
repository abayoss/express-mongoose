const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


// use a database 
const vidjotdev = mongoose.connection.useDb('vidjot-dev');

module.exports = vidjotdev.model('users', UserSchema);