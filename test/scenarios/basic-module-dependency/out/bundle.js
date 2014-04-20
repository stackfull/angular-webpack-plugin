([
function(module, exports, __webpack_require__) {
  // 'dependency'
  __webpack_require__(1);

  (function(angular) {
    (module.exports['myModule'] = angular.module('myModule', ['dependency']));
  }.call(exports, __webpack_require__(2)))

},
function(module, exports, __webpack_require__) {

  (function(angular) {
    (module.exports['dependency'] = angular.module('dependency', []));
  }.call(exports, __webpack_require__(2)))
},
function(module, exports, __webpack_require__) {
  // stub
}
])
