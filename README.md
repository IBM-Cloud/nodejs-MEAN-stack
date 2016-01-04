<img src="https://dl.dropboxusercontent.com/s/vd367cadrk97zjg/MEAN%20Logo.jpg">

This is a simple boilerplate for the MEAN stack (MongoDB, Express, AngularJS and Node.js) for IBM Bluemix.

### Getting Started

##### Local Development
1. Install local development requirements (listed below) if not done so.
2. Open application directory in terminal and run `npm install`
3. Ensure your local MongoDB settings are correct in `server/config.js`, then start up your local instance (typically just `mongod`, see docs [here](https://docs.mongodb.org/getting-started/shell/installation/))
4. Use `npm run dev` to start your app
5. Open a browser to the link provided in the terminal prompt to view your app

##### Upload to Bluemix
[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM-Bluemix/MEAN-Boilerplate)

1. Click 'Deploy to Bluemix' Button. Follow prompts to create application.
2. While signed into Bluemix, click on 'Dashboard' in the top menu and then the application you just created
3. Click on 'Add Service or API' and then the 'MongoDB by Compose' service.
4. You will need to add your Compose.io credentials since this is not a hosted service ([instructions](https://www.ng.bluemix.net/docs/services/MongoDBByCompose/index.html)).
5. Follow the prompts to add the service and re-stage your application.
6. Your MEAN application is now running in the cloud!

Problems or Questions? Find us on [Stack Overflow](https://stackoverflow.com/questions/tagged/bluemix) and tag your question with 'bluemix'.

### Modules
- [Mongoose](https://github.com/Automattic/mongoose) for MongoDB functions
- [PassportJS](http://passportjs.org) for authentication, with over 300 authentication strategies to pick from.

### Local Development Requirements
- [Node.js & NPM](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.org)
- [Gulp](http://gulpjs.com/) `npm install gulp -g`
- [BrowserSync](http://www.browsersync.io) `npm install -g browser-sync`
- [Cloud Foundry Command Line Tool](https://docs.cloudfoundry.org/devguide/installcf/)

### To Be Documented
- Application Structure (similar to https://github.com/sahat/hackathon-starter#project-structure)

### Twitter API
<img src="https://g.twimg.com/Twitter_logo_blue.png" width="100">

As an example of how to integrate an external API for authentication, the Twitter API has been integrated into this boilerplate. To use this API, follow these steps to complete setup:
 
1. (Insert instructions here)

### Problems or Questions?
Find us on [Stack Overflow](https://stackoverflow.com/questions/tagged/bluemix) and tag your question with 'bluemix'.