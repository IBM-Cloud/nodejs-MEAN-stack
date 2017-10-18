// See LICENSE.MD for license information.

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
    sessionDB,

    cfenv = require('cfenv'),// Cloud Foundry Environment Variables
    appEnv = cfenv.getAppEnv(),// Grab environment variables

    User = require('./server/models/user.model');
    

/********************************
Local Environment Variables
 ********************************/
if(appEnv.isLocal){
    require('dotenv').load();// Loads .env file into environment
}

/******************************** 
 MongoDB Connection
 ********************************/

//Detects environment and connects to appropriate DB
if(appEnv.isLocal){
    mongoose.connect(process.env.LOCAL_MONGODB_URL);
    sessionDB = process.env.LOCAL_MONGODB_URL;
    console.log('Your MongoDB is running at ' + process.env.LOCAL_MONGODB_URL);
}
// Connect to MongoDB Service on Bluemix
else if(!appEnv.isLocal) {
    var mongoDbUrl, mongoDbOptions = {};
    var mongoDbCredentials = appEnv.services["compose-for-mongodb"][0].credentials;
    var ca = [new Buffer(mongoDbCredentials.ca_certificate_base64, 'base64')];
    mongoDbUrl = mongoDbCredentials.uri;
    mongoDbOptions = {
      mongos: {
        ssl: true,
        sslValidate: true,
        sslCA: ca,
        poolSize: 1,
        reconnectTries: 1
      }
    };

    console.log("Your MongoDB is running at ", mongoDbUrl);
    mongoose.connect(mongoDbUrl, mongoDbOptions); // connect to our database
    sessionDB = mongoDbUrl;
}
else{
    console.log('Unable to connect to MongoDB.');
}




/********************************
Express Settings
********************************/
var app = express();
app.enable('trust proxy');
// Use SSL connection provided by Bluemix. No setup required besides redirecting all HTTP requests to HTTPS
if (!appEnv.isLocal) {
    app.use(function (req, res, next) {
        if (req.secure) // returns true is protocol = https
            next();
        else
            res.redirect('https://' + req.headers.host + req.url);
    });
}
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator()); // must go directly after bodyParser
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'this_is_a_default_session_secret_in_case_one_is_not_defined',
    resave: true,
    store: new MongoStore({
        url: sessionDB,
        autoReconnect: true
    }),
    saveUninitialized : false,
    cookie: { secure: true }
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
            // validatePassword method defined in user.model.js
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

// Home
app.get('/', function (req, res){
    res.sendfile('index.html');
});

// Account login
app.post('/account/login', function(req,res){

    // Validation prior to checking DB. Front end validation exists, but this functions as a fail-safe
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors(); // returns an object with results of validation check
    if (errors) {
        res.status(401).send('Username or password was left empty. Please complete both fields and re-submit.');
        return;
    }

    // Create session if username exists and password is correct
    passport.authenticate('local', function(err, user) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).send('User not found. Please check your entry and try again.'); }
        req.logIn(user, function(err) { // creates session
            if (err) { return res.status(500).send('Error saving session.'); }
            var userInfo = {
                username: user.username,
                name : user.name,
                email : user.email
            };
            return res.json(userInfo);
        });
    })(req, res);

});

// Account creation
app.post('/account/create', function(req,res){

    // 1. Input validation. Front end validation exists, but this functions as a fail-safe
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required and must be in a valid form').notEmpty().isEmail();

    var errors = req.validationErrors(); // returns an array with results of validation check
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

//Account deletion
app.post('/account/delete', authorizeRequest, function(req, res){

    User.remove({ username: req.body.username }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Error deleting account.');
            return;
        }
        req.session.destroy(function(err) {
            if(err){
                res.status(500).send('Error deleting account.');
                console.log("Error deleting session: " + err);
                return;
            }
            res.status(200).send('Account successfully deleted.');
        });
    });

});

// Account update
app.post('/account/update', authorizeRequest, function(req,res){

    // 1. Input validation. Front end validation exists, but this functions as a fail-safe
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

    // 3. Store updated data in MongoDB
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) {
            console.log(err);
            return res.status(400).send('Error updating account.');
        }
        user.username = req.body.username;
        user.password = hash;
        user.email = req.body.email;
        user.name = req.body.name;
        user.save(function(err) {
            if (err) {
                console.log(err);
                res.status(500).send('Error updating account.');
                return;
            }
            res.status(200).send('Account updated.');
        });
    });

});

// Account logout
app.get('/account/logout', function(req,res){

    // Destroys user's session
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

// Custom middleware to check if user is logged-in
function authorizeRequest(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).send('Unauthorized. Please login.');
    }
}

// Protected route requiring authorization to access.
app.get('/protected', authorizeRequest, function(req, res){
    res.send("This is a protected route only visible to authenticated users.");
});

/********************************
Ports
********************************/
app.listen(appEnv.port, appEnv.bind, function() {
  console.log("Node server running on " + appEnv.url);
});