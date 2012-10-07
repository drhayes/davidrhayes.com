/*global $, define */
define([
  'knockout',
  'handlebars',
  'text!resources/template.html',
  'resources/nodeField',
  'resources/generator',
  // Nothing below here in arguments list.
  'resources/ko.baseNode'
], function(ko, Handlebars, text, NodeField, Generator) {
  "use strict";

  return function() {
    var self = this;

    self.template = Handlebars.compile(text);
    self.nodeField = new NodeField();

    // Add a generator by default.
    self.nodeField.nodes.push(new Generator());

    self.init = function() {
      $('#app').html(self.template);

      ko.applyBindings(self.nodeField, $('.node-field')[0]);
    };
  };
});
