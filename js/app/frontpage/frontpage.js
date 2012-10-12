/*global window, location, $, define */
define([
  'underscore',
  'text!frontpage/template.html',
  'system/urlHash',
  'resources/app',
  // Don't need to ref anything below this.
  'hashchange'
], function(_, template, urlHash, resourcesApp) {
  "use strict";

  var Frontpage = function() {
    var onParamsChanged = function(params) {
      var app = apps[params.app] || apps.frontpage;
      appTransition(app);
    };

    // Watch for param changes.
    urlHash.changed.add(onParamsChanged);

    var render = function() {
      $('#app').html(template);
    };

    var apps = {
      frontpage: render,
      resources: resourcesApp
    };

    var appTransition = function(app) {
      var $app = $('#app');
      $app.fadeOut('fast', function() {
        app();
        $app.fadeIn('slow');
      });
    };
  };

  return Frontpage;
});
