/* jshint esversion:6 */

const mongoose = require('mongoose');

const setlistSchema = mongoose.Schema({
	setPosition: Number,
	trackName: String,
	timeSignature: Number,
	bpm: Number,
	key: String,
	valence: {Number, min: 0, max: 1},
	danceability: {Number, min: 0, max: 1},
	acousticness: {Number, min: 0, max: 1},
	energy: {Number, min: 0, max: 1}
});

// virtual method to output data to be displayed
setlistSchema.virtual('displayStringData').get(function() {
	return `${this.setPosition} || ${this.trackName} || ${this.bpm} || ${this.key} || ${this.timeSignature}`;
});

setlistSchema.methods.apiRepr = function() {
	return {
		setPosition: this.setPosition,
		trackName: this.trackName,
		timeSignature: this.timeSignature,
		bpm: this.bpm,
		key: this.key,
		valence: this.valence,
		danceability: this.danceability,
		acousticness: this.acousticness,
		energy: this.energy
	};
};

const Setlist = mongoose.model('Setlist', setlistSchema);

module.exports = {Setlist};