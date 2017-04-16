var AngularPlugin = require('angular-webpack-plugin');
var path = require('path');

module.exports = {
    entry: "myApp",
    output: {
        path: __dirname,
        filename: "generated_bundle.js"
    },
    resolve: {
        root: [ process.cwd(), path.resolve('bower_components') ],
        alias:{
            // This is needed because the module name doesn't match the file name
            // but we don't need to locate the file because it is a bower component
            // with a file name the same as the directory (component) name:
            //  bower_components/angular-route/angular-route
            ngRoute: 'angular-route'
        }
    },
    plugins: [new AngularPlugin()]

};