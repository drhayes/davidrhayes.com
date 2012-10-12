/*global define, window, $ */
define([
  'underscore',
  'signals',
  'hashchange'
], function(_, Signal) {

  "use strict";

  var urlHash = {
    // Subscribe to this event to receive notifications of params changing.
    // Will be sent the params.
    changed: new Signal(),

    onHashchange: function() {
      var hash = window.location.hash || '';
      hash = hash.substring(1);
      var pairs = _.map(hash.split('&'), function(pair) {
        var pieces = pair.split('=');
        return [
          decodeURIComponent(pieces[0]),
          decodeURIComponent(pieces[1])
        ];
      });
      var params = _.object(pairs);
      this.changed.dispatch(params);
    }
  };

  // Start watching the hashchange.
  var boundHandler = _.bind(urlHash.onHashchange, urlHash);
  $(window).hashchange(boundHandler);

  return urlHash;
});
