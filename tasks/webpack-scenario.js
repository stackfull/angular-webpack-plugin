
'use strict';

var path = require('path');
var webpack = require('webpack');
var async = require('async');
var _ = require('lodash');
_.str = require('underscore.string');
var UglifyJS = require("uglify-js");

function MockFileSystemPlugin() {
  this.files = {};
}

MockFileSystemPlugin.prototype.apply = function(compiler){
  var files = this.files;
  compiler.plugin('run', function(c, cb){
    compiler.outputFileSystem = {
      join: path.join.bind(path),
      mkdirp: function(path, callback) {
        files[path] = '__dir__';
        callback();
      },
      writeFile: function(name, content, callback) {
        files[name] = content.toString("utf-8");
        callback();
      }
    };
    cb();
  });
};

var IGNORE_BEFORE = //"/******/ ([";
"/************************************************************************/";

function normalise(content){
  return UglifyJS.minify(content, {
    fromString: true,
    //mangle: false,
    compress: false
  }).code;
}

module.exports = function(grunt){

  grunt.registerMultiTask('webpackScenario',
                          "Run webpack scenarios and check the output",
                          function(){
    grunt.log.debug('Run scenarios '+ this.filesSrc);
    async.each(this.filesSrc, function(confFile, cb){
      var mockFs = new MockFileSystemPlugin();
      var config = require(path.resolve(confFile));
      config = _.merge({
        resolve: {
          root: path.resolve(confFile, '..', 'in'),
          alias: {
            angular: path.resolve(__dirname, 'stubng.js')
          }
        },
      }, config);
      config.plugins = [
        mockFs
      ].concat(config.plugins || []);
      webpack(config, function(err, stats){
        if( err ){
          grunt.log.error("Fatal error running webpack: "+err);
        }else if( stats.hasErrors() || stats.hasWarnings() ){
          stats = stats.toJson();
          grunt.log.error("Errors in compilation [%d err, %d warn]",
                          stats.errors.length, stats.warnings.length);
          stats.errors.forEach(grunt.log.error);
          stats.warnings.forEach(grunt.log.warn);
          cb(new Error("Compilation failes"));
        }else{
          var errors = [];
          grunt.file.recurse(path.resolve(confFile, '..', 'out'),
                             function(abspath, root, subdir, filename){
            var p = subdir ? path.join(subdir, filename) : filename;
            grunt.log.debug("Checking for %s from %s", p, confFile);
            if( _.has(mockFs.files, p) ){
              var actual = mockFs.files[p];
              actual = _.str.strRight(actual, IGNORE_BEFORE);
              var expected = grunt.file.read(abspath);
              var actualZ = normalise(actual);
              var expectedZ = normalise(expected);
              if( expectedZ !== actualZ){
                errors.push(p + " didn't match expected content");
                if( grunt.option('debug') ){
                  grunt.log.debug("Expected:");
                  process.stdout.write(expected);
                  grunt.log.debug("Actual:");
                  process.stdout.write(actual);
                //grunt.file.write('bundle.js', actual);
                }
              }
            }else{
              errors.push("Didn't find " + p + " after compilation");
            }
          });
          if( _.isEmpty(errors) ){
            grunt.log.debug("compiled "+confFile+" OK.");
            cb();
          }else{
            cb(new Error(errors.join('\n')));
          }
        }
      });
    }, this.async());

  });

};
