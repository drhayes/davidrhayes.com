/*global define */
define([
  'knockout'
], function(ko) {

  // Every generator instance has the same metadata.
  var metadata = {
    stats: [{
      name: 'generator',
      current: 'points',
      max: 'maxPoints'
    }]
  };

  // Creates a pool of points over time.
  var Generator = function() {
    var self = this;
    self.metadata = metadata;
    // The center of this thing.
    self.x = ko.observable(0);
    self.y = ko.observable(0);
    self.points = ko.observable(0);
    self.maxPoints = ko.observable(10);
    self.rate = ko.observable(1);
  };

  return Generator;
});
