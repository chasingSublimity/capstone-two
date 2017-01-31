/* jshint esversion: 6 */
/* jshint expr: true */

// imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const {Setlist} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// server config function
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


// Generates a random musical key for seed function
function randomKeyGen() {
  var keys = "ABCDEFGabcdefg";
  var modality = "#b♮";
  return (keys.charAt(Math.floor(Math.random() * keys.length)) + 
  	modality.charAt(Math.floor(Math.random() * modality.length)));
}

// generates random track data
function generateSetlistData() {
	const setlistData = {tracks: []};
	for (let i = 1; i <= 7; i++) {
		setlistData.tracks.push({
			setPosition: Math.floor(Math.random() * (7 - 1 + 1)) + 1,
			trackName: faker.name.firstName(),
			timeSignature: Math.floor(Math.random() * (16 - 1 + 1)) + 1,
			bpm: Math.floor(Math.random() * (350 - 1 + 1)) + 1,
			key: randomKeyGen(),
		});
	}
	return setlistData;
}


// seeds DB with fake data
function seedTrackData() {
	console.info('seeding track data');
	const seedData = generateSetlistData();
	return Setlist.create(seedData);
}

// tests
describe('Setlist Generator', function() {

	// hooks
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedTrackData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('GET root endpoint', function() {
		it('should return 200 status code and HTML file', function() {
			return chai.request(app)
				.get('/')
				.then(function(res) {
					res.should.have.status(200);
					res.should.contain.html;
				});
		});
	});

	describe('GET requests to /setlist', function() {
		it('should return a json object with an array of strings representing track information', function() {
			return chai.request(app)
				.get('/setlist')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.tracks.should.be.an.array;
					res.body.tracks.should.have.length.of.at.least(1);
					res.body.tracks[0].should.contain.all.keys(['setPosition', 'trackName', '_id']);
					res.body.tracks.should.contain.instanceof(Object);
					res.body.tracks[0].trackName.should.be.a.string;
					res.body.tracks[0].key.should.be.a.string;
					res.body.tracks[0].setPosition.should.be.a.number;
					res.body.tracks[0]._id.should.be.a.number;
					res.body.tracks[0].bpm.should.be.a.number;
					res.body.tracks[0].timeSignature.should.be.a.number;
					res.body.tracks[0].bpm.should.be.above(0).and.below(351);
					res.body.tracks[0].timeSignature.should.be.above(0).and.below(17);
				});
		});
	});

	describe('POST requests to /setlist', function() {
		it('should create a new setlist', function() {
			const newSetlist = generateSetlistData();
			return chai.request(app)
				.post('/setlist')
				.send(newSetlist)
				.then(function(res) {
					// ensure that object created matches seed data
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.an('object');
					res.body.should.include.keys('tracks');
					res.body._id.should.not.be.null,
					res.body.tracks[0].should.include.keys('setPosition', 'trackName', 'key', 'bpm', 'timeSignature');
					res.body.tracks[0].setPosition.should.equal(newSetlist.tracks[0].setPosition);
					res.body.tracks[0].trackName.should.equal(newSetlist.tracks[0].trackName);
					res.body.tracks[0].key.should.equal(newSetlist.tracks[0].key);
					res.body.tracks[0].bpm.should.equal(newSetlist.tracks[0].bpm);
					res.body.tracks[0].timeSignature.should.equal(newSetlist.tracks[0].timeSignature);
					return Setlist.findById(res.body._id);
				})
				.then(function(setlist) {
					// make sure that object in DB matches seed data
					setlist.tracks[0].setPosition.should.equal(newSetlist.tracks[0].setPosition);
					setlist.tracks[0].trackName.should.equal(newSetlist.tracks[0].trackName);
					setlist.tracks[0].key.should.equal(newSetlist.tracks[0].key);
					setlist.tracks[0].bpm.should.equal(newSetlist.tracks[0].bpm);
					setlist.tracks[0].timeSignature.should.equal(newSetlist.tracks[0].timeSignature);
				});
		});
	});

	describe('PUT requests to /setlist/:id', function() {
		it('should update the data of a specified setlist', function() {
			// dummy data
			const updateData = {
				tracks: [
					{
			      "setPosition": 1,
			      "trackName": "Green",
			      "timeSignature": 4,
			      "bpm": 145,
			      "key": "G"
			    },
			    {
			      "setPosition": 2,
			      "trackName": "Blue",
			      "timeSignature": 3,
			      "bpm": 158,
			      "key": "F#m"
			    },
			    {
			      "setPosition": 3,
			      "trackName": "Yellow",
			      "timeSignature": 2,
			      "bpm": 110,
			      "key": "Ab"
			    },
			    {
			      "setPosition": 4,
			      "trackName": "Purple",
			      "timeSignature": 6,
			      "bpm": 175,
			      "key": "E"
			    },
			    {
			      "setPosition": 5,
			      "trackName": "Pink",
			      "timeSignature": 6,
			      "bpm": 195,
			      "key": "E"
			    }
				]
			};
			Setlist
				.findOne()
				.then(setlist => {
					// add id to update data
					updateData.id = setlist.id;
					// make request and inspect for data consistency
					return chai.request(app)
						.put(`/setlist/${setlist.id}`)
						.send(updateData);
				})
				.then(res => {
					res.should.have.status(204);
					return Setlist.findById(updateData.id);
				})
				.then(setlist => {
					setlist.tracks.should.equal(updateData.tracks);
				});
		});
	});

	describe('DELETE requests to /setlist/:id', function() {
		it('should delete the specified setlist', function() {
			// declare variable here so that it is accessible in all of the functions below
			let setlist;
			return Setlist
				.findOne()
				.exec()
				.then(function(_setlist) {
					setlist = _setlist;
					return chai.request(app).delete(`/setlist/${setlist.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return Setlist.findById(setlist.id);
				})
				.then(function(_setlist){
					should.not.exist(_setlist);
				});
		});
	});

});

