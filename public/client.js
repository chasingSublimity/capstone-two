// functions to set state with API data

// render functions

// render track data
function renderTrack(song) {
	var trackString = (
		'<div class="track-item-container">' +
			'<input type="image" src="./assets/red-x.jpg" alt="delete button" name="delete-button" class="delete-button">' +
			'<input type="image" src="./assets/handle-image.svg" alt="rearrange handle" name="rearrange-handle" class="rearrange-handle">' +
			// use span tags and regex
			'<p class="track" ondblclick="this.contentEditable=true;this.focus()" contenteditable="false">' + '<strong>' + song.title + ' - ' + song.key + ' - ' + song.bpm + '</strong></p>' + 
		'</div>'
	);
	$('.setlist').append(trackString);
}

// event listeners
function watchAddTrack() {
	$('form').on('submit', function(event) {
		event.preventDefault();
		var form = $(this);
		var song = {
			title: form.find('#title').val(),
			key: form.find('#key').val(),
			bpm: form.find('#tempo').val()
		};
		// render data on page
		renderTrack(song);
		// send data to DB

		// reset UI
		$('input').val('');
	});
}

function watchUpdateTrack() {
	// update on ui using sortable library
	var element = document.getElementById('sortable-setlist');
	Sortable.create(element, {
		handle: '.rearrange-handle'
	});

	// update on DB
}

function watchDeleteTrack() {
	// delete from UI
	$(document).on('click', '.delete-button', function(event) {
		$(this).parent('div').remove();
	});

	// delete from DB
}

$(function() {
	watchAddTrack();
	watchUpdateTrack();
	watchDeleteTrack();
});