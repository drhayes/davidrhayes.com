/*global define */
define([
  'knockout',
  'resources/viewport'
], function(ko, Viewport) {
  // Container for nodes.
  return function() {
    var self = this;
    self.nodes = ko.observableArray();

    self.viewport = new Viewport();
  };
});
