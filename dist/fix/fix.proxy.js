(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Fix = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   * IMPORTANT: all calls of this function must be prefixed with
   * \/\*#\_\_PURE\_\_\*\/
   * So that rollup can tree-shake them if necessary.
   */
  function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');

    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }

    return expectsLowerCase ? function (val) {
      return !!map[val.toLowerCase()];
    } : function (val) {
      return !!map[val];
    };
  }

  Object.freeze({});
  Object.freeze([]);
  var extend = Object.assign;
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var hasOwn = function hasOwn(val, key) {
    return hasOwnProperty.call(val, key);
  };

  var isArray = Array.isArray;

  var isMap$1 = function isMap(val) {
    return toTypeString$1(val) === '[object Map]';
  };

  var isFunction = function isFunction(val) {
    return typeof val === 'function';
  };

  var isString = function isString(val) {
    return typeof val === 'string';
  };

  var isSymbol = function isSymbol(val) {
    return _typeof(val) === 'symbol';
  };

  var isObject = function isObject(val) {
    return val !== null && _typeof(val) === 'object';
  };

  var objectToString$1 = Object.prototype.toString;

  var toTypeString$1 = function toTypeString(value) {
    return objectToString$1.call(value);
  };

  var toRawType = function toRawType(value) {
    // extract "RawType" from strings like "[object RawType]"
    return toTypeString$1(value).slice(8, -1);
  };

  var isIntegerKey = function isIntegerKey(key) {
    return isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;
  };

  var cacheStringFunction = function cacheStringFunction(fn) {
    var cache = Object.create(null);
    return function (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  /**
   * @private
   */


  var capitalize = cacheStringFunction(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }); // compare whether a value has changed, accounting for NaN.

  var hasChanged$1 = function hasChanged(value, oldValue) {
    return !Object.is(value, oldValue);
  };

  var activeEffectScope;

  function recordEffectScope(effect, scope) {
    scope = scope || activeEffectScope;

    if (scope && scope.active) {
      scope.effects.push(effect);
    }
  }

  var createDep = function createDep(effects) {
    var dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
  };

  var wasTracked = function wasTracked(dep) {
    return (dep.w & trackOpBit) > 0;
  };

  var newTracked = function newTracked(dep) {
    return (dep.n & trackOpBit) > 0;
  };

  var initDepMarkers = function initDepMarkers(_ref) {
    var deps = _ref.deps;

    if (deps.length) {
      for (var i = 0; i < deps.length; i++) {
        deps[i].w |= trackOpBit; // set was tracked
      }
    }
  };

  var finalizeDepMarkers = function finalizeDepMarkers(effect) {
    var deps = effect.deps;

    if (deps.length) {
      var ptr = 0;

      for (var i = 0; i < deps.length; i++) {
        var dep = deps[i];

        if (wasTracked(dep) && !newTracked(dep)) {
          dep.delete(effect);
        } else {
          deps[ptr++] = dep;
        } // clear bits


        dep.w &= ~trackOpBit;
        dep.n &= ~trackOpBit;
      }

      deps.length = ptr;
    }
  };

  var targetMap = new WeakMap(); // The number of effects currently being tracked recursively.

  var effectTrackDepth = 0;
  var trackOpBit = 1;
  /**
   * The bitwise track markers support at most 30 levels of recursion.
   * This value is chosen to enable modern JS engines to use a SMI on all platforms.
   * When recursion depth is greater, fall back to using a full cleanup.
   */

  var maxMarkerBits = 30;
  var effectStack = [];
  var activeEffect;
  var ITERATE_KEY = Symbol('iterate');
  var MAP_KEY_ITERATE_KEY = Symbol('Map key iterate');

  var ReactiveEffect = /*#__PURE__*/function () {
    function ReactiveEffect(fn) {
      var scheduler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var scope = arguments.length > 2 ? arguments[2] : undefined;

      _classCallCheck(this, ReactiveEffect);

      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      recordEffectScope(this, scope);
    }

    _createClass(ReactiveEffect, [{
      key: "run",
      value: function run() {
        if (!this.active) {
          return this.fn();
        }

        if (!effectStack.includes(this)) {
          try {
            effectStack.push(activeEffect = this);
            enableTracking();
            trackOpBit = 1 << ++effectTrackDepth;

            if (effectTrackDepth <= maxMarkerBits) {
              initDepMarkers(this);
            } else {
              cleanupEffect(this);
            }

            return this.fn();
          } finally {
            if (effectTrackDepth <= maxMarkerBits) {
              finalizeDepMarkers(this);
            }

            trackOpBit = 1 << --effectTrackDepth;
            resetTracking();
            effectStack.pop();
            var n = effectStack.length;
            activeEffect = n > 0 ? effectStack[n - 1] : undefined;
          }
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        if (this.active) {
          cleanupEffect(this);

          if (this.onStop) {
            this.onStop();
          }

          this.active = false;
        }
      }
    }]);

    return ReactiveEffect;
  }();

  function cleanupEffect(effect) {
    var deps = effect.deps;

    if (deps.length) {
      for (var i = 0; i < deps.length; i++) {
        deps[i].delete(effect);
      }

      deps.length = 0;
    }
  }

  function effect(fn, options) {
    if (fn.effect) {
      fn = fn.effect.fn;
    }

    var _effect = new ReactiveEffect(fn);

    if (options) {
      extend(_effect, options);
      if (options.scope) recordEffectScope(_effect, options.scope);
    }

    if (!options || !options.lazy) {
      _effect.run();
    }

    var runner = _effect.run.bind(_effect);

    runner.effect = _effect;
    return runner;
  }

  function stop(runner) {
    runner.effect.stop();
  }

  var shouldTrack = true;
  var trackStack = [];

  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }

  function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
  }

  function resetTracking() {
    var last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
  }

  function track(target, type, key) {
    if (!isTracking()) {
      return;
    }

    var depsMap = targetMap.get(target);

    if (!depsMap) {
      targetMap.set(target, depsMap = new Map());
    }

    var dep = depsMap.get(key);

    if (!dep) {
      depsMap.set(key, dep = createDep());
    }

    var eventInfo = {
      effect: activeEffect,
      target: target,
      type: type,
      key: key
    };
    trackEffects(dep, eventInfo);
  }

  function isTracking() {
    return shouldTrack && activeEffect !== undefined;
  }

  function trackEffects(dep, debuggerEventExtraInfo) {
    var shouldTrack = false;

    if (effectTrackDepth <= maxMarkerBits) {
      if (!newTracked(dep)) {
        dep.n |= trackOpBit; // set newly tracked

        shouldTrack = !wasTracked(dep);
      }
    } else {
      // Full cleanup mode.
      shouldTrack = !dep.has(activeEffect);
    }

    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);

      if (activeEffect.onTrack) {
        activeEffect.onTrack(Object.assign({
          effect: activeEffect
        }, debuggerEventExtraInfo));
      }
    }
  }

  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    var depsMap = targetMap.get(target);

    if (!depsMap) {
      // never been tracked
      return;
    }

    var deps = [];

    if (type === "clear"
    /* CLEAR */
    ) {
        // collection being cleared
        // trigger all effects for target
        deps = _toConsumableArray(depsMap.values());
      } else if (key === 'length' && isArray(target)) {
      depsMap.forEach(function (dep, key) {
        if (key === 'length' || key >= newValue) {
          deps.push(dep);
        }
      });
    } else {
      // schedule runs for SET | ADD | DELETE
      if (key !== void 0) {
        deps.push(depsMap.get(key));
      } // also run for iteration key on ADD | DELETE | Map.SET


      switch (type) {
        case "add"
        /* ADD */
        :
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));

            if (isMap$1(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            // new index added to array -> length changes
            deps.push(depsMap.get('length'));
          }

          break;

        case "delete"
        /* DELETE */
        :
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));

            if (isMap$1(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }

          break;

        case "set"
        /* SET */
        :
          if (isMap$1(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
          }

          break;
      }
    }

    var eventInfo = {
      target: target,
      type: type,
      key: key,
      newValue: newValue,
      oldValue: oldValue,
      oldTarget: oldTarget
    };

    if (deps.length === 1) {
      if (deps[0]) {
        {
          triggerEffects(deps[0], eventInfo);
        }
      }
    } else {
      var effects = [];

      var _iterator = _createForOfIteratorHelper(deps),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var dep = _step.value;

          if (dep) {
            effects.push.apply(effects, _toConsumableArray(dep));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      {
        triggerEffects(createDep(effects), eventInfo);
      }
    }
  }

  function triggerEffects(dep, debuggerEventExtraInfo) {
    // spread into array for stabilization
    var _iterator2 = _createForOfIteratorHelper(isArray(dep) ? dep : _toConsumableArray(dep)),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _effect2 = _step2.value;

        if (_effect2 !== activeEffect || _effect2.allowRecurse) {
          if (_effect2.onTrigger) {
            _effect2.onTrigger(extend({
              effect: _effect2
            }, debuggerEventExtraInfo));
          }

          if (_effect2.scheduler) {
            _effect2.scheduler();
          } else {
            _effect2.run();
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  var isNonTrackableKeys = /*#__PURE__*/makeMap("__proto__,__v_isRef,__isVue");
  var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map(function (key) {
    return Symbol[key];
  }).filter(isSymbol));
  var get = /*#__PURE__*/createGetter();
  var readonlyGet = /*#__PURE__*/createGetter(true);
  var arrayInstrumentations = /*#__PURE__*/createArrayInstrumentations();

  function createArrayInstrumentations() {
    var instrumentations = {};
    ['includes', 'indexOf', 'lastIndexOf'].forEach(function (key) {
      instrumentations[key] = function () {
        var arr = toRaw(this);

        for (var i = 0, l = this.length; i < l; i++) {
          track(arr, "get"
          /* GET */
          , i + '');
        } // we run the method using the original args first (which may be reactive)


        for (var _len2 = arguments.length, args = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var res = arr[key].apply(arr, args);

        if (res === -1 || res === false) {
          // if that didn't work, run it again using raw values.
          return arr[key].apply(arr, _toConsumableArray(args.map(toRaw)));
        } else {
          return res;
        }
      };
    });
    ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(function (key) {
      instrumentations[key] = function () {
        pauseTracking();

        for (var _len3 = arguments.length, args = new Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
          args[_key4] = arguments[_key4];
        }

        var res = toRaw(this)[key].apply(this, args);
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }

  function createGetter() {
    var isReadonly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var shallow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return function get(target, key, receiver) {
      if (key === "__v_isReactive"
      /* IS_REACTIVE */
      ) {
          return !isReadonly;
        } else if (key === "__v_isReadonly"
      /* IS_READONLY */
      ) {
          return isReadonly;
        } else if (key === "__v_raw"
      /* RAW */
      && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }

      var targetIsArray = isArray(target);

      if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }

      var res = Reflect.get(target, key, receiver);

      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }

      if (!isReadonly) {
        track(target, "get"
        /* GET */
        , key);
      }

      if (shallow) {
        return res;
      }

      if (isRef(res)) {
        // ref unwrapping - does not apply for Array + integer key.
        var shouldUnwrap = !targetIsArray || !isIntegerKey(key);
        return shouldUnwrap ? res.value : res;
      }

      if (isObject(res)) {
        // Convert returned value into a proxy as well. we do the isObject check
        // here to avoid invalid value warning. Also need to lazy access readonly
        // and reactive here to avoid circular dependency.
        return isReadonly ? readonly(res) : reactive(res);
      }

      return res;
    };
  }

  var set$1 = /*#__PURE__*/createSetter();

  function createSetter() {
    var shallow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return function set(target, key, value, receiver) {
      var oldValue = target[key];

      if (!shallow && !isReadonly(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);

        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }

      var hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      var result = Reflect.set(target, key, value, receiver); // don't trigger if target is something up in the prototype chain of original

      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add"
          /* ADD */
          , key, value);
        } else if (hasChanged$1(value, oldValue)) {
          trigger(target, "set"
          /* SET */
          , key, value, oldValue);
        }
      }

      return result;
    };
  }

  function deleteProperty(target, key) {
    var hadKey = hasOwn(target, key);
    var oldValue = target[key];
    var result = Reflect.deleteProperty(target, key);

    if (result && hadKey) {
      trigger(target, "delete"
      /* DELETE */
      , key, undefined, oldValue);
    }

    return result;
  }

  function has$1(target, key) {
    var result = Reflect.has(target, key);

    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has"
      /* HAS */
      , key);
    }

    return result;
  }

  function ownKeys(target) {
    track(target, "iterate"
    /* ITERATE */
    , isArray(target) ? 'length' : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }

  var mutableHandlers = {
    get: get,
    set: set$1,
    deleteProperty: deleteProperty,
    has: has$1,
    ownKeys: ownKeys
  };
  var readonlyHandlers = {
    get: readonlyGet,
    set: function set(target, key) {
      {
        console.warn("Set operation on key \"".concat(String(key), "\" failed: target is readonly."), target);
      }
      return true;
    },
    deleteProperty: function deleteProperty(target, key) {
      {
        console.warn("Delete operation on key \"".concat(String(key), "\" failed: target is readonly."), target);
      }
      return true;
    }
  };

  var toShallow = function toShallow(value) {
    return value;
  };

  var getProto = function getProto(v) {
    return Reflect.getPrototypeOf(v);
  };

  function get$1(target, key) {
    var isReadonly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isShallow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    // #1772: readonly(reactive(Map)) should return readonly + reactive version
    // of the value
    target = target["__v_raw"
    /* RAW */
    ];
    var rawTarget = toRaw(target);
    var rawKey = toRaw(key);

    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "get"
      /* GET */
      , key);
    }

    !isReadonly && track(rawTarget, "get"
    /* GET */
    , rawKey);

    var _getProto = getProto(rawTarget),
        has = _getProto.has;

    var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;

    if (has.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      // #3602 readonly(reactive(Map))
      // ensure that the nested reactive `Map` can do tracking for itself
      target.get(key);
    }
  }

  function has$1$1(key) {
    var isReadonly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var target = this["__v_raw"
    /* RAW */
    ];
    var rawTarget = toRaw(target);
    var rawKey = toRaw(key);

    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "has"
      /* HAS */
      , key);
    }

    !isReadonly && track(rawTarget, "has"
    /* HAS */
    , rawKey);
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }

  function size(target) {
    var isReadonly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    target = target["__v_raw"
    /* RAW */
    ];
    !isReadonly && track(toRaw(target), "iterate"
    /* ITERATE */
    , ITERATE_KEY);
    return Reflect.get(target, 'size', target);
  }

  function add(value) {
    value = toRaw(value);
    var target = toRaw(this);
    var proto = getProto(target);
    var hadKey = proto.has.call(target, value);

    if (!hadKey) {
      target.add(value);
      trigger(target, "add"
      /* ADD */
      , value, value);
    }

    return this;
  }

  function set$1$1(key, value) {
    value = toRaw(value);
    var target = toRaw(this);

    var _getProto2 = getProto(target),
        has = _getProto2.has,
        get = _getProto2.get;

    var hadKey = has.call(target, key);

    if (!hadKey) {
      key = toRaw(key);
      hadKey = has.call(target, key);
    } else {
      checkIdentityKeys(target, has, key);
    }

    var oldValue = get.call(target, key);
    target.set(key, value);

    if (!hadKey) {
      trigger(target, "add"
      /* ADD */
      , key, value);
    } else if (hasChanged$1(value, oldValue)) {
      trigger(target, "set"
      /* SET */
      , key, value, oldValue);
    }

    return this;
  }

  function deleteEntry(key) {
    var target = toRaw(this);

    var _getProto3 = getProto(target),
        has = _getProto3.has,
        get = _getProto3.get;

    var hadKey = has.call(target, key);

    if (!hadKey) {
      key = toRaw(key);
      hadKey = has.call(target, key);
    } else {
      checkIdentityKeys(target, has, key);
    }

    var oldValue = get ? get.call(target, key) : undefined; // forward the operation before queueing reactions

    var result = target.delete(key);

    if (hadKey) {
      trigger(target, "delete"
      /* DELETE */
      , key, undefined, oldValue);
    }

    return result;
  }

  function clear() {
    var target = toRaw(this);
    var hadItems = target.size !== 0;
    var oldTarget = isMap$1(target) ? new Map(target) : new Set(target); // forward the operation before queueing reactions

    var result = target.clear();

    if (hadItems) {
      trigger(target, "clear"
      /* CLEAR */
      , undefined, undefined, oldTarget);
    }

    return result;
  }

  function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
      var observed = this;
      var target = observed["__v_raw"
      /* RAW */
      ];
      var rawTarget = toRaw(target);
      var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate"
      /* ITERATE */
      , ITERATE_KEY);
      return target.forEach(function (value, key) {
        // important: make sure the callback is
        // 1. invoked with the reactive map as `this` and 3rd arg
        // 2. the value received should be a corresponding reactive/readonly.
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }

  function createIterableMethod(method, isReadonly, isShallow) {
    return function () {
      var target = this["__v_raw"
      /* RAW */
      ];
      var rawTarget = toRaw(target);
      var targetIsMap = isMap$1(rawTarget);
      var isPair = method === 'entries' || method === Symbol.iterator && targetIsMap;
      var isKeyOnly = method === 'keys' && targetIsMap;
      var innerIterator = target[method].apply(target, arguments);
      var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate"
      /* ITERATE */
      , isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY); // return a wrapped iterator which returns observed versions of the
      // values emitted from the real iterator

      return _defineProperty({
        // iterator protocol
        next: function next() {
          var _innerIterator$next = innerIterator.next(),
              value = _innerIterator$next.value,
              done = _innerIterator$next.done;

          return done ? {
            value: value,
            done: done
          } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done: done
          };
        }
      }, Symbol.iterator, function () {
        return this;
      });
    };
  }

  function createReadonlyMethod(type) {
    return function () {
      {
        var key = (arguments.length <= 0 ? undefined : arguments[0]) ? "on key \"".concat(arguments.length <= 0 ? undefined : arguments[0], "\" ") : "";
        console.warn("".concat(capitalize(type), " operation ").concat(key, "failed: target is readonly."), toRaw(this));
      }
      return type === "delete"
      /* DELETE */
      ? false : this;
    };
  }

  function createInstrumentations() {
    var mutableInstrumentations = {
      get: function get(key) {
        return get$1(this, key);
      },

      get size() {
        return size(this);
      },

      has: has$1$1,
      add: add,
      set: set$1$1,
      delete: deleteEntry,
      clear: clear,
      forEach: createForEach(false, false)
    };
    var shallowInstrumentations = {
      get: function get(key) {
        return get$1(this, key, false, true);
      },

      get size() {
        return size(this);
      },

      has: has$1$1,
      add: add,
      set: set$1$1,
      delete: deleteEntry,
      clear: clear,
      forEach: createForEach(false, true)
    };
    var readonlyInstrumentations = {
      get: function get(key) {
        return get$1(this, key, true);
      },

      get size() {
        return size(this, true);
      },

      has: function has(key) {
        return has$1$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"
      /* ADD */
      ),
      set: createReadonlyMethod("set"
      /* SET */
      ),
      delete: createReadonlyMethod("delete"
      /* DELETE */
      ),
      clear: createReadonlyMethod("clear"
      /* CLEAR */
      ),
      forEach: createForEach(true, false)
    };
    var shallowReadonlyInstrumentations = {
      get: function get(key) {
        return get$1(this, key, true, true);
      },

      get size() {
        return size(this, true);
      },

      has: function has(key) {
        return has$1$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"
      /* ADD */
      ),
      set: createReadonlyMethod("set"
      /* SET */
      ),
      delete: createReadonlyMethod("delete"
      /* DELETE */
      ),
      clear: createReadonlyMethod("clear"
      /* CLEAR */
      ),
      forEach: createForEach(true, true)
    };
    var iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
    iteratorMethods.forEach(function (method) {
      mutableInstrumentations[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations[method] = createIterableMethod(method, true, false);
      shallowInstrumentations[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
    });
    return [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations];
  }

  var _createInstrumentatio = /* #__PURE__*/createInstrumentations(),
      _createInstrumentatio2 = _slicedToArray(_createInstrumentatio, 4),
      mutableInstrumentations = _createInstrumentatio2[0],
      readonlyInstrumentations = _createInstrumentatio2[1],
      shallowInstrumentations = _createInstrumentatio2[2],
      shallowReadonlyInstrumentations = _createInstrumentatio2[3];

  function createInstrumentationGetter(isReadonly, shallow) {
    var instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
    return function (target, key, receiver) {
      if (key === "__v_isReactive"
      /* IS_REACTIVE */
      ) {
          return !isReadonly;
        } else if (key === "__v_isReadonly"
      /* IS_READONLY */
      ) {
          return isReadonly;
        } else if (key === "__v_raw"
      /* RAW */
      ) {
          return target;
        }

      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }

  var mutableCollectionHandlers = {
    get: /*#__PURE__*/createInstrumentationGetter(false, false)
  };
  var readonlyCollectionHandlers = {
    get: /*#__PURE__*/createInstrumentationGetter(true, false)
  };

  function checkIdentityKeys(target, has, key) {
    var rawKey = toRaw(key);

    if (rawKey !== key && has.call(target, rawKey)) {
      var type = toRawType(target);
      console.warn("Reactive ".concat(type, " contains both the raw and reactive ") + "versions of the same object".concat(type === "Map" ? " as keys" : "", ", ") + "which can lead to inconsistencies. " + "Avoid differentiating between the raw and reactive versions " + "of an object and only use the reactive version if possible.");
    }
  }

  var reactiveMap = new WeakMap();
  var shallowReactiveMap = new WeakMap();
  var readonlyMap = new WeakMap();
  var shallowReadonlyMap = new WeakMap();

  function targetTypeMap(rawType) {
    switch (rawType) {
      case 'Object':
      case 'Array':
        return 1
        /* COMMON */
        ;

      case 'Map':
      case 'Set':
      case 'WeakMap':
      case 'WeakSet':
        return 2
        /* COLLECTION */
        ;

      default:
        return 0
        /* INVALID */
        ;
    }
  }

  function getTargetType(value) {
    return value["__v_skip"
    /* SKIP */
    ] || !Object.isExtensible(value) ? 0
    /* INVALID */
    : targetTypeMap(toRawType(value));
  }

  function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && target["__v_isReadonly"
    /* IS_READONLY */
    ]) {
      return target;
    }

    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  /**
   * Creates a readonly copy of the original object. Note the returned copy is not
   * made reactive, but `readonly` can be called on an already reactive object.
   */


  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }

  function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      {
        console.warn("value cannot be made reactive: ".concat(String(target)));
      }
      return target;
    } // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object


    if (target["__v_raw"
    /* RAW */
    ] && !(isReadonly && target["__v_isReactive"
    /* IS_REACTIVE */
    ])) {
      return target;
    } // target already has corresponding Proxy


    var existingProxy = proxyMap.get(target);

    if (existingProxy) {
      return existingProxy;
    } // only a whitelist of value types can be observed.


    var targetType = getTargetType(target);

    if (targetType === 0
    /* INVALID */
    ) {
        return target;
      }

    var proxy = new Proxy(target, targetType === 2
    /* COLLECTION */
    ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }

  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"
      /* RAW */
      ]);
    }

    return !!(value && value["__v_isReactive"
    /* IS_REACTIVE */
    ]);
  }

  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"
    /* IS_READONLY */
    ]);
  }

  function toRaw(observed) {
    var raw = observed && observed["__v_raw"
    /* RAW */
    ];
    return raw ? toRaw(raw) : observed;
  }

  var toReactive = function toReactive(value) {
    return isObject(value) ? reactive(value) : value;
  };

  var toReadonly = function toReadonly(value) {
    return isObject(value) ? readonly(value) : value;
  };

  function trackRefValue(ref) {
    if (isTracking()) {
      ref = toRaw(ref);

      if (!ref.dep) {
        ref.dep = createDep();
      }

      {
        trackEffects(ref.dep, {
          target: ref,
          type: "get"
          /* GET */
          ,
          key: 'value'
        });
      }
    }
  }

  function triggerRefValue(ref, newVal) {
    ref = toRaw(ref);

    if (ref.dep) {
      {
        triggerEffects(ref.dep, {
          target: ref,
          type: "set"
          /* SET */
          ,
          key: 'value',
          newValue: newVal
        });
      }
    }
  }

  function isRef(r) {
    return Boolean(r && r.__v_isRef === true);
  }

  var ComputedRefImpl = /*#__PURE__*/function () {
    function ComputedRefImpl(getter, _setter, isReadonly) {
      var _this2 = this;

      _classCallCheck(this, ComputedRefImpl);

      this._setter = _setter;
      this.dep = undefined;
      this._dirty = true;
      this.__v_isRef = true;
      this.effect = new ReactiveEffect(getter, function () {
        if (!_this2._dirty) {
          _this2._dirty = true;
          triggerRefValue(_this2);
        }
      });
      this["__v_isReadonly"
      /* IS_READONLY */
      ] = isReadonly;
    }

    _createClass(ComputedRefImpl, [{
      key: "value",
      get: function get() {
        // the computed ref may get wrapped by other proxies e.g. readonly() #3376
        var self = toRaw(this);
        trackRefValue(self);

        if (self._dirty) {
          self._dirty = false;
          self._value = self.effect.run();
        }

        return self._value;
      },
      set: function set(newValue) {
        this._setter(newValue);
      }
    }]);

    return ComputedRefImpl;
  }();

  function computed(getterOrOptions, debugOptions) {
    var getter;
    var setter;
    var onlyGetter = isFunction(getterOrOptions);

    if (onlyGetter) {
      getter = getterOrOptions;

      setter = function setter() {
        console.warn('Write operation failed: computed value is readonly');
      };
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }

    var cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter);

    if (debugOptions) {
      cRef.effect.onTrack = debugOptions.onTrack;
      cRef.effect.onTrigger = debugOptions.onTrigger;
    }

    return cRef;
  }

  Promise.resolve();

  function noop() {}
  function isNative(Ctor) {
    return typeof Ctor === "function" && /native code/.test(Ctor.toString());
  }
  var isIE = function isIE() {
    if (typeof navigator === "undefined") {
      return false;
    }

    return /(msie|trident)/i.test(navigator.userAgent.toLowerCase());
  };
  var getIEVersion = function getIEVersion() {
    var version = 0;

    if (typeof navigator === "undefined") {
      return false;
    }

    var agent = navigator.userAgent.toLowerCase();
    var v1 = agent.match(/(?:msie\s([\w.]+))/);
    var v2 = agent.match(/(?:trident.*rv:([\w.]+))/);

    if (v1 && v2 && v1[1] && v2[1]) {
      version = Math.max(v1[1] * 1, v2[1] * 1);
    } else if (v1 && v1[1]) {
      version = v1[1] * 1;
    } else if (v2 && v2[1]) {
      version = v2[1] * 1;
    } else {
      version = 0;
    }

    return version;
  };
  isIE() && getIEVersion() < 9;
  var _toString = Object.prototype.toString;
  function isPlainObject(obj) {
    return _toString.call(obj) === "[object Object]";
  }

  function parsePath(path) {
    // if (bailRE.test(path)) {
    // return;
    // }
    var segments = path.length > 0 ? path.split(".") : [];
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) return;
        obj = obj[segments[i]];
      }

      return obj;
    };
  }
  var nextTick = function () {
    var callbacks = [];
    var pending = false;
    var timerFunc;

    function nextTickHandler() {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks.length = 0;

      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    } // An asynchronous deferring mechanism.
    // In pre 2.4, we used to use microtasks (Promise/MutationObserver)
    // but microtasks actually has too high a priority and fires in between
    // supposedly sequential events (e.g. #4521, #6690) or even between
    // bubbling of the same event (#6566). Technically setImmediate should be
    // the ideal choice, but it's not available everywhere; and the only polyfill
    // that consistently queues the callback after all DOM events triggered in the
    // same loop is by using MessageChannel.

    /* istanbul ignore if */


    if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
      timerFunc = function timerFunc() {
        setImmediate(nextTickHandler);
      };
    } else if (typeof MessageChannel !== "undefined" && (isNative(MessageChannel) || // PhantomJS
    MessageChannel.toString() === "[object MessageChannelConstructor]")) {
      var channel = new MessageChannel();
      var port = channel.port2;
      channel.port1.onmessage = nextTickHandler;

      timerFunc = function timerFunc() {
        port.postMessage(1);
      };
    } else if (typeof Promise !== "undefined" && isNative(Promise)) {
      /* istanbul ignore next */
      // use microtask in non-DOM environments, e.g. Weex
      var p = Promise.resolve();

      timerFunc = function timerFunc() {
        p.then(nextTickHandler);
      };
    } else {
      // fallback to setTimeout
      timerFunc = function timerFunc() {
        setTimeout(nextTickHandler, 0);
      };
    }

    return function queueNextTick(cb, ctx) {
      var _resolve;

      callbacks.push(function () {
        if (cb) {
          try {
            cb.call(ctx);
          } catch (e) {
            console.error(e);
          }
        } else if (_resolve) {
          _resolve(ctx);
        }
      });

      if (!pending) {
        pending = true;
        timerFunc();
      } // $flow-disable-line


      if (!cb && typeof Promise !== "undefined") {
        return new Promise(function (resolve) {
          _resolve = resolve;
        });
      }
    };
  }();

  var mixinInjection = {};
  function getMixins(type) {
    return mixinInjection[type];
  }
  function mixin(xtype, cls) {
    mixinInjection[xtype] = _.cloneDeep(cls);
  }

  var queue = [];
  var has = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  function resetSchedulerState() {
    index = queue.length = 0;
    has = {};
    waiting = flushing = false;
  }

  function flushSchedulerQueue() {
    flushing = true;
    var watcher;
    var id;
    var options; // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.

    queue.sort(function (a, b) {
      return a.id - b.id;
    }); // do not cache length because more watchers might be pushed
    // as we run existing watchers

    for (index = 0; index < queue.length; index++) {
      watcher = queue[index].watcher;
      options = queue[index].options;
      id = watcher.id;
      has[id] = null;
      watcher(options);
    }

    resetSchedulerState();
  }

  function queueWatcher(watcher, options) {
    var id = watcher.id;

    if (has[id] == null) {
      has[id] = true;

      if (!flushing) {
        queue.push({
          watcher: watcher,
          options: options
        });
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;

        while (i > index && queue[i].watcher.id > watcher.id) {
          i--;
        }

        queue.splice(i + 1, 0, {
          watcher: watcher,
          options: options
        });
      } // queue the flush


      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  function innerWatch(source, cb, options) {
    if (!_.isFunction(cb)) {
      console.warn("`watch(fn, options?)` signature has been moved to a separate API. " + "Use `watchEffect(fn, options?)` instead. `watch` now only " + "supports `watch(source, cb, options?) signature.");
    }

    return doWatch(source, cb, options);
  }
  var INITIAL_WATCHER_VALUE = {};
  var objectToString = Object.prototype.toString;

  var toTypeString = function toTypeString(value) {
    return objectToString.call(value);
  };

  var isMap = function isMap(val) {
    return toTypeString(val) === "[object Map]";
  };

  var isSet = function isSet(val) {
    return toTypeString(val) === "[object Set]";
  };

  var hasChanged = function hasChanged(value, oldValue) {
    return value !== oldValue && (value === value || oldValue === oldValue);
  };

  var uid = 0;

  function doWatch(source, cb, options, instance) {
    options = options || {};
    var _options = options,
        immediate = _options.immediate,
        deep = _options.deep,
        sync = _options.sync,
        onTrack = _options.onTrack,
        onTrigger = _options.onTrigger;

    if (!cb) {
      if (immediate !== undefined) {
        console.warn("watch() \"immediate\" option is only respected when using the " + "watch(source, callback, options?) signature.");
      }

      if (deep !== undefined) {
        console.warn("watch() \"deep\" option is only respected when using the " + "watch(source, callback, options?) signature.");
      }
    }

    var warnInvalidSource = function warnInvalidSource(s) {
      console.warn("Invalid watch source: ", s, "A watch source can only be a getter/effect function, a ref, " + "a reactive object, or an array of these types.");
    };

    var getter;
    var forceTrigger = false;

    if (isRef(source)) {
      getter = function getter() {
        return source.value;
      };

      forceTrigger = !!source._shallow;
    } else if (isReactive(source)) {
      getter = function getter() {
        return source;
      };

      deep = true;
    } else if (_.isArray(source)) {
      getter = function getter() {
        return source.map(function (s) {
          if (isRef(s)) {
            return s.value;
          } else if (isReactive(s)) {
            return traverse(s);
          } else if (_.isFunction(s)) {
            return s.call(instance);
          } else {
            warnInvalidSource(s);
          }
        });
      };
    } else if (_.isFunction(source)) {
      if (cb) {
        // getter with cb
        getter = function getter() {
          return source.call(instance);
        };
      } else {
        // no cb -> simple effect
        getter = function getter() {
          if (instance && instance.isUnmounted) {
            return;
          }

          if (cleanup) {
            cleanup();
          }

          return source.call(instance, onInvalidate);
        };
      }
    } else {
      getter = function getter() {};

      warnInvalidSource(source);
    }

    if (cb && deep) {
      var baseGetter = getter;

      getter = function getter() {
        return traverse(baseGetter());
      };
    }

    var cleanup;

    var onInvalidate = function onInvalidate(fn) {
      cleanup = runner.options.onStop = function () {
        fn.call(instance);
      };
    };

    var oldValue = _.isArray(source) ? [] : INITIAL_WATCHER_VALUE;

    var job = function job() {
      // 这里去掉的原因是，新增属性没有生效也会触发变化监听
      if (!runner.effect.active) {
        return;
      }

      if (cb) {
        // watch(source, cb)
        var newValue = runner();

        if (deep || forceTrigger || hasChanged(newValue, oldValue)) {
          // cleanup before running cb again
          if (cleanup) {
            cleanup();
          }

          cb.apply(instance, [newValue, // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue, onInvalidate]);
          oldValue = newValue;
        }
      } else {
        // watchEffect
        runner();
      }
    }; // important: mark the job as a watcher callback so that scheduler knows
    // it is allowed to self-trigger (#1727)


    job.allowRecurse = !!cb;
    job.id = ++uid;
    var scheduler;

    if (sync === true) {
      scheduler = job;
    } else {
      scheduler = function scheduler() {
        return queueWatcher(job);
      };
    }

    var runner = effect(function () {
      try {
        return getter();
      } catch (e) {// 吞掉异常
      }
    }, {
      lazy: true,
      onTrack: onTrack,
      onTrigger: onTrigger,
      scheduler: scheduler
    }); // initial run

    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = runner();
      }
    } else {
      runner();
    }

    return function () {
      stop(runner);
    };
  }

  function traverse(value) {
    var seen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

    if (!_.isObject(value) || seen.has(value)) {
      return value;
    }

    seen.add(value);

    if (isRef(value)) {
      traverse(value.value, seen);
    } else if (_.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        traverse(value[i], seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach(function (v) {
        traverse(v, seen);
      });
    } else {
      for (var key in value) {
        traverse(value[key], seen);
      }
    }

    return value;
  }

  var falsy;
  var operators = {
    "||": falsy,
    "&&": falsy,
    "(": falsy,
    ")": falsy
  };

  function runBinaryFunction(binarys) {
    var expr = "";

    for (var i = 0, len = binarys.length; i < len; i++) {
      if (_.isBoolean(binarys[i]) || _.has(operators, binarys[i])) {
        expr += binarys[i];
      } else {
        expr += "false";
      }
    }

    return new Function("return " + expr)();
  }

  function watchExp(model, getter) {
    var result = getter.call(model, model);

    if (_.isArray(result)) {
      return result.concat();
    }

    return result;
  }

  function watch(model, expOrFn, cb, options) {
    if (isPlainObject(cb)) {
      options = cb;
      cb = cb.handler;
    }

    if (typeof cb === "string") {
      cb = model[cb];
    }

    options = options || {};
    options.user = true;
    var exps;

    if (_.isFunction(expOrFn)) {
      var watcher = innerWatch(expOrFn, cb, options);
      return function unwatchFn() {
        watcher();
      };
    }

    if (!(exps = expOrFn.match(/[a-zA-Z0-9_.*]+|[|][|]|[&][&]|[(]|[)]/g)) || exps.length === 1 && !/\*/.test(expOrFn)) {
      var paths = expOrFn.split(".");
      var prePaths = paths.slice(0, paths.length - 1);
      var preGetter = parsePath(prePaths.join("."));
      var v = preGetter.call(model, model);
      var getter = parsePath(paths[paths.length - 1]);

      var _watcher = innerWatch(function () {
        return watchExp(v, getter);
      }, cb, options);

      return function unwatchFn() {
        _watcher();
      };
    }

    var watchers = [];
    var fns = exps.slice();
    var complete = false,
        running = false;

    var callback = function callback(index, newValue, oldValue, attrs) {
      if (complete === true) {
        return;
      }

      fns[index] = true;

      if (runBinaryFunction(fns)) {
        complete = true;
        cb(newValue, oldValue, attrs);
      }

      if (options && options.sync) {
        complete = false;
        running = false;
        fns = exps.slice();
      } else {
        if (!running) {
          running = true;
          nextTick(function () {
            complete = false;
            running = false;
            fns = exps.slice();
          });
        }
      }
    };

    _.each(exps, function (exp, i) {
      if (_.has(operators, exp)) {
        return;
      }

      if (exp.indexOf("*") >= 0) {
        // eslint-disable-next-line no-inner-declarations
        var travers = function travers(root, deps, parent, key, res) {
          if (deps.length === _paths.length) {
            root !== undefined && res.push({
              parent: parent,
              k: key
            });
            return;
          }

          if (root) {
            if (_paths[deps.length] === "*") {
              // 遍历所有节点
              for (var k in root) {
                travers(root[k], deps.concat([k]), root, k, res);
              }
            } else {
              var nextKey = _paths[deps.length];
              travers(root[nextKey], deps.concat([nextKey]), root, nextKey, res);
            }
          }
        };

        //a.**形式
        if (/^[1-9a-zA-Z.]+\*\*$/.test(exp) || exp === "**") {
          exp = exp.replace(".**", "");

          var _paths2 = exp.split(".");

          var _prePaths2 = _paths2.slice(0, _paths2.length - 1);

          var _preGetter = parsePath(_prePaths2.join("."));

          var _v2 = _preGetter.call(model, model);

          var _getter = exp === "**" ? function (m) {
            return m;
          } : parsePath(_paths2[_paths2.length - 1]);

          watchers.push(innerWatch(function () {
            return watchExp(_v2, _getter);
          }, function (newValue, oldValue) {
            // a.** 在a变化的时候不会触发change
            if (!_.isArray(newValue) && oldValue !== newValue) {
              return;
            }

            callback(i, NaN, NaN, _.extend({
              index: i
            }));
          }, _.extend({
            deep: true
          }, options)));
          return;
        }

        if (/^(\*\*\.)+[1-9a-zA-Z]+(\.\*\*$)/.test(exp)) {
          throw new Error("not support");
        } //含有*的情况，如a.*,如*.a,*.*.a,a.*.a
        //先获取到能获取到的对象


        var _paths = exp.split(".");

        var _prePaths = [];

        for (var _i = 0, len = _paths.length; _i < len; _i++) {
          if (_paths[_i] === "*") {
            break;
          }

          _prePaths[_i] = _paths[_i];
        }

        var _v;

        if (_prePaths.length > 0) {
          var _getter2 = parsePath(_prePaths.join("."));

          _v = _getter2.call(model, model);
        } else {
          _v = model;
        }

        _paths = _paths.slice(_prePaths.length);
        var changes = [];
        watchers.push(innerWatch(function () {
          var routes = [];
          travers(_v, [], _v, null, routes);

          for (var _i2 = 0, _len = routes.length; _i2 < _len; _i2++) {
            var _routes$_i = routes[_i2],
                parent = _routes$_i.parent,
                k = _routes$_i.k;

            for (var j = 0, l = changes.length; j < l; j++) {
              var _changes$j = changes[j],
                  target = _changes$j.target,
                  key = _changes$j.key;

              if (target === toRaw(parent) && key === k) {
                return true;
              }
            }
          }
        }, function (newValue) {
          changes = [];

          if (newValue === true) {
            callback(i, NaN, NaN, _.extend({
              index: i
            }));
          }
        }, _.extend({}, options, {
          deep: true,
          onTrigger: function onTrigger(_ref) {
            var target = _ref.target,
                key = _ref.key;
            changes.push({
              target: target,
              key: key
            });
          }
        })));
        return;
      }

      var getter = parsePath(exp);
      watchers.push(innerWatch(function () {
        return watchExp(model, getter);
      }, function (newValue, oldValue) {
        callback(i, newValue, oldValue, _.extend({
          index: i
        }));
      }, options));
    });

    return watchers;
  }

  var REACTIVE = true;

  function initState(vm, state) {
    if (state) {
      vm.$$state = REACTIVE ? reactive(state) : state;
    }
  }

  function initComputed(vm, c) {
    var $$computed = vm.$$computed = {};

    for (var key in c) {
      $$computed[key] = computed(_.bind(c[key], vm));
    }
  }

  function initWatch(vm, watch) {
    vm._watchers || (vm._watchers = []);

    for (var key in watch) {
      var handler = watch[key];

      if (_.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          vm._watchers.push(createWatcher(vm, key, handler[i]));
        }
      } else {
        vm._watchers.push(createWatcher(vm, key, handler));
      }
    }
  }

  function createWatcher(vm, keyOrFn, cb, options) {
    if (isPlainObject(cb)) {
      options = cb;
      cb = cb.handler;
    }

    if (typeof cb === "string") {
      cb = vm[cb];
    }

    return watch(vm.model, keyOrFn, _.bind(cb, vm), options);
  }

  function initMethods(vm, methods) {
    for (var key in methods) {
      vm[key] = methods[key] == null ? noop : _.bind(methods[key], vm);
    }
  }

  function initMixins(vm, mixins) {
    mixins = (mixins || []).slice(0);

    _.each(mixins.reverse(), function (mixinType) {
      var mixin = getMixins(mixinType);

      for (var key in mixin) {
        if (typeof mixin[key] !== "function") continue;
        if (_.has(vm, key)) continue;
        vm[key] = _.bind(mixin[key], vm);
      }
    });
  }

  function defineProps(vm) {
    vm.model = new Proxy({}, {
      get: function get(target, key) {
        if (vm.$$computed && key in vm.$$computed) {
          try {
            return vm.$$computed[key].value;
          } catch (e) {// 吞掉异常
          }

          return;
        }

        if (vm.$$state && key in vm.$$state) {
          return vm.$$state[key];
        }

        var p = vm._parent;

        while (p) {
          if (p.$$context && key in p.$$context) {
            return p.$$context[key];
          }

          p = p._parent;
        }
      },
      set: function set(target, key, value) {
        if (vm.$$state && key in vm.$$state) {
          vm.$$state[key] = value;
          return true;
        }

        var p = vm._parent;

        while (p) {
          if (p.$$context && key in p.$$context) {
            p.$$context[key] = value;
            return true;
          }

          p = p._parent;
        }

        return true;
      }
    });
  }

  function defineContext(vm, keys) {
    var props = {};

    var _loop = function _loop(i, len) {
      var key = keys[i];
      props[key] = {
        enumerable: true,
        configurable: true,
        get: function get() {
          return vm.model[key];
        },
        set: function set(val) {
          return vm.model[key] = val;
        }
      };
    };

    for (var i = 0, len = keys.length; i < len; i++) {
      _loop(i);
    }

    vm.$$context = Object.defineProperties({}, props);
  }

  function getInjectValue(vm, key) {
    var p = vm._parent;

    while (p) {
      if (p.$$context && key in p.$$context) {
        return p.$$context[key];
      }

      p = p._parent;
    }
  }

  function getInjectValues(vm) {
    var inject = vm.inject || [];
    var result = {};

    _.each(inject, function (key) {
      result[key] = getInjectValue(vm, key);
    });

    return result;
  }

  var Model = /*#__PURE__*/function () {
    function Model() {
      _classCallCheck(this, Model);
    }

    _createClass(Model, [{
      key: "_constructor",
      value: function _constructor(options, destroyHandler) {
        this.options = options || {};
        this._parent = Model.target;
        var state = _.isFunction(this.state) ? this.state() : this.state;
        var computed = this.computed;
        var context = this.context;
        var inject = this.inject;
        var childContext = this.childContext;
        var watch = this.watch;
        var actions = this.actions;

        _.keys(state).concat(_.keys(computed)).concat(inject || []).concat(context || []);

        var mixins = this.mixins;
        defineProps(this);
        childContext && defineContext(this, childContext);
        initMixins(this, mixins);
        this.init();
        initState(this, _.extend(getInjectValues(this), state));
        initComputed(this, computed);
        REACTIVE && initWatch(this, watch);
        initMethods(this, actions);
        this.created && this.created();
        this._destroyHandler = destroyHandler;
      }
    }, {
      key: "_init",
      value: function _init() {}
    }, {
      key: "init",
      value: function init() {
        this._init();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _.each(this._watchers, function (unwatches) {
          unwatches = _.isArray(unwatches) ? unwatches : [unwatches];

          _.each(unwatches, function (unwatch) {
            unwatch();
          });
        });

        this._watchers && (this._watchers = []);
        this.destroyed && this.destroyed();
        this.$$computed = null;
        this.$$state = null;
        this._destroyHandler && this._destroyHandler();
      }
    }]);

    return Model;
  }();
  function set(target, key, val) {
    if (_.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }

    target[key] = val;
    return target;
  }
  function freeze(value) {
    Object.defineProperty(value, '__v_skip', {
      configurable: true,
      enumerable: false,
      value: value
    });
    return value;
  }
  function del(target, key) {
    if (_.isArray(target)) {
      target.splice(key, 1);
      return;
    }

    if (!_.has(target, key)) {
      return;
    }

    delete target[key];
  }
  function define(model) {
    return REACTIVE ? reactive(model) : model;
  }
  function config(options) {
    options || (options = {});

    if ("reactive" in options) {
      REACTIVE = options.reactive;
    }
  }

  function toJSON(model) {
    var result;

    if (_.isArray(model)) {
      result = [];

      for (var i = 0, len = model.length; i < len; i++) {
        result[i] = toJSON(model[i]);
      }
    } else if (model && isPlainObject(model)) {
      result = {};

      for (var key in model) {
        result[key] = toJSON(model[key]);
      }
    } else {
      result = model;
    }

    return result;
  }

  var version = "3.0";

  exports.Model = Model;
  exports.config = config;
  exports.define = define;
  exports.del = del;
  exports.freeze = freeze;
  exports.mixin = mixin;
  exports.set = set;
  exports.toJSON = toJSON;
  exports.version = version;
  exports.watch = watch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
