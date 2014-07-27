
([
function(module, exports, __webpack_require__) {
  __webpack_require__(1);
  __webpack_require__(1);
  (function(angular) {
    (module.exports['myModule'] = angular.module('myModule', ['lib.mod1', 'lib.mod2']));
  }.call(exports, __webpack_require__(2)))
},
function(module, exports, __webpack_require__) {
  (function(angular) {
    (module.exports['lib.common'] = angular.module('lib.common', []));
	(module.exports['lib.mod1'] = angular.module('lib.mod1', ['lib.common']));
	(module.exports['lib.mod2'] = angular.module('lib.mod2', ['lib.common']));
  }.call(exports, __webpack_require__(2)))
},
function(module, exports, __webpack_require__) {
  module.exports = window.angular
}
])
