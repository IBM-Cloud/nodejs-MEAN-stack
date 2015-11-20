'use strict';

/********************************
Dependencies
********************************/
var express = require('express'),
	mongoose = require('mongoose'),
	cfenv = require('cfenv');

var app = express();

/********************************
Routing
********************************/
app.use(express.static(__dirname + '/public'));



/********************************
Ports
********************************/
var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, appEnv.bind, function() {
  console.log("Server starting on " + appEnv.url);
});
