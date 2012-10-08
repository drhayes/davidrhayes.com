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

  var makeDraggable = function(viewport, element) {
    var $element = $(element);
    var dragging = false;
    var currentX, currentY;
    // Let user drag to move viewport.
    $(element)
      .mousedown(function(event) {
        dragging = true;
        currentX = event.offsetX;
        currentY = event.offsetY;
      })
      .mouseup(function() {
        dragging = false;
      })
      .mousemove(function(event) {
        if (dragging) {
          var dx = currentX - event.offsetX;
          var dy = currentY - event.offsetY;
          viewport.centerX(viewport.centerX() - dx);
          viewport.centerY(viewport.centerY() - dy);
          currentX = event.offsetX;
          currentY = event.offsetY;
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
