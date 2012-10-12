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

    self.findStat = function(name) {
      // Don't add duplicate stats.
      var getName = function() {
        return stat.name == name;
      };
      return _.find(self.stats(), getName);
    };

    self.addNodeStats = function(node) {
      if (!node.metadata) {
        return;
      }
      var metadata = node.metadata;
      _.each(metadata.stats, function(stat) {
        // Don't add duplicate stats.
        if (self.findStat(stat.name)) {
          return;
        }
        self.stats.push(new Stat(self.nodes, stat.name, stat.current, stat.max));
      });
    };

    self.onNodeAdded = function(newNodes) {
      _.each(newNodes, function(newNode) {
        self.addNodeStats(newNode);
      });
    };

    // As nodes come in, do they expose any stats?
    self.nodes.subscribe(self.onNodeAdded);
  };
});
