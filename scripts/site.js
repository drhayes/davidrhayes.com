$(document).ready(function() {

	var push_letters = function(text, target) {
		if (!text) {
			$(target).parents('.termouter').removeClass('withcursor');
			return;
		}
		var current = $(target).text();
		var newish = current + text[0];
		$(target).text(newish);
		setTimeout(function() {
			push_letters(text.slice(1), target);
		}, 50);
	};

	var terminal_type = function(text, target) {
		var target = target || 'body';
		var elem = $('<span class="termouter withcursor"><p class="terminner"></p></span>');
		$(elem).appendTo(target);
		// show the cursor for a bit
		var inner = $(elem).children('.terminner');
		// inner.html('&nbsp;');
		setTimeout(function() {
			push_letters(text, inner);
		}, 1000);
	};
	
	// don't start everything for a bit...
	setTimeout(function() {
		terminal_type('Subject: David R. Hayes');
		terminal_type('Username: drhayes');
	}, 1500);
});