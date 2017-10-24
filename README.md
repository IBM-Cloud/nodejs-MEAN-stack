# Modern Web Application using MEAN stack

This is a basic boilerplate for the MEAN stack ([MongoDB](https://www.mongodb.org/), [Express](http://expressjs.com/), [AngularJS](https://angularjs.org/) and [Node.js](https://nodejs.org)) on [IBM Cloud](http://bluemix.net).

This application uses the [Compose for MongoDB service](https://console.bluemix.net/catalog/services/compose-for-mongodb) and [Node.js runtime](https://www.ng.bluemix.net/docs/starters/nodejs/index.html) on IBM Cloud.

<img src="ReadME-Images/Architecture.png">

#### Features
- MVC project structure
- Create, edit and delete user accounts
- Authentication with username/password
- Protected routes that can only be accessed by authenticated users
- Bootstrap CSS framework & [Cosmo theme](https://bootswatch.com/cosmo/)
- HTTPS built-in if deployed to [IBM Cloud](#deploy-to-bluemix)
- [Mongoose](https://github.com/Automattic/mongoose) for MongoDB interactions.
- [PassportJS](http://passportjs.org) for authentication, with over 300 authentication strategies to pick from.

## Application Requirements
- [Node.js & NPM](https://nodejs.org/en/download/)
- [Compose for MongoDB database](https://console.bluemix.net/catalog/compose-for-mongodb)
- [Cloud Foundry Command Line Tool](https://docs.cloudfoundry.org/devguide/installcf/)

## Getting Started
##### Local Application Development
1. Clone or download this repo onto your machine.
2. Install [application requirements](#application-requirements) if not done so already.
3. Open application directory in your terminal and run `npm install`
4. Rename `.env.example` file to `.env`.  Edit the contents as needed, at a minimum adding your own SESSION_SECRET.
5. Start up your local MongoDB server (typically just `mongod`, see docs [here](https://docs.mongodb.org/getting-started/shell/installation/))
6. Run `node server.js` to start your app
7. Open a browser to the link provided in the terminal prompt to view your app

##### Deploy to IBM Cloud

Option 1 (launch this app directly from this repo):

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM-Bluemix/Nodejs-MEAN-Stack)

Option 2 (deploy from your local machine):

1. Clone or download this repo onto your machine.
2. Open a terminal prompt to the directory of your application.
3. If you don't have an account, [create a free one here](https://console.ng.bluemix.net/registration/).
4. Set your Cloud Foundry CLI tool's API endpoint to: `bx api https://api.ng.bluemix.net `
5. Login to your account via the command line: `bx login`
6. Target your account ORG and SPACE  `bx target -o ORG -s SPACE`
7. Create the instance of Compose for MongoDB on IBM Cloud:  `bx cf create-service compose-for-mongodb Standard mean-starter-mongodb`
8. Push your app to IBM Cloud with `bx cf push`
9. Done, the app should be looking like:<img src="ReadME-Images/live-app.png">



#### Problems or Questions?

Create a [GitHub issue](https://github.com/IBM-Bluemix/nodejs-MEAN-stack/issues/new) for questions or problems occurs using this demo. 

## Critical Files & Folders

| File                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| [**manifest.yml**](./manifest.yml) | File that defines deployment paramaters. [More info here](https://www.ng.bluemix.net/docs/manageapps/depapps.html#appmanifest)
| [**.env.example**](./.env.example) | Set custom [environment variables](https://en.wikipedia.org/wiki/Environment_variable) for your application. This is the proper way to store credentials and other sensitive values.
| [**server.js**](./server.js) | Main server file that the Node.js runtime uses. It contains all the server logic.
| [**/server**](./server) | Folder for files used by the Node.js server
| [/server/models/**user.model.js**](./server/models/user.model.js) | Model for storing users in MongoDB
| [**/public**](./public) | Folder for files delivered to users, such as html and css files
| [/public/js/**app.js**](./public/js/app.js) | Angular application for manipulating and rendering data in browser


## Application
- **MongoDB** stores user account information and persists sessions (so that a server crash does not log out all users.)
- **Express** functions Node.js middleware to handle all HTTP requests and routing.
- **Angular** handles HTML templating and data manipulation.
- **Node.js** is the runtime for the application.

There is also generous commenting throughout the application which helps explain critical parts of the application.

## Contribute
Please create a pull request with your desired changes.

## Troubleshooting
The primary source of debugging information for your app is the logs. To see them, run the following command using the Cloud Foundry CLI:

  ```
  $ bx cf logs <application-name> --recent
  ```

If you are not sure what your application name is, use this command to print your application name(s):

  ```
  $ bx cf apps
  ```

For more detailed information on troubleshooting your application, see the [Troubleshooting section](https://www.ng.bluemix.net/docs/troubleshoot/tr.html) in the documentation.

## License
See [LICENSE.MD](https://github.com/IBM-Bluemix/Nodejs-MEAN-Stack/blob/master/LICENSE.md) for license information.
