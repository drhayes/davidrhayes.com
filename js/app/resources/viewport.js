/*global define */
define([
  'knockout'
], function(ko) {
  return function() {
    var self = this;

    self.centerX = ko.observable(0);
    self.centerY = ko.observable(0);
    // Size in pixels of the viewport, not the width of the view through
    // the viewport. The window, basically.
    self.width = ko.observable();
    self.height = ko.observable();
    self.halfWidth = ko.computed(function() {
      return self.width() / 2;
    });
    self.halfHeight = ko.computed(function() {
      return self.height() / 2;
    });
  };
});
