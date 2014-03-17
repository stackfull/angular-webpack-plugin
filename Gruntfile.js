'use strict';
var _ = require('lodash');
var path = require('path');

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  grunt.task.loadTasks('tasks');

  var scenarios = grunt.file.expand({cwd:'test/scenarios'}, '*');
  grunt.log.writeln("scenarios: ", scenarios);

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
    webpackScenario: _.object(_.map(scenarios, function(test){
      return [test, { src: ['test/scenarios/'+test+'/webpack.conf.js'] }];
    })),
    karma: _.object(_.map(scenarios, function(test){
      return [test, {
        configFile: path.resolve('test', 'scenarios', test, 'karma.conf.js'),
        logLevel: 'DEBUG',
        singleRun: true,
      }];
    })),
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'webpackScenario']
      },
      test: {
        files: ['test/**/*'],
        tasks: ['webpackScenario']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'webpackScenario']);


};
