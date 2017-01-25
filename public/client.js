// functions to set state with API data

// mock data to sub as API data
var state = {
	tracks: [
		{
			setPosition: 1,
			trackName: "Mary had a little lamb",
			timeSignature: 4,
			key: "G",
		},
		{
			setPosition: 2,
			trackName: "Jingle Bells",
			bpm: 115,
			key: "G",
		},
		{
			setPosition: 3,
			trackName: "Sing, Sing, Sing",
			bpm: 130,
			key: "F#m",
		},
		{
			setPosition: 4,
			trackName: "Cute without the E -- Acoustic",
			bpm: 100,
			key: "Am",

		},
		{
			setPosition: 5,
			trackName: "Skinny Love",
			bpm: 100,
			key: "G",
		}
	]
};

// functions to modify state


// orders songs by ascending trackNumbers
function sortSetlist(songA, songB) {
  return songA.setPosition - songB.setPosition;
}

// Create new setlist

// CRUD operations

// GET existing setlist from DB
function getSetlist(callbackFn) {
	setTimeout(function() {
		callbackFn(state);
	});
}

// UPDATE setlist
function updateSetList(callbackFn) {
	
}

// DELETE setlist

// functions to render state

// append html wrapped track data to modal
function stageSetlist(data) {
	var tracksHtml = data.tracks.map(
		function(track) {
			// inputs are by default hidden
			return '<p>' + '<input class="song-' + track.setPosition + '"> ' + '<b>' + track.setPosition + ') ' + track.trackName + '</b>' + ' -- ' + 
			track.bpm + ' || ' + track.key + ' || ' + track.timeSignature + '</p>';
		}
	);
	$('.modal-content').append(tracksHtml);
}

function getAndStageSetlist() {
	getSetlist(stageSetlist);
}

// fade in modal containing set info
function handleModal() {
	// fade in modal
		$('.overlay').fadeIn(1000);
	// fadeout modal if esc key is pressed
	$(document).keydown(function(e){
		if (e.keyCode === 27) {
  		$(".overlay").fadeOut(1000);
		}
  });
}


// event listeners
function watchCreateSetlist() {


}

function watchShowSetlist() {
	$('.js-show-button').click(function() {
		// conditional logic to be implemented
		// if (state.tracks.length <= 1) {
			getAndStageSetlist();
			handleModal();
		// } else {
		// 	handleModal();
		// }
	});
}

function watchUpdateSetlist(setlist) {
	// need error handling for empty state
	$('.js-update-button').click(function() {
		$('input').show();
		handleModal();
	});
	// update setOrder


	// 
	return setlist.sort(sortSetlist);

}

function watchDeleteTrack() {
	// add confirmation notice
	// function to clear state
	$('.js-delete-button').click(function() {
		state = {};
		$('.modal-content').html('');
		// function to delete document from collection
	});
}

$(function() {
	watchAddTrack();
	watchUpdateTrack(state.tracks);
	watchDeleteTrack();
});