define([
  'underscore',
  'handlebars',
  'text!frontpage/template.html',
  'resources/resources',
  // Don't need to ref anything below this.
  'hashchange'
], function(_, Handlebars, text, resourcesApp) {

  "use strict";

  var Frontpage = function() {
    var self = this;

    self.template = Handlebars.compile(text);
    self.apps = {
      resources: resourcesApp
    };

    self.init = function() {
      // Render the template.
      $('#app').html(self.template);

      // Start tracking the hash.
      $(window).hashchange(self.selectApp, self);
      // Of course, the hash might already have something...
      self.selectApp();
    };

    self.selectApp = function() {
      var hash = location.hash.substring(1);
      if (self.apps.hasOwnProperty(hash)) {
        var app = self.apps[hash];
        self.appTransition(app);
      }
    };

    self.appTransition = function(app) {
      $('#app').fadeOut(app);
    };
  };

  return Frontpage;
});
