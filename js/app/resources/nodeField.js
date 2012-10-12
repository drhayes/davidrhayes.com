/*global define */
define([
  'knockout',
  'underscore',
  'resources/viewport',
  'resources/stat'
], function(ko, _, Viewport, Stat) {

  // Container for nodes.
  return function() {
    var self = this;
    self.nodes = ko.observableArray();
    self.stats = ko.observableArray();
    self.viewport = new Viewport();

    self.addStat = function(name, currentProperty, maxProperty) {
      var stat = new Stat(self.nodes, name, currentProperty, maxProperty);
      self.stats.push(stat);
    };
  };
});
