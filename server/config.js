/********************************
 Configuration Settings
 ********************************/

var cfenv = require('cfenv'),// Cloud Foundry Environment Variables
    appEnv = cfenv.getAppEnv(),// Grab environment variables
    completeURL = undefined;
    productionDBname = 'mongo-boilerplate';

    // Bluemix settings for a Compose.io MongoDB service. Change as needed.
    if(appEnv.isLocal != true){
        var appURI = appEnv.services['user-provided'][0]['credentials']['uri'],
            appPort = appEnv.services['user-provided'][0]['credentials']['port'],
            appUser = appEnv.services['user-provided'][0]['credentials']['user'],
            appPassword = appEnv.services['user-provided'][0]['credentials']['password'];
            completeURL = 'mongodb://' + appUser + ':' + appPassword + '@' + appURI + ':' + appPort + '/' + productionDBname;
    }

module.exports = {
    mongoDB: {
        "local" : 'mongodb://localhost:27017',
        "production" : completeURL
    }
};