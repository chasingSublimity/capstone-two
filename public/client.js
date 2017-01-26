// functions to set state with API data

// render functions

// render track data
function renderTrack(song) {
	var trackString = (
		'<div>' +
			'<input type="image" src="red-x.jpg" alt="delete button" name="delete-button" class="delete-button">' +
			'<p class="track">' + '<strong>' + song.title + ' - ' + song.key + ' - ' + song.bpm + '</strong></p>' + 
		'</div>'
	);
	$('.tracks').append(trackString);
}

// event listeners
function watchAddTrack() {
	$('form').on('submit', function(event) {
		event.preventDefault();
		console.log($(this).find('#song-title').val());
		var form = $(this);

		var song = {
			title: form.find('#title').val(),
			key: form.find('#key').val(),
			bpm: form.find('#tempo').val()
		};

		console.log(song);
		// render data on page
		renderTrack(song);
		// send data to DB
	});
}

function watchUpdateTrack() {
	// use .on()

}

function watchDeleteTrack() {
	// use .on()
	$(document).on('click', '.delete-button', function(event) {
		$(this).parent('div').remove();
	});
}

$(function() {
	watchAddTrack();
	watchUpdateTrack();
	watchDeleteTrack();
});