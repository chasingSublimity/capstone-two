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
app.post('/setlist', (req, res) => {
  // create track based on data from client and send back confirmation
  console.log(req.body);
  Setlist
    .create({
      tracks: req.body.tracks
    })
    .then(setlist => {
      res.status(201).json(setlist);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// Put
app.put('/setlist/:id', (req, res) => {
  // check that the req path id and the id in body are the same
  if ((req.params.id !== req.body._id)) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body._id}) must match.`;
    console.error(message);
    res.status(400).json({message: message});
  }
  const updateData = {tracks:req.body.tracks};
  Setlist
    .findByIdAndUpdate(req.params.id, {$set: updateData})
    .exec()
    .then(setlist => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
  });
});

// Delete
app.delete('/setlist/:id', (req, res) => {
  Setlist
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


// catch-all 404
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

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