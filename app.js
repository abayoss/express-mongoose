const express = require("express"),
  app = express(),
  port = 3000,
  postRouter = require("./routes/posts"),
  userRouter = require("./routes/users"),
  mongoose = require("mongoose"),
  dbName = "maxNodeAng",
  cors = require("cors"),
  bodyParser = require("body-parser");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongoose connection 
mongoose
  .connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true })
  .then(console.log(`Connected to ${dbName}!`))
  .catch(err => console.log(err));
// to silence the : collection.ensureIndex is deprecated
mongoose.set("useCreateIndex", true);

// grant access to the storage folder 
app.use("/images", express.static("images"))


// enable CORS with various options
let corsOption = {
    "origin": ["http://127.0.0.1:5500","http://localhost:4200"],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "allowedHeaders":"Origin,X-Requested-With,content-type,Accept,Authorization",
    "preflightContinue": true,
    "credentials":true
}
app.use(cors(corsOption));

//Routes :
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

// tests : nothing required, just a middleware i use to test packeges n stuff:
const tests = require("./middleware/tests")
app.get("/tests/:password", tests);

// server 
app.listen(port, () => console.log("server runing on port " + port + " ..."));
