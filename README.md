# MEAN Boilerplate for IBM Bluemix
Simple boilerplate for the MEAN stack (MongoDB, Express, AngularJS and Node.js) on IBM Bluemix. This boilerplate is meant to be the right balance between getting started quick yet flexible enough to be customized to your liking.

### Getting Started

##### Deploy to Bluemix in One Click
[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM-Bluemix/MEAN-Boilerplate)

##### Local Development
1. Install local development requirements (listed below) if not already installed.
2. Open application directory in terminal and run `npm install`
3. Start up your local instance of MongoDB
4. Run `node server.js` to start up your app
5. Open a browser to the link provided in the terminal prompt to view your app

##### Upload to Bluemix
1. Set API endpoint to Bluemix `cf api https://api.ng.bluemix.net`
2. Sign-in to Bluemix `cf login`
3. Add mongo service

### Local Development Requirements
- [Node.js & NPM](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.org)
- [Gulp](http://gulpjs.com/) `npm install gulp -g`
- [Cloud Foundry Command Line Tool](https://docs.cloudfoundry.org/devguide/installcf/)

### Coming Soon
- Deploy to Bluemix BTN
- Deploy to Bluemix instructions (manually)
- Application Structure (similar to https://github.com/sahat/hackathon-starter#project-structure)

### Features
- Homepage with link to documentation (probably readme)
- Github user integration
- Create user in MongoDB instance
- Login to site
- Protected page

### Issues?
File an [issue](https://github.com/IBM-Bluemix/MEAN-Boilerplate/issues).


Example = https://github.com/sahat/hackathon-starter