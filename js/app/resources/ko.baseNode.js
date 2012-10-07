/*global define, $ */
define([
  'knockout'
], function(ko) {
  ko.bindingHandlers.baseNode = {
    init: function(element, valueAccessor) {
      var value = valueAccessor();
      var $element = $(element);

      $element
        .css('left', value.x())
        .css('top', value.y());
    }
  };
});
