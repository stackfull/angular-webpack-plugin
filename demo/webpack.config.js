var AngularPlugin = require('angular-webpack-plugin');
var path = require('path');
module.exports = {
    entry: "myApp",
    output: {
        path: __dirname,
        filename: "generated_bundle.js"
    },
    resolve: {
        root: [ process.cwd(), path.resolve('bower_components') ]
    },
    plugins: [new AngularPlugin()]

};