// functions to set state with API data

// used to store data from/for api. for debugging purposes
var setlist;

// render setlist
function renderSetlist(setlistArray) {
	var setlistHtml = [];
	for (var i=0; i < setlistArray.length; i++) {
		var song = setlistArray[i];
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

// render track data
function renderNewTrack(song) {
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

// db functions

// get existing setlist
function getAndRenderSetlist() {
	$.get('/setlist', function(setlistObject) {
		setlist = setlistObject;
		renderSetlist(setlistObject.tracks);
	});
}

// post new setlist
function postNewSetlist(setlist) {
	console.log(setlist);
	$.post('/setlist', JSON.stringify(setlist), function() {
		console.log('setlist posted');
	}, 'json');
}

// put existing setlist
function editExistingSetlist(setlist) {

}

// delete existing setlist


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