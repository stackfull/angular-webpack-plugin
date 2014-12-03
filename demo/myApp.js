var myApp = angular.module('myApp', ['dependency', 'ngRoute']);

myApp.run(function($document){
    $document[0].write('Hello from myApp. ');
});