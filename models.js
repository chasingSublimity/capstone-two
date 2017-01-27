/* jshint esversion:6 */

const mongoose = require('mongoose');


const setlistSchema = mongoose.Schema({
	tracks: [{
		setPosition: Number,
		trackName: String,
		timeSignature: Number,
		bpm: Number,
		key: String,
	}]
});

// virtual method to output data to be displayed
setlistSchema.virtual('displayStringData').get(function() {
	return this.tracks.map(track => `${track.trackName} || ${track.bpm} || ${track.key} || ${track.timeSignature}`);
});

setlistSchema.methods.apiRepr = function() {
	return this.displayStringData;
};

const Setlist = mongoose.model('Setlist', setlistSchema);

module.exports = {Setlist};