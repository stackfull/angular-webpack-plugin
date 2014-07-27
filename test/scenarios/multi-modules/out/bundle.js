([
  function(module, exports, __webpack_require__) {

  (function(angular) {
    (module.exports['common'] = angular.module('common', []));
    angular.module('common').config(function(){});

    // Note that it is not helpful to replace ['common'] with module.name here
    (module.exports['mod1'] = angular.module('mod1', ['common']));

    (module.exports['mod2'] = angular.module('mod2', ['common']));

    angular.module('mod2').config(function(){});

    (module.exports['myModule'] = angular.module('myModule', ['mod1', 'mod2']));

  }.call(exports, __webpack_require__(1)))
},
function(module, exports, __webpack_require__) {
  module.exports = window.angular
}
])
