var SetList = {};

// api calls

// get existing setlist
SetList.getSetlist = function() {
	$.get('/setlist', function(data) {
		SetList.renderTracks(data.tracks);
	});
};

// post new track
SetList.addTrack = function(newTrack) {
	$.ajax({
	  type: "POST",
	  url: '/track',
	  data: JSON.stringify({track: newTrack}),
	  // grab the ._id of the added track from DB response and 
	  // add add it as a 'data-id' property 
	  // to the corresponding DOM element
	  success: function(data) {
	  	var newTrackId = data.tracks[data.tracks.length-1]._id;
	  	$('.track').last().attr('data-id', newTrackId);
	  },
	  contentType: 'application/json',
	  dataType: 'json'
	});
};

// edit existing track
SetList.editTrack = function(trackId, trackData) {
		$.ajax({
	  type: "PUT",
	  url: '/track/' + trackId, 
	  data: JSON.stringify({track: trackData}),
	  success: console.log('track edited'),
	  contentType: 'application/json',
	  dataType: 'json'
	});
};

// edit setlist order
SetList.editSetlist = function(idArray) {
		$.ajax({
	  type: "PUT",
	  url: '/setlist', 
	  data: JSON.stringify({trackIds: idArray}),
	  success: console.log('setlist edited'),
	  contentType: 'application/json',
	  dataType: 'json'
	});
};

// delete existing track
SetList.deleteTrack = function(trackId) {
		$.ajax({
	  type: "DELETE",
	  url: '/track/' + trackId,
	  success: console.log('track deleted'),
	});
};

// rendering function
SetList.renderTracks = function(tracks) {
	var noTracksMessage = 
		'<div class="track-item-container">' +
				'<p class="no-track"><strong><span class=".no-setlist-message">Add a track above to get started!</span></strong></p>' + 
			'</div>';
	// display instructions if no setlist has been created
	if (tracks.length === 0) {
		$('.setlist').html(noTracksMessage);
	} else {
		// if noTracksMessage is displayed, clear .setlist
		if ($('.setlist').html() === noTracksMessage) {
			$('.setlist').html('');
		}
		// display setlist
		var setlistHtml = [];
		for (var i=0; i < tracks.length; i++) {
			var song = tracks[i];
			setlistHtml.push(
				'<div class="track-item-container">' +
					'<input type="image" src="./assets/red-x.jpg" alt="delete button" name="delete-button" class="delete-button">' +
					'<p class="track" data-id="' + tracks[i]._id + '">' + '<strong><span class="trackName" onclick="this.contentEditable=true;this.focus()">' + song.trackName + '</span> -  <span class="key" onclick="this.contentEditable=true;this.focus()" pattern="[A-Ga-g#♮]+">' + song.key + '</span> - <span class="bpm" onclick="this.contentEditable=true;this.focus()">' + song.bpm + '</span></strong></p>' + 
				'</div>'
			);
		}
		$('.setlist').append(setlistHtml);
	}
};

// event listeners
SetList.watchAddTrack = function() {
	// handle the instructions that display if no tracks are in DB
	$('form').on('submit', function(event) {
		event.preventDefault();
		// grab data from form and construct songObject
		var form = $(this);
		var song = {tracks: 
			[{
				trackName: form.find('#title').val(),
				key: form.find('#key').val(),
				bpm: form.find('#tempo').val()
			}]
		};
		// send data to DB
		SetList.addTrack(song.tracks[0]);
		// render data on page
		SetList.renderTracks(song.tracks);
		// reset UI
		$('input').val('');
	});
};

SetList.watchUpdateTrack = function() {
	// update on ui using sortable library
	var el = document.getElementById('sortable-setlist');
	Sortable.create(el, {
		animation: 250
	});
	// update on DB
	// declare variable outside of event handler so it doesn't get overwritten
	var updateTimer;
	$(document).on('input', 'span', function(event) {
		// avoid JS this nonsense
		var that = $(this);
		var trackId = that.parents('p').attr('data-id');
		// cancel any previous setTimeout functions that may be pending.
		clearTimeout(updateTimer);
		// more descriptive variable name
		updateTimer = setTimeout(function() {
			var trackData = {
				trackName: that.parent().find('.trackName').html(),
				key: that.parent().find('.key').html(),
				bpm: that.parent().find('.bpm').html(),
				id: trackId
			};
			SetList.editTrack(trackId, trackData);
		}, 2000);
	});
};

SetList.watchReorderSetlist = function() {
	// when a track container dragend event is fired, clear the trackIds array
	// loop through each .track element and push the id to array
	// then make api call with id array
	$(document).on('dragend', '.track-item-container', function() {
		var trackIds = [];
		$('.track').each(function() {
			trackIds.push($(this).attr('data-id'));
		});
		SetList.editSetlist(trackIds);
	});
};

SetList.watchDeleteTrack = function() {
	$(document).on('click', '.delete-button', function(event) {
		// confirm with user, then delete track from UI and DB if user confirms
		var confirmation = confirm('Are you you sure?');
		if (confirmation) {
				var dataId = $(this).siblings('p').attr('data-id');
				// delete from DB
				SetList.deleteTrack(dataId);
				// delete from UI
				$(this).parent('div').remove();
			}
	});
};

$(function() {
	SetList.getSetlist();
	SetList.watchAddTrack();
	SetList.watchUpdateTrack();
	SetList.watchReorderSetlist();
	SetList.watchDeleteTrack();
});