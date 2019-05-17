const express = require("express"),
  app = express(),
  port = 3000,
  postRouter = require("./routes/posts"),
  mongoose = require("mongoose"),
  dbName = "maxNodeAng",
  bodyParser = require("body-parser");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true })
  .then(console.log(`Connected to ${dbName}!`))
  .catch(err => console.log(err));

app.use((req, res, next) => {
  // Website you wish to allow to connect || * to allow all websites
  const allowedOrigins = ["http://localhost:4200", "http://127.0.0.1:5500"];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,content-type,Accept,Authorization"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // next() to pass control to the next middleware function 
  next();
});

//Routes :
app.use("/api/posts", postRouter);

app.listen(port, () => console.log("server runing on port " + port + " ..."));
