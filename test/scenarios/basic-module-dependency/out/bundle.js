/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

        __webpack_require__(1);
        /* WEBPACK VAR INJECTION */(function(angular) {// 1 dep
        (module.exports['myModule'] = angular.module('myModule', ['dependency'])
);

        /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

        /* WEBPACK VAR INJECTION */(function(angular) {
        (module.exports['dependency'] = angular.module('dependency', []));

        /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {


        // stub for angular module


        /*** EXPORTS FROM exports-loader ***/
        module.exports = window.angular

/***/ }
/******/ ])