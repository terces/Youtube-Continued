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
		width: 410,
		height: 225,
		videoId: ytvid,
		playerVars: {
			'version' : 3,
			'controls': 2,
			'enablejsapi' : 1,
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
			'onStateChange': stateController,
			'onError': errorWhat
		}
	});
}

var quarter = false;
function changeTitle( ytvid) {

	$.getJSON( 'https://gdata.youtube.com/feeds/api/videos/' + ytvid, { 
		v: 2,
		format: 5,
		alt: 'jsonc'
			}, function(d) {
				$('#yttitle').html( '<h4>' + d.data.title + '</h4>');
	});
}

function stateController( event) {
	if( event.data == YT.PlayerState.ENDED) {
		recordListener( event);
	}
	else if( event.data == YT.PlayerState.PLAYING) {
		relatedListListener( event);
	}
}

function retrivedVideoId( url) {
	var vid = url.split( 'v=')[1];
	if( vid.indexOf( '&') > 0)
		vid = vid.substring( 0, vid.indexOf( '&'));
	return vid;
}

function recordListener( evt) {
	var pos = $('.carousel-inner');
	var ytvid = retrivedVideoId( player.getVideoUrl());
	
	if( ytloop == true) {
		player.seekTo( 0, true);
		player.playVideo();
	}
	else {
		/* template
		   <!--
		   <div class="item">
			   <img src="assets/img/bootstrap-mdo-sfmoma-01.jpg" alt="">
			   <div class="carousel-caption">
				   <h4>First Thumbnail label</h4>
				   <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
				   <span class="tracker">videoId</span>
			   </div>
		   </div>
		   -->
	   */
		var content = '<div class="item">';
		$.getJSON( 'https://gdata.youtube.com/feeds/api/videos/' + ytvid, { 
				v: 2,
				format: 5,
				alt: 'jsonc'
			}, function(d) {
					var tt = d.data.duration;
					var hh = Math.floor( tt / 3600);
					var mm = Math.floor( tt % 3600 / 60);
					var ss = Math.floor( tt % 60);
					var tstr = ( ( hh.toString().length == 1 ) ? ( '0'+hh.toString()) : hh.toString()) + ':' + 
						( ( mm.toString().length == 1 ) ? ( '0'+mm.toString()) : mm.toString()) + ':' + 
						( ( ss.toString().length == 1 ) ? ( '0'+ss.toString()) : ss.toString());
					content += '<img src="' + d.data.thumbnail.hqDefault + '" alt="">';
					content += '<div class="carousel-carousel">';
					content += '<h4>' + d.data.title + '</h4>';
					content += '<p>Time: ' + tstr + '</p>';
					content += '<p>View count: ' + d.data.viewCount + '</p>';
					content += '<a href="#">Remove</a>';
					content += '<span class="tracker" style="display: none">' + ytvid + '</span>';
					content += '</div>';
					content += '</div>';
		}).complete( function() {
			if( evt.target.getCurrentTime() +1 >= evt.target.getDuration())
				pos.append( content);
			quarter = false;
			clearInterval( curTimer);
			nextVideo();
		});
		start = true;
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
	// TODO: make by mode
	//if(  mode == 'smart') { 
		// TODO: keyword extract with score borad
	//}
	//else { // ( mode == 'random')
		$('#relatedlist').html(''); 
		$.getJSON( 'https://gdata.youtube.com/feeds/api/videos/' + ytvid + '/related', { 
				v: 2,
				'max-results': 5,
				format: 5,
				alt: 'jsonc'
				}, function(d) {
					for( var i = 0; i < 5; ++i) {
						var cvid = d.data.items[i].id;
						$('#relatedlist').append( '<span class="candidate">' + cvid + '</span><br />');
						$.getJSON( 'https://gdata.youtube.com/feeds/api/videos/' + cvid + '/related', { 
							v: 2,
							'max-results': 2,
							format: 5,
							alt: 'jsonc'
							}, function(d) {
								for( var i = 0; i < 2; ++i)
							$('#relatedlist').append( '<span class="candidate">' + d.data.items[i].id + '</span><br />');
							});
					}
				});
	//}

}

function errorWhat( eno) {
	alert( eno.data);
	return ;
}
