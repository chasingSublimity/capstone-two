/* jshint esversion: 6 */
/* jshint expr: true */

// imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

// const {SetList} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('Setlist Generator', function() {

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
					res.tracks.should.be.an.array;
					done();
				});
		});
	});
});