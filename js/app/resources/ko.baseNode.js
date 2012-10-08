/*global define, $ */
define([
  'knockout'
], function(ko) {

  var updateDimensions = function($element, node, viewport) {
    // Base the node's view dimensions on the viewport state.
    var x = viewport.centerX() + node.x() + viewport.halfWidth();
    var y = viewport.centerY() + node.y() + viewport.halfHeight();
    $element
      .css('left', x)
      .css('top', y)
      .width(40)
      .height(40);
    };

  ko.bindingHandlers.baseNode = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var $element = $(element);
      var node = valueAccessor();
      var nodeField = bindingContext.$parent;
      var viewport = nodeField.viewport;

      updateDimensions($element, node, viewport);
    },

    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var $element = $(element);
      var node = valueAccessor();
      var nodeField = bindingContext.$parent;
      var viewport = nodeField.viewport;

      updateDimensions($element, node, viewport);
    }
  };
});
