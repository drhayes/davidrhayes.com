// Get the Google feed library
google.load('feeds', '1');

$(document).ready(function() {

	// This is where all the typing happens.
	var terminal = $('<div id="terminal"></div>').appendTo('#content');
	// This is where the tile swirl.
	var tile_container = $('<div id="tilecontainerouter"><div id="tilecontainerinner"></div></div>').
		appendTo('#content').
		children('#tilecontainerinner');
	// Container of list of contents.
	var content_container = $('<ol class="contentcontainer"></ol>').appendTo('#content');
	// Track the swirl interval.
	var swirl_interval;
	// Initial fade-in interval.
	var appear_interval;
	// How much each tile swirls per frame.
	var d_counter = 0.05;
	// The width of where all the tiles are.
	var tile_container_width = $('#tilecontainerouter').width();
	// The height of where all the tiles are.
	var tile_container_height = $('#tilecontainerouter').height();
	// How much each tile can move around.
	var MOVEMENT_RANGE = tile_container_width / 2.11;
	// The timeout that starts pulling the tiles out.
	var animate_tiles_timeout;
	// This queue does the best it can to keep things sorted by date, but
	// I don't know when everything is coming in so things can get out of
	// order.
	var ContentQueue = (function() {
		var queue = [];
		var need_to_sort = true;
		return function() {
			this.enqueue = function(tile) {
				queue.push(tile);
				need_to_sort = true;
			};
			
			this.dequeue = function() {
				// Before anything is pulled off, do we need to sort?
				if (need_to_sort) {
					// Sort in reverse chronological order.
					queue = queue.sort(function(x, y) {
						return y.date - x.date;
					});
					need_to_sort = false;
				}
				return queue.shift();
			};
		};
	})();

	// The queue of tiles that should be animated to the content area.
	var content_tiles_queue = new ContentQueue();

	var Tile = (function() {
		var start_x = tile_container_width / 2;
		var start_y = 0;
		
		var center = 0;
		var left = Math.PI / 2;
		var right = 3 * Math.PI / 2;
		
		return function(feedy) {
			var secret_counter = 0;
			// Don't let rate of speed exceed 1
			this.rate_of_speed = Math.min(Math.random() + 0.3, 1);
			this.movement_range = MOVEMENT_RANGE * this.rate_of_speed;
			this.feedy = feedy;
			
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
			
			this.set_content = function(entry) {
				this.date = Date.parse(entry.publishedDate);
				this.content = this.feedy.get_content(entry)
			};
			
			this.toString = function() {
				return this.date + ' ' + this.content;
			};
			
			this.get_content = function() {
				return '<div class="iconhere scoochtile ' + this.feedy.name + '">' + this.content + '</div>';
			};
			
			this.x = Math.floor(Math.random() * tile_container_width);
			// These constants came entirely by feel.
			this.y = Math.floor(Math.random() * (tile_container_height / 3.5)) + (tile_container_height / 2.3);
			// Initialize the secret_counter to get the swirl right.
			var how_far_from_center = (start_x - this.x);
			var the_ratio = how_far_from_center / (tile_container_width / 2);
			secret_counter = Math.asin(the_ratio);
			if (Math.random() > 0.5) {
				secret_counter += Math.PI;
			}
			this.elem = $('<div class="tile iconhere ' + this.feedy.name + '"></div>');
			this.move();
			this.elem.appendTo(tile_container);
		};
	})();
	
	var Feed = function(name, url, get_content) {
		this.name = name;
		this.url = url;
		this.get_content = get_content || function(entry) {
			return '<a href="' + entry.link + '">' + entry.title + '</a>';
		};
		this.gfeed = new google.feeds.Feed(url);
		this.tiles = [];
		// Generate some tiles for this feed.
		for (var i = 0; i < 4; i++) {
			this.tiles.push(new Tile(this));
		}
		
		this.load = function() {
			// Get closure working for us on this one...
			var tiles = this.tiles;
			var me = this;
			this.gfeed.load(function(result) {
				if (!result.error) {
					var length = Math.min(4, result.feed.entries.length);
					for (var i = 0; i < length; i++) {
						var entry = result.feed.entries[i];
						var tile = tiles[i];
						tile.set_content(entry);
						content_tiles_queue.enqueue(tile);
					}
				}
				if (animate_tiles_timeout) {
					clearTimeout(animate_tiles_timeout);
				}
				animate_tiles_timeout = setTimeout(start_animating_tiles, 2000);
			});
		};
	};
	
	var feeds = [
		new Feed('twitter', 'http://twitter.com/statuses/user_timeline/681443.rss',
			function(entry) {
				var tweet = entry.content.substring('drhayes: '.length);
				return ['<div class="iconhere">', ify.clean(tweet), '</div>'].join('');
			}),
		new Feed('posterous', 'http://feeds.feedburner.com/drhayes/blog'),
		new Feed('flickr', 'http://api.flickr.com/services/feeds/photos_public.gne?id=84031065@N00&amp;lang=en-us&amp;format=atom'),
		new Feed('delicious', 'http://feeds.delicious.com/v2/rss/drhayes?count=15'),
		new Feed('greader', 'http://www.google.com/reader/public/atom/user%2F13856078743170169356%2Fstate%2Fcom.google%2Fbroadcast'),
		new Feed('picasa', 'http://picasaweb.google.com/data/feed/base/user/drhayes?alt=rss&kind=album&hl=en_US&access=public'),
		new Feed('lastfm', 'http://ws.audioscrobbler.com/1.0/user/drhayes9/recenttracks.rss'),
		new Feed('goodreads', 'http://www.goodreads.com/review/list_rss/1122867?key=44795ad719eb44d6536ffac2a3c109fb4baaa6cc&amp;shelf=%23ALL%23')
	];
	// Google Feed API brings back four entries per feed.
	var num_tiles = feeds.length * 4;
	
	var swirl = function() {
		var moved_any = false;
		for (var i = 0; i < feeds.length; i++) {
			var feed = feeds[i];
			for (var j = 0; j < feed.tiles.length; j++) {
				// Only move the tile if it has no content
				var tile = feed.tiles[j];
				if (!tile.animated) {
					moved_any = true;
					tile.move();
				}
			}
		}
		// Are we done swirling?
		if (!moved_any) {
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

	var terminal_type = function(line, callback) {
		var elem = $('<span class="termouter withcursor"><p class="terminner"></p></span><br />');
		$(elem).appendTo('#terminal');
		var inner = $(elem).children('.terminner');
		push_letters(line, inner, callback);
	};
	
	var animate_tiles = function() {
		// Check to see if we have any tiles we need to animate.
		var tile = content_tiles_queue.dequeue();
		if (tile) {
			var content_item = $('<li class="contentitem"></li>').
				appendTo(content_container).
				html(tile.content);
				var replace_tile = (function(tile, content_item) {
					return function() {
						content_item.html(tile.get_content()).
						css({
							'visibility': 'visible'
						});
						tile.elem.remove();
					};
				})(tile, content_item);
			tile.animated = true;
			tile.elem.css({
				'opacity': '1.0',
				'height': '20px',
				'width': '100%',
				'-webkit-transform': 'rotate3d(0,1,0,0rad)'
			}).
			animate({
				'top': (content_item.offset().top - 52) + 'px',
				'left': '0px'
			}, 2000, function() {
				replace_tile();
			}).
			html(tile.get_content());
		}
	};
	
	var start_animating_tiles = function() {
		setInterval(animate_tiles, 500);
	};
	
	// don't start everything for a bit...
	setTimeout(function() {
		terminal_type(
			'David Hayes\' Social Swirl',
			function() {
				swirl_interval = setInterval(swirl, 33);
				var feed_index = 0;
				var tile_index = 0;
				// Iterate through the tiles slowly, displaying them one at a time.
				appear_interval = setInterval(function() {
					var feed = feeds[feed_index];
					var tile = feed.tiles[tile_index];
					tile.elem.show();
					tile_index += 1;
					if (tile_index > feed.tiles.length - 1) {
						tile_index = 0;
						feed_index += 1;
					}
					if (feed_index > feeds.length - 1) {
						clearInterval(appear_interval);
					}
				}, 200);
			});
	}, 1500);
	
	setTimeout(function() {
		for (var i=0; i < feeds.length; i++) {
			feeds[i].load();
		};
	}, 10000);
});