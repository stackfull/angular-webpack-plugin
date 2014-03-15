/* 0 */
/***/ function(module, exports, require) {

  /* WEBPACK VAR INJECTION */(function(require, angular) {// 1 dep
    angular.module('myModule', [require(1).name]);
    /* WEBPACK VAR INJECTION */}.call(exports, require, require(2)))

/***/ },
/* 1 */
/***/ function(module, exports, require) {

  /* WEBPACK VAR INJECTION */(function(require, angular) {
	angular.module('dependency', []);
    /* WEBPACK VAR INJECTION */}.call(exports, require, require(2)))

/***/ },
/* 2 */
/***/ function(module, exports, require) {
	// stub for angular module
/***/ }
