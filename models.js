/* jshint esversion:6 */

const mongoose = require('mongoose');


const trackSchema = mongoose.Schema({
	setPosition: Number,
	trackName: String,
	timeSignature: Number,
	bpm: Number,
	key: String,
});

const setlistSchema = mongoose.Schema({
	tracks: [{
		setPosition: Number,
		trackName: String,
		timeSignature: Number,
		bpm: Number,
		key: String,
	}]
});

setlistSchema.methods.apiRepr = function() {
	return {
		tracks: this.tracks
	};
};

const Setlist = mongoose.model('Setlist', setlistSchema);

module.exports = {Setlist};