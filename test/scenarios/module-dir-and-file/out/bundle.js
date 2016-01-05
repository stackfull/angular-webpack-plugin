([
  function(module, exports, __webpack_require__) {
  __webpack_require__(1);
  __webpack_require__(2);
  (function(angular) {
    (module.exports['myModule'] = angular.module('myModule', ['component', 'component.two']));
  }.call(exports, __webpack_require__(3)))
},
function(module, exports, __webpack_require__) {
  (function(angular) {
    (module.exports['component'] = angular.module('component', []));
    }.call(exports, __webpack_require__(3)))
},
function(module, exports, __webpack_require__) {
  (function(angular) {
    (module.exports['component.two'] = angular.module('component.two', []));
    }.call(exports, __webpack_require__(3)))
},
function(module, exports, __webpack_require__) {
  (function(angular) {
  module.exports = window.angular
    }.call(exports, __webpack_require__(3)))
}
])
