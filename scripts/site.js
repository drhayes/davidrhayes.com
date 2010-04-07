$(document).ready(function() {

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
		target = target || 'body';
		var typings = [];
		for (var i=0, len = lines.length; i < len; i++) {
			var typing = (function(line) {
				return function(callback) {
					console.log(callback, line);
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
	
	// don't start everything for a bit...
	setTimeout(function() {
		terminal_type(
			['Subject: David R. Hayes',
			'Username: drhayes'], '#content');
	}, 1500);
});