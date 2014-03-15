'use strict';
var _ = require('lodash');

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  grunt.task.loadTasks('tasks');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      }
    },
    webpackScenario: _.object(_.map(grunt.file.expand({cwd:'scenarios'}, '*'), function(test){
      return [test, { src: ['scenarios/'+test+'/webpack.conf.js'] }];
    })),
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: ['scenarios/**/*'],
        tasks: ['webpackScenario']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'webpackScenario']);


};
