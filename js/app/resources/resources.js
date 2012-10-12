/*global $, define */
define([
  'knockout',
  'text!resources/template.html',
  'resources/nodeField',
  'resources/generator',
  // Nothing below here in arguments list.
  'resources/ko/ko.baseNode',
  'resources/ko/ko.nodeViewport'
], function(ko, template, NodeField, Generator, Stat) {
  "use strict";

  return function() {
    var self = this;

    self.nodeField = new NodeField();

    // Add a generator by default.
    self.nodeField.nodes.push(new Generator());

    self.init = function() {
      $('#app').html(template);

      ko.applyBindings(self.nodeField, $('.node-field')[0]);
    };
  };
});
