// See LICENSE.MD for license information.

'use strict';

/********************************
 Dependencies
 ********************************/
// server middleware
const express = require('express');

// Authentication framework
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// MongoDB connection library
const mongoose = require('mongoose');
const User = require('./models/user.model');

/********************************
 Load environment
 ********************************/
// const appEnv = require('cfenv').getAppEnv();
// if (appEnv.isLocal) {
  require('dotenv').config();// Loads .env file into environment
// }

/********************************
 MongoDB Connection
 ********************************/
async function initializeDatabase() {
  //Detects environment and connects to appropriate DB
  var caCertificateBase64, mongoDbUrl;

//   if (appEnv.isLocal) {
    caCertificateBase64 = process.env.CERTIFICATE_BASE64;
    mongoDbUrl = process.env.MONGODB_URL;
//   }
//   // Connect to MongoDB Service on IBM Cloud
//   else if (!appEnv.isLocal) {
//     var mongoDbCredentials = appEnv.services["databases-for-mongodb"][0].credentials.connection.mongodb;
//     caCertificateBase64 = mongoDbCredentials.certificate.certificate_base64
//     mongoDbUrl = mongoDbCredentials.composed[0];
//   }
//   else {
//     console.log('No configuration found to connect to MongoDB.');
//     System.exit(1);
//   }

  function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
      function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      });
    }
  mongoDbUrl = unicodeToChar(mongoDbUrl);
  console.log(`Connecting to database located at ${mongoDbUrl}...`);

  // write down the certificate so that it can be used by MongoDB client
  require('fs').writeFileSync('__temp__ca.pem', Buffer.from(caCertificateBase64, 'base64'));

  var mongoDbOptions = {
    useNewUrlParser: true,
    ssl: true,
    sslValidate: true,
    sslCA: '__temp__ca.pem',
    useUnifiedTopology: true
  };

  try {
    await mongoose.connect(mongoDbUrl, mongoDbOptions);
    console.log("Connected to database.");
  } catch (err) {
    console.error("Could not connect", err);
  }
}

/********************************
 Passport Middleware Configuration
 ********************************/
function configurePassport() {
  console.log("Configuring passport authentication...");
  // configure passport
  passport.use(new LocalStrategy(
    function (username, password, done) {
      console.log(`Finding user with login ${username}`);
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        // validatePassword method defined in user.model.js
        if (!user.validatePassword(password, user.password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        console.log('User found!', user);
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

/********************************
 Express Settings
 ********************************/
function configureApp() {
  console.log("Setting up app middleware...");
  const bodyParser = require('body-parser'); // parse HTTP requests
  const cookieParser = require('cookie-parser');
  const session = require('express-session');
  const MongoStore = require('connect-mongo'); // store sessions in MongoDB for persistence

  const app = express();
  app.enable('trust proxy');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
//   app.use(session({
//     secret: process.env.SESSION_SECRET || 'this_is_a_default_session_secret_in_case_one_is_not_defined',
//     resave: true,
//     store: new MongoStore({ client: mongoose.connection.getClient() }),
//     saveUninitialized: false,
//     cookie: { secure: !appEnv.isLocal }
//   }));
  app.use(session({
   secret: process.env.SESSION_SECRET || 'this_is_a_default_session_secret_in_case_one_is_not_defined',
   resave: true,
   store: new MongoStore({ client: mongoose.connection.getClient() }),
   saveUninitialized: false,
   cookie: { secure: false }
 }));
  app.use(passport.initialize());
  app.use(passport.session());

  return app;
}

/********************************
 Routing
 ********************************/
function setupRoutes(app) {
  console.log("Setting up app routes...");
  // validation tool for processing user input
  const  expressValidator = require('express-validator');
  const bcrypt = require('bcrypt');

  // html, css, js
  app.use(express.static(__dirname + '/public'));

  // Account login
  app.post('/account/login',
    // Validation prior to checking DB. Front end validation exists, but this functions as a fail-safe
    expressValidator.body('username', 'Username is required').notEmpty(),
    expressValidator.body('password', 'Password is required').notEmpty(),
    function (req, res) {
      var errors = expressValidator.validationResult(req); // returns an object with results of validation check
      if (errors.length > 0) {
        res.status(401).send('Username or password was left empty. Please complete both fields and re-submit.');
        return;
      }

      // Create session if username exists and password is correct
      passport.authenticate('local', function (err, user) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).send('User not found. Please check your entry and try again.'); }
        req.login(user, function (err) { // creates session
          if (err) { return res.status(500).send('Error saving session.'); }
          var userInfo = {
            username: user.username,
            name: user.name,
            email: user.email
          };
          return res.json(userInfo);
        });
      })(req, res);
    });

  // Account creation
  app.post('/account/create',
    // 1. Input validation. Front end validation exists, but this functions as a fail-safe
    expressValidator.body('username', 'Username is required').notEmpty(),
    expressValidator.body('password', 'Password is required').notEmpty(),
    expressValidator.body('name', 'Name is required').notEmpty(),
    expressValidator.body('email', 'Email is required and must be in a valid form').notEmpty().isEmail(),
    function (req, res) {
      var errors = expressValidator.validationResult(req); // returns an array with results of validation check
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      // 2. Hash user's password for safe-keeping in DB
      const salt = bcrypt.genSaltSync(10),
        hash = bcrypt.hashSync(req.body.password, salt);

      // 3. Create new object that store's new user data
      var user = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        name: req.body.name
      });

      // 4. Store the data in MongoDB
      User.findOne({ username: req.body.username }, function (err, existingUser) {
        if (existingUser) {
          return res.status(400).send('That username already exists. Please try a different username.');
        }
        user.save(function (err) {
          if (err) {
            console.log(err);
            res.status(500).send('Error saving new account (database error). Please try again.');
            return;
          }
          res.status(200).send('Account created! Please login with your new account.');
        });
      });

    });

  //Account deletion
  app.post('/account/delete', authorizeRequest, function (req, res) {
    User.deleteOne({ username: req.body.username }, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting account.');
        return;
      }
      req.session.destroy(function (err) {
        if (err) {
          res.status(500).send('Error deleting account.');
          console.log("Error deleting session: " + err);
          return;
        }
        res.status(200).send('Account successfully deleted.');
      });
    });
  });

  // Account update
  app.post('/account/update',
    authorizeRequest, 
    // 1. Input validation. Front end validation exists, but this functions as a fail-safe
    expressValidator.body('username', 'Username is required').notEmpty(),
    expressValidator.body('password', 'Password is required').notEmpty(),
    expressValidator.body('name', 'Name is required').notEmpty(),
    expressValidator.body('email', 'Email is required and must be in a valid form').notEmpty().isEmail(),
    function (req, res) {

      var errors = expressValidator.validationResult(req); // returns an array with results of validation check
      if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // 2. Hash user's password for safe-keeping in DB
    var salt = bcrypt.genSaltSync(10),
      hash = bcrypt.hashSync(req.body.password, salt);

    // 3. Store updated data in MongoDB
    User.findOne({ username: req.body.username }, function (err, user) {
      if (err) {
        console.log(err);
        return res.status(400).send('Error updating account.');
      }
      user.username = req.body.username;
      user.password = hash;
      user.email = req.body.email;
      user.name = req.body.name;
      user.save(function (err) {
        if (err) {
          console.log(err);
          res.status(500).send('Error updating account.');
          return;
        }
        res.status(200).send('Account updated.');
      });
    });
  });

  // // Account logout
  app.get('/account/logout', function (req, res) {
    // Destroys user's session
    if (!req.user)
      res.status(400).send('User not logged in.');
    else {
      req.session.destroy(function (err) {
        if (err) {
          res.status(500).send('Sorry. Server error in logout process.');
          console.log("Error destroying session: " + err);
          return;
        }
        res.status(200).send('Success logging user out!');
      });
    }
  });

  // Custom middleware to check if user is logged-in
  function authorizeRequest(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.status(401).send('Unauthorized. Please login.');
    }
  }

  // Protected route requiring authorization to access.
  app.get('/protected', authorizeRequest, function (req, res) {
    res.send("This is a protected route only visible to authenticated users.");
  });
}

/********************************
 Ports
 ********************************/
function startApp(app) {
  app.listen(process.env.PORT, process.env.BIND, function () {
    console.log(`Application running at http://localhost:${process.env.PORT}`);
  });
}

async function main() {
  await initializeDatabase();
  configurePassport();
  const app = configureApp();
  setupRoutes(app);
  startApp(app);
}

main();