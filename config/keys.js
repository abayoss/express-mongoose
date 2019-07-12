if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: process.env.mongoURI,
    googleClientID: process.env.googleClientID,
    googleClientSecret: process.env.googleClientSecret,
    facebookClientID: process.env.facebookClientID,
    facebookClientSecret: process.env.facebookClientSecret
  };
} else {
  module.exports = require('./keys_dev');
}
