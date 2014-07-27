var path = require('path');
var AngularPlugin = require('../../../lib');

module.exports = {
  entry: "main",
  resolve: {
    root: path.resolve(__dirname, 'in'),
    alias: {
      myLibrary: 'alib/src'
    }
  },
  plugins: [new AngularPlugin()]
};
