var myApp = angular.module('myApp', ['dependency']);

myApp.run(function($document){
    $document[0].write('Hello from myApp. ');
});