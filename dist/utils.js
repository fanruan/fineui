/*! time: 2020-9-7 17:30:04 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1081);
/******/ })
/************************************************************************/
/******/ ({

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Created by richie on 15/7/8.
 */
/**
 * 初始化BI对象
 */
_global = undefined;
if (typeof window !== "undefined") {
    _global = window;
} else if (typeof global !== "undefined") {
    _global = global;
} else if (typeof self !== "undefined") {
    _global = self;
} else {
    _global = this;
}
if (_global.BI == null) {
    _global.BI = {prepares: []};
}
if(_global.BI.prepares == null) {
    _global.BI.prepares = [];
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13)))

/***/ }),

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(103)(__webpack_require__(104))

/***/ }),

/***/ 103:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ }),

/***/ 104:
/***/ (function(module, exports) {

module.exports = "/**\n * @license\n * Lodash (Custom Build) <https://lodash.com/>\n * Build: `lodash core plus=\"debounce,throttle,get,set,findIndex,findLastIndex,findKey,findLastKey,isArrayLike,invert,invertBy,uniq,uniqBy,omit,omitBy,zip,unzip,rest,range,random,reject,intersection,drop,countBy,union,zipObject,initial,cloneDeep,clamp,isPlainObject,take,takeRight,without,difference,defaultsDeep,trim,merge,groupBy,uniqBy,before,after\"`\n * Copyright JS Foundation and other contributors <https://js.foundation/>\n * Released under MIT license <https://lodash.com/license>\n * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>\n * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n */\n;(function() {\n\n  /** Used as a safe reference for `undefined` in pre-ES5 environments. */\n  var undefined;\n\n  /** Used as the semantic version number. */\n  var VERSION = '4.17.5';\n\n  /** Used as the size to enable large array optimizations. */\n  var LARGE_ARRAY_SIZE = 200;\n\n  /** Error message constants. */\n  var FUNC_ERROR_TEXT = 'Expected a function';\n\n  /** Used to stand-in for `undefined` hash values. */\n  var HASH_UNDEFINED = '__lodash_hash_undefined__';\n\n  /** Used as the maximum memoize cache size. */\n  var MAX_MEMOIZE_SIZE = 500;\n\n  /** Used as the internal argument placeholder. */\n  var PLACEHOLDER = '__lodash_placeholder__';\n\n  /** Used to compose bitmasks for cloning. */\n  var CLONE_DEEP_FLAG = 1,\n      CLONE_FLAT_FLAG = 2,\n      CLONE_SYMBOLS_FLAG = 4;\n\n  /** Used to compose bitmasks for value comparisons. */\n  var COMPARE_PARTIAL_FLAG = 1,\n      COMPARE_UNORDERED_FLAG = 2;\n\n  /** Used to compose bitmasks for function metadata. */\n  var WRAP_BIND_FLAG = 1,\n      WRAP_BIND_KEY_FLAG = 2,\n      WRAP_CURRY_BOUND_FLAG = 4,\n      WRAP_CURRY_FLAG = 8,\n      WRAP_CURRY_RIGHT_FLAG = 16,\n      WRAP_PARTIAL_FLAG = 32,\n      WRAP_PARTIAL_RIGHT_FLAG = 64,\n      WRAP_ARY_FLAG = 128,\n      WRAP_REARG_FLAG = 256,\n      WRAP_FLIP_FLAG = 512;\n\n  /** Used to detect hot functions by number of calls within a span of milliseconds. */\n  var HOT_COUNT = 800,\n      HOT_SPAN = 16;\n\n  /** Used to indicate the type of lazy iteratees. */\n  var LAZY_FILTER_FLAG = 1,\n      LAZY_MAP_FLAG = 2,\n      LAZY_WHILE_FLAG = 3;\n\n  /** Used as references for various `Number` constants. */\n  var INFINITY = 1 / 0,\n      MAX_SAFE_INTEGER = 9007199254740991,\n      MAX_INTEGER = 1.7976931348623157e+308,\n      NAN = 0 / 0;\n\n  /** Used as references for the maximum length and index of an array. */\n  var MAX_ARRAY_LENGTH = 4294967295;\n\n  /** Used to associate wrap methods with their bit flags. */\n  var wrapFlags = [\n    ['ary', WRAP_ARY_FLAG],\n    ['bind', WRAP_BIND_FLAG],\n    ['bindKey', WRAP_BIND_KEY_FLAG],\n    ['curry', WRAP_CURRY_FLAG],\n    ['curryRight', WRAP_CURRY_RIGHT_FLAG],\n    ['flip', WRAP_FLIP_FLAG],\n    ['partial', WRAP_PARTIAL_FLAG],\n    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],\n    ['rearg', WRAP_REARG_FLAG]\n  ];\n\n  /** `Object#toString` result references. */\n  var argsTag = '[object Arguments]',\n      arrayTag = '[object Array]',\n      asyncTag = '[object AsyncFunction]',\n      boolTag = '[object Boolean]',\n      dateTag = '[object Date]',\n      errorTag = '[object Error]',\n      funcTag = '[object Function]',\n      genTag = '[object GeneratorFunction]',\n      mapTag = '[object Map]',\n      numberTag = '[object Number]',\n      nullTag = '[object Null]',\n      objectTag = '[object Object]',\n      promiseTag = '[object Promise]',\n      proxyTag = '[object Proxy]',\n      regexpTag = '[object RegExp]',\n      setTag = '[object Set]',\n      stringTag = '[object String]',\n      symbolTag = '[object Symbol]',\n      undefinedTag = '[object Undefined]',\n      weakMapTag = '[object WeakMap]';\n\n  var arrayBufferTag = '[object ArrayBuffer]',\n      dataViewTag = '[object DataView]',\n      float32Tag = '[object Float32Array]',\n      float64Tag = '[object Float64Array]',\n      int8Tag = '[object Int8Array]',\n      int16Tag = '[object Int16Array]',\n      int32Tag = '[object Int32Array]',\n      uint8Tag = '[object Uint8Array]',\n      uint8ClampedTag = '[object Uint8ClampedArray]',\n      uint16Tag = '[object Uint16Array]',\n      uint32Tag = '[object Uint32Array]';\n\n  /** Used to match HTML entities and HTML characters. */\n  var reUnescapedHtml = /[&<>\"']/g,\n      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);\n\n  /** Used to match property names within property paths. */\n  var reIsDeepProp = /\\.|\\[(?:[^[\\]]*|([\"'])(?:(?!\\1)[^\\\\]|\\\\.)*?\\1)\\]/,\n      reIsPlainProp = /^\\w*$/,\n      rePropName = /[^.[\\]]+|\\[(?:(-?\\d+(?:\\.\\d+)?)|([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))/g;\n\n  /**\n   * Used to match `RegExp`\n   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).\n   */\n  var reRegExpChar = /[\\\\^$.*+?()[\\]{}|]/g;\n\n  /** Used to match leading and trailing whitespace. */\n  var reTrim = /^\\s+|\\s+$/g;\n\n  /** Used to match wrap detail comments. */\n  var reWrapComment = /\\{(?:\\n\\/\\* \\[wrapped with .+\\] \\*\\/)?\\n?/,\n      reWrapDetails = /\\{\\n\\/\\* \\[wrapped with (.+)\\] \\*/,\n      reSplitDetails = /,? & /;\n\n  /** Used to match backslashes in property paths. */\n  var reEscapeChar = /\\\\(\\\\)?/g;\n\n  /** Used to match `RegExp` flags from their coerced string values. */\n  var reFlags = /\\w*$/;\n\n  /** Used to detect bad signed hexadecimal string values. */\n  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;\n\n  /** Used to detect binary string values. */\n  var reIsBinary = /^0b[01]+$/i;\n\n  /** Used to detect host constructors (Safari). */\n  var reIsHostCtor = /^\\[object .+?Constructor\\]$/;\n\n  /** Used to detect octal string values. */\n  var reIsOctal = /^0o[0-7]+$/i;\n\n  /** Used to detect unsigned integer values. */\n  var reIsUint = /^(?:0|[1-9]\\d*)$/;\n\n  /** Used to compose unicode character classes. */\n  var rsAstralRange = '\\\\ud800-\\\\udfff',\n      rsComboMarksRange = '\\\\u0300-\\\\u036f',\n      reComboHalfMarksRange = '\\\\ufe20-\\\\ufe2f',\n      rsComboSymbolsRange = '\\\\u20d0-\\\\u20ff',\n      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,\n      rsVarRange = '\\\\ufe0e\\\\ufe0f';\n\n  /** Used to compose unicode capture groups. */\n  var rsAstral = '[' + rsAstralRange + ']',\n      rsCombo = '[' + rsComboRange + ']',\n      rsFitz = '\\\\ud83c[\\\\udffb-\\\\udfff]',\n      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',\n      rsNonAstral = '[^' + rsAstralRange + ']',\n      rsRegional = '(?:\\\\ud83c[\\\\udde6-\\\\uddff]){2}',\n      rsSurrPair = '[\\\\ud800-\\\\udbff][\\\\udc00-\\\\udfff]',\n      rsZWJ = '\\\\u200d';\n\n  /** Used to compose unicode regexes. */\n  var reOptMod = rsModifier + '?',\n      rsOptVar = '[' + rsVarRange + ']?',\n      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',\n      rsSeq = rsOptVar + reOptMod + rsOptJoin,\n      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';\n\n  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */\n  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');\n\n  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */\n  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');\n\n  /** Used to identify `toStringTag` values of typed arrays. */\n  var typedArrayTags = {};\n  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =\n      typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =\n          typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =\n              typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =\n                  typedArrayTags[uint32Tag] = true;\n  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =\n      typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =\n          typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =\n              typedArrayTags[errorTag] = typedArrayTags[funcTag] =\n                  typedArrayTags[mapTag] = typedArrayTags[numberTag] =\n                      typedArrayTags[objectTag] = typedArrayTags[regexpTag] =\n                          typedArrayTags[setTag] = typedArrayTags[stringTag] =\n                              typedArrayTags[weakMapTag] = false;\n\n  /** Used to identify `toStringTag` values supported by `_.clone`. */\n  var cloneableTags = {};\n  cloneableTags[argsTag] = cloneableTags[arrayTag] =\n      cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =\n          cloneableTags[boolTag] = cloneableTags[dateTag] =\n              cloneableTags[float32Tag] = cloneableTags[float64Tag] =\n                  cloneableTags[int8Tag] = cloneableTags[int16Tag] =\n                      cloneableTags[int32Tag] = cloneableTags[mapTag] =\n                          cloneableTags[numberTag] = cloneableTags[objectTag] =\n                              cloneableTags[regexpTag] = cloneableTags[setTag] =\n                                  cloneableTags[stringTag] = cloneableTags[symbolTag] =\n                                      cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =\n                                          cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;\n  cloneableTags[errorTag] = cloneableTags[funcTag] =\n      cloneableTags[weakMapTag] = false;\n\n  /** Used to map characters to HTML entities. */\n  var htmlEscapes = {\n    '&': '&amp;',\n    '<': '&lt;',\n    '>': '&gt;',\n    '\"': '&quot;',\n    \"'\": '&#39;'\n  };\n\n  /** Built-in method references without a dependency on `root`. */\n  var freeParseFloat = parseFloat,\n      freeParseInt = parseInt;\n\n  /** Detect free variable `global` from Node.js. */\n  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;\n\n  /** Detect free variable `self`. */\n  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;\n\n  /** Used as a reference to the global object. */\n  var root = freeGlobal || freeSelf || Function('return this')();\n\n  /** Detect free variable `exports`. */\n  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;\n\n  /** Detect free variable `module`. */\n  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;\n\n  /** Detect the popular CommonJS extension `module.exports`. */\n  var moduleExports = freeModule && freeModule.exports === freeExports;\n\n  /** Detect free variable `process` from Node.js. */\n  var freeProcess = moduleExports && freeGlobal.process;\n\n  /** Used to access faster Node.js helpers. */\n  var nodeUtil = (function() {\n    try {\n      return freeProcess && freeProcess.binding && freeProcess.binding('util');\n    } catch (e) {}\n  }());\n\n  /* Node.js helper references. */\n  var nodeIsDate = nodeUtil && nodeUtil.isDate,\n      nodeIsMap = nodeUtil && nodeUtil.isMap,\n      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,\n      nodeIsSet = nodeUtil && nodeUtil.isSet,\n      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;\n\n  /*--------------------------------------------------------------------------*/\n\n  /**\n   * A faster alternative to `Function#apply`, this function invokes `func`\n   * with the `this` binding of `thisArg` and the arguments of `args`.\n   *\n   * @private\n   * @param {Function} func The function to invoke.\n   * @param {*} thisArg The `this` binding of `func`.\n   * @param {Array} args The arguments to invoke `func` with.\n   * @returns {*} Returns the result of `func`.\n   */\n  function apply(func, thisArg, args) {\n    switch (args.length) {\n      case 0: return func.call(thisArg);\n      case 1: return func.call(thisArg, args[0]);\n      case 2: return func.call(thisArg, args[0], args[1]);\n      case 3: return func.call(thisArg, args[0], args[1], args[2]);\n    }\n    return func.apply(thisArg, args);\n  }\n\n  /**\n   * A specialized version of `baseAggregator` for arrays.\n   *\n   * @private\n   * @param {Array} [array] The array to iterate over.\n   * @param {Function} setter The function to set `accumulator` values.\n   * @param {Function} iteratee The iteratee to transform keys.\n   * @param {Object} accumulator The initial aggregated object.\n   * @returns {Function} Returns `accumulator`.\n   */\n  function arrayAggregator(array, setter, iteratee, accumulator) {\n    var index = -1,\n        length = array == null ? 0 : array.length;\n\n    while (++index < length) {\n      var value = array[index];\n      setter(accumulator, value, iteratee(value), array);\n    }\n    return accumulator;\n  }\n\n  /**\n   * A specialized version of `_.forEach` for arrays without support for\n   * iteratee shorthands.\n   *\n   * @private\n   * @param {Array} [array] The array to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @returns {Array} Returns `array`.\n   */\n  function arrayEach(array, iteratee) {\n    var index = -1,\n        length = array == null ? 0 : array.length;\n\n    while (++index < length) {\n      if (iteratee(array[index], index, array) === false) {\n        break;\n      }\n    }\n    return array;\n  }\n\n  /**\n   * A specialized version of `_.every` for arrays without support for\n   * iteratee shorthands.\n   *\n   * @private\n   * @param {Array} [array] The array to iterate over.\n   * @param {Function} predicate The function invoked per iteration.\n   * @returns {boolean} Returns `true` if all elements pass the predicate check,\n   *  else `false`.\n   */\n  function arrayEvery(array, predicate) {\n    var index = -1,\n        length = array == null ? 0 : array.length;\n\n    while (++index < length) {\n      if (!predicate(array[index], index, array)) {\n        return false;\n      }\n    }\n    return true;\n  }\n\n  /**\n   * A specialized version of `_.filter` for arrays without support for\n   * iteratee shorthands.\n   *\n   * @private\n   * @param {Array} [array] The array to iterate over.\n   * @param {Function} predicate The function invoked per iteration.\n   * @returns {Array} Returns the new filtered array.\n   */\n  function arrayFilter(array, predicate) {\n    var index = -1,\n        length = array == null ? 0 : array.length,\n        resIndex = 0,\n        result = [];\n\n    while (++index < length) {\n      var value = array[index];\n      if (predicate(value, index, array)) {\n        result[resIndex++] = value;\n      }\n    }\n    return result;\n  }\n\n  /**\n   * A specialized version of `_.includes` for arrays without support for\n   * specifying an index to search from.\n   *\n   * @private\n   * @param {Array} [array] The array to inspect.\n   * @param {*} target The value to search for.\n   * @returns {boolean} Returns `true` if `target` is found, else `false`.\n   */\n  function arrayIncludes(array, value) {\n    var length = array == null ? 0 : array.length;\n    return !!length && baseIndexOf(array, value, 0) > -1;\n  }\n\n  /**\n   * This function is like `arrayIncludes` except that it accepts a comparator.\n   *\n   * @private\n   * @param {Array} [array] The array to inspect.\n   * @param {*} target The value to search for.\n   * @param {Function} comparator The comparator invoked per element.\n   * @returns {boolean} Returns `true` if `target` is found, else `false`.\n   */\n  function arrayIncludesWith(array, value, comparator) {\n    var index = -1,\n        length = array == null ? 0 : array.length;\n\n    while (++index < length) {\n      if (comparator(value, array[index])) {\n        return true;\n      }\n    }\n    return false;\n  }\n\n  /**\n   * A specialized version of `_.map` for arrays without support for iteratee\n   * shorthands.\n   *\n   * @private\n   * @param {Array} [array] The array to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @returns {Array} Returns the new mapped array.\n   */\n  function arrayMap(array, iteratee) {\n    var index = -1,\n        length = array == null ? 0 : array.length,\n        result = Array(length);\n\n    while (++index < length) {\n      result[index] = iteratee(array[index], index, array);\n    }\n    return result;\n  }\n\n  /**\n   * Appends the elements of `values` to `array`.\n   *\n   * @private\n   * @param {Array} array The array to modify.\n   * @param {Array} values The values to append.\n   * @returns {Array} Returns `array`.\n   */\n  function arrayPush(array, values) {\n    var index = -1,\n        length = values.length,\n        offset = array.length;\n\n    while (++index < length) {\n      array[offset + index] = values[index];\n    }\n    return array;\n  }\n\n  /**\n   * A specialized version of `_.reduce` for arrays without support for\n   * iteratee shorthands.\n   *\n   * @private\n   * @param {Array} [array] The array to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @param {*} [accumulator] The initial value.\n   * @param {boolean} [initAccum] Specify using the first element of `array` as\n   *  the initial value.\n   * @returns {*} Returns the accumulated value.\n   */\n  function arrayReduce(array, iteratee, accumulator, initAccum) {\n    var index = -1,\n        length = array == null ? 0 : array.length;\n\n    if (initAccum && length) {\n      accumulator = array[++index];\n    }\n    while (++index < length) {\n      accumulator = iteratee(accumulator, array[index], index, array);\n    }\n    return accumulator;\n  }\n\n  /**\n   * A specialized version of `_.some` for arrays without support for iteratee\n   * shorthands.\n   *\n   * @private\n   * @param {Array} [array] The array to iterate over.\n   * @param {Function} predicate The function invoked per iteration.\n   * @returns {boolean} Returns `true` if any element passes the predicate check,\n   *  else `false`.\n   */\n  function arraySome(array, predicate) {\n    var index = -1,\n        length = array == null ? 0 : array.length;\n\n    while (++index < length) {\n      if (predicate(array[index], index, array)) {\n        return true;\n      }\n    }\n    return false;\n  }\n\n  /**\n   * Gets the size of an ASCII `string`.\n   *\n   * @private\n   * @param {string} string The string inspect.\n   * @returns {number} Returns the string size.\n   */\n  var asciiSize = baseProperty('length');\n\n  /**\n   * Converts an ASCII `string` to an array.\n   *\n   * @private\n   * @param {string} string The string to convert.\n   * @returns {Array} Returns the converted array.\n   */\n  function asciiToArray(string) {\n    return string.split('');\n  }\n\n  /**\n   * The base implementation of methods like `_.findKey` and `_.findLastKey`,\n   * without support for iteratee shorthands, which iterates over `collection`\n   * using `eachFunc`.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to inspect.\n   * @param {Function} predicate The function invoked per iteration.\n   * @param {Function} eachFunc The function to iterate over `collection`.\n   * @returns {*} Returns the found element or its key, else `undefined`.\n   */\n  function baseFindKey(collection, predicate, eachFunc) {\n    var result;\n    eachFunc(collection, function(value, key, collection) {\n      if (predicate(value, key, collection)) {\n        result = key;\n        return false;\n      }\n    });\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.findIndex` and `_.findLastIndex` without\n   * support for iteratee shorthands.\n   *\n   * @private\n   * @param {Array} array The array to inspect.\n   * @param {Function} predicate The function invoked per iteration.\n   * @param {number} fromIndex The index to search from.\n   * @param {boolean} [fromRight] Specify iterating from right to left.\n   * @returns {number} Returns the index of the matched value, else `-1`.\n   */\n  function baseFindIndex(array, predicate, fromIndex, fromRight) {\n    var length = array.length,\n        index = fromIndex + (fromRight ? 1 : -1);\n\n    while ((fromRight ? index-- : ++index < length)) {\n      if (predicate(array[index], index, array)) {\n        return index;\n      }\n    }\n    return -1;\n  }\n\n  /**\n   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.\n   *\n   * @private\n   * @param {Array} array The array to inspect.\n   * @param {*} value The value to search for.\n   * @param {number} fromIndex The index to search from.\n   * @returns {number} Returns the index of the matched value, else `-1`.\n   */\n  function baseIndexOf(array, value, fromIndex) {\n    return value === value\n        ? strictIndexOf(array, value, fromIndex)\n        : baseFindIndex(array, baseIsNaN, fromIndex);\n  }\n\n  /**\n   * The base implementation of `_.isNaN` without support for number objects.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.\n   */\n  function baseIsNaN(value) {\n    return value !== value;\n  }\n\n  /**\n   * The base implementation of `_.property` without support for deep paths.\n   *\n   * @private\n   * @param {string} key The key of the property to get.\n   * @returns {Function} Returns the new accessor function.\n   */\n  function baseProperty(key) {\n    return function(object) {\n      return object == null ? undefined : object[key];\n    };\n  }\n\n  /**\n   * The base implementation of `_.propertyOf` without support for deep paths.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Function} Returns the new accessor function.\n   */\n  function basePropertyOf(object) {\n    return function(key) {\n      return object == null ? undefined : object[key];\n    };\n  }\n\n  /**\n   * The base implementation of `_.reduce` and `_.reduceRight`, without support\n   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @param {*} accumulator The initial value.\n   * @param {boolean} initAccum Specify using the first or last element of\n   *  `collection` as the initial value.\n   * @param {Function} eachFunc The function to iterate over `collection`.\n   * @returns {*} Returns the accumulated value.\n   */\n  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {\n    eachFunc(collection, function(value, index, collection) {\n      accumulator = initAccum\n          ? (initAccum = false, value)\n          : iteratee(accumulator, value, index, collection);\n    });\n    return accumulator;\n  }\n\n  /**\n   * The base implementation of `_.sortBy` which uses `comparer` to define the\n   * sort order of `array` and replaces criteria objects with their corresponding\n   * values.\n   *\n   * @private\n   * @param {Array} array The array to sort.\n   * @param {Function} comparer The function to define sort order.\n   * @returns {Array} Returns `array`.\n   */\n  function baseSortBy(array, comparer) {\n    var length = array.length;\n\n    array.sort(comparer);\n    while (length--) {\n      array[length] = array[length].value;\n    }\n    return array;\n  }\n\n  /**\n   * The base implementation of `_.times` without support for iteratee shorthands\n   * or max array length checks.\n   *\n   * @private\n   * @param {number} n The number of times to invoke `iteratee`.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @returns {Array} Returns the array of results.\n   */\n  function baseTimes(n, iteratee) {\n    var index = -1,\n        result = Array(n);\n\n    while (++index < n) {\n      result[index] = iteratee(index);\n    }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.unary` without support for storing metadata.\n   *\n   * @private\n   * @param {Function} func The function to cap arguments for.\n   * @returns {Function} Returns the new capped function.\n   */\n  function baseUnary(func) {\n    return function(value) {\n      return func(value);\n    };\n  }\n\n  /**\n   * The base implementation of `_.values` and `_.valuesIn` which creates an\n   * array of `object` property values corresponding to the property names\n   * of `props`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @param {Array} props The property names to get values for.\n   * @returns {Object} Returns the array of property values.\n   */\n  function baseValues(object, props) {\n    return arrayMap(props, function(key) {\n      return object[key];\n    });\n  }\n\n  /**\n   * Checks if a `cache` value for `key` exists.\n   *\n   * @private\n   * @param {Object} cache The cache to query.\n   * @param {string} key The key of the entry to check.\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n   */\n  function cacheHas(cache, key) {\n    return cache.has(key);\n  }\n\n  /**\n   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol\n   * that is not found in the character symbols.\n   *\n   * @private\n   * @param {Array} strSymbols The string symbols to inspect.\n   * @param {Array} chrSymbols The character symbols to find.\n   * @returns {number} Returns the index of the first unmatched string symbol.\n   */\n  function charsStartIndex(strSymbols, chrSymbols) {\n    var index = -1,\n        length = strSymbols.length;\n\n    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}\n    return index;\n  }\n\n  /**\n   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol\n   * that is not found in the character symbols.\n   *\n   * @private\n   * @param {Array} strSymbols The string symbols to inspect.\n   * @param {Array} chrSymbols The character symbols to find.\n   * @returns {number} Returns the index of the last unmatched string symbol.\n   */\n  function charsEndIndex(strSymbols, chrSymbols) {\n    var index = strSymbols.length;\n\n    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}\n    return index;\n  }\n\n  /**\n   * Gets the number of `placeholder` occurrences in `array`.\n   *\n   * @private\n   * @param {Array} array The array to inspect.\n   * @param {*} placeholder The placeholder to search for.\n   * @returns {number} Returns the placeholder count.\n   */\n  function countHolders(array, placeholder) {\n    var length = array.length,\n        result = 0;\n\n    while (length--) {\n      if (array[length] === placeholder) {\n        ++result;\n      }\n    }\n    return result;\n  }\n\n  /**\n   * Used by `_.escape` to convert characters to HTML entities.\n   *\n   * @private\n   * @param {string} chr The matched character to escape.\n   * @returns {string} Returns the escaped character.\n   */\n  var escapeHtmlChar = basePropertyOf(htmlEscapes);\n\n  /**\n   * Gets the value at `key` of `object`.\n   *\n   * @private\n   * @param {Object} [object] The object to query.\n   * @param {string} key The key of the property to get.\n   * @returns {*} Returns the property value.\n   */\n  function getValue(object, key) {\n    return object == null ? undefined : object[key];\n  }\n\n  /**\n   * Checks if `string` contains Unicode symbols.\n   *\n   * @private\n   * @param {string} string The string to inspect.\n   * @returns {boolean} Returns `true` if a symbol is found, else `false`.\n   */\n  function hasUnicode(string) {\n    return reHasUnicode.test(string);\n  }\n\n  /**\n   * Converts `iterator` to an array.\n   *\n   * @private\n   * @param {Object} iterator The iterator to convert.\n   * @returns {Array} Returns the converted array.\n   */\n  function iteratorToArray(iterator) {\n    var data,\n        result = [];\n\n    while (!(data = iterator.next()).done) {\n      result.push(data.value);\n    }\n    return result;\n  }\n\n  /**\n   * Converts `map` to its key-value pairs.\n   *\n   * @private\n   * @param {Object} map The map to convert.\n   * @returns {Array} Returns the key-value pairs.\n   */\n  function mapToArray(map) {\n    var index = -1,\n        result = Array(map.size);\n\n    map.forEach(function(value, key) {\n      result[++index] = [key, value];\n    });\n    return result;\n  }\n\n  /**\n   * Creates a unary function that invokes `func` with its argument transformed.\n   *\n   * @private\n   * @param {Function} func The function to wrap.\n   * @param {Function} transform The argument transform.\n   * @returns {Function} Returns the new function.\n   */\n  function overArg(func, transform) {\n    return function(arg) {\n      return func(transform(arg));\n    };\n  }\n\n  /**\n   * Replaces all `placeholder` elements in `array` with an internal placeholder\n   * and returns an array of their indexes.\n   *\n   * @private\n   * @param {Array} array The array to modify.\n   * @param {*} placeholder The placeholder to replace.\n   * @returns {Array} Returns the new array of placeholder indexes.\n   */\n  function replaceHolders(array, placeholder) {\n    var index = -1,\n        length = array.length,\n        resIndex = 0,\n        result = [];\n\n    while (++index < length) {\n      var value = array[index];\n      if (value === placeholder || value === PLACEHOLDER) {\n        array[index] = PLACEHOLDER;\n        result[resIndex++] = index;\n      }\n    }\n    return result;\n  }\n\n  /**\n   * Gets the value at `key`, unless `key` is \"__proto__\".\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @param {string} key The key of the property to get.\n   * @returns {*} Returns the property value.\n   */\n  function safeGet(object, key) {\n    return key == '__proto__'\n        ? undefined\n        : object[key];\n  }\n\n  /**\n   * Converts `set` to an array of its values.\n   *\n   * @private\n   * @param {Object} set The set to convert.\n   * @returns {Array} Returns the values.\n   */\n  function setToArray(set) {\n    var index = -1,\n        result = Array(set.size);\n\n    set.forEach(function(value) {\n      result[++index] = value;\n    });\n    return result;\n  }\n\n  /**\n   * A specialized version of `_.indexOf` which performs strict equality\n   * comparisons of values, i.e. `===`.\n   *\n   * @private\n   * @param {Array} array The array to inspect.\n   * @param {*} value The value to search for.\n   * @param {number} fromIndex The index to search from.\n   * @returns {number} Returns the index of the matched value, else `-1`.\n   */\n  function strictIndexOf(array, value, fromIndex) {\n    var index = fromIndex - 1,\n        length = array.length;\n\n    while (++index < length) {\n      if (array[index] === value) {\n        return index;\n      }\n    }\n    return -1;\n  }\n\n  /**\n   * Gets the number of symbols in `string`.\n   *\n   * @private\n   * @param {string} string The string to inspect.\n   * @returns {number} Returns the string size.\n   */\n  function stringSize(string) {\n    return hasUnicode(string)\n        ? unicodeSize(string)\n        : asciiSize(string);\n  }\n\n  /**\n   * Converts `string` to an array.\n   *\n   * @private\n   * @param {string} string The string to convert.\n   * @returns {Array} Returns the converted array.\n   */\n  function stringToArray(string) {\n    return hasUnicode(string)\n        ? unicodeToArray(string)\n        : asciiToArray(string);\n  }\n\n  /**\n   * Gets the size of a Unicode `string`.\n   *\n   * @private\n   * @param {string} string The string inspect.\n   * @returns {number} Returns the string size.\n   */\n  function unicodeSize(string) {\n    var result = reUnicode.lastIndex = 0;\n    while (reUnicode.test(string)) {\n      ++result;\n    }\n    return result;\n  }\n\n  /**\n   * Converts a Unicode `string` to an array.\n   *\n   * @private\n   * @param {string} string The string to convert.\n   * @returns {Array} Returns the converted array.\n   */\n  function unicodeToArray(string) {\n    return string.match(reUnicode) || [];\n  }\n\n  /*--------------------------------------------------------------------------*/\n\n  /** Used for built-in method references. */\n  var arrayProto = Array.prototype,\n      funcProto = Function.prototype,\n      objectProto = Object.prototype;\n\n  /** Used to detect overreaching core-js shims. */\n  var coreJsData = root['__core-js_shared__'];\n\n  /** Used to resolve the decompiled source of functions. */\n  var funcToString = funcProto.toString;\n\n  /** Used to check objects for own properties. */\n  var hasOwnProperty = objectProto.hasOwnProperty;\n\n  /** Used to generate unique IDs. */\n  var idCounter = 0;\n\n  /** Used to detect methods masquerading as native. */\n  var maskSrcKey = (function() {\n    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');\n    return uid ? ('Symbol(src)_1.' + uid) : '';\n  }());\n\n  /**\n   * Used to resolve the\n   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)\n   * of values.\n   */\n  var nativeObjectToString = objectProto.toString;\n\n  /** Used to infer the `Object` constructor. */\n  var objectCtorString = funcToString.call(Object);\n\n  /** Used to restore the original `_` reference in `_.noConflict`. */\n  var oldDash = root._;\n\n  /** Used to detect if a method is native. */\n  var reIsNative = RegExp('^' +\n      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\\\$&')\n          .replace(/hasOwnProperty|(function).*?(?=\\\\\\()| for .+?(?=\\\\\\])/g, '$1.*?') + '$'\n  );\n\n  /** Built-in value references. */\n  var Buffer = moduleExports ? root.Buffer : undefined,\n      Symbol = root.Symbol,\n      Uint8Array = root.Uint8Array,\n      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,\n      getPrototype = overArg(Object.getPrototypeOf, Object),\n      objectCreate = Object.create,\n      propertyIsEnumerable = objectProto.propertyIsEnumerable,\n      splice = arrayProto.splice,\n      spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,\n      symIterator = Symbol ? Symbol.iterator : undefined,\n      symToStringTag = Symbol ? Symbol.toStringTag : undefined;\n\n  var defineProperty = (function() {\n    try {\n      var func = getNative(Object, 'defineProperty');\n      func({}, '', {});\n      return func;\n    } catch (e) {}\n  }());\n\n  /* Built-in method references for those with the same name as other `lodash` methods. */\n  var nativeCeil = Math.ceil,\n      nativeFloor = Math.floor,\n      nativeGetSymbols = Object.getOwnPropertySymbols,\n      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,\n      nativeIsFinite = root.isFinite,\n      nativeKeys = overArg(Object.keys, Object),\n      nativeMax = Math.max,\n      nativeMin = Math.min,\n      nativeNow = Date.now,\n      nativeRandom = Math.random,\n      nativeReverse = arrayProto.reverse;\n\n  /* Built-in method references that are verified to be native. */\n  var DataView = getNative(root, 'DataView'),\n      Map = getNative(root, 'Map'),\n      Promise = getNative(root, 'Promise'),\n      Set = getNative(root, 'Set'),\n      WeakMap = getNative(root, 'WeakMap'),\n      nativeCreate = getNative(Object, 'create');\n\n  /** Used to store function metadata. */\n  var metaMap = WeakMap && new WeakMap;\n\n  /** Used to lookup unminified function names. */\n  var realNames = {};\n\n  /** Used to detect maps, sets, and weakmaps. */\n  var dataViewCtorString = toSource(DataView),\n      mapCtorString = toSource(Map),\n      promiseCtorString = toSource(Promise),\n      setCtorString = toSource(Set),\n      weakMapCtorString = toSource(WeakMap);\n\n  /** Used to convert symbols to primitives and strings. */\n  var symbolProto = Symbol ? Symbol.prototype : undefined,\n      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,\n      symbolToString = symbolProto ? symbolProto.toString : undefined;\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates a `lodash` object which wraps `value` to enable implicit method\n   * chain sequences. Methods that operate on and return arrays, collections,\n   * and functions can be chained together. Methods that retrieve a single value\n   * or may return a primitive value will automatically end the chain sequence\n   * and return the unwrapped value. Otherwise, the value must be unwrapped\n   * with `_#value`.\n   *\n   * Explicit chain sequences, which must be unwrapped with `_#value`, may be\n   * enabled using `_.chain`.\n   *\n   * The execution of chained methods is lazy, that is, it's deferred until\n   * `_#value` is implicitly or explicitly called.\n   *\n   * Lazy evaluation allows several methods to support shortcut fusion.\n   * Shortcut fusion is an optimization to merge iteratee calls; this avoids\n   * the creation of intermediate arrays and can greatly reduce the number of\n   * iteratee executions. Sections of a chain sequence qualify for shortcut\n   * fusion if the section is applied to an array and iteratees accept only\n   * one argument. The heuristic for whether a section qualifies for shortcut\n   * fusion is subject to change.\n   *\n   * Chaining is supported in custom builds as long as the `_#value` method is\n   * directly or indirectly included in the build.\n   *\n   * In addition to lodash methods, wrappers have `Array` and `String` methods.\n   *\n   * The wrapper `Array` methods are:\n   * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`\n   *\n   * The wrapper `String` methods are:\n   * `replace` and `split`\n   *\n   * The wrapper methods that support shortcut fusion are:\n   * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,\n   * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,\n   * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`\n   *\n   * The chainable wrapper methods are:\n   * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,\n   * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,\n   * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,\n   * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,\n   * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,\n   * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,\n   * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,\n   * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,\n   * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,\n   * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,\n   * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,\n   * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,\n   * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,\n   * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,\n   * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,\n   * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,\n   * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,\n   * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,\n   * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,\n   * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,\n   * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,\n   * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,\n   * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,\n   * `zipObject`, `zipObjectDeep`, and `zipWith`\n   *\n   * The wrapper methods that are **not** chainable by default are:\n   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,\n   * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,\n   * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,\n   * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,\n   * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,\n   * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,\n   * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,\n   * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,\n   * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,\n   * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,\n   * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,\n   * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,\n   * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,\n   * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,\n   * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,\n   * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,\n   * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,\n   * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,\n   * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,\n   * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,\n   * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,\n   * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,\n   * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,\n   * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,\n   * `upperFirst`, `value`, and `words`\n   *\n   * @name _\n   * @constructor\n   * @category Seq\n   * @param {*} value The value to wrap in a `lodash` instance.\n   * @returns {Object} Returns the new `lodash` wrapper instance.\n   * @example\n   *\n   * function square(n) {\n   *   return n * n;\n   * }\n   *\n   * var wrapped = _([1, 2, 3]);\n   *\n   * // Returns an unwrapped value.\n   * wrapped.reduce(_.add);\n   * // => 6\n   *\n   * // Returns a wrapped value.\n   * var squares = wrapped.map(square);\n   *\n   * _.isArray(squares);\n   * // => false\n   *\n   * _.isArray(squares.value());\n   * // => true\n   */\n  function lodash(value) {\n    if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {\n      if (value instanceof LodashWrapper) {\n        return value;\n      }\n      if (hasOwnProperty.call(value, '__wrapped__')) {\n        return wrapperClone(value);\n      }\n    }\n    return new LodashWrapper(value);\n  }\n\n  /**\n   * The base implementation of `_.create` without support for assigning\n   * properties to the created object.\n   *\n   * @private\n   * @param {Object} proto The object to inherit from.\n   * @returns {Object} Returns the new object.\n   */\n  var baseCreate = (function() {\n    function object() {}\n    return function(proto) {\n      if (!isObject(proto)) {\n        return {};\n      }\n      if (objectCreate) {\n        return objectCreate(proto);\n      }\n      object.prototype = proto;\n      var result = new object;\n      object.prototype = undefined;\n      return result;\n    };\n  }());\n\n  /**\n   * The function whose prototype chain sequence wrappers inherit from.\n   *\n   * @private\n   */\n  function baseLodash() {\n    // No operation performed.\n  }\n\n  /**\n   * The base constructor for creating `lodash` wrapper objects.\n   *\n   * @private\n   * @param {*} value The value to wrap.\n   * @param {boolean} [chainAll] Enable explicit method chain sequences.\n   */\n  function LodashWrapper(value, chainAll) {\n    this.__wrapped__ = value;\n    this.__actions__ = [];\n    this.__chain__ = !!chainAll;\n    this.__index__ = 0;\n    this.__values__ = undefined;\n  }\n\n  // Ensure wrappers are instances of `baseLodash`.\n  lodash.prototype = baseLodash.prototype;\n  lodash.prototype.constructor = lodash;\n\n  LodashWrapper.prototype = baseCreate(baseLodash.prototype);\n  LodashWrapper.prototype.constructor = LodashWrapper;\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.\n   *\n   * @private\n   * @constructor\n   * @param {*} value The value to wrap.\n   */\n  function LazyWrapper(value) {\n    this.__wrapped__ = value;\n    this.__actions__ = [];\n    this.__dir__ = 1;\n    this.__filtered__ = false;\n    this.__iteratees__ = [];\n    this.__takeCount__ = MAX_ARRAY_LENGTH;\n    this.__views__ = [];\n  }\n\n  /**\n   * Creates a clone of the lazy wrapper object.\n   *\n   * @private\n   * @name clone\n   * @memberOf LazyWrapper\n   * @returns {Object} Returns the cloned `LazyWrapper` object.\n   */\n  function lazyClone() {\n    var result = new LazyWrapper(this.__wrapped__);\n    result.__actions__ = copyArray(this.__actions__);\n    result.__dir__ = this.__dir__;\n    result.__filtered__ = this.__filtered__;\n    result.__iteratees__ = copyArray(this.__iteratees__);\n    result.__takeCount__ = this.__takeCount__;\n    result.__views__ = copyArray(this.__views__);\n    return result;\n  }\n\n  /**\n   * Reverses the direction of lazy iteration.\n   *\n   * @private\n   * @name reverse\n   * @memberOf LazyWrapper\n   * @returns {Object} Returns the new reversed `LazyWrapper` object.\n   */\n  function lazyReverse() {\n    if (this.__filtered__) {\n      var result = new LazyWrapper(this);\n      result.__dir__ = -1;\n      result.__filtered__ = true;\n    } else {\n      result = this.clone();\n      result.__dir__ *= -1;\n    }\n    return result;\n  }\n\n  /**\n   * Extracts the unwrapped value from its lazy wrapper.\n   *\n   * @private\n   * @name value\n   * @memberOf LazyWrapper\n   * @returns {*} Returns the unwrapped value.\n   */\n  function lazyValue() {\n    var array = this.__wrapped__.value(),\n        dir = this.__dir__,\n        isArr = isArray(array),\n        isRight = dir < 0,\n        arrLength = isArr ? array.length : 0,\n        view = getView(0, arrLength, this.__views__),\n        start = view.start,\n        end = view.end,\n        length = end - start,\n        index = isRight ? end : (start - 1),\n        iteratees = this.__iteratees__,\n        iterLength = iteratees.length,\n        resIndex = 0,\n        takeCount = nativeMin(length, this.__takeCount__);\n\n    if (!isArr || (!isRight && arrLength == length && takeCount == length)) {\n      return baseWrapperValue(array, this.__actions__);\n    }\n    var result = [];\n\n    outer:\n        while (length-- && resIndex < takeCount) {\n          index += dir;\n\n          var iterIndex = -1,\n              value = array[index];\n\n          while (++iterIndex < iterLength) {\n            var data = iteratees[iterIndex],\n                iteratee = data.iteratee,\n                type = data.type,\n                computed = iteratee(value);\n\n            if (type == LAZY_MAP_FLAG) {\n              value = computed;\n            } else if (!computed) {\n              if (type == LAZY_FILTER_FLAG) {\n                continue outer;\n              } else {\n                break outer;\n              }\n            }\n          }\n          result[resIndex++] = value;\n        }\n    return result;\n  }\n\n  // Ensure `LazyWrapper` is an instance of `baseLodash`.\n  LazyWrapper.prototype = baseCreate(baseLodash.prototype);\n  LazyWrapper.prototype.constructor = LazyWrapper;\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates a hash object.\n   *\n   * @private\n   * @constructor\n   * @param {Array} [entries] The key-value pairs to cache.\n   */\n  function Hash(entries) {\n    var index = -1,\n        length = entries == null ? 0 : entries.length;\n\n    this.clear();\n    while (++index < length) {\n      var entry = entries[index];\n      this.set(entry[0], entry[1]);\n    }\n  }\n\n  /**\n   * Removes all key-value entries from the hash.\n   *\n   * @private\n   * @name clear\n   * @memberOf Hash\n   */\n  function hashClear() {\n    this.__data__ = nativeCreate ? nativeCreate(null) : {};\n    this.size = 0;\n  }\n\n  /**\n   * Removes `key` and its value from the hash.\n   *\n   * @private\n   * @name delete\n   * @memberOf Hash\n   * @param {Object} hash The hash to modify.\n   * @param {string} key The key of the value to remove.\n   * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n   */\n  function hashDelete(key) {\n    var result = this.has(key) && delete this.__data__[key];\n    this.size -= result ? 1 : 0;\n    return result;\n  }\n\n  /**\n   * Gets the hash value for `key`.\n   *\n   * @private\n   * @name get\n   * @memberOf Hash\n   * @param {string} key The key of the value to get.\n   * @returns {*} Returns the entry value.\n   */\n  function hashGet(key) {\n    var data = this.__data__;\n    if (nativeCreate) {\n      var result = data[key];\n      return result === HASH_UNDEFINED ? undefined : result;\n    }\n    return hasOwnProperty.call(data, key) ? data[key] : undefined;\n  }\n\n  /**\n   * Checks if a hash value for `key` exists.\n   *\n   * @private\n   * @name has\n   * @memberOf Hash\n   * @param {string} key The key of the entry to check.\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n   */\n  function hashHas(key) {\n    var data = this.__data__;\n    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);\n  }\n\n  /**\n   * Sets the hash `key` to `value`.\n   *\n   * @private\n   * @name set\n   * @memberOf Hash\n   * @param {string} key The key of the value to set.\n   * @param {*} value The value to set.\n   * @returns {Object} Returns the hash instance.\n   */\n  function hashSet(key, value) {\n    var data = this.__data__;\n    this.size += this.has(key) ? 0 : 1;\n    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;\n    return this;\n  }\n\n  // Add methods to `Hash`.\n  Hash.prototype.clear = hashClear;\n  Hash.prototype['delete'] = hashDelete;\n  Hash.prototype.get = hashGet;\n  Hash.prototype.has = hashHas;\n  Hash.prototype.set = hashSet;\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates an list cache object.\n   *\n   * @private\n   * @constructor\n   * @param {Array} [entries] The key-value pairs to cache.\n   */\n  function ListCache(entries) {\n    var index = -1,\n        length = entries == null ? 0 : entries.length;\n\n    this.clear();\n    while (++index < length) {\n      var entry = entries[index];\n      this.set(entry[0], entry[1]);\n    }\n  }\n\n  /**\n   * Removes all key-value entries from the list cache.\n   *\n   * @private\n   * @name clear\n   * @memberOf ListCache\n   */\n  function listCacheClear() {\n    this.__data__ = [];\n    this.size = 0;\n  }\n\n  /**\n   * Removes `key` and its value from the list cache.\n   *\n   * @private\n   * @name delete\n   * @memberOf ListCache\n   * @param {string} key The key of the value to remove.\n   * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n   */\n  function listCacheDelete(key) {\n    var data = this.__data__,\n        index = assocIndexOf(data, key);\n\n    if (index < 0) {\n      return false;\n    }\n    var lastIndex = data.length - 1;\n    if (index == lastIndex) {\n      data.pop();\n    } else {\n      splice.call(data, index, 1);\n    }\n    --this.size;\n    return true;\n  }\n\n  /**\n   * Gets the list cache value for `key`.\n   *\n   * @private\n   * @name get\n   * @memberOf ListCache\n   * @param {string} key The key of the value to get.\n   * @returns {*} Returns the entry value.\n   */\n  function listCacheGet(key) {\n    var data = this.__data__,\n        index = assocIndexOf(data, key);\n\n    return index < 0 ? undefined : data[index][1];\n  }\n\n  /**\n   * Checks if a list cache value for `key` exists.\n   *\n   * @private\n   * @name has\n   * @memberOf ListCache\n   * @param {string} key The key of the entry to check.\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n   */\n  function listCacheHas(key) {\n    return assocIndexOf(this.__data__, key) > -1;\n  }\n\n  /**\n   * Sets the list cache `key` to `value`.\n   *\n   * @private\n   * @name set\n   * @memberOf ListCache\n   * @param {string} key The key of the value to set.\n   * @param {*} value The value to set.\n   * @returns {Object} Returns the list cache instance.\n   */\n  function listCacheSet(key, value) {\n    var data = this.__data__,\n        index = assocIndexOf(data, key);\n\n    if (index < 0) {\n      ++this.size;\n      data.push([key, value]);\n    } else {\n      data[index][1] = value;\n    }\n    return this;\n  }\n\n  // Add methods to `ListCache`.\n  ListCache.prototype.clear = listCacheClear;\n  ListCache.prototype['delete'] = listCacheDelete;\n  ListCache.prototype.get = listCacheGet;\n  ListCache.prototype.has = listCacheHas;\n  ListCache.prototype.set = listCacheSet;\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates a map cache object to store key-value pairs.\n   *\n   * @private\n   * @constructor\n   * @param {Array} [entries] The key-value pairs to cache.\n   */\n  function MapCache(entries) {\n    var index = -1,\n        length = entries == null ? 0 : entries.length;\n\n    this.clear();\n    while (++index < length) {\n      var entry = entries[index];\n      this.set(entry[0], entry[1]);\n    }\n  }\n\n  /**\n   * Removes all key-value entries from the map.\n   *\n   * @private\n   * @name clear\n   * @memberOf MapCache\n   */\n  function mapCacheClear() {\n    this.size = 0;\n    this.__data__ = {\n      'hash': new Hash,\n      'map': new (Map || ListCache),\n      'string': new Hash\n    };\n  }\n\n  /**\n   * Removes `key` and its value from the map.\n   *\n   * @private\n   * @name delete\n   * @memberOf MapCache\n   * @param {string} key The key of the value to remove.\n   * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n   */\n  function mapCacheDelete(key) {\n    var result = getMapData(this, key)['delete'](key);\n    this.size -= result ? 1 : 0;\n    return result;\n  }\n\n  /**\n   * Gets the map value for `key`.\n   *\n   * @private\n   * @name get\n   * @memberOf MapCache\n   * @param {string} key The key of the value to get.\n   * @returns {*} Returns the entry value.\n   */\n  function mapCacheGet(key) {\n    return getMapData(this, key).get(key);\n  }\n\n  /**\n   * Checks if a map value for `key` exists.\n   *\n   * @private\n   * @name has\n   * @memberOf MapCache\n   * @param {string} key The key of the entry to check.\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n   */\n  function mapCacheHas(key) {\n    return getMapData(this, key).has(key);\n  }\n\n  /**\n   * Sets the map `key` to `value`.\n   *\n   * @private\n   * @name set\n   * @memberOf MapCache\n   * @param {string} key The key of the value to set.\n   * @param {*} value The value to set.\n   * @returns {Object} Returns the map cache instance.\n   */\n  function mapCacheSet(key, value) {\n    var data = getMapData(this, key),\n        size = data.size;\n\n    data.set(key, value);\n    this.size += data.size == size ? 0 : 1;\n    return this;\n  }\n\n  // Add methods to `MapCache`.\n  MapCache.prototype.clear = mapCacheClear;\n  MapCache.prototype['delete'] = mapCacheDelete;\n  MapCache.prototype.get = mapCacheGet;\n  MapCache.prototype.has = mapCacheHas;\n  MapCache.prototype.set = mapCacheSet;\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   *\n   * Creates an array cache object to store unique values.\n   *\n   * @private\n   * @constructor\n   * @param {Array} [values] The values to cache.\n   */\n  function SetCache(values) {\n    var index = -1,\n        length = values == null ? 0 : values.length;\n\n    this.__data__ = new MapCache;\n    while (++index < length) {\n      this.add(values[index]);\n    }\n  }\n\n  /**\n   * Adds `value` to the array cache.\n   *\n   * @private\n   * @name add\n   * @memberOf SetCache\n   * @alias push\n   * @param {*} value The value to cache.\n   * @returns {Object} Returns the cache instance.\n   */\n  function setCacheAdd(value) {\n    this.__data__.set(value, HASH_UNDEFINED);\n    return this;\n  }\n\n  /**\n   * Checks if `value` is in the array cache.\n   *\n   * @private\n   * @name has\n   * @memberOf SetCache\n   * @param {*} value The value to search for.\n   * @returns {number} Returns `true` if `value` is found, else `false`.\n   */\n  function setCacheHas(value) {\n    return this.__data__.has(value);\n  }\n\n  // Add methods to `SetCache`.\n  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;\n  SetCache.prototype.has = setCacheHas;\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates a stack cache object to store key-value pairs.\n   *\n   * @private\n   * @constructor\n   * @param {Array} [entries] The key-value pairs to cache.\n   */\n  function Stack(entries) {\n    var data = this.__data__ = new ListCache(entries);\n    this.size = data.size;\n  }\n\n  /**\n   * Removes all key-value entries from the stack.\n   *\n   * @private\n   * @name clear\n   * @memberOf Stack\n   */\n  function stackClear() {\n    this.__data__ = new ListCache;\n    this.size = 0;\n  }\n\n  /**\n   * Removes `key` and its value from the stack.\n   *\n   * @private\n   * @name delete\n   * @memberOf Stack\n   * @param {string} key The key of the value to remove.\n   * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n   */\n  function stackDelete(key) {\n    var data = this.__data__,\n        result = data['delete'](key);\n\n    this.size = data.size;\n    return result;\n  }\n\n  /**\n   * Gets the stack value for `key`.\n   *\n   * @private\n   * @name get\n   * @memberOf Stack\n   * @param {string} key The key of the value to get.\n   * @returns {*} Returns the entry value.\n   */\n  function stackGet(key) {\n    return this.__data__.get(key);\n  }\n\n  /**\n   * Checks if a stack value for `key` exists.\n   *\n   * @private\n   * @name has\n   * @memberOf Stack\n   * @param {string} key The key of the entry to check.\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n   */\n  function stackHas(key) {\n    return this.__data__.has(key);\n  }\n\n  /**\n   * Sets the stack `key` to `value`.\n   *\n   * @private\n   * @name set\n   * @memberOf Stack\n   * @param {string} key The key of the value to set.\n   * @param {*} value The value to set.\n   * @returns {Object} Returns the stack cache instance.\n   */\n  function stackSet(key, value) {\n    var data = this.__data__;\n    if (data instanceof ListCache) {\n      var pairs = data.__data__;\n      if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {\n        pairs.push([key, value]);\n        this.size = ++data.size;\n        return this;\n      }\n      data = this.__data__ = new MapCache(pairs);\n    }\n    data.set(key, value);\n    this.size = data.size;\n    return this;\n  }\n\n  // Add methods to `Stack`.\n  Stack.prototype.clear = stackClear;\n  Stack.prototype['delete'] = stackDelete;\n  Stack.prototype.get = stackGet;\n  Stack.prototype.has = stackHas;\n  Stack.prototype.set = stackSet;\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates an array of the enumerable property names of the array-like `value`.\n   *\n   * @private\n   * @param {*} value The value to query.\n   * @param {boolean} inherited Specify returning inherited property names.\n   * @returns {Array} Returns the array of property names.\n   */\n  function arrayLikeKeys(value, inherited) {\n    var isArr = isArray(value),\n        isArg = !isArr && isArguments(value),\n        isBuff = !isArr && !isArg && isBuffer(value),\n        isType = !isArr && !isArg && !isBuff && isTypedArray(value),\n        skipIndexes = isArr || isArg || isBuff || isType,\n        result = skipIndexes ? baseTimes(value.length, String) : [],\n        length = result.length;\n\n    for (var key in value) {\n      if ((inherited || hasOwnProperty.call(value, key)) &&\n          !(skipIndexes && (\n              // Safari 9 has enumerable `arguments.length` in strict mode.\n              key == 'length' ||\n              // Node.js 0.10 has enumerable non-index properties on buffers.\n              (isBuff && (key == 'offset' || key == 'parent')) ||\n              // PhantomJS 2 has enumerable non-index properties on typed arrays.\n              (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||\n              // Skip index properties.\n              isIndex(key, length)\n          ))) {\n        result.push(key);\n      }\n    }\n    return result;\n  }\n\n  /**\n   * This function is like `assignValue` except that it doesn't assign\n   * `undefined` values.\n   *\n   * @private\n   * @param {Object} object The object to modify.\n   * @param {string} key The key of the property to assign.\n   * @param {*} value The value to assign.\n   */\n  function assignMergeValue(object, key, value) {\n    if ((value !== undefined && !eq(object[key], value)) ||\n        (value === undefined && !(key in object))) {\n      baseAssignValue(object, key, value);\n    }\n  }\n\n  /**\n   * Assigns `value` to `key` of `object` if the existing value is not equivalent\n   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n   * for equality comparisons.\n   *\n   * @private\n   * @param {Object} object The object to modify.\n   * @param {string} key The key of the property to assign.\n   * @param {*} value The value to assign.\n   */\n  function assignValue(object, key, value) {\n    var objValue = object[key];\n    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||\n        (value === undefined && !(key in object))) {\n      baseAssignValue(object, key, value);\n    }\n  }\n\n  /**\n   * Gets the index at which the `key` is found in `array` of key-value pairs.\n   *\n   * @private\n   * @param {Array} array The array to inspect.\n   * @param {*} key The key to search for.\n   * @returns {number} Returns the index of the matched value, else `-1`.\n   */\n  function assocIndexOf(array, key) {\n    var length = array.length;\n    while (length--) {\n      if (eq(array[length][0], key)) {\n        return length;\n      }\n    }\n    return -1;\n  }\n\n  /**\n   * Aggregates elements of `collection` on `accumulator` with keys transformed\n   * by `iteratee` and values set by `setter`.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} setter The function to set `accumulator` values.\n   * @param {Function} iteratee The iteratee to transform keys.\n   * @param {Object} accumulator The initial aggregated object.\n   * @returns {Function} Returns `accumulator`.\n   */\n  function baseAggregator(collection, setter, iteratee, accumulator) {\n    baseEach(collection, function(value, key, collection) {\n      setter(accumulator, value, iteratee(value), collection);\n    });\n    return accumulator;\n  }\n\n  /**\n   * The base implementation of `_.assign` without support for multiple sources\n   * or `customizer` functions.\n   *\n   * @private\n   * @param {Object} object The destination object.\n   * @param {Object} source The source object.\n   * @returns {Object} Returns `object`.\n   */\n  function baseAssign(object, source) {\n    return object && copyObject(source, keys(source), object);\n  }\n\n  /**\n   * The base implementation of `_.assignIn` without support for multiple sources\n   * or `customizer` functions.\n   *\n   * @private\n   * @param {Object} object The destination object.\n   * @param {Object} source The source object.\n   * @returns {Object} Returns `object`.\n   */\n  function baseAssignIn(object, source) {\n    return object && copyObject(source, keysIn(source), object);\n  }\n\n  /**\n   * The base implementation of `assignValue` and `assignMergeValue` without\n   * value checks.\n   *\n   * @private\n   * @param {Object} object The object to modify.\n   * @param {string} key The key of the property to assign.\n   * @param {*} value The value to assign.\n   */\n  function baseAssignValue(object, key, value) {\n    if (key == '__proto__' && defineProperty) {\n      defineProperty(object, key, {\n        'configurable': true,\n        'enumerable': true,\n        'value': value,\n        'writable': true\n      });\n    } else {\n      object[key] = value;\n    }\n  }\n\n  /**\n   * The base implementation of `_.at` without support for individual paths.\n   *\n   * @private\n   * @param {Object} object The object to iterate over.\n   * @param {string[]} paths The property paths to pick.\n   * @returns {Array} Returns the picked elements.\n   */\n  function baseAt(object, paths) {\n    var index = -1,\n        length = paths.length,\n        result = Array(length),\n        skip = object == null;\n\n    while (++index < length) {\n      result[index] = skip ? undefined : get(object, paths[index]);\n    }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.clamp` which doesn't coerce arguments.\n   *\n   * @private\n   * @param {number} number The number to clamp.\n   * @param {number} [lower] The lower bound.\n   * @param {number} upper The upper bound.\n   * @returns {number} Returns the clamped number.\n   */\n  function baseClamp(number, lower, upper) {\n    if (number === number) {\n      if (upper !== undefined) {\n        number = number <= upper ? number : upper;\n      }\n      if (lower !== undefined) {\n        number = number >= lower ? number : lower;\n      }\n    }\n    return number;\n  }\n\n  /**\n   * The base implementation of `_.clone` and `_.cloneDeep` which tracks\n   * traversed objects.\n   *\n   * @private\n   * @param {*} value The value to clone.\n   * @param {boolean} bitmask The bitmask flags.\n   *  1 - Deep clone\n   *  2 - Flatten inherited properties\n   *  4 - Clone symbols\n   * @param {Function} [customizer] The function to customize cloning.\n   * @param {string} [key] The key of `value`.\n   * @param {Object} [object] The parent object of `value`.\n   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.\n   * @returns {*} Returns the cloned value.\n   */\n  function baseClone(value, bitmask, customizer, key, object, stack) {\n    var result,\n        isDeep = bitmask & CLONE_DEEP_FLAG,\n        isFlat = bitmask & CLONE_FLAT_FLAG,\n        isFull = bitmask & CLONE_SYMBOLS_FLAG;\n\n    if (customizer) {\n      result = object ? customizer(value, key, object, stack) : customizer(value);\n    }\n    if (result !== undefined) {\n      return result;\n    }\n    if (!isObject(value)) {\n      return value;\n    }\n    var isArr = isArray(value);\n    if (isArr) {\n      result = initCloneArray(value);\n      if (!isDeep) {\n        return copyArray(value, result);\n      }\n    } else {\n      var tag = getTag(value),\n          isFunc = tag == funcTag || tag == genTag;\n\n      if (isBuffer(value)) {\n        return cloneBuffer(value, isDeep);\n      }\n      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {\n        result = (isFlat || isFunc) ? {} : initCloneObject(value);\n        if (!isDeep) {\n          return isFlat\n              ? copySymbolsIn(value, baseAssignIn(result, value))\n              : copySymbols(value, baseAssign(result, value));\n        }\n      } else {\n        if (!cloneableTags[tag]) {\n          return object ? value : {};\n        }\n        result = initCloneByTag(value, tag, isDeep);\n      }\n    }\n    // Check for circular references and return its corresponding clone.\n    stack || (stack = new Stack);\n    var stacked = stack.get(value);\n    if (stacked) {\n      return stacked;\n    }\n    stack.set(value, result);\n\n    if (isSet(value)) {\n      value.forEach(function(subValue) {\n        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));\n      });\n\n      return result;\n    }\n\n    if (isMap(value)) {\n      value.forEach(function(subValue, key) {\n        result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));\n      });\n\n      return result;\n    }\n\n    var keysFunc = isFull\n        ? (isFlat ? getAllKeysIn : getAllKeys)\n        : (isFlat ? keysIn : keys);\n\n    var props = isArr ? undefined : keysFunc(value);\n    arrayEach(props || value, function(subValue, key) {\n      if (props) {\n        key = subValue;\n        subValue = value[key];\n      }\n      // Recursively populate clone (susceptible to call stack limits).\n      assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));\n    });\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.delay` and `_.defer` which accepts `args`\n   * to provide to `func`.\n   *\n   * @private\n   * @param {Function} func The function to delay.\n   * @param {number} wait The number of milliseconds to delay invocation.\n   * @param {Array} args The arguments to provide to `func`.\n   * @returns {number|Object} Returns the timer id or timeout object.\n   */\n  function baseDelay(func, wait, args) {\n    if (typeof func != 'function') {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    return setTimeout(function() { func.apply(undefined, args); }, wait);\n  }\n\n  /**\n   * The base implementation of methods like `_.difference` without support\n   * for excluding multiple arrays or iteratee shorthands.\n   *\n   * @private\n   * @param {Array} array The array to inspect.\n   * @param {Array} values The values to exclude.\n   * @param {Function} [iteratee] The iteratee invoked per element.\n   * @param {Function} [comparator] The comparator invoked per element.\n   * @returns {Array} Returns the new array of filtered values.\n   */\n  function baseDifference(array, values, iteratee, comparator) {\n    var index = -1,\n        includes = arrayIncludes,\n        isCommon = true,\n        length = array.length,\n        result = [],\n        valuesLength = values.length;\n\n    if (!length) {\n      return result;\n    }\n    if (iteratee) {\n      values = arrayMap(values, baseUnary(iteratee));\n    }\n    if (comparator) {\n      includes = arrayIncludesWith;\n      isCommon = false;\n    }\n    else if (values.length >= LARGE_ARRAY_SIZE) {\n      includes = cacheHas;\n      isCommon = false;\n      values = new SetCache(values);\n    }\n    outer:\n        while (++index < length) {\n          var value = array[index],\n              computed = iteratee == null ? value : iteratee(value);\n\n          value = (comparator || value !== 0) ? value : 0;\n          if (isCommon && computed === computed) {\n            var valuesIndex = valuesLength;\n            while (valuesIndex--) {\n              if (values[valuesIndex] === computed) {\n                continue outer;\n              }\n            }\n            result.push(value);\n          }\n          else if (!includes(values, computed, comparator)) {\n            result.push(value);\n          }\n        }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.forEach` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @returns {Array|Object} Returns `collection`.\n   */\n  var baseEach = createBaseEach(baseForOwn);\n\n  /**\n   * The base implementation of `_.every` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} predicate The function invoked per iteration.\n   * @returns {boolean} Returns `true` if all elements pass the predicate check,\n   *  else `false`\n   */\n  function baseEvery(collection, predicate) {\n    var result = true;\n    baseEach(collection, function(value, index, collection) {\n      result = !!predicate(value, index, collection);\n      return result;\n    });\n    return result;\n  }\n\n  /**\n   * The base implementation of methods like `_.max` and `_.min` which accepts a\n   * `comparator` to determine the extremum value.\n   *\n   * @private\n   * @param {Array} array The array to iterate over.\n   * @param {Function} iteratee The iteratee invoked per iteration.\n   * @param {Function} comparator The comparator used to compare values.\n   * @returns {*} Returns the extremum value.\n   */\n  function baseExtremum(array, iteratee, comparator) {\n    var index = -1,\n        length = array.length;\n\n    while (++index < length) {\n      var value = array[index],\n          current = iteratee(value);\n\n      if (current != null && (computed === undefined\n              ? (current === current && !isSymbol(current))\n              : comparator(current, computed)\n      )) {\n        var computed = current,\n            result = value;\n      }\n    }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.filter` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} predicate The function invoked per iteration.\n   * @returns {Array} Returns the new filtered array.\n   */\n  function baseFilter(collection, predicate) {\n    var result = [];\n    baseEach(collection, function(value, index, collection) {\n      if (predicate(value, index, collection)) {\n        result.push(value);\n      }\n    });\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.flatten` with support for restricting flattening.\n   *\n   * @private\n   * @param {Array} array The array to flatten.\n   * @param {number} depth The maximum recursion depth.\n   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.\n   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.\n   * @param {Array} [result=[]] The initial result value.\n   * @returns {Array} Returns the new flattened array.\n   */\n  function baseFlatten(array, depth, predicate, isStrict, result) {\n    var index = -1,\n        length = array.length;\n\n    predicate || (predicate = isFlattenable);\n    result || (result = []);\n\n    while (++index < length) {\n      var value = array[index];\n      if (depth > 0 && predicate(value)) {\n        if (depth > 1) {\n          // Recursively flatten arrays (susceptible to call stack limits).\n          baseFlatten(value, depth - 1, predicate, isStrict, result);\n        } else {\n          arrayPush(result, value);\n        }\n      } else if (!isStrict) {\n        result[result.length] = value;\n      }\n    }\n    return result;\n  }\n\n  /**\n   * The base implementation of `baseForOwn` which iterates over `object`\n   * properties returned by `keysFunc` and invokes `iteratee` for each property.\n   * Iteratee functions may exit iteration early by explicitly returning `false`.\n   *\n   * @private\n   * @param {Object} object The object to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @param {Function} keysFunc The function to get the keys of `object`.\n   * @returns {Object} Returns `object`.\n   */\n  var baseFor = createBaseFor();\n\n  /**\n   * This function is like `baseFor` except that it iterates over properties\n   * in the opposite order.\n   *\n   * @private\n   * @param {Object} object The object to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @param {Function} keysFunc The function to get the keys of `object`.\n   * @returns {Object} Returns `object`.\n   */\n  var baseForRight = createBaseFor(true);\n\n  /**\n   * The base implementation of `_.forOwn` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Object} object The object to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @returns {Object} Returns `object`.\n   */\n  function baseForOwn(object, iteratee) {\n    return object && baseFor(object, iteratee, keys);\n  }\n\n  /**\n   * The base implementation of `_.forOwnRight` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Object} object The object to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @returns {Object} Returns `object`.\n   */\n  function baseForOwnRight(object, iteratee) {\n    return object && baseForRight(object, iteratee, keys);\n  }\n\n  /**\n   * The base implementation of `_.functions` which creates an array of\n   * `object` function property names filtered from `props`.\n   *\n   * @private\n   * @param {Object} object The object to inspect.\n   * @param {Array} props The property names to filter.\n   * @returns {Array} Returns the function names.\n   */\n  function baseFunctions(object, props) {\n    return arrayFilter(props, function(key) {\n      return isFunction(object[key]);\n    });\n  }\n\n  /**\n   * The base implementation of `_.get` without support for default values.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @param {Array|string} path The path of the property to get.\n   * @returns {*} Returns the resolved value.\n   */\n  function baseGet(object, path) {\n    path = castPath(path, object);\n\n    var index = 0,\n        length = path.length;\n\n    while (object != null && index < length) {\n      object = object[toKey(path[index++])];\n    }\n    return (index && index == length) ? object : undefined;\n  }\n\n  /**\n   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses\n   * `keysFunc` and `symbolsFunc` to get the enumerable property names and\n   * symbols of `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @param {Function} keysFunc The function to get the keys of `object`.\n   * @param {Function} symbolsFunc The function to get the symbols of `object`.\n   * @returns {Array} Returns the array of property names and symbols.\n   */\n  function baseGetAllKeys(object, keysFunc, symbolsFunc) {\n    var result = keysFunc(object);\n    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));\n  }\n\n  /**\n   * The base implementation of `getTag` without fallbacks for buggy environments.\n   *\n   * @private\n   * @param {*} value The value to query.\n   * @returns {string} Returns the `toStringTag`.\n   */\n  function baseGetTag(value) {\n    if (value == null) {\n      return value === undefined ? undefinedTag : nullTag;\n    }\n    return (symToStringTag && symToStringTag in Object(value))\n        ? getRawTag(value)\n        : objectToString(value);\n  }\n\n  /**\n   * The base implementation of `_.gt` which doesn't coerce arguments.\n   *\n   * @private\n   * @param {*} value The value to compare.\n   * @param {*} other The other value to compare.\n   * @returns {boolean} Returns `true` if `value` is greater than `other`,\n   *  else `false`.\n   */\n  function baseGt(value, other) {\n    return value > other;\n  }\n\n  /**\n   * The base implementation of `_.has` without support for deep paths.\n   *\n   * @private\n   * @param {Object} [object] The object to query.\n   * @param {Array|string} key The key to check.\n   * @returns {boolean} Returns `true` if `key` exists, else `false`.\n   */\n  function baseHas(object, key) {\n    return object != null && hasOwnProperty.call(object, key);\n  }\n\n  /**\n   * The base implementation of `_.hasIn` without support for deep paths.\n   *\n   * @private\n   * @param {Object} [object] The object to query.\n   * @param {Array|string} key The key to check.\n   * @returns {boolean} Returns `true` if `key` exists, else `false`.\n   */\n  function baseHasIn(object, key) {\n    return object != null && key in Object(object);\n  }\n\n  /**\n   * The base implementation of methods like `_.intersection`, without support\n   * for iteratee shorthands, that accepts an array of arrays to inspect.\n   *\n   * @private\n   * @param {Array} arrays The arrays to inspect.\n   * @param {Function} [iteratee] The iteratee invoked per element.\n   * @param {Function} [comparator] The comparator invoked per element.\n   * @returns {Array} Returns the new array of shared values.\n   */\n  function baseIntersection(arrays, iteratee, comparator) {\n    var includes = comparator ? arrayIncludesWith : arrayIncludes,\n        length = arrays[0].length,\n        othLength = arrays.length,\n        othIndex = othLength,\n        caches = Array(othLength),\n        maxLength = Infinity,\n        result = [];\n\n    while (othIndex--) {\n      var array = arrays[othIndex];\n      if (othIndex && iteratee) {\n        array = arrayMap(array, baseUnary(iteratee));\n      }\n      maxLength = nativeMin(array.length, maxLength);\n      caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))\n          ? new SetCache(othIndex && array)\n          : undefined;\n    }\n    array = arrays[0];\n\n    var index = -1,\n        seen = caches[0];\n\n    outer:\n        while (++index < length && result.length < maxLength) {\n          var value = array[index],\n              computed = iteratee ? iteratee(value) : value;\n\n          value = (comparator || value !== 0) ? value : 0;\n          if (!(seen\n                  ? cacheHas(seen, computed)\n                  : includes(result, computed, comparator)\n          )) {\n            othIndex = othLength;\n            while (--othIndex) {\n              var cache = caches[othIndex];\n              if (!(cache\n                  ? cacheHas(cache, computed)\n                  : includes(arrays[othIndex], computed, comparator))\n              ) {\n                continue outer;\n              }\n            }\n            if (seen) {\n              seen.push(computed);\n            }\n            result.push(value);\n          }\n        }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.invert` and `_.invertBy` which inverts\n   * `object` with values transformed by `iteratee` and set by `setter`.\n   *\n   * @private\n   * @param {Object} object The object to iterate over.\n   * @param {Function} setter The function to set `accumulator` values.\n   * @param {Function} iteratee The iteratee to transform values.\n   * @param {Object} accumulator The initial inverted object.\n   * @returns {Function} Returns `accumulator`.\n   */\n  function baseInverter(object, setter, iteratee, accumulator) {\n    baseForOwn(object, function(value, key, object) {\n      setter(accumulator, iteratee(value), key, object);\n    });\n    return accumulator;\n  }\n\n  /**\n   * The base implementation of `_.invoke` without support for individual\n   * method arguments.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @param {Array|string} path The path of the method to invoke.\n   * @param {Array} args The arguments to invoke the method with.\n   * @returns {*} Returns the result of the invoked method.\n   */\n  function baseInvoke(object, path, args) {\n    path = castPath(path, object);\n    object = parent(object, path);\n    var func = object == null ? object : object[toKey(last(path))];\n    return func == null ? undefined : apply(func, object, args);\n  }\n\n  /**\n   * The base implementation of `_.isArguments`.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is an `arguments` object,\n   */\n  function baseIsArguments(value) {\n    return isObjectLike(value) && baseGetTag(value) == argsTag;\n  }\n\n  /**\n   * The base implementation of `_.isDate` without Node.js optimizations.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a date object, else `false`.\n   */\n  function baseIsDate(value) {\n    return isObjectLike(value) && baseGetTag(value) == dateTag;\n  }\n\n  /**\n   * The base implementation of `_.isEqual` which supports partial comparisons\n   * and tracks traversed objects.\n   *\n   * @private\n   * @param {*} value The value to compare.\n   * @param {*} other The other value to compare.\n   * @param {boolean} bitmask The bitmask flags.\n   *  1 - Unordered comparison\n   *  2 - Partial comparison\n   * @param {Function} [customizer] The function to customize comparisons.\n   * @param {Object} [stack] Tracks traversed `value` and `other` objects.\n   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\n   */\n  function baseIsEqual(value, other, bitmask, customizer, stack) {\n    if (value === other) {\n      return true;\n    }\n    if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {\n      return value !== value && other !== other;\n    }\n    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);\n  }\n\n  /**\n   * A specialized version of `baseIsEqual` for arrays and objects which performs\n   * deep comparisons and tracks traversed objects enabling objects with circular\n   * references to be compared.\n   *\n   * @private\n   * @param {Object} object The object to compare.\n   * @param {Object} other The other object to compare.\n   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\n   * @param {Function} customizer The function to customize comparisons.\n   * @param {Function} equalFunc The function to determine equivalents of values.\n   * @param {Object} [stack] Tracks traversed `object` and `other` objects.\n   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\n   */\n  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {\n    var objIsArr = isArray(object),\n        othIsArr = isArray(other),\n        objTag = objIsArr ? arrayTag : getTag(object),\n        othTag = othIsArr ? arrayTag : getTag(other);\n\n    objTag = objTag == argsTag ? objectTag : objTag;\n    othTag = othTag == argsTag ? objectTag : othTag;\n\n    var objIsObj = objTag == objectTag,\n        othIsObj = othTag == objectTag,\n        isSameTag = objTag == othTag;\n\n    if (isSameTag && isBuffer(object)) {\n      if (!isBuffer(other)) {\n        return false;\n      }\n      objIsArr = true;\n      objIsObj = false;\n    }\n    if (isSameTag && !objIsObj) {\n      stack || (stack = new Stack);\n      return (objIsArr || isTypedArray(object))\n          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)\n          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);\n    }\n    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {\n      var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),\n          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');\n\n      if (objIsWrapped || othIsWrapped) {\n        var objUnwrapped = objIsWrapped ? object.value() : object,\n            othUnwrapped = othIsWrapped ? other.value() : other;\n\n        stack || (stack = new Stack);\n        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);\n      }\n    }\n    if (!isSameTag) {\n      return false;\n    }\n    stack || (stack = new Stack);\n    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);\n  }\n\n  /**\n   * The base implementation of `_.isMap` without Node.js optimizations.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a map, else `false`.\n   */\n  function baseIsMap(value) {\n    return isObjectLike(value) && getTag(value) == mapTag;\n  }\n\n  /**\n   * The base implementation of `_.isMatch` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Object} object The object to inspect.\n   * @param {Object} source The object of property values to match.\n   * @param {Array} matchData The property names, values, and compare flags to match.\n   * @param {Function} [customizer] The function to customize comparisons.\n   * @returns {boolean} Returns `true` if `object` is a match, else `false`.\n   */\n  function baseIsMatch(object, source, matchData, customizer) {\n    var index = matchData.length,\n        length = index,\n        noCustomizer = !customizer;\n\n    if (object == null) {\n      return !length;\n    }\n    object = Object(object);\n    while (index--) {\n      var data = matchData[index];\n      if ((noCustomizer && data[2])\n          ? data[1] !== object[data[0]]\n          : !(data[0] in object)\n      ) {\n        return false;\n      }\n    }\n    while (++index < length) {\n      data = matchData[index];\n      var key = data[0],\n          objValue = object[key],\n          srcValue = data[1];\n\n      if (noCustomizer && data[2]) {\n        if (objValue === undefined && !(key in object)) {\n          return false;\n        }\n      } else {\n        var stack = new Stack;\n        if (customizer) {\n          var result = customizer(objValue, srcValue, key, object, source, stack);\n        }\n        if (!(result === undefined\n                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)\n                : result\n        )) {\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n\n  /**\n   * The base implementation of `_.isNative` without bad shim checks.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a native function,\n   *  else `false`.\n   */\n  function baseIsNative(value) {\n    if (!isObject(value) || isMasked(value)) {\n      return false;\n    }\n    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;\n    return pattern.test(toSource(value));\n  }\n\n  /**\n   * The base implementation of `_.isRegExp` without Node.js optimizations.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.\n   */\n  function baseIsRegExp(value) {\n    return isObjectLike(value) && baseGetTag(value) == regexpTag;\n  }\n\n  /**\n   * The base implementation of `_.isSet` without Node.js optimizations.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a set, else `false`.\n   */\n  function baseIsSet(value) {\n    return isObjectLike(value) && getTag(value) == setTag;\n  }\n\n  /**\n   * The base implementation of `_.isTypedArray` without Node.js optimizations.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.\n   */\n  function baseIsTypedArray(value) {\n    return isObjectLike(value) &&\n        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];\n  }\n\n  /**\n   * The base implementation of `_.iteratee`.\n   *\n   * @private\n   * @param {*} [value=_.identity] The value to convert to an iteratee.\n   * @returns {Function} Returns the iteratee.\n   */\n  function baseIteratee(value) {\n    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.\n    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.\n    if (typeof value == 'function') {\n      return value;\n    }\n    if (value == null) {\n      return identity;\n    }\n    if (typeof value == 'object') {\n      return isArray(value)\n          ? baseMatchesProperty(value[0], value[1])\n          : baseMatches(value);\n    }\n    return property(value);\n  }\n\n  /**\n   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of property names.\n   */\n  function baseKeys(object) {\n    if (!isPrototype(object)) {\n      return nativeKeys(object);\n    }\n    var result = [];\n    for (var key in Object(object)) {\n      if (hasOwnProperty.call(object, key) && key != 'constructor') {\n        result.push(key);\n      }\n    }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of property names.\n   */\n  function baseKeysIn(object) {\n    if (!isObject(object)) {\n      return nativeKeysIn(object);\n    }\n    var isProto = isPrototype(object),\n        result = [];\n\n    for (var key in object) {\n      if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {\n        result.push(key);\n      }\n    }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.lt` which doesn't coerce arguments.\n   *\n   * @private\n   * @param {*} value The value to compare.\n   * @param {*} other The other value to compare.\n   * @returns {boolean} Returns `true` if `value` is less than `other`,\n   *  else `false`.\n   */\n  function baseLt(value, other) {\n    return value < other;\n  }\n\n  /**\n   * The base implementation of `_.map` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} iteratee The function invoked per iteration.\n   * @returns {Array} Returns the new mapped array.\n   */\n  function baseMap(collection, iteratee) {\n    var index = -1,\n        result = isArrayLike(collection) ? Array(collection.length) : [];\n\n    baseEach(collection, function(value, key, collection) {\n      result[++index] = iteratee(value, key, collection);\n    });\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.matches` which doesn't clone `source`.\n   *\n   * @private\n   * @param {Object} source The object of property values to match.\n   * @returns {Function} Returns the new spec function.\n   */\n  function baseMatches(source) {\n    var matchData = getMatchData(source);\n    if (matchData.length == 1 && matchData[0][2]) {\n      return matchesStrictComparable(matchData[0][0], matchData[0][1]);\n    }\n    return function(object) {\n      return object === source || baseIsMatch(object, source, matchData);\n    };\n  }\n\n  /**\n   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.\n   *\n   * @private\n   * @param {string} path The path of the property to get.\n   * @param {*} srcValue The value to match.\n   * @returns {Function} Returns the new spec function.\n   */\n  function baseMatchesProperty(path, srcValue) {\n    if (isKey(path) && isStrictComparable(srcValue)) {\n      return matchesStrictComparable(toKey(path), srcValue);\n    }\n    return function(object) {\n      var objValue = get(object, path);\n      return (objValue === undefined && objValue === srcValue)\n          ? hasIn(object, path)\n          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);\n    };\n  }\n\n  /**\n   * The base implementation of `_.merge` without support for multiple sources.\n   *\n   * @private\n   * @param {Object} object The destination object.\n   * @param {Object} source The source object.\n   * @param {number} srcIndex The index of `source`.\n   * @param {Function} [customizer] The function to customize merged values.\n   * @param {Object} [stack] Tracks traversed source values and their merged\n   *  counterparts.\n   */\n  function baseMerge(object, source, srcIndex, customizer, stack) {\n    if (object === source) {\n      return;\n    }\n    baseFor(source, function(srcValue, key) {\n      if (isObject(srcValue)) {\n        stack || (stack = new Stack);\n        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);\n      }\n      else {\n        var newValue = customizer\n            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)\n            : undefined;\n\n        if (newValue === undefined) {\n          newValue = srcValue;\n        }\n        assignMergeValue(object, key, newValue);\n      }\n    }, keysIn);\n  }\n\n  /**\n   * A specialized version of `baseMerge` for arrays and objects which performs\n   * deep merges and tracks traversed objects enabling objects with circular\n   * references to be merged.\n   *\n   * @private\n   * @param {Object} object The destination object.\n   * @param {Object} source The source object.\n   * @param {string} key The key of the value to merge.\n   * @param {number} srcIndex The index of `source`.\n   * @param {Function} mergeFunc The function to merge values.\n   * @param {Function} [customizer] The function to customize assigned values.\n   * @param {Object} [stack] Tracks traversed source values and their merged\n   *  counterparts.\n   */\n  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {\n    var objValue = safeGet(object, key),\n        srcValue = safeGet(source, key),\n        stacked = stack.get(srcValue);\n\n    if (stacked) {\n      assignMergeValue(object, key, stacked);\n      return;\n    }\n    var newValue = customizer\n        ? customizer(objValue, srcValue, (key + ''), object, source, stack)\n        : undefined;\n\n    var isCommon = newValue === undefined;\n\n    if (isCommon) {\n      var isArr = isArray(srcValue),\n          isBuff = !isArr && isBuffer(srcValue),\n          isTyped = !isArr && !isBuff && isTypedArray(srcValue);\n\n      newValue = srcValue;\n      if (isArr || isBuff || isTyped) {\n        if (isArray(objValue)) {\n          newValue = objValue;\n        }\n        else if (isArrayLikeObject(objValue)) {\n          newValue = copyArray(objValue);\n        }\n        else if (isBuff) {\n          isCommon = false;\n          newValue = cloneBuffer(srcValue, true);\n        }\n        else if (isTyped) {\n          isCommon = false;\n          newValue = cloneTypedArray(srcValue, true);\n        }\n        else {\n          newValue = [];\n        }\n      }\n      else if (isPlainObject(srcValue) || isArguments(srcValue)) {\n        newValue = objValue;\n        if (isArguments(objValue)) {\n          newValue = toPlainObject(objValue);\n        }\n        else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {\n          newValue = initCloneObject(srcValue);\n        }\n      }\n      else {\n        isCommon = false;\n      }\n    }\n    if (isCommon) {\n      // Recursively merge objects and arrays (susceptible to call stack limits).\n      stack.set(srcValue, newValue);\n      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);\n      stack['delete'](srcValue);\n    }\n    assignMergeValue(object, key, newValue);\n  }\n\n  /**\n   * The base implementation of `_.orderBy` without param guards.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.\n   * @param {string[]} orders The sort orders of `iteratees`.\n   * @returns {Array} Returns the new sorted array.\n   */\n  function baseOrderBy(collection, iteratees, orders) {\n    var index = -1;\n    iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));\n\n    var result = baseMap(collection, function(value, key, collection) {\n      var criteria = arrayMap(iteratees, function(iteratee) {\n        return iteratee(value);\n      });\n      return { 'criteria': criteria, 'index': ++index, 'value': value };\n    });\n\n    return baseSortBy(result, function(object, other) {\n      return compareMultiple(object, other, orders);\n    });\n  }\n\n  /**\n   * The base implementation of `_.pick` without support for individual\n   * property identifiers.\n   *\n   * @private\n   * @param {Object} object The source object.\n   * @param {string[]} paths The property paths to pick.\n   * @returns {Object} Returns the new object.\n   */\n  function basePick(object, paths) {\n    return basePickBy(object, paths, function(value, path) {\n      return hasIn(object, path);\n    });\n  }\n\n  /**\n   * The base implementation of  `_.pickBy` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Object} object The source object.\n   * @param {string[]} paths The property paths to pick.\n   * @param {Function} predicate The function invoked per property.\n   * @returns {Object} Returns the new object.\n   */\n  function basePickBy(object, paths, predicate) {\n    var index = -1,\n        length = paths.length,\n        result = {};\n\n    while (++index < length) {\n      var path = paths[index],\n          value = baseGet(object, path);\n\n      if (predicate(value, path)) {\n        baseSet(result, castPath(path, object), value);\n      }\n    }\n    return result;\n  }\n\n  /**\n   * A specialized version of `baseProperty` which supports deep paths.\n   *\n   * @private\n   * @param {Array|string} path The path of the property to get.\n   * @returns {Function} Returns the new accessor function.\n   */\n  function basePropertyDeep(path) {\n    return function(object) {\n      return baseGet(object, path);\n    };\n  }\n\n  /**\n   * The base implementation of `_.random` without support for returning\n   * floating-point numbers.\n   *\n   * @private\n   * @param {number} lower The lower bound.\n   * @param {number} upper The upper bound.\n   * @returns {number} Returns the random number.\n   */\n  function baseRandom(lower, upper) {\n    return lower + nativeFloor(nativeRandom() * (upper - lower + 1));\n  }\n\n  /**\n   * The base implementation of `_.range` and `_.rangeRight` which doesn't\n   * coerce arguments.\n   *\n   * @private\n   * @param {number} start The start of the range.\n   * @param {number} end The end of the range.\n   * @param {number} step The value to increment or decrement by.\n   * @param {boolean} [fromRight] Specify iterating from right to left.\n   * @returns {Array} Returns the range of numbers.\n   */\n  function baseRange(start, end, step, fromRight) {\n    var index = -1,\n        length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),\n        result = Array(length);\n\n    while (length--) {\n      result[fromRight ? length : ++index] = start;\n      start += step;\n    }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.rest` which doesn't validate or coerce arguments.\n   *\n   * @private\n   * @param {Function} func The function to apply a rest parameter to.\n   * @param {number} [start=func.length-1] The start position of the rest parameter.\n   * @returns {Function} Returns the new function.\n   */\n  function baseRest(func, start) {\n    return setToString(overRest(func, start, identity), func + '');\n  }\n\n  /**\n   * The base implementation of `_.set`.\n   *\n   * @private\n   * @param {Object} object The object to modify.\n   * @param {Array|string} path The path of the property to set.\n   * @param {*} value The value to set.\n   * @param {Function} [customizer] The function to customize path creation.\n   * @returns {Object} Returns `object`.\n   */\n  function baseSet(object, path, value, customizer) {\n    if (!isObject(object)) {\n      return object;\n    }\n    path = castPath(path, object);\n\n    var index = -1,\n        length = path.length,\n        lastIndex = length - 1,\n        nested = object;\n\n    while (nested != null && ++index < length) {\n      var key = toKey(path[index]),\n          newValue = value;\n\n      if (index != lastIndex) {\n        var objValue = nested[key];\n        newValue = customizer ? customizer(objValue, key, nested) : undefined;\n        if (newValue === undefined) {\n          newValue = isObject(objValue)\n              ? objValue\n              : (isIndex(path[index + 1]) ? [] : {});\n        }\n      }\n      assignValue(nested, key, newValue);\n      nested = nested[key];\n    }\n    return object;\n  }\n\n  /**\n   * The base implementation of `setData` without support for hot loop shorting.\n   *\n   * @private\n   * @param {Function} func The function to associate metadata with.\n   * @param {*} data The metadata.\n   * @returns {Function} Returns `func`.\n   */\n  var baseSetData = !metaMap ? identity : function(func, data) {\n    metaMap.set(func, data);\n    return func;\n  };\n\n  /**\n   * The base implementation of `setToString` without support for hot loop shorting.\n   *\n   * @private\n   * @param {Function} func The function to modify.\n   * @param {Function} string The `toString` result.\n   * @returns {Function} Returns `func`.\n   */\n  var baseSetToString = !defineProperty ? identity : function(func, string) {\n    return defineProperty(func, 'toString', {\n      'configurable': true,\n      'enumerable': false,\n      'value': constant(string),\n      'writable': true\n    });\n  };\n\n  /**\n   * The base implementation of `_.slice` without an iteratee call guard.\n   *\n   * @private\n   * @param {Array} array The array to slice.\n   * @param {number} [start=0] The start position.\n   * @param {number} [end=array.length] The end position.\n   * @returns {Array} Returns the slice of `array`.\n   */\n  function baseSlice(array, start, end) {\n    var index = -1,\n        length = array.length;\n\n    if (start < 0) {\n      start = -start > length ? 0 : (length + start);\n    }\n    end = end > length ? length : end;\n    if (end < 0) {\n      end += length;\n    }\n    length = start > end ? 0 : ((end - start) >>> 0);\n    start >>>= 0;\n\n    var result = Array(length);\n    while (++index < length) {\n      result[index] = array[index + start];\n    }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.some` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} predicate The function invoked per iteration.\n   * @returns {boolean} Returns `true` if any element passes the predicate check,\n   *  else `false`.\n   */\n  function baseSome(collection, predicate) {\n    var result;\n\n    baseEach(collection, function(value, index, collection) {\n      result = predicate(value, index, collection);\n      return !result;\n    });\n    return !!result;\n  }\n\n  /**\n   * The base implementation of `_.toString` which doesn't convert nullish\n   * values to empty strings.\n   *\n   * @private\n   * @param {*} value The value to process.\n   * @returns {string} Returns the string.\n   */\n  function baseToString(value) {\n    // Exit early for strings to avoid a performance hit in some environments.\n    if (typeof value == 'string') {\n      return value;\n    }\n    if (isArray(value)) {\n      // Recursively convert values (susceptible to call stack limits).\n      return arrayMap(value, baseToString) + '';\n    }\n    if (isSymbol(value)) {\n      return symbolToString ? symbolToString.call(value) : '';\n    }\n    var result = (value + '');\n    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;\n  }\n\n  /**\n   * The base implementation of `_.uniqBy` without support for iteratee shorthands.\n   *\n   * @private\n   * @param {Array} array The array to inspect.\n   * @param {Function} [iteratee] The iteratee invoked per element.\n   * @param {Function} [comparator] The comparator invoked per element.\n   * @returns {Array} Returns the new duplicate free array.\n   */\n  function baseUniq(array, iteratee, comparator) {\n    var index = -1,\n        includes = arrayIncludes,\n        length = array.length,\n        isCommon = true,\n        result = [],\n        seen = result;\n\n    if (comparator) {\n      isCommon = false;\n      includes = arrayIncludesWith;\n    }\n    else if (length >= LARGE_ARRAY_SIZE) {\n      var set = iteratee ? null : createSet(array);\n      if (set) {\n        return setToArray(set);\n      }\n      isCommon = false;\n      includes = cacheHas;\n      seen = new SetCache;\n    }\n    else {\n      seen = iteratee ? [] : result;\n    }\n    outer:\n        while (++index < length) {\n          var value = array[index],\n              computed = iteratee ? iteratee(value) : value;\n\n          value = (comparator || value !== 0) ? value : 0;\n          if (isCommon && computed === computed) {\n            var seenIndex = seen.length;\n            while (seenIndex--) {\n              if (seen[seenIndex] === computed) {\n                continue outer;\n              }\n            }\n            if (iteratee) {\n              seen.push(computed);\n            }\n            result.push(value);\n          }\n          else if (!includes(seen, computed, comparator)) {\n            if (seen !== result) {\n              seen.push(computed);\n            }\n            result.push(value);\n          }\n        }\n    return result;\n  }\n\n  /**\n   * The base implementation of `_.unset`.\n   *\n   * @private\n   * @param {Object} object The object to modify.\n   * @param {Array|string} path The property path to unset.\n   * @returns {boolean} Returns `true` if the property is deleted, else `false`.\n   */\n  function baseUnset(object, path) {\n    path = castPath(path, object);\n    object = parent(object, path);\n    return object == null || delete object[toKey(last(path))];\n  }\n\n  /**\n   * The base implementation of `wrapperValue` which returns the result of\n   * performing a sequence of actions on the unwrapped `value`, where each\n   * successive action is supplied the return value of the previous.\n   *\n   * @private\n   * @param {*} value The unwrapped value.\n   * @param {Array} actions Actions to perform to resolve the unwrapped value.\n   * @returns {*} Returns the resolved value.\n   */\n  function baseWrapperValue(value, actions) {\n    var result = value;\n    if (result instanceof LazyWrapper) {\n      result = result.value();\n    }\n    return arrayReduce(actions, function(result, action) {\n      return action.func.apply(action.thisArg, arrayPush([result], action.args));\n    }, result);\n  }\n\n  /**\n   * This base implementation of `_.zipObject` which assigns values using `assignFunc`.\n   *\n   * @private\n   * @param {Array} props The property identifiers.\n   * @param {Array} values The property values.\n   * @param {Function} assignFunc The function to assign values.\n   * @returns {Object} Returns the new object.\n   */\n  function baseZipObject(props, values, assignFunc) {\n    var index = -1,\n        length = props.length,\n        valsLength = values.length,\n        result = {};\n\n    while (++index < length) {\n      var value = index < valsLength ? values[index] : undefined;\n      assignFunc(result, props[index], value);\n    }\n    return result;\n  }\n\n  /**\n   * Casts `value` to an empty array if it's not an array like object.\n   *\n   * @private\n   * @param {*} value The value to inspect.\n   * @returns {Array|Object} Returns the cast array-like object.\n   */\n  function castArrayLikeObject(value) {\n    return isArrayLikeObject(value) ? value : [];\n  }\n\n  /**\n   * Casts `value` to a path array if it's not one.\n   *\n   * @private\n   * @param {*} value The value to inspect.\n   * @param {Object} [object] The object to query keys on.\n   * @returns {Array} Returns the cast property path array.\n   */\n  function castPath(value, object) {\n    if (isArray(value)) {\n      return value;\n    }\n    return isKey(value, object) ? [value] : stringToPath(toString(value));\n  }\n\n  /**\n   * Casts `array` to a slice if it's needed.\n   *\n   * @private\n   * @param {Array} array The array to inspect.\n   * @param {number} start The start position.\n   * @param {number} [end=array.length] The end position.\n   * @returns {Array} Returns the cast slice.\n   */\n  function castSlice(array, start, end) {\n    var length = array.length;\n    end = end === undefined ? length : end;\n    return (!start && end >= length) ? array : baseSlice(array, start, end);\n  }\n\n  /**\n   * Creates a clone of  `buffer`.\n   *\n   * @private\n   * @param {Buffer} buffer The buffer to clone.\n   * @param {boolean} [isDeep] Specify a deep clone.\n   * @returns {Buffer} Returns the cloned buffer.\n   */\n  function cloneBuffer(buffer, isDeep) {\n    if (isDeep) {\n      return buffer.slice();\n    }\n    var length = buffer.length,\n        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);\n\n    buffer.copy(result);\n    return result;\n  }\n\n  /**\n   * Creates a clone of `arrayBuffer`.\n   *\n   * @private\n   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.\n   * @returns {ArrayBuffer} Returns the cloned array buffer.\n   */\n  function cloneArrayBuffer(arrayBuffer) {\n    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);\n    new Uint8Array(result).set(new Uint8Array(arrayBuffer));\n    return result;\n  }\n\n  /**\n   * Creates a clone of `dataView`.\n   *\n   * @private\n   * @param {Object} dataView The data view to clone.\n   * @param {boolean} [isDeep] Specify a deep clone.\n   * @returns {Object} Returns the cloned data view.\n   */\n  function cloneDataView(dataView, isDeep) {\n    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;\n    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);\n  }\n\n  /**\n   * Creates a clone of `regexp`.\n   *\n   * @private\n   * @param {Object} regexp The regexp to clone.\n   * @returns {Object} Returns the cloned regexp.\n   */\n  function cloneRegExp(regexp) {\n    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));\n    result.lastIndex = regexp.lastIndex;\n    return result;\n  }\n\n  /**\n   * Creates a clone of the `symbol` object.\n   *\n   * @private\n   * @param {Object} symbol The symbol object to clone.\n   * @returns {Object} Returns the cloned symbol object.\n   */\n  function cloneSymbol(symbol) {\n    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};\n  }\n\n  /**\n   * Creates a clone of `typedArray`.\n   *\n   * @private\n   * @param {Object} typedArray The typed array to clone.\n   * @param {boolean} [isDeep] Specify a deep clone.\n   * @returns {Object} Returns the cloned typed array.\n   */\n  function cloneTypedArray(typedArray, isDeep) {\n    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;\n    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);\n  }\n\n  /**\n   * Compares values to sort them in ascending order.\n   *\n   * @private\n   * @param {*} value The value to compare.\n   * @param {*} other The other value to compare.\n   * @returns {number} Returns the sort order indicator for `value`.\n   */\n  function compareAscending(value, other) {\n    if (value !== other) {\n      var valIsDefined = value !== undefined,\n          valIsNull = value === null,\n          valIsReflexive = value === value,\n          valIsSymbol = isSymbol(value);\n\n      var othIsDefined = other !== undefined,\n          othIsNull = other === null,\n          othIsReflexive = other === other,\n          othIsSymbol = isSymbol(other);\n\n      if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||\n          (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||\n          (valIsNull && othIsDefined && othIsReflexive) ||\n          (!valIsDefined && othIsReflexive) ||\n          !valIsReflexive) {\n        return 1;\n      }\n      if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||\n          (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||\n          (othIsNull && valIsDefined && valIsReflexive) ||\n          (!othIsDefined && valIsReflexive) ||\n          !othIsReflexive) {\n        return -1;\n      }\n    }\n    return 0;\n  }\n\n  /**\n   * Used by `_.orderBy` to compare multiple properties of a value to another\n   * and stable sort them.\n   *\n   * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,\n   * specify an order of \"desc\" for descending or \"asc\" for ascending sort order\n   * of corresponding values.\n   *\n   * @private\n   * @param {Object} object The object to compare.\n   * @param {Object} other The other object to compare.\n   * @param {boolean[]|string[]} orders The order to sort by for each property.\n   * @returns {number} Returns the sort order indicator for `object`.\n   */\n  function compareMultiple(object, other, orders) {\n    var index = -1,\n        objCriteria = object.criteria,\n        othCriteria = other.criteria,\n        length = objCriteria.length,\n        ordersLength = orders.length;\n\n    while (++index < length) {\n      var result = compareAscending(objCriteria[index], othCriteria[index]);\n      if (result) {\n        if (index >= ordersLength) {\n          return result;\n        }\n        var order = orders[index];\n        return result * (order == 'desc' ? -1 : 1);\n      }\n    }\n    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications\n    // that causes it, under certain circumstances, to provide the same value for\n    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247\n    // for more details.\n    //\n    // This also ensures a stable sort in V8 and other engines.\n    // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.\n    return object.index - other.index;\n  }\n\n  /**\n   * Creates an array that is the composition of partially applied arguments,\n   * placeholders, and provided arguments into a single array of arguments.\n   *\n   * @private\n   * @param {Array} args The provided arguments.\n   * @param {Array} partials The arguments to prepend to those provided.\n   * @param {Array} holders The `partials` placeholder indexes.\n   * @params {boolean} [isCurried] Specify composing for a curried function.\n   * @returns {Array} Returns the new array of composed arguments.\n   */\n  function composeArgs(args, partials, holders, isCurried) {\n    var argsIndex = -1,\n        argsLength = args.length,\n        holdersLength = holders.length,\n        leftIndex = -1,\n        leftLength = partials.length,\n        rangeLength = nativeMax(argsLength - holdersLength, 0),\n        result = Array(leftLength + rangeLength),\n        isUncurried = !isCurried;\n\n    while (++leftIndex < leftLength) {\n      result[leftIndex] = partials[leftIndex];\n    }\n    while (++argsIndex < holdersLength) {\n      if (isUncurried || argsIndex < argsLength) {\n        result[holders[argsIndex]] = args[argsIndex];\n      }\n    }\n    while (rangeLength--) {\n      result[leftIndex++] = args[argsIndex++];\n    }\n    return result;\n  }\n\n  /**\n   * This function is like `composeArgs` except that the arguments composition\n   * is tailored for `_.partialRight`.\n   *\n   * @private\n   * @param {Array} args The provided arguments.\n   * @param {Array} partials The arguments to append to those provided.\n   * @param {Array} holders The `partials` placeholder indexes.\n   * @params {boolean} [isCurried] Specify composing for a curried function.\n   * @returns {Array} Returns the new array of composed arguments.\n   */\n  function composeArgsRight(args, partials, holders, isCurried) {\n    var argsIndex = -1,\n        argsLength = args.length,\n        holdersIndex = -1,\n        holdersLength = holders.length,\n        rightIndex = -1,\n        rightLength = partials.length,\n        rangeLength = nativeMax(argsLength - holdersLength, 0),\n        result = Array(rangeLength + rightLength),\n        isUncurried = !isCurried;\n\n    while (++argsIndex < rangeLength) {\n      result[argsIndex] = args[argsIndex];\n    }\n    var offset = argsIndex;\n    while (++rightIndex < rightLength) {\n      result[offset + rightIndex] = partials[rightIndex];\n    }\n    while (++holdersIndex < holdersLength) {\n      if (isUncurried || argsIndex < argsLength) {\n        result[offset + holders[holdersIndex]] = args[argsIndex++];\n      }\n    }\n    return result;\n  }\n\n  /**\n   * Copies the values of `source` to `array`.\n   *\n   * @private\n   * @param {Array} source The array to copy values from.\n   * @param {Array} [array=[]] The array to copy values to.\n   * @returns {Array} Returns `array`.\n   */\n  function copyArray(source, array) {\n    var index = -1,\n        length = source.length;\n\n    array || (array = Array(length));\n    while (++index < length) {\n      array[index] = source[index];\n    }\n    return array;\n  }\n\n  /**\n   * Copies properties of `source` to `object`.\n   *\n   * @private\n   * @param {Object} source The object to copy properties from.\n   * @param {Array} props The property identifiers to copy.\n   * @param {Object} [object={}] The object to copy properties to.\n   * @param {Function} [customizer] The function to customize copied values.\n   * @returns {Object} Returns `object`.\n   */\n  function copyObject(source, props, object, customizer) {\n    var isNew = !object;\n    object || (object = {});\n\n    var index = -1,\n        length = props.length;\n\n    while (++index < length) {\n      var key = props[index];\n\n      var newValue = customizer\n          ? customizer(object[key], source[key], key, object, source)\n          : undefined;\n\n      if (newValue === undefined) {\n        newValue = source[key];\n      }\n      if (isNew) {\n        baseAssignValue(object, key, newValue);\n      } else {\n        assignValue(object, key, newValue);\n      }\n    }\n    return object;\n  }\n\n  /**\n   * Copies own symbols of `source` to `object`.\n   *\n   * @private\n   * @param {Object} source The object to copy symbols from.\n   * @param {Object} [object={}] The object to copy symbols to.\n   * @returns {Object} Returns `object`.\n   */\n  function copySymbols(source, object) {\n    return copyObject(source, getSymbols(source), object);\n  }\n\n  /**\n   * Copies own and inherited symbols of `source` to `object`.\n   *\n   * @private\n   * @param {Object} source The object to copy symbols from.\n   * @param {Object} [object={}] The object to copy symbols to.\n   * @returns {Object} Returns `object`.\n   */\n  function copySymbolsIn(source, object) {\n    return copyObject(source, getSymbolsIn(source), object);\n  }\n\n  /**\n   * Creates a function like `_.groupBy`.\n   *\n   * @private\n   * @param {Function} setter The function to set accumulator values.\n   * @param {Function} [initializer] The accumulator object initializer.\n   * @returns {Function} Returns the new aggregator function.\n   */\n  function createAggregator(setter, initializer) {\n    return function(collection, iteratee) {\n      var func = isArray(collection) ? arrayAggregator : baseAggregator,\n          accumulator = initializer ? initializer() : {};\n\n      return func(collection, setter, baseIteratee(iteratee, 2), accumulator);\n    };\n  }\n\n  /**\n   * Creates a function like `_.assign`.\n   *\n   * @private\n   * @param {Function} assigner The function to assign values.\n   * @returns {Function} Returns the new assigner function.\n   */\n  function createAssigner(assigner) {\n    return baseRest(function(object, sources) {\n      var index = -1,\n          length = sources.length,\n          customizer = length > 1 ? sources[length - 1] : undefined,\n          guard = length > 2 ? sources[2] : undefined;\n\n      customizer = (assigner.length > 3 && typeof customizer == 'function')\n          ? (length--, customizer)\n          : undefined;\n\n      if (guard && isIterateeCall(sources[0], sources[1], guard)) {\n        customizer = length < 3 ? undefined : customizer;\n        length = 1;\n      }\n      object = Object(object);\n      while (++index < length) {\n        var source = sources[index];\n        if (source) {\n          assigner(object, source, index, customizer);\n        }\n      }\n      return object;\n    });\n  }\n\n  /**\n   * Creates a `baseEach` or `baseEachRight` function.\n   *\n   * @private\n   * @param {Function} eachFunc The function to iterate over a collection.\n   * @param {boolean} [fromRight] Specify iterating from right to left.\n   * @returns {Function} Returns the new base function.\n   */\n  function createBaseEach(eachFunc, fromRight) {\n    return function(collection, iteratee) {\n      if (collection == null) {\n        return collection;\n      }\n      if (!isArrayLike(collection)) {\n        return eachFunc(collection, iteratee);\n      }\n      var length = collection.length,\n          index = fromRight ? length : -1,\n          iterable = Object(collection);\n\n      while ((fromRight ? index-- : ++index < length)) {\n        if (iteratee(iterable[index], index, iterable) === false) {\n          break;\n        }\n      }\n      return collection;\n    };\n  }\n\n  /**\n   * Creates a base function for methods like `_.forIn` and `_.forOwn`.\n   *\n   * @private\n   * @param {boolean} [fromRight] Specify iterating from right to left.\n   * @returns {Function} Returns the new base function.\n   */\n  function createBaseFor(fromRight) {\n    return function(object, iteratee, keysFunc) {\n      var index = -1,\n          iterable = Object(object),\n          props = keysFunc(object),\n          length = props.length;\n\n      while (length--) {\n        var key = props[fromRight ? length : ++index];\n        if (iteratee(iterable[key], key, iterable) === false) {\n          break;\n        }\n      }\n      return object;\n    };\n  }\n\n  /**\n   * Creates a function that wraps `func` to invoke it with the optional `this`\n   * binding of `thisArg`.\n   *\n   * @private\n   * @param {Function} func The function to wrap.\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\n   * @param {*} [thisArg] The `this` binding of `func`.\n   * @returns {Function} Returns the new wrapped function.\n   */\n  function createBind(func, bitmask, thisArg) {\n    var isBind = bitmask & WRAP_BIND_FLAG,\n        Ctor = createCtor(func);\n\n    function wrapper() {\n      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;\n      return fn.apply(isBind ? thisArg : this, arguments);\n    }\n    return wrapper;\n  }\n\n  /**\n   * Creates a function that produces an instance of `Ctor` regardless of\n   * whether it was invoked as part of a `new` expression or by `call` or `apply`.\n   *\n   * @private\n   * @param {Function} Ctor The constructor to wrap.\n   * @returns {Function} Returns the new wrapped function.\n   */\n  function createCtor(Ctor) {\n    return function() {\n      // Use a `switch` statement to work with class constructors. See\n      // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist\n      // for more details.\n      var args = arguments;\n      switch (args.length) {\n        case 0: return new Ctor;\n        case 1: return new Ctor(args[0]);\n        case 2: return new Ctor(args[0], args[1]);\n        case 3: return new Ctor(args[0], args[1], args[2]);\n        case 4: return new Ctor(args[0], args[1], args[2], args[3]);\n        case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);\n        case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);\n        case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);\n      }\n      var thisBinding = baseCreate(Ctor.prototype),\n          result = Ctor.apply(thisBinding, args);\n\n      // Mimic the constructor's `return` behavior.\n      // See https://es5.github.io/#x13.2.2 for more details.\n      return isObject(result) ? result : thisBinding;\n    };\n  }\n\n  /**\n   * Creates a function that wraps `func` to enable currying.\n   *\n   * @private\n   * @param {Function} func The function to wrap.\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\n   * @param {number} arity The arity of `func`.\n   * @returns {Function} Returns the new wrapped function.\n   */\n  function createCurry(func, bitmask, arity) {\n    var Ctor = createCtor(func);\n\n    function wrapper() {\n      var length = arguments.length,\n          args = Array(length),\n          index = length,\n          placeholder = getHolder(wrapper);\n\n      while (index--) {\n        args[index] = arguments[index];\n      }\n      var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)\n          ? []\n          : replaceHolders(args, placeholder);\n\n      length -= holders.length;\n      if (length < arity) {\n        return createRecurry(\n            func, bitmask, createHybrid, wrapper.placeholder, undefined,\n            args, holders, undefined, undefined, arity - length);\n      }\n      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;\n      return apply(fn, this, args);\n    }\n    return wrapper;\n  }\n\n  /**\n   * Creates a `_.find` or `_.findLast` function.\n   *\n   * @private\n   * @param {Function} findIndexFunc The function to find the collection index.\n   * @returns {Function} Returns the new find function.\n   */\n  function createFind(findIndexFunc) {\n    return function(collection, predicate, fromIndex) {\n      var iterable = Object(collection);\n      if (!isArrayLike(collection)) {\n        var iteratee = baseIteratee(predicate, 3);\n        collection = keys(collection);\n        predicate = function(key) { return iteratee(iterable[key], key, iterable); };\n      }\n      var index = findIndexFunc(collection, predicate, fromIndex);\n      return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;\n    };\n  }\n\n  /**\n   * Creates a function that wraps `func` to invoke it with optional `this`\n   * binding of `thisArg`, partial application, and currying.\n   *\n   * @private\n   * @param {Function|string} func The function or method name to wrap.\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\n   * @param {*} [thisArg] The `this` binding of `func`.\n   * @param {Array} [partials] The arguments to prepend to those provided to\n   *  the new function.\n   * @param {Array} [holders] The `partials` placeholder indexes.\n   * @param {Array} [partialsRight] The arguments to append to those provided\n   *  to the new function.\n   * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.\n   * @param {Array} [argPos] The argument positions of the new function.\n   * @param {number} [ary] The arity cap of `func`.\n   * @param {number} [arity] The arity of `func`.\n   * @returns {Function} Returns the new wrapped function.\n   */\n  function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {\n    var isAry = bitmask & WRAP_ARY_FLAG,\n        isBind = bitmask & WRAP_BIND_FLAG,\n        isBindKey = bitmask & WRAP_BIND_KEY_FLAG,\n        isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),\n        isFlip = bitmask & WRAP_FLIP_FLAG,\n        Ctor = isBindKey ? undefined : createCtor(func);\n\n    function wrapper() {\n      var length = arguments.length,\n          args = Array(length),\n          index = length;\n\n      while (index--) {\n        args[index] = arguments[index];\n      }\n      if (isCurried) {\n        var placeholder = getHolder(wrapper),\n            holdersCount = countHolders(args, placeholder);\n      }\n      if (partials) {\n        args = composeArgs(args, partials, holders, isCurried);\n      }\n      if (partialsRight) {\n        args = composeArgsRight(args, partialsRight, holdersRight, isCurried);\n      }\n      length -= holdersCount;\n      if (isCurried && length < arity) {\n        var newHolders = replaceHolders(args, placeholder);\n        return createRecurry(\n            func, bitmask, createHybrid, wrapper.placeholder, thisArg,\n            args, newHolders, argPos, ary, arity - length\n        );\n      }\n      var thisBinding = isBind ? thisArg : this,\n          fn = isBindKey ? thisBinding[func] : func;\n\n      length = args.length;\n      if (argPos) {\n        args = reorder(args, argPos);\n      } else if (isFlip && length > 1) {\n        args.reverse();\n      }\n      if (isAry && ary < length) {\n        args.length = ary;\n      }\n      if (this && this !== root && this instanceof wrapper) {\n        fn = Ctor || createCtor(fn);\n      }\n      return fn.apply(thisBinding, args);\n    }\n    return wrapper;\n  }\n\n  /**\n   * Creates a function like `_.invertBy`.\n   *\n   * @private\n   * @param {Function} setter The function to set accumulator values.\n   * @param {Function} toIteratee The function to resolve iteratees.\n   * @returns {Function} Returns the new inverter function.\n   */\n  function createInverter(setter, toIteratee) {\n    return function(object, iteratee) {\n      return baseInverter(object, setter, toIteratee(iteratee), {});\n    };\n  }\n\n  /**\n   * Creates a function that wraps `func` to invoke it with the `this` binding\n   * of `thisArg` and `partials` prepended to the arguments it receives.\n   *\n   * @private\n   * @param {Function} func The function to wrap.\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\n   * @param {*} thisArg The `this` binding of `func`.\n   * @param {Array} partials The arguments to prepend to those provided to\n   *  the new function.\n   * @returns {Function} Returns the new wrapped function.\n   */\n  function createPartial(func, bitmask, thisArg, partials) {\n    var isBind = bitmask & WRAP_BIND_FLAG,\n        Ctor = createCtor(func);\n\n    function wrapper() {\n      var argsIndex = -1,\n          argsLength = arguments.length,\n          leftIndex = -1,\n          leftLength = partials.length,\n          args = Array(leftLength + argsLength),\n          fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;\n\n      while (++leftIndex < leftLength) {\n        args[leftIndex] = partials[leftIndex];\n      }\n      while (argsLength--) {\n        args[leftIndex++] = arguments[++argsIndex];\n      }\n      return apply(fn, isBind ? thisArg : this, args);\n    }\n    return wrapper;\n  }\n\n  /**\n   * Creates a `_.range` or `_.rangeRight` function.\n   *\n   * @private\n   * @param {boolean} [fromRight] Specify iterating from right to left.\n   * @returns {Function} Returns the new range function.\n   */\n  function createRange(fromRight) {\n    return function(start, end, step) {\n      if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {\n        end = step = undefined;\n      }\n      // Ensure the sign of `-0` is preserved.\n      start = toFinite(start);\n      if (end === undefined) {\n        end = start;\n        start = 0;\n      } else {\n        end = toFinite(end);\n      }\n      step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);\n      return baseRange(start, end, step, fromRight);\n    };\n  }\n\n  /**\n   * Creates a function that wraps `func` to continue currying.\n   *\n   * @private\n   * @param {Function} func The function to wrap.\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\n   * @param {Function} wrapFunc The function to create the `func` wrapper.\n   * @param {*} placeholder The placeholder value.\n   * @param {*} [thisArg] The `this` binding of `func`.\n   * @param {Array} [partials] The arguments to prepend to those provided to\n   *  the new function.\n   * @param {Array} [holders] The `partials` placeholder indexes.\n   * @param {Array} [argPos] The argument positions of the new function.\n   * @param {number} [ary] The arity cap of `func`.\n   * @param {number} [arity] The arity of `func`.\n   * @returns {Function} Returns the new wrapped function.\n   */\n  function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {\n    var isCurry = bitmask & WRAP_CURRY_FLAG,\n        newHolders = isCurry ? holders : undefined,\n        newHoldersRight = isCurry ? undefined : holders,\n        newPartials = isCurry ? partials : undefined,\n        newPartialsRight = isCurry ? undefined : partials;\n\n    bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);\n    bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);\n\n    if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {\n      bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);\n    }\n    var newData = [\n      func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,\n      newHoldersRight, argPos, ary, arity\n    ];\n\n    var result = wrapFunc.apply(undefined, newData);\n    if (isLaziable(func)) {\n      setData(result, newData);\n    }\n    result.placeholder = placeholder;\n    return setWrapToString(result, func, bitmask);\n  }\n\n  /**\n   * Creates a set object of `values`.\n   *\n   * @private\n   * @param {Array} values The values to add to the set.\n   * @returns {Object} Returns the new set.\n   */\n  var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {\n    return new Set(values);\n  };\n\n  /**\n   * Creates a function that either curries or invokes `func` with optional\n   * `this` binding and partially applied arguments.\n   *\n   * @private\n   * @param {Function|string} func The function or method name to wrap.\n   * @param {number} bitmask The bitmask flags.\n   *    1 - `_.bind`\n   *    2 - `_.bindKey`\n   *    4 - `_.curry` or `_.curryRight` of a bound function\n   *    8 - `_.curry`\n   *   16 - `_.curryRight`\n   *   32 - `_.partial`\n   *   64 - `_.partialRight`\n   *  128 - `_.rearg`\n   *  256 - `_.ary`\n   *  512 - `_.flip`\n   * @param {*} [thisArg] The `this` binding of `func`.\n   * @param {Array} [partials] The arguments to be partially applied.\n   * @param {Array} [holders] The `partials` placeholder indexes.\n   * @param {Array} [argPos] The argument positions of the new function.\n   * @param {number} [ary] The arity cap of `func`.\n   * @param {number} [arity] The arity of `func`.\n   * @returns {Function} Returns the new wrapped function.\n   */\n  function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {\n    var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;\n    if (!isBindKey && typeof func != 'function') {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    var length = partials ? partials.length : 0;\n    if (!length) {\n      bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);\n      partials = holders = undefined;\n    }\n    ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);\n    arity = arity === undefined ? arity : toInteger(arity);\n    length -= holders ? holders.length : 0;\n\n    if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {\n      var partialsRight = partials,\n          holdersRight = holders;\n\n      partials = holders = undefined;\n    }\n    var data = isBindKey ? undefined : getData(func);\n\n    var newData = [\n      func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,\n      argPos, ary, arity\n    ];\n\n    if (data) {\n      mergeData(newData, data);\n    }\n    func = newData[0];\n    bitmask = newData[1];\n    thisArg = newData[2];\n    partials = newData[3];\n    holders = newData[4];\n    arity = newData[9] = newData[9] === undefined\n        ? (isBindKey ? 0 : func.length)\n        : nativeMax(newData[9] - length, 0);\n\n    if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {\n      bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);\n    }\n    if (!bitmask || bitmask == WRAP_BIND_FLAG) {\n      var result = createBind(func, bitmask, thisArg);\n    } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {\n      result = createCurry(func, bitmask, arity);\n    } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {\n      result = createPartial(func, bitmask, thisArg, partials);\n    } else {\n      result = createHybrid.apply(undefined, newData);\n    }\n    var setter = data ? baseSetData : setData;\n    return setWrapToString(setter(result, newData), func, bitmask);\n  }\n\n  /**\n   * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source\n   * objects into destination objects that are passed thru.\n   *\n   * @private\n   * @param {*} objValue The destination value.\n   * @param {*} srcValue The source value.\n   * @param {string} key The key of the property to merge.\n   * @param {Object} object The parent object of `objValue`.\n   * @param {Object} source The parent object of `srcValue`.\n   * @param {Object} [stack] Tracks traversed source values and their merged\n   *  counterparts.\n   * @returns {*} Returns the value to assign.\n   */\n  function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {\n    if (isObject(objValue) && isObject(srcValue)) {\n      // Recursively merge objects and arrays (susceptible to call stack limits).\n      stack.set(srcValue, objValue);\n      baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);\n      stack['delete'](srcValue);\n    }\n    return objValue;\n  }\n\n  /**\n   * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain\n   * objects.\n   *\n   * @private\n   * @param {*} value The value to inspect.\n   * @param {string} key The key of the property to inspect.\n   * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.\n   */\n  function customOmitClone(value) {\n    return isPlainObject(value) ? undefined : value;\n  }\n\n  /**\n   * A specialized version of `baseIsEqualDeep` for arrays with support for\n   * partial deep comparisons.\n   *\n   * @private\n   * @param {Array} array The array to compare.\n   * @param {Array} other The other array to compare.\n   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\n   * @param {Function} customizer The function to customize comparisons.\n   * @param {Function} equalFunc The function to determine equivalents of values.\n   * @param {Object} stack Tracks traversed `array` and `other` objects.\n   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.\n   */\n  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {\n    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,\n        arrLength = array.length,\n        othLength = other.length;\n\n    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {\n      return false;\n    }\n    // Assume cyclic values are equal.\n    var stacked = stack.get(array);\n    if (stacked && stack.get(other)) {\n      return stacked == other;\n    }\n    var index = -1,\n        result = true,\n        seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;\n\n    stack.set(array, other);\n    stack.set(other, array);\n\n    // Ignore non-index properties.\n    while (++index < arrLength) {\n      var arrValue = array[index],\n          othValue = other[index];\n\n      if (customizer) {\n        var compared = isPartial\n            ? customizer(othValue, arrValue, index, other, array, stack)\n            : customizer(arrValue, othValue, index, array, other, stack);\n      }\n      if (compared !== undefined) {\n        if (compared) {\n          continue;\n        }\n        result = false;\n        break;\n      }\n      // Recursively compare arrays (susceptible to call stack limits).\n      if (seen) {\n        if (!arraySome(other, function(othValue, othIndex) {\n          if (!cacheHas(seen, othIndex) &&\n              (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {\n            return seen.push(othIndex);\n          }\n        })) {\n          result = false;\n          break;\n        }\n      } else if (!(\n          arrValue === othValue ||\n          equalFunc(arrValue, othValue, bitmask, customizer, stack)\n      )) {\n        result = false;\n        break;\n      }\n    }\n    stack['delete'](array);\n    stack['delete'](other);\n    return result;\n  }\n\n  /**\n   * A specialized version of `baseIsEqualDeep` for comparing objects of\n   * the same `toStringTag`.\n   *\n   * **Note:** This function only supports comparing values with tags of\n   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.\n   *\n   * @private\n   * @param {Object} object The object to compare.\n   * @param {Object} other The other object to compare.\n   * @param {string} tag The `toStringTag` of the objects to compare.\n   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\n   * @param {Function} customizer The function to customize comparisons.\n   * @param {Function} equalFunc The function to determine equivalents of values.\n   * @param {Object} stack Tracks traversed `object` and `other` objects.\n   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\n   */\n  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {\n    switch (tag) {\n      case dataViewTag:\n        if ((object.byteLength != other.byteLength) ||\n            (object.byteOffset != other.byteOffset)) {\n          return false;\n        }\n        object = object.buffer;\n        other = other.buffer;\n\n      case arrayBufferTag:\n        if ((object.byteLength != other.byteLength) ||\n            !equalFunc(new Uint8Array(object), new Uint8Array(other))) {\n          return false;\n        }\n        return true;\n\n      case boolTag:\n      case dateTag:\n      case numberTag:\n        // Coerce booleans to `1` or `0` and dates to milliseconds.\n        // Invalid dates are coerced to `NaN`.\n        return eq(+object, +other);\n\n      case errorTag:\n        return object.name == other.name && object.message == other.message;\n\n      case regexpTag:\n      case stringTag:\n        // Coerce regexes to strings and treat strings, primitives and objects,\n        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring\n        // for more details.\n        return object == (other + '');\n\n      case mapTag:\n        var convert = mapToArray;\n\n      case setTag:\n        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;\n        convert || (convert = setToArray);\n\n        if (object.size != other.size && !isPartial) {\n          return false;\n        }\n        // Assume cyclic values are equal.\n        var stacked = stack.get(object);\n        if (stacked) {\n          return stacked == other;\n        }\n        bitmask |= COMPARE_UNORDERED_FLAG;\n\n        // Recursively compare objects (susceptible to call stack limits).\n        stack.set(object, other);\n        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);\n        stack['delete'](object);\n        return result;\n\n      case symbolTag:\n        if (symbolValueOf) {\n          return symbolValueOf.call(object) == symbolValueOf.call(other);\n        }\n    }\n    return false;\n  }\n\n  /**\n   * A specialized version of `baseIsEqualDeep` for objects with support for\n   * partial deep comparisons.\n   *\n   * @private\n   * @param {Object} object The object to compare.\n   * @param {Object} other The other object to compare.\n   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\n   * @param {Function} customizer The function to customize comparisons.\n   * @param {Function} equalFunc The function to determine equivalents of values.\n   * @param {Object} stack Tracks traversed `object` and `other` objects.\n   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\n   */\n  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {\n    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,\n        objProps = getAllKeys(object),\n        objLength = objProps.length,\n        othProps = getAllKeys(other),\n        othLength = othProps.length;\n\n    if (objLength != othLength && !isPartial) {\n      return false;\n    }\n    var index = objLength;\n    while (index--) {\n      var key = objProps[index];\n      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {\n        return false;\n      }\n    }\n    // Assume cyclic values are equal.\n    var stacked = stack.get(object);\n    if (stacked && stack.get(other)) {\n      return stacked == other;\n    }\n    var result = true;\n    stack.set(object, other);\n    stack.set(other, object);\n\n    var skipCtor = isPartial;\n    while (++index < objLength) {\n      key = objProps[index];\n      var objValue = object[key],\n          othValue = other[key];\n\n      if (customizer) {\n        var compared = isPartial\n            ? customizer(othValue, objValue, key, other, object, stack)\n            : customizer(objValue, othValue, key, object, other, stack);\n      }\n      // Recursively compare objects (susceptible to call stack limits).\n      if (!(compared === undefined\n              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))\n              : compared\n      )) {\n        result = false;\n        break;\n      }\n      skipCtor || (skipCtor = key == 'constructor');\n    }\n    if (result && !skipCtor) {\n      var objCtor = object.constructor,\n          othCtor = other.constructor;\n\n      // Non `Object` object instances with different constructors are not equal.\n      if (objCtor != othCtor &&\n          ('constructor' in object && 'constructor' in other) &&\n          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&\n              typeof othCtor == 'function' && othCtor instanceof othCtor)) {\n        result = false;\n      }\n    }\n    stack['delete'](object);\n    stack['delete'](other);\n    return result;\n  }\n\n  /**\n   * A specialized version of `baseRest` which flattens the rest array.\n   *\n   * @private\n   * @param {Function} func The function to apply a rest parameter to.\n   * @returns {Function} Returns the new function.\n   */\n  function flatRest(func) {\n    return setToString(overRest(func, undefined, flatten), func + '');\n  }\n\n  /**\n   * Creates an array of own enumerable property names and symbols of `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of property names and symbols.\n   */\n  function getAllKeys(object) {\n    return baseGetAllKeys(object, keys, getSymbols);\n  }\n\n  /**\n   * Creates an array of own and inherited enumerable property names and\n   * symbols of `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of property names and symbols.\n   */\n  function getAllKeysIn(object) {\n    return baseGetAllKeys(object, keysIn, getSymbolsIn);\n  }\n\n  /**\n   * Gets metadata for `func`.\n   *\n   * @private\n   * @param {Function} func The function to query.\n   * @returns {*} Returns the metadata for `func`.\n   */\n  var getData = !metaMap ? noop : function(func) {\n    return metaMap.get(func);\n  };\n\n  /**\n   * Gets the name of `func`.\n   *\n   * @private\n   * @param {Function} func The function to query.\n   * @returns {string} Returns the function name.\n   */\n  function getFuncName(func) {\n    var result = (func.name + ''),\n        array = realNames[result],\n        length = hasOwnProperty.call(realNames, result) ? array.length : 0;\n\n    while (length--) {\n      var data = array[length],\n          otherFunc = data.func;\n      if (otherFunc == null || otherFunc == func) {\n        return data.name;\n      }\n    }\n    return result;\n  }\n\n  /**\n   * Gets the argument placeholder value for `func`.\n   *\n   * @private\n   * @param {Function} func The function to inspect.\n   * @returns {*} Returns the placeholder value.\n   */\n  function getHolder(func) {\n    var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;\n    return object.placeholder;\n  }\n\n  /**\n   * Gets the data for `map`.\n   *\n   * @private\n   * @param {Object} map The map to query.\n   * @param {string} key The reference key.\n   * @returns {*} Returns the map data.\n   */\n  function getMapData(map, key) {\n    var data = map.__data__;\n    return isKeyable(key)\n        ? data[typeof key == 'string' ? 'string' : 'hash']\n        : data.map;\n  }\n\n  /**\n   * Gets the property names, values, and compare flags of `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the match data of `object`.\n   */\n  function getMatchData(object) {\n    var result = keys(object),\n        length = result.length;\n\n    while (length--) {\n      var key = result[length],\n          value = object[key];\n\n      result[length] = [key, value, isStrictComparable(value)];\n    }\n    return result;\n  }\n\n  /**\n   * Gets the native function at `key` of `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @param {string} key The key of the method to get.\n   * @returns {*} Returns the function if it's native, else `undefined`.\n   */\n  function getNative(object, key) {\n    var value = getValue(object, key);\n    return baseIsNative(value) ? value : undefined;\n  }\n\n  /**\n   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.\n   *\n   * @private\n   * @param {*} value The value to query.\n   * @returns {string} Returns the raw `toStringTag`.\n   */\n  function getRawTag(value) {\n    var isOwn = hasOwnProperty.call(value, symToStringTag),\n        tag = value[symToStringTag];\n\n    try {\n      value[symToStringTag] = undefined;\n      var unmasked = true;\n    } catch (e) {}\n\n    var result = nativeObjectToString.call(value);\n    if (unmasked) {\n      if (isOwn) {\n        value[symToStringTag] = tag;\n      } else {\n        delete value[symToStringTag];\n      }\n    }\n    return result;\n  }\n\n  /**\n   * Creates an array of the own enumerable symbols of `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of symbols.\n   */\n  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {\n    if (object == null) {\n      return [];\n    }\n    object = Object(object);\n    return arrayFilter(nativeGetSymbols(object), function(symbol) {\n      return propertyIsEnumerable.call(object, symbol);\n    });\n  };\n\n  /**\n   * Creates an array of the own and inherited enumerable symbols of `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of symbols.\n   */\n  var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {\n    var result = [];\n    while (object) {\n      arrayPush(result, getSymbols(object));\n      object = getPrototype(object);\n    }\n    return result;\n  };\n\n  /**\n   * Gets the `toStringTag` of `value`.\n   *\n   * @private\n   * @param {*} value The value to query.\n   * @returns {string} Returns the `toStringTag`.\n   */\n  var getTag = baseGetTag;\n\n  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.\n  if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||\n      (Map && getTag(new Map) != mapTag) ||\n      (Promise && getTag(Promise.resolve()) != promiseTag) ||\n      (Set && getTag(new Set) != setTag) ||\n      (WeakMap && getTag(new WeakMap) != weakMapTag)) {\n    getTag = function(value) {\n      var result = baseGetTag(value),\n          Ctor = result == objectTag ? value.constructor : undefined,\n          ctorString = Ctor ? toSource(Ctor) : '';\n\n      if (ctorString) {\n        switch (ctorString) {\n          case dataViewCtorString: return dataViewTag;\n          case mapCtorString: return mapTag;\n          case promiseCtorString: return promiseTag;\n          case setCtorString: return setTag;\n          case weakMapCtorString: return weakMapTag;\n        }\n      }\n      return result;\n    };\n  }\n\n  /**\n   * Gets the view, applying any `transforms` to the `start` and `end` positions.\n   *\n   * @private\n   * @param {number} start The start of the view.\n   * @param {number} end The end of the view.\n   * @param {Array} transforms The transformations to apply to the view.\n   * @returns {Object} Returns an object containing the `start` and `end`\n   *  positions of the view.\n   */\n  function getView(start, end, transforms) {\n    var index = -1,\n        length = transforms.length;\n\n    while (++index < length) {\n      var data = transforms[index],\n          size = data.size;\n\n      switch (data.type) {\n        case 'drop':      start += size; break;\n        case 'dropRight': end -= size; break;\n        case 'take':      end = nativeMin(end, start + size); break;\n        case 'takeRight': start = nativeMax(start, end - size); break;\n      }\n    }\n    return { 'start': start, 'end': end };\n  }\n\n  /**\n   * Extracts wrapper details from the `source` body comment.\n   *\n   * @private\n   * @param {string} source The source to inspect.\n   * @returns {Array} Returns the wrapper details.\n   */\n  function getWrapDetails(source) {\n    var match = source.match(reWrapDetails);\n    return match ? match[1].split(reSplitDetails) : [];\n  }\n\n  /**\n   * Checks if `path` exists on `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @param {Array|string} path The path to check.\n   * @param {Function} hasFunc The function to check properties.\n   * @returns {boolean} Returns `true` if `path` exists, else `false`.\n   */\n  function hasPath(object, path, hasFunc) {\n    path = castPath(path, object);\n\n    var index = -1,\n        length = path.length,\n        result = false;\n\n    while (++index < length) {\n      var key = toKey(path[index]);\n      if (!(result = object != null && hasFunc(object, key))) {\n        break;\n      }\n      object = object[key];\n    }\n    if (result || ++index != length) {\n      return result;\n    }\n    length = object == null ? 0 : object.length;\n    return !!length && isLength(length) && isIndex(key, length) &&\n        (isArray(object) || isArguments(object));\n  }\n\n  /**\n   * Initializes an array clone.\n   *\n   * @private\n   * @param {Array} array The array to clone.\n   * @returns {Array} Returns the initialized clone.\n   */\n  function initCloneArray(array) {\n    var length = array.length,\n        result = new array.constructor(length);\n\n    // Add properties assigned by `RegExp#exec`.\n    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {\n      result.index = array.index;\n      result.input = array.input;\n    }\n    return result;\n  }\n\n  /**\n   * Initializes an object clone.\n   *\n   * @private\n   * @param {Object} object The object to clone.\n   * @returns {Object} Returns the initialized clone.\n   */\n  function initCloneObject(object) {\n    return (typeof object.constructor == 'function' && !isPrototype(object))\n        ? baseCreate(getPrototype(object))\n        : {};\n  }\n\n  /**\n   * Initializes an object clone based on its `toStringTag`.\n   *\n   * **Note:** This function only supports cloning values with tags of\n   * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.\n   *\n   * @private\n   * @param {Object} object The object to clone.\n   * @param {string} tag The `toStringTag` of the object to clone.\n   * @param {boolean} [isDeep] Specify a deep clone.\n   * @returns {Object} Returns the initialized clone.\n   */\n  function initCloneByTag(object, tag, isDeep) {\n    var Ctor = object.constructor;\n    switch (tag) {\n      case arrayBufferTag:\n        return cloneArrayBuffer(object);\n\n      case boolTag:\n      case dateTag:\n        return new Ctor(+object);\n\n      case dataViewTag:\n        return cloneDataView(object, isDeep);\n\n      case float32Tag: case float64Tag:\n      case int8Tag: case int16Tag: case int32Tag:\n      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:\n        return cloneTypedArray(object, isDeep);\n\n      case mapTag:\n        return new Ctor;\n\n      case numberTag:\n      case stringTag:\n        return new Ctor(object);\n\n      case regexpTag:\n        return cloneRegExp(object);\n\n      case setTag:\n        return new Ctor;\n\n      case symbolTag:\n        return cloneSymbol(object);\n    }\n  }\n\n  /**\n   * Inserts wrapper `details` in a comment at the top of the `source` body.\n   *\n   * @private\n   * @param {string} source The source to modify.\n   * @returns {Array} details The details to insert.\n   * @returns {string} Returns the modified source.\n   */\n  function insertWrapDetails(source, details) {\n    var length = details.length;\n    if (!length) {\n      return source;\n    }\n    var lastIndex = length - 1;\n    details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];\n    details = details.join(length > 2 ? ', ' : ' ');\n    return source.replace(reWrapComment, '{\\n/* [wrapped with ' + details + '] */\\n');\n  }\n\n  /**\n   * Checks if `value` is a flattenable `arguments` object or array.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.\n   */\n  function isFlattenable(value) {\n    return isArray(value) || isArguments(value) ||\n        !!(spreadableSymbol && value && value[spreadableSymbol]);\n  }\n\n  /**\n   * Checks if `value` is a valid array-like index.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.\n   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.\n   */\n  function isIndex(value, length) {\n    var type = typeof value;\n    length = length == null ? MAX_SAFE_INTEGER : length;\n\n    return !!length &&\n        (type == 'number' ||\n            (type != 'symbol' && reIsUint.test(value))) &&\n        (value > -1 && value % 1 == 0 && value < length);\n  }\n\n  /**\n   * Checks if the given arguments are from an iteratee call.\n   *\n   * @private\n   * @param {*} value The potential iteratee value argument.\n   * @param {*} index The potential iteratee index or key argument.\n   * @param {*} object The potential iteratee object argument.\n   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,\n   *  else `false`.\n   */\n  function isIterateeCall(value, index, object) {\n    if (!isObject(object)) {\n      return false;\n    }\n    var type = typeof index;\n    if (type == 'number'\n        ? (isArrayLike(object) && isIndex(index, object.length))\n        : (type == 'string' && index in object)\n    ) {\n      return eq(object[index], value);\n    }\n    return false;\n  }\n\n  /**\n   * Checks if `value` is a property name and not a property path.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @param {Object} [object] The object to query keys on.\n   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.\n   */\n  function isKey(value, object) {\n    if (isArray(value)) {\n      return false;\n    }\n    var type = typeof value;\n    if (type == 'number' || type == 'symbol' || type == 'boolean' ||\n        value == null || isSymbol(value)) {\n      return true;\n    }\n    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||\n        (object != null && value in Object(object));\n  }\n\n  /**\n   * Checks if `value` is suitable for use as unique object key.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.\n   */\n  function isKeyable(value) {\n    var type = typeof value;\n    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')\n        ? (value !== '__proto__')\n        : (value === null);\n  }\n\n  /**\n   * Checks if `func` has a lazy counterpart.\n   *\n   * @private\n   * @param {Function} func The function to check.\n   * @returns {boolean} Returns `true` if `func` has a lazy counterpart,\n   *  else `false`.\n   */\n  function isLaziable(func) {\n    var funcName = getFuncName(func),\n        other = lodash[funcName];\n\n    if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {\n      return false;\n    }\n    if (func === other) {\n      return true;\n    }\n    var data = getData(other);\n    return !!data && func === data[0];\n  }\n\n  /**\n   * Checks if `func` has its source masked.\n   *\n   * @private\n   * @param {Function} func The function to check.\n   * @returns {boolean} Returns `true` if `func` is masked, else `false`.\n   */\n  function isMasked(func) {\n    return !!maskSrcKey && (maskSrcKey in func);\n  }\n\n  /**\n   * Checks if `value` is likely a prototype object.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.\n   */\n  function isPrototype(value) {\n    var Ctor = value && value.constructor,\n        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;\n\n    return value === proto;\n  }\n\n  /**\n   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.\n   *\n   * @private\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` if suitable for strict\n   *  equality comparisons, else `false`.\n   */\n  function isStrictComparable(value) {\n    return value === value && !isObject(value);\n  }\n\n  /**\n   * A specialized version of `matchesProperty` for source values suitable\n   * for strict equality comparisons, i.e. `===`.\n   *\n   * @private\n   * @param {string} key The key of the property to get.\n   * @param {*} srcValue The value to match.\n   * @returns {Function} Returns the new spec function.\n   */\n  function matchesStrictComparable(key, srcValue) {\n    return function(object) {\n      if (object == null) {\n        return false;\n      }\n      return object[key] === srcValue &&\n          (srcValue !== undefined || (key in Object(object)));\n    };\n  }\n\n  /**\n   * A specialized version of `_.memoize` which clears the memoized function's\n   * cache when it exceeds `MAX_MEMOIZE_SIZE`.\n   *\n   * @private\n   * @param {Function} func The function to have its output memoized.\n   * @returns {Function} Returns the new memoized function.\n   */\n  function memoizeCapped(func) {\n    var result = memoize(func, function(key) {\n      if (cache.size === MAX_MEMOIZE_SIZE) {\n        cache.clear();\n      }\n      return key;\n    });\n\n    var cache = result.cache;\n    return result;\n  }\n\n  /**\n   * Merges the function metadata of `source` into `data`.\n   *\n   * Merging metadata reduces the number of wrappers used to invoke a function.\n   * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`\n   * may be applied regardless of execution order. Methods like `_.ary` and\n   * `_.rearg` modify function arguments, making the order in which they are\n   * executed important, preventing the merging of metadata. However, we make\n   * an exception for a safe combined case where curried functions have `_.ary`\n   * and or `_.rearg` applied.\n   *\n   * @private\n   * @param {Array} data The destination metadata.\n   * @param {Array} source The source metadata.\n   * @returns {Array} Returns `data`.\n   */\n  function mergeData(data, source) {\n    var bitmask = data[1],\n        srcBitmask = source[1],\n        newBitmask = bitmask | srcBitmask,\n        isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);\n\n    var isCombo =\n        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||\n        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||\n        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));\n\n    // Exit early if metadata can't be merged.\n    if (!(isCommon || isCombo)) {\n      return data;\n    }\n    // Use source `thisArg` if available.\n    if (srcBitmask & WRAP_BIND_FLAG) {\n      data[2] = source[2];\n      // Set when currying a bound function.\n      newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;\n    }\n    // Compose partial arguments.\n    var value = source[3];\n    if (value) {\n      var partials = data[3];\n      data[3] = partials ? composeArgs(partials, value, source[4]) : value;\n      data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];\n    }\n    // Compose partial right arguments.\n    value = source[5];\n    if (value) {\n      partials = data[5];\n      data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;\n      data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];\n    }\n    // Use source `argPos` if available.\n    value = source[7];\n    if (value) {\n      data[7] = value;\n    }\n    // Use source `ary` if it's smaller.\n    if (srcBitmask & WRAP_ARY_FLAG) {\n      data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);\n    }\n    // Use source `arity` if one is not provided.\n    if (data[9] == null) {\n      data[9] = source[9];\n    }\n    // Use source `func` and merge bitmasks.\n    data[0] = source[0];\n    data[1] = newBitmask;\n\n    return data;\n  }\n\n  /**\n   * This function is like\n   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)\n   * except that it includes inherited enumerable properties.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of property names.\n   */\n  function nativeKeysIn(object) {\n    var result = [];\n    if (object != null) {\n      for (var key in Object(object)) {\n        result.push(key);\n      }\n    }\n    return result;\n  }\n\n  /**\n   * Converts `value` to a string using `Object.prototype.toString`.\n   *\n   * @private\n   * @param {*} value The value to convert.\n   * @returns {string} Returns the converted string.\n   */\n  function objectToString(value) {\n    return nativeObjectToString.call(value);\n  }\n\n  /**\n   * A specialized version of `baseRest` which transforms the rest array.\n   *\n   * @private\n   * @param {Function} func The function to apply a rest parameter to.\n   * @param {number} [start=func.length-1] The start position of the rest parameter.\n   * @param {Function} transform The rest array transform.\n   * @returns {Function} Returns the new function.\n   */\n  function overRest(func, start, transform) {\n    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);\n    return function() {\n      var args = arguments,\n          index = -1,\n          length = nativeMax(args.length - start, 0),\n          array = Array(length);\n\n      while (++index < length) {\n        array[index] = args[start + index];\n      }\n      index = -1;\n      var otherArgs = Array(start + 1);\n      while (++index < start) {\n        otherArgs[index] = args[index];\n      }\n      otherArgs[start] = transform(array);\n      return apply(func, this, otherArgs);\n    };\n  }\n\n  /**\n   * Gets the parent value at `path` of `object`.\n   *\n   * @private\n   * @param {Object} object The object to query.\n   * @param {Array} path The path to get the parent value of.\n   * @returns {*} Returns the parent value.\n   */\n  function parent(object, path) {\n    return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));\n  }\n\n  /**\n   * Reorder `array` according to the specified indexes where the element at\n   * the first index is assigned as the first element, the element at\n   * the second index is assigned as the second element, and so on.\n   *\n   * @private\n   * @param {Array} array The array to reorder.\n   * @param {Array} indexes The arranged array indexes.\n   * @returns {Array} Returns `array`.\n   */\n  function reorder(array, indexes) {\n    var arrLength = array.length,\n        length = nativeMin(indexes.length, arrLength),\n        oldArray = copyArray(array);\n\n    while (length--) {\n      var index = indexes[length];\n      array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;\n    }\n    return array;\n  }\n\n  /**\n   * Sets metadata for `func`.\n   *\n   * **Note:** If this function becomes hot, i.e. is invoked a lot in a short\n   * period of time, it will trip its breaker and transition to an identity\n   * function to avoid garbage collection pauses in V8. See\n   * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)\n   * for more details.\n   *\n   * @private\n   * @param {Function} func The function to associate metadata with.\n   * @param {*} data The metadata.\n   * @returns {Function} Returns `func`.\n   */\n  var setData = shortOut(baseSetData);\n\n  /**\n   * Sets the `toString` method of `func` to return `string`.\n   *\n   * @private\n   * @param {Function} func The function to modify.\n   * @param {Function} string The `toString` result.\n   * @returns {Function} Returns `func`.\n   */\n  var setToString = shortOut(baseSetToString);\n\n  /**\n   * Sets the `toString` method of `wrapper` to mimic the source of `reference`\n   * with wrapper details in a comment at the top of the source body.\n   *\n   * @private\n   * @param {Function} wrapper The function to modify.\n   * @param {Function} reference The reference function.\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\n   * @returns {Function} Returns `wrapper`.\n   */\n  function setWrapToString(wrapper, reference, bitmask) {\n    var source = (reference + '');\n    return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));\n  }\n\n  /**\n   * Creates a function that'll short out and invoke `identity` instead\n   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`\n   * milliseconds.\n   *\n   * @private\n   * @param {Function} func The function to restrict.\n   * @returns {Function} Returns the new shortable function.\n   */\n  function shortOut(func) {\n    var count = 0,\n        lastCalled = 0;\n\n    return function() {\n      var stamp = nativeNow(),\n          remaining = HOT_SPAN - (stamp - lastCalled);\n\n      lastCalled = stamp;\n      if (remaining > 0) {\n        if (++count >= HOT_COUNT) {\n          return arguments[0];\n        }\n      } else {\n        count = 0;\n      }\n      return func.apply(undefined, arguments);\n    };\n  }\n\n  /**\n   * Converts `string` to a property path array.\n   *\n   * @private\n   * @param {string} string The string to convert.\n   * @returns {Array} Returns the property path array.\n   */\n  var stringToPath = memoizeCapped(function(string) {\n    var result = [];\n    if (string.charCodeAt(0) === 46 /* . */) {\n      result.push('');\n    }\n    string.replace(rePropName, function(match, number, quote, subString) {\n      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));\n    });\n    return result;\n  });\n\n  /**\n   * Converts `value` to a string key if it's not a string or symbol.\n   *\n   * @private\n   * @param {*} value The value to inspect.\n   * @returns {string|symbol} Returns the key.\n   */\n  function toKey(value) {\n    if (typeof value == 'string' || isSymbol(value)) {\n      return value;\n    }\n    var result = (value + '');\n    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;\n  }\n\n  /**\n   * Converts `func` to its source code.\n   *\n   * @private\n   * @param {Function} func The function to convert.\n   * @returns {string} Returns the source code.\n   */\n  function toSource(func) {\n    if (func != null) {\n      try {\n        return funcToString.call(func);\n      } catch (e) {}\n      try {\n        return (func + '');\n      } catch (e) {}\n    }\n    return '';\n  }\n\n  /**\n   * Updates wrapper `details` based on `bitmask` flags.\n   *\n   * @private\n   * @returns {Array} details The details to modify.\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\n   * @returns {Array} Returns `details`.\n   */\n  function updateWrapDetails(details, bitmask) {\n    arrayEach(wrapFlags, function(pair) {\n      var value = '_.' + pair[0];\n      if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {\n        details.push(value);\n      }\n    });\n    return details.sort();\n  }\n\n  /**\n   * Creates a clone of `wrapper`.\n   *\n   * @private\n   * @param {Object} wrapper The wrapper to clone.\n   * @returns {Object} Returns the cloned wrapper.\n   */\n  function wrapperClone(wrapper) {\n    if (wrapper instanceof LazyWrapper) {\n      return wrapper.clone();\n    }\n    var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);\n    result.__actions__ = copyArray(wrapper.__actions__);\n    result.__index__  = wrapper.__index__;\n    result.__values__ = wrapper.__values__;\n    return result;\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates an array with all falsey values removed. The values `false`, `null`,\n   * `0`, `\"\"`, `undefined`, and `NaN` are falsey.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to compact.\n   * @returns {Array} Returns the new array of filtered values.\n   * @example\n   *\n   * _.compact([0, 1, false, 2, '', 3]);\n   * // => [1, 2, 3]\n   */\n  function compact(array) {\n    var index = -1,\n        length = array == null ? 0 : array.length,\n        resIndex = 0,\n        result = [];\n\n    while (++index < length) {\n      var value = array[index];\n      if (value) {\n        result[resIndex++] = value;\n      }\n    }\n    return result;\n  }\n\n  /**\n   * Creates a new array concatenating `array` with any additional arrays\n   * and/or values.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Array\n   * @param {Array} array The array to concatenate.\n   * @param {...*} [values] The values to concatenate.\n   * @returns {Array} Returns the new concatenated array.\n   * @example\n   *\n   * var array = [1];\n   * var other = _.concat(array, 2, [3], [[4]]);\n   *\n   * console.log(other);\n   * // => [1, 2, 3, [4]]\n   *\n   * console.log(array);\n   * // => [1]\n   */\n  function concat() {\n    var length = arguments.length;\n    if (!length) {\n      return [];\n    }\n    var args = Array(length - 1),\n        array = arguments[0],\n        index = length;\n\n    while (index--) {\n      args[index - 1] = arguments[index];\n    }\n    return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));\n  }\n\n  /**\n   * Creates an array of `array` values not included in the other given arrays\n   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n   * for equality comparisons. The order and references of result values are\n   * determined by the first array.\n   *\n   * **Note:** Unlike `_.pullAll`, this method returns a new array.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to inspect.\n   * @param {...Array} [values] The values to exclude.\n   * @returns {Array} Returns the new array of filtered values.\n   * @see _.without, _.xor\n   * @example\n   *\n   * _.difference([2, 1], [2, 3]);\n   * // => [1]\n   */\n  var difference = baseRest(function(array, values) {\n    return isArrayLikeObject(array)\n        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))\n        : [];\n  });\n\n  /**\n   * Creates a slice of `array` with `n` elements dropped from the beginning.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.5.0\n   * @category Array\n   * @param {Array} array The array to query.\n   * @param {number} [n=1] The number of elements to drop.\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\n   * @returns {Array} Returns the slice of `array`.\n   * @example\n   *\n   * _.drop([1, 2, 3]);\n   * // => [2, 3]\n   *\n   * _.drop([1, 2, 3], 2);\n   * // => [3]\n   *\n   * _.drop([1, 2, 3], 5);\n   * // => []\n   *\n   * _.drop([1, 2, 3], 0);\n   * // => [1, 2, 3]\n   */\n  function drop(array, n, guard) {\n    var length = array == null ? 0 : array.length;\n    if (!length) {\n      return [];\n    }\n    n = (guard || n === undefined) ? 1 : toInteger(n);\n    return baseSlice(array, n < 0 ? 0 : n, length);\n  }\n\n  /**\n   * This method is like `_.find` except that it returns the index of the first\n   * element `predicate` returns truthy for instead of the element itself.\n   *\n   * @static\n   * @memberOf _\n   * @since 1.1.0\n   * @category Array\n   * @param {Array} array The array to inspect.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @param {number} [fromIndex=0] The index to search from.\n   * @returns {number} Returns the index of the found element, else `-1`.\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'barney',  'active': false },\n   *   { 'user': 'fred',    'active': false },\n   *   { 'user': 'pebbles', 'active': true }\n   * ];\n   *\n   * _.findIndex(users, function(o) { return o.user == 'barney'; });\n   * // => 0\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.findIndex(users, { 'user': 'fred', 'active': false });\n   * // => 1\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.findIndex(users, ['active', false]);\n   * // => 0\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.findIndex(users, 'active');\n   * // => 2\n   */\n  function findIndex(array, predicate, fromIndex) {\n    var length = array == null ? 0 : array.length;\n    if (!length) {\n      return -1;\n    }\n    var index = fromIndex == null ? 0 : toInteger(fromIndex);\n    if (index < 0) {\n      index = nativeMax(length + index, 0);\n    }\n    return baseFindIndex(array, baseIteratee(predicate, 3), index);\n  }\n\n  /**\n   * This method is like `_.findIndex` except that it iterates over elements\n   * of `collection` from right to left.\n   *\n   * @static\n   * @memberOf _\n   * @since 2.0.0\n   * @category Array\n   * @param {Array} array The array to inspect.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @param {number} [fromIndex=array.length-1] The index to search from.\n   * @returns {number} Returns the index of the found element, else `-1`.\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'barney',  'active': true },\n   *   { 'user': 'fred',    'active': false },\n   *   { 'user': 'pebbles', 'active': false }\n   * ];\n   *\n   * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });\n   * // => 2\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.findLastIndex(users, { 'user': 'barney', 'active': true });\n   * // => 0\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.findLastIndex(users, ['active', false]);\n   * // => 2\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.findLastIndex(users, 'active');\n   * // => 0\n   */\n  function findLastIndex(array, predicate, fromIndex) {\n    var length = array == null ? 0 : array.length;\n    if (!length) {\n      return -1;\n    }\n    var index = length - 1;\n    if (fromIndex !== undefined) {\n      index = toInteger(fromIndex);\n      index = fromIndex < 0\n          ? nativeMax(length + index, 0)\n          : nativeMin(index, length - 1);\n    }\n    return baseFindIndex(array, baseIteratee(predicate, 3), index, true);\n  }\n\n  /**\n   * Flattens `array` a single level deep.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to flatten.\n   * @returns {Array} Returns the new flattened array.\n   * @example\n   *\n   * _.flatten([1, [2, [3, [4]], 5]]);\n   * // => [1, 2, [3, [4]], 5]\n   */\n  function flatten(array) {\n    var length = array == null ? 0 : array.length;\n    return length ? baseFlatten(array, 1) : [];\n  }\n\n  /**\n   * Recursively flattens `array`.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Array\n   * @param {Array} array The array to flatten.\n   * @returns {Array} Returns the new flattened array.\n   * @example\n   *\n   * _.flattenDeep([1, [2, [3, [4]], 5]]);\n   * // => [1, 2, 3, 4, 5]\n   */\n  function flattenDeep(array) {\n    var length = array == null ? 0 : array.length;\n    return length ? baseFlatten(array, INFINITY) : [];\n  }\n\n  /**\n   * Gets the first element of `array`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @alias first\n   * @category Array\n   * @param {Array} array The array to query.\n   * @returns {*} Returns the first element of `array`.\n   * @example\n   *\n   * _.head([1, 2, 3]);\n   * // => 1\n   *\n   * _.head([]);\n   * // => undefined\n   */\n  function head(array) {\n    return (array && array.length) ? array[0] : undefined;\n  }\n\n  /**\n   * Gets the index at which the first occurrence of `value` is found in `array`\n   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n   * for equality comparisons. If `fromIndex` is negative, it's used as the\n   * offset from the end of `array`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to inspect.\n   * @param {*} value The value to search for.\n   * @param {number} [fromIndex=0] The index to search from.\n   * @returns {number} Returns the index of the matched value, else `-1`.\n   * @example\n   *\n   * _.indexOf([1, 2, 1, 2], 2);\n   * // => 1\n   *\n   * // Search from the `fromIndex`.\n   * _.indexOf([1, 2, 1, 2], 2, 2);\n   * // => 3\n   */\n  function indexOf(array, value, fromIndex) {\n    var length = array == null ? 0 : array.length;\n    if (!length) {\n      return -1;\n    }\n    var index = fromIndex == null ? 0 : toInteger(fromIndex);\n    if (index < 0) {\n      index = nativeMax(length + index, 0);\n    }\n    return baseIndexOf(array, value, index);\n  }\n\n  /**\n   * Gets all but the last element of `array`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to query.\n   * @returns {Array} Returns the slice of `array`.\n   * @example\n   *\n   * _.initial([1, 2, 3]);\n   * // => [1, 2]\n   */\n  function initial(array) {\n    var length = array == null ? 0 : array.length;\n    return length ? baseSlice(array, 0, -1) : [];\n  }\n\n  /**\n   * Creates an array of unique values that are included in all given arrays\n   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n   * for equality comparisons. The order and references of result values are\n   * determined by the first array.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {...Array} [arrays] The arrays to inspect.\n   * @returns {Array} Returns the new array of intersecting values.\n   * @example\n   *\n   * _.intersection([2, 1], [2, 3]);\n   * // => [2]\n   */\n  var intersection = baseRest(function(arrays) {\n    var mapped = arrayMap(arrays, castArrayLikeObject);\n    return (mapped.length && mapped[0] === arrays[0])\n        ? baseIntersection(mapped)\n        : [];\n  });\n\n  /**\n   * Gets the last element of `array`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to query.\n   * @returns {*} Returns the last element of `array`.\n   * @example\n   *\n   * _.last([1, 2, 3]);\n   * // => 3\n   */\n  function last(array) {\n    var length = array == null ? 0 : array.length;\n    return length ? array[length - 1] : undefined;\n  }\n\n  /**\n   * Reverses `array` so that the first element becomes the last, the second\n   * element becomes the second to last, and so on.\n   *\n   * **Note:** This method mutates `array` and is based on\n   * [`Array#reverse`](https://mdn.io/Array/reverse).\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Array\n   * @param {Array} array The array to modify.\n   * @returns {Array} Returns `array`.\n   * @example\n   *\n   * var array = [1, 2, 3];\n   *\n   * _.reverse(array);\n   * // => [3, 2, 1]\n   *\n   * console.log(array);\n   * // => [3, 2, 1]\n   */\n  function reverse(array) {\n    return array == null ? array : nativeReverse.call(array);\n  }\n\n  /**\n   * Creates a slice of `array` from `start` up to, but not including, `end`.\n   *\n   * **Note:** This method is used instead of\n   * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are\n   * returned.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Array\n   * @param {Array} array The array to slice.\n   * @param {number} [start=0] The start position.\n   * @param {number} [end=array.length] The end position.\n   * @returns {Array} Returns the slice of `array`.\n   */\n  function slice(array, start, end) {\n    var length = array == null ? 0 : array.length;\n    if (!length) {\n      return [];\n    }\n    if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {\n      start = 0;\n      end = length;\n    }\n    else {\n      start = start == null ? 0 : toInteger(start);\n      end = end === undefined ? length : toInteger(end);\n    }\n    return baseSlice(array, start, end);\n  }\n\n  /**\n   * Creates a slice of `array` with `n` elements taken from the beginning.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to query.\n   * @param {number} [n=1] The number of elements to take.\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\n   * @returns {Array} Returns the slice of `array`.\n   * @example\n   *\n   * _.take([1, 2, 3]);\n   * // => [1]\n   *\n   * _.take([1, 2, 3], 2);\n   * // => [1, 2]\n   *\n   * _.take([1, 2, 3], 5);\n   * // => [1, 2, 3]\n   *\n   * _.take([1, 2, 3], 0);\n   * // => []\n   */\n  function take(array, n, guard) {\n    if (!(array && array.length)) {\n      return [];\n    }\n    n = (guard || n === undefined) ? 1 : toInteger(n);\n    return baseSlice(array, 0, n < 0 ? 0 : n);\n  }\n\n  /**\n   * Creates a slice of `array` with `n` elements taken from the end.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Array\n   * @param {Array} array The array to query.\n   * @param {number} [n=1] The number of elements to take.\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\n   * @returns {Array} Returns the slice of `array`.\n   * @example\n   *\n   * _.takeRight([1, 2, 3]);\n   * // => [3]\n   *\n   * _.takeRight([1, 2, 3], 2);\n   * // => [2, 3]\n   *\n   * _.takeRight([1, 2, 3], 5);\n   * // => [1, 2, 3]\n   *\n   * _.takeRight([1, 2, 3], 0);\n   * // => []\n   */\n  function takeRight(array, n, guard) {\n    var length = array == null ? 0 : array.length;\n    if (!length) {\n      return [];\n    }\n    n = (guard || n === undefined) ? 1 : toInteger(n);\n    n = length - n;\n    return baseSlice(array, n < 0 ? 0 : n, length);\n  }\n\n  /**\n   * Creates an array of unique values, in order, from all given arrays using\n   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n   * for equality comparisons.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {...Array} [arrays] The arrays to inspect.\n   * @returns {Array} Returns the new array of combined values.\n   * @example\n   *\n   * _.union([2], [1, 2]);\n   * // => [2, 1]\n   */\n  var union = baseRest(function(arrays) {\n    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));\n  });\n\n  /**\n   * Creates a duplicate-free version of an array, using\n   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n   * for equality comparisons, in which only the first occurrence of each element\n   * is kept. The order of result values is determined by the order they occur\n   * in the array.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to inspect.\n   * @returns {Array} Returns the new duplicate free array.\n   * @example\n   *\n   * _.uniq([2, 1, 2]);\n   * // => [2, 1]\n   */\n  function uniq(array) {\n    return (array && array.length) ? baseUniq(array) : [];\n  }\n\n  /**\n   * This method is like `_.uniq` except that it accepts `iteratee` which is\n   * invoked for each element in `array` to generate the criterion by which\n   * uniqueness is computed. The order of result values is determined by the\n   * order they occur in the array. The iteratee is invoked with one argument:\n   * (value).\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Array\n   * @param {Array} array The array to inspect.\n   * @param {Function} [iteratee=_.identity] The iteratee invoked per element.\n   * @returns {Array} Returns the new duplicate free array.\n   * @example\n   *\n   * _.uniqBy([2.1, 1.2, 2.3], Math.floor);\n   * // => [2.1, 1.2]\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');\n   * // => [{ 'x': 1 }, { 'x': 2 }]\n   */\n  function uniqBy(array, iteratee) {\n    return (array && array.length) ? baseUniq(array, baseIteratee(iteratee, 2)) : [];\n  }\n\n  /**\n   * This method is like `_.zip` except that it accepts an array of grouped\n   * elements and creates an array regrouping the elements to their pre-zip\n   * configuration.\n   *\n   * @static\n   * @memberOf _\n   * @since 1.2.0\n   * @category Array\n   * @param {Array} array The array of grouped elements to process.\n   * @returns {Array} Returns the new array of regrouped elements.\n   * @example\n   *\n   * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);\n   * // => [['a', 1, true], ['b', 2, false]]\n   *\n   * _.unzip(zipped);\n   * // => [['a', 'b'], [1, 2], [true, false]]\n   */\n  function unzip(array) {\n    if (!(array && array.length)) {\n      return [];\n    }\n    var length = 0;\n    array = arrayFilter(array, function(group) {\n      if (isArrayLikeObject(group)) {\n        length = nativeMax(group.length, length);\n        return true;\n      }\n    });\n    return baseTimes(length, function(index) {\n      return arrayMap(array, baseProperty(index));\n    });\n  }\n\n  /**\n   * Creates an array excluding all given values using\n   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n   * for equality comparisons.\n   *\n   * **Note:** Unlike `_.pull`, this method returns a new array.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {Array} array The array to inspect.\n   * @param {...*} [values] The values to exclude.\n   * @returns {Array} Returns the new array of filtered values.\n   * @see _.difference, _.xor\n   * @example\n   *\n   * _.without([2, 1, 2, 3], 1, 2);\n   * // => [3]\n   */\n  var without = baseRest(function(array, values) {\n    return isArrayLikeObject(array)\n        ? baseDifference(array, values)\n        : [];\n  });\n\n  /**\n   * Creates an array of grouped elements, the first of which contains the\n   * first elements of the given arrays, the second of which contains the\n   * second elements of the given arrays, and so on.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Array\n   * @param {...Array} [arrays] The arrays to process.\n   * @returns {Array} Returns the new array of grouped elements.\n   * @example\n   *\n   * _.zip(['a', 'b'], [1, 2], [true, false]);\n   * // => [['a', 1, true], ['b', 2, false]]\n   */\n  var zip = baseRest(unzip);\n\n  /**\n   * This method is like `_.fromPairs` except that it accepts two arrays,\n   * one of property identifiers and one of corresponding values.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.4.0\n   * @category Array\n   * @param {Array} [props=[]] The property identifiers.\n   * @param {Array} [values=[]] The property values.\n   * @returns {Object} Returns the new object.\n   * @example\n   *\n   * _.zipObject(['a', 'b'], [1, 2]);\n   * // => { 'a': 1, 'b': 2 }\n   */\n  function zipObject(props, values) {\n    return baseZipObject(props || [], values || [], assignValue);\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates a `lodash` wrapper instance that wraps `value` with explicit method\n   * chain sequences enabled. The result of such sequences must be unwrapped\n   * with `_#value`.\n   *\n   * @static\n   * @memberOf _\n   * @since 1.3.0\n   * @category Seq\n   * @param {*} value The value to wrap.\n   * @returns {Object} Returns the new `lodash` wrapper instance.\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'barney',  'age': 36 },\n   *   { 'user': 'fred',    'age': 40 },\n   *   { 'user': 'pebbles', 'age': 1 }\n   * ];\n   *\n   * var youngest = _\n   *   .chain(users)\n   *   .sortBy('age')\n   *   .map(function(o) {\n   *     return o.user + ' is ' + o.age;\n   *   })\n   *   .head()\n   *   .value();\n   * // => 'pebbles is 1'\n   */\n  function chain(value) {\n    var result = lodash(value);\n    result.__chain__ = true;\n    return result;\n  }\n\n  /**\n   * This method invokes `interceptor` and returns `value`. The interceptor\n   * is invoked with one argument; (value). The purpose of this method is to\n   * \"tap into\" a method chain sequence in order to modify intermediate results.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Seq\n   * @param {*} value The value to provide to `interceptor`.\n   * @param {Function} interceptor The function to invoke.\n   * @returns {*} Returns `value`.\n   * @example\n   *\n   * _([1, 2, 3])\n   *  .tap(function(array) {\n   *    // Mutate input array.\n   *    array.pop();\n   *  })\n   *  .reverse()\n   *  .value();\n   * // => [2, 1]\n   */\n  function tap(value, interceptor) {\n    interceptor(value);\n    return value;\n  }\n\n  /**\n   * This method is like `_.tap` except that it returns the result of `interceptor`.\n   * The purpose of this method is to \"pass thru\" values replacing intermediate\n   * results in a method chain sequence.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Seq\n   * @param {*} value The value to provide to `interceptor`.\n   * @param {Function} interceptor The function to invoke.\n   * @returns {*} Returns the result of `interceptor`.\n   * @example\n   *\n   * _('  abc  ')\n   *  .chain()\n   *  .trim()\n   *  .thru(function(value) {\n   *    return [value];\n   *  })\n   *  .value();\n   * // => ['abc']\n   */\n  function thru(value, interceptor) {\n    return interceptor(value);\n  }\n\n  /**\n   * This method is the wrapper version of `_.at`.\n   *\n   * @name at\n   * @memberOf _\n   * @since 1.0.0\n   * @category Seq\n   * @param {...(string|string[])} [paths] The property paths to pick.\n   * @returns {Object} Returns the new `lodash` wrapper instance.\n   * @example\n   *\n   * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };\n   *\n   * _(object).at(['a[0].b.c', 'a[1]']).value();\n   * // => [3, 4]\n   */\n  var wrapperAt = flatRest(function(paths) {\n    var length = paths.length,\n        start = length ? paths[0] : 0,\n        value = this.__wrapped__,\n        interceptor = function(object) { return baseAt(object, paths); };\n\n    if (length > 1 || this.__actions__.length ||\n        !(value instanceof LazyWrapper) || !isIndex(start)) {\n      return this.thru(interceptor);\n    }\n    value = value.slice(start, +start + (length ? 1 : 0));\n    value.__actions__.push({\n      'func': thru,\n      'args': [interceptor],\n      'thisArg': undefined\n    });\n    return new LodashWrapper(value, this.__chain__).thru(function(array) {\n      if (length && !array.length) {\n        array.push(undefined);\n      }\n      return array;\n    });\n  });\n\n  /**\n   * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.\n   *\n   * @name chain\n   * @memberOf _\n   * @since 0.1.0\n   * @category Seq\n   * @returns {Object} Returns the new `lodash` wrapper instance.\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'barney', 'age': 36 },\n   *   { 'user': 'fred',   'age': 40 }\n   * ];\n   *\n   * // A sequence without explicit chaining.\n   * _(users).head();\n   * // => { 'user': 'barney', 'age': 36 }\n   *\n   * // A sequence with explicit chaining.\n   * _(users)\n   *   .chain()\n   *   .head()\n   *   .pick('user')\n   *   .value();\n   * // => { 'user': 'barney' }\n   */\n  function wrapperChain() {\n    return chain(this);\n  }\n\n  /**\n   * Executes the chain sequence and returns the wrapped result.\n   *\n   * @name commit\n   * @memberOf _\n   * @since 3.2.0\n   * @category Seq\n   * @returns {Object} Returns the new `lodash` wrapper instance.\n   * @example\n   *\n   * var array = [1, 2];\n   * var wrapped = _(array).push(3);\n   *\n   * console.log(array);\n   * // => [1, 2]\n   *\n   * wrapped = wrapped.commit();\n   * console.log(array);\n   * // => [1, 2, 3]\n   *\n   * wrapped.last();\n   * // => 3\n   *\n   * console.log(array);\n   * // => [1, 2, 3]\n   */\n  function wrapperCommit() {\n    return new LodashWrapper(this.value(), this.__chain__);\n  }\n\n  /**\n   * Gets the next value on a wrapped object following the\n   * [iterator protocol](https://mdn.io/iteration_protocols#iterator).\n   *\n   * @name next\n   * @memberOf _\n   * @since 4.0.0\n   * @category Seq\n   * @returns {Object} Returns the next iterator value.\n   * @example\n   *\n   * var wrapped = _([1, 2]);\n   *\n   * wrapped.next();\n   * // => { 'done': false, 'value': 1 }\n   *\n   * wrapped.next();\n   * // => { 'done': false, 'value': 2 }\n   *\n   * wrapped.next();\n   * // => { 'done': true, 'value': undefined }\n   */\n  function wrapperNext() {\n    if (this.__values__ === undefined) {\n      this.__values__ = toArray(this.value());\n    }\n    var done = this.__index__ >= this.__values__.length,\n        value = done ? undefined : this.__values__[this.__index__++];\n\n    return { 'done': done, 'value': value };\n  }\n\n  /**\n   * Enables the wrapper to be iterable.\n   *\n   * @name Symbol.iterator\n   * @memberOf _\n   * @since 4.0.0\n   * @category Seq\n   * @returns {Object} Returns the wrapper object.\n   * @example\n   *\n   * var wrapped = _([1, 2]);\n   *\n   * wrapped[Symbol.iterator]() === wrapped;\n   * // => true\n   *\n   * Array.from(wrapped);\n   * // => [1, 2]\n   */\n  function wrapperToIterator() {\n    return this;\n  }\n\n  /**\n   * Creates a clone of the chain sequence planting `value` as the wrapped value.\n   *\n   * @name plant\n   * @memberOf _\n   * @since 3.2.0\n   * @category Seq\n   * @param {*} value The value to plant.\n   * @returns {Object} Returns the new `lodash` wrapper instance.\n   * @example\n   *\n   * function square(n) {\n   *   return n * n;\n   * }\n   *\n   * var wrapped = _([1, 2]).map(square);\n   * var other = wrapped.plant([3, 4]);\n   *\n   * other.value();\n   * // => [9, 16]\n   *\n   * wrapped.value();\n   * // => [1, 4]\n   */\n  function wrapperPlant(value) {\n    var result,\n        parent = this;\n\n    while (parent instanceof baseLodash) {\n      var clone = wrapperClone(parent);\n      clone.__index__ = 0;\n      clone.__values__ = undefined;\n      if (result) {\n        previous.__wrapped__ = clone;\n      } else {\n        result = clone;\n      }\n      var previous = clone;\n      parent = parent.__wrapped__;\n    }\n    previous.__wrapped__ = value;\n    return result;\n  }\n\n  /**\n   * This method is the wrapper version of `_.reverse`.\n   *\n   * **Note:** This method mutates the wrapped array.\n   *\n   * @name reverse\n   * @memberOf _\n   * @since 0.1.0\n   * @category Seq\n   * @returns {Object} Returns the new `lodash` wrapper instance.\n   * @example\n   *\n   * var array = [1, 2, 3];\n   *\n   * _(array).reverse().value()\n   * // => [3, 2, 1]\n   *\n   * console.log(array);\n   * // => [3, 2, 1]\n   */\n  function wrapperReverse() {\n    var value = this.__wrapped__;\n    if (value instanceof LazyWrapper) {\n      var wrapped = value;\n      if (this.__actions__.length) {\n        wrapped = new LazyWrapper(this);\n      }\n      wrapped = wrapped.reverse();\n      wrapped.__actions__.push({\n        'func': thru,\n        'args': [reverse],\n        'thisArg': undefined\n      });\n      return new LodashWrapper(wrapped, this.__chain__);\n    }\n    return this.thru(reverse);\n  }\n\n  /**\n   * Executes the chain sequence to resolve the unwrapped value.\n   *\n   * @name value\n   * @memberOf _\n   * @since 0.1.0\n   * @alias toJSON, valueOf\n   * @category Seq\n   * @returns {*} Returns the resolved unwrapped value.\n   * @example\n   *\n   * _([1, 2, 3]).value();\n   * // => [1, 2, 3]\n   */\n  function wrapperValue() {\n    return baseWrapperValue(this.__wrapped__, this.__actions__);\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates an object composed of keys generated from the results of running\n   * each element of `collection` thru `iteratee`. The corresponding value of\n   * each key is the number of times the key was returned by `iteratee`. The\n   * iteratee is invoked with one argument: (value).\n   *\n   * @static\n   * @memberOf _\n   * @since 0.5.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [iteratee=_.identity] The iteratee to transform keys.\n   * @returns {Object} Returns the composed aggregate object.\n   * @example\n   *\n   * _.countBy([6.1, 4.2, 6.3], Math.floor);\n   * // => { '4': 1, '6': 2 }\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.countBy(['one', 'two', 'three'], 'length');\n   * // => { '3': 2, '5': 1 }\n   */\n  var countBy = createAggregator(function(result, value, key) {\n    if (hasOwnProperty.call(result, key)) {\n      ++result[key];\n    } else {\n      baseAssignValue(result, key, 1);\n    }\n  });\n\n  /**\n   * Checks if `predicate` returns truthy for **all** elements of `collection`.\n   * Iteration is stopped once `predicate` returns falsey. The predicate is\n   * invoked with three arguments: (value, index|key, collection).\n   *\n   * **Note:** This method returns `true` for\n   * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because\n   * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of\n   * elements of empty collections.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\n   * @returns {boolean} Returns `true` if all elements pass the predicate check,\n   *  else `false`.\n   * @example\n   *\n   * _.every([true, 1, null, 'yes'], Boolean);\n   * // => false\n   *\n   * var users = [\n   *   { 'user': 'barney', 'age': 36, 'active': false },\n   *   { 'user': 'fred',   'age': 40, 'active': false }\n   * ];\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.every(users, { 'user': 'barney', 'active': false });\n   * // => false\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.every(users, ['active', false]);\n   * // => true\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.every(users, 'active');\n   * // => false\n   */\n  function every(collection, predicate, guard) {\n    var func = isArray(collection) ? arrayEvery : baseEvery;\n    if (guard && isIterateeCall(collection, predicate, guard)) {\n      predicate = undefined;\n    }\n    return func(collection, baseIteratee(predicate, 3));\n  }\n\n  /**\n   * Iterates over elements of `collection`, returning an array of all elements\n   * `predicate` returns truthy for. The predicate is invoked with three\n   * arguments: (value, index|key, collection).\n   *\n   * **Note:** Unlike `_.remove`, this method returns a new array.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @returns {Array} Returns the new filtered array.\n   * @see _.reject\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'barney', 'age': 36, 'active': true },\n   *   { 'user': 'fred',   'age': 40, 'active': false }\n   * ];\n   *\n   * _.filter(users, function(o) { return !o.active; });\n   * // => objects for ['fred']\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.filter(users, { 'age': 36, 'active': true });\n   * // => objects for ['barney']\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.filter(users, ['active', false]);\n   * // => objects for ['fred']\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.filter(users, 'active');\n   * // => objects for ['barney']\n   */\n  function filter(collection, predicate) {\n    var func = isArray(collection) ? arrayFilter : baseFilter;\n    return func(collection, baseIteratee(predicate, 3));\n  }\n\n  /**\n   * Iterates over elements of `collection`, returning the first element\n   * `predicate` returns truthy for. The predicate is invoked with three\n   * arguments: (value, index|key, collection).\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to inspect.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @param {number} [fromIndex=0] The index to search from.\n   * @returns {*} Returns the matched element, else `undefined`.\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'barney',  'age': 36, 'active': true },\n   *   { 'user': 'fred',    'age': 40, 'active': false },\n   *   { 'user': 'pebbles', 'age': 1,  'active': true }\n   * ];\n   *\n   * _.find(users, function(o) { return o.age < 40; });\n   * // => object for 'barney'\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.find(users, { 'age': 1, 'active': true });\n   * // => object for 'pebbles'\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.find(users, ['active', false]);\n   * // => object for 'fred'\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.find(users, 'active');\n   * // => object for 'barney'\n   */\n  var find = createFind(findIndex);\n\n  /**\n   * Iterates over elements of `collection` and invokes `iteratee` for each element.\n   * The iteratee is invoked with three arguments: (value, index|key, collection).\n   * Iteratee functions may exit iteration early by explicitly returning `false`.\n   *\n   * **Note:** As with other \"Collections\" methods, objects with a \"length\"\n   * property are iterated like arrays. To avoid this behavior use `_.forIn`\n   * or `_.forOwn` for object iteration.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @alias each\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [iteratee=_.identity] The function invoked per iteration.\n   * @returns {Array|Object} Returns `collection`.\n   * @see _.forEachRight\n   * @example\n   *\n   * _.forEach([1, 2], function(value) {\n   *   console.log(value);\n   * });\n   * // => Logs `1` then `2`.\n   *\n   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {\n   *   console.log(key);\n   * });\n   * // => Logs 'a' then 'b' (iteration order is not guaranteed).\n   */\n  function forEach(collection, iteratee) {\n    var func = isArray(collection) ? arrayEach : baseEach;\n    return func(collection, baseIteratee(iteratee, 3));\n  }\n\n  /**\n   * Creates an object composed of keys generated from the results of running\n   * each element of `collection` thru `iteratee`. The order of grouped values\n   * is determined by the order they occur in `collection`. The corresponding\n   * value of each key is an array of elements responsible for generating the\n   * key. The iteratee is invoked with one argument: (value).\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [iteratee=_.identity] The iteratee to transform keys.\n   * @returns {Object} Returns the composed aggregate object.\n   * @example\n   *\n   * _.groupBy([6.1, 4.2, 6.3], Math.floor);\n   * // => { '4': [4.2], '6': [6.1, 6.3] }\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.groupBy(['one', 'two', 'three'], 'length');\n   * // => { '3': ['one', 'two'], '5': ['three'] }\n   */\n  var groupBy = createAggregator(function(result, value, key) {\n    if (hasOwnProperty.call(result, key)) {\n      result[key].push(value);\n    } else {\n      baseAssignValue(result, key, [value]);\n    }\n  });\n\n  /**\n   * Creates an array of values by running each element in `collection` thru\n   * `iteratee`. The iteratee is invoked with three arguments:\n   * (value, index|key, collection).\n   *\n   * Many lodash methods are guarded to work as iteratees for methods like\n   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.\n   *\n   * The guarded methods are:\n   * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,\n   * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,\n   * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,\n   * `template`, `trim`, `trimEnd`, `trimStart`, and `words`\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [iteratee=_.identity] The function invoked per iteration.\n   * @returns {Array} Returns the new mapped array.\n   * @example\n   *\n   * function square(n) {\n   *   return n * n;\n   * }\n   *\n   * _.map([4, 8], square);\n   * // => [16, 64]\n   *\n   * _.map({ 'a': 4, 'b': 8 }, square);\n   * // => [16, 64] (iteration order is not guaranteed)\n   *\n   * var users = [\n   *   { 'user': 'barney' },\n   *   { 'user': 'fred' }\n   * ];\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.map(users, 'user');\n   * // => ['barney', 'fred']\n   */\n  function map(collection, iteratee) {\n    var func = isArray(collection) ? arrayMap : baseMap;\n    return func(collection, baseIteratee(iteratee, 3));\n  }\n\n  /**\n   * Reduces `collection` to a value which is the accumulated result of running\n   * each element in `collection` thru `iteratee`, where each successive\n   * invocation is supplied the return value of the previous. If `accumulator`\n   * is not given, the first element of `collection` is used as the initial\n   * value. The iteratee is invoked with four arguments:\n   * (accumulator, value, index|key, collection).\n   *\n   * Many lodash methods are guarded to work as iteratees for methods like\n   * `_.reduce`, `_.reduceRight`, and `_.transform`.\n   *\n   * The guarded methods are:\n   * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,\n   * and `sortBy`\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [iteratee=_.identity] The function invoked per iteration.\n   * @param {*} [accumulator] The initial value.\n   * @returns {*} Returns the accumulated value.\n   * @see _.reduceRight\n   * @example\n   *\n   * _.reduce([1, 2], function(sum, n) {\n   *   return sum + n;\n   * }, 0);\n   * // => 3\n   *\n   * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {\n   *   (result[value] || (result[value] = [])).push(key);\n   *   return result;\n   * }, {});\n   * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)\n   */\n  function reduce(collection, iteratee, accumulator) {\n    var func = isArray(collection) ? arrayReduce : baseReduce,\n        initAccum = arguments.length < 3;\n\n    return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);\n  }\n\n  /**\n   * The opposite of `_.filter`; this method returns the elements of `collection`\n   * that `predicate` does **not** return truthy for.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @returns {Array} Returns the new filtered array.\n   * @see _.filter\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'barney', 'age': 36, 'active': false },\n   *   { 'user': 'fred',   'age': 40, 'active': true }\n   * ];\n   *\n   * _.reject(users, function(o) { return !o.active; });\n   * // => objects for ['fred']\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.reject(users, { 'age': 40, 'active': true });\n   * // => objects for ['barney']\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.reject(users, ['active', false]);\n   * // => objects for ['fred']\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.reject(users, 'active');\n   * // => objects for ['barney']\n   */\n  function reject(collection, predicate) {\n    var func = isArray(collection) ? arrayFilter : baseFilter;\n    return func(collection, negate(baseIteratee(predicate, 3)));\n  }\n\n  /**\n   * Gets the size of `collection` by returning its length for array-like\n   * values or the number of own enumerable string keyed properties for objects.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object|string} collection The collection to inspect.\n   * @returns {number} Returns the collection size.\n   * @example\n   *\n   * _.size([1, 2, 3]);\n   * // => 3\n   *\n   * _.size({ 'a': 1, 'b': 2 });\n   * // => 2\n   *\n   * _.size('pebbles');\n   * // => 7\n   */\n  function size(collection) {\n    if (collection == null) {\n      return 0;\n    }\n    if (isArrayLike(collection)) {\n      return isString(collection) ? stringSize(collection) : collection.length;\n    }\n    var tag = getTag(collection);\n    if (tag == mapTag || tag == setTag) {\n      return collection.size;\n    }\n    return baseKeys(collection).length;\n  }\n\n  /**\n   * Checks if `predicate` returns truthy for **any** element of `collection`.\n   * Iteration is stopped once `predicate` returns truthy. The predicate is\n   * invoked with three arguments: (value, index|key, collection).\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\n   * @returns {boolean} Returns `true` if any element passes the predicate check,\n   *  else `false`.\n   * @example\n   *\n   * _.some([null, 0, 'yes', false], Boolean);\n   * // => true\n   *\n   * var users = [\n   *   { 'user': 'barney', 'active': true },\n   *   { 'user': 'fred',   'active': false }\n   * ];\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.some(users, { 'user': 'barney', 'active': false });\n   * // => false\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.some(users, ['active', false]);\n   * // => true\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.some(users, 'active');\n   * // => true\n   */\n  function some(collection, predicate, guard) {\n    var func = isArray(collection) ? arraySome : baseSome;\n    if (guard && isIterateeCall(collection, predicate, guard)) {\n      predicate = undefined;\n    }\n    return func(collection, baseIteratee(predicate, 3));\n  }\n\n  /**\n   * Creates an array of elements, sorted in ascending order by the results of\n   * running each element in a collection thru each iteratee. This method\n   * performs a stable sort, that is, it preserves the original sort order of\n   * equal elements. The iteratees are invoked with one argument: (value).\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Collection\n   * @param {Array|Object} collection The collection to iterate over.\n   * @param {...(Function|Function[])} [iteratees=[_.identity]]\n   *  The iteratees to sort by.\n   * @returns {Array} Returns the new sorted array.\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'fred',   'age': 48 },\n   *   { 'user': 'barney', 'age': 36 },\n   *   { 'user': 'fred',   'age': 40 },\n   *   { 'user': 'barney', 'age': 34 }\n   * ];\n   *\n   * _.sortBy(users, [function(o) { return o.user; }]);\n   * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]\n   *\n   * _.sortBy(users, ['user', 'age']);\n   * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]\n   */\n  var sortBy = baseRest(function(collection, iteratees) {\n    if (collection == null) {\n      return [];\n    }\n    var length = iteratees.length;\n    if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {\n      iteratees = [];\n    } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {\n      iteratees = [iteratees[0]];\n    }\n    return baseOrderBy(collection, baseFlatten(iteratees, 1), []);\n  });\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Gets the timestamp of the number of milliseconds that have elapsed since\n   * the Unix epoch (1 January 1970 00:00:00 UTC).\n   *\n   * @static\n   * @memberOf _\n   * @since 2.4.0\n   * @category Date\n   * @returns {number} Returns the timestamp.\n   * @example\n   *\n   * _.defer(function(stamp) {\n   *   console.log(_.now() - stamp);\n   * }, _.now());\n   * // => Logs the number of milliseconds it took for the deferred invocation.\n   */\n  var now = function() {\n    return root.Date.now();\n  };\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * The opposite of `_.before`; this method creates a function that invokes\n   * `func` once it's called `n` or more times.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Function\n   * @param {number} n The number of calls before `func` is invoked.\n   * @param {Function} func The function to restrict.\n   * @returns {Function} Returns the new restricted function.\n   * @example\n   *\n   * var saves = ['profile', 'settings'];\n   *\n   * var done = _.after(saves.length, function() {\n   *   console.log('done saving!');\n   * });\n   *\n   * _.forEach(saves, function(type) {\n   *   asyncSave({ 'type': type, 'complete': done });\n   * });\n   * // => Logs 'done saving!' after the two async saves have completed.\n   */\n  function after(n, func) {\n    if (typeof func != 'function') {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    n = toInteger(n);\n    return function() {\n      if (--n < 1) {\n        return func.apply(this, arguments);\n      }\n    };\n  }\n\n  /**\n   * Creates a function that invokes `func`, with the `this` binding and arguments\n   * of the created function, while it's called less than `n` times. Subsequent\n   * calls to the created function return the result of the last `func` invocation.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Function\n   * @param {number} n The number of calls at which `func` is no longer invoked.\n   * @param {Function} func The function to restrict.\n   * @returns {Function} Returns the new restricted function.\n   * @example\n   *\n   * jQuery(element).on('click', _.before(5, addContactToList));\n   * // => Allows adding up to 4 contacts to the list.\n   */\n  function before(n, func) {\n    var result;\n    if (typeof func != 'function') {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    n = toInteger(n);\n    return function() {\n      if (--n > 0) {\n        result = func.apply(this, arguments);\n      }\n      if (n <= 1) {\n        func = undefined;\n      }\n      return result;\n    };\n  }\n\n  /**\n   * Creates a function that invokes `func` with the `this` binding of `thisArg`\n   * and `partials` prepended to the arguments it receives.\n   *\n   * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,\n   * may be used as a placeholder for partially applied arguments.\n   *\n   * **Note:** Unlike native `Function#bind`, this method doesn't set the \"length\"\n   * property of bound functions.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Function\n   * @param {Function} func The function to bind.\n   * @param {*} thisArg The `this` binding of `func`.\n   * @param {...*} [partials] The arguments to be partially applied.\n   * @returns {Function} Returns the new bound function.\n   * @example\n   *\n   * function greet(greeting, punctuation) {\n   *   return greeting + ' ' + this.user + punctuation;\n   * }\n   *\n   * var object = { 'user': 'fred' };\n   *\n   * var bound = _.bind(greet, object, 'hi');\n   * bound('!');\n   * // => 'hi fred!'\n   *\n   * // Bound with placeholders.\n   * var bound = _.bind(greet, object, _, '!');\n   * bound('hi');\n   * // => 'hi fred!'\n   */\n  var bind = baseRest(function(func, thisArg, partials) {\n    var bitmask = WRAP_BIND_FLAG;\n    if (partials.length) {\n      var holders = replaceHolders(partials, getHolder(bind));\n      bitmask |= WRAP_PARTIAL_FLAG;\n    }\n    return createWrap(func, bitmask, thisArg, partials, holders);\n  });\n\n  /**\n   * Creates a debounced function that delays invoking `func` until after `wait`\n   * milliseconds have elapsed since the last time the debounced function was\n   * invoked. The debounced function comes with a `cancel` method to cancel\n   * delayed `func` invocations and a `flush` method to immediately invoke them.\n   * Provide `options` to indicate whether `func` should be invoked on the\n   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked\n   * with the last arguments provided to the debounced function. Subsequent\n   * calls to the debounced function return the result of the last `func`\n   * invocation.\n   *\n   * **Note:** If `leading` and `trailing` options are `true`, `func` is\n   * invoked on the trailing edge of the timeout only if the debounced function\n   * is invoked more than once during the `wait` timeout.\n   *\n   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred\n   * until to the next tick, similar to `setTimeout` with a timeout of `0`.\n   *\n   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)\n   * for details over the differences between `_.debounce` and `_.throttle`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Function\n   * @param {Function} func The function to debounce.\n   * @param {number} [wait=0] The number of milliseconds to delay.\n   * @param {Object} [options={}] The options object.\n   * @param {boolean} [options.leading=false]\n   *  Specify invoking on the leading edge of the timeout.\n   * @param {number} [options.maxWait]\n   *  The maximum time `func` is allowed to be delayed before it's invoked.\n   * @param {boolean} [options.trailing=true]\n   *  Specify invoking on the trailing edge of the timeout.\n   * @returns {Function} Returns the new debounced function.\n   * @example\n   *\n   * // Avoid costly calculations while the window size is in flux.\n   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));\n   *\n   * // Invoke `sendMail` when clicked, debouncing subsequent calls.\n   * jQuery(element).on('click', _.debounce(sendMail, 300, {\n   *   'leading': true,\n   *   'trailing': false\n   * }));\n   *\n   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.\n   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });\n   * var source = new EventSource('/stream');\n   * jQuery(source).on('message', debounced);\n   *\n   * // Cancel the trailing debounced invocation.\n   * jQuery(window).on('popstate', debounced.cancel);\n   */\n  function debounce(func, wait, options) {\n    var lastArgs,\n        lastThis,\n        maxWait,\n        result,\n        timerId,\n        lastCallTime,\n        lastInvokeTime = 0,\n        leading = false,\n        maxing = false,\n        trailing = true;\n\n    if (typeof func != 'function') {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    wait = toNumber(wait) || 0;\n    if (isObject(options)) {\n      leading = !!options.leading;\n      maxing = 'maxWait' in options;\n      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;\n      trailing = 'trailing' in options ? !!options.trailing : trailing;\n    }\n\n    function invokeFunc(time) {\n      var args = lastArgs,\n          thisArg = lastThis;\n\n      lastArgs = lastThis = undefined;\n      lastInvokeTime = time;\n      result = func.apply(thisArg, args);\n      return result;\n    }\n\n    function leadingEdge(time) {\n      // Reset any `maxWait` timer.\n      lastInvokeTime = time;\n      // Start the timer for the trailing edge.\n      timerId = setTimeout(timerExpired, wait);\n      // Invoke the leading edge.\n      return leading ? invokeFunc(time) : result;\n    }\n\n    function remainingWait(time) {\n      var timeSinceLastCall = time - lastCallTime,\n          timeSinceLastInvoke = time - lastInvokeTime,\n          timeWaiting = wait - timeSinceLastCall;\n\n      return maxing\n          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)\n          : timeWaiting;\n    }\n\n    function shouldInvoke(time) {\n      var timeSinceLastCall = time - lastCallTime,\n          timeSinceLastInvoke = time - lastInvokeTime;\n\n      // Either this is the first call, activity has stopped and we're at the\n      // trailing edge, the system time has gone backwards and we're treating\n      // it as the trailing edge, or we've hit the `maxWait` limit.\n      return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||\n          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));\n    }\n\n    function timerExpired() {\n      var time = now();\n      if (shouldInvoke(time)) {\n        return trailingEdge(time);\n      }\n      // Restart the timer.\n      timerId = setTimeout(timerExpired, remainingWait(time));\n    }\n\n    function trailingEdge(time) {\n      timerId = undefined;\n\n      // Only invoke if we have `lastArgs` which means `func` has been\n      // debounced at least once.\n      if (trailing && lastArgs) {\n        return invokeFunc(time);\n      }\n      lastArgs = lastThis = undefined;\n      return result;\n    }\n\n    function cancel() {\n      if (timerId !== undefined) {\n        clearTimeout(timerId);\n      }\n      lastInvokeTime = 0;\n      lastArgs = lastCallTime = lastThis = timerId = undefined;\n    }\n\n    function flush() {\n      return timerId === undefined ? result : trailingEdge(now());\n    }\n\n    function debounced() {\n      var time = now(),\n          isInvoking = shouldInvoke(time);\n\n      lastArgs = arguments;\n      lastThis = this;\n      lastCallTime = time;\n\n      if (isInvoking) {\n        if (timerId === undefined) {\n          return leadingEdge(lastCallTime);\n        }\n        if (maxing) {\n          // Handle invocations in a tight loop.\n          timerId = setTimeout(timerExpired, wait);\n          return invokeFunc(lastCallTime);\n        }\n      }\n      if (timerId === undefined) {\n        timerId = setTimeout(timerExpired, wait);\n      }\n      return result;\n    }\n    debounced.cancel = cancel;\n    debounced.flush = flush;\n    return debounced;\n  }\n\n  /**\n   * Defers invoking the `func` until the current call stack has cleared. Any\n   * additional arguments are provided to `func` when it's invoked.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Function\n   * @param {Function} func The function to defer.\n   * @param {...*} [args] The arguments to invoke `func` with.\n   * @returns {number} Returns the timer id.\n   * @example\n   *\n   * _.defer(function(text) {\n   *   console.log(text);\n   * }, 'deferred');\n   * // => Logs 'deferred' after one millisecond.\n   */\n  var defer = baseRest(function(func, args) {\n    return baseDelay(func, 1, args);\n  });\n\n  /**\n   * Invokes `func` after `wait` milliseconds. Any additional arguments are\n   * provided to `func` when it's invoked.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Function\n   * @param {Function} func The function to delay.\n   * @param {number} wait The number of milliseconds to delay invocation.\n   * @param {...*} [args] The arguments to invoke `func` with.\n   * @returns {number} Returns the timer id.\n   * @example\n   *\n   * _.delay(function(text) {\n   *   console.log(text);\n   * }, 1000, 'later');\n   * // => Logs 'later' after one second.\n   */\n  var delay = baseRest(function(func, wait, args) {\n    return baseDelay(func, toNumber(wait) || 0, args);\n  });\n\n  /**\n   * Creates a function that memoizes the result of `func`. If `resolver` is\n   * provided, it determines the cache key for storing the result based on the\n   * arguments provided to the memoized function. By default, the first argument\n   * provided to the memoized function is used as the map cache key. The `func`\n   * is invoked with the `this` binding of the memoized function.\n   *\n   * **Note:** The cache is exposed as the `cache` property on the memoized\n   * function. Its creation may be customized by replacing the `_.memoize.Cache`\n   * constructor with one whose instances implement the\n   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)\n   * method interface of `clear`, `delete`, `get`, `has`, and `set`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Function\n   * @param {Function} func The function to have its output memoized.\n   * @param {Function} [resolver] The function to resolve the cache key.\n   * @returns {Function} Returns the new memoized function.\n   * @example\n   *\n   * var object = { 'a': 1, 'b': 2 };\n   * var other = { 'c': 3, 'd': 4 };\n   *\n   * var values = _.memoize(_.values);\n   * values(object);\n   * // => [1, 2]\n   *\n   * values(other);\n   * // => [3, 4]\n   *\n   * object.a = 2;\n   * values(object);\n   * // => [1, 2]\n   *\n   * // Modify the result cache.\n   * values.cache.set(object, ['a', 'b']);\n   * values(object);\n   * // => ['a', 'b']\n   *\n   * // Replace `_.memoize.Cache`.\n   * _.memoize.Cache = WeakMap;\n   */\n  function memoize(func, resolver) {\n    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    var memoized = function() {\n      var args = arguments,\n          key = resolver ? resolver.apply(this, args) : args[0],\n          cache = memoized.cache;\n\n      if (cache.has(key)) {\n        return cache.get(key);\n      }\n      var result = func.apply(this, args);\n      memoized.cache = cache.set(key, result) || cache;\n      return result;\n    };\n    memoized.cache = new (memoize.Cache || MapCache);\n    return memoized;\n  }\n\n  // Expose `MapCache`.\n  memoize.Cache = MapCache;\n\n  /**\n   * Creates a function that negates the result of the predicate `func`. The\n   * `func` predicate is invoked with the `this` binding and arguments of the\n   * created function.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Function\n   * @param {Function} predicate The predicate to negate.\n   * @returns {Function} Returns the new negated function.\n   * @example\n   *\n   * function isEven(n) {\n   *   return n % 2 == 0;\n   * }\n   *\n   * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));\n   * // => [1, 3, 5]\n   */\n  function negate(predicate) {\n    if (typeof predicate != 'function') {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    return function() {\n      var args = arguments;\n      switch (args.length) {\n        case 0: return !predicate.call(this);\n        case 1: return !predicate.call(this, args[0]);\n        case 2: return !predicate.call(this, args[0], args[1]);\n        case 3: return !predicate.call(this, args[0], args[1], args[2]);\n      }\n      return !predicate.apply(this, args);\n    };\n  }\n\n  /**\n   * Creates a function that is restricted to invoking `func` once. Repeat calls\n   * to the function return the value of the first invocation. The `func` is\n   * invoked with the `this` binding and arguments of the created function.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Function\n   * @param {Function} func The function to restrict.\n   * @returns {Function} Returns the new restricted function.\n   * @example\n   *\n   * var initialize = _.once(createApplication);\n   * initialize();\n   * initialize();\n   * // => `createApplication` is invoked once\n   */\n  function once(func) {\n    return before(2, func);\n  }\n\n  /**\n   * Creates a function that invokes `func` with the `this` binding of the\n   * created function and arguments from `start` and beyond provided as\n   * an array.\n   *\n   * **Note:** This method is based on the\n   * [rest parameter](https://mdn.io/rest_parameters).\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Function\n   * @param {Function} func The function to apply a rest parameter to.\n   * @param {number} [start=func.length-1] The start position of the rest parameter.\n   * @returns {Function} Returns the new function.\n   * @example\n   *\n   * var say = _.rest(function(what, names) {\n   *   return what + ' ' + _.initial(names).join(', ') +\n   *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);\n   * });\n   *\n   * say('hello', 'fred', 'barney', 'pebbles');\n   * // => 'hello fred, barney, & pebbles'\n   */\n  function rest(func, start) {\n    if (typeof func != 'function') {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    start = start === undefined ? start : toInteger(start);\n    return baseRest(func, start);\n  }\n\n  /**\n   * Creates a throttled function that only invokes `func` at most once per\n   * every `wait` milliseconds. The throttled function comes with a `cancel`\n   * method to cancel delayed `func` invocations and a `flush` method to\n   * immediately invoke them. Provide `options` to indicate whether `func`\n   * should be invoked on the leading and/or trailing edge of the `wait`\n   * timeout. The `func` is invoked with the last arguments provided to the\n   * throttled function. Subsequent calls to the throttled function return the\n   * result of the last `func` invocation.\n   *\n   * **Note:** If `leading` and `trailing` options are `true`, `func` is\n   * invoked on the trailing edge of the timeout only if the throttled function\n   * is invoked more than once during the `wait` timeout.\n   *\n   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred\n   * until to the next tick, similar to `setTimeout` with a timeout of `0`.\n   *\n   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)\n   * for details over the differences between `_.throttle` and `_.debounce`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Function\n   * @param {Function} func The function to throttle.\n   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.\n   * @param {Object} [options={}] The options object.\n   * @param {boolean} [options.leading=true]\n   *  Specify invoking on the leading edge of the timeout.\n   * @param {boolean} [options.trailing=true]\n   *  Specify invoking on the trailing edge of the timeout.\n   * @returns {Function} Returns the new throttled function.\n   * @example\n   *\n   * // Avoid excessively updating the position while scrolling.\n   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));\n   *\n   * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.\n   * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });\n   * jQuery(element).on('click', throttled);\n   *\n   * // Cancel the trailing throttled invocation.\n   * jQuery(window).on('popstate', throttled.cancel);\n   */\n  function throttle(func, wait, options) {\n    var leading = true,\n        trailing = true;\n\n    if (typeof func != 'function') {\n      throw new TypeError(FUNC_ERROR_TEXT);\n    }\n    if (isObject(options)) {\n      leading = 'leading' in options ? !!options.leading : leading;\n      trailing = 'trailing' in options ? !!options.trailing : trailing;\n    }\n    return debounce(func, wait, {\n      'leading': leading,\n      'maxWait': wait,\n      'trailing': trailing\n    });\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates a shallow clone of `value`.\n   *\n   * **Note:** This method is loosely based on the\n   * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)\n   * and supports cloning arrays, array buffers, booleans, date objects, maps,\n   * numbers, `Object` objects, regexes, sets, strings, symbols, and typed\n   * arrays. The own enumerable properties of `arguments` objects are cloned\n   * as plain objects. An empty object is returned for uncloneable values such\n   * as error objects, functions, DOM nodes, and WeakMaps.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to clone.\n   * @returns {*} Returns the cloned value.\n   * @see _.cloneDeep\n   * @example\n   *\n   * var objects = [{ 'a': 1 }, { 'b': 2 }];\n   *\n   * var shallow = _.clone(objects);\n   * console.log(shallow[0] === objects[0]);\n   * // => true\n   */\n  function clone(value) {\n    return baseClone(value, CLONE_SYMBOLS_FLAG);\n  }\n\n  /**\n   * This method is like `_.clone` except that it recursively clones `value`.\n   *\n   * @static\n   * @memberOf _\n   * @since 1.0.0\n   * @category Lang\n   * @param {*} value The value to recursively clone.\n   * @returns {*} Returns the deep cloned value.\n   * @see _.clone\n   * @example\n   *\n   * var objects = [{ 'a': 1 }, { 'b': 2 }];\n   *\n   * var deep = _.cloneDeep(objects);\n   * console.log(deep[0] === objects[0]);\n   * // => false\n   */\n  function cloneDeep(value) {\n    return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);\n  }\n\n  /**\n   * Performs a\n   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n   * comparison between two values to determine if they are equivalent.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to compare.\n   * @param {*} other The other value to compare.\n   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\n   * @example\n   *\n   * var object = { 'a': 1 };\n   * var other = { 'a': 1 };\n   *\n   * _.eq(object, object);\n   * // => true\n   *\n   * _.eq(object, other);\n   * // => false\n   *\n   * _.eq('a', 'a');\n   * // => true\n   *\n   * _.eq('a', Object('a'));\n   * // => false\n   *\n   * _.eq(NaN, NaN);\n   * // => true\n   */\n  function eq(value, other) {\n    return value === other || (value !== value && other !== other);\n  }\n\n  /**\n   * Checks if `value` is likely an `arguments` object.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is an `arguments` object,\n   *  else `false`.\n   * @example\n   *\n   * _.isArguments(function() { return arguments; }());\n   * // => true\n   *\n   * _.isArguments([1, 2, 3]);\n   * // => false\n   */\n  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {\n    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&\n        !propertyIsEnumerable.call(value, 'callee');\n  };\n\n  /**\n   * Checks if `value` is classified as an `Array` object.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is an array, else `false`.\n   * @example\n   *\n   * _.isArray([1, 2, 3]);\n   * // => true\n   *\n   * _.isArray(document.body.children);\n   * // => false\n   *\n   * _.isArray('abc');\n   * // => false\n   *\n   * _.isArray(_.noop);\n   * // => false\n   */\n  var isArray = Array.isArray;\n\n  /**\n   * Checks if `value` is array-like. A value is considered array-like if it's\n   * not a function and has a `value.length` that's an integer greater than or\n   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.\n   * @example\n   *\n   * _.isArrayLike([1, 2, 3]);\n   * // => true\n   *\n   * _.isArrayLike(document.body.children);\n   * // => true\n   *\n   * _.isArrayLike('abc');\n   * // => true\n   *\n   * _.isArrayLike(_.noop);\n   * // => false\n   */\n  function isArrayLike(value) {\n    return value != null && isLength(value.length) && !isFunction(value);\n  }\n\n  /**\n   * This method is like `_.isArrayLike` except that it also checks if `value`\n   * is an object.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is an array-like object,\n   *  else `false`.\n   * @example\n   *\n   * _.isArrayLikeObject([1, 2, 3]);\n   * // => true\n   *\n   * _.isArrayLikeObject(document.body.children);\n   * // => true\n   *\n   * _.isArrayLikeObject('abc');\n   * // => false\n   *\n   * _.isArrayLikeObject(_.noop);\n   * // => false\n   */\n  function isArrayLikeObject(value) {\n    return isObjectLike(value) && isArrayLike(value);\n  }\n\n  /**\n   * Checks if `value` is classified as a boolean primitive or object.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.\n   * @example\n   *\n   * _.isBoolean(false);\n   * // => true\n   *\n   * _.isBoolean(null);\n   * // => false\n   */\n  function isBoolean(value) {\n    return value === true || value === false ||\n        (isObjectLike(value) && baseGetTag(value) == boolTag);\n  }\n\n  /**\n   * Checks if `value` is a buffer.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.3.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.\n   * @example\n   *\n   * _.isBuffer(new Buffer(2));\n   * // => true\n   *\n   * _.isBuffer(new Uint8Array(2));\n   * // => false\n   */\n  var isBuffer = nativeIsBuffer || stubFalse;\n\n  /**\n   * Checks if `value` is classified as a `Date` object.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a date object, else `false`.\n   * @example\n   *\n   * _.isDate(new Date);\n   * // => true\n   *\n   * _.isDate('Mon April 23 2012');\n   * // => false\n   */\n  var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;\n\n  /**\n   * Checks if `value` is an empty object, collection, map, or set.\n   *\n   * Objects are considered empty if they have no own enumerable string keyed\n   * properties.\n   *\n   * Array-like values such as `arguments` objects, arrays, buffers, strings, or\n   * jQuery-like collections are considered empty if they have a `length` of `0`.\n   * Similarly, maps and sets are considered empty if they have a `size` of `0`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is empty, else `false`.\n   * @example\n   *\n   * _.isEmpty(null);\n   * // => true\n   *\n   * _.isEmpty(true);\n   * // => true\n   *\n   * _.isEmpty(1);\n   * // => true\n   *\n   * _.isEmpty([1, 2, 3]);\n   * // => false\n   *\n   * _.isEmpty({ 'a': 1 });\n   * // => false\n   */\n  function isEmpty(value) {\n    if (value == null) {\n      return true;\n    }\n    if (isArrayLike(value) &&\n        (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||\n            isBuffer(value) || isTypedArray(value) || isArguments(value))) {\n      return !value.length;\n    }\n    var tag = getTag(value);\n    if (tag == mapTag || tag == setTag) {\n      return !value.size;\n    }\n    if (isPrototype(value)) {\n      return !baseKeys(value).length;\n    }\n    for (var key in value) {\n      if (hasOwnProperty.call(value, key)) {\n        return false;\n      }\n    }\n    return true;\n  }\n\n  /**\n   * Performs a deep comparison between two values to determine if they are\n   * equivalent.\n   *\n   * **Note:** This method supports comparing arrays, array buffers, booleans,\n   * date objects, error objects, maps, numbers, `Object` objects, regexes,\n   * sets, strings, symbols, and typed arrays. `Object` objects are compared\n   * by their own, not inherited, enumerable properties. Functions and DOM\n   * nodes are compared by strict equality, i.e. `===`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to compare.\n   * @param {*} other The other value to compare.\n   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\n   * @example\n   *\n   * var object = { 'a': 1 };\n   * var other = { 'a': 1 };\n   *\n   * _.isEqual(object, other);\n   * // => true\n   *\n   * object === other;\n   * // => false\n   */\n  function isEqual(value, other) {\n    return baseIsEqual(value, other);\n  }\n\n  /**\n   * Checks if `value` is a finite primitive number.\n   *\n   * **Note:** This method is based on\n   * [`Number.isFinite`](https://mdn.io/Number/isFinite).\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.\n   * @example\n   *\n   * _.isFinite(3);\n   * // => true\n   *\n   * _.isFinite(Number.MIN_VALUE);\n   * // => true\n   *\n   * _.isFinite(Infinity);\n   * // => false\n   *\n   * _.isFinite('3');\n   * // => false\n   */\n  function isFinite(value) {\n    return typeof value == 'number' && nativeIsFinite(value);\n  }\n\n  /**\n   * Checks if `value` is classified as a `Function` object.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a function, else `false`.\n   * @example\n   *\n   * _.isFunction(_);\n   * // => true\n   *\n   * _.isFunction(/abc/);\n   * // => false\n   */\n  function isFunction(value) {\n    if (!isObject(value)) {\n      return false;\n    }\n    // The use of `Object#toString` avoids issues with the `typeof` operator\n    // in Safari 9 which returns 'object' for typed arrays and other constructors.\n    var tag = baseGetTag(value);\n    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;\n  }\n\n  /**\n   * Checks if `value` is a valid array-like length.\n   *\n   * **Note:** This method is loosely based on\n   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.\n   * @example\n   *\n   * _.isLength(3);\n   * // => true\n   *\n   * _.isLength(Number.MIN_VALUE);\n   * // => false\n   *\n   * _.isLength(Infinity);\n   * // => false\n   *\n   * _.isLength('3');\n   * // => false\n   */\n  function isLength(value) {\n    return typeof value == 'number' &&\n        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;\n  }\n\n  /**\n   * Checks if `value` is the\n   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)\n   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is an object, else `false`.\n   * @example\n   *\n   * _.isObject({});\n   * // => true\n   *\n   * _.isObject([1, 2, 3]);\n   * // => true\n   *\n   * _.isObject(_.noop);\n   * // => true\n   *\n   * _.isObject(null);\n   * // => false\n   */\n  function isObject(value) {\n    var type = typeof value;\n    return value != null && (type == 'object' || type == 'function');\n  }\n\n  /**\n   * Checks if `value` is object-like. A value is object-like if it's not `null`\n   * and has a `typeof` result of \"object\".\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.\n   * @example\n   *\n   * _.isObjectLike({});\n   * // => true\n   *\n   * _.isObjectLike([1, 2, 3]);\n   * // => true\n   *\n   * _.isObjectLike(_.noop);\n   * // => false\n   *\n   * _.isObjectLike(null);\n   * // => false\n   */\n  function isObjectLike(value) {\n    return value != null && typeof value == 'object';\n  }\n\n  /**\n   * Checks if `value` is classified as a `Map` object.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.3.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a map, else `false`.\n   * @example\n   *\n   * _.isMap(new Map);\n   * // => true\n   *\n   * _.isMap(new WeakMap);\n   * // => false\n   */\n  var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;\n\n  /**\n   * Checks if `value` is `NaN`.\n   *\n   * **Note:** This method is based on\n   * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as\n   * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for\n   * `undefined` and other non-number values.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.\n   * @example\n   *\n   * _.isNaN(NaN);\n   * // => true\n   *\n   * _.isNaN(new Number(NaN));\n   * // => true\n   *\n   * isNaN(undefined);\n   * // => true\n   *\n   * _.isNaN(undefined);\n   * // => false\n   */\n  function isNaN(value) {\n    // An `NaN` primitive is the only value that is not equal to itself.\n    // Perform the `toStringTag` check first to avoid errors with some\n    // ActiveX objects in IE.\n    return isNumber(value) && value != +value;\n  }\n\n  /**\n   * Checks if `value` is `null`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is `null`, else `false`.\n   * @example\n   *\n   * _.isNull(null);\n   * // => true\n   *\n   * _.isNull(void 0);\n   * // => false\n   */\n  function isNull(value) {\n    return value === null;\n  }\n\n  /**\n   * Checks if `value` is classified as a `Number` primitive or object.\n   *\n   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are\n   * classified as numbers, use the `_.isFinite` method.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a number, else `false`.\n   * @example\n   *\n   * _.isNumber(3);\n   * // => true\n   *\n   * _.isNumber(Number.MIN_VALUE);\n   * // => true\n   *\n   * _.isNumber(Infinity);\n   * // => true\n   *\n   * _.isNumber('3');\n   * // => false\n   */\n  function isNumber(value) {\n    return typeof value == 'number' ||\n        (isObjectLike(value) && baseGetTag(value) == numberTag);\n  }\n\n  /**\n   * Checks if `value` is a plain object, that is, an object created by the\n   * `Object` constructor or one with a `[[Prototype]]` of `null`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.8.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.\n   * @example\n   *\n   * function Foo() {\n   *   this.a = 1;\n   * }\n   *\n   * _.isPlainObject(new Foo);\n   * // => false\n   *\n   * _.isPlainObject([1, 2, 3]);\n   * // => false\n   *\n   * _.isPlainObject({ 'x': 0, 'y': 0 });\n   * // => true\n   *\n   * _.isPlainObject(Object.create(null));\n   * // => true\n   */\n  function isPlainObject(value) {\n    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {\n      return false;\n    }\n    var proto = getPrototype(value);\n    if (proto === null) {\n      return true;\n    }\n    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;\n    return typeof Ctor == 'function' && Ctor instanceof Ctor &&\n        funcToString.call(Ctor) == objectCtorString;\n  }\n\n  /**\n   * Checks if `value` is classified as a `RegExp` object.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.1.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.\n   * @example\n   *\n   * _.isRegExp(/abc/);\n   * // => true\n   *\n   * _.isRegExp('/abc/');\n   * // => false\n   */\n  var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;\n\n  /**\n   * Checks if `value` is classified as a `Set` object.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.3.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a set, else `false`.\n   * @example\n   *\n   * _.isSet(new Set);\n   * // => true\n   *\n   * _.isSet(new WeakSet);\n   * // => false\n   */\n  var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;\n\n  /**\n   * Checks if `value` is classified as a `String` primitive or object.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a string, else `false`.\n   * @example\n   *\n   * _.isString('abc');\n   * // => true\n   *\n   * _.isString(1);\n   * // => false\n   */\n  function isString(value) {\n    return typeof value == 'string' ||\n        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);\n  }\n\n  /**\n   * Checks if `value` is classified as a `Symbol` primitive or object.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.\n   * @example\n   *\n   * _.isSymbol(Symbol.iterator);\n   * // => true\n   *\n   * _.isSymbol('abc');\n   * // => false\n   */\n  function isSymbol(value) {\n    return typeof value == 'symbol' ||\n        (isObjectLike(value) && baseGetTag(value) == symbolTag);\n  }\n\n  /**\n   * Checks if `value` is classified as a typed array.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.\n   * @example\n   *\n   * _.isTypedArray(new Uint8Array);\n   * // => true\n   *\n   * _.isTypedArray([]);\n   * // => false\n   */\n  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;\n\n  /**\n   * Checks if `value` is `undefined`.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Lang\n   * @param {*} value The value to check.\n   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.\n   * @example\n   *\n   * _.isUndefined(void 0);\n   * // => true\n   *\n   * _.isUndefined(null);\n   * // => false\n   */\n  function isUndefined(value) {\n    return value === undefined;\n  }\n\n  /**\n   * Converts `value` to an array.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Lang\n   * @param {*} value The value to convert.\n   * @returns {Array} Returns the converted array.\n   * @example\n   *\n   * _.toArray({ 'a': 1, 'b': 2 });\n   * // => [1, 2]\n   *\n   * _.toArray('abc');\n   * // => ['a', 'b', 'c']\n   *\n   * _.toArray(1);\n   * // => []\n   *\n   * _.toArray(null);\n   * // => []\n   */\n  function toArray(value) {\n    if (!value) {\n      return [];\n    }\n    if (isArrayLike(value)) {\n      return isString(value) ? stringToArray(value) : copyArray(value);\n    }\n    if (symIterator && value[symIterator]) {\n      return iteratorToArray(value[symIterator]());\n    }\n    var tag = getTag(value),\n        func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);\n\n    return func(value);\n  }\n\n  /**\n   * Converts `value` to a finite number.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.12.0\n   * @category Lang\n   * @param {*} value The value to convert.\n   * @returns {number} Returns the converted number.\n   * @example\n   *\n   * _.toFinite(3.2);\n   * // => 3.2\n   *\n   * _.toFinite(Number.MIN_VALUE);\n   * // => 5e-324\n   *\n   * _.toFinite(Infinity);\n   * // => 1.7976931348623157e+308\n   *\n   * _.toFinite('3.2');\n   * // => 3.2\n   */\n  function toFinite(value) {\n    if (!value) {\n      return value === 0 ? value : 0;\n    }\n    value = toNumber(value);\n    if (value === INFINITY || value === -INFINITY) {\n      var sign = (value < 0 ? -1 : 1);\n      return sign * MAX_INTEGER;\n    }\n    return value === value ? value : 0;\n  }\n\n  /**\n   * Converts `value` to an integer.\n   *\n   * **Note:** This method is loosely based on\n   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to convert.\n   * @returns {number} Returns the converted integer.\n   * @example\n   *\n   * _.toInteger(3.2);\n   * // => 3\n   *\n   * _.toInteger(Number.MIN_VALUE);\n   * // => 0\n   *\n   * _.toInteger(Infinity);\n   * // => 1.7976931348623157e+308\n   *\n   * _.toInteger('3.2');\n   * // => 3\n   */\n  function toInteger(value) {\n    var result = toFinite(value),\n        remainder = result % 1;\n\n    return result === result ? (remainder ? result - remainder : result) : 0;\n  }\n\n  /**\n   * Converts `value` to a number.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to process.\n   * @returns {number} Returns the number.\n   * @example\n   *\n   * _.toNumber(3.2);\n   * // => 3.2\n   *\n   * _.toNumber(Number.MIN_VALUE);\n   * // => 5e-324\n   *\n   * _.toNumber(Infinity);\n   * // => Infinity\n   *\n   * _.toNumber('3.2');\n   * // => 3.2\n   */\n  function toNumber(value) {\n    if (typeof value == 'number') {\n      return value;\n    }\n    if (isSymbol(value)) {\n      return NAN;\n    }\n    if (isObject(value)) {\n      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;\n      value = isObject(other) ? (other + '') : other;\n    }\n    if (typeof value != 'string') {\n      return value === 0 ? value : +value;\n    }\n    value = value.replace(reTrim, '');\n    var isBinary = reIsBinary.test(value);\n    return (isBinary || reIsOctal.test(value))\n        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)\n        : (reIsBadHex.test(value) ? NAN : +value);\n  }\n\n  /**\n   * Converts `value` to a plain object flattening inherited enumerable string\n   * keyed properties of `value` to own properties of the plain object.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Lang\n   * @param {*} value The value to convert.\n   * @returns {Object} Returns the converted plain object.\n   * @example\n   *\n   * function Foo() {\n   *   this.b = 2;\n   * }\n   *\n   * Foo.prototype.c = 3;\n   *\n   * _.assign({ 'a': 1 }, new Foo);\n   * // => { 'a': 1, 'b': 2 }\n   *\n   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));\n   * // => { 'a': 1, 'b': 2, 'c': 3 }\n   */\n  function toPlainObject(value) {\n    return copyObject(value, keysIn(value));\n  }\n\n  /**\n   * Converts `value` to a string. An empty string is returned for `null`\n   * and `undefined` values. The sign of `-0` is preserved.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Lang\n   * @param {*} value The value to convert.\n   * @returns {string} Returns the converted string.\n   * @example\n   *\n   * _.toString(null);\n   * // => ''\n   *\n   * _.toString(-0);\n   * // => '-0'\n   *\n   * _.toString([1, 2, 3]);\n   * // => '1,2,3'\n   */\n  function toString(value) {\n    return value == null ? '' : baseToString(value);\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * This method is like `_.assign` except that it iterates over own and\n   * inherited source properties.\n   *\n   * **Note:** This method mutates `object`.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @alias extend\n   * @category Object\n   * @param {Object} object The destination object.\n   * @param {...Object} [sources] The source objects.\n   * @returns {Object} Returns `object`.\n   * @see _.assign\n   * @example\n   *\n   * function Foo() {\n   *   this.a = 1;\n   * }\n   *\n   * function Bar() {\n   *   this.c = 3;\n   * }\n   *\n   * Foo.prototype.b = 2;\n   * Bar.prototype.d = 4;\n   *\n   * _.assignIn({ 'a': 0 }, new Foo, new Bar);\n   * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }\n   */\n  var assignIn = createAssigner(function(object, source) {\n    copyObject(source, keysIn(source), object);\n  });\n\n  /**\n   * Creates an object that inherits from the `prototype` object. If a\n   * `properties` object is given, its own enumerable string keyed properties\n   * are assigned to the created object.\n   *\n   * @static\n   * @memberOf _\n   * @since 2.3.0\n   * @category Object\n   * @param {Object} prototype The object to inherit from.\n   * @param {Object} [properties] The properties to assign to the object.\n   * @returns {Object} Returns the new object.\n   * @example\n   *\n   * function Shape() {\n   *   this.x = 0;\n   *   this.y = 0;\n   * }\n   *\n   * function Circle() {\n   *   Shape.call(this);\n   * }\n   *\n   * Circle.prototype = _.create(Shape.prototype, {\n   *   'constructor': Circle\n   * });\n   *\n   * var circle = new Circle;\n   * circle instanceof Circle;\n   * // => true\n   *\n   * circle instanceof Shape;\n   * // => true\n   */\n  function create(prototype, properties) {\n    var result = baseCreate(prototype);\n    return properties == null ? result : baseAssign(result, properties);\n  }\n\n  /**\n   * Assigns own and inherited enumerable string keyed properties of source\n   * objects to the destination object for all destination properties that\n   * resolve to `undefined`. Source objects are applied from left to right.\n   * Once a property is set, additional values of the same property are ignored.\n   *\n   * **Note:** This method mutates `object`.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Object\n   * @param {Object} object The destination object.\n   * @param {...Object} [sources] The source objects.\n   * @returns {Object} Returns `object`.\n   * @see _.defaultsDeep\n   * @example\n   *\n   * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });\n   * // => { 'a': 1, 'b': 2 }\n   */\n  var defaults = baseRest(function(object, sources) {\n    object = Object(object);\n\n    var index = -1;\n    var length = sources.length;\n    var guard = length > 2 ? sources[2] : undefined;\n\n    if (guard && isIterateeCall(sources[0], sources[1], guard)) {\n      length = 1;\n    }\n\n    while (++index < length) {\n      var source = sources[index];\n      var props = keysIn(source);\n      var propsIndex = -1;\n      var propsLength = props.length;\n\n      while (++propsIndex < propsLength) {\n        var key = props[propsIndex];\n        var value = object[key];\n\n        if (value === undefined ||\n            (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {\n          object[key] = source[key];\n        }\n      }\n    }\n\n    return object;\n  });\n\n  /**\n   * This method is like `_.defaults` except that it recursively assigns\n   * default properties.\n   *\n   * **Note:** This method mutates `object`.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.10.0\n   * @category Object\n   * @param {Object} object The destination object.\n   * @param {...Object} [sources] The source objects.\n   * @returns {Object} Returns `object`.\n   * @see _.defaults\n   * @example\n   *\n   * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });\n   * // => { 'a': { 'b': 2, 'c': 3 } }\n   */\n  var defaultsDeep = baseRest(function(args) {\n    args.push(undefined, customDefaultsMerge);\n    return apply(mergeWith, undefined, args);\n  });\n\n  /**\n   * This method is like `_.find` except that it returns the key of the first\n   * element `predicate` returns truthy for instead of the element itself.\n   *\n   * @static\n   * @memberOf _\n   * @since 1.1.0\n   * @category Object\n   * @param {Object} object The object to inspect.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @returns {string|undefined} Returns the key of the matched element,\n   *  else `undefined`.\n   * @example\n   *\n   * var users = {\n   *   'barney':  { 'age': 36, 'active': true },\n   *   'fred':    { 'age': 40, 'active': false },\n   *   'pebbles': { 'age': 1,  'active': true }\n   * };\n   *\n   * _.findKey(users, function(o) { return o.age < 40; });\n   * // => 'barney' (iteration order is not guaranteed)\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.findKey(users, { 'age': 1, 'active': true });\n   * // => 'pebbles'\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.findKey(users, ['active', false]);\n   * // => 'fred'\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.findKey(users, 'active');\n   * // => 'barney'\n   */\n  function findKey(object, predicate) {\n    return baseFindKey(object, baseIteratee(predicate, 3), baseForOwn);\n  }\n\n  /**\n   * This method is like `_.findKey` except that it iterates over elements of\n   * a collection in the opposite order.\n   *\n   * @static\n   * @memberOf _\n   * @since 2.0.0\n   * @category Object\n   * @param {Object} object The object to inspect.\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\n   * @returns {string|undefined} Returns the key of the matched element,\n   *  else `undefined`.\n   * @example\n   *\n   * var users = {\n   *   'barney':  { 'age': 36, 'active': true },\n   *   'fred':    { 'age': 40, 'active': false },\n   *   'pebbles': { 'age': 1,  'active': true }\n   * };\n   *\n   * _.findLastKey(users, function(o) { return o.age < 40; });\n   * // => returns 'pebbles' assuming `_.findKey` returns 'barney'\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.findLastKey(users, { 'age': 36, 'active': true });\n   * // => 'barney'\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.findLastKey(users, ['active', false]);\n   * // => 'fred'\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.findLastKey(users, 'active');\n   * // => 'pebbles'\n   */\n  function findLastKey(object, predicate) {\n    return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);\n  }\n\n  /**\n   * Gets the value at `path` of `object`. If the resolved value is\n   * `undefined`, the `defaultValue` is returned in its place.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.7.0\n   * @category Object\n   * @param {Object} object The object to query.\n   * @param {Array|string} path The path of the property to get.\n   * @param {*} [defaultValue] The value returned for `undefined` resolved values.\n   * @returns {*} Returns the resolved value.\n   * @example\n   *\n   * var object = { 'a': [{ 'b': { 'c': 3 } }] };\n   *\n   * _.get(object, 'a[0].b.c');\n   * // => 3\n   *\n   * _.get(object, ['a', '0', 'b', 'c']);\n   * // => 3\n   *\n   * _.get(object, 'a.b.c', 'default');\n   * // => 'default'\n   */\n  function get(object, path, defaultValue) {\n    var result = object == null ? undefined : baseGet(object, path);\n    return result === undefined ? defaultValue : result;\n  }\n\n  /**\n   * Checks if `path` is a direct property of `object`.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Object\n   * @param {Object} object The object to query.\n   * @param {Array|string} path The path to check.\n   * @returns {boolean} Returns `true` if `path` exists, else `false`.\n   * @example\n   *\n   * var object = { 'a': { 'b': 2 } };\n   * var other = _.create({ 'a': _.create({ 'b': 2 }) });\n   *\n   * _.has(object, 'a');\n   * // => true\n   *\n   * _.has(object, 'a.b');\n   * // => true\n   *\n   * _.has(object, ['a', 'b']);\n   * // => true\n   *\n   * _.has(other, 'a');\n   * // => false\n   */\n  function has(object, path) {\n    return object != null && hasPath(object, path, baseHas);\n  }\n\n  /**\n   * Checks if `path` is a direct or inherited property of `object`.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Object\n   * @param {Object} object The object to query.\n   * @param {Array|string} path The path to check.\n   * @returns {boolean} Returns `true` if `path` exists, else `false`.\n   * @example\n   *\n   * var object = _.create({ 'a': _.create({ 'b': 2 }) });\n   *\n   * _.hasIn(object, 'a');\n   * // => true\n   *\n   * _.hasIn(object, 'a.b');\n   * // => true\n   *\n   * _.hasIn(object, ['a', 'b']);\n   * // => true\n   *\n   * _.hasIn(object, 'b');\n   * // => false\n   */\n  function hasIn(object, path) {\n    return object != null && hasPath(object, path, baseHasIn);\n  }\n\n  /**\n   * Creates an object composed of the inverted keys and values of `object`.\n   * If `object` contains duplicate values, subsequent values overwrite\n   * property assignments of previous values.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.7.0\n   * @category Object\n   * @param {Object} object The object to invert.\n   * @returns {Object} Returns the new inverted object.\n   * @example\n   *\n   * var object = { 'a': 1, 'b': 2, 'c': 1 };\n   *\n   * _.invert(object);\n   * // => { '1': 'c', '2': 'b' }\n   */\n  var invert = createInverter(function(result, value, key) {\n    if (value != null &&\n        typeof value.toString != 'function') {\n      value = nativeObjectToString.call(value);\n    }\n\n    result[value] = key;\n  }, constant(identity));\n\n  /**\n   * This method is like `_.invert` except that the inverted object is generated\n   * from the results of running each element of `object` thru `iteratee`. The\n   * corresponding inverted value of each inverted key is an array of keys\n   * responsible for generating the inverted value. The iteratee is invoked\n   * with one argument: (value).\n   *\n   * @static\n   * @memberOf _\n   * @since 4.1.0\n   * @category Object\n   * @param {Object} object The object to invert.\n   * @param {Function} [iteratee=_.identity] The iteratee invoked per element.\n   * @returns {Object} Returns the new inverted object.\n   * @example\n   *\n   * var object = { 'a': 1, 'b': 2, 'c': 1 };\n   *\n   * _.invertBy(object);\n   * // => { '1': ['a', 'c'], '2': ['b'] }\n   *\n   * _.invertBy(object, function(value) {\n   *   return 'group' + value;\n   * });\n   * // => { 'group1': ['a', 'c'], 'group2': ['b'] }\n   */\n  var invertBy = createInverter(function(result, value, key) {\n    if (value != null &&\n        typeof value.toString != 'function') {\n      value = nativeObjectToString.call(value);\n    }\n\n    if (hasOwnProperty.call(result, value)) {\n      result[value].push(key);\n    } else {\n      result[value] = [key];\n    }\n  }, baseIteratee);\n\n  /**\n   * Creates an array of the own enumerable property names of `object`.\n   *\n   * **Note:** Non-object values are coerced to objects. See the\n   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)\n   * for more details.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Object\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of property names.\n   * @example\n   *\n   * function Foo() {\n   *   this.a = 1;\n   *   this.b = 2;\n   * }\n   *\n   * Foo.prototype.c = 3;\n   *\n   * _.keys(new Foo);\n   * // => ['a', 'b'] (iteration order is not guaranteed)\n   *\n   * _.keys('hi');\n   * // => ['0', '1']\n   */\n  function keys(object) {\n    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);\n  }\n\n  /**\n   * Creates an array of the own and inherited enumerable property names of `object`.\n   *\n   * **Note:** Non-object values are coerced to objects.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Object\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of property names.\n   * @example\n   *\n   * function Foo() {\n   *   this.a = 1;\n   *   this.b = 2;\n   * }\n   *\n   * Foo.prototype.c = 3;\n   *\n   * _.keysIn(new Foo);\n   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)\n   */\n  function keysIn(object) {\n    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);\n  }\n\n  /**\n   * This method is like `_.assign` except that it recursively merges own and\n   * inherited enumerable string keyed properties of source objects into the\n   * destination object. Source properties that resolve to `undefined` are\n   * skipped if a destination value exists. Array and plain object properties\n   * are merged recursively. Other objects and value types are overridden by\n   * assignment. Source objects are applied from left to right. Subsequent\n   * sources overwrite property assignments of previous sources.\n   *\n   * **Note:** This method mutates `object`.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.5.0\n   * @category Object\n   * @param {Object} object The destination object.\n   * @param {...Object} [sources] The source objects.\n   * @returns {Object} Returns `object`.\n   * @example\n   *\n   * var object = {\n   *   'a': [{ 'b': 2 }, { 'd': 4 }]\n   * };\n   *\n   * var other = {\n   *   'a': [{ 'c': 3 }, { 'e': 5 }]\n   * };\n   *\n   * _.merge(object, other);\n   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }\n   */\n  var merge = createAssigner(function(object, source, srcIndex) {\n    baseMerge(object, source, srcIndex);\n  });\n\n  /**\n   * This method is like `_.merge` except that it accepts `customizer` which\n   * is invoked to produce the merged values of the destination and source\n   * properties. If `customizer` returns `undefined`, merging is handled by the\n   * method instead. The `customizer` is invoked with six arguments:\n   * (objValue, srcValue, key, object, source, stack).\n   *\n   * **Note:** This method mutates `object`.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Object\n   * @param {Object} object The destination object.\n   * @param {...Object} sources The source objects.\n   * @param {Function} customizer The function to customize assigned values.\n   * @returns {Object} Returns `object`.\n   * @example\n   *\n   * function customizer(objValue, srcValue) {\n   *   if (_.isArray(objValue)) {\n   *     return objValue.concat(srcValue);\n   *   }\n   * }\n   *\n   * var object = { 'a': [1], 'b': [2] };\n   * var other = { 'a': [3], 'b': [4] };\n   *\n   * _.mergeWith(object, other, customizer);\n   * // => { 'a': [1, 3], 'b': [2, 4] }\n   */\n  var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {\n    baseMerge(object, source, srcIndex, customizer);\n  });\n\n  /**\n   * The opposite of `_.pick`; this method creates an object composed of the\n   * own and inherited enumerable property paths of `object` that are not omitted.\n   *\n   * **Note:** This method is considerably slower than `_.pick`.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Object\n   * @param {Object} object The source object.\n   * @param {...(string|string[])} [paths] The property paths to omit.\n   * @returns {Object} Returns the new object.\n   * @example\n   *\n   * var object = { 'a': 1, 'b': '2', 'c': 3 };\n   *\n   * _.omit(object, ['a', 'c']);\n   * // => { 'b': '2' }\n   */\n  var omit = flatRest(function(object, paths) {\n    var result = {};\n    if (object == null) {\n      return result;\n    }\n    var isDeep = false;\n    paths = arrayMap(paths, function(path) {\n      path = castPath(path, object);\n      isDeep || (isDeep = path.length > 1);\n      return path;\n    });\n    copyObject(object, getAllKeysIn(object), result);\n    if (isDeep) {\n      result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);\n    }\n    var length = paths.length;\n    while (length--) {\n      baseUnset(result, paths[length]);\n    }\n    return result;\n  });\n\n  /**\n   * The opposite of `_.pickBy`; this method creates an object composed of\n   * the own and inherited enumerable string keyed properties of `object` that\n   * `predicate` doesn't return truthy for. The predicate is invoked with two\n   * arguments: (value, key).\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Object\n   * @param {Object} object The source object.\n   * @param {Function} [predicate=_.identity] The function invoked per property.\n   * @returns {Object} Returns the new object.\n   * @example\n   *\n   * var object = { 'a': 1, 'b': '2', 'c': 3 };\n   *\n   * _.omitBy(object, _.isNumber);\n   * // => { 'b': '2' }\n   */\n  function omitBy(object, predicate) {\n    return pickBy(object, negate(baseIteratee(predicate)));\n  }\n\n  /**\n   * Creates an object composed of the picked `object` properties.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Object\n   * @param {Object} object The source object.\n   * @param {...(string|string[])} [paths] The property paths to pick.\n   * @returns {Object} Returns the new object.\n   * @example\n   *\n   * var object = { 'a': 1, 'b': '2', 'c': 3 };\n   *\n   * _.pick(object, ['a', 'c']);\n   * // => { 'a': 1, 'c': 3 }\n   */\n  var pick = flatRest(function(object, paths) {\n    return object == null ? {} : basePick(object, paths);\n  });\n\n  /**\n   * Creates an object composed of the `object` properties `predicate` returns\n   * truthy for. The predicate is invoked with two arguments: (value, key).\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Object\n   * @param {Object} object The source object.\n   * @param {Function} [predicate=_.identity] The function invoked per property.\n   * @returns {Object} Returns the new object.\n   * @example\n   *\n   * var object = { 'a': 1, 'b': '2', 'c': 3 };\n   *\n   * _.pickBy(object, _.isNumber);\n   * // => { 'a': 1, 'c': 3 }\n   */\n  function pickBy(object, predicate) {\n    if (object == null) {\n      return {};\n    }\n    var props = arrayMap(getAllKeysIn(object), function(prop) {\n      return [prop];\n    });\n    predicate = baseIteratee(predicate);\n    return basePickBy(object, props, function(value, path) {\n      return predicate(value, path[0]);\n    });\n  }\n\n  /**\n   * This method is like `_.get` except that if the resolved value is a\n   * function it's invoked with the `this` binding of its parent object and\n   * its result is returned.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Object\n   * @param {Object} object The object to query.\n   * @param {Array|string} path The path of the property to resolve.\n   * @param {*} [defaultValue] The value returned for `undefined` resolved values.\n   * @returns {*} Returns the resolved value.\n   * @example\n   *\n   * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };\n   *\n   * _.result(object, 'a[0].b.c1');\n   * // => 3\n   *\n   * _.result(object, 'a[0].b.c2');\n   * // => 4\n   *\n   * _.result(object, 'a[0].b.c3', 'default');\n   * // => 'default'\n   *\n   * _.result(object, 'a[0].b.c3', _.constant('default'));\n   * // => 'default'\n   */\n  function result(object, path, defaultValue) {\n    path = castPath(path, object);\n\n    var index = -1,\n        length = path.length;\n\n    // Ensure the loop is entered when path is empty.\n    if (!length) {\n      length = 1;\n      object = undefined;\n    }\n    while (++index < length) {\n      var value = object == null ? undefined : object[toKey(path[index])];\n      if (value === undefined) {\n        index = length;\n        value = defaultValue;\n      }\n      object = isFunction(value) ? value.call(object) : value;\n    }\n    return object;\n  }\n\n  /**\n   * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,\n   * it's created. Arrays are created for missing index properties while objects\n   * are created for all other missing properties. Use `_.setWith` to customize\n   * `path` creation.\n   *\n   * **Note:** This method mutates `object`.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.7.0\n   * @category Object\n   * @param {Object} object The object to modify.\n   * @param {Array|string} path The path of the property to set.\n   * @param {*} value The value to set.\n   * @returns {Object} Returns `object`.\n   * @example\n   *\n   * var object = { 'a': [{ 'b': { 'c': 3 } }] };\n   *\n   * _.set(object, 'a[0].b.c', 4);\n   * console.log(object.a[0].b.c);\n   * // => 4\n   *\n   * _.set(object, ['x', '0', 'y', 'z'], 5);\n   * console.log(object.x[0].y.z);\n   * // => 5\n   */\n  function set(object, path, value) {\n    return object == null ? object : baseSet(object, path, value);\n  }\n\n  /**\n   * Creates an array of the own enumerable string keyed property values of `object`.\n   *\n   * **Note:** Non-object values are coerced to objects.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Object\n   * @param {Object} object The object to query.\n   * @returns {Array} Returns the array of property values.\n   * @example\n   *\n   * function Foo() {\n   *   this.a = 1;\n   *   this.b = 2;\n   * }\n   *\n   * Foo.prototype.c = 3;\n   *\n   * _.values(new Foo);\n   * // => [1, 2] (iteration order is not guaranteed)\n   *\n   * _.values('hi');\n   * // => ['h', 'i']\n   */\n  function values(object) {\n    return object == null ? [] : baseValues(object, keys(object));\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Clamps `number` within the inclusive `lower` and `upper` bounds.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.0.0\n   * @category Number\n   * @param {number} number The number to clamp.\n   * @param {number} [lower] The lower bound.\n   * @param {number} upper The upper bound.\n   * @returns {number} Returns the clamped number.\n   * @example\n   *\n   * _.clamp(-10, -5, 5);\n   * // => -5\n   *\n   * _.clamp(10, -5, 5);\n   * // => 5\n   */\n  function clamp(number, lower, upper) {\n    if (upper === undefined) {\n      upper = lower;\n      lower = undefined;\n    }\n    if (upper !== undefined) {\n      upper = toNumber(upper);\n      upper = upper === upper ? upper : 0;\n    }\n    if (lower !== undefined) {\n      lower = toNumber(lower);\n      lower = lower === lower ? lower : 0;\n    }\n    return baseClamp(toNumber(number), lower, upper);\n  }\n\n  /**\n   * Produces a random number between the inclusive `lower` and `upper` bounds.\n   * If only one argument is provided a number between `0` and the given number\n   * is returned. If `floating` is `true`, or either `lower` or `upper` are\n   * floats, a floating-point number is returned instead of an integer.\n   *\n   * **Note:** JavaScript follows the IEEE-754 standard for resolving\n   * floating-point values which can produce unexpected results.\n   *\n   * @static\n   * @memberOf _\n   * @since 0.7.0\n   * @category Number\n   * @param {number} [lower=0] The lower bound.\n   * @param {number} [upper=1] The upper bound.\n   * @param {boolean} [floating] Specify returning a floating-point number.\n   * @returns {number} Returns the random number.\n   * @example\n   *\n   * _.random(0, 5);\n   * // => an integer between 0 and 5\n   *\n   * _.random(5);\n   * // => also an integer between 0 and 5\n   *\n   * _.random(5, true);\n   * // => a floating-point number between 0 and 5\n   *\n   * _.random(1.2, 5.2);\n   * // => a floating-point number between 1.2 and 5.2\n   */\n  function random(lower, upper, floating) {\n    if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {\n      upper = floating = undefined;\n    }\n    if (floating === undefined) {\n      if (typeof upper == 'boolean') {\n        floating = upper;\n        upper = undefined;\n      }\n      else if (typeof lower == 'boolean') {\n        floating = lower;\n        lower = undefined;\n      }\n    }\n    if (lower === undefined && upper === undefined) {\n      lower = 0;\n      upper = 1;\n    }\n    else {\n      lower = toFinite(lower);\n      if (upper === undefined) {\n        upper = lower;\n        lower = 0;\n      } else {\n        upper = toFinite(upper);\n      }\n    }\n    if (lower > upper) {\n      var temp = lower;\n      lower = upper;\n      upper = temp;\n    }\n    if (floating || lower % 1 || upper % 1) {\n      var rand = nativeRandom();\n      return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);\n    }\n    return baseRandom(lower, upper);\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Converts the characters \"&\", \"<\", \">\", '\"', and \"'\" in `string` to their\n   * corresponding HTML entities.\n   *\n   * **Note:** No other characters are escaped. To escape additional\n   * characters use a third-party library like [_he_](https://mths.be/he).\n   *\n   * Though the \">\" character is escaped for symmetry, characters like\n   * \">\" and \"/\" don't need escaping in HTML and have no special meaning\n   * unless they're part of a tag or unquoted attribute value. See\n   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)\n   * (under \"semi-related fun fact\") for more details.\n   *\n   * When working with HTML you should always\n   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce\n   * XSS vectors.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category String\n   * @param {string} [string=''] The string to escape.\n   * @returns {string} Returns the escaped string.\n   * @example\n   *\n   * _.escape('fred, barney, & pebbles');\n   * // => 'fred, barney, &amp; pebbles'\n   */\n  function escape(string) {\n    string = toString(string);\n    return (string && reHasUnescapedHtml.test(string))\n        ? string.replace(reUnescapedHtml, escapeHtmlChar)\n        : string;\n  }\n\n  /**\n   * Removes leading and trailing whitespace or specified characters from `string`.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category String\n   * @param {string} [string=''] The string to trim.\n   * @param {string} [chars=whitespace] The characters to trim.\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\n   * @returns {string} Returns the trimmed string.\n   * @example\n   *\n   * _.trim('  abc  ');\n   * // => 'abc'\n   *\n   * _.trim('-_-abc-_-', '_-');\n   * // => 'abc'\n   *\n   * _.map(['  foo  ', '  bar  '], _.trim);\n   * // => ['foo', 'bar']\n   */\n  function trim(string, chars, guard) {\n    string = toString(string);\n    if (string && (guard || chars === undefined)) {\n      return string.replace(reTrim, '');\n    }\n    if (!string || !(chars = baseToString(chars))) {\n      return string;\n    }\n    var strSymbols = stringToArray(string),\n        chrSymbols = stringToArray(chars),\n        start = charsStartIndex(strSymbols, chrSymbols),\n        end = charsEndIndex(strSymbols, chrSymbols) + 1;\n\n    return castSlice(strSymbols, start, end).join('');\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Creates a function that returns `value`.\n   *\n   * @static\n   * @memberOf _\n   * @since 2.4.0\n   * @category Util\n   * @param {*} value The value to return from the new function.\n   * @returns {Function} Returns the new constant function.\n   * @example\n   *\n   * var objects = _.times(2, _.constant({ 'a': 1 }));\n   *\n   * console.log(objects);\n   * // => [{ 'a': 1 }, { 'a': 1 }]\n   *\n   * console.log(objects[0] === objects[1]);\n   * // => true\n   */\n  function constant(value) {\n    return function() {\n      return value;\n    };\n  }\n\n  /**\n   * This method returns the first argument it receives.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Util\n   * @param {*} value Any value.\n   * @returns {*} Returns `value`.\n   * @example\n   *\n   * var object = { 'a': 1 };\n   *\n   * console.log(_.identity(object) === object);\n   * // => true\n   */\n  function identity(value) {\n    return value;\n  }\n\n  /**\n   * Creates a function that invokes `func` with the arguments of the created\n   * function. If `func` is a property name, the created function returns the\n   * property value for a given element. If `func` is an array or object, the\n   * created function returns `true` for elements that contain the equivalent\n   * source properties, otherwise it returns `false`.\n   *\n   * @static\n   * @since 4.0.0\n   * @memberOf _\n   * @category Util\n   * @param {*} [func=_.identity] The value to convert to a callback.\n   * @returns {Function} Returns the callback.\n   * @example\n   *\n   * var users = [\n   *   { 'user': 'barney', 'age': 36, 'active': true },\n   *   { 'user': 'fred',   'age': 40, 'active': false }\n   * ];\n   *\n   * // The `_.matches` iteratee shorthand.\n   * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));\n   * // => [{ 'user': 'barney', 'age': 36, 'active': true }]\n   *\n   * // The `_.matchesProperty` iteratee shorthand.\n   * _.filter(users, _.iteratee(['user', 'fred']));\n   * // => [{ 'user': 'fred', 'age': 40 }]\n   *\n   * // The `_.property` iteratee shorthand.\n   * _.map(users, _.iteratee('user'));\n   * // => ['barney', 'fred']\n   *\n   * // Create custom iteratee shorthands.\n   * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {\n   *   return !_.isRegExp(func) ? iteratee(func) : function(string) {\n   *     return func.test(string);\n   *   };\n   * });\n   *\n   * _.filter(['abc', 'def'], /ef/);\n   * // => ['def']\n   */\n  function iteratee(func) {\n    return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));\n  }\n\n  /**\n   * Creates a function that performs a partial deep comparison between a given\n   * object and `source`, returning `true` if the given object has equivalent\n   * property values, else `false`.\n   *\n   * **Note:** The created function is equivalent to `_.isMatch` with `source`\n   * partially applied.\n   *\n   * Partial comparisons will match empty array and empty object `source`\n   * values against any array or object value, respectively. See `_.isEqual`\n   * for a list of supported value comparisons.\n   *\n   * @static\n   * @memberOf _\n   * @since 3.0.0\n   * @category Util\n   * @param {Object} source The object of property values to match.\n   * @returns {Function} Returns the new spec function.\n   * @example\n   *\n   * var objects = [\n   *   { 'a': 1, 'b': 2, 'c': 3 },\n   *   { 'a': 4, 'b': 5, 'c': 6 }\n   * ];\n   *\n   * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));\n   * // => [{ 'a': 4, 'b': 5, 'c': 6 }]\n   */\n  function matches(source) {\n    return baseMatches(baseClone(source, CLONE_DEEP_FLAG));\n  }\n\n  /**\n   * Adds all own enumerable string keyed function properties of a source\n   * object to the destination object. If `object` is a function, then methods\n   * are added to its prototype as well.\n   *\n   * **Note:** Use `_.runInContext` to create a pristine `lodash` function to\n   * avoid conflicts caused by modifying the original.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Util\n   * @param {Function|Object} [object=lodash] The destination object.\n   * @param {Object} source The object of functions to add.\n   * @param {Object} [options={}] The options object.\n   * @param {boolean} [options.chain=true] Specify whether mixins are chainable.\n   * @returns {Function|Object} Returns `object`.\n   * @example\n   *\n   * function vowels(string) {\n   *   return _.filter(string, function(v) {\n   *     return /[aeiou]/i.test(v);\n   *   });\n   * }\n   *\n   * _.mixin({ 'vowels': vowels });\n   * _.vowels('fred');\n   * // => ['e']\n   *\n   * _('fred').vowels().value();\n   * // => ['e']\n   *\n   * _.mixin({ 'vowels': vowels }, { 'chain': false });\n   * _('fred').vowels();\n   * // => ['e']\n   */\n  function mixin(object, source, options) {\n    var props = keys(source),\n        methodNames = baseFunctions(source, props);\n\n    if (options == null &&\n        !(isObject(source) && (methodNames.length || !props.length))) {\n      options = source;\n      source = object;\n      object = this;\n      methodNames = baseFunctions(source, keys(source));\n    }\n    var chain = !(isObject(options) && 'chain' in options) || !!options.chain,\n        isFunc = isFunction(object);\n\n    arrayEach(methodNames, function(methodName) {\n      var func = source[methodName];\n      object[methodName] = func;\n      if (isFunc) {\n        object.prototype[methodName] = function() {\n          var chainAll = this.__chain__;\n          if (chain || chainAll) {\n            var result = object(this.__wrapped__),\n                actions = result.__actions__ = copyArray(this.__actions__);\n\n            actions.push({ 'func': func, 'args': arguments, 'thisArg': object });\n            result.__chain__ = chainAll;\n            return result;\n          }\n          return func.apply(object, arrayPush([this.value()], arguments));\n        };\n      }\n    });\n\n    return object;\n  }\n\n  /**\n   * Reverts the `_` variable to its previous value and returns a reference to\n   * the `lodash` function.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Util\n   * @returns {Function} Returns the `lodash` function.\n   * @example\n   *\n   * var lodash = _.noConflict();\n   */\n  function noConflict() {\n    if (root._ === this) {\n      root._ = oldDash;\n    }\n    return this;\n  }\n\n  /**\n   * This method returns `undefined`.\n   *\n   * @static\n   * @memberOf _\n   * @since 2.3.0\n   * @category Util\n   * @example\n   *\n   * _.times(2, _.noop);\n   * // => [undefined, undefined]\n   */\n  function noop() {\n    // No operation performed.\n  }\n\n  /**\n   * Creates a function that returns the value at `path` of a given object.\n   *\n   * @static\n   * @memberOf _\n   * @since 2.4.0\n   * @category Util\n   * @param {Array|string} path The path of the property to get.\n   * @returns {Function} Returns the new accessor function.\n   * @example\n   *\n   * var objects = [\n   *   { 'a': { 'b': 2 } },\n   *   { 'a': { 'b': 1 } }\n   * ];\n   *\n   * _.map(objects, _.property('a.b'));\n   * // => [2, 1]\n   *\n   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');\n   * // => [1, 2]\n   */\n  function property(path) {\n    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);\n  }\n\n  /**\n   * Creates an array of numbers (positive and/or negative) progressing from\n   * `start` up to, but not including, `end`. A step of `-1` is used if a negative\n   * `start` is specified without an `end` or `step`. If `end` is not specified,\n   * it's set to `start` with `start` then set to `0`.\n   *\n   * **Note:** JavaScript follows the IEEE-754 standard for resolving\n   * floating-point values which can produce unexpected results.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Util\n   * @param {number} [start=0] The start of the range.\n   * @param {number} end The end of the range.\n   * @param {number} [step=1] The value to increment or decrement by.\n   * @returns {Array} Returns the range of numbers.\n   * @see _.inRange, _.rangeRight\n   * @example\n   *\n   * _.range(4);\n   * // => [0, 1, 2, 3]\n   *\n   * _.range(-4);\n   * // => [0, -1, -2, -3]\n   *\n   * _.range(1, 5);\n   * // => [1, 2, 3, 4]\n   *\n   * _.range(0, 20, 5);\n   * // => [0, 5, 10, 15]\n   *\n   * _.range(0, -4, -1);\n   * // => [0, -1, -2, -3]\n   *\n   * _.range(1, 4, 0);\n   * // => [1, 1, 1]\n   *\n   * _.range(0);\n   * // => []\n   */\n  var range = createRange();\n\n  /**\n   * This method returns a new empty array.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.13.0\n   * @category Util\n   * @returns {Array} Returns the new empty array.\n   * @example\n   *\n   * var arrays = _.times(2, _.stubArray);\n   *\n   * console.log(arrays);\n   * // => [[], []]\n   *\n   * console.log(arrays[0] === arrays[1]);\n   * // => false\n   */\n  function stubArray() {\n    return [];\n  }\n\n  /**\n   * This method returns `false`.\n   *\n   * @static\n   * @memberOf _\n   * @since 4.13.0\n   * @category Util\n   * @returns {boolean} Returns `false`.\n   * @example\n   *\n   * _.times(2, _.stubFalse);\n   * // => [false, false]\n   */\n  function stubFalse() {\n    return false;\n  }\n\n  /**\n   * Generates a unique ID. If `prefix` is given, the ID is appended to it.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Util\n   * @param {string} [prefix=''] The value to prefix the ID with.\n   * @returns {string} Returns the unique ID.\n   * @example\n   *\n   * _.uniqueId('contact_');\n   * // => 'contact_104'\n   *\n   * _.uniqueId();\n   * // => '105'\n   */\n  function uniqueId(prefix) {\n    var id = ++idCounter;\n    return toString(prefix) + id;\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * Computes the maximum value of `array`. If `array` is empty or falsey,\n   * `undefined` is returned.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Math\n   * @param {Array} array The array to iterate over.\n   * @returns {*} Returns the maximum value.\n   * @example\n   *\n   * _.max([4, 2, 8, 6]);\n   * // => 8\n   *\n   * _.max([]);\n   * // => undefined\n   */\n  function max(array) {\n    return (array && array.length)\n        ? baseExtremum(array, identity, baseGt)\n        : undefined;\n  }\n\n  /**\n   * Computes the minimum value of `array`. If `array` is empty or falsey,\n   * `undefined` is returned.\n   *\n   * @static\n   * @since 0.1.0\n   * @memberOf _\n   * @category Math\n   * @param {Array} array The array to iterate over.\n   * @returns {*} Returns the minimum value.\n   * @example\n   *\n   * _.min([4, 2, 8, 6]);\n   * // => 2\n   *\n   * _.min([]);\n   * // => undefined\n   */\n  function min(array) {\n    return (array && array.length)\n        ? baseExtremum(array, identity, baseLt)\n        : undefined;\n  }\n\n  /*------------------------------------------------------------------------*/\n\n  // Add methods that return wrapped values in chain sequences.\n  lodash.after = after;\n  lodash.assignIn = assignIn;\n  lodash.before = before;\n  lodash.bind = bind;\n  lodash.chain = chain;\n  lodash.compact = compact;\n  lodash.concat = concat;\n  lodash.countBy = countBy;\n  lodash.create = create;\n  lodash.debounce = debounce;\n  lodash.defaults = defaults;\n  lodash.defaultsDeep = defaultsDeep;\n  lodash.defer = defer;\n  lodash.delay = delay;\n  lodash.difference = difference;\n  lodash.drop = drop;\n  lodash.filter = filter;\n  lodash.flatten = flatten;\n  lodash.flattenDeep = flattenDeep;\n  lodash.groupBy = groupBy;\n  lodash.initial = initial;\n  lodash.intersection = intersection;\n  lodash.invert = invert;\n  lodash.invertBy = invertBy;\n  lodash.iteratee = iteratee;\n  lodash.keys = keys;\n  lodash.map = map;\n  lodash.matches = matches;\n  lodash.merge = merge;\n  lodash.mixin = mixin;\n  lodash.negate = negate;\n  lodash.omit = omit;\n  lodash.omitBy = omitBy;\n  lodash.once = once;\n  lodash.pick = pick;\n  lodash.range = range;\n  lodash.reject = reject;\n  lodash.rest = rest;\n  lodash.set = set;\n  lodash.slice = slice;\n  lodash.sortBy = sortBy;\n  lodash.take = take;\n  lodash.takeRight = takeRight;\n  lodash.tap = tap;\n  lodash.throttle = throttle;\n  lodash.thru = thru;\n  lodash.toArray = toArray;\n  lodash.union = union;\n  lodash.uniq = uniq;\n  lodash.uniqBy = uniqBy;\n  lodash.unzip = unzip;\n  lodash.values = values;\n  lodash.without = without;\n  lodash.zip = zip;\n  lodash.zipObject = zipObject;\n\n  // Add aliases.\n  lodash.extend = assignIn;\n\n  // Add methods to `lodash.prototype`.\n  mixin(lodash, lodash);\n\n  /*------------------------------------------------------------------------*/\n\n  // Add methods that return unwrapped values in chain sequences.\n  lodash.clamp = clamp;\n  lodash.clone = clone;\n  lodash.cloneDeep = cloneDeep;\n  lodash.escape = escape;\n  lodash.every = every;\n  lodash.find = find;\n  lodash.findIndex = findIndex;\n  lodash.findKey = findKey;\n  lodash.findLastIndex = findLastIndex;\n  lodash.findLastKey = findLastKey;\n  lodash.forEach = forEach;\n  lodash.get = get;\n  lodash.has = has;\n  lodash.head = head;\n  lodash.identity = identity;\n  lodash.indexOf = indexOf;\n  lodash.isArguments = isArguments;\n  lodash.isArray = isArray;\n  lodash.isArrayLike = isArrayLike;\n  lodash.isBoolean = isBoolean;\n  lodash.isDate = isDate;\n  lodash.isEmpty = isEmpty;\n  lodash.isEqual = isEqual;\n  lodash.isFinite = isFinite;\n  lodash.isFunction = isFunction;\n  lodash.isNaN = isNaN;\n  lodash.isNull = isNull;\n  lodash.isNumber = isNumber;\n  lodash.isObject = isObject;\n  lodash.isPlainObject = isPlainObject;\n  lodash.isRegExp = isRegExp;\n  lodash.isString = isString;\n  lodash.isUndefined = isUndefined;\n  lodash.last = last;\n  lodash.max = max;\n  lodash.min = min;\n  lodash.noConflict = noConflict;\n  lodash.noop = noop;\n  lodash.random = random;\n  lodash.reduce = reduce;\n  lodash.result = result;\n  lodash.size = size;\n  lodash.some = some;\n  lodash.trim = trim;\n  lodash.uniqueId = uniqueId;\n\n  // Add aliases.\n  lodash.each = forEach;\n  lodash.first = head;\n\n  mixin(lodash, (function() {\n    var source = {};\n    baseForOwn(lodash, function(func, methodName) {\n      if (!hasOwnProperty.call(lodash.prototype, methodName)) {\n        source[methodName] = func;\n      }\n    });\n    return source;\n  }()), { 'chain': false });\n\n  /*------------------------------------------------------------------------*/\n\n  /**\n   * The semantic version number.\n   *\n   * @static\n   * @memberOf _\n   * @type {string}\n   */\n  lodash.VERSION = VERSION;\n\n  // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.\n  arrayEach(['drop', 'take'], function(methodName, index) {\n    LazyWrapper.prototype[methodName] = function(n) {\n      n = n === undefined ? 1 : nativeMax(toInteger(n), 0);\n\n      var result = (this.__filtered__ && !index)\n          ? new LazyWrapper(this)\n          : this.clone();\n\n      if (result.__filtered__) {\n        result.__takeCount__ = nativeMin(n, result.__takeCount__);\n      } else {\n        result.__views__.push({\n          'size': nativeMin(n, MAX_ARRAY_LENGTH),\n          'type': methodName + (result.__dir__ < 0 ? 'Right' : '')\n        });\n      }\n      return result;\n    };\n\n    LazyWrapper.prototype[methodName + 'Right'] = function(n) {\n      return this.reverse()[methodName](n).reverse();\n    };\n  });\n\n  // Add `LazyWrapper` methods that accept an `iteratee` value.\n  arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {\n    var type = index + 1,\n        isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;\n\n    LazyWrapper.prototype[methodName] = function(iteratee) {\n      var result = this.clone();\n      result.__iteratees__.push({\n        'iteratee': getIteratee(iteratee, 3),\n        'type': type\n      });\n      result.__filtered__ = result.__filtered__ || isFilter;\n      return result;\n    };\n  });\n\n  // Add `LazyWrapper` methods for `_.head` and `_.last`.\n  arrayEach(['head', 'last'], function(methodName, index) {\n    var takeName = 'take' + (index ? 'Right' : '');\n\n    LazyWrapper.prototype[methodName] = function() {\n      return this[takeName](1).value()[0];\n    };\n  });\n\n  // Add `LazyWrapper` methods for `_.initial` and `_.tail`.\n  arrayEach(['initial', 'tail'], function(methodName, index) {\n    var dropName = 'drop' + (index ? '' : 'Right');\n\n    LazyWrapper.prototype[methodName] = function() {\n      return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);\n    };\n  });\n\n  LazyWrapper.prototype.compact = function() {\n    return this.filter(identity);\n  };\n\n  LazyWrapper.prototype.find = function(predicate) {\n    return this.filter(predicate).head();\n  };\n\n  LazyWrapper.prototype.findLast = function(predicate) {\n    return this.reverse().find(predicate);\n  };\n\n  LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {\n    if (typeof path == 'function') {\n      return new LazyWrapper(this);\n    }\n    return this.map(function(value) {\n      return baseInvoke(value, path, args);\n    });\n  });\n\n  LazyWrapper.prototype.reject = function(predicate) {\n    return this.filter(negate(getIteratee(predicate)));\n  };\n\n  LazyWrapper.prototype.slice = function(start, end) {\n    start = toInteger(start);\n\n    var result = this;\n    if (result.__filtered__ && (start > 0 || end < 0)) {\n      return new LazyWrapper(result);\n    }\n    if (start < 0) {\n      result = result.takeRight(-start);\n    } else if (start) {\n      result = result.drop(start);\n    }\n    if (end !== undefined) {\n      end = toInteger(end);\n      result = end < 0 ? result.dropRight(-end) : result.take(end - start);\n    }\n    return result;\n  };\n\n  LazyWrapper.prototype.takeRightWhile = function(predicate) {\n    return this.reverse().takeWhile(predicate).reverse();\n  };\n\n  LazyWrapper.prototype.toArray = function() {\n    return this.take(MAX_ARRAY_LENGTH);\n  };\n\n  // Add `LazyWrapper` methods to `lodash.prototype`.\n  baseForOwn(LazyWrapper.prototype, function(func, methodName) {\n    var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),\n        isTaker = /^(?:head|last)$/.test(methodName),\n        lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],\n        retUnwrapped = isTaker || /^find/.test(methodName);\n\n    if (!lodashFunc) {\n      return;\n    }\n    lodash.prototype[methodName] = function() {\n      var value = this.__wrapped__,\n          args = isTaker ? [1] : arguments,\n          isLazy = value instanceof LazyWrapper,\n          iteratee = args[0],\n          useLazy = isLazy || isArray(value);\n\n      var interceptor = function(value) {\n        var result = lodashFunc.apply(lodash, arrayPush([value], args));\n        return (isTaker && chainAll) ? result[0] : result;\n      };\n\n      if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {\n        // Avoid lazy use if the iteratee has a \"length\" value other than `1`.\n        isLazy = useLazy = false;\n      }\n      var chainAll = this.__chain__,\n          isHybrid = !!this.__actions__.length,\n          isUnwrapped = retUnwrapped && !chainAll,\n          onlyLazy = isLazy && !isHybrid;\n\n      if (!retUnwrapped && useLazy) {\n        value = onlyLazy ? value : new LazyWrapper(this);\n        var result = func.apply(value, args);\n        result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });\n        return new LodashWrapper(result, chainAll);\n      }\n      if (isUnwrapped && onlyLazy) {\n        return func.apply(this, args);\n      }\n      result = this.thru(interceptor);\n      return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;\n    };\n  });\n\n  // Add `Array` methods to `lodash.prototype`.\n  arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {\n    var func = arrayProto[methodName],\n        chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',\n        retUnwrapped = /^(?:pop|shift)$/.test(methodName);\n\n    lodash.prototype[methodName] = function() {\n      var args = arguments;\n      if (retUnwrapped && !this.__chain__) {\n        var value = this.value();\n        return func.apply(isArray(value) ? value : [], args);\n      }\n      return this[chainName](function(value) {\n        return func.apply(isArray(value) ? value : [], args);\n      });\n    };\n  });\n\n  // Map minified method names to their real names.\n  baseForOwn(LazyWrapper.prototype, function(func, methodName) {\n    var lodashFunc = lodash[methodName];\n    if (lodashFunc) {\n      var key = (lodashFunc.name + ''),\n          names = realNames[key] || (realNames[key] = []);\n\n      names.push({ 'name': methodName, 'func': lodashFunc });\n    }\n  });\n\n  realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{\n    'name': 'wrapper',\n    'func': undefined\n  }];\n\n  // Add methods to `LazyWrapper`.\n  LazyWrapper.prototype.clone = lazyClone;\n  LazyWrapper.prototype.reverse = lazyReverse;\n  LazyWrapper.prototype.value = lazyValue;\n\n  // Add lazy aliases.\n  lodash.prototype.first = lodash.prototype.head;\n\n  if (symIterator) {\n    lodash.prototype[symIterator] = wrapperToIterator;\n  }\n\n  /*--------------------------------------------------------------------------*/\n\n  // Some AMD build optimizers, like r.js, check for condition patterns like:\n  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {\n    // Expose Lodash on the global object to prevent errors when Lodash is\n    // loaded by a script tag in the presence of an AMD loader.\n    // See http://requirejs.org/docs/errors.html#mismatch for more details.\n    // Use `_.noConflict` to remove Lodash from the global object.\n    root._ = lodash;\n\n    // Define as an anonymous module so, through path mapping, it can be\n    // referenced as the \"underscore\" module.\n    define(function() {\n      return lodash;\n    });\n  }\n  // Check for `exports` after `define` in case a build optimizer adds it.\n  else if (freeModule) {\n    // Export for Node.js.\n    (freeModule.exports = lodash)._ = lodash;\n    // Export for CommonJS support.\n    freeExports._ = lodash;\n  }\n  else {\n    // Export to the global object.\n    root._ = lodash;\n  }\n}.call(this));\n"

/***/ }),

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/**
 * 基本函数
 * Create By GUY 2014\11\17
 *
 */
_global = undefined;
if (typeof window !== "undefined") {
    _global = window;
} else if (typeof global !== "undefined") {
    _global = global;
} else if (typeof self !== "undefined") {
    _global = self;
} else {
    _global = this;
}
if (!_global.BI) {
    _global.BI = {};
}

!(function (undefined) {
    var traverse = function (func, context) {
        return function (value, key, obj) {
            return func.call(context, key, value, obj);
        };
    };
    var _apply = function (name) {
        return function () {
            return _[name].apply(_, arguments);
        };
    };
    var _applyFunc = function (name) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args[1] = _.isFunction(args[1]) ? traverse(args[1], args[2]) : args[1];
            return _[name].apply(_, args);
        };
    };

    // Utility
    _.extend(BI, {
        assert: function (v, is) {
            if (this.isFunction(is)) {
                if (!is(v)) {
                    throw new Error(v + " error");
                } else {
                    return true;
                }
            }
            if (!this.isArray(is)) {
                is = [is];
            }
            if (!this.deepContains(is, v)) {
                throw new Error(v + " error");
            }
            return true;
        },

        warn: function (message) {
            console.warn(message);
        },

        UUID: function () {
            var f = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            var str = "";
            for (var i = 0; i < 16; i++) {
                var r = parseInt(f.length * Math.random(), 10);
                str += f[r];
            }
            return str;
        },

        isWidget: function (widget) {
            return widget instanceof BI.Widget || (BI.View && widget instanceof BI.View);
        },

        createWidgets: function (items, options, context) {
            if (!BI.isArray(items)) {
                throw new Error("cannot create Widgets");
            }
            if (BI.isWidget(options)) {
                context = options;
                options = {};
            } else {
                options || (options = {});
            }
            return BI.map(BI.flatten(items), function (i, item) {
                return BI.createWidget(item, BI.deepClone(options));
            });
        },

        createItems: function (data, innerAttr, outerAttr) {
            innerAttr = BI.isArray(innerAttr) ? innerAttr : BI.makeArray(BI.flatten(data).length, innerAttr || {});
            outerAttr = BI.isArray(outerAttr) ? outerAttr : BI.makeArray(BI.flatten(data).length, outerAttr || {});
            return BI.map(data, function (i, item) {
                if (BI.isArray(item)) {
                    return BI.createItems(item, innerAttr, outerAttr);
                }
                if (item instanceof BI.Widget) {
                    return BI.extend({}, innerAttr.shift(), outerAttr.shift(), {
                        type: null,
                        el: item
                    });
                }
                if (innerAttr[0] instanceof BI.Widget) {
                    outerAttr.shift();
                    return BI.extend({}, item, {
                        el: innerAttr.shift()
                    });
                }
                if (item.el instanceof BI.Widget || (BI.View && item.el instanceof BI.View)) {
                    innerAttr.shift();
                    return BI.extend({}, outerAttr.shift(), { type: null }, item);
                }
                if (item.el) {
                    return BI.extend({}, outerAttr.shift(), item, {
                        el: BI.extend({}, innerAttr.shift(), item.el)
                    });
                }
                return BI.extend({}, outerAttr.shift(), {
                    el: BI.extend({}, innerAttr.shift(), item)
                });
            });
        },

        // 用容器包装items
        packageItems: function (items, layouts) {
            for (var i = layouts.length - 1; i >= 0; i--) {
                items = BI.map(items, function (k, it) {
                    return BI.extend({}, layouts[i], {
                        items: [
                            BI.extend({}, layouts[i].el, {
                                el: it
                            })
                        ]
                    });
                });
            }
            return items;
        },

        formatEL: function (obj) {
            if (obj && !obj.type && obj.el) {
                return obj;
            }
            return {
                el: obj
            };
        },

        // 剥开EL
        stripEL: function (obj) {
            return obj.type && obj || obj.el || obj;
        },

        trans2Element: function (widgets) {
            return BI.map(widgets, function (i, wi) {
                return wi.element;
            });
        }
    });

    // 集合相关方法
    _.each(["where", "findWhere", "invoke", "pluck", "shuffle", "sample", "toArray", "size"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["get", "set", "each", "map", "reduce", "reduceRight", "find", "filter", "reject", "every", "all", "some", "any", "max", "min",
        "sortBy", "groupBy", "indexBy", "countBy", "partition", "clamp"], function (name) {
        if (name === "any") {
            BI[name] = _applyFunc("some");
        } else {
            BI[name] = _applyFunc(name);
        }
    });
    _.extend(BI, {
        // 数数
        count: function (from, to, predicate) {
            var t;
            if (predicate) {
                for (t = from; t < to; t++) {
                    predicate(t);
                }
            }
            return to - from;
        },

        // 倒数
        inverse: function (from, to, predicate) {
            return BI.count(to, from, predicate);
        },

        firstKey: function (obj) {
            var res = undefined;
            BI.any(obj, function (key, value) {
                res = key;
                return true;
            });
            return res;
        },

        lastKey: function (obj) {
            var res = undefined;
            BI.each(obj, function (key, value) {
                res = key;
                return true;
            });
            return res;
        },

        firstObject: function (obj) {
            var res = undefined;
            BI.any(obj, function (key, value) {
                res = value;
                return true;
            });
            return res;
        },

        lastObject: function (obj) {
            var res = undefined;
            BI.each(obj, function (key, value) {
                res = value;
                return true;
            });
            return res;
        },

        concat: function (obj1, obj2) {
            if (BI.isKey(obj1)) {
                return BI.map([].slice.apply(arguments), function (idx, v) {
                    return v;
                }).join("");
            }
            if (BI.isArray(obj1)) {
                return _.concat.apply([], arguments);
            }
            if (BI.isObject(obj1)) {
                return _.extend.apply({}, arguments);
            }
        },

        backEach: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                predicate(index, obj[index], obj);
            }
            return false;
        },

        backAny: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                if (predicate(index, obj[index], obj)) {
                    return true;
                }
            }
            return false;
        },

        backEvery: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                if (!predicate(index, obj[index], obj)) {
                    return false;
                }
            }
            return true;
        },

        backFindKey: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            var keys = _.keys(obj), key;
            for (var i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
                if (predicate(obj[key], key, obj)) {
                    return key;
                }
            }
        },

        backFind: function (obj, predicate, context) {
            var key;
            if (BI.isArray(obj)) {
                key = BI.findLastIndex(obj, predicate, context);
            } else {
                key = BI.backFindKey(obj, predicate, context);
            }
            if (key !== void 0 && key !== -1) {
                return obj[key];
            }
        },

        remove: function (obj, target, context) {
            var isFunction = BI.isFunction(target);
            target = isFunction || BI.isArray(target) ? target : [target];
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if ((isFunction && target.apply(context, [i, obj[i]]) === true) || (!isFunction && BI.contains(target, obj[i]))) {
                        obj.splice(i--, 1);
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if ((isFunction && target.apply(context, [i, obj[i]]) === true) || (!isFunction && BI.contains(target, obj[i]))) {
                        delete obj[i];
                    }
                });
            }
        },

        removeAt: function (obj, index) {
            index = BI.isArray(index) ? index : [index];
            var isArray = BI.isArray(obj), i;
            for (i = 0; i < index.length; i++) {
                if (isArray) {
                    obj[index[i]] = "$deleteIndex";
                } else {
                    delete obj[index[i]];
                }
            }
            if (isArray) {
                BI.remove(obj, "$deleteIndex");
            }
        },

        string2Array: function (str) {
            return str.split("&-&");
        },

        array2String: function (array) {
            return array.join("&-&");
        },

        abc2Int: function (str) {
            var idx = 0, start = "A", str = str.toUpperCase();
            for (var i = 0, len = str.length; i < len; ++i) {
                idx = str.charAt(i).charCodeAt(0) - start.charCodeAt(0) + 26 * idx + 1;
                if (idx > (2147483646 - str.charAt(i).charCodeAt(0) + start.charCodeAt(0)) / 26) {
                    return 0;
                }
            }
            return idx;
        },

        int2Abc: function (num) {
            var DIGITS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            var idx = num, str = "";
            if (num === 0) {
                return "";
            }
            while (idx !== 0) {
                var t = idx % 26;
                if (t === 0) {
                    t = 26;
                }
                str = DIGITS[t - 1] + str;
                idx = (idx - t) / 26;
            }
            return str;
        }
    });

    // 数组相关的方法
    _.each(["first", "initial", "last", "rest", "compact", "flatten", "without", "union", "intersection",
        "difference", "zip", "unzip", "object", "indexOf", "lastIndexOf", "sortedIndex", "range", "take", "takeRight", "uniqBy"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["findIndex", "findLastIndex"], function (name) {
        BI[name] = _applyFunc(name);
    });
    _.extend(BI, {
        // 构建一个长度为length的数组
        makeArray: function (length, value) {
            var res = [];
            for (var i = 0; i < length; i++) {
                if (BI.isNull(value)) {
                    res.push(i);
                } else {
                    res.push(BI.deepClone(value));
                }
            }
            return res;
        },

        makeObject: function (array, value) {
            var map = {};
            for (var i = 0; i < array.length; i++) {
                if (BI.isNull(value)) {
                    map[array[i]] = array[i];
                } else if (BI.isFunction(value)) {
                    map[array[i]] = value(i, array[i]);
                } else {
                    map[array[i]] = BI.deepClone(value);
                }
            }
            return map;
        },

        makeArrayByArray: function (array, value) {
            var res = [];
            if (!array) {
                return res;
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (BI.isArray(array[i])) {
                    res.push(arguments.callee(array[i], value));
                } else {
                    res.push(BI.deepClone(value));
                }
            }
            return res;
        },

        uniq: function (array, isSorted, iteratee, context) {
            if (array == null) {
                return [];
            }
            if (!_.isBoolean(isSorted)) {
                context = iteratee;
                iteratee = isSorted;
                isSorted = false;
            }
            iteratee && (iteratee = traverse(iteratee, context));
            return _.uniq.call(_, array, isSorted, iteratee, context);
        }
    });

    // 对象相关方法
    _.each(["keys", "allKeys", "values", "pairs", "invert", "create", "functions", "extend", "extendOwn",
        "defaults", "clone", "property", "propertyOf", "matcher", "isEqual", "isMatch", "isEmpty",
        "isElement", "isNumber", "isString", "isArray", "isObject", "isPlainObject", "isArguments", "isFunction", "isFinite",
        "isBoolean", "isDate", "isRegExp", "isError", "isNaN", "isUndefined", "zipObject", "cloneDeep"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["mapObject", "findKey", "pick", "omit", "tap"], function (name) {
        BI[name] = _applyFunc(name);
    });
    _.extend(BI, {

        inherit: function (sb, sp, overrides) {
            if (typeof sp === "object") {
                overrides = sp;
                sp = sb;
                sb = function () {
                    return sp.apply(this, arguments);
                };
            }
            var F = function () {
            }, spp = sp.prototype;
            F.prototype = spp;
            sb.prototype = new F();
            sb.superclass = spp;
            _.extend(sb.prototype, overrides, {
                superclass: sp
            });
            return sb;
        },

        init: function () {
            // 先把准备环境准备好
            while (BI.prepares && BI.prepares.length > 0) {
                BI.prepares.shift()();
            }
            while (_global.___fineuiExposedFunction && _global.___fineuiExposedFunction.length > 0) {
                _global.___fineuiExposedFunction.shift()();
            }
            BI.initialized = true;
        },

        has: function (obj, keys) {
            if (BI.isArray(keys)) {
                if (keys.length === 0) {
                    return false;
                }
                return BI.every(keys, function (i, key) {
                    return _.has(obj, key);
                });
            }
            return _.has.apply(_, arguments);
        },

        freeze: function (value) {
            // 在ES5中，如果这个方法的参数不是一个对象（一个原始值），那么它会导致 TypeError
            // 在ES2015中，非对象参数将被视为要被冻结的普通对象，并被简单地返回
            if (Object.freeze && BI.isObject(value)) {
                return Object.freeze(value);
            }
            return value;
        },

        // 数字和字符串可以作为key
        isKey: function (key) {
            return BI.isNumber(key) || (BI.isString(key) && key.length > 0);
        },

        // 忽略大小写的等于
        isCapitalEqual: function (a, b) {
            a = BI.isNull(a) ? a : ("" + a).toLowerCase();
            b = BI.isNull(b) ? b : ("" + b).toLowerCase();
            return BI.isEqual(a, b);
        },

        isWidthOrHeight: function (w) {
            if (typeof w === "number") {
                return w >= 0;
            } else if (typeof w === "string") {
                return /^\d{1,3}%$/.exec(w) || w == "auto" || /^\d+px$/.exec(w);
            }
        },

        isNotNull: function (obj) {
            return !BI.isNull(obj);
        },

        isNull: function (obj) {
            return typeof obj === "undefined" || obj === null;
        },

        isEmptyArray: function (arr) {
            return BI.isArray(arr) && BI.isEmpty(arr);
        },

        isNotEmptyArray: function (arr) {
            return BI.isArray(arr) && !BI.isEmpty(arr);
        },

        isEmptyObject: function (obj) {
            return BI.isEqual(obj, {});
        },

        isNotEmptyObject: function (obj) {
            return BI.isPlainObject(obj) && !BI.isEmptyObject(obj);
        },

        isEmptyString: function (obj) {
            return BI.isString(obj) && obj.length === 0;
        },

        isNotEmptyString: function (obj) {
            return BI.isString(obj) && !BI.isEmptyString(obj);
        },

        isWindow: function (obj) {
            return obj != null && obj == obj.window;
        }
    });

    // deep方法
    _.extend(BI, {
        deepClone: _.cloneDeep,
        deepExtend: _.merge,

        isDeepMatch: function (object, attrs) {
            var keys = BI.keys(attrs), length = keys.length;
            if (object == null) {
                return !length;
            }
            var obj = Object(object);
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (!BI.isEqual(attrs[key], obj[key]) || !(key in obj)) {
                    return false;
                }
            }
            return true;
        },

        contains: function (obj, target, fromIndex) {
            if (!_.isArrayLike(obj)) obj = _.values(obj);
            return _.indexOf(obj, target, typeof fromIndex === "number" && fromIndex) >= 0;
        },

        deepContains: function (obj, copy) {
            if (BI.isObject(copy)) {
                return BI.any(obj, function (i, v) {
                    if (BI.isEqual(v, copy)) {
                        return true;
                    }
                });
            }
            return BI.contains(obj, copy);
        },

        deepIndexOf: function (obj, target) {
            for (var i = 0; i < obj.length; i++) {
                if (BI.isEqual(target, obj[i])) {
                    return i;
                }
            }
            return -1;
        },

        deepRemove: function (obj, target) {
            var done = false;
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if (BI.isEqual(target, obj[i])) {
                        obj.splice(i--, 1);
                        done = true;
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if (BI.isEqual(target, obj[i])) {
                        delete obj[i];
                        done = true;
                    }
                });
            }
            return done;
        },

        deepWithout: function (obj, target) {
            if (BI.isArray(obj)) {
                var result = [];
                for (var i = 0; i < obj.length; i++) {
                    if (!BI.isEqual(target, obj[i])) {
                        result.push(obj[i]);
                    }
                }
                return result;
            }
            var result = {};
            BI.each(obj, function (i, v) {
                if (!BI.isEqual(target, obj[i])) {
                    result[i] = v;
                }
            });
            return result;

        },

        deepUnique: function (array) {
            var result = [];
            BI.each(array, function (i, item) {
                if (!BI.deepContains(result, item)) {
                    result.push(item);
                }
            });
            return result;
        },

        // 比较两个对象得出不一样的key值
        deepDiff: function (object, other) {
            object || (object = {});
            other || (other = {});
            var result = [];
            var used = [];
            for (var b in object) {
                if (this.has(object, b)) {
                    if (!this.isEqual(object[b], other[b])) {
                        result.push(b);
                    }
                    used.push(b);
                }
            }
            for (var b in other) {
                if (this.has(other, b) && !BI.contains(used, b)) {
                    result.push(b);
                }
            }
            return result;
        }
    });

    // 通用方法
    _.each(["uniqueId", "result", "chain", "iteratee", "escape", "unescape", "before", "after"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        };
    });

    // 事件相关方法
    _.each(["bind", "once", "partial", "debounce", "throttle", "delay", "defer", "wrap"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        };
    });

    _.extend(BI, {
        nextTick: (function () {
            var callbacks = [];
            var pending = false;
            var timerFunc = void 0;

            function nextTickHandler() {
                pending = false;
                var copies = callbacks.slice(0);
                callbacks.length = 0;
                for (var i = 0; i < copies.length; i++) {
                    copies[i]();
                }
            }

            if (typeof Promise !== "undefined") {
                var p = Promise.resolve();
                timerFunc = function timerFunc() {
                    p.then(nextTickHandler);
                };
            } else if (typeof MutationObserver !== "undefined") {
                var counter = 1;
                var observer = new MutationObserver(nextTickHandler);
                var textNode = document.createTextNode(String(counter));
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function timerFunc() {
                    counter = (counter + 1) % 2;
                    textNode.data = String(counter);
                };
            } else if (typeof setImmediate !== "undefined") {
                timerFunc = function timerFunc() {
                    setImmediate(nextTickHandler);
                };
            } else {
                // Fallback to setTimeout.
                timerFunc = function timerFunc() {
                    setTimeout(nextTickHandler, 0);
                };
            }

            return function queueNextTick(cb) {
                var _resolve = void 0;
                var args = [].slice.call(arguments, 1);
                callbacks.push(function () {
                    if (cb) {
                        try {
                            cb.apply(null, args);
                        } catch (e) {
                            console.error(e);
                        }
                    } else if (_resolve) {
                        _resolve.apply(null, args);
                    }
                });
                if (!pending) {
                    pending = true;
                    timerFunc();
                }
                // $flow-disable-line
                if (!cb && typeof Promise !== 'undefined') {
                    return new Promise(function (resolve, reject) {
                        _resolve = resolve;
                    });
                }
            };
        })()
    });

    // 数字相关方法
    _.each(["random"], function (name) {
        BI[name] = _apply(name);
    });
    _.extend(BI, {
        getTime: function () {
            if (_global.performance && _global.performance.now) {
                return _global.performance.now();
            }
            if (_global.performance && _global.performance.webkitNow) {
                return _global.performance.webkitNow();
            }
            if (Date.now) {
                return Date.now();
            }
            return BI.getDate().getTime();


        },

        parseInt: function (number) {
            var radix = 10;
            if (/^0x/g.test(number)) {
                radix = 16;
            }
            try {
                return parseInt(number, radix);
            } catch (e) {
                throw new Error(number + "parse int error");
                return NaN;
            }
        },

        parseSafeInt: function (value) {
            var MAX_SAFE_INTEGER = 9007199254740991;
            return value
                ? this.clamp(this.parseInt(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
                : (value === 0 ? value : 0);
        },

        parseFloat: function (number) {
            try {
                return parseFloat(number);
            } catch (e) {
                throw new Error(number + "parse float error");
                return NaN;
            }
        },

        isNaturalNumber: function (number) {
            if (/^\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isPositiveInteger: function (number) {
            if (/^\+?[1-9][0-9]*$/.test(number)) {
                return true;
            }
            return false;
        },

        isNegativeInteger: function (number) {
            if (/^\-[1-9][0-9]*$/.test(number)) {
                return true;
            }
            return false;
        },

        isInteger: function (number) {
            if (/^\-?\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isNumeric: function (number) {
            return !isNaN(parseFloat(number)) && isFinite(number);
        },

        isFloat: function (number) {
            if (/^([+-]?)\d*\.\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isOdd: function (number) {
            if (!BI.isInteger(number)) {
                return false;
            }
            return (number & 1) === 1;
        },

        isEven: function (number) {
            if (!BI.isInteger(number)) {
                return false;
            }
            return (number & 1) === 0;
        },

        sum: function (array, iteratee, context) {
            var sum = 0;
            BI.each(array, function (i, item) {
                if (iteratee) {
                    sum += Number(iteratee.apply(context, [i, item]));
                } else {
                    sum += Number(item);
                }
            });
            return sum;
        },

        average: function (array, iteratee, context) {
            var sum = BI.sum(array, iteratee, context);
            return sum / array.length;
        }
    });

    // 字符串相关方法
    _.extend(BI, {
        trim: function () {
            return _.trim.apply(_, arguments);
        },

        toUpperCase: function (string) {
            return (string + "").toLocaleUpperCase();
        },

        toLowerCase: function (string) {
            return (string + "").toLocaleLowerCase();
        },

        isEndWithBlank: function (string) {
            return /(\s|\u00A0)$/.test(string);
        },

        isLiteral: function (exp) {
            var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;
            return literalValueRE.test(exp);
        },

        stripQuotes: function (str) {
            var a = str.charCodeAt(0);
            var b = str.charCodeAt(str.length - 1);
            return a === b && (a === 0x22 || a === 0x27)
                ? str.slice(1, -1)
                : str;
        },

        // background-color => backgroundColor
        camelize: function (str) {
            return str.replace(/-(.)/g, function (_, character) {
                return character.toUpperCase();
            });
        },

        // backgroundColor => background-color
        hyphenate: function (str) {
            return str.replace(/([A-Z])/g, "-$1").toLowerCase();
        },

        isNotEmptyString: function (str) {
            return BI.isString(str) && !BI.isEmpty(str);
        },

        isEmptyString: function (str) {
            return BI.isString(str) && BI.isEmpty(str);
        },

        /**
         * 通用加密方法
         */
        encrypt: function (type, text, key) {
            switch (type) {
                case BI.CRYPT_TYPE.AES:
                default:
                    return BI.aesEncrypt(text, key);
            }
        },

        /**
         * 通用解密方法
         * @param type 解密方式
         * @param text 文本
         * @param key 种子
         * @return {*}
         */
        decrypt: function (type, text, key) {
            switch (type) {
                case BI.CRYPT_TYPE.AES:
                default:
                    return BI.aesDecrypt(text, key);
            }
        },

        /**
         * 对字符串中的'和\做编码处理
         * @static
         * @param {String} string 要做编码处理的字符串
         * @return {String} 编码后的字符串
         */
        escape: function (string) {
            return string.replace(/('|\\)/g, "\\$1");
        },

        /**
         * 让字符串通过指定字符做补齐的函数
         *
         *      var s = BI.leftPad('123', 5, '0');//s的值为：'00123'
         *
         * @static
         * @param {String} val 原始值
         * @param {Number} size 总共需要的位数
         * @param {String} ch 用于补齐的字符
         * @return {String}  补齐后的字符串
         */
        leftPad: function (val, size, ch) {
            var result = String(val);
            if (!ch) {
                ch = " ";
            }
            while (result.length < size) {
                result = ch + result;
            }
            return result.toString();
        },

        /**
         * 对字符串做替换的函数
         *
         *      var cls = 'my-class', text = 'Some text';
         *      var res = BI.format('<div class="{0}">{1}</div>', cls, text);
         *      //res的值为：'<div class="my-class">Some text</div>';
         *
         * @static
         * @param {String} format 要做替换的字符串，替换字符串1，替换字符串2...
         * @return {String} 做了替换后的字符串
         */
        format: function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        }
    });

    // 日期相关方法
    _.extend(BI, {
        /**
         * 是否是闰年
         * @param year
         * @returns {boolean}
         */
        isLeapYear: function (year) {
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },

        /**
         * 检测是否在有效期
         *
         * @param YY 年
         * @param MM 月
         * @param DD 日
         * @param minDate '1900-01-01'
         * @param maxDate '2099-12-31'
         * @returns {Array} 若无效返回无效状态
         */
        checkDateVoid: function (YY, MM, DD, minDate, maxDate) {
            var back = [];
            YY = YY | 0;
            MM = MM | 0;
            DD = DD | 0;
            minDate = BI.isString(minDate) ? minDate.match(/\d+/g) : minDate;
            maxDate = BI.isString(maxDate) ? maxDate.match(/\d+/g) : maxDate;
            if (YY < minDate[0]) {
                back = ["y"];
            } else if (YY > maxDate[0]) {
                back = ["y", 1];
            } else if (YY >= minDate[0] && YY <= maxDate[0]) {
                if (YY == minDate[0]) {
                    if (MM < minDate[1]) {
                        back = ["m"];
                    } else if (MM == minDate[1]) {
                        if (DD < minDate[2]) {
                            back = ["d"];
                        }
                    }
                }
                if (YY == maxDate[0]) {
                    if (MM > maxDate[1]) {
                        back = ["m", 1];
                    } else if (MM == maxDate[1]) {
                        if (DD > maxDate[2]) {
                            back = ["d", 1];
                        }
                    }
                }
            }
            return back;
        },

        checkDateLegal: function (str) {
            var ar = str.match(/\d+/g);
            var YY = ar[0] | 0, MM = ar[1] | 0, DD = ar[2] | 0;
            if (ar.length <= 1) {
                return true;
            }
            if (ar.length <= 2) {
                return MM >= 1 && MM <= 12;
            }
            var MD = BI.Date._MD.slice(0);
            MD[1] = BI.isLeapYear(YY) ? 29 : 28;
            return MM >= 1 && MM <= 12 && DD <= MD[MM - 1];
        },

        parseDateTime: function (str, fmt) {
            var today = BI.getDate();
            var y = 0;
            var m = 0;
            var d = 1;
            // wei : 对于fmt为‘YYYYMM’或者‘YYYYMMdd’的格式，str的值为类似'201111'的形式，因为年月之间没有分隔符，所以正则表达式分割无效，导致bug7376。
            var a = str.split(/\W+/);
            if (fmt.toLowerCase() == "%y%x" || fmt.toLowerCase() == "%y%x%d") {
                var yearlength = 4;
                var otherlength = 2;
                a[0] = str.substring(0, yearlength);
                a[1] = str.substring(yearlength, yearlength + otherlength);
                a[2] = str.substring(yearlength + otherlength, yearlength + otherlength * 2);
            }
            var b = fmt.match(/%./g);
            var i = 0, j = 0;
            var hr = 0;
            var min = 0;
            var sec = 0;
            for (i = 0; i < a.length; ++i) {
                switch (b[i]) {
                    case "%d":
                    case "%e":
                        d = parseInt(a[i], 10);
                        break;

                    case "%X":
                        m = parseInt(a[i], 10) - 1;
                        break;
                    case "%x":
                        m = parseInt(a[i], 10) - 1;
                        break;

                    case "%Y":
                    case "%y":
                        y = parseInt(a[i], 10);
                        (y < 100) && (y += (y > 29) ? 1900 : 2000);
                        break;

                    case "%b":
                    case "%B":
                        for (j = 0; j < 12; ++j) {
                            if (BI.Date._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) {
                                m = j;
                                break;
                            }
                        }
                        break;

                    case "%H":
                    case "%I":
                    case "%k":
                    case "%l":
                        hr = parseInt(a[i], 10);
                        break;

                    case "%P":
                    case "%p":
                        if (/pm/i.test(a[i]) && hr < 12) {
                            hr += 12;
                        } else if (/am/i.test(a[i]) && hr >= 12) {
                            hr -= 12;
                        }
                        break;

                    case "%M":
                        min = parseInt(a[i], 10);
                    case "%S":
                        sec = parseInt(a[i], 10);
                        break;
                }
            }
            //    if (!a[i]) {
            //        continue;
            //	}
            if (isNaN(y)) {
                y = today.getFullYear();
            }
            if (isNaN(m)) {
                m = today.getMonth();
            }
            if (isNaN(d)) {
                d = today.getDate();
            }
            if (isNaN(hr)) {
                hr = today.getHours();
            }
            if (isNaN(min)) {
                min = today.getMinutes();
            }
            if (isNaN(sec)) {
                sec = today.getSeconds();
            }
            if (y != 0) {
                return BI.getDate(y, m, d, hr, min, sec);
            }
            y = 0;
            m = -1;
            d = 0;
            for (i = 0; i < a.length; ++i) {
                if (a[i].search(/[a-zA-Z]+/) != -1) {
                    var t = -1;
                    for (j = 0; j < 12; ++j) {
                        if (BI.Date._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) {
                            t = j;
                            break;
                        }
                    }
                    if (t != -1) {
                        if (m != -1) {
                            d = m + 1;
                        }
                        m = t;
                    }
                } else if (parseInt(a[i], 10) <= 12 && m == -1) {
                    m = a[i] - 1;
                } else if (parseInt(a[i], 10) > 31 && y == 0) {
                    y = parseInt(a[i], 10);
                    (y < 100) && (y += (y > 29) ? 1900 : 2000);
                } else if (d == 0) {
                    d = a[i];
                }
            }
            if (y == 0) {
                y = today.getFullYear();
            }
            if (m != -1 && d != 0) {
                return BI.getDate(y, m, d, hr, min, sec);
            }
            return today;
        },

        getDate: function () {
            var length = arguments.length;
            var args = arguments;
            var dt;
            switch (length) {
                // new Date()
                case 0:
                    dt = new Date();
                    break;
                // new Date(long)
                case 1:
                    dt = new Date(args[0]);
                    break;
                // new Date(year, month)
                case 2:
                    dt = new Date(args[0], args[1]);
                    break;
                // new Date(year, month, day)
                case 3:
                    dt = new Date(args[0], args[1], args[2]);
                    break;
                // new Date(year, month, day, hour)
                case 4:
                    dt = new Date(args[0], args[1], args[2], args[3]);
                    break;
                // new Date(year, month, day, hour, minute)
                case 5:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4]);
                    break;
                // new Date(year, month, day, hour, minute, second)
                case 6:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4], args[5]);
                    break;
                // new Date(year, month, day, hour, minute, second, millisecond)
                case 7:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                    break;
                default:
                    dt = new Date();
                    break;
            }
            if (BI.isNotNull(BI.timeZone) && (arguments.length === 0 || (arguments.length === 1 && BI.isNumber(arguments[0])))) {
                var localTime = dt.getTime();
                // BI-33791 1901年以前的东8区标准是GMT+0805, 统一无论是什么时间，都以整的0800这样的为基准
                var localOffset = dt.getTimezoneOffset() * 60000; // 获得当地时间偏移的毫秒数
                var utc = localTime + localOffset; // utc即GMT时间标准时区
                return new Date(utc + BI.timeZone);// + Pool.timeZone.offset);
            }
            return dt;

        },

        getTime: function () {
            var length = arguments.length;
            var args = arguments;
            var dt;
            switch (length) {
                // new Date()
                case 0:
                    dt = new Date();
                    break;
                // new Date(long)
                case 1:
                    dt = new Date(args[0]);
                    break;
                // new Date(year, month)
                case 2:
                    dt = new Date(args[0], args[1]);
                    break;
                // new Date(year, month, day)
                case 3:
                    dt = new Date(args[0], args[1], args[2]);
                    break;
                // new Date(year, month, day, hour)
                case 4:
                    dt = new Date(args[0], args[1], args[2], args[3]);
                    break;
                // new Date(year, month, day, hour, minute)
                case 5:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4]);
                    break;
                // new Date(year, month, day, hour, minute, second)
                case 6:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4], args[5]);
                    break;
                // new Date(year, month, day, hour, minute, second, millisecond)
                case 7:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                    break;
                default:
                    dt = new Date();
                    break;
            }
            if (BI.isNotNull(BI.timeZone)) {
                // BI-33791 1901年以前的东8区标准是GMT+0805, 统一无论是什么时间，都以整的0800这样的为基准
                return dt.getTime() - BI.timeZone - new Date().getTimezoneOffset() * 60000;
            }
            return dt.getTime();

        }
    });
})();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13), __webpack_require__(52).setImmediate))

/***/ }),

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
  "use strict";

  if (global.setImmediate) {
    return;
  }

  var nextHandle = 1; // Spec says greater than zero

  var tasksByHandle = {};
  var currentlyRunningATask = false;
  var doc = global.document;
  var registerImmediate;

  function setImmediate(callback) {
    // Callback can either be a function or a string
    if (typeof callback !== "function") {
      callback = new Function("" + callback);
    } // Copy function arguments


    var args = new Array(arguments.length - 1);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    } // Store and register the task


    var task = {
      callback: callback,
      args: args
    };
    tasksByHandle[nextHandle] = task;
    registerImmediate(nextHandle);
    return nextHandle++;
  }

  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }

  function run(task) {
    var callback = task.callback;
    var args = task.args;

    switch (args.length) {
      case 0:
        callback();
        break;

      case 1:
        callback(args[0]);
        break;

      case 2:
        callback(args[0], args[1]);
        break;

      case 3:
        callback(args[0], args[1], args[2]);
        break;

      default:
        callback.apply(undefined, args);
        break;
    }
  }

  function runIfPresent(handle) {
    // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
    // So if we're currently running a task, we'll need to delay this invocation.
    if (currentlyRunningATask) {
      // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
      // "too much recursion" error.
      setTimeout(runIfPresent, 0, handle);
    } else {
      var task = tasksByHandle[handle];

      if (task) {
        currentlyRunningATask = true;

        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }

  function installNextTickImplementation() {
    registerImmediate = function registerImmediate(handle) {
      process.nextTick(function () {
        runIfPresent(handle);
      });
    };
  }

  function canUsePostMessage() {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can't be used for this purpose.
    if (global.postMessage && !global.importScripts) {
      var postMessageIsAsynchronous = true;
      var oldOnMessage = global.onmessage;

      global.onmessage = function () {
        postMessageIsAsynchronous = false;
      };

      global.postMessage("", "*");
      global.onmessage = oldOnMessage;
      return postMessageIsAsynchronous;
    }
  }

  function installPostMessageImplementation() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
    var messagePrefix = "setImmediate$" + Math.random() + "$";

    var onGlobalMessage = function onGlobalMessage(event) {
      if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    if (global.addEventListener) {
      global.addEventListener("message", onGlobalMessage, false);
    } else {
      global.attachEvent("onmessage", onGlobalMessage);
    }

    registerImmediate = function registerImmediate(handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }

  function installMessageChannelImplementation() {
    var channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      var handle = event.data;
      runIfPresent(handle);
    };

    registerImmediate = function registerImmediate(handle) {
      channel.port2.postMessage(handle);
    };
  }

  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;

    registerImmediate = function registerImmediate(handle) {
      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var script = doc.createElement("script");

      script.onreadystatechange = function () {
        runIfPresent(handle);
        script.onreadystatechange = null;
        html.removeChild(script);
        script = null;
      };

      html.appendChild(script);
    };
  }

  function installSetTimeoutImplementation() {
    registerImmediate = function registerImmediate(handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  } // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.


  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  attachTo = attachTo && attachTo.setTimeout ? attachTo : global; // Don't get fooled by e.g. browserify environments.

  if ({}.toString.call(global.process) === "[object process]") {
    // For Node.js before 0.9
    installNextTickImplementation();
  } else if (canUsePostMessage()) {
    // For non-IE10 modern browsers
    installPostMessageImplementation();
  } else if (global.MessageChannel) {
    // For web workers, where supported
    installMessageChannelImplementation();
  } else if (doc && "onreadystatechange" in doc.createElement("script")) {
    // For IE 6–8
    installReadyStateChangeImplementation();
  } else {
    // For older browsers
    installSetTimeoutImplementation();
  }

  attachTo.setImmediate = setImmediate;
  attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? void 0 : global : self);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13), __webpack_require__(66)))

/***/ }),

/***/ 107:
/***/ (function(module, exports) {

!(function () {
    function extend() {
        var target = arguments[0] || {}, length = arguments.length, i = 1, options, name, src, copy;
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }

    /**
     * 客户端观察者，主要处理事件的添加、删除、执行等
     * @class BI.OB
     * @abstract
     */
    var OB = function (config) {
        this._constructor(config);
    };
    _.extend(OB.prototype, {
        props: {},
        init: null,
        destroyed: null,

        _constructor: function (config) {
            this._initProps(config);
            this._init();
            this._initRef();
        },

        _defaultConfig: function (config) {
            return {};
        },

        _initProps: function (config) {
            var props = this.props;
            if (BI.isFunction(this.props)) {
                props = this.props(config);
            }
            this.options = extend(this._defaultConfig(config), props, config);
        },

        _init: function () {
            this._initListeners();
            this.init && this.init();
        },

        _initListeners: function () {
            var self = this;
            if (this.options.listeners != null) {
                _.each(this.options.listeners, function (lis) {
                    (lis.target ? lis.target : self)[lis.once ? "once" : "on"]
                    (lis.eventName, _.bind(lis.action, self));
                });
                delete this.options.listeners;
            }
        },

        // 获得一个当前对象的引用
        _initRef: function () {
            if (this.options.ref) {
                this.options.ref.call(this, this);
            }
        },

        //释放当前对象
        _purgeRef: function () {
            if (this.options.ref) {
                this.options.ref.call(null);
                this.options.ref = null;
            }
        },

        _getEvents: function () {
            if (!_.isObject(this.events)) {
                this.events = {};
            }
            return this.events;
        },

        /**
         * 给观察者绑定一个事件
         * @param {String} eventName 事件的名字
         * @param {Function} fn 事件对应的执行函数
         */
        on: function (eventName, fn) {
            var self = this;
            eventName = eventName.toLowerCase();
            var fns = this._getEvents()[eventName];
            if (!_.isArray(fns)) {
                fns = [];
                this._getEvents()[eventName] = fns;
            }
            fns.push(fn);

            return function () {
                self.un(eventName, fn);
            };
        },

        /**
         * 给观察者绑定一个只执行一次的事件
         * @param {String} eventName 事件的名字
         * @param {Function} fn 事件对应的执行函数
         */
        once: function (eventName, fn) {
            var proxy = function () {
                fn.apply(this, arguments);
                this.un(eventName, proxy);
            };
            this.on(eventName, proxy);
        },
        /**
         * 解除观察者绑定的指定事件
         * @param {String} eventName 要解除绑定事件的名字
         * @param {Function} fn 事件对应的执行函数，该参数是可选的，没有该参数时，将解除绑定所有同名字的事件
         */
        un: function (eventName, fn) {
            eventName = eventName.toLowerCase();

            /* alex:如果fn是null,就是把eventName上面所有方法都un掉*/
            if (fn == null) {
                delete this._getEvents()[eventName];
            } else {
                var fns = this._getEvents()[eventName];
                if (_.isArray(fns)) {
                    var newFns = [];
                    _.each(fns, function (ifn) {
                        if (ifn != fn) {
                            newFns.push(ifn);
                        }
                    });
                    this._getEvents()[eventName] = newFns;
                }
            }
        },
        /**
         * 清除观察者的所有事件绑定
         */
        purgeListeners: function () {
            /* alex:清空events*/
            this.events = {};
        },
        /**
         * 触发绑定过的事件
         *
         * @param {String} eventName 要触发的事件的名字
         * @returns {Boolean} 如果事件函数返回false，则返回false并中断其他同名事件的执行，否则执行所有的同名事件并返回true
         */
        fireEvent: function () {
            var eventName = arguments[0].toLowerCase();
            var fns = this._getEvents()[eventName];
            if (BI.isArray(fns)) {
                if (BI.isArguments(arguments[1])) {
                    for (var i = 0; i < fns.length; i++) {
                        if (fns[i].apply(this, arguments[1]) === false) {
                            return false;
                        }
                    }
                } else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    for (var i = 0; i < fns.length; i++) {
                        if (fns[i].apply(this, args) === false) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },

        destroy: function () {
            this.destroyed && this.destroyed();
            this._purgeRef();
            this.purgeListeners();
        }
    });
    BI.OB = BI.OB || OB;
})();


/***/ }),

/***/ 108:
/***/ (function(module, exports) {

!(function () {
    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    /**
     * CryptoJS core components.
     */
    BI.CRYPT_TYPE = BI.CRYPT_TYPE || {};
    BI.CRYPT_TYPE.AES = "aes";

    var CryptoJS = CryptoJS || (function (Math, undefined) {
        /**
         * CryptoJS namespace.
         */
        var C = {};

        /**
         * Library namespace.
         */
        var C_lib = C.lib = {};

        /**
         * Base object for prototypal inheritance.
         */
        var Base = C_lib.Base = (function () {
            function F () {
            }

            return {
                /**
                 * Creates a new object that inherits from this object.
                 *
                 * @param {Object} overrides Properties to copy into the new object.
                 *
                 * @return {Object} The new object.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var MyType = CryptoJS.lib.Base.extend({
                 *         field: 'value',
                 *
                 *         method: function () {
                 *         }
                 *     });
                 */
                extend: function (overrides) {
                    // Spawn
                    F.prototype = this;
                    var subtype = new F();

                    // Augment
                    if (overrides) {
                        subtype.mixIn(overrides);
                    }

                    // Create default initializer
                    if (!subtype.hasOwnProperty('init')) {
                        subtype.init = function () {
                            subtype.$super.init.apply(this, arguments);
                        };
                    }

                    // Initializer's prototype is the subtype object
                    subtype.init.prototype = subtype;

                    // Reference supertype
                    subtype.$super = this;

                    return subtype;
                },

                /**
                 * Extends this object and runs the init method.
                 * Arguments to create() will be passed to init().
                 *
                 * @return {Object} The new object.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var instance = MyType.create();
                 */
                create: function () {
                    var instance = this.extend();
                    instance.init.apply(instance, arguments);

                    return instance;
                },

                /**
                 * Initializes a newly created object.
                 * Override this method to add some logic when your objects are created.
                 *
                 * @example
                 *
                 *     var MyType = CryptoJS.lib.Base.extend({
                 *         init: function () {
                 *             // ...
                 *         }
                 *     });
                 */
                init: function () {
                },

                /**
                 * Copies properties into this object.
                 *
                 * @param {Object} properties The properties to mix in.
                 *
                 * @example
                 *
                 *     MyType.mixIn({
                 *         field: 'value'
                 *     });
                 */
                mixIn: function (properties) {
                    for (var propertyName in properties) {
                        if (properties.hasOwnProperty(propertyName)) {
                            this[propertyName] = properties[propertyName];
                        }
                    }

                    // IE won't copy toString using the loop above
                    if (properties.hasOwnProperty('toString')) {
                        this.toString = properties.toString;
                    }
                },

                /**
                 * Creates a copy of this object.
                 *
                 * @return {Object} The clone.
                 *
                 * @example
                 *
                 *     var clone = instance.clone();
                 */
                clone: function () {
                    return this.init.prototype.extend(this);
                }
            };
        }());

        /**
         * An array of 32-bit words.
         *
         * @property {Array} words The array of 32-bit words.
         * @property {number} sigBytes The number of significant bytes in this word array.
         */
        var WordArray = C_lib.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of 32-bit words.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.create();
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
             */
            init: function (words, sigBytes) {
                words = this.words = words || [];

                if (sigBytes != undefined) {
                    this.sigBytes = sigBytes;
                } else {
                    this.sigBytes = words.length * 4;
                }
            },

            /**
             * Converts this word array to a string.
             *
             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
             *
             * @return {string} The stringified word array.
             *
             * @example
             *
             *     var string = wordArray + '';
             *     var string = wordArray.toString();
             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
             */
            toString: function (encoder) {
                return (encoder || Hex).stringify(this);
            },

            /**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */
            concat: function (wordArray) {
                // Shortcuts
                var thisWords = this.words;
                var thatWords = wordArray.words;
                var thisSigBytes = this.sigBytes;
                var thatSigBytes = wordArray.sigBytes;

                // Clamp excess bits
                this.clamp();

                // Concat
                if (thisSigBytes % 4) {
                    // Copy one byte at a time
                    for (var i = 0; i < thatSigBytes; i++) {
                        var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                    }
                } else if (thatWords.length > 0xffff) {
                    // Copy one word at a time
                    for (var i = 0; i < thatSigBytes; i += 4) {
                        thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                    }
                } else {
                    // Copy all words at once
                    thisWords.push.apply(thisWords, thatWords);
                }
                this.sigBytes += thatSigBytes;

                // Chainable
                return this;
            },

            /**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */
            clamp: function () {
                // Shortcuts
                var words = this.words;
                var sigBytes = this.sigBytes;

                // Clamp
                words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                words.length = Math.ceil(sigBytes / 4);
            },

            /**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */
            clone: function () {
                var clone = Base.clone.call(this);
                clone.words = this.words.slice(0);

                return clone;
            },

            /**
             * Creates a word array filled with random bytes.
             *
             * @param {number} nBytes The number of random bytes to generate.
             *
             * @return {WordArray} The random word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.random(16);
             */
            random: function (nBytes) {
                var words = [];
                for (var i = 0; i < nBytes; i += 4) {
                    words.push((Math.random() * 0x100000000) | 0);
                }

                return new WordArray.init(words, nBytes);
            }
        });

        /**
         * Encoder namespace.
         */
        var C_enc = C.enc = {};

        /**
         * Hex encoding strategy.
         */
        var Hex = C_enc.Hex = {
            /**
             * Converts a word array to a hex string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The hex string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
             */
            stringify: function (wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;

                // Convert
                var hexChars = [];
                for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    hexChars.push((bite >>> 4).toString(16));
                    hexChars.push((bite & 0x0f).toString(16));
                }

                return hexChars.join('');
            },

            /**
             * Converts a hex string to a word array.
             *
             * @param {string} hexStr The hex string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
             */
            parse: function (hexStr) {
                // Shortcut
                var hexStrLength = hexStr.length;

                // Convert
                var words = [];
                for (var i = 0; i < hexStrLength; i += 2) {
                    words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                }

                return new WordArray.init(words, hexStrLength / 2);
            }
        };

        /**
         * Latin1 encoding strategy.
         */
        var Latin1 = C_enc.Latin1 = {
            /**
             * Converts a word array to a Latin1 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Latin1 string.
             *
             * @static
             *
             * @example
             *
             *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
             */
            stringify: function (wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;

                // Convert
                var latin1Chars = [];
                for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    latin1Chars.push(String.fromCharCode(bite));
                }

                return latin1Chars.join('');
            },

            /**
             * Converts a Latin1 string to a word array.
             *
             * @param {string} latin1Str The Latin1 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
             */
            parse: function (latin1Str) {
                // Shortcut
                var latin1StrLength = latin1Str.length;

                // Convert
                var words = [];
                for (var i = 0; i < latin1StrLength; i++) {
                    words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                }

                return new WordArray.init(words, latin1StrLength);
            }
        };

        /**
         * UTF-8 encoding strategy.
         */
        var Utf8 = C_enc.Utf8 = {
            /**
             * Converts a word array to a UTF-8 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-8 string.
             *
             * @static
             *
             * @example
             *
             *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
             */
            stringify: function (wordArray) {
                try {
                    return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                } catch (e) {
                    throw new Error('Malformed UTF-8 data');
                }
            },

            /**
             * Converts a UTF-8 string to a word array.
             *
             * @param {string} utf8Str The UTF-8 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
             */
            parse: function (utf8Str) {
                return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
        };

        /**
         * Abstract buffered block algorithm template.
         *
         * The property blockSize must be implemented in a concrete subtype.
         *
         * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
         */
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            /**
             * Resets this block algorithm's data buffer to its initial state.
             *
             * @example
             *
             *     bufferedBlockAlgorithm.reset();
             */
            reset: function () {
                // Initial values
                this._data = new WordArray.init();
                this._nDataBytes = 0;
            },

            /**
             * Adds new data to this block algorithm's buffer.
             *
             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
             *
             * @example
             *
             *     bufferedBlockAlgorithm._append('data');
             *     bufferedBlockAlgorithm._append(wordArray);
             */
            _append: function (data) {
                // Convert string to WordArray, else assume WordArray already
                if (typeof data == 'string') {
                    data = Utf8.parse(data);
                }

                // Append
                this._data.concat(data);
                this._nDataBytes += data.sigBytes;
            },

            /**
             * Processes available data blocks.
             *
             * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
             *
             * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
             *
             * @return {WordArray} The processed data.
             *
             * @example
             *
             *     var processedData = bufferedBlockAlgorithm._process();
             *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
             */
            _process: function (doFlush) {
                // Shortcuts
                var data = this._data;
                var dataWords = data.words;
                var dataSigBytes = data.sigBytes;
                var blockSize = this.blockSize;
                var blockSizeBytes = blockSize * 4;

                // Count blocks ready
                var nBlocksReady = dataSigBytes / blockSizeBytes;
                if (doFlush) {
                    // Round up to include partial blocks
                    nBlocksReady = Math.ceil(nBlocksReady);
                } else {
                    // Round down to include only full blocks,
                    // less the number of blocks that must remain in the buffer
                    nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
                }

                // Count words ready
                var nWordsReady = nBlocksReady * blockSize;

                // Count bytes ready
                var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                // Process blocks
                if (nWordsReady) {
                    for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                        // Perform concrete-algorithm logic
                        this._doProcessBlock(dataWords, offset);
                    }

                    // Remove processed words
                    var processedWords = dataWords.splice(0, nWordsReady);
                    data.sigBytes -= nBytesReady;
                }

                // Return processed words
                return new WordArray.init(processedWords, nBytesReady);
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = bufferedBlockAlgorithm.clone();
             */
            clone: function () {
                var clone = Base.clone.call(this);
                clone._data = this._data.clone();

                return clone;
            },

            _minBufferSize: 0
        });

        /**
         * Abstract hasher template.
         *
         * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
         */
        var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             */
            cfg: Base.extend(),

            /**
             * Initializes a newly created hasher.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @example
             *
             *     var hasher = CryptoJS.algo.SHA256.create();
             */
            init: function (cfg) {
                // Apply config defaults
                this.cfg = this.cfg.extend(cfg);

                // Set initial values
                this.reset();
            },

            /**
             * Resets this hasher to its initial state.
             *
             * @example
             *
             *     hasher.reset();
             */
            reset: function () {
                // Reset data buffer
                BufferedBlockAlgorithm.reset.call(this);

                // Perform concrete-hasher logic
                this._doReset();
            },

            /**
             * Updates this hasher with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.update('message');
             *     hasher.update(wordArray);
             */
            update: function (messageUpdate) {
                // Append
                this._append(messageUpdate);

                // Update the hash
                this._process();

                // Chainable
                return this;
            },

            /**
             * Finalizes the hash computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The hash.
             *
             * @example
             *
             *     var hash = hasher.finalize();
             *     var hash = hasher.finalize('message');
             *     var hash = hasher.finalize(wordArray);
             */
            finalize: function (messageUpdate) {
                // Final message update
                if (messageUpdate) {
                    this._append(messageUpdate);
                }

                // Perform concrete-hasher logic
                var hash = this._doFinalize();

                return hash;
            },

            blockSize: 512 / 32,

            /**
             * Creates a shortcut function to a hasher's object interface.
             *
             * @param {Hasher} hasher The hasher to create a helper for.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
             */
            _createHelper: function (hasher) {
                return function (message, cfg) {
                    return new hasher.init(cfg).finalize(message);
                };
            },

            /**
             * Creates a shortcut function to the HMAC's object interface.
             *
             * @param {Hasher} hasher The hasher to use in this HMAC helper.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
             */
            _createHmacHelper: function (hasher) {
                return function (message, key) {
                    return new C_algo.HMAC.init(hasher, key).finalize(message);
                };
            }
        });

        /**
         * Algorithm namespace.
         */
        var C_algo = C.algo = {};

        return C;
    }(Math));

    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;

        /**
         * Base64 encoding strategy.
         */
        var Base64 = C_enc.Base64 = {
            /**
             * Converts a word array to a Base64 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Base64 string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
             */
            stringify: function (wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;
                var map = this._map;

                // Clamp excess bits
                wordArray.clamp();

                // Convert
                var base64Chars = [];
                for (var i = 0; i < sigBytes; i += 3) {
                    var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                    var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                    var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                    for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                        base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                    }
                }

                // Add padding
                var paddingChar = map.charAt(64);
                if (paddingChar) {
                    while (base64Chars.length % 4) {
                        base64Chars.push(paddingChar);
                    }
                }

                return base64Chars.join('');
            },

            /**
             * Converts a Base64 string to a word array.
             *
             * @param {string} base64Str The Base64 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
             */
            parse: function (base64Str) {
                // Shortcuts
                var base64StrLength = base64Str.length;
                var map = this._map;

                // Ignore padding
                var paddingChar = map.charAt(64);
                if (paddingChar) {
                    var paddingIndex = base64Str.indexOf(paddingChar);
                    if (paddingIndex != -1) {
                        base64StrLength = paddingIndex;
                    }
                }

                // Convert
                var words = [];
                var nBytes = 0;
                for (var i = 0; i < base64StrLength; i++) {
                    if (i % 4) {
                        var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
                        var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
                        words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                        nBytes++;
                    }
                }

                return WordArray.create(words, nBytes);
            },

            _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        };
    }());

    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;

        // Constants table
        var T = [];

        // Compute constants
        (function () {
            for (var i = 0; i < 64; i++) {
                T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
            }
        }());

        /**
         * MD5 hash algorithm.
         */
        var MD5 = C_algo.MD5 = Hasher.extend({
            _doReset: function () {
                this._hash = new WordArray.init([
                    0x67452301, 0xefcdab89,
                    0x98badcfe, 0x10325476
                ]);
            },

            _doProcessBlock: function (M, offset) {
                // Swap endian
                for (var i = 0; i < 16; i++) {
                    // Shortcuts
                    var offset_i = offset + i;
                    var M_offset_i = M[offset_i];

                    M[offset_i] = (
                        (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                        (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
                    );
                }

                // Shortcuts
                var H = this._hash.words;

                var M_offset_0 = M[offset + 0];
                var M_offset_1 = M[offset + 1];
                var M_offset_2 = M[offset + 2];
                var M_offset_3 = M[offset + 3];
                var M_offset_4 = M[offset + 4];
                var M_offset_5 = M[offset + 5];
                var M_offset_6 = M[offset + 6];
                var M_offset_7 = M[offset + 7];
                var M_offset_8 = M[offset + 8];
                var M_offset_9 = M[offset + 9];
                var M_offset_10 = M[offset + 10];
                var M_offset_11 = M[offset + 11];
                var M_offset_12 = M[offset + 12];
                var M_offset_13 = M[offset + 13];
                var M_offset_14 = M[offset + 14];
                var M_offset_15 = M[offset + 15];

                // Working varialbes
                var a = H[0];
                var b = H[1];
                var c = H[2];
                var d = H[3];

                // Computation
                a = FF(a, b, c, d, M_offset_0, 7, T[0]);
                d = FF(d, a, b, c, M_offset_1, 12, T[1]);
                c = FF(c, d, a, b, M_offset_2, 17, T[2]);
                b = FF(b, c, d, a, M_offset_3, 22, T[3]);
                a = FF(a, b, c, d, M_offset_4, 7, T[4]);
                d = FF(d, a, b, c, M_offset_5, 12, T[5]);
                c = FF(c, d, a, b, M_offset_6, 17, T[6]);
                b = FF(b, c, d, a, M_offset_7, 22, T[7]);
                a = FF(a, b, c, d, M_offset_8, 7, T[8]);
                d = FF(d, a, b, c, M_offset_9, 12, T[9]);
                c = FF(c, d, a, b, M_offset_10, 17, T[10]);
                b = FF(b, c, d, a, M_offset_11, 22, T[11]);
                a = FF(a, b, c, d, M_offset_12, 7, T[12]);
                d = FF(d, a, b, c, M_offset_13, 12, T[13]);
                c = FF(c, d, a, b, M_offset_14, 17, T[14]);
                b = FF(b, c, d, a, M_offset_15, 22, T[15]);

                a = GG(a, b, c, d, M_offset_1, 5, T[16]);
                d = GG(d, a, b, c, M_offset_6, 9, T[17]);
                c = GG(c, d, a, b, M_offset_11, 14, T[18]);
                b = GG(b, c, d, a, M_offset_0, 20, T[19]);
                a = GG(a, b, c, d, M_offset_5, 5, T[20]);
                d = GG(d, a, b, c, M_offset_10, 9, T[21]);
                c = GG(c, d, a, b, M_offset_15, 14, T[22]);
                b = GG(b, c, d, a, M_offset_4, 20, T[23]);
                a = GG(a, b, c, d, M_offset_9, 5, T[24]);
                d = GG(d, a, b, c, M_offset_14, 9, T[25]);
                c = GG(c, d, a, b, M_offset_3, 14, T[26]);
                b = GG(b, c, d, a, M_offset_8, 20, T[27]);
                a = GG(a, b, c, d, M_offset_13, 5, T[28]);
                d = GG(d, a, b, c, M_offset_2, 9, T[29]);
                c = GG(c, d, a, b, M_offset_7, 14, T[30]);
                b = GG(b, c, d, a, M_offset_12, 20, T[31]);

                a = HH(a, b, c, d, M_offset_5, 4, T[32]);
                d = HH(d, a, b, c, M_offset_8, 11, T[33]);
                c = HH(c, d, a, b, M_offset_11, 16, T[34]);
                b = HH(b, c, d, a, M_offset_14, 23, T[35]);
                a = HH(a, b, c, d, M_offset_1, 4, T[36]);
                d = HH(d, a, b, c, M_offset_4, 11, T[37]);
                c = HH(c, d, a, b, M_offset_7, 16, T[38]);
                b = HH(b, c, d, a, M_offset_10, 23, T[39]);
                a = HH(a, b, c, d, M_offset_13, 4, T[40]);
                d = HH(d, a, b, c, M_offset_0, 11, T[41]);
                c = HH(c, d, a, b, M_offset_3, 16, T[42]);
                b = HH(b, c, d, a, M_offset_6, 23, T[43]);
                a = HH(a, b, c, d, M_offset_9, 4, T[44]);
                d = HH(d, a, b, c, M_offset_12, 11, T[45]);
                c = HH(c, d, a, b, M_offset_15, 16, T[46]);
                b = HH(b, c, d, a, M_offset_2, 23, T[47]);

                a = II(a, b, c, d, M_offset_0, 6, T[48]);
                d = II(d, a, b, c, M_offset_7, 10, T[49]);
                c = II(c, d, a, b, M_offset_14, 15, T[50]);
                b = II(b, c, d, a, M_offset_5, 21, T[51]);
                a = II(a, b, c, d, M_offset_12, 6, T[52]);
                d = II(d, a, b, c, M_offset_3, 10, T[53]);
                c = II(c, d, a, b, M_offset_10, 15, T[54]);
                b = II(b, c, d, a, M_offset_1, 21, T[55]);
                a = II(a, b, c, d, M_offset_8, 6, T[56]);
                d = II(d, a, b, c, M_offset_15, 10, T[57]);
                c = II(c, d, a, b, M_offset_6, 15, T[58]);
                b = II(b, c, d, a, M_offset_13, 21, T[59]);
                a = II(a, b, c, d, M_offset_4, 6, T[60]);
                d = II(d, a, b, c, M_offset_11, 10, T[61]);
                c = II(c, d, a, b, M_offset_2, 15, T[62]);
                b = II(b, c, d, a, M_offset_9, 21, T[63]);

                // Intermediate hash value
                H[0] = (H[0] + a) | 0;
                H[1] = (H[1] + b) | 0;
                H[2] = (H[2] + c) | 0;
                H[3] = (H[3] + d) | 0;
            },

            _doFinalize: function () {
                // Shortcuts
                var data = this._data;
                var dataWords = data.words;

                var nBitsTotal = this._nDataBytes * 8;
                var nBitsLeft = data.sigBytes * 8;

                // Add padding
                dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

                var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
                var nBitsTotalL = nBitsTotal;
                dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                    (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                    (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00)
                );
                dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                    (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                    (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00)
                );

                data.sigBytes = (dataWords.length + 1) * 4;

                // Hash final blocks
                this._process();

                // Shortcuts
                var hash = this._hash;
                var H = hash.words;

                // Swap endian
                for (var i = 0; i < 4; i++) {
                    // Shortcut
                    var H_i = H[i];

                    H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                        (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
                }

                // Return final computed hash
                return hash;
            },

            clone: function () {
                var clone = Hasher.clone.call(this);
                clone._hash = this._hash.clone();

                return clone;
            }
        });

        function FF (a, b, c, d, x, s, t) {
            var n = a + ((b & c) | (~b & d)) + x + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function GG (a, b, c, d, x, s, t) {
            var n = a + ((b & d) | (c & ~d)) + x + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function HH (a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + x + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function II (a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + x + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.MD5('message');
         *     var hash = CryptoJS.MD5(wordArray);
         */
        C.MD5 = Hasher._createHelper(MD5);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacMD5(message, key);
         */
        C.HmacMD5 = Hasher._createHmacHelper(MD5);
    }(Math));

    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var MD5 = C_algo.MD5;

        /**
         * This key derivation function is meant to conform with EVP_BytesToKey.
         * www.openssl.org/docs/crypto/EVP_BytesToKey.html
         */
        var EvpKDF = C_algo.EvpKDF = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hash algorithm to use. Default: MD5
             * @property {number} iterations The number of iterations to perform. Default: 1
             */
            cfg: Base.extend({
                keySize: 128 / 32,
                hasher: MD5,
                iterations: 1
            }),

            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.EvpKDF.create();
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
             */
            init: function (cfg) {
                this.cfg = this.cfg.extend(cfg);
            },

            /**
             * Derives a key from a password.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function (password, salt) {
                // Shortcut
                var cfg = this.cfg;

                // Init hasher
                var hasher = cfg.hasher.create();

                // Initial values
                var derivedKey = WordArray.create();

                // Shortcuts
                var derivedKeyWords = derivedKey.words;
                var keySize = cfg.keySize;
                var iterations = cfg.iterations;

                // Generate key
                while (derivedKeyWords.length < keySize) {
                    if (block) {
                        hasher.update(block);
                    }
                    var block = hasher.update(password).finalize(salt);
                    hasher.reset();

                    // Iterations
                    for (var i = 1; i < iterations; i++) {
                        block = hasher.finalize(block);
                        hasher.reset();
                    }

                    derivedKey.concat(block);
                }
                derivedKey.sigBytes = keySize * 4;

                return derivedKey;
            }
        });

        /**
         * Derives a key from a password.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         * @param {Object} cfg (Optional) The configuration options to use for this computation.
         *
         * @return {WordArray} The derived key.
         *
         * @static
         *
         * @example
         *
         *     var key = CryptoJS.EvpKDF(password, salt);
         *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
         *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
         */
        C.EvpKDF = function (password, salt, cfg) {
            return EvpKDF.create(cfg).compute(password, salt);
        };
    }());


    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    /**
     * Cipher core components.
     */
    CryptoJS.lib.Cipher || (function (undefined) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
        var C_enc = C.enc;
        var Utf8 = C_enc.Utf8;
        var Base64 = C_enc.Base64;
        var C_algo = C.algo;
        var EvpKDF = C_algo.EvpKDF;

        /**
         * Abstract base cipher template.
         *
         * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
         * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
         * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
         * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
         */
        var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             *
             * @property {WordArray} iv The IV to use for this operation.
             */
            cfg: Base.extend(),

            /**
             * Creates this cipher in encryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
             */
            createEncryptor: function (key, cfg) {
                return this.create(this._ENC_XFORM_MODE, key, cfg);
            },

            /**
             * Creates this cipher in decryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
             */
            createDecryptor: function (key, cfg) {
                return this.create(this._DEC_XFORM_MODE, key, cfg);
            },

            /**
             * Initializes a newly created cipher.
             *
             * @param {number} xformMode Either the encryption or decryption transormation mode constant.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
             */
            init: function (xformMode, key, cfg) {
                // Apply config defaults
                this.cfg = this.cfg.extend(cfg);

                // Store transform mode and key
                this._xformMode = xformMode;
                this._key = key;

                // Set initial values
                this.reset();
            },

            /**
             * Resets this cipher to its initial state.
             *
             * @example
             *
             *     cipher.reset();
             */
            reset: function () {
                // Reset data buffer
                BufferedBlockAlgorithm.reset.call(this);

                // Perform concrete-cipher logic
                this._doReset();
            },

            /**
             * Adds data to be encrypted or decrypted.
             *
             * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
             *
             * @return {WordArray} The data after processing.
             *
             * @example
             *
             *     var encrypted = cipher.process('data');
             *     var encrypted = cipher.process(wordArray);
             */
            process: function (dataUpdate) {
                // Append
                this._append(dataUpdate);

                // Process available blocks
                return this._process();
            },

            /**
             * Finalizes the encryption or decryption process.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
             *
             * @return {WordArray} The data after final processing.
             *
             * @example
             *
             *     var encrypted = cipher.finalize();
             *     var encrypted = cipher.finalize('data');
             *     var encrypted = cipher.finalize(wordArray);
             */
            finalize: function (dataUpdate) {
                // Final data update
                if (dataUpdate) {
                    this._append(dataUpdate);
                }

                // Perform concrete-cipher logic
                var finalProcessedData = this._doFinalize();

                return finalProcessedData;
            },

            keySize: 128 / 32,

            ivSize: 128 / 32,

            _ENC_XFORM_MODE: 1,

            _DEC_XFORM_MODE: 2,

            /**
             * Creates shortcut functions to a cipher's object interface.
             *
             * @param {Cipher} cipher The cipher to create a helper for.
             *
             * @return {Object} An object with encrypt and decrypt shortcut functions.
             *
             * @static
             *
             * @example
             *
             *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
             */
            _createHelper: (function () {
                function selectCipherStrategy (key) {
                    if (typeof key == 'string') {
                        return PasswordBasedCipher;
                    } else {
                        return SerializableCipher;
                    }
                }

                return function (cipher) {
                    return {
                        encrypt: function (message, key, cfg) {
                            return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                        },

                        decrypt: function (ciphertext, key, cfg) {
                            return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                        }
                    };
                };
            }())
        });

        /**
         * Abstract base stream cipher template.
         *
         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
         */
        var StreamCipher = C_lib.StreamCipher = Cipher.extend({
            _doFinalize: function () {
                // Process partial blocks
                var finalProcessedBlocks = this._process(!!'flush');

                return finalProcessedBlocks;
            },

            blockSize: 1
        });

        /**
         * Mode namespace.
         */
        var C_mode = C.mode = {};

        /**
         * Abstract base block cipher mode template.
         */
        var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
            /**
             * Creates this mode for encryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
             */
            createEncryptor: function (cipher, iv) {
                return this.Encryptor.create(cipher, iv);
            },

            /**
             * Creates this mode for decryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
             */
            createDecryptor: function (cipher, iv) {
                return this.Decryptor.create(cipher, iv);
            },

            /**
             * Initializes a newly created mode.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
             */
            init: function (cipher, iv) {
                this._cipher = cipher;
                this._iv = iv;
            }
        });

        /**
         * Cipher Block Chaining mode.
         */
        var CBC = C_mode.CBC = (function () {
            /**
             * Abstract base CBC mode.
             */
            var CBC = BlockCipherMode.extend();

            /**
             * CBC encryptor.
             */
            CBC.Encryptor = CBC.extend({
                /**
                 * Processes the data block at offset.
                 *
                 * @param {Array} words The data words to operate on.
                 * @param {number} offset The offset where the block starts.
                 *
                 * @example
                 *
                 *     mode.processBlock(data.words, offset);
                 */
                processBlock: function (words, offset) {
                    // Shortcuts
                    var cipher = this._cipher;
                    var blockSize = cipher.blockSize;

                    // XOR and encrypt
                    xorBlock.call(this, words, offset, blockSize);
                    cipher.encryptBlock(words, offset);

                    // Remember this block to use with next block
                    this._prevBlock = words.slice(offset, offset + blockSize);
                }
            });

            /**
             * CBC decryptor.
             */
            CBC.Decryptor = CBC.extend({
                /**
                 * Processes the data block at offset.
                 *
                 * @param {Array} words The data words to operate on.
                 * @param {number} offset The offset where the block starts.
                 *
                 * @example
                 *
                 *     mode.processBlock(data.words, offset);
                 */
                processBlock: function (words, offset) {
                    // Shortcuts
                    var cipher = this._cipher;
                    var blockSize = cipher.blockSize;

                    // Remember this block to use with next block
                    var thisBlock = words.slice(offset, offset + blockSize);

                    // Decrypt and XOR
                    cipher.decryptBlock(words, offset);
                    xorBlock.call(this, words, offset, blockSize);

                    // This block becomes the previous block
                    this._prevBlock = thisBlock;
                }
            });

            function xorBlock (words, offset, blockSize) {
                // Shortcut
                var iv = this._iv;

                // Choose mixing block
                if (iv) {
                    var block = iv;

                    // Remove IV for subsequent blocks
                    this._iv = undefined;
                } else {
                    var block = this._prevBlock;
                }

                // XOR blocks
                for (var i = 0; i < blockSize; i++) {
                    words[offset + i] ^= block[i];
                }
            }

            return CBC;
        }());

        /**
         * Padding namespace.
         */
        var C_pad = C.pad = {};

        /**
         * PKCS #5/7 padding strategy.
         */
        var Pkcs7 = C_pad.Pkcs7 = {
            /**
             * Pads data using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to pad.
             * @param {number} blockSize The multiple that the data should be padded to.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
             */
            pad: function (data, blockSize) {
                // Shortcut
                var blockSizeBytes = blockSize * 4;

                // Count padding bytes
                var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

                // Create padding word
                var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

                // Create padding
                var paddingWords = [];
                for (var i = 0; i < nPaddingBytes; i += 4) {
                    paddingWords.push(paddingWord);
                }
                var padding = WordArray.create(paddingWords, nPaddingBytes);

                // Add padding
                data.concat(padding);
            },

            /**
             * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to unpad.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.unpad(wordArray);
             */
            unpad: function (data) {
                // Get number of padding bytes from last byte
                var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

                // Remove padding
                data.sigBytes -= nPaddingBytes;
            }
        };

        /**
         * Abstract base block cipher template.
         *
         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
         */
        var BlockCipher = C_lib.BlockCipher = Cipher.extend({
            /**
             * Configuration options.
             *
             * @property {Mode} mode The block mode to use. Default: CBC
             * @property {Padding} padding The padding strategy to use. Default: Pkcs7
             */
            cfg: Cipher.cfg.extend({
                mode: CBC,
                padding: Pkcs7
            }),

            reset: function () {
                // Reset cipher
                Cipher.reset.call(this);

                // Shortcuts
                var cfg = this.cfg;
                var iv = cfg.iv;
                var mode = cfg.mode;

                // Reset block mode
                if (this._xformMode == this._ENC_XFORM_MODE) {
                    var modeCreator = mode.createEncryptor;
                } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                    var modeCreator = mode.createDecryptor;

                    // Keep at least one block in the buffer for unpadding
                    this._minBufferSize = 1;
                }
                this._mode = modeCreator.call(mode, this, iv && iv.words);
            },

            _doProcessBlock: function (words, offset) {
                this._mode.processBlock(words, offset);
            },

            _doFinalize: function () {
                // Shortcut
                var padding = this.cfg.padding;

                // Finalize
                if (this._xformMode == this._ENC_XFORM_MODE) {
                    // Pad data
                    padding.pad(this._data, this.blockSize);

                    // Process final blocks
                    var finalProcessedBlocks = this._process(!!'flush');
                } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                    // Process final blocks
                    var finalProcessedBlocks = this._process(!!'flush');

                    // Unpad data
                    padding.unpad(finalProcessedBlocks);
                }

                return finalProcessedBlocks;
            },

            blockSize: 128 / 32
        });

        /**
         * A collection of cipher parameters.
         *
         * @property {WordArray} ciphertext The raw ciphertext.
         * @property {WordArray} key The key to this ciphertext.
         * @property {WordArray} iv The IV used in the ciphering operation.
         * @property {WordArray} salt The salt used with a key derivation function.
         * @property {Cipher} algorithm The cipher algorithm.
         * @property {Mode} mode The block mode used in the ciphering operation.
         * @property {Padding} padding The padding scheme used in the ciphering operation.
         * @property {number} blockSize The block size of the cipher.
         * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
         */
        var CipherParams = C_lib.CipherParams = Base.extend({
            /**
             * Initializes a newly created cipher params object.
             *
             * @param {Object} cipherParams An object with any of the possible cipher parameters.
             *
             * @example
             *
             *     var cipherParams = CryptoJS.lib.CipherParams.create({
             *         ciphertext: ciphertextWordArray,
             *         key: keyWordArray,
             *         iv: ivWordArray,
             *         salt: saltWordArray,
             *         algorithm: CryptoJS.algo.AES,
             *         mode: CryptoJS.mode.CBC,
             *         padding: CryptoJS.pad.PKCS7,
             *         blockSize: 4,
             *         formatter: CryptoJS.format.OpenSSL
             *     });
             */
            init: function (cipherParams) {
                this.mixIn(cipherParams);
            },

            /**
             * Converts this cipher params object to a string.
             *
             * @param {Format} formatter (Optional) The formatting strategy to use.
             *
             * @return {string} The stringified cipher params.
             *
             * @throws Error If neither the formatter nor the default formatter is set.
             *
             * @example
             *
             *     var string = cipherParams + '';
             *     var string = cipherParams.toString();
             *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
             */
            toString: function (formatter) {
                return (formatter || this.formatter).stringify(this);
            }
        });

        /**
         * Format namespace.
         */
        var C_format = C.format = {};

        /**
         * OpenSSL formatting strategy.
         */
        var OpenSSLFormatter = C_format.OpenSSL = {
            /**
             * Converts a cipher params object to an OpenSSL-compatible string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The OpenSSL-compatible string.
             *
             * @static
             *
             * @example
             *
             *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
             */
            stringify: function (cipherParams) {
                // Shortcuts
                var ciphertext = cipherParams.ciphertext;
                var salt = cipherParams.salt;

                // Format
                if (salt) {
                    var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
                } else {
                    var wordArray = ciphertext;
                }

                return wordArray.toString(Base64);
            },

            /**
             * Converts an OpenSSL-compatible string to a cipher params object.
             *
             * @param {string} openSSLStr The OpenSSL-compatible string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
             */
            parse: function (openSSLStr) {
                // Parse base64
                var ciphertext = Base64.parse(openSSLStr);

                // Shortcut
                var ciphertextWords = ciphertext.words;

                // Test for salt
                if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                    // Extract salt
                    var salt = WordArray.create(ciphertextWords.slice(2, 4));

                    // Remove salt from ciphertext
                    ciphertextWords.splice(0, 4);
                    ciphertext.sigBytes -= 16;
                }

                return CipherParams.create({ciphertext: ciphertext, salt: salt});
            }
        };

        /**
         * A cipher wrapper that returns ciphertext as a serializable cipher params object.
         */
        var SerializableCipher = C_lib.SerializableCipher = Base.extend({
            /**
             * Configuration options.
             *
             * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
             */
            cfg: Base.extend({
                format: OpenSSLFormatter
            }),

            /**
             * Encrypts a message.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            encrypt: function (cipher, message, key, cfg) {
                // Apply config defaults
                cfg = this.cfg.extend(cfg);

                // Encrypt
                var encryptor = cipher.createEncryptor(key, cfg);
                var ciphertext = encryptor.finalize(message);

                // Shortcut
                var cipherCfg = encryptor.cfg;

                // Create and return serializable cipher params
                return CipherParams.create({
                    ciphertext: ciphertext,
                    key: key,
                    iv: cipherCfg.iv,
                    algorithm: cipher,
                    mode: cipherCfg.mode,
                    padding: cipherCfg.padding,
                    blockSize: cipher.blockSize,
                    formatter: cfg.format
                });
            },

            /**
             * Decrypts serialized ciphertext.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            decrypt: function (cipher, ciphertext, key, cfg) {
                // Apply config defaults
                cfg = this.cfg.extend(cfg);

                // Convert string to CipherParams
                ciphertext = this._parse(ciphertext, cfg.format);

                // Decrypt
                var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

                return plaintext;
            },

            /**
             * Converts serialized ciphertext to CipherParams,
             * else assumed CipherParams already and returns ciphertext unchanged.
             *
             * @param {CipherParams|string} ciphertext The ciphertext.
             * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
             *
             * @return {CipherParams} The unserialized ciphertext.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
             */
            _parse: function (ciphertext, format) {
                if (typeof ciphertext == 'string') {
                    return format.parse(ciphertext, this);
                } else {
                    return ciphertext;
                }
            }
        });

        /**
         * Key derivation function namespace.
         */
        var C_kdf = C.kdf = {};

        /**
         * OpenSSL key derivation function.
         */
        var OpenSSLKdf = C_kdf.OpenSSL = {
            /**
             * Derives a key and IV from a password.
             *
             * @param {string} password The password to derive from.
             * @param {number} keySize The size in words of the key to generate.
             * @param {number} ivSize The size in words of the IV to generate.
             * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
             *
             * @return {CipherParams} A cipher params object with the key, IV, and salt.
             *
             * @static
             *
             * @example
             *
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
             */
            execute: function (password, keySize, ivSize, salt) {
                // Generate random salt
                if (!salt) {
                    salt = WordArray.random(64 / 8);
                }

                // Derive key and IV
                var key = EvpKDF.create({keySize: keySize + ivSize}).compute(password, salt);

                // Separate key and IV
                var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
                key.sigBytes = keySize * 4;

                // Return params
                return CipherParams.create({key: key, iv: iv, salt: salt});
            }
        };

        /**
         * A serializable cipher wrapper that derives the key from a password,
         * and returns ciphertext as a serializable cipher params object.
         */
        var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
            /**
             * Configuration options.
             *
             * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
             */
            cfg: SerializableCipher.cfg.extend({
                kdf: OpenSSLKdf
            }),

            /**
             * Encrypts a message using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
             */
            encrypt: function (cipher, message, password, cfg) {
                // Apply config defaults
                cfg = this.cfg.extend(cfg);

                // Derive key and other params
                var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

                // Add IV to config
                cfg.iv = derivedParams.iv;

                // Encrypt
                var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

                // Mix in derived params
                ciphertext.mixIn(derivedParams);

                return ciphertext;
            },

            /**
             * Decrypts serialized ciphertext using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
             */
            decrypt: function (cipher, ciphertext, password, cfg) {
                // Apply config defaults
                cfg = this.cfg.extend(cfg);

                // Convert string to CipherParams
                ciphertext = this._parse(ciphertext, cfg.format);

                // Derive key and other params
                var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

                // Add IV to config
                cfg.iv = derivedParams.iv;

                // Decrypt
                var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

                return plaintext;
            }
        });
    }());

    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    /**
     * Electronic Codebook block mode.
     */
    CryptoJS.mode.ECB = (function () {
        var ECB = CryptoJS.lib.BlockCipherMode.extend();

        ECB.Encryptor = ECB.extend({
            processBlock: function (words, offset) {
                this._cipher.encryptBlock(words, offset);
            }
        });

        ECB.Decryptor = ECB.extend({
            processBlock: function (words, offset) {
                this._cipher.decryptBlock(words, offset);
            }
        });

        return ECB;
    }());


    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;

        // Lookup tables
        var SBOX = [];
        var INV_SBOX = [];
        var SUB_MIX_0 = [];
        var SUB_MIX_1 = [];
        var SUB_MIX_2 = [];
        var SUB_MIX_3 = [];
        var INV_SUB_MIX_0 = [];
        var INV_SUB_MIX_1 = [];
        var INV_SUB_MIX_2 = [];
        var INV_SUB_MIX_3 = [];

        // Compute lookup tables
        (function () {
            // Compute double table
            var d = [];
            for (var i = 0; i < 256; i++) {
                if (i < 128) {
                    d[i] = i << 1;
                } else {
                    d[i] = (i << 1) ^ 0x11b;
                }
            }

            // Walk GF(2^8)
            var x = 0;
            var xi = 0;
            for (var i = 0; i < 256; i++) {
                // Compute sbox
                var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
                sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
                SBOX[x] = sx;
                INV_SBOX[sx] = x;

                // Compute multiplication
                var x2 = d[x];
                var x4 = d[x2];
                var x8 = d[x4];

                // Compute sub bytes, mix columns tables
                var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
                SUB_MIX_0[x] = (t << 24) | (t >>> 8);
                SUB_MIX_1[x] = (t << 16) | (t >>> 16);
                SUB_MIX_2[x] = (t << 8) | (t >>> 24);
                SUB_MIX_3[x] = t;

                // Compute inv sub bytes, inv mix columns tables
                var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
                INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
                INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
                INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
                INV_SUB_MIX_3[sx] = t;

                // Compute next counter
                if (!x) {
                    x = xi = 1;
                } else {
                    x = x2 ^ d[d[d[x8 ^ x2]]];
                    xi ^= d[d[xi]];
                }
            }
        }());

        // Precomputed Rcon lookup
        var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

        /**
         * AES block cipher algorithm.
         */
        var AES = C_algo.AES = BlockCipher.extend({
            _doReset: function () {
                // Shortcuts
                var key = this._key;
                var keyWords = key.words;
                var keySize = key.sigBytes / 4;

                // Compute number of rounds
                var nRounds = this._nRounds = keySize + 6;

                // Compute number of key schedule rows
                var ksRows = (nRounds + 1) * 4;

                // Compute key schedule
                var keySchedule = this._keySchedule = [];
                for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                    if (ksRow < keySize) {
                        keySchedule[ksRow] = keyWords[ksRow];
                    } else {
                        var t = keySchedule[ksRow - 1];

                        if (!(ksRow % keySize)) {
                            // Rot word
                            t = (t << 8) | (t >>> 24);

                            // Sub word
                            t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                            // Mix Rcon
                            t ^= RCON[(ksRow / keySize) | 0] << 24;
                        } else if (keySize > 6 && ksRow % keySize == 4) {
                            // Sub word
                            t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                        }

                        keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                    }
                }

                // Compute inv key schedule
                var invKeySchedule = this._invKeySchedule = [];
                for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                    var ksRow = ksRows - invKsRow;

                    if (invKsRow % 4) {
                        var t = keySchedule[ksRow];
                    } else {
                        var t = keySchedule[ksRow - 4];
                    }

                    if (invKsRow < 4 || ksRow <= 4) {
                        invKeySchedule[invKsRow] = t;
                    } else {
                        invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                            INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                    }
                }
            },

            encryptBlock: function (M, offset) {
                this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
            },

            decryptBlock: function (M, offset) {
                // Swap 2nd and 4th rows
                var t = M[offset + 1];
                M[offset + 1] = M[offset + 3];
                M[offset + 3] = t;

                this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

                // Inv swap 2nd and 4th rows
                var t = M[offset + 1];
                M[offset + 1] = M[offset + 3];
                M[offset + 3] = t;
            },

            _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
                // Shortcut
                var nRounds = this._nRounds;

                // Get input, add round key
                var s0 = M[offset] ^ keySchedule[0];
                var s1 = M[offset + 1] ^ keySchedule[1];
                var s2 = M[offset + 2] ^ keySchedule[2];
                var s3 = M[offset + 3] ^ keySchedule[3];

                // Key schedule row counter
                var ksRow = 4;

                // Rounds
                for (var round = 1; round < nRounds; round++) {
                    // Shift rows, sub bytes, mix columns, add round key
                    var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                    var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                    var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                    var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

                    // Update state
                    s0 = t0;
                    s1 = t1;
                    s2 = t2;
                    s3 = t3;
                }

                // Shift rows, sub bytes, add round key
                var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
                var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
                var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
                var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

                // Set output
                M[offset] = t0;
                M[offset + 1] = t1;
                M[offset + 2] = t2;
                M[offset + 3] = t3;
            },

            keySize: 256 / 32
        });

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
         */
        C.AES = BlockCipher._createHelper(AES);
    }());


    _.extend(BI, {
        /**
         * aes加密方法
         * aes-128-ecb
         *
         * @example
         *
         *     var ciphertext = BI.aesEncrypt(text, key);
         */
        aesEncrypt: function (text, key) {
            key = CryptoJS.enc.Utf8.parse(key);
            var cipher = CryptoJS.AES.encrypt(text, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            var base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
            return base64Cipher;
        },

        /**
         * aes解密方法
         * @param {String} text 
         * @param {String} key 
         */
        aesDecrypt: function (text, key) {
            key = CryptoJS.enc.Utf8.parse(key);
            var decipher = CryptoJS.AES.decrypt(text, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            return CryptoJS.enc.Utf8.stringify(decipher);
        }
    });
}());

/***/ }),

/***/ 1081:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(101);
__webpack_require__(102);
__webpack_require__(130);
__webpack_require__(123);
__webpack_require__(126);
__webpack_require__(127);
__webpack_require__(124);
__webpack_require__(125);
__webpack_require__(105);
__webpack_require__(107);
__webpack_require__(122);
__webpack_require__(129);
__webpack_require__(128);
__webpack_require__(108);
__webpack_require__(109);
__webpack_require__(110);
__webpack_require__(111);
__webpack_require__(112);
__webpack_require__(113);
__webpack_require__(114);
__webpack_require__(115);
__webpack_require__(116);
__webpack_require__(117);
__webpack_require__(118);
__webpack_require__(119);
__webpack_require__(120);
__webpack_require__(121);
__webpack_require__(746);
__webpack_require__(1082);
__webpack_require__(131);
__webpack_require__(132);
module.exports = __webpack_require__(133);


/***/ }),

/***/ 1082:
/***/ (function(module, exports) {

/**
 * Created by astronaut007 on 2018/8/8
 */
// 牵扯到国际化这些常量在页面加载后再生效
// full day names
BI.Date = BI.Date || {};
BI.Date._DN = ["星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日"];

// short day names
BI.Date._SDN = ["日",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "日"];

// Monday first, etc.
BI.Date._FD = 1;

// full month namesdat
BI.Date._MN = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"];

// short month names
BI.Date._SMN = [0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11];

BI.Date._QN = ["", "第1季度",
    "第2季度",
    "第3季度",
    "第4季度"];

/** Adds the number of days array to the Date object. */
BI.Date._MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 实际上无论周几作为一周的第一天，周初周末都是在-6-0间做偏移，用一个数组就可以
BI.Date._OFFSET = [0, -1, -2, -3, -4, -5, -6];


/***/ }),

/***/ 109:
/***/ (function(module, exports) {

!(function () {
    function aspect (type) {
        return function (target, methodName, advice) {
            var exist = target[methodName],
                dispatcher;

            if (!exist || exist.target != target) {
                dispatcher = target[methodName] = function () {
                    // before methods
                    var beforeArr = dispatcher.before;
                    var args = arguments, next;
                    for (var l = beforeArr.length; l--;) {
                        next = beforeArr[l].advice.apply(this, args);
                        if (next === false) {
                            return false;
                        }
                        args = next || args;
                    }
                    // target method
                    var rs = dispatcher.method.apply(this, args);
                    // after methods
                    var afterArr = dispatcher.after;
                    for (var i = 0, ii = afterArr.length; i < ii; i++) {
                        next = afterArr[i].advice.call(this, rs, args);
                        if (rs === false) {
                            return false;
                        }
                        args = next || args;
                    }
                    return rs;
                };

                dispatcher.before = [];
                dispatcher.after = [];

                if (exist) {
                    dispatcher.method = exist;
                }
                dispatcher.target = target;
            }

            var aspectArr = (dispatcher || exist)[type];
            var obj = {
                advice: advice,
                _index: aspectArr.length,
                remove: function () {
                    aspectArr.splice(this._index, 1);
                }
            };
            aspectArr.push(obj);

            return obj;
        };
    }

    BI.aspect = {
        before: aspect("before"),
        after: aspect("after")
    };

    return BI.aspect;

})();

/***/ }),

/***/ 110:
/***/ (function(module, exports) {


!(function () {

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


    // private method for UTF-8 encoding
    var _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    // private method for UTF-8 decoding
    var _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0, c3 = 0, c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    };

    _.extend(BI, {

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = _utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = _utf8_decode(output);

            return output;

        }
    });
})();

/***/ }),

/***/ 111:
/***/ (function(module, exports) {


BI.Cache = {
    _prefix: "bi",
    setUsername: function (username) {
        localStorage.setItem(BI.Cache._prefix + ".username", (username + "" || "").toUpperCase());
    },
    getUsername: function () {
        return localStorage.getItem(BI.Cache._prefix + ".username") || "";
    },
    _getKeyPrefix: function () {
        return BI.Cache.getUsername() + "." + BI.Cache._prefix + ".";
    },
    _generateKey: function (key) {
        return BI.Cache._getKeyPrefix() + (key || "");
    },
    getItem: function (key) {
        return localStorage.getItem(BI.Cache._generateKey(key));
    },
    setItem: function (key, value) {
        localStorage.setItem(BI.Cache._generateKey(key), value);
    },
    removeItem: function (key) {
        localStorage.removeItem(BI.Cache._generateKey(key));
    },
    clear: function () {
        for (var i = localStorage.length; i >= 0; i--) {
            var key = localStorage.key(i);
            if (key) {
                if (key.indexOf(BI.Cache._getKeyPrefix()) === 0) {
                    localStorage.removeItem(key);
                }
            }
        }
    },
    keys: function () {
        var result = [];
        for (var i = localStorage.length; i >= 0; i--) {
            var key = localStorage.key(i);
            if (key) {
                var prefix = BI.Cache._getKeyPrefix();
                if (key.indexOf(prefix) === 0) {
                    result[result.length] = key.substring(prefix.length);
                }
            }
        }
        return result;
    },

    addCookie: function (name, value, path, expiresHours) {
        var cookieString = name + "=" + escape(value);
        // 判断是否设置过期时间
        if (expiresHours && expiresHours > 0) {
            var date = new Date();
            // expires是标准GMT格式时间，应该使用时间戳作为起始时间
            date.setTime(date.getTime() + expiresHours * 3600 * 1000);
            cookieString = cookieString + "; expires=" + date.toUTCString();
        }
        if (path) {
            cookieString = cookieString + "; path=" + path;
        }
        document.cookie = cookieString;
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {return unescape(arr[2]);}
        return null;
    },
    deleteCookie: function (name, path) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        var cookieString = name + "=v; expires=" + date.toUTCString();
        if (path) {
            cookieString = cookieString + "; path=" + path;
        }
        document.cookie = cookieString;
    }
};

/***/ }),

/***/ 112:
/***/ (function(module, exports) {

BI.CellSizeAndPositionManager = function (cellCount, cellSizeGetter, estimatedCellSize) {
    this._cellSizeGetter = cellSizeGetter;
    this._cellCount = cellCount;
    this._estimatedCellSize = estimatedCellSize;
    this._cellSizeAndPositionData = {};
    this._lastMeasuredIndex = -1;
};

BI.CellSizeAndPositionManager.prototype = {
    constructor: BI.CellSizeAndPositionManager,
    configure: function (cellCount, estimatedCellSize) {
        this._cellCount = cellCount;
        this._estimatedCellSize = estimatedCellSize;
    },

    getCellCount: function () {
        return this._cellCount;
    },

    getEstimatedCellSize: function () {
        return this._estimatedCellSize;
    },

    getLastMeasuredIndex: function () {
        return this._lastMeasuredIndex;
    },

    getSizeAndPositionOfCell: function (index) {
        if (index < 0 || index >= this._cellCount) {
            return;
        }
        if (index > this._lastMeasuredIndex) {
            var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
            var offset = lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size;

            for (var i = this._lastMeasuredIndex + 1; i <= index; i++) {
                var size = this._cellSizeGetter(i);

                if (size == null || isNaN(size)) {
                    continue;
                }

                this._cellSizeAndPositionData[i] = {
                    offset: offset,
                    size: size
                };

                offset += size;
            }

            this._lastMeasuredIndex = index;
        }
        return this._cellSizeAndPositionData[index];
    },

    getSizeAndPositionOfLastMeasuredCell: function () {
        return this._lastMeasuredIndex >= 0
            ? this._cellSizeAndPositionData[this._lastMeasuredIndex]
            : {
                offset: 0,
                size: 0
            };
    },

    getTotalSize: function () {
        var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
        return lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size + (this._cellCount - this._lastMeasuredIndex - 1) * this._estimatedCellSize;
    },

    getUpdatedOffsetForIndex: function (align, containerSize, currentOffset, targetIndex) {
        var datum = this.getSizeAndPositionOfCell(targetIndex);
        var maxOffset = datum.offset;
        var minOffset = maxOffset - containerSize + datum.size;

        var idealOffset;

        switch (align) {
            case "start":
                idealOffset = maxOffset;
                break;
            case "end":
                idealOffset = minOffset;
                break;
            case "center":
                idealOffset = maxOffset - ((containerSize - datum.size) / 2);
                break;
            default:
                idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
                break;
        }

        var totalSize = this.getTotalSize();

        return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
    },

    getVisibleCellRange: function (containerSize, offset) {
        var totalSize = this.getTotalSize();

        if (totalSize === 0) {
            return {};
        }

        var maxOffset = offset + containerSize;
        var start = this._findNearestCell(offset);

        var datum = this.getSizeAndPositionOfCell(start);
        offset = datum.offset + datum.size;

        var stop = start;

        while (offset < maxOffset && stop < this._cellCount - 1) {
            stop++;
            offset += this.getSizeAndPositionOfCell(stop).size;
        }

        return {
            start: start,
            stop: stop
        };
    },

    resetCell: function (index) {
        this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, index - 1);
    },

    _binarySearch: function (high, low, offset) {
        var middle;
        var currentOffset;

        while (low <= high) {
            middle = low + Math.floor((high - low) / 2);
            currentOffset = this.getSizeAndPositionOfCell(middle).offset;

            if (currentOffset === offset) {
                return middle;
            } else if (currentOffset < offset) {
                low = middle + 1;
            } else if (currentOffset > offset) {
                high = middle - 1;
            }
        }

        if (low > 0) {
            return low - 1;
        }
    },

    _exponentialSearch: function (index, offset) {
        var interval = 1;

        while (index < this._cellCount && this.getSizeAndPositionOfCell(index).offset < offset) {
            index += interval;
            interval *= 2;
        }

        return this._binarySearch(Math.min(index, this._cellCount - 1), Math.floor(index / 2), offset);
    },

    _findNearestCell: function (offset) {
        if (isNaN(offset)) {
            return;
        }

        offset = Math.max(0, offset);

        var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
        var lastMeasuredIndex = Math.max(0, this._lastMeasuredIndex);

        if (lastMeasuredCellSizeAndPosition.offset >= offset) {
            return this._binarySearch(lastMeasuredIndex, 0, offset);
        }
        return this._exponentialSearch(lastMeasuredIndex, offset);
        
    }
};

BI.ScalingCellSizeAndPositionManager = function (cellCount, cellSizeGetter, estimatedCellSize, maxScrollSize) {
    this._cellSizeAndPositionManager = new BI.CellSizeAndPositionManager(cellCount, cellSizeGetter, estimatedCellSize);
    this._maxScrollSize = maxScrollSize || 10000000;
};

BI.ScalingCellSizeAndPositionManager.prototype = {
    constructor: BI.ScalingCellSizeAndPositionManager,

    configure: function () {
        this._cellSizeAndPositionManager.configure.apply(this._cellSizeAndPositionManager, arguments);
    },

    getCellCount: function () {
        return this._cellSizeAndPositionManager.getCellCount();
    },

    getEstimatedCellSize: function () {
        return this._cellSizeAndPositionManager.getEstimatedCellSize();
    },

    getLastMeasuredIndex: function () {
        return this._cellSizeAndPositionManager.getLastMeasuredIndex();
    },

    getOffsetAdjustment: function (containerSize, offset) {
        var totalSize = this._cellSizeAndPositionManager.getTotalSize();
        var safeTotalSize = this.getTotalSize();
        var offsetPercentage = this._getOffsetPercentage(containerSize, offset, safeTotalSize);

        return Math.round(offsetPercentage * (safeTotalSize - totalSize));
    },

    getSizeAndPositionOfCell: function (index) {
        return this._cellSizeAndPositionManager.getSizeAndPositionOfCell(index);
    },

    getSizeAndPositionOfLastMeasuredCell: function () {
        return this._cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell();
    },

    getTotalSize: function () {
        return Math.min(this._maxScrollSize, this._cellSizeAndPositionManager.getTotalSize());
    },

    getUpdatedOffsetForIndex: function (align, containerSize, currentOffset, targetIndex) {
        currentOffset = this._safeOffsetToOffset(containerSize, currentOffset);

        var offset = this._cellSizeAndPositionManager.getUpdatedOffsetForIndex(align, containerSize, currentOffset, targetIndex);

        return this._offsetToSafeOffset(containerSize, offset);
    },

    getVisibleCellRange: function (containerSize, offset) {
        offset = this._safeOffsetToOffset(containerSize, offset);

        return this._cellSizeAndPositionManager.getVisibleCellRange(containerSize, offset);
    },

    resetCell: function (index) {
        this._cellSizeAndPositionManager.resetCell(index);
    },

    _getOffsetPercentage: function (containerSize, offset, totalSize) {
        return totalSize <= containerSize
            ? 0
            : offset / (totalSize - containerSize);
    },

    _offsetToSafeOffset: function (containerSize, offset) {
        var totalSize = this._cellSizeAndPositionManager.getTotalSize();
        var safeTotalSize = this.getTotalSize();

        if (totalSize === safeTotalSize) {
            return offset;
        }
        var offsetPercentage = this._getOffsetPercentage(containerSize, offset, totalSize);

        return Math.round(offsetPercentage * (safeTotalSize - containerSize));
        
    },

    _safeOffsetToOffset: function (containerSize, offset) {
        var totalSize = this._cellSizeAndPositionManager.getTotalSize();
        var safeTotalSize = this.getTotalSize();

        if (totalSize === safeTotalSize) {
            return offset;
        }
        var offsetPercentage = this._getOffsetPercentage(containerSize, offset, safeTotalSize);

        return Math.round(offsetPercentage * (totalSize - containerSize));
        
    }
};

/***/ }),

/***/ 113:
/***/ (function(module, exports) {

/**
 * 汉字拼音索引
 */

!(function () {
    var _ChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGHGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";

    // 此处收录了375个多音字,数据来自于http://www.51windows.net/pages/pinyin.asp
    var oMultiDiff = {
        19969: "DZ",
        19975: "WM",
        19988: "QJ",
        20048: "YL",
        20056: "SC",
        20060: "NM",
        20094: "QG",
        20127: "QJ",
        20167: "QC",
        20193: "YG",
        20250: "KH",
        20256: "ZC",
        20282: "SC",
        20285: "QJG",
        20291: "TD",
        20314: "YD",
        20315: "BF",
        20340: "NE",
        20375: "TD",
        20389: "YJ",
        20391: "CZ",
        20415: "PB",
        20446: "YS",
        20447: "SQ",
        20504: "TC",
        20608: "KG",
        20854: "QJ",
        20857: "ZC",
        20911: "PF",
        20985: "AW",
        21032: "PB",
        21048: "XQ",
        21049: "SC",
        21089: "YS",
        21119: "JC",
        21242: "SB",
        21273: "SC",
        21305: "YP",
        21306: "QO",
        21330: "ZC",
        21333: "SDC",
        21345: "QK",
        21378: "CA",
        21397: "SC",
        21414: "XS",
        21442: "SC",
        21477: "JG",
        21480: "TD",
        21484: "ZS",
        21494: "YX",
        21505: "YX",
        21512: "HG",
        21523: "XH",
        21537: "PB",
        21542: "PF",
        21549: "KH",
        21571: "E",
        21574: "DA",
        21588: "TD",
        21589: "O",
        21618: "ZC",
        21621: "KHA",
        21632: "ZJ",
        21654: "KG",
        21679: "LKG",
        21683: "KH",
        21710: "A",
        21719: "YH",
        21734: "WOE",
        21769: "A",
        21780: "WN",
        21804: "XH",
        21834: "A",
        21899: "ZD",
        21903: "RN",
        21908: "WO",
        21939: "ZC",
        21956: "SA",
        21964: "YA",
        21970: "TD",
        22003: "A",
        22031: "JG",
        22040: "XS",
        22060: "ZC",
        22066: "ZC",
        22079: "MH",
        22129: "XJ",
        22179: "XA",
        22237: "NJ",
        22244: "TD",
        22280: "JQ",
        22300: "YH",
        22313: "XW",
        22331: "YQ",
        22343: "YJ",
        22351: "PH",
        22395: "DC",
        22412: "TD",
        22484: "PB",
        22500: "PB",
        22534: "ZD",
        22549: "DH",
        22561: "PB",
        22612: "TD",
        22771: "KQ",
        22831: "HB",
        22841: "JG",
        22855: "QJ",
        22865: "XQ",
        23013: "ML",
        23081: "WM",
        23487: "SX",
        23558: "QJ",
        23561: "YW",
        23586: "YW",
        23614: "YW",
        23615: "SN",
        23631: "PB",
        23646: "ZS",
        23663: "ZT",
        23673: "YG",
        23762: "TD",
        23769: "ZS",
        23780: "QJ",
        23884: "QK",
        24055: "XH",
        24113: "DC",
        24162: "ZC",
        24191: "GA",
        24273: "QJ",
        24324: "NL",
        24377: "TD",
        24378: "QJ",
        24439: "PF",
        24554: "ZS",
        24683: "TD",
        24694: "WE",
        24733: "LK",
        24925: "TN",
        25094: "ZG",
        25100: "XQ",
        25103: "XH",
        25153: "PB",
        25170: "PB",
        25179: "KG",
        25203: "PB",
        25240: "ZS",
        25282: "FB",
        25303: "NA",
        25324: "KG",
        25341: "ZY",
        25373: "WZ",
        25375: "XJ",
        25384: "A",
        25457: "A",
        25528: "SD",
        25530: "SC",
        25552: "TD",
        25774: "ZC",
        25874: "ZC",
        26044: "YW",
        26080: "WM",
        26292: "PB",
        26333: "PB",
        26355: "ZY",
        26366: "CZ",
        26397: "ZC",
        26399: "QJ",
        26415: "ZS",
        26451: "SB",
        26526: "ZC",
        26552: "JG",
        26561: "TD",
        26588: "JG",
        26597: "CZ",
        26629: "ZS",
        26638: "YL",
        26646: "XQ",
        26653: "KG",
        26657: "XJ",
        26727: "HG",
        26894: "ZC",
        26937: "ZS",
        26946: "ZC",
        26999: "KJ",
        27099: "KJ",
        27449: "YQ",
        27481: "XS",
        27542: "ZS",
        27663: "ZS",
        27748: "TS",
        27784: "SC",
        27788: "ZD",
        27795: "TD",
        27812: "O",
        27850: "PB",
        27852: "MB",
        27895: "SL",
        27898: "PL",
        27973: "QJ",
        27981: "KH",
        27986: "HX",
        27994: "XJ",
        28044: "YC",
        28065: "WG",
        28177: "SM",
        28267: "QJ",
        28291: "KH",
        28337: "ZQ",
        28463: "TL",
        28548: "DC",
        28601: "TD",
        28689: "PB",
        28805: "JG",
        28820: "QG",
        28846: "PB",
        28952: "TD",
        28975: "ZC",
        29100: "A",
        29325: "QJ",
        29575: "SL",
        29602: "FB",
        30010: "TD",
        30044: "CX",
        30058: "PF",
        30091: "YSP",
        30111: "YN",
        30229: "XJ",
        30427: "SC",
        30465: "SX",
        30631: "YQ",
        30655: "QJ",
        30684: "QJG",
        30707: "SD",
        30729: "XH",
        30796: "LG",
        30917: "PB",
        31074: "NM",
        31085: "JZ",
        31109: "SC",
        31181: "ZC",
        31192: "MLB",
        31293: "JQ",
        31400: "YX",
        31584: "YJ",
        31896: "ZN",
        31909: "ZY",
        31995: "XJ",
        32321: "PF",
        32327: "ZY",
        32418: "HG",
        32420: "XQ",
        32421: "HG",
        32438: "LG",
        32473: "GJ",
        32488: "TD",
        32521: "QJ",
        32527: "PB",
        32562: "ZSQ",
        32564: "JZ",
        32735: "ZD",
        32793: "PB",
        33071: "PF",
        33098: "XL",
        33100: "YA",
        33152: "PB",
        33261: "CX",
        33324: "BP",
        33333: "TD",
        33406: "YA",
        33426: "WM",
        33432: "PB",
        33445: "JG",
        33486: "ZN",
        33493: "TS",
        33507: "QJ",
        33540: "QJ",
        33544: "ZC",
        33564: "XQ",
        33617: "YT",
        33632: "QJ",
        33636: "XH",
        33637: "YX",
        33694: "WG",
        33705: "PF",
        33728: "YW",
        33882: "SR",
        34067: "WM",
        34074: "YW",
        34121: "QJ",
        34255: "ZC",
        34259: "XL",
        34425: "JH",
        34430: "XH",
        34485: "KH",
        34503: "YS",
        34532: "HG",
        34552: "XS",
        34558: "YE",
        34593: "ZL",
        34660: "YQ",
        34892: "XH",
        34928: "SC",
        34999: "QJ",
        35048: "PB",
        35059: "SC",
        35098: "ZC",
        35203: "TQ",
        35265: "JX",
        35299: "JX",
        35782: "SZ",
        35828: "YS",
        35830: "E",
        35843: "TD",
        35895: "YG",
        35977: "MH",
        36158: "JG",
        36228: "QJ",
        36426: "XQ",
        36466: "DC",
        36710: "CJ",
        36711: "ZYG",
        36767: "PB",
        36866: "SK",
        36951: "YW",
        37034: "YX",
        37063: "XH",
        37218: "ZC",
        37325: "ZC",
        38063: "PB",
        38079: "TD",
        38085: "QY",
        38107: "DC",
        38116: "TD",
        38123: "YD",
        38224: "HG",
        38241: "XTC",
        38271: "ZC",
        38415: "YE",
        38426: "KH",
        38461: "YD",
        38463: "AE",
        38466: "PB",
        38477: "XJ",
        38518: "YT",
        38551: "WK",
        38585: "ZC",
        38704: "XS",
        38739: "LJ",
        38761: "GJ",
        38808: "SQ",
        39048: "JG",
        39049: "XJ",
        39052: "HG",
        39076: "CZ",
        39271: "XT",
        39534: "TD",
        39552: "TD",
        39584: "PB",
        39647: "SB",
        39730: "LG",
        39748: "TPB",
        40109: "ZQ",
        40479: "ND",
        40516: "HG",
        40536: "HG",
        40583: "QJ",
        40765: "YQ",
        40784: "QJ",
        40840: "YK",
        40863: "QJG"
    };

    var _checkPYCh = function (ch) {
        var uni = ch.charCodeAt(0);
        // 如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
        if (uni > 40869 || uni < 19968) {return ch;} // dealWithOthers(ch);
        return (oMultiDiff[uni] ? oMultiDiff[uni] : (_ChineseFirstPY.charAt(uni - 19968)));
    };

    var _mkPYRslt = function (arr, options) {
        var ignoreMulti = options.ignoreMulti;
        var splitChar = options.splitChar;
        var arrRslt = [""], k, multiLen = 0;
        for (var i = 0, len = arr.length; i < len; i++) {
            var str = arr[i];
            var strlen = str.length;
            // 多音字过多的情况下，指数增长会造成浏览器卡死，超过20完全卡死，18勉强能用，考虑到不同性能最好是16或者14
            // 超过14个多音字之后，后面的都用第一个拼音
            if (strlen == 1 || multiLen > 14 || ignoreMulti) {
                var tmpStr = str.substring(0, 1);
                for (k = 0; k < arrRslt.length; k++) {
                    arrRslt[k] += tmpStr;
                }
            } else {
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                multiLen ++;
                for (k = 0; k < strlen; k++) {
                    // 复制一个相同的arrRslt
                    var tmp = tmpArr.slice(0);
                    // 把当前字符str[k]添加到每个元素末尾
                    for (var j = 0; j < tmp.length; j++) {
                        tmp[j] += str.charAt(k);
                    }
                    // 把复制并修改后的数组连接到arrRslt上
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        // BI-56386 这边直接将所有多音字组合拼接是有风险的，因为丢失了每一组的起始索引信息, 外部使用indexOf等方法会造成错位
        // 一旦错位就可能认为不符合条件， 但实际上还是有可能符合条件的，故此处以一个无法搜索的不可见字符作为连接
        return arrRslt.join(splitChar || "").toLowerCase();
    };

    _.extend(BI, {
        makeFirstPY: function (str, options) {
            options = options || {};
            if (typeof (str) !== "string") {return "" + str;}
            var arrResult = []; // 保存中间结果的数组
            for (var i = 0, len = str.length; i < len; i++) {
                // 获得unicode码
                var ch = str.charAt(i);
                // 检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
                arrResult.push(_checkPYCh(ch));
            }
            // 处理arrResult,返回所有可能的拼音首字母串数组
            return _mkPYRslt(arrResult, options);
        }
    });
})();

/***/ }),

/***/ 114:
/***/ (function(module, exports) {


(function () {
    function defaultComparator (a, b) {
        return a < b;
    }

    BI.Heap = function (items, comparator) {
        this._items = items || [];
        this._size = this._items.length;
        this._comparator = comparator || defaultComparator;
        this._heapify();
    };

    BI.Heap.prototype = {
        constructor: BI.Heap,
        empty: function () {
            return this._size === 0;
        },

        pop: function () {
            if (this._size === 0) {
                return;
            }

            var elt = this._items[0];

            var lastElt = this._items.pop();
            this._size--;

            if (this._size > 0) {
                this._items[0] = lastElt;
                this._sinkDown(0);
            }

            return elt;
        },

        push: function (item) {
            this._items[this._size++] = item;
            this._bubbleUp(this._size - 1);
        },

        size: function () {
            return this._size;
        },

        peek: function () {
            if (this._size === 0) {
                return;
            }

            return this._items[0];
        },

        _heapify: function () {
            for (var index = Math.floor((this._size + 1) / 2); index >= 0; index--) {
                this._sinkDown(index);
            }
        },

        _bubbleUp: function (index) {
            var elt = this._items[index];
            while (index > 0) {
                var parentIndex = Math.floor((index + 1) / 2) - 1;
                var parentElt = this._items[parentIndex];

                // if parentElt < elt, stop
                if (this._comparator(parentElt, elt)) {
                    return;
                }

                // swap
                this._items[parentIndex] = elt;
                this._items[index] = parentElt;
                index = parentIndex;
            }
        },

        _sinkDown: function (index) {
            var elt = this._items[index];

            while (true) {
                var leftChildIndex = 2 * (index + 1) - 1;
                var rightChildIndex = 2 * (index + 1);
                var swapIndex = -1;

                if (leftChildIndex < this._size) {
                    var leftChild = this._items[leftChildIndex];
                    if (this._comparator(leftChild, elt)) {
                        swapIndex = leftChildIndex;
                    }
                }

                if (rightChildIndex < this._size) {
                    var rightChild = this._items[rightChildIndex];
                    if (this._comparator(rightChild, elt)) {
                        if (swapIndex === -1 ||
                            this._comparator(rightChild, this._items[swapIndex])) {
                            swapIndex = rightChildIndex;
                        }
                    }
                }

                // if we don't have a swap, stop
                if (swapIndex === -1) {
                    return;
                }

                this._items[index] = this._items[swapIndex];
                this._items[swapIndex] = elt;
                index = swapIndex;
            }
        }
    };
})();


/***/ }),

/***/ 115:
/***/ (function(module, exports) {


!(function () {
    BI.LinkHashMap = function () {
        this.array = [];
        this.map = {};
    };
    BI.LinkHashMap.prototype = {
        constructor: BI.LinkHashMap,
        has: function (key) {
            if (key in this.map) {
                return true;
            }
            return false;
        },

        add: function (key, value) {
            if (typeof key === "undefined") {
                return;
            }
            if (key in this.map) {
                this.map[key] = value;
            } else {
                this.array.push(key);
                this.map[key] = value;
            }
        },

        remove: function (key) {
            if (key in this.map) {
                delete this.map[key];
                for (var i = 0; i < this.array.length; i++) {
                    if (this.array[i] == key) {
                        this.array.splice(i, 1);
                        break;
                    }
                }
            }
        },

        size: function () {
            return this.array.length;
        },

        each: function (fn, scope) {
            var scope = scope || window;
            var fn = fn || null;
            if (fn == null || typeof (fn) !== "function") {
                return;
            }
            for (var i = 0; i < this.array.length; i++) {
                var key = this.array[i];
                var value = this.map[key];
                var re = fn.call(scope, key, value, i, this.array, this.map);
                if (re == false) {
                    break;
                }
            }
        },

        get: function (key) {
            return this.map[key];
        },

        toArray: function () {
            var array = [];
            this.each(function (key, value) {
                array.push(value);
            });
            return array;
        }
    };
})();

/***/ }),

/***/ 116:
/***/ (function(module, exports) {


!(function () {
    BI.LRU = function (limit) {
        this.size = 0;
        this.limit = limit;
        this.head = this.tail = undefined;
        this._keymap = {};
    };

    var p = BI.LRU.prototype;

    p.put = function (key, value) {
        var removed;
        if (this.size === this.limit) {
            removed = this.shift();
        }

        var entry = this.get(key, true);
        if (!entry) {
            entry = {
                key: key
            };
            this._keymap[key] = entry;
            if (this.tail) {
                this.tail.newer = entry;
                entry.older = this.tail;
            } else {
                this.head = entry;
            }
            this.tail = entry;
            this.size++;
        }
        entry.value = value;

        return removed;
    };

    p.shift = function () {
        var entry = this.head;
        if (entry) {
            this.head = this.head.newer;
            this.head.older = undefined;
            entry.newer = entry.older = undefined;
            this._keymap[entry.key] = undefined;
            this.size--;
        }
        return entry;
    };


    p.get = function (key, returnEntry) {
        var entry = this._keymap[key];
        if (entry === undefined) return;
        if (entry === this.tail) {
            return returnEntry
                ? entry
                : entry.value;
        }
        // HEAD--------------TAIL
        //   <.older   .newer>
        //  <--- add direction --
        //   A  B  C  <D>  E
        if (entry.newer) {
            if (entry === this.head) {
                this.head = entry.newer;
            }
            entry.newer.older = entry.older; // C <-- E.
        }
        if (entry.older) {
            entry.older.newer = entry.newer; // C. --> E
        }
        entry.newer = undefined; // D --x
        entry.older = this.tail; // D. --> E
        if (this.tail) {
            this.tail.newer = entry; // E. <-- D
        }
        this.tail = entry;
        return returnEntry
            ? entry
            : entry.value;
    };

    p.has = function (key) {
        return this._keymap[key] != null;
    };
})();

/***/ }),

/***/ 117:
/***/ (function(module, exports) {

// 线段树
(function () {
    var parent = function (node) {
        return Math.floor(node / 2);
    };

    var Int32Array = _global.Int32Array || function (size) {
        var xs = [];
        for (var i = size - 1; i >= 0; --i) {
            xs[i] = 0;
        }
        return xs;
    };

    var ceilLog2 = function (x) {
        var y = 1;
        while (y < x) {
            y *= 2;
        }
        return y;
    };

    BI.PrefixIntervalTree = function (xs) {
        this._size = xs.length;
        this._half = ceilLog2(this._size);
        // _heap是一个_size两倍以上的堆
        this._heap = new Int32Array(2 * this._half);

        var i;
        // 初始化 >= _size 的堆空间, 即叶子节点
        for (i = 0; i < this._size; ++i) {
            this._heap[this._half + i] = xs[i];
        }
        // 初始化 < _size 的堆空间, 即非叶子节点，根节点包含整个区间
        for (i = this._half - 1; i > 0; --i) {
            this._heap[i] = this._heap[2 * i] + this._heap[2 * i + 1];
        }
    };

    BI.PrefixIntervalTree.prototype = {
        constructor: BI.PrefixIntervalTree,
        // 往_half之后的空间set值，需要更新其所有祖先节点的值
        set: function (index, value) {
            var node = this._half + index;
            this._heap[node] = value;

            node = parent(node);
            for (; node !== 0; node = parent(node)) {
                this._heap[node] =
                    this._heap[2 * node] + this._heap[2 * node + 1];
            }
        },

        get: function (index) {
            var node = this._half + index;
            return this._heap[node];
        },

        getSize: function () {
            return this._size;
        },

        /**
         * get(0) + get(1) + ... + get(end - 1).
         */
        sumUntil: function (end) {
            if (end === 0) {
                return 0;
            }

            var node = this._half + end - 1;
            var sum = this._heap[node];
            for (; node !== 1; node = parent(node)) {
                if (node % 2 === 1) {
                    sum += this._heap[node - 1];
                }
            }

            return sum;
        },

        /**
         * get(0) + get(1) + ... + get(inclusiveEnd).
         */
        sumTo: function (inclusiveEnd) {
            return this.sumUntil(inclusiveEnd + 1);
        },

        /**
         * sum get(begin) + get(begin + 1) + ... + get(end - 1).
         */
        sum: function (begin, end) {
            return this.sumUntil(end) - this.sumUntil(begin);
        },

        /**
         * Returns the smallest i such that 0 <= i <= size and sumUntil(i) <= t, or
         * -1 if no such i exists.
         */
        greatestLowerBound: function (t) {
            if (t < 0) {
                return -1;
            }

            var node = 1;
            if (this._heap[node] <= t) {
                return this._size;
            }

            while (node < this._half) {
                var leftSum = this._heap[2 * node];
                if (t < leftSum) {
                    node = 2 * node;
                } else {
                    node = 2 * node + 1;
                    t -= leftSum;
                }
            }

            return node - this._half;
        },

        /**
         * Returns the smallest i such that 0 <= i <= size and sumUntil(i) < t, or
         * -1 if no such i exists.
         */
        greatestStrictLowerBound: function (t) {
            if (t <= 0) {
                return -1;
            }

            var node = 1;
            if (this._heap[node] < t) {
                return this._size;
            }

            while (node < this._half) {
                var leftSum = this._heap[2 * node];
                if (t <= leftSum) {
                    node = 2 * node;
                } else {
                    node = 2 * node + 1;
                    t -= leftSum;
                }
            }

            return node - this._half;
        },

        /**
         * Returns the smallest i such that 0 <= i <= size and t <= sumUntil(i), or
         * size + 1 if no such i exists.
         */
        leastUpperBound: function (t) {
            return this.greatestStrictLowerBound(t) + 1;
        },

        /**
         * Returns the smallest i such that 0 <= i <= size and t < sumUntil(i), or
         * size + 1 if no such i exists.
         */
        leastStrictUpperBound: function (t) {
            return this.greatestLowerBound(t) + 1;
        }
    };

    BI.PrefixIntervalTree.uniform = function (size, initialValue) {
        var xs = [];
        for (var i = size - 1; i >= 0; --i) {
            xs[i] = initialValue;
        }

        return new BI.PrefixIntervalTree(xs);
    };

    BI.PrefixIntervalTree.empty = function (size) {
        return BI.PrefixIntervalTree.uniform(size, 0);
    };

})();


/***/ }),

/***/ 118:
/***/ (function(module, exports) {


!(function () {
    BI.Queue = function (capacity) {
        this.capacity = capacity;
        this.array = [];
    };
    BI.Queue.prototype = {
        constructor: BI.Queue,

        contains: function (v) {
            return BI.contains(this.array, v);
        },

        indexOf: function (v) {
            return BI.contains(this.array, v);
        },

        getElementByIndex: function (index) {
            return this.array[index];
        },

        push: function (v) {
            this.array.push(v);
            if (this.capacity && this.array.length > this.capacity) {
                this.array.shift();
            }
        },

        pop: function () {
            this.array.pop();
        },

        shift: function () {
            this.array.shift();
        },

        unshift: function (v) {
            this.array.unshift(v);
            if (this.capacity && this.array.length > this.capacity) {
                this.array.pop();
            }
        },

        remove: function (v) {
            BI.remove(this.array, v);
        },

        splice: function () {
            this.array.splice.apply(this.array, arguments);
        },

        slice: function () {
            this.array.slice.apply(this.array, arguments);
        },

        size: function () {
            return this.array.length;
        },

        each: function (fn, scope) {
            var scope = scope || window;
            var fn = fn || null;
            if (fn == null || typeof (fn) !== "function") {
                return;
            }
            for (var i = 0; i < this.array.length; i++) {
                var re = fn.call(scope, i, this.array[i], this.array);
                if (re == false) {
                    break;
                }
            }
        },

        toArray: function () {
            return this.array;
        },

        fromArray: function (array) {
            var self = this;
            BI.each(array, function (i, v) {
                self.push(v);
            });
        },

        clear: function () {
            this.array.length = 0;
        }
    };
})();

/***/ }),

/***/ 119:
/***/ (function(module, exports) {

!(function () {
    var Section = function (height, width, x, y) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;

        this._indexMap = {};
        this._indices = [];
    };

    Section.prototype = {
        constructor: Section,
        addCellIndex: function (index) {
            if (!this._indexMap[index]) {
                this._indexMap[index] = true;
                this._indices.push(index);
            }
        },

        getCellIndices: function () {
            return this._indices;
        }
    };

    var SECTION_SIZE = 100;
    BI.SectionManager = function (sectionSize) {
        this._sectionSize = sectionSize || SECTION_SIZE;
        this._cellMetadata = [];
        this._sections = {};
    };

    BI.SectionManager.prototype = {
        constructor: BI.SectionManager,
        getCellIndices: function (height, width, x, y) {
            var indices = {};

            BI.each(this.getSections(height, width, x, y), function (i, section) {
                BI.each(section.getCellIndices(), function (j, index) {
                    indices[index] = index;
                });
            });

            return BI.map(BI.keys(indices), function (i, index) {
                return indices[index];
            });
        },

        getCellMetadata: function (index) {
            return this._cellMetadata[index];
        },

        getSections: function (height, width, x, y) {
            var sectionXStart = Math.floor(x / this._sectionSize);
            var sectionXStop = Math.floor((x + width - 1) / this._sectionSize);
            var sectionYStart = Math.floor(y / this._sectionSize);
            var sectionYStop = Math.floor((y + height - 1) / this._sectionSize);

            var sections = [];

            for (var sectionX = sectionXStart; sectionX <= sectionXStop; sectionX++) {
                for (var sectionY = sectionYStart; sectionY <= sectionYStop; sectionY++) {
                    var key = sectionX + "." + sectionY;

                    if (!this._sections[key]) {
                        this._sections[key] = new Section(this._sectionSize, this._sectionSize, sectionX * this._sectionSize, sectionY * this._sectionSize);
                    }

                    sections.push(this._sections[key]);
                }
            }

            return sections;
        },

        getTotalSectionCount: function () {
            return BI.size(this._sections);
        },

        registerCell: function (cellMetadatum, index) {
            this._cellMetadata[index] = cellMetadatum;

            BI.each(this.getSections(cellMetadatum.height, cellMetadatum.width, cellMetadatum.x, cellMetadatum.y), function (i, section) {
                section.addCellIndex(index);
            });
        }
    };
})();

/***/ }),

/***/ 120:
/***/ (function(module, exports) {

(function () {
    BI.Tree = function () {
        this.root = new BI.Node(BI.UUID());
    };

    BI.Tree.prototype = {
        constructor: BI.Tree,
        addNode: function (node, newNode, index) {
            if (BI.isNull(newNode)) {
                this.root.addChild(node, index);
            } else if (BI.isNull(node)) {
                this.root.addChild(newNode, index);
            } else {
                node.addChild(newNode, index);
            }
        },

        isRoot: function (node) {
            return node === this.root;
        },

        getRoot: function () {
            return this.root;
        },

        clear: function () {
            this.root.clear();
        },

        initTree: function (nodes) {
            var self = this;
            this.clear();
            var queue = [];
            BI.each(nodes, function (i, node) {
                var n = new BI.Node(node);
                n.set("data", node);
                self.addNode(n);
                queue.push(n);
            });
            while (!BI.isEmpty(queue)) {
                var parent = queue.shift();
                var node = parent.get("data");
                BI.each(node.children, function (i, child) {
                    var n = new BI.Node(child);
                    n.set("data", child);
                    queue.push(n);
                    self.addNode(parent, n);
                });
            }
        },

        _toJSON: function (node) {
            var self = this;
            var children = [];
            BI.each(node.getChildren(), function (i, child) {
                children.push(self._toJSON(child));
            });
            return BI.extend({
                id: node.id
            }, BI.deepClone(node.get("data")), (children.length > 0 ? {
                    children: children
                } : {}));
        },

        toJSON: function (node) {
            var self = this, result = [];
            BI.each((node || this.root).getChildren(), function (i, child) {
                result.push(self._toJSON(child));
            });
            return result;
        },

        _toJSONWithNode: function (node) {
            var self = this;
            var children = [];
            BI.each(node.getChildren(), function (i, child) {
                children.push(self._toJSONWithNode(child));
            });
            return BI.extend({
                id: node.id
            }, BI.deepClone(node.get("data")), {
                node: node
            }, (children.length > 0 ? {
                    children: children
                } : {}));
        },

        toJSONWithNode: function (node) {
            var self = this, result = [];
            BI.each((node || this.root).getChildren(), function (i, child) {
                result.push(self._toJSONWithNode(child));
            });
            return result;
        },

        search: function (root, target, param) {
            if (!(root instanceof BI.Node)) {
                return arguments.callee.apply(this, [this.root, root, target]);
            }
            var self = this, next = null;

            if (BI.isNull(target)) {
                return null;
            }
            if (BI.isEqual(root[param || "id"], target)) {
                return root;
            }
            BI.any(root.getChildren(), function (i, child) {
                next = self.search(child, target, param);
                if (null !== next) {
                    return true;
                }
            });
            return next;
        },

        _traverse: function (node, callback) {
            var queue = [];
            queue.push(node);
            while (!BI.isEmpty(queue)) {
                var temp = queue.shift();
                var b = callback && callback(temp);
                if (b === false) {
                    break;
                }
                if (b === true) {
                    continue;
                }
                if (temp != null) {
                    queue = queue.concat(temp.getChildren());
                }
            }
        },

        traverse: function (callback) {
            this._traverse(this.root, callback);
        },

        _recursion: function (node, route, callback) {
            var self = this;
            return BI.every(node.getChildren(), function (i, child) {
                var next = BI.clone(route);
                next.push(child.id);
                var b = callback && callback(child, next);
                if (b === false) {
                    return false;
                }
                if (b === true) {
                    return true;
                }
                return self._recursion(child, next, callback);
            });
        },

        recursion: function (callback) {
            this._recursion(this.root, [], callback);
        },

        inOrderTraverse: function (callback) {
            this._inOrderTraverse(this.root, callback);
        },

        // 中序遍历(递归)
        _inOrderTraverse: function (node, callback) {
            if (node != null) {
                this._inOrderTraverse(node.getLeft());
                callback && callback(node);
                this._inOrderTraverse(node.getRight());
            }
        },

        // 中序遍历(非递归)
        nrInOrderTraverse: function (callback) {

            var stack = [];
            var node = this.root;
            while (node != null || !BI.isEmpty(stack)) {
                while (node != null) {
                    stack.push(node);
                    node = node.getLeft();
                }
                node = stack.pop();
                callback && callback(node);
                node = node.getRight();
            }
        },

        preOrderTraverse: function (callback) {
            this._preOrderTraverse(this.root, callback);
        },

        // 先序遍历(递归)
        _preOrderTraverse: function (node, callback) {
            if (node != null) {
                callback && callback(node);
                this._preOrderTraverse(node.getLeft());
                this._preOrderTraverse(node.getRight());
            }
        },

        // 先序遍历（非递归）
        nrPreOrderTraverse: function (callback) {

            var stack = [];
            var node = this.root;

            while (node != null || !BI.isEmpty(stack)) {

                while (node != null) {
                    callback && callback(node);
                    stack.push(node);
                    node = node.getLeft();
                }
                node = stack.pop();
                node = node.getRight();
            }
        },

        postOrderTraverse: function (callback) {
            this._postOrderTraverse(this.root, callback);
        },

        // 后序遍历(递归)
        _postOrderTraverse: function (node, callback) {
            if (node != null) {
                this._postOrderTraverse(node.getLeft());
                this._postOrderTraverse(node.getRight());
                callback && callback(node);
            }
        },

        // 后续遍历(非递归)
        nrPostOrderTraverse: function (callback) {

            var stack = [];
            var node = this.root;
            var preNode = null;// 表示最近一次访问的节点

            while (node != null || !BI.isEmpty(stack)) {

                while (node != null) {
                    stack.push(node);
                    node = node.getLeft();
                }

                node = BI.last(stack);

                if (node.getRight() == null || node.getRight() == preNode) {
                    callback && callback(node);
                    node = stack.pop();
                    preNode = node;
                    node = null;
                } else {
                    node = node.getRight();
                }
            }
        }
    };

    BI.Node = function (id) {
        if (BI.isObject(id)) {
            BI.extend(this, id);
        } else {
            this.id = id;
        }
        this.clear.apply(this, arguments);
    };

    BI.Node.prototype = {
        constructor: BI.Node,

        set: function (key, value) {
            if (BI.isObject(key)) {
                BI.extend(this, key);
                return;
            }
            this[key] = value;
        },

        get: function (key) {
            return this[key];
        },

        isLeaf: function () {
            return BI.isEmpty(this.children);
        },

        getChildren: function () {
            return this.children;
        },

        getChildrenLength: function () {
            return this.children.length;
        },

        getFirstChild: function () {
            return BI.first(this.children);
        },

        getLastChild: function () {
            return BI.last(this.children);
        },

        setLeft: function (left) {
            this.left = left;
        },

        getLeft: function () {
            return this.left;
        },

        setRight: function (right) {
            this.right = right;
        },

        getRight: function () {
            return this.right;
        },

        setParent: function (parent) {
            this.parent = parent;
        },

        getParent: function () {
            return this.parent;
        },

        getChild: function (index) {
            return this.children[index];
        },

        getChildIndex: function (id) {
            return BI.findIndex(this.children, function (i, ch) {
                return ch.get("id") === id;
            });
        },

        removeChild: function (id) {
            this.removeChildByIndex(this.getChildIndex(id));
        },

        removeChildByIndex: function (index) {
            var before = this.getChild(index - 1);
            var behind = this.getChild(index + 1);
            if (before != null) {
                before.setRight(behind || null);
            }
            if (behind != null) {
                behind.setLeft(before || null);
            }
            this.children.splice(index, 1);
        },

        removeAllChilds: function () {
            this.children = [];
        },

        addChild: function (child, index) {
            var cur = null;
            if (BI.isUndefined(index)) {
                cur = this.children.length - 1;
            } else {
                cur = index - 1;
            }
            child.setParent(this);
            if (cur >= 0) {
                this.getChild(cur) && this.getChild(cur).setRight(child);
                child.setLeft(this.getChild(cur));
            }
            if (BI.isUndefined(index)) {
                this.children.push(child);
            } else {
                this.children.splice(index, 0, child);
            }
        },

        equals: function (obj) {
            return this === obj || this.id === obj.id;
        },

        clear: function () {
            this.parent = null;
            this.left = null;
            this.right = null;
            this.children = [];
        }
    };

    BI.extend(BI.Tree, {
        transformToArrayFormat: function (nodes, pId) {
            if (!nodes) return [];
            var r = [];
            if (BI.isArray(nodes)) {
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = BI.clone(nodes[i]);
                    node.pId = node.pId == null ? pId : node.pId;
                    delete node.children;
                    r.push(node);
                    if (nodes[i]["children"]) {
                        r = r.concat(BI.Tree.transformToArrayFormat(nodes[i]["children"], node.id));
                    }
                }
            } else {
                var newNodes = BI.clone(nodes);
                newNodes.pId = newNodes.pId == null ? pId : newNodes.pId;
                delete newNodes.children;
                r.push(newNodes);
                if (nodes["children"]) {
                    r = r.concat(BI.Tree.transformToArrayFormat(nodes["children"], newNodes.id));
                }
            }
            return r;
        },

        arrayFormat: function (nodes, pId) {
            if (!nodes) {
                return [];
            }
            var r = [];
            if (BI.isArray(nodes)) {
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    node.pId = node.pId == null ? pId : node.pId;
                    r.push(node);
                    if (nodes[i]["children"]) {
                        r = r.concat(BI.Tree.arrayFormat(nodes[i]["children"], node.id));
                    }
                }
            } else {
                var newNodes = nodes;
                newNodes.pId = newNodes.pId == null ? pId : newNodes.pId;
                r.push(newNodes);
                if (nodes["children"]) {
                    r = r.concat(BI.Tree.arrayFormat(nodes["children"], newNodes.id));
                }
            }
            return r;
        },

        transformToTreeFormat: function (sNodes) {
            var i, l;
            if (!sNodes) {
                return [];
            }

            if (BI.isArray(sNodes)) {
                var r = [];
                var tmpMap = {};
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (BI.isNull(sNodes[i].id)) {
                        return sNodes;
                    }
                    tmpMap[sNodes[i].id] = BI.clone(sNodes[i]);
                }
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (tmpMap[sNodes[i].pId] && sNodes[i].id !== sNodes[i].pId) {
                        if (!tmpMap[sNodes[i].pId].children) {
                            tmpMap[sNodes[i].pId].children = [];
                        }
                        tmpMap[sNodes[i].pId].children.push(tmpMap[sNodes[i].id]);
                    } else {
                        r.push(tmpMap[sNodes[i].id]);
                    }
                    delete tmpMap[sNodes[i].id].pId;
                }
                return r;
            }
            return [sNodes];
            
        },

        treeFormat: function (sNodes) {
            var i, l;
            if (!sNodes) {
                return [];
            }

            if (BI.isArray(sNodes)) {
                var r = [];
                var tmpMap = {};
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (BI.isNull(sNodes[i].id)) {
                        return sNodes;
                    }
                    tmpMap[sNodes[i].id] = sNodes[i];
                }
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (tmpMap[sNodes[i].pId] && sNodes[i].id !== sNodes[i].pId) {
                        if (!tmpMap[sNodes[i].pId].children) {
                            tmpMap[sNodes[i].pId].children = [];
                        }
                        tmpMap[sNodes[i].pId].children.push(tmpMap[sNodes[i].id]);
                    } else {
                        r.push(tmpMap[sNodes[i].id]);
                    }
                }
                return r;
            }
            return [sNodes];
            
        },

        traversal: function (array, callback) {
            if (BI.isNull(array)) {
                return;
            }
            var self = this;
            BI.some(array, function (i, item) {
                if (callback(i, item) === false) {
                    return true;
                }
                self.traversal(item.children, callback);
            });
        }
    });
})();

/***/ }),

/***/ 121:
/***/ (function(module, exports) {

// 向量操作
BI.Vector = function (x, y) {
    this.x = x;
    this.y = y;
};
BI.Vector.prototype = {
    constructor: BI.Vector,
    cross: function (v) {
        return (this.x * v.y - this.y * v.x);
    },
    length: function (v) {
        return (Math.sqrt(this.x * v.x + this.y * v.y));
    }
};
BI.Region = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};
BI.Region.prototype = {
    constructor: BI.Region,
    // 判断两个区域是否相交，若相交，则要么顶点互相包含，要么矩形边界（或对角线）相交
    isIntersects: function (obj) {
        if (this.isPointInside(obj.x, obj.y) ||
            this.isPointInside(obj.x + obj.w, obj.y) ||
            this.isPointInside(obj.x, obj.y + obj.h) ||
            this.isPointInside(obj.x + obj.w, obj.y + obj.h)) {
            return true;
        } else if (obj.isPointInside(this.x, this.y) ||
            obj.isPointInside(this.x + this.w, this.y) ||
            obj.isPointInside(this.x, this.y + this.h) ||
            obj.isPointInside(this.x + this.w, this.y + this.h)) {
            return true;
        } else if (obj.x != null && obj.y != null)// 判断矩形对角线相交 |v1 X v2||v1 X v3| < 0
        {
            var vector1 = new BI.Vector(this.w, this.h);// 矩形对角线向量
            var vector2 = new BI.Vector(obj.x - this.x, obj.y - this.y);
            var vector3 = new BI.Vector(vector2.x + obj.w, vector2.y + obj.h);
            if ((vector1.cross(vector2) * vector1.cross(vector3)) < 0) {
                return true;
            }
        }
        return false;
    },
    // 判断一个点是否在这个区域内部
    isPointInside: function (x, y) {
        if (this.x == null || this.y == null) {
            return false;
        }
        if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
            return true;
        }
        return false;
    },
    // 返回区域的重心，因为是矩形所以返回中点
    getPosition: function () {
        var pos = [];
        pos.push(this.x + this.w / 2);
        pos.push(this.y + this.h / 2);
        return pos;
    }
};

/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function () {
    var _global;
    if (typeof window !== "undefined") {
        _global = window;
    } else if (typeof global !== "undefined") {
        _global = global;
    } else if (typeof self !== "undefined") {
        _global = self;
    } else {
        _global = this;
    }
    if (!_global.BI) {
        _global.BI = {};
    }

    function isEmpty (value) {
        // 判断是否为空值
        var result = value === "" || value === null || value === undefined;
        return result;
    }

    // 判断是否是无效的日期
    function isInvalidDate (date) {
        return date == "Invalid Date" || date == "NaN";
    }

    /**
     * CHART-1400
     * 使用数值计算的方式来获取任意数值的科学技术表示值。
     * 科学计数格式
     */
    function _eFormat (text, fmt) {
        text = +text;

        return eFormat(text, fmt);

        /**
         * 科学计数格式具体计算过程
         * @param num
         * @param format {String}有两种形式，
         *      1、"0.00E00"这样的字符串表示正常的科学计数表示，只不过规定了数值精确到百分位，
         *         而数量级的绝对值如果是10以下的时候在前面补零。
         *      2、 "##0.0E0"这样的字符串则规定用科学计数法表示之后的数值的整数部分是三位，精确到十分位，
         *         数量级没有规定，因为没见过实数里有用科学计数法表示之后E的后面会小于一位的情况（0无所谓）。
         * @returns {*}
         */
        function eFormat (num, format) {
            var neg = num < 0 ? (num *= -1, "-") : "",
                magnitudeNeg = "";

            var funcName = num > 0 && num < 1 ? "floor" : "ceil";  // -0.9999->-1
            // 数量级
            var magnitude = Math[funcName](Math.log(num) / Math.log(10));

            if (!isFinite(magnitude)) {
                return format.replace(/#/ig, "").replace(/\.e/ig, "E");
            }

            num = num / Math.pow(10, magnitude);

            // 让num转化成[1, 10)区间上的数
            if (num > 0 && num < 1) {
                num *= 10;
                magnitude -= 1;
            }

            // 计算出format中需要显示的整数部分的位数，然后更新这个数值，也更新数量级
            var integerLen = getInteger(magnitude, format);
            integerLen > 1 && (magnitude -= integerLen - 1, num *= Math.pow(10, integerLen - 1));

            magnitude < 0 && (magnitudeNeg = "-", magnitude *= -1);

            // 获取科学计数法精确到的位数
            var precision = getPrecision(format);
            // 判断num经过四舍五入之后是否有进位
            var isValueCarry = isValueCarried(num);

            num *= Math.pow(10, precision);
            num = Math.round(num);
            // 如果出现进位的情况，将num除以10
            isValueCarry && (num /= 10, magnitude += magnitudeNeg === "-" ? -1 : 1);
            num /= Math.pow(10, precision);

            // 小数部分保留precision位
            num = num.toFixed(precision);
            // 格式化指数的部分
            magnitude = formatExponential(format, magnitude, magnitudeNeg);

            return neg + num + "E" + magnitude;
        }

        // 获取format格式规定的数量级的形式
        function formatExponential (format, num, magnitudeNeg) {
            num += "";
            if (!/e/ig.test(format)) {
                return num;
            }
            format = format.split(/e/ig)[1];

            while (num.length < format.length) {
                num = "0" + num;
            }

            // 如果magnitudeNeg是一个"-"，而且num正好全是0，那么就别显示负号了
            var isAllZero = true;
            for (var i = 0, len = num.length; i < len; i++) {
                if (!isAllZero) {
                    continue;
                }
                isAllZero = num.charAt(i) === "0";
            }
            magnitudeNeg = isAllZero ? "" : magnitudeNeg;

            return magnitudeNeg + num;
        }

        // 获取format规定的科学计数法精确到的位数
        function getPrecision (format) {
            if (!/e/ig.test(format)) {
                return 0;
            }
            var arr = format.split(/e/ig)[0].split(".");

            return arr.length > 1 ? arr[1].length : 0;
        }

        // 获取数值科学计数法表示之后整数的位数
        // 这边我们还需要考虑#和0的问题
        function getInteger (magnitude, format) {
            if (!/e/ig.test(format)) {
                return 0;
            }
            // return format.split(/e/ig)[0].split(".")[0].length;

            var formatLeft = format.split(/e/ig)[0].split(".")[0], i, f, len = formatLeft.length;
            var valueLeftLen = 0;

            for (i = 0; i < len; i++) {
                f = formatLeft.charAt(i);
                // "#"所在的位置到末尾长度小于等于值的整数部分长度，那么这个#才可以占位
                if (f == 0 || (f == "#" && (len - i <= magnitude + 1))) {
                    valueLeftLen++;
                }
            }

            return valueLeftLen;
        }

        // 判断num通过round函数之后是否有进位
        function isValueCarried (num) {
            var roundNum = Math.round(num);
            num = (num + "").split(".")[0];
            roundNum = (roundNum + "").split(".")[0];
            return num.length !== roundNum.length;
        }
    }

    //'#.##'之类的格式处理 1.324e-18 这种的科学数字
    function _dealNumberPrecision (text, fright) {
        if (/[eE]/.test(text)) {
            var precision = 0, i = 0, ch;

            if (/[%‰]$/.test(fright)) {
                precision = /[%]$/.test(fright) ? 2 : 3;
            }

            for (var len = fright.length; i < len; i++) {
                if ((ch = fright.charAt(i)) == "0" || ch == "#") {
                    precision++;
                }
            }
            return Number(text).toFixed(precision);
        }

        return text;
    }

    /**
     * 数字格式
     */
    function _numberFormat (text, format) {
        var text = text + "";

        //在调用数字格式的时候如果text里没有任何数字则不处理
        if (!(/[0-9]/.test(text)) || !format) {
            return text;
        }

        // 数字格式，区分正负数
        var numMod = format.indexOf(";");
        if (numMod > -1) {
            if (text >= 0) {
                return _numberFormat(text + "", format.substring(0, numMod));
            }
            return _numberFormat((-text) + "", format.substr(numMod + 1));

        } else {
            // 兼容格式处理负数的情况(copy:fr-jquery.format.js)
            if (+text < 0 && format.charAt(0) !== "-") {
                return _numberFormat((-text) + "", "-" + format);
            }
        }

        var fp = format.split("."), fleft = fp[0] || "", fright = fp[1] || "";
        text = _dealNumberPrecision(text, fright);
        var tp = text.split("."), tleft = tp[0] || "", tright = tp[1] || "";

        // 百分比,千分比的小数点移位处理
        if (/[%‰]$/.test(format)) {
            var paddingZero = /[%]$/.test(format) ? "00" : "000";
            tright += paddingZero;
            tleft += tright.substr(0, paddingZero.length);
            tleft = tleft.replace(/^0+/gi, "");
            tright = tright.substr(paddingZero.length).replace(/0+$/gi, "");
        }
        var right = _dealWithRight(tright, fright);
        if (right.leftPlus) {
            // 小数点后有进位
            tleft = parseInt(tleft) + 1 + "";

            tleft = isNaN(tleft) ? "1" : tleft;
        }
        right = right.num;
        var left = _dealWithLeft(tleft, fleft);
        if (!(/[0-9]/.test(left))) {
            left = left + "0";
        }
        if (!(/[0-9]/.test(right))) {
            return left + right;
        } else {
            return left + "." + right;
        }
    }

    /**
     * 处理小数点右边小数部分
     * @param tright 右边内容
     * @param fright 右边格式
     * @returns {JSON} 返回处理结果和整数部分是否需要进位
     * @private
     */
    function _dealWithRight (tright, fright) {
        var right = "", j = 0, i = 0;
        for (var len = fright.length; i < len; i++) {
            var ch = fright.charAt(i);
            var c = tright.charAt(j);
            switch (ch) {
                case "0":
                    if (isEmpty(c)) {
                        c = "0";
                    }
                    right += c;
                    j++;
                    break;
                case "#":
                    right += c;
                    j++;
                    break;
                default :
                    right += ch;
                    break;
            }
        }
        var rll = tright.substr(j);
        var result = {};
        if (!isEmpty(rll) && rll.charAt(0) > 4) {
            // 有多余字符，需要四舍五入
            result.leftPlus = true;
            var numReg = right.match(/^[0-9]+/);
            if (numReg) {
                var num = numReg[0];
                var orilen = num.length;
                var newnum = parseInt(num) + 1 + "";
                // 进位到整数部分
                if (newnum.length > orilen) {
                    newnum = newnum.substr(1);
                } else {
                    newnum = BI.leftPad(newnum, orilen, "0");
                    result.leftPlus = false;
                }
                right = right.replace(/^[0-9]+/, newnum);
            }
        }
        result.num = right;
        return result;
    }

    /**
     * 处理小数点左边整数部分
     * @param tleft 左边内容
     * @param fleft 左边格式
     * @returns {string} 返回处理结果
     * @private
     */
    function _dealWithLeft (tleft, fleft) {
        var left = "";
        var j = tleft.length - 1;
        var combo = -1, last = -1;
        var i = fleft.length - 1;
        for (; i >= 0; i--) {
            var ch = fleft.charAt(i);
            var c = tleft.charAt(j);
            switch (ch) {
                case "0":
                    if (isEmpty(c)) {
                        c = "0";
                    }
                    last = -1;
                    left = c + left;
                    j--;
                    break;
                case "#":
                    last = i;
                    left = c + left;
                    j--;
                    break;
                case ",":
                    if (!isEmpty(c)) {
                        // 计算一个,分隔区间的长度
                        var com = fleft.match(/,[#0]+/);
                        if (com) {
                            combo = com[0].length - 1;
                        }
                        left = "," + left;
                    }
                    break;
                default :
                    left = ch + left;
                    break;
            }
        }
        if (last > -1) {
            // 处理剩余字符
            var tll = tleft.substr(0, j + 1);
            left = left.substr(0, last) + tll + left.substr(last);
        }
        if (combo > 0) {
            // 处理,分隔区间
            var res = left.match(/[0-9]+,/);
            if (res) {
                res = res[0];
                var newstr = "", n = res.length - 1 - combo;
                for (; n >= 0; n = n - combo) {
                    newstr = res.substr(n, combo) + "," + newstr;
                }
                var lres = res.substr(0, n + combo);
                if (!isEmpty(lres)) {
                    newstr = lres + "," + newstr;
                }
            }
            left = left.replace(/[0-9]+,/, newstr);
        }
        return left;
    }


    BI.cjkEncode = function (text) {
        // alex:如果非字符串,返回其本身(cjkEncode(234) 返回 ""是不对的)
        if (typeof text !== "string") {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code >= 128 || code === 91 || code === 93) {// 91 is "[", 93 is "]".
                newText += "[" + code.toString(16) + "]";
            } else {
                newText += text.charAt(i);
            }
        }

        return newText;
    };

    /**
     * 将cjkEncode处理过的字符串转化为原始字符串
     *
     * @static
     * @param text 需要做解码的字符串
     * @return {String} 解码后的字符串
     */
    BI.cjkDecode = function (text) {
        if (text == null) {
            return "";
        }
        // 查找没有 "[", 直接返回.  kunsnat:数字的时候, 不支持indexOf方法, 也是直接返回.
        if (!isNaN(text) || text.indexOf("[") == -1) {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (ch == "[") {
                var rightIdx = text.indexOf("]", i + 1);
                if (rightIdx > i + 1) {
                    var subText = text.substring(i + 1, rightIdx);
                    // james：主要是考虑[CDATA[]]这样的值的出现
                    if (subText.length > 0) {
                        ch = String.fromCharCode(eval("0x" + subText));
                    }

                    i = rightIdx;
                }
            }

            newText += ch;
        }

        return newText;
    };

    // replace the html special tags
    var SPECIAL_TAGS = {
        "&": "&amp;",
        "\"": "&quot;",
        "<": "&lt;",
        ">": "&gt;"
    };
    BI.htmlEncode = function (text) {
        return BI.isNull(text) ? "" : BI.replaceAll(text + "", "&|\"|<|>", function (v) {
            return SPECIAL_TAGS[v] ? SPECIAL_TAGS[v] : "&nbsp;";
        });
    };
    // html decode
    BI.htmlDecode = function (text) {
        return BI.isNull(text) ? "" : BI.replaceAll(text + "", "&amp;|&quot;|&lt;|&gt;|&nbsp;", function (v) {
            switch (v) {
                case "&amp;":
                    return "&";
                case "&quot;":
                    return "\"";
                case "&lt;":
                    return "<";
                case "&gt;":
                    return ">";
                case "&nbsp;":
                default:
                    return " ";
            }
        });
    };

    BI.cjkEncodeDO = function (o) {
        if (BI.isPlainObject(o)) {
            var result = {};
            _.each(o, function (v, k) {
                if (!(typeof v === "string")) {
                    v = BI.jsonEncode(v);
                }
                // wei:bug 43338，如果key是中文，cjkencode后o的长度就加了1，ie9以下版本死循环，所以新建对象result。
                k = BI.cjkEncode(k);
                result[k] = BI.cjkEncode(v);
            });
            return result;
        }
        return o;
    };

    BI.jsonEncode = function (o) {
        // james:这个Encode是抄的EXT的
        var useHasOwn = !!{}.hasOwnProperty;

        // crashes Safari in some instances
        // var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

        var m = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };

        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return "\"" + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                    var c = m[b];
                    if (c) {
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + "\"";
            }
            return "\"" + s + "\"";
        };

        var encodeArray = function (o) {
            var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(",");
                        }
                        a.push(v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };

        if (typeof o === "undefined" || o === null) {
            return "null";
        } else if (BI.isArray(o)) {
            return encodeArray(o);
        } else if (o instanceof Date) {
            /*
             * alex:原来只是把年月日时分秒简单地拼成一个String,无法decode
             * 现在这么处理就可以decode了,但是JS.jsonDecode和Java.JSONObject也要跟着改一下
             */
            return BI.jsonEncode({
                __time__: o.getTime()
            });
        } else if (typeof o === "string") {
            return encodeString(o);
        } else if (typeof o === "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o === "boolean") {
            return String(o);
        } else if (BI.isFunction(o)) {
            return String(o);
        }
        var a = ["{"], b, i, v;
        for (i in o) {
            if (!useHasOwn || o.hasOwnProperty(i)) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(",");
                        }
                        a.push(BI.jsonEncode(i), ":",
                            v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
        }
        a.push("}");
        return a.join("");

    };

    BI.jsonDecode = function (text) {

        try {
            // 注意0啊
            // var jo = $.parseJSON(text) || {};
            var jo = BI.$ ? BI.$.parseJSON(text) : _global.JSON.parse(text);
            if (jo == null) {
                jo = {};
            }
        } catch (e) {
            /*
             * richie:浏览器只支持标准的JSON字符串转换，而jQuery会默认调用浏览器的window.JSON.parse()函数进行解析
             * 比如：var str = "{'a':'b'}",这种形式的字符串转换为JSON就会抛异常
             */
            try {
                jo = new Function("return " + text)() || {};
            } catch (e) {
                // do nothing
            }
            if (jo == null) {
                jo = [];
            }
        }
        if (!_hasDateInJson(text)) {
            return jo;
        }

        function _hasDateInJson (json) {
            if (!json || typeof json !== "string") {
                return false;
            }
            return json.indexOf("__time__") != -1;
        }

        return (function (o) {
            if (typeof o === "string") {
                return o;
            }
            if (o && o.__time__ != null) {
                return new Date(o.__time__);
            }
            for (var a in o) {
                if (o[a] == o || typeof o[a] === "object" || _.isFunction(o[a])) {
                    break;
                }
                o[a] = arguments.callee(o[a]);
            }

            return o;
        })(jo);
    };

    /**
     * 获取编码后的url
     * @param urlTemplate url模板
     * @param param 参数
     * @returns {*|String}
     * @example
     * BI.getEncodeURL("design/{tableName}/{fieldName}",{tableName: "A", fieldName: "a"}) //  design/A/a
     */
    BI.getEncodeURL = function (urlTemplate, param) {
        return BI.replaceAll(urlTemplate, "\\{(.*?)\\}", function (ori, str) {
            return BI.encodeURIComponent(BI.isObject(param) ? param[str] : param);
        });
    };

    BI.encodeURIComponent = function (url) {
        BI.specialCharsMap = BI.specialCharsMap || {};
        url = url || "";
        url = BI.replaceAll(url + "", BI.keys(BI.specialCharsMap || []).join("|"), function (str) {
            switch (str) {
                case "\\":
                    return BI.specialCharsMap["\\\\"] || str;
                default:
                    return BI.specialCharsMap[str] || str;
            }
        });
        return _global.encodeURIComponent(url);
    };

    BI.decodeURIComponent = function (url) {
        var reserveSpecialCharsMap = {};
        BI.each(BI.specialCharsMap, function (initialChar, encodeChar) {
            reserveSpecialCharsMap[encodeChar] = initialChar === "\\\\" ? "\\" : initialChar;
        });
        url = url || "";
        url = BI.replaceAll(url + "", BI.keys(reserveSpecialCharsMap || []).join("|"), function (str) {
            return reserveSpecialCharsMap[str] || str;
        });
        return _global.decodeURIComponent(url);
    };

    BI.contentFormat = function (cv, fmt) {
        if (isEmpty(cv)) {
            // 原值为空，返回空字符
            return "";
        }
        var text = cv.toString();
        if (isEmpty(fmt)) {
            // 格式为空，返回原字符
            return text;
        }
        if (fmt.match(/^T/)) {
            // T - 文本格式
            return text;
        } else if (fmt.match(/^D/)) {
            // D - 日期(时间)格式
            if (!(cv instanceof Date)) {
                if (typeof cv === "number") {
                    // 毫秒数类型
                    cv = new Date(cv);
                } else {
                    //字符串类型转化为date类型
                    cv = new Date(Date.parse(("" + cv).replace(/-|\./g, "/")));
                }
            }
            if (!isInvalidDate(cv) && !BI.isNull(cv)) {
                var needTrim = fmt.match(/^DT/);
                text = BI.date2Str(cv, fmt.substring(needTrim ? 2 : 1));
            }
        } else if (fmt.match(/E/)) {
            // 科学计数格式
            text = _eFormat(text, fmt);
        } else {
            // 数字格式
            text = _numberFormat(text, fmt);
        }
        // ¤ - 货币格式
        text = text.replace(/¤/g, "￥");
        return text;
    };

    /**
     * 将Java提供的日期格式字符串装换为JS识别的日期格式字符串
     * @class FR.parseFmt
     * @param fmt 日期格式
     * @returns {String}
     */
    BI.parseFmt = function (fmt) {
        if (!fmt) {
            return "";
        }
        //日期
        fmt = String(fmt)
        //年
            .replace(/y{4,}/g, "%Y")//yyyy的时候替换为Y
            .replace(/y{2}/g, "%y")//yy的时候替换为y
            //月
            .replace(/M{4,}/g, "%b")//MMMM的时候替换为b，八
            .replace(/M{3}/g, "%B")//MMM的时候替换为M，八月
            .replace(/M{2}/g, "%X")//MM的时候替换为X，08
            .replace(/M{1}/g, "%x")//M的时候替换为x，8
            .replace(/a{1}/g, "%p");
        //天
        if (new RegExp("d{2,}", "g").test(fmt)) {
            fmt = fmt.replace(/d{2,}/g, "%d");//dd的时候替换为d
        } else {
            fmt = fmt.replace(/d{1}/g, "%e");//d的时候替换为j
        }
        //时
        if (new RegExp("h{2,}", "g").test(fmt)) {//12小时制
            fmt = fmt.replace(/h{2,}/g, "%I");
        } else {
            fmt = fmt.replace(/h{1}/g, "%I");
        }
        if (new RegExp("H{2,}", "g").test(fmt)) {//24小时制
            fmt = fmt.replace(/H{2,}/g, "%H");
        } else {
            fmt = fmt.replace(/H{1}/g, "%H");
        }
        fmt = fmt.replace(/m{2,}/g, "%M")//分
        //秒
            .replace(/s{2,}/g, "%S");

        return fmt;
    };

    /**
     * 把字符串按照对应的格式转化成日期对象
     *
     *      @example
     *      var result = BI.str2Date('2013-12-12', 'yyyy-MM-dd');//Thu Dec 12 2013 00:00:00 GMT+0800
     *
     * @class BI.str2Date
     * @param str 字符串
     * @param format 日期格式
     * @returns {*}
     */
    BI.str2Date = function (str, format) {
        if (typeof str != "string" || typeof format != "string") {
            return null;
        }
        var fmt = BI.parseFmt(format);
        return BI.parseDateTime(str, fmt);
    };

    /**
     * 把日期对象按照指定格式转化成字符串
     *
     *      @example
     *      var date = new Date('Thu Dec 12 2013 00:00:00 GMT+0800');
     *      var result = BI.date2Str(date, 'yyyy-MM-dd');//2013-12-12
     *
     * @class BI.date2Str
     * @param date 日期
     * @param format 日期格式
     * @returns {String}
     */
    BI.date2Str = function (date, format) {
        if (!date) {
            return "";
        }
        // O(len(format))
        var len = format.length, result = "";
        if (len > 0) {
            var flagch = format.charAt(0), start = 0, str = flagch;
            for (var i = 1; i < len; i++) {
                var ch = format.charAt(i);
                if (flagch !== ch) {
                    result += compileJFmt({
                        char: flagch,
                        str: str,
                        len: i - start
                    }, date);
                    flagch = ch;
                    start = i;
                    str = flagch;
                } else {
                    str += ch;
                }
            }
            result += compileJFmt({
                char: flagch,
                str: str,
                len: len - start
            }, date);
        }
        return result;

        function compileJFmt (jfmt, date) {
            var str = jfmt.str, len = jfmt.len, ch = jfmt["char"];
            switch (ch) {
                case "E": // 星期
                    str = BI.Date._DN[date.getDay()];
                    break;
                case "y": // 年
                    if (len <= 3) {
                        str = (date.getFullYear() + "").slice(2, 4);
                    } else {
                        str = date.getFullYear();
                    }
                    break;
                case "M": // 月
                    if (len > 2) {
                        str = BI.Date._MN[date.getMonth()];
                    } else if (len < 2) {
                        str = date.getMonth() + 1;
                    } else {
                        str = BI.leftPad(date.getMonth() + 1 + "", 2, "0");
                    }
                    break;
                case "d": // 日
                    if (len > 1) {
                        str = BI.leftPad(date.getDate() + "", 2, "0");
                    } else {
                        str = date.getDate();
                    }
                    break;
                case "h": // 时(12)
                    var hour = date.getHours() % 12;
                    if (hour === 0) {
                        hour = 12;
                    }
                    if (len > 1) {
                        str = BI.leftPad(hour + "", 2, "0");
                    } else {
                        str = hour;
                    }
                    break;
                case "H": // 时(24)
                    if (len > 1) {
                        str = BI.leftPad(date.getHours() + "", 2, "0");
                    } else {
                        str = date.getHours();
                    }
                    break;
                case "m":
                    if (len > 1) {
                        str = BI.leftPad(date.getMinutes() + "", 2, "0");
                    } else {
                        str = date.getMinutes();
                    }
                    break;
                case "s":
                    if (len > 1) {
                        str = BI.leftPad(date.getSeconds() + "", 2, "0");
                    } else {
                        str = date.getSeconds();
                    }
                    break;
                case "a":
                    str = date.getHours() < 12 ? "am" : "pm";
                    break;
                case "z":
                    str = BI.getTimezone(date);
                    break;
                default:
                    str = jfmt.str;
                    break;
            }
            return str;
        }
    };

    BI.object2Number = function (value) {
        if (value == null) {
            return 0;
        }
        if (typeof value === "number") {
            return value;
        }
        var str = value + "";
        if (str.indexOf(".") === -1) {
            return parseInt(str);
        }
        return parseFloat(str);
    };

    BI.object2Date = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        } else if (typeof obj === "number") {
            return new Date(obj);
        }
        var str = obj + "";
        str = str.replace(/-/g, "/");
        var dt = new Date(str);
        if (!isInvalidDate(dt)) {
            return dt;
        }

        return new Date();

    };

    BI.object2Time = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        }
        var str = obj + "";
        str = str.replace(/-/g, "/");
        var dt = new Date(str);
        if (!isInvalidDate(dt)) {
            return dt;
        }
        if (str.indexOf("/") === -1 && str.indexOf(":") !== -1) {
            dt = new Date("1970/01/01 " + str);
            if (!isInvalidDate(dt)) {
                return dt;
            }
        }
        dt = BI.parseDateTime(str, "HH:mm:ss");
        if (!isInvalidDate(dt)) {
            return dt;
        }
        return new Date();

    };
})();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13)))

/***/ }),

/***/ 123:
/***/ (function(module, exports) {

/**
 * 对数组对象的扩展
 * @class Array
 */
_.extend(BI, {

    pushArray: function (sArray, array) {
        for (var i = 0; i < array.length; i++) {
            sArray.push(array[i]);
        }
    },
    pushDistinct: function (sArray, obj) {
        if (!BI.contains(sArray, obj)) {
            sArray.push(obj);
        }
    },
    pushDistinctArray: function (sArray, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            BI.pushDistinct(sArray, array[i]);
        }
    }
});


/***/ }),

/***/ 124:
/***/ (function(module, exports) {

/** Constants used for time computations */
BI.Date = BI.Date || {};
BI.Date.SECOND = 1000;
BI.Date.MINUTE = 60 * BI.Date.SECOND;
BI.Date.HOUR = 60 * BI.Date.MINUTE;
BI.Date.DAY = 24 * BI.Date.HOUR;
BI.Date.WEEK = 7 * BI.Date.DAY;

_.extend(BI, {
    /**
     * 获取时区
     * @returns {String}
     */
    getTimezone: function (date) {
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    },

    /** Returns the number of days in the current month */
    getMonthDays: function (date, month) {
        var year = date.getFullYear();
        if (typeof month === "undefined") {
            month = date.getMonth();
        }
        if (((0 == (year % 4)) && ((0 != (year % 100)) || (0 == (year % 400)))) && month == 1) {
            return 29;
        }
        return BI.Date._MD[month];

    },

    /**
     * 获取每月的最后一天
     * @returns {Date}
     */
    getLastDateOfMonth: function (date) {
        return BI.getDate(date.getFullYear(), date.getMonth(), BI.getMonthDays(date));
    },

    /** Returns the number of day in the year. */
    getDayOfYear: function (date) {
        var now = BI.getDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        var then = BI.getDate(date.getFullYear(), 0, 0, 0, 0, 0);
        var time = now - then;
        return Math.floor(time / BI.Date.DAY);
    },

    /** Returns the number of the week in year, as defined in ISO 8601. */
    getWeekNumber: function (date) {
        var d = BI.getDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        var week = d.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        var middleDay = (startOfWeek + 3) % 7;
        middleDay = middleDay || 7;
        // 偏移到周周首之前需要多少天
        var offsetWeekStartCount = week < startOfWeek ? (7 + week - startOfWeek) : (week - startOfWeek);
        var offsetWeekMiddleCount = middleDay < startOfWeek ? (7 + middleDay - startOfWeek) : (middleDay - startOfWeek);
        d.setDate(d.getDate() - offsetWeekStartCount + offsetWeekMiddleCount);
        var ms = d.valueOf();
        d.setMonth(0);
        d.setDate(1);
        return Math.floor((ms - d.valueOf()) / (7 * 864e5)) + 1;
    },

    getQuarter: function (date) {
        return Math.floor(date.getMonth() / 3) + 1;
    },

    // 离当前时间多少天的时间
    getOffsetDate: function (date, offset) {
        return BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()) + offset * 864e5);
    },

    getOffsetQuarter: function (date, n) {
        var dt = BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        var day = dt.getDate();
        var monthDay = BI.getMonthDays(BI.getDate(dt.getFullYear(), dt.getMonth() + BI.parseInt(n) * 3, 1));
        if (day > monthDay) {
            day = monthDay;
        }
        dt.setDate(day);
        dt.setMonth(dt.getMonth() + parseInt(n) * 3);
        return dt;
    },

    // 得到本季度的起始月份
    getQuarterStartMonth: function (date) {
        var quarterStartMonth = 0;
        var nowMonth = date.getMonth();
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    },
    // 获得本季度的起始日期
    getQuarterStartDate: function (date) {
        return BI.getDate(date.getFullYear(), BI.getQuarterStartMonth(date), 1);
    },
    // 得到本季度的结束日期
    getQuarterEndDate: function (date) {
        var quarterEndMonth = BI.getQuarterStartMonth(date) + 2;
        return BI.getDate(date.getFullYear(), quarterEndMonth, BI.getMonthDays(date, quarterEndMonth));
    },

    // 指定日期n个月之前或之后的日期
    getOffsetMonth: function (date, n) {
        var dt = BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        var day = dt.getDate();
        var monthDay = BI.getMonthDays(BI.getDate(dt.getFullYear(), dt.getMonth() + parseInt(n), 1));
        if (day > monthDay) {
            day = monthDay;
        }
        dt.setDate(day);
        dt.setMonth(dt.getMonth() + parseInt(n));
        return dt;
    },

    // 获得本周的起始日期
    getWeekStartDate: function (date) {
        var w = date.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        return BI.getOffsetDate(date, BI.Date._OFFSET[w < startOfWeek ? (7 + w - startOfWeek) : (w - startOfWeek)]);
    },
    // 得到本周的结束日期
    getWeekEndDate: function (date) {
        var w = date.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        return BI.getOffsetDate(date, BI.Date._OFFSET[w < startOfWeek ? (7 + w - startOfWeek) : (w - startOfWeek)] + 6);
    },

    // 格式化打印日期
    print: function (date, str) {
        var m = date.getMonth();
        var d = date.getDate();
        var y = date.getFullYear();
        var yWith4number = y + "";
        while (yWith4number.length < 4) {
            yWith4number = "0" + yWith4number;
        }
        var wn = BI.getWeekNumber(date);
        var qr = BI.getQuarter(date);
        var w = date.getDay();
        var s = {};
        var hr = date.getHours();
        var pm = (hr >= 12);
        var ir = (pm) ? (hr - 12) : hr;
        var dy = BI.getDayOfYear(date);
        if (ir == 0) {
            ir = 12;
        }
        var min = date.getMinutes();
        var sec = date.getSeconds();
        s["%a"] = BI.Date._SDN[w]; // abbreviated weekday name [FIXME: I18N]
        s["%A"] = BI.Date._DN[w]; // full weekday name
        s["%b"] = BI.Date._SMN[m]; // abbreviated month name [FIXME: I18N]
        s["%B"] = BI.Date._MN[m]; // full month name
        // FIXME: %c : preferred date and time representation for the current locale
        s["%C"] = 1 + Math.floor(y / 100); // the century number
        s["%d"] = (d < 10) ? ("0" + d) : d; // the day of the month (range 01 to 31)
        s["%e"] = d; // the day of the month (range 1 to 31)
        // FIXME: %D : american date style: %m/%d/%y
        // FIXME: %E, %F, %G, %g, %h (man strftime)
        s["%H"] = (hr < 10) ? ("0" + hr) : hr; // hour, range 00 to 23 (24h format)
        s["%I"] = (ir < 10) ? ("0" + ir) : ir; // hour, range 01 to 12 (12h format)
        s["%j"] = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy; // day of the year (range 001 to 366)
        s["%k"] = hr + "";		// hour, range 0 to 23 (24h format)
        s["%l"] = ir + "";		// hour, range 1 to 12 (12h format)
        s["%X"] = (m < 9) ? ("0" + (1 + m)) : (1 + m); // month, range 01 to 12
        s["%x"] = m + 1; // month, range 1 to 12
        s["%M"] = (min < 10) ? ("0" + min) : min; // minute, range 00 to 59
        s["%n"] = "\n";		// a newline character
        s["%p"] = pm ? "PM" : "AM";
        s["%P"] = pm ? "pm" : "am";
        // FIXME: %r : the time in am/pm notation %I:%M:%S %p
        // FIXME: %R : the time in 24-hour notation %H:%M
        s["%s"] = Math.floor(date.getTime() / 1000);
        s["%S"] = (sec < 10) ? ("0" + sec) : sec; // seconds, range 00 to 59
        s["%t"] = "\t";		// a tab character
        // FIXME: %T : the time in 24-hour notation (%H:%M:%S)
        s["%U"] = s["%W"] = s["%V"] = (wn < 10) ? ("0" + wn) : wn;
        s["%u"] = w + 1;	// the day of the week (range 1 to 7, 1 = MON)
        s["%w"] = w;		// the day of the week (range 0 to 6, 0 = SUN)
        // FIXME: %x : preferred date representation for the current locale without the time
        // FIXME: %X : preferred time representation for the current locale without the date
        s["%y"] = yWith4number.substr(2, 2); // year without the century (range 00 to 99)
        s["%Y"] = yWith4number;		// year with the century
        s["%%"] = "%";		// a literal '%' character
        s["%Q"] = qr;

        var re = /%./g;
        BI.isKhtml = BI.isKhtml || function () {
            if(!_global.navigator) {
                return false;
            }
            return /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
        };

        // 包含年周的格式化，ISO8601标准周的计数会影响年
        if ((str.indexOf("%Y") !== -1 || str.indexOf("%y") !== -1) && (str.indexOf("%W") !== -1 || str.indexOf("%U") !== -1 || str.indexOf("%V") !== -1)) {
            switch (wn) {
                // 如果周数是1，但是当前却在12月，表示此周数为下一年的
                case 1:
                    if (m === 11) {
                        s["%y"] = parseInt(s["%y"]) + 1;
                        s["%Y"] = parseInt(s["%Y"]) + 1;
                    }
                    break;
                // 如果周数是53，但是当前却在1月，表示此周数为上一年的
                case 53:
                    if (m === 0) {
                        s["%y"] = parseInt(s["%y"]) - 1;
                        s["%Y"] = parseInt(s["%Y"]) - 1;
                    }
                    break;
                default:
                    break;
            }
        }

        if (!BI.isKhtml()) {
            return str.replace(re, function (par) {
                return s[par] || par;
            });
        }
        var a = str.match(re);
        for (var i = 0; i < a.length; i++) {
            var tmp = s[a[i]];
            if (tmp) {
                re = new RegExp(a[i], "g");
                str = str.replace(re, tmp);
            }
        }

        return str;
    }
});


/***/ }),

/***/ 125:
/***/ (function(module, exports) {

/**
 * 基本的函数
 * Created by GUY on 2015/6/24.
 */
BI.Func = BI.Func || {};
_.extend(BI.Func, {
    /**
     * 创建唯一的名字
     * @param array
     * @param name
     * @returns {*}
     */
    createDistinctName: function (array, name) {
        var src = name, idx = 1;
        name = name || "";
        while (true) {
            if (BI.every(array, function (i, item) {
                    return BI.isKey(item) ? item !== name : item.name !== name;
                })) {
                break;
            }
            name = src + (idx++);
        }
        return name;
    },

    /**
     * 获取字符宽度
     * @param str
     * @return {number}
     */
    getGBWidth: function (str) {
        str = str + "";
        str = str.replace(/[^\x00-\xff]/g, "xx");
        return Math.ceil(str.length / 2);
    },

    /**
     * 获取搜索结果
     * @param items
     * @param keyword
     * @param param  搜索哪个属性
     */
    getSearchResult: function (items, keyword, param) {
        var isArray = BI.isArray(items);
        items = isArray ? BI.flatten(items) : items;
        param || (param = "text");
        if (!BI.isKey(keyword)) {
            return {
                find: BI.deepClone(items),
                match: isArray ? [] : {}
            };
        }
        var t, text, py;
        keyword = BI.toUpperCase(keyword);
        var matched = isArray ? [] : {}, find = isArray ? [] : {};
        BI.each(items, function (i, item) {
            // 兼容item为null的处理
            if (BI.isNull(item)) {
                return;
            }
            item = BI.deepClone(item);
            t = BI.stripEL(item);
            text = BI.find([t[param], t.text, t.value, t.name, t], function (index, val) {
                return BI.isNotNull(val);
            });

            if (BI.isNull(text) || BI.isObject(text)) return;

            py = BI.makeFirstPY(text, {
                splitChar: "\u200b"
            });
            text = BI.toUpperCase(text);
            py = BI.toUpperCase(py);
            var pidx;
            if (text.indexOf(keyword) > -1) {
                if (text === keyword) {
                    isArray ? matched.push(item) : (matched[i] = item);
                } else {
                    isArray ? find.push(item) : (find[i] = item);
                }
                // BI-56386 这边两个pid / text.length是为了防止截取的首字符串不是完整的，但光这样做还不够，即时错位了，也不能说明就不符合条件
            } else if (pidx = py.indexOf(keyword), (pidx > -1)) {
                if (text === keyword || keyword.length === text.length) {
                    isArray ? matched.push(item) : (matched[i] = item);
                } else {
                    isArray ? find.push(item) : (find[i] = item);
                }
            }
        });
        return {
            match: matched,
            find: find
        };
    },

    /**
     * 获取按GB2312排序的结果
     * @param items
     * @param key
     * @return {any[]}
     */
    getSortedResult: function (items, key) {
        var getTextOfItem = BI.isFunction(key) ? key :
            function (item, key) {
                if (BI.isNotNull(key)) {
                    return item[key];
                }
                if (BI.isNotNull(item.text)) {
                    return item.text;
                }
                if (BI.isNotNull(item.value)) {
                    return item.value;
                }
                return item;
            };

        return items.sort(function (item1, item2) {
            var str1 = getTextOfItem(item1, key);
            var str2 = getTextOfItem(item2, key);
            if (BI.isNull(str1) && BI.isNull(str2)) {
                return 0;
            }
            if (BI.isNull(str1)) {
                return -1;
            }
            if (BI.isNull(str2)) {
                return 1;
            }
            if (str1 === str2) {
                return 0;
            }
            var len1 = str1.length, len2 = str2.length;
            for (var i = 0; i < len1 && i < len2; i++) {
                var char1 = str1[i];
                var char2 = str2[i];
                if (char1 !== char2) {
                    // 找不到的字符都往后面放
                    return (BI.isNull(BI.CODE_INDEX[char1]) ? BI.MAX : BI.CODE_INDEX[char1]) - (BI.isNull(BI.CODE_INDEX[char2]) ? BI.MAX : BI.CODE_INDEX[char2]);
                }
            }
            return len1 - len2;
        });
    }
});

_.extend(BI, {
    beforeFunc: function (sFunc, func) {
        var __self = sFunc;
        return function () {
            if (func.apply(sFunc, arguments) === false) {
                return false;
            }
            return __self.apply(sFunc, arguments);
        };
    },

    afterFunc: function (sFunc, func) {
        var __self = sFunc;
        return function () {
            var ret = __self.apply(sFunc, arguments);
            if (ret === false) {
                return false;
            }
            func.apply(sFunc, arguments);
            return ret;
        };
    }
});


/***/ }),

/***/ 126:
/***/ (function(module, exports) {

_.extend(BI, {
    // 给Number类型增加一个add方法，调用起来更加方便。
    add: function (num, arg) {
        return accAdd(arg, num);

        /**
         ** 加法函数，用来得到精确的加法结果
         ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
         ** 调用：accAdd(arg1,arg2)
         ** 返回值：arg1加上arg2的精确结果
         **/
        function accAdd (arg1, arg2) {
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        }
    },

    // 给Number类型增加一个sub方法，调用起来更加方便。
    sub: function (num, arg) {
        return accSub(num, arg);

        /**
         ** 减法函数，用来得到精确的减法结果
         ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
         ** 调用：accSub(arg1,arg2)
         ** 返回值：arg1加上arg2的精确结果
         **/
        function accSub (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        }
    },

    // 给Number类型增加一个mul方法，调用起来更加方便。
    mul: function (num, arg) {
        return accMul(arg, num);

        /**
         ** 乘法函数，用来得到精确的乘法结果
         ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
         ** 调用：accMul(arg1,arg2)
         ** 返回值：arg1乘以 arg2的精确结果
         **/
        function accMul (arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            } catch (e) {
            }
            try {
                m += s2.split(".")[1].length;
            } catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        }
    },
    
    // 给Number类型增加一个div方法，调用起来更加方便。
    div: function (num, arg) {
        return accDivide(num, arg);

        /**
         * Return digits length of a number
         * @param {*number} num Input number
         */
        function digitLength (num) {
            // Get digit length of e
            var eSplit = num.toString().split(/[eE]/);
            var len = (eSplit[0].split(".")[1] || "").length - (+(eSplit[1] || 0));
            return len > 0 ? len : 0;
        }
        /**
         * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
         * @param {*number} num 输入数
         */
        function float2Fixed (num) {
            if (num.toString().indexOf("e") === -1) {
                return Number(num.toString().replace(".", ""));
            }
            var dLen = digitLength(num);
            return dLen > 0 ? num * Math.pow(10, dLen) : num;
        }

        /**
         * 精确乘法
         */
        function times (num1, num2) {
            var others = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                others[_i - 2] = arguments[_i];
            }
            if (others.length > 0) {
                return times.apply(void 0, [times(num1, num2), others[0]].concat(others.slice(1)));
            }
            var num1Changed = float2Fixed(num1);
            var num2Changed = float2Fixed(num2);
            var baseNum = digitLength(num1) + digitLength(num2);
            var leftValue = num1Changed * num2Changed;
            return leftValue / Math.pow(10, baseNum);
        }

        /**
         * 精确除法
         */
        function accDivide (num1, num2) {
            var others = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                others[_i - 2] = arguments[_i];
            }
            if (others.length > 0) {
                return accDivide.apply(void 0, [accDivide(num1, num2), others[0]].concat(others.slice(1)));
            }
            var num1Changed = float2Fixed(num1);
            var num2Changed = float2Fixed(num2);
            return times((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)));
        }
    }

});

/***/ }),

/***/ 127:
/***/ (function(module, exports) {

/**
 * 对字符串对象的扩展
 * @class String
 */
_.extend(BI, {

    /**
     * 判断字符串是否已指定的字符串开始
     * @param str source字符串
     * @param {String} startTag   指定的开始字符串
     * @return {Boolean}  如果字符串以指定字符串开始则返回true，否则返回false
     */
    startWith: function (str, startTag) {
        str = str || "";
        if (startTag == null || startTag == "" || str.length === 0 || startTag.length > str.length) {
            return false;
        }
        return str.substr(0, startTag.length) == startTag;
    },
    /**
     * 判断字符串是否以指定的字符串结束
     * @param str source字符串
     * @param {String} endTag 指定的字符串
     * @return {Boolean}  如果字符串以指定字符串结束则返回true，否则返回false
     */
    endWith: function (str, endTag) {
        if (endTag == null || endTag == "" || str.length === 0 || endTag.length > str.length) {
            return false;
        }
        return str.substring(str.length - endTag.length) == endTag;
    },

    /**
     * 获取url中指定名字的参数
     * @param str source字符串
     * @param {String} name 参数的名字
     * @return {String} 参数的值
     */
    getQuery: function (str, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = str.substr(str.indexOf("?") + 1).match(reg);
        if (r) {
            return unescape(r[2]);
        }
        return null;
    },

    /**
     * 给url加上给定的参数
     * @param str source字符串
     * @param {Object} paras 参数对象，是一个键值对对象
     * @return {String} 添加了给定参数的url
     */
    appendQuery: function (str, paras) {
        if (!paras) {
            return str;
        }
        var src = str;
        // 没有问号说明还没有参数
        if (src.indexOf("?") === -1) {
            src += "?";
        }
        // 如果以问号结尾，说明没有其他参数
        if (BI.endWith(src, "?") !== false) {
        } else {
            src += "&";
        }
        _.each(paras, function (value, name) {
            if (typeof(name) === "string") {
                src += name + "=" + value + "&";
            }
        });
        src = src.substr(0, src.length - 1);
        return src;
    },
    /**
     * 将所有符合第一个字符串所表示的字符串替换成为第二个字符串
     * @param str source字符串
     * @param {String} s1 要替换的字符串的正则表达式
     * @param {String} s2 替换的结果字符串
     * @returns {String} 替换后的字符串
     */
    replaceAll: function (str, s1, s2) {
        return BI.isString(str) ? str.replace(new RegExp(s1, "gm"), s2) : str;
    },
    /**
     * 总是让字符串以指定的字符开头
     * @param str source字符串
     * @param {String} start 指定的字符
     * @returns {String} 以指定字符开头的字符串
     */
    perfectStart: function (str, start) {
        if (BI.startWith(str, start)) {
            return str;
        }
        return start + str;

    },

    /**
     * 获取字符串中某字符串的所有项位置数组
     * @param str source字符串
     * @param {String} sub 子字符串
     * @return {Number[]} 子字符串在父字符串中出现的所有位置组成的数组
     */
    allIndexOf: function (str, sub) {
        if (typeof sub !== "string") {
            return [];
        }
        var location = [];
        var offset = 0;
        while (str.length > 0) {
            var loc = str.indexOf(sub);
            if (loc === -1) {
                break;
            }
            location.push(offset + loc);
            str = str.substring(loc + sub.length, str.length);
            offset += loc + sub.length;
        }
        return location;
    }
});

/***/ }),

/***/ 128:
/***/ (function(module, exports) {

!(function () {
    var i18nStore = {};
    _.extend(BI, {
        addI18n: function (i18n) {
            BI.extend(i18nStore, i18n);
        },
        i18nText: function (key) {
            var localeText = i18nStore[key] || (BI.i18n && BI.i18n[key]) || "";
            if (!localeText) {
                localeText = key;
            }
            var len = arguments.length;
            if (len > 1) {
                if (localeText.indexOf("{R1}") > -1) {
                    for (var i = 1; i < len; i++) {
                        var key = "{R" + i + "}";
                        localeText = BI.replaceAll(localeText, key, arguments[i] + "");
                    }
                } else {
                    var args = Array.prototype.slice.call(arguments);
                    var count = 1;
                    return BI.replaceAll(localeText, "\\{\\s*\\}", function () {
                        return args[count++] + "";
                    });
                }
            }
            return localeText;
        }
    });
})();

/***/ }),

/***/ 129:
/***/ (function(module, exports) {

(function () {
    var moduleInjection = {};
    BI.module = BI.module || function (xtype, cls) {
        if (moduleInjection[xtype] != null) {
            _global.console && console.error("module:[" + xtype + "] has been registed");
        }
        moduleInjection[xtype] = cls;
    };

    var constantInjection = {};
    BI.constant = BI.constant || function (xtype, cls) {
        if (constantInjection[xtype] != null) {
            _global.console && console.error("constant:[" + xtype + "] has been registed");
        }
        constantInjection[xtype] = cls;
    };

    var modelInjection = {};
    BI.model = BI.model || function (xtype, cls) {
        if (modelInjection[xtype] != null) {
            _global.console && console.error("model:[" + xtype + "] has been registed");
        }
        modelInjection[xtype] = cls;
    };

    var storeInjection = {};
    BI.store = BI.store || function (xtype, cls) {
        if (storeInjection[xtype] != null) {
            _global.console && console.error("store:[" + xtype + "] has been registed");
        }
        storeInjection[xtype] = cls;
    };

    var serviceInjection = {};
    BI.service = BI.service || function (xtype, cls) {
        if (serviceInjection[xtype] != null) {
            _global.console && console.error("service:[" + xtype + "] has been registed");
        }
        serviceInjection[xtype] = cls;
    };

    var providerInjection = {};
    BI.provider = BI.provider || function (xtype, cls) {
        if (providerInjection[xtype] != null) {
            _global.console && console.error("provider:[" + xtype + "] has been registed");
        }
        providerInjection[xtype] = cls;
    };

    var configFunctions = {};
    BI.config = BI.config || function (type, configFn, opt) {
        if (BI.initialized) {
            if (constantInjection[type]) {
                return (constantInjection[type] = configFn(constantInjection[type]));
            }
            if (providerInjection[type]) {
                if (!providers[type]) {
                    providers[type] = new providerInjection[type]();
                }
                // 如果config被重新配置的话，需要删除掉之前的实例
                if (providerInstance[type]) {
                    delete providerInstance[type];
                }
                return configFn(providers[type]);
            }
            return BI.Plugin.configWidget(type, configFn, opt);
        }
        if (!configFunctions[type]) {
            configFunctions[type] = [];
            BI.prepares.push(function () {
                var queue = configFunctions[type];
                for (var i = 0; i < queue.length; i++) {
                    if (constantInjection[type]) {
                        constantInjection[type] = queue[i](constantInjection[type]);
                        continue;
                    }
                    if (providerInjection[type]) {
                        if (!providers[type]) {
                            providers[type] = new providerInjection[type]();
                        }
                        if (providerInstance[type]) {
                            delete providerInstance[type];
                        }
                        queue[i](providers[type]);
                        continue;
                    }
                    BI.Plugin.configWidget(type, queue[i]);
                }
                configFunctions[type] = null;
            });
        }
        configFunctions[type].push(configFn);
    };

    var actions = {};
    var globalAction = [];
    BI.action = BI.action || function (type, actionFn) {
        if (BI.isFunction(type)) {
            globalAction.push(type);
            return function () {
                BI.remove(globalAction, function (idx) {
                    return globalAction.indexOf(actionFn) === idx;
                });
            };
        }
        if (!actions[type]) {
            actions[type] = [];
        }
        actions[type].push(actionFn);
        return function () {
            BI.remove(actions[type], function (idx) {
                return actions[type].indexOf(actionFn) === idx;
            });
            if (actions[type].length === 0) {
                delete actions[type];
            }
        };
    };

    var points = {};
    BI.point = BI.point || function (type, action, pointFn, after) {
        if (!points[type]) {
            points[type] = {};
        }
        if (!points[type][action]) {
            points[type][action] = {};
        }
        if (!points[type][action][after ? "after" : "before"]) {
            points[type][action][after ? "after" : "before"] = [];
        }
        points[type][action][after ? "after" : "before"].push(pointFn);
    };

    BI.Modules = BI.Modules || {
        getModule: function (type) {
            if (!moduleInjection[type]) {
                _global.console && console.error("module:[" + type + "] does not exists");
                return false;
            }
            return moduleInjection[type];
        },
        getAllModules: function () {
            return moduleInjection;
        }
    };

    BI.Constants = BI.Constants || {
        getConstant: function (type) {
            return constantInjection[type];
        }
    };

    var callPoint = function (inst, types) {
        types = BI.isArray(types) ? types : [types];
        BI.each(types, function (idx, type) {
            if (points[type]) {
                for (var action in points[type]) {
                    var bfns = points[type][action].before;
                    if (bfns) {
                        BI.aspect.before(inst, action, function (bfns) {
                            return function () {
                                for (var i = 0, len = bfns.length; i < len; i++) {
                                    try {
                                        bfns[i].apply(inst, arguments);
                                    } catch (e) {
                                        _global.console && console.error(e);
                                    }
                                }
                            };
                        }(bfns));
                    }
                    var afns = points[type][action].after;
                    if (afns) {
                        BI.aspect.after(inst, action, function (afns) {
                            return function () {
                                for (var i = 0, len = afns.length; i < len; i++) {
                                    try {
                                        afns[i].apply(inst, arguments);
                                    } catch (e) {
                                        _global.console && console.error(e);
                                    }
                                }
                            };
                        }(afns));
                    }
                }
            }
        });
    };

    BI.Models = BI.Models || {
        getModel: function (type, config) {
            var inst = new modelInjection[type](config);
            inst._constructor && inst._constructor(config);
            inst.mixins && callPoint(inst, inst.mixins);
            callPoint(inst, type);
            return inst;
        }
    };

    var stores = {};

    BI.Stores = BI.Stores || {
        getStore: function (type, config) {
            if (stores[type]) {
                return stores[type];
            }
            var inst = stores[type] = new storeInjection[type](config);
            inst._constructor && inst._constructor(config, function () {
                delete stores[type];
            });
            callPoint(inst, type);
            return inst;
        }
    };

    var services = {};

    BI.Services = BI.Services || {
        getService: function (type, config) {
            if (services[type]) {
                return services[type];
            }
            services[type] = new serviceInjection[type](config);
            callPoint(services[type], type);
            return services[type];
        }
    };

    var providers = {},
        providerInstance = {};

    BI.Providers = BI.Providers || {
        getProvider: function (type, config) {
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            if (!providerInstance[type]) {
                providerInstance[type] = new (providers[type].$get())(config);
            }
            return providerInstance[type];
        }
    };

    BI.Actions = BI.Actions || {
        runAction: function (type, event, config) {
            BI.each(actions[type], function (i, act) {
                try {
                    act(event, config);
                } catch (e) {
                    _global.console && console.error(e);
                }
            });
        },
        runGlobalAction: function () {
            var args = [].slice.call(arguments);
            BI.each(globalAction, function (i, act) {
                try {
                    act.apply(null, args);
                } catch (e) {
                    _global.console && console.error(e);
                }
            });
        }
    };

    BI.getContext = BI.getContext || function (type, config) {
        if (constantInjection[type]) {
            return BI.Constants.getConstant(type);
        }
        if (modelInjection[type]) {
            return BI.Models.getModel(type, config);
        }
        if (storeInjection[type]) {
            return BI.Stores.getStore(type, config);
        }
        if (serviceInjection[type]) {
            return BI.Services.getService(type, config);
        }
        if (providerInjection[type]) {
            return BI.Providers.getProvider(type, config);
        }
    };
})();


/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),

/***/ 130:
/***/ (function(module, exports) {

/**
 * 常量
 */

_.extend(BI, {
    MAX: 0xfffffffffffffff,
    MIN: -0xfffffffffffffff,
    EVENT_RESPONSE_TIME: 200,
    zIndex_layer: 1e5,
    zIndex_popover: 1e6,
    zIndex_popup: 1e7,
    zIndex_masker: 1e8,
    zIndex_tip: 1e9,
    emptyStr: "",
    emptyFn: function () {
    },
    empty: null,
    Key: {
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/"
    },
    KeyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    },
    Status: {
        SUCCESS: 1,
        WRONG: 2,
        START: 3,
        END: 4,
        WAITING: 5,
        READY: 6,
        RUNNING: 7,
        OUTOFBOUNDS: 8,
        NULL: -1
    },
    Direction: {
        Top: "top",
        Bottom: "bottom",
        Left: "left",
        Right: "right",
        Custom: "custom"
    },
    Axis: {
        Vertical: "vertical",
        Horizontal: "horizontal"
    },
    Selection: {
        Default: -2,
        None: -1,
        Single: 0,
        Multi: 1,
        All: 2
    },
    HorizontalAlign: {
        Left: "left",
        Right: "right",
        Center: "center",
        Stretch: "stretch"
    },
    VerticalAlign: {
        Middle: "middle",
        Top: "top",
        Bottom: "bottom",
        Stretch: "stretch"
    },
    StartOfWeek: 1
});

/***/ }),

/***/ 131:
/***/ (function(module, exports) {

/**
 * 缓冲池
 * @type {{Buffer: {}}}
 */

(function () {
    var Buffer = {};
    var MODE = false;// 设置缓存模式为关闭

    BI.BufferPool = {
        put: function (name, cache) {
            if (BI.isNotNull(Buffer[name])) {
                throw new Error("Buffer Pool has the key already!");
            }
            Buffer[name] = cache;
        },

        get: function (name) {
            return Buffer[name];
        }
    };
})();

/***/ }),

/***/ 132:
/***/ (function(module, exports) {

/**
 * 共享池
 * @type {{Shared: {}}}
 */

(function () {
    var _Shared = {};
    BI.SharingPool = {
        _Shared: _Shared,
        put: function (name, shared) {
            _Shared[name] = shared;
        },

        cat: function () {
            var args = Array.prototype.slice.call(arguments, 0),
                copy = _Shared;
            for (var i = 0; i < args.length; i++) {
                copy = copy && copy[args[i]];
            }
            return copy;
        },

        get: function () {
            return BI.deepClone(this.cat.apply(this, arguments));
        },

        remove: function (key) {
            delete _Shared[key];
        }
    };
})();

/***/ }),

/***/ 133:
/***/ (function(module, exports) {

BI.Req = {

};


/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply; // DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};

exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};

exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}

Timeout.prototype.unref = Timeout.prototype.ref = function () {};

Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
}; // Does not start the time, just sets up the members needed.


exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;

  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
}; // setimmediate attaches itself to the global object


__webpack_require__(106); // On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.


exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || void 0 && (void 0).setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || void 0 && (void 0).clearImmediate;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13)))

/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

/***/ }),

/***/ 746:
/***/ (function(module, exports) {

BI.i18n = {
    "BI-Multi_Date_Quarter_End": "季度末",
    "BI-Multi_Date_Month_Begin": "月初",
    "BI-Multi_Date_YMD": "年月日",
    "BI-Custom_Color": "自定义颜色",
    "BI-Numerical_Interval_Input_Data": "请输入数值",
    "BI-Please_Input_Natural_Number": "请输入非负整数",
    "BI-No_More_Data": "无更多数据",
    "BI-Basic_Altogether": "共",
    "BI-Basic_Sunday": "星期日",
    "BI-Widget_Background_Colour": "组件背景",
    "BI-Color_Picker_Error_Text": "请输入0~255的正整数",
    "BI-Multi_Date_Month": "月",
    "BI-No_Selected_Item": "没有可选项",
    "BI-Multi_Date_Year_Begin": "年初",
    "BI-Quarter_1": "第1季度",
    "BI-Quarter_2": "第2季度",
    "BI-Quarter_3": "第3季度",
    "BI-Quarter_4": "第4季度",
    "BI-Multi_Date_Year_Next": "年后",
    "BI-Multi_Date_Month_Prev": "个月前",
    "BI-Month_Trigger_Error_Text": "请输入1~12的正整数",
    "BI-Less_And_Equal": "小于等于",
    "BI-Year_Trigger_Invalid_Text": "请输入有效时间",
    "BI-Multi_Date_Week_Next": "周后",
    "BI-Font_Size": "字号",
    "BI-Basic_Total": "共",
    "BI-Already_Selected": "已选择",
    "BI-Formula_Insert": "插入",
    "BI-Select_All": "全选",
    "BI-Basic_Tuesday": "星期二",
    "BI-Multi_Date_Month_End": "月末",
    "BI-Load_More": "点击加载更多数据",
    "BI-Basic_September": "九月",
    "BI-Current_Is_Last_Page": "当前已是最后一页",
    "BI-Basic_Auto": "自动",
    "BI-Basic_Count": "个",
    "BI-Basic_Value": "值",
    "BI-Basic_Unrestricted": "无限制",
    "BI-Quarter_Trigger_Error_Text": "请输入1~4的正整数",
    "BI-Basic_More": "更多",
    "BI-Basic_Wednesday": "星期三",
    "BI-Basic_Bold": "加粗",
    "BI-Basic_Simple_Saturday": "六",
    "BI-Multi_Date_Month_Next": "个月后",
    "BI-Basic_March": "三月",
    "BI-Current_Is_First_Page": "当前已是第一页",
    "BI-Basic_Thursday": "星期四",
    "BI-Basic_Prompt": "提示",
    "BI-Multi_Date_Today": "今天",
    "BI-Multi_Date_Quarter_Prev": "个季度前",
    "BI-Row_Header": "行表头",
    "BI-Date_Trigger_Error_Text": "日期格式示例:2015-3-11",
    "BI-Basic_Cancel": "取消",
    "BI-Basic_January": "一月",
    "BI-Basic_June": "六月",
    "BI-Basic_July": "七月",
    "BI-Basic_April": "四月",
    "BI-Multi_Date_Quarter_Begin": "季度初",
    "BI-Multi_Date_Week": "周",
    "BI-Click_Blank_To_Select": "点击\"空格键\"选中完全匹配项",
    "BI-Basic_August": "八月",
    "BI-Word_Align_Left": "文字居左",
    "BI-Basic_November": "十一月",
    "BI-Font_Colour": "字体颜色",
    "BI-Multi_Date_Day_Prev": "天前",
    "BI-Select_Part": "部分选择",
    "BI-Multi_Date_Day_Next": "天后",
    "BI-Less_Than": "小于",
    "BI-Basic_February": "二月",
    "BI-Multi_Date_Year": "年",
    "BI-Number_Index": "序号",
    "BI-Multi_Date_Week_Prev": "周前",
    "BI-Next_Page": "下一页",
    "BI-Right_Page": "向右翻页",
    "BI-Numerical_Interval_Signal_Value": "前后值相等，请将操作符改为“≤”",
    "BI-Basic_December": "十二月",
    "BI-Basic_Saturday": "星期六",
    "BI-Basic_Simple_Wednesday": "三",
    "BI-Multi_Date_Quarter_Next": "个季度后",
    "BI-Basic_October": "十月",
    "BI-Basic_Simple_Friday": "五",
    "BI-Basic_Save": "保存",
    "BI-Numerical_Interval_Number_Value": "请保证前面的数值小于/等于后面的数值",
    "BI-Previous_Page": "上一页",
    "BI-No_Select": "搜索结果为空",
    "BI-Basic_Clears": "清空",
    "BI-Created_By_Me": "我创建的",
    "BI-Basic_Simple_Tuesday": "二",
    "BI-Word_Align_Right": "文字居右",
    "BI-Summary_Values": "汇总",
    "BI-Basic_Clear": "清除",
    "BI-Upload_File_Size_Error": "文件大小不支持",
    "BI-Up_Page": "向上翻页",
    "BI-Basic_Simple_Sunday": "日",
    "BI-Multi_Date_Relative_Current_Time": "相对当前时间",
    "BI-Selected_Data": "已选数据：",
    "BI-Multi_Date_Quarter": "季度",
    "BI-Check_Selected": "查看已选",
    "BI-Basic_Search": "搜索",
    "BI-Basic_May": "五月",
    "BI-Continue_Select": "继续选择",
    "BI-Please_Input_Positive_Integer": "请输入正整数",
    "BI-Upload_File_Type_Error": "文件类型不支持",
    "BI-Upload_File_Error": "文件上传失败",
    "BI-Basic_Friday": "星期五",
    "BI-Down_Page": "向下翻页",
    "BI-Basic_Monday": "星期一",
    "BI-Left_Page": "向左翻页",
    "BI-Transparent_Color": "透明",
    "BI-Basic_Simple_Monday": "一",
    "BI-Multi_Date_Year_End": "年末",
    "BI-Time_Interval_Error_Text": "请保证开始时间早于/等于结束时间",
    "BI-Basic_Time": "时间",
    "BI-Basic_OK": "确定",
    "BI-Basic_Sure": "确定",
    "BI-Basic_Simple_Thursday": "四",
    "BI-Multi_Date_Year_Prev": "年前",
    "BI-Tiao_Data": "条数据",
    "BI-Basic_Italic": "斜体",
    "BI-Basic_Dynamic_Title": "动态时间",
    "BI-Basic_Year": "年",
    "BI-Basic_Single_Quarter": "季",
    "BI-Basic_Month": "月",
    "BI-Basic_Week": "周",
    "BI-Basic_Day": "天",
    "BI-Basic_Work_Day": "工作日",
    "BI-Basic_Front": "前",
    "BI-Basic_Behind": "后",
    "BI-Basic_Empty": "空",
    "BI-Basic_Month_End": "月末",
    "BI-Basic_Month_Begin": "月初",
    "BI-Basic_Year_End": "年末",
    "BI-Basic_Year_Begin": "年初",
    "BI-Basic_Quarter_End": "季末",
    "BI-Basic_Quarter_Begin": "季初",
    "BI-Basic_Week_End": "周末",
    "BI-Basic_Week_Begin": "周初",
    "BI-Basic_Current_Day": "当天",
    "BI-Basic_Begin_Start": "初",
    "BI-Basic_End_Stop": "末",
    "BI-Basic_Current_Year": "今年",
    "BI-Basic_Year_Fen": "年份",
    "BI-Basic_Current_Month": "本月",
    "BI-Basic_Current_Quarter": "本季度",
    "BI-Basic_Year_Month": "年月",
    "BI-Basic_Year_Quarter": "年季度",
    "BI-Basic_Input_Can_Not_Null": "输入框不能为空",
    "BI-Basic_Date_Time_Error_Text": "日期格式示例:2015-3-11 00:00:00",
    "BI-Basic_Input_From_To_Number": "请输入{R1}的数值",
    "BI-Basic_Or": "或",
    "BI-Basic_And": "且",
    "BI-Conf_Add_Formula": "添加公式",
    "BI-Conf_Add_Condition": "添加条件",
    "BI-Conf_Formula_And": "且公式条件",
    "BI-Conf_Formula_Or": "或公式条件",
    "BI-Conf_Condition_And": "且条件",
    "BI-Conf_Condition_Or": "或条件",
    "BI-Microsoft_YaHei": "微软雅黑",
    "BI-Apple_Light": "苹方-light",
    "BI-Font_Family": "字体",
    "BI-Basic_Please_Input_Content": "请输入内容",
    "BI-Word_Align_Center": "文字居中",
    "BI-Basic_Please_Enter_Number_Between": "请输入{R1}-{R2}的值",
    "BI-More_Than": "大于",
    "BI-More_And_Equal": "大于等于",
    "BI-Please_Enter_SQL": "请输入SQL",
    "BI-Basic_Click_To_Add_Text": "+点击新增\"{R1}\"",
    "BI-Basic_Please_Select": "请选择",
    "BI-Basic_Font_Color": "文字颜色",
    "BI-Basic_Background_Color": "背景色",
    "BI-Basic_Underline": "下划线",
    "BI-Basic_Param_Month": "{R1}月",
    "BI-Basic_Param_Day": "{R1}日",
    "BI-Basic_Param_Quarter": "{R1}季度",
    "BI-Basic_Param_Week_Count": "第{R1}周",
    "BI-Basic_Param_Hour": "{R1}时",
    "BI-Basic_Param_Minute": "{R1}分",
    "BI-Basic_Param_Second": "{R1}秒",
    "BI-Basic_Param_Year": "{R1}年",
    "BI-Basic_Date_Day": "日",
    "BI-Basic_Hour_Sin": "时",
    "BI-Basic_Seconds": "秒",
    "BI-Basic_Minute": "分",
    "BI-Basic_Wan": "万",
    "BI-Basic_Million": "百万",
    "BI-Basic_Billion": "亿",
    "BI-Basic_Quarter": "季度",
    "BI-Basic_No_Select": "不选",
    "BI-Basic_Now": "此刻"
};

/***/ })

/******/ });