// © Copyright 2014 Paul Thomas <paul@stackfull.com>.
// Licensed under the MIT license.
//
// Module definition for angular modules

var NullDependency = require('webpack/lib/dependencies/NullDependency');

function AngularModuleDefinition(range){
  NullDependency.call(this);
  this.Class = AngularModuleDefinition;
  this.range = range;
}
module.exports = AngularModuleDefinition;

AngularModuleDefinition.prototype = Object.create(NullDependency.prototype);
AngularModuleDefinition.prototype.type = "angular module define";

