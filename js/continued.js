$(document).ready( init);

var ytloop = false;										// Loop mode controller
var mode = 'random';									// select mode controller, by default, random

function globalInit() {
	start = false;
	ytloop = false;
	$('#bt_loop').html( 'Loop');
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
				changeTitle( u);                        // retrived and set video name 
		}).complete( function() {
			$('#video_content').slideDown( 'slow');     // show the video container
		});
		return false;                                   // make a pseudo GET
	});

	// current video related
	// Mode button event: click
	$('#bt_mode').popover({
		html: true,
		placement: 'bottom',
		trigger: 'click',
		title: 'Mode Selector',
		content: function () {
			var r = '<input class="mode_radio" name="mode_choose" type="radio" value="random" ' + ( ( mode != 'random') ? '' : 'checked') + '/> Random Chioce<br />' 
			var s = '<input class="mode_radio" name="mode_choose" type="radio" value="smart"' + ( ( mode != 'smart') ? '' : 'checked') + '/> Smart Chioce<br />' 
			var l = '<input class="mode_radio" name="mode_choose" type="radio" value="loop"' + ( ( mode != 'loop') ? '' : 'checked') + '/> Loop Chioce<br />' 
			return r+s+l; 
		},
		delay: {
			show: 500,
		hide: 250
		}
	});
	// Mode selector
	$('.mode_radio').live( 'click', function() {
		ytloop = false;
		if( $(this).is(':checked') && $(this).val() == 'random') {		// default, random mode
			mode = 'random';
		}
		else if( $(this).is(':checked') && $(this).val() == 'smart') {	// intelligence mode, use key word extraction   
			mode = 'smart';
		}
		else if( $(this).is(':checked') && $(this).val() == 'loop') {	// loop mode
			mode = 'loop';
			ytloop = true;
		}
		else {															// default to random
			mode = 'random';
		}
	});

	// History button event: click
	$('#bt_history').popover({
		html: true,
		placement: 'bottom',
		trigger: 'click',
		title: 'History Viewer',
		content: 'Lots of history',
		delay: {
			show: 500,
			hide: 250
		}
	});

	// Next button event: click
	$('#bt_next').bind( 'click', function() {
		nextVideo();
	});


	// global setting up
    // confiuration menu 

	// Mode radio box event: click
	/*
	$('#bt_mode').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html(
			// intelligence mode, use key word extraction 
			'<input id="mode_box" type="checkbox" ' + ( ( mode == 'random') ? '' : 'checked') + '/> Smart Chioce<br />' 
		).fadeIn();
	});
	*/

    // Check playlist button event: click
	/*
	$('#bt_history').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html('<p>History playlist</p>').fadeIn( 'slow', function() {
			$('#playlist').fadeIn();
		});
	});
	*/
	// Show about button event: click
	/*
	$('#bt_about').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html('<p>Hi! I am terces</p>').fadeIn();
	});
    */
}
/*
function prevVideo() {
	// previous vidoe choose from history list
	var prevlist = $('.tracker :last');
	if( prevlist.length == 0) {
		alert('There is no previous video in your history list, keep listening?');
	}
	else {
		player.loadVideoById( prevlist[0].innerHTML, 0, "large");
		prevlist[0].parentNode.removeChild( prevlist[0]);
	}
}
*/
function nextVideo() {
	// skip current video
	var clist = $('.candidate');
	var r = 0;

	// candidate had beend ran out of using
	if( clist.length == 0) {
		alert( "No more candidate... search another?");
	}
	// chose a new video
	// TODO: select by mode
	else {
		//if( mode == 'random') { 
		r = Math.floor( Math.random() * clist.length); // use random to choose one video 
		player.loadVideoById( clist[r].innerHTML, 0, "large");
		changeTitle( clist[r].innerHTML);
		clist[r].parentNode.removeChild( clist[r]);
		//}
		//else { // mode == 'smart'
		//	player.loadVideoById( clist[0].innerHTML, 0, "large");
		//}
	}
	return ;
}
