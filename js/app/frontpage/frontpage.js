/*global window, location, $, define */
define([
  'underscore',
  'text!frontpage/template.html',
  'resources/app',
  // Don't need to ref anything below this.
  'hashchange'
], function(_, template, resourcesApp) {
  "use strict";

  var Frontpage = function() {
    var self = this;

    self.apps = {
      resources: resourcesApp
    };

    self.init = function() {
      // Render the template.
      $('#app').html(template);

      // Start tracking the hash.
      $(window).hashchange(self.selectApp, self);
      // Of course, the hash might already have something...
      self.selectApp(false);
    };

    self.selectApp = function(transition) {
      var hash = location.hash.substring(1);
      if (self.apps.hasOwnProperty(hash)) {
        var app = self.apps[hash];
        if (transition) {
          self.appTransition(app);
        } else {
          app();
        }
      }
    };

    self.appTransition = function(app) {
      var $app = $('#app');
      $app.fadeOut('fast', function() {
        app();
        $app.fadeIn('slow');
      });
    };
  };

  return Frontpage;
});
