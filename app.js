const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db  = mongoose.connection;

// ES6 Promises
mongoose.Promise = global.Promise;

//Check connection
db.once('open', function() {
  console.log('Connected to MongoDB');
});
//Check for DB errors
db.on('error', function(err) {
  console.log(err);
});

// Init App
const app = express();

//Bring in Models
let Link = require('./models/link');

// Set Port number
app.set('port', (process.env.PORT || 3000));
// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,

}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
})

// Home Route
app.get('/', (req, res) => {
  Link.find({}, function(err, links){
    if (err){
      console.log(err);
    } else {
      res.render('index', {
        title: 'Links',
        links: links

      });

    }
  });
});

//Route Files
let links = require('./routes/links');
let users = require('./routes/users');
app.use('/articles', links);
app.use('/users', users);

// Start Server
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
