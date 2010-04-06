$(document).ready(function() {

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
			push_letters(text.slice(1), target);
		}, 50);
	};

	var terminal_type = function(lines, target) {
		if (!$.isArray(lines)) {
			lines = [lines];
		}
		target = target || 'body';
		for (var i=lines.length; i < len; i++) {
			var elem = $('<span class="termouter withcursor"><p class="terminner"></p></span><br />');
			$(elem).appendTo(target);
			var inner = $(elem).children('.terminner');
			setTimeout(function() {
				push_letters(lines[i], inner);
			}, 1000);
		};
	};
	
	// don't start everything for a bit...
	setTimeout(function() {
		terminal_type(
			['Subject:David R. Hayes',
			'Username: drhayes'], '#content');
	}, 1500);
});