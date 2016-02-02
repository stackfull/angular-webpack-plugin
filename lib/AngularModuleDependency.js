// © Copyright 2014 Paul Thomas <paul@stackfull.com>.
// Licensed under the MIT license.
//
// Dependency definitions for angular modules


var ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');

function AngularModuleDependencyTemplate() {}

// The dependency template leaves the dependency array as the original strings
// so that angular can deal with out-of-order definitions. But a
// __webpack_require__ is inserted at the top to make sure the file is pulled
// in.
AngularModuleDependencyTemplate.prototype = {
  constructor: AngularModuleDependencyTemplate,
  apply: function(dep, source, outputOptions, requestShortener){
    if( !dep.range ){
      return;
    }
    var comment = "", content = "__webpack_require__(";
    if(outputOptions.pathinfo){
      comment += "/*! " + requestShortener.shorten(dep.request) + " */ ";
    }
    if(dep.module){
      content += comment + dep.module.id;
    }else{
      content += "!(function webpackMissingModule() { throw new Error(" +
        JSON.stringify("Cannot find module \"" + dep.request + "\"") + "); }())";
    }
    content += ");\n";
    source.insert(0, content);
  },
  applyAsTemplateArgument: function(name, dep, source){
    if( !dep.range ){
      return;
    }
    source.replace(dep.range[0], dep.range[1]-1, name);
  }
};

function AngularModuleDependency(request, range){
  ModuleDependency.call(this, request);
  this.Class = AngularModuleDependency;
  this.range = range;
}

AngularModuleDependency.prototype = Object.create(ModuleDependency.prototype);
AngularModuleDependency.prototype.constructor = AngularModuleDependency;
AngularModuleDependency.prototype.type = 'angular module';

AngularModuleDependency.Template = AngularModuleDependencyTemplate;


module.exports = AngularModuleDependency;
