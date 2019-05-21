const express = require("express"),
  app = express(),
  port = 3000,
  indexRouter = require("./routes"),
  mongoose = require("mongoose"),
  dbName = "default",
  path = require("path"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  session = require("express-session"),
  passport = require("passport"),
  exphbs = require("express-handlebars"),
  bodyParser = require("body-parser");

// Passport Config
require("./config/passport")(passport);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// grant access to the static folders
app.use("/images", express.static("images"));
app.use(express.static(path.join(__dirname, "public")));

// set view engine 
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

mongoose
  .connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true })
  .then(console.log(`Connected to ${dbName}!`))
  .catch(err => console.log(err));

// cors access
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
// Method override to use PUT,Delete.. on client Action
app.use(methodOverride("_method"));

// Express session midleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Load Routes :
app.use("/", indexRouter);

app.listen(port, () => console.log("server runing on port " + port + " ..."));
