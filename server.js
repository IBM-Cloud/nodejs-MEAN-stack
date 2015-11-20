'use strict';

/********************************
Dependencies
********************************/
var express = require('express'),// server middleware
	mongoose = require('mongoose'),// MongoDB connection library
	bodyParser = require('body-parser'),// parse HTTP requests
	cfenv = require('cfenv');// Cloud Foundry Environment Variables

/********************************
Express Settings
********************************/
var app = express();
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

/********************************
Routing
********************************/
app.get('/', function (req, res){
   res.sendfile('index.html'); 
});

/********************************
Ports
********************************/
var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, appEnv.bind, function() {
  console.log("Server starting on " + appEnv.url);
});
