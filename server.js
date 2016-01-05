'use strict';


/********************************
Dependencies
********************************/
var express = require('express'),// server middleware
	mongoose = require('mongoose'),// MongoDB connection library
	bodyParser = require('body-parser'),// parse HTTP requests
	passport = require('passport'),// Authentication framework
    expressValidator = require('express-validator'), // validation tool for processing user input

	cfenv = require('cfenv'),// Cloud Foundry Environment Variables
	    appEnv = cfenv.getAppEnv(),// Grab environment variables

	config = require('./server/config'); // Your secret variables from config.js


/********************************
Express Settings
********************************/
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator()); // must go directly after bodyParser
app.use(express.static(__dirname + '/public'));


/********************************
 Database
 ********************************/

// Detects local environment and connects to appropriate DB
if(appEnv.isLocal == true){
	mongoose.connect(config.mongoDB.local);
		console.log('Your MongoDB is running at ' + config.mongoDB.local);
}
else if(appEnv.isLocal != true) {
	mongoose.connect(config.mongoDB.production);
		console.log('Your MongoDB is running at ' + config.mongoDB.production);
}
else{
	console.log('Unable to connect to MongoDB. Check to ensure valid connection information in server/config.js');
}

// Account login
app.post('/account/login', function(req,res){

    // Validation prior to checking DB. Many validation/sanitize options here: https://github.com/ctavan/express-validator
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    var errors = req.validationErrors(); // returns an object with results of validation check
    if (errors) {
        console.log(errors);
        res.sendStatus(401);
        return;
    }

    // TODO check monogoDB for credentials
    // TODO Return results (success or failure)

});

var accountSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true},
    twitter: String,
    tokens: Array
});

var User = mongoose.model('User', accountSchema);


// Account/User creation
app.post('/account/create', function(req,res){

    // Input validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required and must be in a valid form').notEmpty().isEmail();

    var errors = req.validationErrors(); // returns an object with results of validation check
    if (errors) {
        res.status(400).send(errors);
        return;
    }

    var user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name
    });

    // Check if user already exists, else store new user if unique
    User.findOne({ username: req.body.username }, function(err, existingUser) {
        if (existingUser) {
            return res.status(400).send('That username already exists. Please try a different username.');
        }
        user.save(function(err) {
            if (err) {
                return next(err);
            }
            res.status(200).send('Account created! Please login with your new account.');
        });
    });

});


/********************************
Routing
********************************/
app.get('/', function (req, res){
   res.sendfile('index.html');
});


/********************************
Ports
********************************/
app.listen(appEnv.port, appEnv.bind, function() {
  console.log("Node server running on " + appEnv.url);
});

// Make URL available to Gulp during development
module.exports = appEnv;
