/*global define */
define([
  'knockout',
  'underscore',
  'resources/viewport'
], function(ko, _, Viewport) {

  var makeNodeReducer = function(propertyName, nodesAccessor) {
    return function() {
      var iterator = function(memo, node) {
        return memo + (node[propertyName] && node[propertyName]()) || 0;
      };
      return _.reduce(nodesAccessor(), iterator, 0);
    };
  };

  // Container for nodes.
  return function() {
    var self = this;
    self.nodes = ko.observableArray();
    self.generatorPoints = ko.computed(makeNodeReducer('points', self.nodes));
    self.maxGeneratorPoints = ko.computed(makeNodeReducer('maxPoints', self.nodes));
    self.viewport = new Viewport();
  };
});
