$(document).ready(function() {

	// This is where the tile swirl.
	var tile_container = $('<div id="tilecontainerouter"><div id="tilecontainerinner"></div></div>').
		appendTo('#content').
		children('#tilecontainerinner');
	// This is where all the typing happens.
	var terminal = $('<div id="terminal"></div>').appendTo('#content');
	// This is where all the tiles are tracked.
	var all_tiles = [];

	var Tile = (function() {
		var start_x = 450;
		var start_y = 0;
		
		return function(xx, yy) {
			var secret_counter = 0;
			this.update_pos = function() {
				this.elem.css({
					'top': this.y + 'px',
					'left': this.x + 'px'
				});
			};
			
			this.move = function() {
				this.x += Math.sin(secret_counter) * 10;
				secret_counter += 0.1;
				this.update_pos();
			};

			this.x = xx || start_x + Math.floor(Math.random() * 350) - 175;
			this.y = yy || start_y;
			// Initialize the secret_counter to get the swirl right.
			// Math.PI / 2 = 1, our max allowed from center (200), so
			// figure out the ratio based on where we are.
			secret_counter = (start_x - this.x) / 200 * (Math.PI / 2);
			this.elem = $('<div class="tile"></div>');

			this.update_pos();
			this.elem.appendTo(tile_container).fadeIn('slow');
			
			// update our secret global stuff
			if (!yy) {
				start_y += 6;
			}
			all_tiles.push(this);
		};
	})();
	
	for (var i=0; i < 100; i++) {
		new Tile();
	};
	
	var swirl = function() {
		for (var i = 0, len = all_tiles.length; i < len; i++) {
			all_tiles[i].move();
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

	var terminal_type = function(lines, target) {
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
		(unroll(typings))();
	};
	
	var tile = function(target) {
		target = target || '#tilecontainer';
		return 
	};
	
	// don't start everything for a bit...
	setTimeout(function() {
		terminal_type(
			['Subject: David R. Hayes',
			'Username: drhayes']);
		setInterval(swirl, 33);
	}, 1500);
});