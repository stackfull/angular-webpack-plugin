// © Copyright 2014 Paul Thomas <paul@stackfull.com>.
// Licensed under the MIT license.
//
// Module definition for angular modules

var NullDependency = require('webpack/lib/dependencies/NullDependency');

function AngularModuleDefinitionTemplate() {}

AngularModuleDefinitionTemplate.prototype = {
  constructor: AngularModuleDefinitionTemplate,
  apply: function(dep, source){
    var localModuleVar = dep.localModule.variableName();
    source.insert(0, "var "+localModuleVar+";\n");
    source.replace(dep.range[0], dep.range[0]-1, "("+localModuleVar+" = module.exports = ");
    source.replace(dep.range[1], dep.range[1]-1, ")");
  }
};


function AngularModuleDefinition(range){
  NullDependency.call(this);
  this.Class = AngularModuleDefinition;
  this.range = range;
}

AngularModuleDefinition.prototype = Object.create(NullDependency.prototype);
AngularModuleDefinition.prototype.type = "angular module define";
AngularModuleDefinition.Template = AngularModuleDefinitionTemplate;

module.exports = AngularModuleDefinition;
