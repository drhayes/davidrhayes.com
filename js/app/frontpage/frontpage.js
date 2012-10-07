define([
  'knockout',
  'handlebars',
  'registry',
  'text!frontpage/template.html',
  'resources/resources'
], function(ko, Handlebars, registry, text) {

  var FrontPage = function() {
    var self = this;
    // Render the template.
    self.template = Handlebars.compile(text);
    $('#app').html(self.template);

    self.experiments = registry;

    ko.applyBindings(self);
  };

  return FrontPage;
});
