/* jshint esversion:6 */

const mongoose = require('mongoose');

const setlistSchema = mongoose.Schema({
	tracks: [{
		trackName: String,
		bpm: Number,
		key: String
	}]
});

const Setlist = mongoose.model('Setlist', setlistSchema);

module.exports = {Setlist};