var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var start = false;
function onYouTubeIframeAPIReady() {
	// just a wrapper
	return ;
}
function realYouTubeIframeAPIDeploy( ytvid) {
	player = new YT.Player('ytframe', {
		width: '410',
		height: '225',
		videoId: ytvid,
		playerVars: {
			'controls': 2,
			'enablejsapi': 1,
			'autoplay': ( ( start == true) ? 1 : 0)
		},
		suggestedQuality: 'large',
		events: {
			/*
			'onReady'
			'onStateChange'
			'onPlaybackQualityChange'
			'onPlaybackRateChange'
			'onError'
			'onApiChange'
			*/
			'onStateChange': stateController
		}
	});
}

var quarter = false;
function stateController( event) {
	if( event.data == YT.PlayerState.ENDED) {
		recordListener( event);
	}
	else if( event.data == YT.PlayerState.PLAYING) {
		relatedListListener( event);
	}
}

function retrivedVideoId( url) {
	return ( url.split( 'v=')[1]);
}

function recordListener( evt) {
	var pos = $('#playlist');
	var vid = retrivedVideoId( player.getVideoUrl());
	
	if( ytloop == true) {
		player.seekTo( 0, false);
		player.playVideo();
	}
	else {
		start = true;
		pos.append( '<p>' + vid + '<p>');
		quarter = false;
		clearInterval( curTimer);
		nextVideo();
	}
}

var curTimer;
function relatedListListener( evt) {

	var duration = evt.target.getDuration();
	var ytvid = retrivedVideoId( evt.target.getVideoUrl()); 

	if( duration < 40 && !quarter) {
		quarter = true;
		makeRelatedList( ytvid);
	}
	else {
		curTimer = setInterval( function() {
			if( evt.target.getCurrentTime() > duration / 4 && !quarter) {
				quarter = true;
				makeRelatedList( ytvid);
				clearInterval( curTimer);
			}
		}, 5000);
	}
}

function makeRelatedList( ytvid) {

	// retrive gdata
	$('#relatedlist').html(''); 
	$.get( 'https://gdata.youtube.com/feeds/api/videos/' + ytvid + '/related', { 
		v: 2,
		'max-results': 5,
		format: 5,
		alt: 'jsonc'
		}, function(d) {
			for( var i = 0; i < 5; ++i) {
				var cvid = d.data.items[i].id;
				$('#relatedlist').append( '<span class="candidate">' + cvid + '</span><br />');
				$.get( 'https://gdata.youtube.com/feeds/api/videos/' + cvid + '/related', { 
					v: 2,
					'max-results': 5,
					format: 5,
					alt: 'jsonc'
					}, function(d) {
						for( var i = 0; i < 2; ++i)
							$('#relatedlist').append( '<span class="candidate">' + d.data.items[i].id + '</span><br />');
				});
			}
	});

}
