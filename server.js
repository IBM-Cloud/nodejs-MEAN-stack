'use strict';


/********************************
Dependencies
********************************/
var express = require('express'),// server middleware
	mongoose = require('mongoose'),// MongoDB connection library
	bodyParser = require('body-parser'),// parse HTTP requests
	passport = require('passport'),// Authentication framework

	cfenv = require('cfenv'),// Cloud Foundry Environment Variables
	appEnv = cfenv.getAppEnv(),// Grab environment variables

	config = require('./server/config');


/********************************
Express Settings
********************************/
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
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
