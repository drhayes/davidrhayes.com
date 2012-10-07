/*global define */
define([
  'resources/resources'
], function(Resources) {
  "use strict";

  return function() {
    // Activate the resources app.
    var resources = new Resources();
    resources.init();
  };
});
