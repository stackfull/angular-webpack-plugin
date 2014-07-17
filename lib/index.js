// © Copyright 2014 Paul Thomas <paul@stackfull.com>.
// Licensed under the MIT license.
//
// Main entry point of the angular-webpack-plugin module
// Defines a plugin for webpack to help it understand angular modules.

var path = require('path');

var LocalModulesHelpers = require("webpack/lib/dependencies/LocalModulesHelpers");
var NullFactory = require("webpack/lib/NullFactory");
var ModuleParserHelpers = require("webpack/lib/ModuleParserHelpers");
var RequireHeaderDependency = require("webpack/lib/dependencies/RequireHeaderDependency");

var AngularModuleDependency = require('./AngularModuleDependency');
var AngularModuleDefinition = require('./AngularModuleDefinition');

function AngularPlugin() {
}

module.exports = AngularPlugin;

function bindCallbackMethod(source, plugname, obj, method){
  source.plugin(plugname, method.bind(obj, source));
}

function containsSlash(str){
  return str.indexOf("/") >= 0 || str.indexOf("\\") >= 0;
}

// Try to resolve a file of the form /somepath/module/module
// (calling it modmod for want of a better term)
function resolveModModFile(resolver, request, callback){
  var joined = path.join(request.request, request.request);
  return resolver.doResolve("file", {
    path: request.path,
    request: joined,
    query: request.query
  }, callback, true);
}

function requestIsModModFile(request){
  if( containsSlash(request.request) || ! request.file ){
    return false;
  }
  var starting = request.path.length - request.request.length;
  var match = request.path.lastIndexOf(request.request);
  return match === starting &&
    (request.path[starting-1] === '/' || request.path[starting-1] === '\\');
}

AngularPlugin.prototype = {
  constructor: AngularPlugin,

  // This is the entrypoint that is called when the plugin is added to a
  // compiler
  apply: function(compiler){
    bindCallbackMethod(compiler, "compilation",
                       this, this.addDependencyFactories);
    bindCallbackMethod(compiler.parser, "expression angular",
                       this, this.addAngularVariable);
    bindCallbackMethod(compiler.parser, "call angular.module",
                       this, this.parseModuleCall);
    bindCallbackMethod(compiler.resolvers.normal, "module-module",
                       this, this.resolveModule);
  },

  // #### Plugin Callbacks

  // This sets up the compiler with the right dependency module factories
  addDependencyFactories: function(compiler, compilation, params){
    compilation.dependencyFactories.set(AngularModuleDependency,
                                        params.normalModuleFactory);
    compilation.dependencyTemplates.set(AngularModuleDependency,
                                        new AngularModuleDependency.Template());
    compilation.dependencyFactories.set(AngularModuleDefinition,
                                        new NullFactory());
    compilation.dependencyTemplates.set(AngularModuleDefinition,
                                        new AngularModuleDefinition.Template());
  },

  // This injects the angular module wherever it's used.
  addAngularVariable: function(parser) {
    return ModuleParserHelpers.addParsedVariable(parser, 'angular', "require('exports?window.angular!angular')");
  },

  // Each call to `angular.module()` is analysed here
  parseModuleCall: function(parser, expr){
    this.addAngularVariable(parser);
    switch(expr.arguments.length){
      case 1: return this._parseModuleCallSingleArgument(parser, expr);
      case 2: return this._parseModuleCallTwoArgument(parser, expr);
      case 3: return this._parseModuleCallThreeArgument(parser, expr);
      default:
        console.warn("Don't recognise angular.module() with " +
                     expr.arguments.length + " args");
    }
  },

  // Additional module resolving specific to angular modules.
  //
  // We're trying to follow as many existing conventions as possible. Including:
  // - dots as path separators
  // - camelCase module names convert to dashed file names
  // - module, directory and file names all the same.
  // - files containing multiple modules (shared prefix)
  //
  resolveModule: function(resolver, request, callback){
    if( containsSlash(request.request) ){
      return callback();
    }
    var split = request.request.split('.');
    if( split.length === 1 ) {
      if( ! requestIsModModFile(request) ){
        return resolveModModFile(resolver, request, callback);
      }
    }else{
      // Try treating `.` as a path separator, but in a non-greedy way.
      // There are lots of options here because we allow the file name to be
      // just a prefix.
      // prefer the segments to be directories and prefer the full name to be
      // used.
      var pairs = [];
      for( var j = 0; j > (0-split.length); j-- ){
        var cropped = split.slice(0, j || undefined);
        for( var i = 0; i < cropped.length; i++ ){
          pairs.push({ front: cropped.slice(0, i), back: cropped.slice(i) });
        }
      }
      pairs.shift();
      var requests = pairs.map(function(p){
        return {
          path: path.join.apply(path, [request.path].concat(p.front)),
          request: p.back.join('.'),
          query: request.query
        };
      });

      return resolver.forEachBail(requests, function(req, cb){
        return resolver.doResolve("module", req, cb, true);
      }, function(err, resolved){
        if( err || !resolved ){
          return callback(err);
        }
        if( resolved.file ){
          // We're taking this as resolved. It should contain other modules with
          // this prefix
          return resolver.doResolve("result", resolved, callback);
        }
        if(callback.log){
          callback.log(" is not an angular module");
        }
        callback();
      });
    }
    return callback();
  },

  // #### Private Methods

  // A single argument is the equivalent of `require()`
  // angular.module(name)
  _parseModuleCallSingleArgument: function(parser, expr) {
    var mod = parser.evaluateExpression(expr.arguments[0]);
    return this._addDependency(parser, expr, mod);
  },

  // 2 arguments mean a module definition if the 2nd is an array.
  // angular.module(name, requires)
  // angular.module(name, configFn)
  _parseModuleCallTwoArgument: function(parser, expr) {
    var mod = parser.evaluateExpression(expr.arguments[0]);
    var deps = parser.evaluateExpression(expr.arguments[1]);
    this._addModuleDefinition(parser, expr, mod);
    if( deps.items ){
      return deps.items.every(
        this._addDependency.bind(this, parser, expr));
    }
    return this._addDependency(parser, expr, mod);
  },

  // 3 arguments must be a module definition
  // angular.module(name, requires, configFn)
  _parseModuleCallThreeArgument: function(parser, expr) {
    var mod = parser.evaluateExpression(expr.arguments[0]);
    var deps = parser.evaluateExpression(expr.arguments[1]);
    this._addModuleDefinition(parser, expr, mod);
    return deps.items.every(
      this._addDependency.bind(this, parser, expr));
  },

  _addModuleDefinition: function(parser, expr, mod){
    var dep = new AngularModuleDefinition(expr.range, mod.string);
    dep.loc = expr.loc;
    dep.localModule = LocalModulesHelpers.addLocalModule(parser.state, mod.string);
    parser.state.current.addDependency(dep);
    return true;
  },

  // A dependency (module) has been found
  _addDependency: function(parser, expr, param){
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
      var localModule = LocalModulesHelpers.getLocalModule(parser.state, param.string);
      if( localModule ) {
        return true;
      }
      dep = new AngularModuleDependency(param.string, param.range);
      dep.loc = param.loc;
      parser.state.current.addDependency(dep);
      return true;
    }
    parser.applyPluginsBailResult("call require:commonjs:context", expr, param);
    return true;
  }

};
