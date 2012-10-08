/*global define, window, $ */
define([
  'knockout'
], function(ko) {

  var resizeViewport = function(viewport, element) {
    var $element = $(element);
    viewport.width($element.width());
    // First, expand the element's height to the height of the window.
    var windowHeight = $(window).height();
    $element.height(windowHeight);
    viewport.height($element.height());
  };

  ko.bindingHandlers.nodeViewport = {
    init: function(element, valueAccessor) {
      var viewport = valueAccessor();

      // Keep up with window size changes.
      $(window).resize(function() {
        resizeViewport(viewport, element);
      });
      // Do the initial adjustment.
      resizeViewport(viewport, element);
    }
  };
});
