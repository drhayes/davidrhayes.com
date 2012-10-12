module.exports = function(grunt) {

  // Load our external task things.
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({
    test: {
      all: ['test/**/*.js']
    },

    lint: {
      all: ['grunt.js', 'js/app/**/*.js']
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'js/app',

          paths: {
            'knockout': '../lib/ko/knockout-2.1.0',
            'underscore': '../lib/underscore/underscore-min',
            'hashchange': '../lib/hashchange/jquery.ba-hashchange.min',
            'mousewheel': '../lib/mousewheel/jquery.mousewheel',
            'text': '../lib/require/plugins/text',
            'signals': '../lib/signals/signals.min'
          },

          shim: {
            'underscore': {
              'exports': '_'
            }
          },

          name: 'main',
          out: 'js/dist/main.js'
        }
      }
    },

    less: {
      dev: {
        options: {
          paths: ['less/app', 'less/lib/bootstrap', 'less/lib/font-awesome'],
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

  grunt.registerTask('build', 'less:dev requirejs');

};
