// Karma configuration
var path = require('path');
var AngularPlugin = require('../../../lib');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'verify/**/*.js'
    ],
    exclude: [
    ],
    preprocessors: {
      'verify/**/*.js': ['webpack']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    webpack: {
      debug: true,
      resolve: {
        root: path.resolve(__dirname, 'in'),
        alias: {
          angular$: path.resolve(__dirname, '../../vendor/angular/angular.js'),
          ngRoute$: path.resolve(__dirname, '../../vendor/angular/angular-route.js')
        }
      },
      plugins: [new AngularPlugin()]
    }
  });
};
