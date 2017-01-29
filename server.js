/* jshint esversion: 6 */

// dependencies
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// imports
const {DATABASE_URL, PORT} = require('./config');
const {Setlist} = require('./models');


const app = express();
mongoose.Promise = global.Promise;


// middleware
app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

// GET
app.get('/setlist', (req, res) => {
  // send back setlist
  Setlist
    .findOne()
    .exec()
    .then(setlist => {
      res.status(200);
      res.json(setlist);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    });
});


// Post
app.get('/setlist', (req, res) => {
  // create track based on data from client
});

// Delete

// Delete


// server scripts
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      } else {
        console.log(`Connected to ${databaseUrl}`);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. Used in tests.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {runServer, app, closeServer};