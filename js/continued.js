$(document).ready( init);
var ytloop = false;
function init() {
	// search 
	$('#qform').submit( function() {
		start = false;
		$('#video_content').slideUp('slow');
		if( player) {
			player.destroy();
		}
		$.getJSON( 'https://gdata.youtube.com/feeds/api/videos', 
			{ 
				q: $('#qform input[name=qs]').val(),
				v: 2,
				'max-results': 11,
				format: 5,
				alt: 'jsonc'
			}, function( d) {
				var r = Math.floor( Math.random() * 5);
				var u = d.data.items[r].id;
				// clean all candidate
				$('#relatedlist').html(''); 
				for( var i = 0; i < 11; i++) {
					if( i != r)
						$('#relatedlist').append( '<span class="candidate">' + d.data.items[i].id + '</span><br />');
				}
				realYouTubeIframeAPIDeploy( u); 
		}).complete( function() {
			$('#video_content').slideDown( 'slow');
		});
		return false;
	});

	// current video related
	$('#bt_loop').bind( 'click', function() {
		var s = $('#bt_loop').html();
		if( s == 'Loop') {
			ytloop = true;
			$('#bt_loop').html('Shuffle');
		}
		else { // s == Shuffle
			ytloop = false;
			$('#bt_loop').html('Loop');
		}
	});

	$('#bt_next').bind( 'click', function() {
		nextVideo();
	});
	// global setting up
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

	$('#bt_mode').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html(
			'<input type="radio" name="box_mode" value="random" checked/> Random Chioce<br />' +
			'<input type="radio" name="box_mode" value="smart"/> Smart Chioce<br />'
		).fadeIn();
	});

	$('#bt_history').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html('<p>History playlist</p>').fadeIn( 'slow', function() {
			$('#playlist').fadeIn();
		});
	});

	$('#bt_about').bind( 'click', function() {
		$('#playlist').hide();
		$('#content').hide().html('<p>Hi! I am terces</p>').fadeIn();
	});
}

function nextVideo() {
	var clist = $('.candidate');
	if( clist.length == 0) {
		alert( "No more candidate... search another?");
		if( player) 
			player.pauseVideo();
		return ;
	}
	else {
		player.loadVideoById( clist[0].innerHTML, 0, "large");
	}
	$('.candidate :first').remove();
	return ;
}
