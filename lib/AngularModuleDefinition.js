// © Copyright 2014 Paul Thomas <paul@stackfull.com>.
// Licensed under the MIT license.
//
// Module definition for angular modules

var NullDependency = require('webpack/lib/dependencies/NullDependency');

function AngularModuleDefinitionTemplate() {}

// The definition template leaves the call to angular.module as-is, but assigns
// the result to an export with the module name.
//
AngularModuleDefinitionTemplate.prototype = {
  constructor: AngularModuleDefinitionTemplate,
  apply: function(dep, source){
    source.replace(dep.range[0], dep.range[0]-1,
                   "(module.exports['"+dep.name+"'] = ");
    source.replace(dep.range[1], dep.range[1]-1, ")");
  }
};


function AngularModuleDefinition(range, name){
  NullDependency.call(this);
  this.Class = AngularModuleDefinition;
  this.range = range;
  this.name = name;
}

AngularModuleDefinition.prototype = Object.create(NullDependency.prototype);
AngularModuleDefinition.prototype.constructor = AngularModuleDefinition;
AngularModuleDefinition.prototype.type = "angular module define";
AngularModuleDefinition.Template = AngularModuleDefinitionTemplate;

module.exports = AngularModuleDefinition;
