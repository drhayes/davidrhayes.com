/*global define */
define([
  'knockout'
], function(ko) {
  // Container for nodes.
  return function() {
    var self = this;
    self.nodes = ko.observableArray();
  };
});
