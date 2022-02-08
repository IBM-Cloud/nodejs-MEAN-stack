'use strict';

/********************************
 Dependencies
 ********************************/
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

/********************************
 Create User Account Schema
 ********************************/
var accountSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true},
    tokens: Array
});

// Used by Passport middleware to validate password against what is stored in DB
accountSchema.methods.validatePassword = function(password, hash) {
    return bcrypt.compareSync(password, hash); // boolean return
};

module.exports = mongoose.model('User', accountSchema);