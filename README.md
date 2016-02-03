<img src="https://dl.dropboxusercontent.com/s/vd367cadrk97zjg/MEAN%20Logo.jpg">

This is a simple boilerplate for the MEAN stack (MongoDB, Express, AngularJS and Node.js) for IBM Bluemix.

### Getting Started

##### Local Development
1. Install [local development requirements](#local-development-requirements) as needed.
2. Open application directory in your terminal and run `npm install`
3. Create an environment variables file called `.env` (use `.env.example` as a guide) with your credentials. See comment in `.env.example` for what each credential is for.
3. Start up your local MongoDB server (typically just `mongod`, see docs [here](https://docs.mongodb.org/getting-started/shell/installation/))
4. Run `node server.js` to start your app
5. Open a browser to the link provided in the terminal prompt to view your app

##### Deploy to Bluemix

Option 1 (launch this app directly from this repo):

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM-Bluemix/MEAN-Boilerplate)

Option 2 (deploy from your local machine):

1. Open a terminal prompt to the directory of your application.
2. Set your Cloud Foundry CLI tool's API endpoint to Bluemix: `cf api https://api.ng.bluemix.net `
3. If you don't have a Bluemix account, [create a free one here](https://console.ng.bluemix.net/registration/).
4. Login to Bluemix via the command line: `cf login`
5. Create the MongoDB service on Bluemix: `cf create-service mongodb 100 mean-mongo`
5. Push your app to bluemix with `cf push`

Your MEAN application is now running in the cloud!

[Problems or Questions?](#problems-or-questions?) Find us on [Stack Overflow](https://stackoverflow.com/questions/tagged/bluemix) and tag your question with 'bluemix'.

### Modules
- [Mongoose](https://github.com/Automattic/mongoose) for MongoDB functions
- [PassportJS](http://passportjs.org) for authentication, with over 300 authentication strategies to pick from.

### Local Development Requirements
- [Node.js & NPM](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.org)
- [Cloud Foundry Command Line Tool](https://docs.cloudfoundry.org/devguide/installcf/)

### Problems or Questions?
Find us on [Stack Overflow](https://stackoverflow.com/questions/tagged/bluemix) and tag your question with 'bluemix'.
