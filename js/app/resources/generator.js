/*global define */
define([
  'knockout'
], function(ko) {
  // Creates a pool of points over time.
  return function() {
    var self = this;
    self.x = ko.observable();
    self.y = ko.observable();
    self.points = ko.observable();
    self.maxPoints = ko.observable();
    self.rate = ko.observable();
  };
});
