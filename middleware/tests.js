const bcryptjs = require("bcryptjs");

// testing procces evn , bcrypt 
module.exports =  (req, res) => {
  bcryptjs
    .hash(req.params.password, 10)
    .then(hash => {
      console.log("TCL: encPassword", hash);
      return bcryptjs.compare(req.params.password, hash);
    })
    .then(result => {
      if (!result) {
        res.json({
          message: "hash wrong"
        });
      }
      res.json({
        message: "hash test passed",
        secret : process.env.JWT_KEY
      });
    })
    .catch(err => console.log(err));
}