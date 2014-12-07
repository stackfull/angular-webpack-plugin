var path = require('path');
var AngularPlugin = require('../../../lib');
module.exports = {
  entry: "main.js",
  resolve: {
    alias: {
      ngRoute$: path.resolve(__dirname, '../../vendor/angular/angular-route.js')
    }
  },
  plugins: [new AngularPlugin()]
};
