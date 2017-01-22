var MOCK_SETLIST = {
	setlistStyle: "Dancer",
	setLength: 5,
	tracks: [
		{
			setPosition: 1,
			trackName: "Mary had a little lamb",
			timeSignature: 4,
			bpm: 100,
			key: "G",
			valence: 0.5,
			danceability: 0.02,
			acousticness: 0.7,
			energy: 0
		},
		{
			setPosition: 2,
			trackName: "Jingle Bells",
			timeSignature: 4,
			bpm: 115,
			key: "G",
			valence: 0.75,
			danceability: 0.32,
			acousticness: 0.0,
			energy: 0.6
		},
		{
			setPosition: 3,
			trackName: "Sing, Sing, Sing",
			timeSignature: 4,
			bpm: 130,
			key: "F#",
			valence: 0.86,
			danceability: 0.99,
			acousticness: 0.0,
			energy: 0.85
		},
		{
			setPosition: 4,
			trackName: "Cute without the E -- Acoustic",
			timeSignature: 4,
			bpm: 100,
			key: "A",
			valence: 0.21,
			danceability: 0.1,
			acousticness: 0.86,
			energy: 0.3
		},
		{
			setPosition: 5,
			trackName: "Skinny Love",
			timeSignature: 4,
			bpm: 100,
			key: "G",
			valence: 0.001,
			danceability: 0.02,
			acousticness: 0.97,
			energy: 0.4
		}
	]
};

function getSetlist(callbackFn) {
	setTimeout(function() {
		callbackFn(MOCK_SETLIST);
	});
}

function displaySetlist(data) {
	data.tracks.forEach(
		function(track) {
			$('body').append(
				'<p>' + track.trackName + '<p>'
			);
		}
	);
}

function getAndDisplaySetlist() {
	getSetlist(displaySetlist);
}

$(function() {
	getAndDisplaySetlist();
});