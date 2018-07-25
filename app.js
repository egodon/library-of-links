const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const rememberMe = require("passport-remember-me");
const config = require("./config/database");
const http = require("http");
const reload = require("reload");

mongoose.connect(config.database);
mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.once("open", function() {
  console.log("Connected to MongoDB");
});

db.on("error", function(err) {
  console.log(err);
});

const app = express();

let Link = require("./models/link");

app.set("port", process.env.PORT || 5000);

var server = http.createServer(app);
reload(app, { verbose: false });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "dist")));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

require("./config/passport")(passport);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("remember-me"));

app.get("*", function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  Link.find({})
    .sort({ _id: -1 })
    .exec(function(err, links) {
      if (err) {
        console.log(err);
      } else {
        res.render("index", {
          links: links
        });
      }
    });
});

let links = require("./routes/links");
let users = require("./routes/users");
app.use("/links", links);
app.use("/users", users);

server.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
