var dependency = angular.module('dependency', []);

dependency.run(function($document){
   $document[0].write('Hello from dependency. ')
});