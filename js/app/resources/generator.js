/*global define */
define([
  'knockout'
], function(ko) {
  // Creates a pool of points over time.
  return function() {
    var self = this;
    // The center of this thing.
    self.x = ko.observable(0);
    self.y = ko.observable(0);
    self.points = ko.observable(0);
    self.maxPoints = ko.observable(10);
    self.rate = ko.observable(1);
  };
});
