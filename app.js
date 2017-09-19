const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const rememberMe = require('passport-remember-me');
const config = require('./config/database');
const http = require('http');
const reload = require('reload');

// Connect to mlab database
mongoose.connect(config.database);
mongoose.Promise = global.Promise;
let db  = mongoose.connection;


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

// Set Port
app.set('port', (process.env.PORT || 5000));

// NPM Reload for development only
var server = http.createServer(app);
reload(app, {verbose: false});


// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set dist Folder
app.use(express.static(path.join(__dirname, 'dist')));

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
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
})

// Home Route
app.get('/', (req, res) => {
  Link.find({}).sort({_id: -1}).exec(function(err, links){
    if (err){
      console.log(err);
    } else {
      res.render('index', {
        title: 'LINK LIBRARY',
        links: links
      });
    }
  });
});

//Route Files
let links = require('./routes/links');
let users = require('./routes/users');
app.use('/links', links);
app.use('/users', users);

// Start Server
server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
