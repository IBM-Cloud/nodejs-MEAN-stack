'use strict';

/********************************
Dependencies
********************************/
var express = require('express'),// server middleware
    mongoose = require('mongoose'),// MongoDB connection library
    bodyParser = require('body-parser'),// parse HTTP requests
    passport = require('passport'),// Authentication framework
    LocalStrategy = require('passport-local').Strategy,
    expressValidator = require('express-validator'), // validation tool for processing user input
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo/es5')(session), // store sessions in MongoDB for persistence
    bcrypt = require('bcrypt'), // middleware to encrypt/decrypt passwords

	cfenv = require('cfenv'),// Cloud Foundry Environment Variables
    appEnv = cfenv.getAppEnv(),// Grab environment variables

    User = require('./server/models/user.model'),
	config = require('./server/config');


/********************************
 MongoDB Connection
 ********************************/

// TODO Clean this up. It can be done better
var sessionDB;

// Detects local environment and connects to appropriate DB
if(appEnv.isLocal == true){
    mongoose.connect(config.mongoDB.local);
    sessionDB = config.mongoDB.local;
    console.log('Your MongoDB is running at ' + config.mongoDB.local);
}
else if(appEnv.isLocal != true) {
    mongoose.connect(config.mongoDB.production);
    sessionDB = config.mongoDB.production;
    console.log('Your MongoDB is running at ' + config.mongoDB.production);
}
else{
    console.log('Unable to connect to MongoDB. Check to ensure valid connection information in server/config.js');
}


/********************************
Express Settings
********************************/
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator()); // must go directly after bodyParser

app.use(cookieParser());
app.use(session({
    secret: 'super secret session key',
    resave: true,
    store: new MongoStore({
        url: sessionDB,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());



/********************************
 Passport Middleware Configuration
 ********************************/
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            // validatePassword() method defined in user.model.js
            if (!user.validatePassword(password, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));


/********************************
 Routing
 ********************************/
app.get('/', function (req, res){
    res.sendfile('index.html');
});

// Account login
app.post('/account/login', function(req,res){

    // Validation prior to checking DB. Many validation/sanitize options here: https://github.com/ctavan/express-validator
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors(); // returns an object with results of validation check
    if (errors) {
        res.status(401).send('Username or password was left empty. Please complete both fields and re-submit.');
        return;
    }

    passport.authenticate('local', function(err, user) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).send('User not found. Please check your entry and try again.'); }
        req.logIn(user, function(err) { // creates session
            if (err) { return res.status(500).send('Error saving session.'); }
            return res.status(200).send('You are logged in!');
        });
    })(req, res);

});


// Account creation
app.post('/account/create', function(req,res){

    // 1. Input validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required and must be in a valid form').notEmpty().isEmail();

    var errors = req.validationErrors(); // returns an object with results of validation check
    if (errors) {
        res.status(400).send(errors);
        return;
    }

    // 2. Hash user's password for safe-keeping in DB
    var salt = bcrypt.genSaltSync(10),
        hash = bcrypt.hashSync(req.body.password, salt);

    // 3. Create new object that store's new user data
    var user = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        name: req.body.name
    });

    // 4. Store the data in MongoDB
    User.findOne({ username: req.body.username }, function(err, existingUser) {
        if (existingUser) {
            return res.status(400).send('That username already exists. Please try a different username.');
        }
        user.save(function(err) {
            if (err) {
                console.log(err);
                res.status(500).send('Error saving new account (database error). Please try again.');
                return;

            }
            res.status(200).send('Account created! Please login with your new account.');
        });
    });

});

// Middleware to check if user is logged-in
function authorizeRequest(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).send('Unauthorized. Please login.');
    }
}

app.get('/protected', authorizeRequest, function(req, res){
    res.send('Secret message');
});

app.get('/account/logout', function(req,res){

    if (!req.user)
        res.status(400).send('User not logged in.');
    else {
        req.session.destroy(function(err) {
            if(err){
                res.status(500).send('Sorry. Server error in logout process.');
                console.log("Error destroying session: " + err);
                return;
            }
            res.status(200).send('Success logging user out!');
        });
    }
});

/********************************
Ports
********************************/
app.listen(appEnv.port, appEnv.bind, function() {
  console.log("Node server running on " + appEnv.url);
});

// Make URL available to Gulp during development
module.exports = appEnv;