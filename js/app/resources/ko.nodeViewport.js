/*global define, window, $ */
define([
  'knockout'
], function(ko) {

  var resizeViewport = function(viewport, element) {
    var $element = $(element);
    var $window = $(window);
    // First, expand the element's extent to that of the window.
    $element.width($window.width());
    $element.height($window.height());
    // Now, set the viewport to that width and height.
    viewport.width($element.width());
    viewport.height($element.height());
  };

  var makeDraggable = function(viewport, element) {
    var $element = $(element);
    var dragging = false;
    var currentX, currentY;
    // Let user drag to move viewport.
    $(element)
      .mousedown(function(event) {
        dragging = true;
        currentX = event.clientX;
        currentY = event.clientY;
      })
      .mouseup(function() {
        dragging = false;
      })
      .mousemove(function(event) {
        if (dragging) {
          var dx = currentX - event.clientX;
          var dy = currentY - event.clientY;
          viewport.centerX(viewport.centerX() - dx);
          viewport.centerY(viewport.centerY() - dy);
          currentX = event.clientX;
          currentY = event.clientY;
        }
      });
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
      makeDraggable(viewport, element);
    }
  };
});
