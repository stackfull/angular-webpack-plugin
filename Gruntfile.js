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
    webpackScenario: _.object(_.filter(_.map(scenarios, function(test){
      var confFile = path.resolve('test', 'scenarios', test, 'webpack.conf.js');
      if( grunt.file.exists(confFile) ){
        return [test, { src: [confFile] }];
      }else{
        return null;
      }
    }))),
    karma: _.object(_.filter(_.map(scenarios, function(test){
      var confFile = path.resolve('test', 'scenarios', test, 'karma.conf.js');
      if( grunt.file.exists(confFile) ){
        return [test, {
          configFile: confFile,
          logLevel: 'DEBUG',
          singleRun: true,
        }];
      }else{
        return null;
      }
    }))),
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
  grunt.registerTask('default', ['jshint', 'webpackScenario', 'karma']);


};
