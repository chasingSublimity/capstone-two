// functions to set state with API data


// GET existing setlist from DB

// save setlist to DB


// get track data from form submission

// add track to UI
function addTrack() {
	data = prompt('Enter New Song');
	var trackTemplate = (
		'<p class="track"><strong>' + data + '</strong></p>'
	);
	$('.tracks').append(trackTemplate);
}

// delete track from DB

// event listeners
function watchAddTrack() {
	$('.add-track').click( 
		addTrack()
	);
}

function watchUpdateTrack() {

}

function watchDeleteTrack() {

}

$(function() {
	// watchAddTrack();
	watchUpdateTrack();
	watchDeleteTrack();
});