/* jshint esversion: 6 */
/* jshint expr: true */

// imports
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

// const {SetList} = require('../models');
const {app} = require('../server');
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
});