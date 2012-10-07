/*global $, define */
define([
  'handlebars',
  'text!resources/template.html'
], function(Handlebars, text) {
  "use strict";

  return function() {
    var self = this;

    self.template = Handlebars.compile(text);

    self.init = function() {
      $('#app').html(self.template);
    };
  };
});
