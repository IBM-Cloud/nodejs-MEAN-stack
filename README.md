# MEAN Boilerplate Overview

<img src="https://dl.dropboxusercontent.com/s/vd367cadrk97zjg/MEAN%20Logo.jpg">

This is a basic boilerplate for the MEAN stack (MongoDB, Express, AngularJS and Node.js) on IBM Bluemix. The app features basic user account creation and sessions.

This application uses the [MongoDB experimental service](https://www.ng.bluemix.net/docs/#services/MongoDB/index.html#MongoDB) and [Node.js runtime](https://www.ng.bluemix.net/docs/starters/nodejs/index.html) on Bluemix.

#### Important Node.js Modules
- [Mongoose](https://github.com/Automattic/mongoose) for MongoDB interactions.
- [PassportJS](http://passportjs.org) for authentication, with over 300 authentication strategies to pick from.

## Local Development Requirements
- [Node.js & NPM](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.org)
- [Cloud Foundry Command Line Tool](https://docs.cloudfoundry.org/devguide/installcf/)

## Getting Started
##### Local Application Development
1. Clone or download this repo onto your machine.
2. Install [local development requirements](#local-development-requirements) if not done so already.
3. Open application directory in your terminal and run `npm install`
4. Rename `.env.example` file to `.env`.  Edit the contents as needed, at a minimum adding your own SESSION_SECRET.
5. Start up your local MongoDB server (typically just `mongod`, see docs [here](https://docs.mongodb.org/getting-started/shell/installation/))
6. Run `node server.js` to start your app
7. Open a browser to the link provided in the terminal prompt to view your app

##### Deploy to Bluemix

Option 1 (launch this app directly from this repo):

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM-Bluemix/MEAN-Stack)

Option 2 (deploy from your local machine):

1. Open a terminal prompt to the directory of your application.
2. If you don't have a Bluemix account, [create a free one here](https://console.ng.bluemix.net/registration/).
3. Set your Cloud Foundry CLI tool's API endpoint to Bluemix: `cf api https://api.ng.bluemix.net `
4. Login to Bluemix via the command line: `cf login`
5. Create the MongoDB service on Bluemix: `cf create-service mongodb 100 mean-mongo`
6. Push your app to bluemix with `cf push`

#### Problems or Questions?
Find us on [Stack Overflow](https://stackoverflow.com/questions/tagged/bluemix) and tag your question with 'bluemix'.

## Application
- **MongoDB** stores user account information and persists sessions (so that a server crash does not log out all users.)
- **Express** functions Node.js middleware to handle all HTTP requests and routing.
- **Angular** handles HTML templating and data manipulation.
- **Node.js** is the runtime for the application.

There is also generous commenting throughout the application which helps explain critical parts of the application.

## Contribute
Please create a pull request with your desired changes.

## Troubleshooting
The primary source of debugging information for your Bluemix app is the logs. To see them, run the following command using the Cloud Foundry CLI:

  ```
  $ cf logs <application-name> --recent
  ```

If you are not sure what your application name is, use this command to print your application name(s):

  ```
  $ cf apps
  ```

For more detailed information on troubleshooting your application, see the [Troubleshooting section](https://www.ng.bluemix.net/docs/troubleshoot/tr.html) in the Bluemix documentation.

## Privacy Notice
<If you are using the deployment tracker, you must include a privacy notice to let the user know that we are collecting deployment data.>

The 'AppName' sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/cloudant-labs/deployment-tracker) service on each deployment:

* Application Name (application_name)
* Space ID (space_id)
* Application Version (application_version)
* Application URIs (application_uris)

This data is collected from the VCAP_APPLICATION environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

#### Remove Deployment Tracker
To remove [Deployment Tracker](https://github.com/cloudant-labs/deployment-tracker) from your application, comment out or delete the final line of the `server.js` file.

## License
See LICENSE.MD for license information.
