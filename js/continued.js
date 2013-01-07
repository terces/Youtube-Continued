$(document).ready( init);
var ytloop = false;										// Loop mode controller
var mode = 'random';									// select mode controller, by default, random

function globalInit() {
	start = false;
	if( $('#bt_loop').html == 'Shuffle')
		$('#bt_loop').click();
	// rebuild a youtube iframe
	if( player) {
		player.destroy();
	}

}

function init() {
	// ninja initial 
	$('.ninja').hide();
	// search form event: bind
	$('#qform').submit( function() {
		globalInit();
		$('#video_content').slideUp('slow');
		// search 
		$.getJSON( 'https://gdata.youtube.com/feeds/api/videos', 
			{ 
				q: $('#qform input[name=qs]').val(),	// query string 
				v: 2,                                   // api version
				'max-results': 11,                      // search results
				format: 5,                              // could be embed
				alt: 'jsonc'                            // responese format
			}, function( d) {
				var r = Math.floor( Math.random() * 5); // use random to choose one video
				var u = d.data.items[r].id;             // selected video 
				$('#relatedlist').html('');             // clean the candidate list
				for( var i = 0; i < 11; i++) {          // make new candidate list
					if( i != r)
						$('#relatedlist').append( '<span class="candidate">' + d.data.items[i].id + '</span><br />');
				}
				realYouTubeIframeAPIDeploy( u);         // real deploy a youtube video
		}).complete( function() {
			$('#video_content').slideDown( 'slow');     // show the video container
		});
		return false;                                   // make a pseudo GET
	});

	// current video related

	// Loop button event: click
	$('#bt_loop').bind( 'click', function() {
		var s = $('#bt_loop').html();					// check current mode Loop/Shuffle
		// Loop mode
		if( s == 'Loop') {
			ytloop = true;
			$('#bt_loop').html('Shuffle');
		}
		// Shuffle mode
		else { // s == Shuffle
			ytloop = false;
			$('#bt_loop').html('Loop');
		}
	});

	// Next button event: click
	$('#bt_next').bind( 'click', function() {
		nextVideo();
	});
	// global setting up

	/*
	// Hide video button event: click
	$('#bt_hide').bind( 'click', function () {
		$('#playlist').hide();
		var s = $('#bt_hide').html();
		if( s == 'Hide') {
			$('iframe').each(
			function( index, elem) {
				elem.setAttribute('height', '25');
			}
			);
			$('#bt_hide').html('Show');
		}
		else {
			$('iframe').each(
			function( index, elem) {
				elem.setAttribute('height', '225');
			}
			);
			$('#bt_hide').html('Hide');
		}
	});
	*/
	// Mode radio box event: click
	$('#bt_mode').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html(
			// intelligence mode, use key word extraction 
			'<input id="mode_box" type="checkbox" ' + ( ( mode == 'random') ? '' : 'checked') + '/> Smart Chioce<br />' 
		).fadeIn();
	});

	$('#mode_box').live( 'click', function() {
		if( $(this).is(':checked'))
			mode = 'smart';
		else 
			mode = 'random';
	});

    // Check playlist button event: click
	$('#bt_history').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html('<p>History playlist</p>').fadeIn( 'slow', function() {
			$('#playlist').fadeIn();
		});
	});

	// Show about button event: click
	$('#bt_about').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html('<p>Hi! I am terces</p>').fadeIn();
	});
}

function nextVideo() {
	// skip current video
	var clist = $('.candidate');
	var r = 0;

	// candidate had beend ran out of using
	if( clist.length == 0) {
		alert( "No more candidate... search another?");
		if( player) 
			player.pauseVideo();
		return ;
	}
	// chose a new video
	// TODO: select by mode
	else {
		//if( mode == 'random') { 
		r = Math.floor( Math.random() * clist.length); // use random to choose one video 
		player.loadVideoById( clist[r].innerHTML, 0, "large");
		//}
		//else { // mode == 'smart'
		//	player.loadVideoById( clist[0].innerHTML, 0, "large");
		//}
	}
	clist[r].parentNode.removeChild( clist[r]);
	return ;
}
