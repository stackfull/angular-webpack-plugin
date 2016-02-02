([
  function(module, exports, __webpack_require__) {

  __webpack_require__(2);

  (function(angular) {
    (module.exports['main'] = angular.module('main', ['component.one' ]));
  }.call(exports, __webpack_require__(1)))
},
function(module, exports, __webpack_require__) {
  (function(angular) {
  // stub
  module.exports = window.angular
  }.call(exports, __webpack_require__(1)))
},
function(module, exports, __webpack_require__) {
  (function(angular) {
    (module.exports['component.one'] = angular.module('component.one', []));
  }.call(exports, __webpack_require__(1)))
}
])
