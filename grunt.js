module.exports = function(grunt) {

  grunt.initConfig({
    test: {
      all: ['test/**/*.js']
    },

    lint: {
      all: ['grunt.js', 'js/app/**/*.js']
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

};
