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
		}]
	};
};

const Setlist = mongoose.model('Setlist', setlistSchema);

module.exports = {Setlist};