([
  function(module, exports, __webpack_require__) {
  __webpack_require__(2);
  __webpack_require__(1);
  (function(angular) {
    (module.exports['main'] = angular.module('main', ['myLibrary.one', 'myLibrary.two.something']));
  }.call(exports, __webpack_require__(3)))
},
function(module, exports, __webpack_require__) {
  (function(angular) {
    (module.exports['myLibrary.one'] = angular.module('myLibrary.one', []));
    }.call(exports, __webpack_require__(3)))
},
function(module, exports, __webpack_require__) {
  (function(angular) {
    (module.exports['myLibrary.two.something'] = angular.module('myLibrary.two.something', []));
    }.call(exports, __webpack_require__(3)))
},
function(module, exports, __webpack_require__) {
  module.exports = window.angular
}
])

