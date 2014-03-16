// © Copyright 2014 Paul Thomas <paul@stackfull.com>.
// Licensed under the MIT license.
//
// Main entry point of the angular-webpack-plugin module
// Defines a plugin for webpack to help it understand angular modules.

var path = require('path');

var LocalModulesHelpers = require("webpack/lib/dependencies/LocalModulesHelpers");
var LocalModuleDependency = require("webpack/lib/dependencies/LocalModuleDependency");
var NullFactory = require("webpack/lib/NullFactory");
var ModuleParserHelpers = require("webpack/lib/ModuleParserHelpers");
var RequireHeaderDependency = require("webpack/lib/dependencies/RequireHeaderDependency");

var AngularModuleDependency = require('./AngularModuleDependency');
var AngularModuleDefinition = require('./AngularModuleDefinition');

function AngularPlugin() {}

module.exports = AngularPlugin;


AngularPlugin.prototype = {
  constructor: AngularPlugin,

  // This is the entrypoint that is called when the plugin is added to a
  // compiler
  apply: function(compiler){
    compiler.plugin("compilation", this.addDependencyFactories.bind(this));
    compiler.parser.plugin('expression angular', function(){
      return ModuleParserHelpers.addParsedVariable(this, 'angular',
                                                   "require('angular')");
    });
    compiler.parser.plugin('call angular.module',
                           this.parseModuleCall.bind(this, compiler.parser));
    compiler.resolvers.normal.plugin('module-module',
                                     this.resolveModule.bind(this, compiler.resolvers.normal));
  },

  // This sets up the compiler with the right dependency module factories
  addDependencyFactories: function(compilation, params){
    compilation.dependencyFactories.set(AngularModuleDependency,
                                        params.normalModuleFactory);
    compilation.dependencyTemplates.set(AngularModuleDependency,
                                        new AngularModuleDependency.Template());
    compilation.dependencyFactories.set(AngularModuleDefinition,
                                        new NullFactory());
    compilation.dependencyTemplates.set(AngularModuleDefinition,
                                        new AngularModuleDefinition.Template());
  },

  // Each call to `angular.module()` is analysed here
  parseModuleCall: function(parser, expr){
      var mod, deps;
      ModuleParserHelpers.addParsedVariable(parser, 'angular', 
                                            "require('angular')");
      switch(expr.arguments.length){
      // A single argument is the equivalent of `require()`
      case 1:
        mod = parser.evaluateExpression(expr.arguments[0]);
        return this._addDependencyForParameter(parser, expr, mod);
      // 2 arguments mean a module definition if the 2nd is an array.
      case 2:
        mod = parser.evaluateExpression(expr.arguments[0]);
        // TODO: should we check the module name?
        this._addModuleDefinition(parser, expr, mod);
        deps = parser.evaluateExpression(expr.arguments[1]);
        if( deps.items ){
          return deps.items.every(
            this._addDependencyForParameter.bind(this, parser, expr));
        }
        return this._addDependencyForParameter(parser, expr, mod);
      // 3 arguments must be a module definition
      case 3:
        mod = parser.evaluateExpression(expr.arguments[0]);
        // TODO: should we check the module name?
        this._addModuleDefinition(parser, expr, mod);
        deps = parser.evaluateExpression(expr.arguments[1]);
        return deps.items.every(
          this._addDependencyForParameter.bind(this, parser, expr));
      default:
        console.warn("Don't recognise angular.module() with " +
                     expr.arguments.length + " args");
      }
  },

  resolveModule: function(resolver, request, callback){
    var fs = resolver.fileSystem;
    var i = request.request.indexOf(".");
    if(i < 0) {
      // Try resolving a file of the form module/module
      return resolver.doResolve("file", {
        path: request.path,
        request: path.join(request.request, request.request),
        query: request.query
      }, callback, true);
    }
    // Try treating `.` as a path separator
    var moduleName = request.request.substr(0, i);
    var remainingRequest = request.request.substr(i+1);
    var modulePath = resolver.join(request.path, moduleName);
    fs.stat(modulePath, function(err, stat) {
      if(err || !stat) {
        if(callback.log){
          callback.log(modulePath + " doesn't exist (ng module as directory)");
        }
        return callback();
      }
      if(stat.isDirectory()) {
        var types = request.directory ? "directory" : ["file", "directory"];
        return resolver.doResolve(types, {
          path: modulePath,
          request: remainingRequest,
          query: request.query
        }, callback, true);
      }
      if(callback.log){
        callback.log(modulePath + " is not a directory (ng module as directory)");
      }
      return callback();
    });
  },


  _addModuleDefinition: function(parser, expr, mod){
    var dep = new AngularModuleDefinition(expr.range);
    dep.loc = expr.loc;
    dep.localModule = LocalModulesHelpers.addLocalModule(parser.state, mod.string);
    parser.state.current.addDependency(dep);
    return true;
  },

  // A dependency (module) has been found
  _addDependencyForParameter: function(parser, expr, param){
    if( param.isConditional() ){
      // TODO: not sure what this will output
      parser.state.current.addDependency(
        new RequireHeaderDependency(expr.callee.range));
      param.options.forEach(function(param) {
        var result = parser.applyPluginsBailResult("call require:commonjs:item",
                                                 expr, param);
        if(result === undefined) {
          throw new Error(
            "Cannot convert options with mixed known and unknown stuff");
        }
      });
      return true;
    }
    if( param.isString() ){
      var dep;
      var localModule = LocalModulesHelpers.getLocalModule(parser.state,
                                                           param.string);
      if( localModule ){
        dep = new LocalModuleDependency(localModule, expr.range);
        dep.loc = expr.loc;
        parser.state.current.addDependency(dep);
        return true;
      }
      dep = new AngularModuleDependency(param.string, param.range);
      dep.log = expr.loc;
      parser.state.current.addDependency(dep);
      return true;
    }
    parser.applyPluginsBailResult("call require:commonjs:context", expr, param);
    return true;
  }

};
