/* jshint esversion:6 */

const mongoose = require('mongoose');


const setlistSchema = mongoose.Schema({
	tracks: [{
		setPosition: Number,
		trackName: String,
		timeSignature: Number,
		bpm: Number,
		key: String,
		valence: {type: Number, min: 0, max: 1},
		danceability: {type: Number, min: 0, max: 1},
		acousticness: {type: Number, min: 0, max: 1},
		energy: {type: Number, min: 0, max: 1}
	}]
});

// virtual method to output data to be displayed
setlistSchema.virtual('displayStringData').get(function() {
	return `${this.setPosition} || ${this.trackName} || ${this.bpm} || ${this.key} || ${this.timeSignature}`;
});

setlistSchema.methods.apiRepr = function() {
	return {
		tracks: [{
			setPosition: this.setPosition,
			trackName: this.trackName,
			timeSignature: this.timeSignature,
			bpm: this.bpm,
			key: this.key,
			valence: this.valence,
			danceability: this.danceability,
			acousticness: this.acousticness,
			energy: this.energy
		}]
	};
};

const Song = mongoose.model('Setlist', songSchema);
const Setlist = mongoose.model('Setlist', setlistSchema);

module.exports = {Setlist};