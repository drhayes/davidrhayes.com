/*global require */
require(['frontpage/frontpage', 'system/urlHash'], function(frontpage, urlHash) {
  "use strict";

  frontpage();

  // Get things going.
  urlHash.onHashchange();
});
