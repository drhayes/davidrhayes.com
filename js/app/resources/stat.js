/*global define */
define([
  'knockout',
  'underscore'
], function(ko, _) {

  var makeNodeReducer = function(propertyName, nodesAccessor) {
    return function() {
      var iterator = function(memo, node) {
        return memo + (node[propertyName] && node[propertyName]()) || 0;
      };
      return _.reduce(nodesAccessor(), iterator, 0);
    };
  };

  // A current/max pair that we can display to the user.
  // Values are derived from node collections.
  return function(nodesAccessor, name, currentProperty, maxProperty) {
    this.name = name;
    this.current = ko.computed(makeNodeReducer(currentProperty, nodesAccessor));
    this.max = ko.computed(makeNodeReducer(maxProperty, nodesAccessor));
  };
});
