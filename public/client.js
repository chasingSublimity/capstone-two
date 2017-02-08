// functions to set state with API data


// api calls

// get existing setlist
function getSetlist(callbackFn) {
	$.get('/setlist', callbackFn);
}

// post new setlist
function postNewTrack(newTrack) {
	$.ajax({
	  type: "POST",
	  url: '/track',
	  data: JSON.stringify({track: newTrack}),
	  success: console.log('setlist posted'),
	  contentType: 'application/json',
	  dataType: 'json'
	});
}

// edit existing setlist
function editTrack(track) {
		$.ajax({
	  type: "PUT",
	  url: '/track/' + track._id, // temporary hardcode
	  data: JSON.stringify(setlist),
	  success: console.log('setlist posted'),
	  contentType: 'application/json',
	  dataType: 'json'
	});
}

// delete existing setlist
function deleteSetlist(setlist) {
		$.ajax({
	  type: "DELETE",
	  url: '/setlist/589372af2e057e0fb4f08fee', // temporary hardcode
	  data: JSON.stringify(setlist),
	  success: console.log('setlist deleted'),
	  contentType: 'application/json',
	  dataType: 'json'
	});
}

// rendering functions

function renderSetlist(apiResponse) {
		if (apiResponse === null) {
			// display instructions if no setlist has been created
			$('.setlist').html('<p class="noSetlistMessage">Add a track above to get started!</p>');
		} else {
			// display setlist if it has been created
			var setlistHtml = [];
			for (var i=0; i < apiResponse.tracks.length; i++) {
				var song = apiResponse.tracks[i];
				setlistHtml.push(
					'<div class="track-item-container">' +
						'<input type="image" src="./assets/red-x.jpg" alt="delete button" name="delete-button" class="delete-button">' +
						'<input type="image" src="./assets/handle-image.svg" alt="rearrange handle" name="rearrange-handle" class="rearrange-handle">' +
						'<p class="track">' + '<strong><span onclick="this.contentEditable=true;this.focus()">' + song.trackName + '</span> -  <span onclick="this.contentEditable=true;this.focus()">' + song.key + '</span> - <span onclick="this.contentEditable=true;this.focus()">' + song.bpm + '</span></strong></p>' + 
					'</div>'
				);
			}
			$('.setlist').append(setlistHtml);
		}
}

// render track data
function renderNewTrack(song) {
	// if UI is displaying the instructions, clear the .setlist div
	if ($('.setlist').html() === '<p class="noSetlistMessage">Add a track above to get started!</p>') {
		$('.setlist').html('');
	} 
	var trackString = (
		'<div class="track-item-container">' +
			'<input type="image" src="./assets/red-x.jpg" alt="delete button" name="delete-button" class="delete-button">' +
			'<input type="image" src="./assets/handle-image.svg" alt="rearrange handle" name="rearrange-handle" class="rearrange-handle">' +
			// use span tags and regex
			'<p class="track">' + '<strong><span onclick="this.contentEditable=true;this.focus()">' + song.title + '</span> -  <span onclick="this.contentEditable=true;this.focus()">' + song.key + '</span> - <span onclick="this.contentEditable=true;this.focus()">' + song.bpm + '</span></strong></p>' + 
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
			trackName: form.find('#title').val(),
			key: form.find('#key').val(),
			bpm: form.find('#tempo').val()
		};
		// render data on page
		renderNewTrack(song);
		// send data to DB
		postNewTrack();
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
	function editSetlist(setlist) {
			$.ajax({
		  type: "PUT",
		  url: '/setlist/589372af2e057e0fb4f08fee', // temporary hardcode
		  data: JSON.stringify(setlist),
		  success: console.log('setlist posted'),
		  contentType: 'application/json',
		  dataType: 'json'
		});
	}
}

function watchDeleteTrack() {
	// delete from UI
	$(document).on('click', '.delete-button', function(event) {
		$(this).parent('div').remove();
	});

	// delete from DB
	
}

$(function() {
	getSetlist(renderSetlist);
	watchAddTrack();
	watchUpdateTrack();
	watchDeleteTrack();
});