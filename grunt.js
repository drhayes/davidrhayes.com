module.exports = function(grunt) {

  // Load npm tasks.
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({
    test: {
      all: ['test/**/*.js']
    },

    lint: {
      all: ['grunt.js', 'js/app/**/*.js']
    },

    less: {
      dev: {
        options: {
          paths: ['less/app'],
          compress: true
        },
        files: {
          'css/main.css': 'less/app/main.less'
        }
      }
    },

    watch: {
      files: ['less/app/*.less'],
      tasks: 'less:dev'
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

  grunt.registerTask('build', 'less:dev');

};
