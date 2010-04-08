// Get the Google feed library
google.load('feeds', '1');

$(document).ready(function() {

	// How much each tile can move around.
	var MOVEMENT_RANGE = 425;
	// This is where the tile swirl.
	var tile_container = $('<div id="tilecontainerouter"><div id="tilecontainerinner"></div></div>').
		appendTo('#content').
		children('#tilecontainerinner');
	// This is where all the typing happens.
	var terminal = $('<div id="terminal"></div>').appendTo('#content');
	// This is where all the tiles are tracked. We use a dictionary
	// so we can later remove the tiles.
	var all_tiles = {};
	// The queue of tiles that should be animated to the content area.
	var content_tiles_queue = [];
	// The numeric ID that is assigned to each tile as it is created.
	var tile_id = 0;
	// Track the swirl interval.
	var swirl_interval;
	// Initial fade-in index.
	var appear_index = 0;
	// Initial fade-in interval.
	var appear_interval;
	
	var tile_content_y = 0;
	
	var link_to_it = function(entry) {
		return '<a href="' + entry.link + '">' + entry.title + '</a>';
	};
	
	var feeds = [
		{
			// Twitter
			'url': 'http://twitter.com/statuses/user_timeline/681443.rss',
			'get_content': function(entry) {
				var tweet = entry.content.substring('drhayes: '.length);
				return ify.clean(tweet);
			}
		},
		{
			// Blog
			'url': 'http://feeds.feedburner.com/drhayes/blog'
		},
		{
			// Flickr
			'url': 'http://api.flickr.com/services/feeds/photos_public.gne?id=84031065@N00&amp;lang=en-us&amp;format=atom'
		},
		{
			// Delicious
			'url': 'http://feeds.delicious.com/v2/rss/drhayes?count=15'
		},
		{
			// Shared items in Reader
			'url': 'http://www.google.com/reader/public/atom/user%2F13856078743170169356%2Fstate%2Fcom.google%2Fbroadcast'
		},
		{
			// Picasa public photos
			'url': 'http://picasaweb.google.com/data/feed/base/user/drhayes?alt=rss&kind=album&hl=en_US&access=public'
		}
	];
	
	// Google Feed API brings back four entries per feed.
	var num_tiles = feeds.length * 4;
	// Decrement as tiles are filled with content.
	var current_tile_index = num_tiles - 1;

	var d_counter = 0.05;

	var Tile = (function() {
		var start_x = 450;
		var start_y = 0;
		
		var center = 0;
		var left = Math.PI / 2;
		var right = 3 * Math.PI / 2;
		
		return function() {
			var secret_counter = 0;
			// Don't let rate of speed exceed 1
			this.rate_of_speed = Math.min(Math.random() + 0.3, 1);
			this.movement_range = MOVEMENT_RANGE * this.rate_of_speed;
			
			this.move = function() {
				var siny = Math.sin(secret_counter);
				this.x = start_x - (siny * this.movement_range);
				secret_counter += d_counter * this.rate_of_speed;
				var opacity = '1.0';
				if (secret_counter > left && secret_counter < right) {
					opacity = '0.4';
				}
				if (secret_counter > 2 * Math.PI) {
					secret_counter = 0;
				}
				this.elem.css({
					'top': this.y + 'px',
					'left': this.x + 'px',
					'opacity': opacity,
					'-webkit-transform': 'rotate3d(0,1,0,' + secret_counter + 'rad)'
				});
			};
			
			this.set_content = function(content) {
				this.content = content;
				content_tiles_queue.push(this);
			};
			
			this.x = Math.floor(Math.random() * 900);
			this.y = Math.floor(Math.random() * 200) + 300;
			// Initialize the secret_counter to get the swirl right.
			// Math.PI / 2 = 1, our max allowed from center (400), so
			// figure out the ratio based on where we are now.
			var how_far_from_center = (start_x - this.x);
			var the_ratio = how_far_from_center / 450;
			secret_counter = Math.asin(the_ratio);
			if (Math.random() > 0.5) {
				secret_counter += Math.PI;
			}
			this.elem = $('<div class="tile"></div>');
			this.move();
			this.elem.appendTo(tile_container);
			this.tile_id = tile_id;
			all_tiles[this.tile_id] = this;
			tile_id += 1;
		};
	})();
	
	for (var i=0; i < num_tiles; i++) {
		new Tile();
	};
	
	var swirl = function() {
		var saw_any = false;
		for (var id in all_tiles) {
			all_tiles[id].move();
			saw_any = true;
		}
		// Are we done swirling?
		if (!saw_any) {
			clearInterval(swirl_interval);
		}
	};
	
	var unroll = function(funcs) {
		if (funcs.length === 1) {
			return funcs[0];
		};
		return function() {
			funcs[0](unroll(funcs.slice(1)));
		};
	};

	var push_letters = function(text, target, callback) {
		if (!text) {
			$(target).parents('.termouter').removeClass('withcursor');
			if (callback) {
				callback();
			}
			return;
		}
		var current = $(target).text();
		var newish = current + text[0];
		$(target).text(newish);
		setTimeout(function() {
			push_letters(text.slice(1), target, callback);
		}, 50);
	};

	var terminal_type = function(lines, target, callback) {
		if (!$.isArray(lines)) {
			lines = [lines];
		}
		target = target || '#terminal';
		var typings = [];
		for (var i=0, len = lines.length; i < len; i++) {
			var typing = (function(line) {
				return function(callback) {
					var elem = $('<span class="termouter withcursor"><p class="terminner"></p></span><br />');
					$(elem).appendTo(target);
					var inner = $(elem).children('.terminner');
					push_letters(line, inner, callback);
				};
			})(lines[i]);
			typings.push(typing);
		};
		typings.push(callback);
		(unroll(typings))();
	};
	
	var tile = function(target) {
		target = target || '#tilecontainer';
		return 
	};
	
	var load_feed = function(url, get_data) {
		get_data = get_data || function(entry) {
			return '<a href="' + entry.link + '">' + entry.title + '</a>';
		};
		var feed = new google.feeds.Feed(url);
		feed.load(function(result) {
			if (!result.error) {
				for (var i = 0; i < result.feed.entries.length; i++) {
					var entry = result.feed.entries[i];
					var tile = all_tiles[current_tile_index];
					current_tile_index -= 1;
					tile.set_content(get_data(entry));
				}
			}
		});
	};
	
	// don't start everything for a bit...
	setTimeout(function() {
		terminal_type(
			['Subject: David R. Hayes',
			'Username: drhayes'],
			'#terminal',
			function() {
				swirl_interval = setInterval(swirl, 33);
				// Iterate through the tiles slowly, displaying them one at a time.
				appear_interval = setInterval(function() {
					all_tiles[appear_index].elem.show();
					appear_index += 1;
					if (appear_index === num_tiles) {
						clearInterval(appear_interval);
					}
				}, 200);
			});
	}, 1500);
	
	setTimeout(function() {
		for (var i=0; i < feeds.length; i++) {
			var feed = feeds[i];
			load_feed(feed.url, feed.get_content);
		};
	}, 10000);
	
	setInterval(function() {
		// Check to see if we have any tiles we need to animate.
		var tile = content_tiles_queue.shift();
		if (tile) {
			delete(all_tiles[tile.tile_id]);
			tile.elem.css({
				'opacity': '1.0',
				'height': '20px',
				'width': '100%',
				'border': '0',
				'-webkit-transform': 'rotate3d(0,1,0,0rad)'
			}).
			animate({
				'top': tile_content_y + 'px',
				'left': '10px'
			}, 2000).
			html(tile.content);
			tile_content_y += 25;
		}
	}, 500);
});