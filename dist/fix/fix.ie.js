function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash'), require('underscore')) : typeof define === 'function' && define.amd ? define(['exports', 'lodash', 'underscore'], factory) : factory(global.Fix = global.Fix || {}, global._, global._);
})(this, function (exports, lodash, _$1) {
    'use strict';

    _$1 = 'default' in _$1 ? _$1['default'] : _$1;

    var falsy = void 0;
    var $$skipArray = {
        $accessors: falsy,
        $vbthis: falsy,
        $vbsetter: falsy,
        $vm: falsy
    };

    var $$skips = ['$accessors', '$vbthis', '$vbsetter', '$vm'];

    var originalMethods = [];
    _$1.each(['slice', 'splice'], function (method) {
        originalMethods[method] = Array.prototype[method];
    });

    // Array.prototype.slice = function (...args) {
    //     let array = originalMethods["slice"].apply(this, args);
    //     // let result = [];
    //     // for (let i = 0; i < array.length; i++) {
    //     //     if (Object.prototype.toString.call(array[i]) === "[object Array]") result[i] = [...array[i]];
    //     //     if (Object.prototype.toString.call(array[i]) === "[object Object]") result[i] = _.extend({}, array[i]);
    //     //     result[i] = array[i];
    //     // }
    //     this.__ref__ = makeHashCode();
    //     return array;
    // }

    Array.prototype.splice = function () {
        // for (let i = 0; i < this.length; i++) {
        //     if (Object.prototype.toString.call(this[i]) === "[object Array]") this[i] = [...this[i]];
        //     if (Object.prototype.toString.call(this[i]) === "[object Object]") this[i] = _.extend({}, this[i]);
        // }
        this.__ref__ = makeHashCode();

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return originalMethods["splice"].apply(this, args);
    };

    function noop(a, b, c) {}

    function isNative(Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
    }

    var rhashcode = /\d\.\d{4}/;

    // 生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    function makeHashCode() {
        var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'bi';

        /* istanbul ignore next*/
        return String(Math.random() + Math.random()).replace(rhashcode, prefix);
    }

    function isIE() {
        if (typeof navigator === 'undefined') {
            return false;
        }

        return (/(msie|trident)/i.test(navigator.userAgent.toLowerCase())
        );
    }

    function getIEVersion() {
        var version = 0;
        if (typeof navigator === 'undefined') {
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
    }
    var isIE9Below = isIE() && getIEVersion() < 9;

    var _toString = Object.prototype.toString;

    function isPlainObject(obj) {
        return _toString.call(obj) === '[object Object]';
    }

    var bailRE = /[^\w.$]/;

    /* eslint no-param-reassign: ['off'] */
    function parsePath(path) {
        if (bailRE.test(path)) {
            return;
        }
        var segments = path.split('.');

        return function (obj) {
            for (var i = 0; i < segments.length; i++) {
                if (!obj) return;
                obj = obj[segments[i]];
            }

            return obj;
        };
    }

    function toJSON(model) {
        var result = void 0;
        if (_$1.isArray(model)) {
            result = [];
            for (var i = 0, len = model.length; i < len; i++) {
                result[i] = toJSON(model[i]);
            }
        } else if (model && isPlainObject(model)) {
            result = {};
            for (var key in model) {
                if ($$skips.indexOf(key) === -1) {
                    result[key] = toJSON(model[key]);
                }
            }
        } else {
            result = model;
        }
        return result;
    }

    function cloneShadow(obj) {
        if (obj === null) return null;

        if (Array.isArray(obj)) {
            var result = [].concat(obj);
            if (obj.__ref__ !== undefined) result.__ref__ = obj.__ref__;
            return result;
        }

        return toJSON(obj);
    }

    var nextTick = function () {
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

        // An asynchronous deferring mechanism.
        // In pre 2.4, we used to use microtasks (Promise/MutationObserver)
        // but microtasks actually has too high a priority and fires in between
        // supposedly sequential events (e.g. #4521, #6690) or even between
        // bubbling of the same event (#6566). Technically setImmediate should be
        // the ideal choice, but it's not available everywhere; and the only polyfill
        // that consistently queues the callback after all DOM events triggered in the
        // same loop is by using MessageChannel.
        /* istanbul ignore if */
        if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
            timerFunc = function timerFunc() {
                setImmediate(nextTickHandler);
            };
        } else if (typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) ||
        // PhantomJS
        MessageChannel.toString() === '[object MessageChannelConstructor]')) {
            var channel = new MessageChannel();
            var port = channel.port2;
            channel.port1.onmessage = nextTickHandler;
            timerFunc = function timerFunc() {
                port.postMessage(1);
            };
            /* istanbul ignore next */
        } else if (typeof Promise !== 'undefined' && isNative(Promise)) {
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
            var _resolve = void 0;
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
            }
            // $flow-disable-line
            if (!cb && typeof Promise !== 'undefined') {
                return new Promise(function (resolve, reject) {
                    _resolve = resolve;
                });
            }
        };
    }();

    function inherit(sb, sp, overrides) {
        if (typeof sp === "object") {
            overrides = sp;
            sp = sb;
            sb = function temp() {
                return sp.apply(this, arguments);
            };
        }
        var F = function F() {},
            spp = sp.prototype;
        F.prototype = spp;
        sb.prototype = new F();
        sb.superclass = spp;
        _$1.extend(sb.prototype, overrides, {
            superclass: sp
        });
        return sb;
    }

    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;
    var ObjProto = Object.prototype;
    var toString = ObjProto.toString;

    // Internal recursive comparison function for `isEqual`.
    /* eslint no-param-reassign: ['off'] */
    /* eslint no-use-before-define: ["off"] */
    var deepEq = function deepEq(a, b, aStack, bStack) {
        // Unwrap any wrapped objects.
        if (a instanceof _$1) a = a._wrapped;
        if (b instanceof _$1) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            case '[object String]':
                // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN.
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.

                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
            case '[object Symbol]':
                return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
            default:
        }

        var areArrays = className === '[object Array]';

        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor,
                bCtor = b.constructor;
            if (aCtor !== bCtor && !(_$1.isFunction(aCtor) && aCtor instanceof aCtor && _$1.isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = _$1.keys(a);var key = void 0;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (_$1.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if ($$skips.indexOf(key) !== -1) {
                    return true;
                }

                if (!(Object.keys(b).indexOf(key) !== -1 && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();

        return true;
    };

    var eq = function eq(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // `null` or `undefined` only equal to itself (strict comparison).
        if (a == null || b == null) return false;
        // `NaN`s are equivalent, but non-reflexive.
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;

        // skip function
        if (type === 'function') return true;

        return deepEq(a, b, aStack, bStack);
    };

    // export function isShadowEqual(a, b) {
    //     return shadowEq(a, b);
    // }

    function isShadowEqual(a, b) {
        if (a === b) return true;

        if (a && b && typeof a == 'object' && typeof b == 'object') {
            if (a.constructor !== b.constructor) return false;

            var length = void 0,
                i = void 0,
                key = void 0,
                keys = void 0;
            if (Array.isArray(a)) {
                length = a.length;
                if (length !== b.length) return false;
                for (i = length; i-- !== 0;) {
                    if (!isShadowEqual(a[i], b[i])) return false;
                }

                return true;
            }

            if (a.constructor === RegExp) return true;
            if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
            if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

            keys = Object.keys(a);
            length = keys.length;
            if (length !== Object.keys(b).length) return false;

            for (i = length; i-- !== 0;) {
                if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
            }

            for (i = length; i-- !== 0;) {
                key = keys[i];
                if ($$skips.indexOf(key) !== -1) continue;
                if (!isShadowEqual(a[key], b[key])) return false;
            }

            return true;
        }

        // skip function
        if (typeof a === 'function') return true;

        // true if both NaN, false otherwise
        return a !== a && b !== b;
    }

    var mixinInjection = {};

    function getMixins(type) {
        return mixinInjection[type];
    }

    function mixin(xtype, cls) {
        mixinInjection[xtype] = _.cloneDeep(cls);
    }

    var falsy$1 = void 0;
    var operators = {
        '||': falsy$1,
        '&&': falsy$1,
        '(': falsy$1,
        ')': falsy$1
    };

    function runBinaryFunction(binarys) {
        var expr = '';
        for (var i = 0, len = binarys.length; i < len; i++) {
            if (_$1.isBoolean(binarys[i]) || _$1.has(operators, binarys[i])) {
                expr += binarys[i];
            } else {
                expr += 'false';
            }
        }

        return new Function('return ' + expr)();
    }

    function watch(vm, expOrFn, cb) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        var model = vm;
        if (!model.$watch && model.$vm) {
            model = model.$vm;
        }
        if (isPlainObject(cb)) {
            options = cb;
            cb = cb.handler;
        }
        if (typeof cb === 'string') {
            cb = model[cb];
        }
        options = options || {};
        options.user = true;
        var exps = void 0;
        if (_$1.isFunction(expOrFn) || !(exps = expOrFn.match(/[a-zA-Z0-9_.*]+|[|][|]|[&][&]|[(]|[)]/g)) || exps.length === 1 && !/\*/.test(expOrFn)) {
            model.$watch(expOrFn, cb, options);

            return [];
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
                cb.call(vm, newValue, oldValue, attrs);
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
        _$1.each(exps, function (exp, i) {
            if (_$1.has(operators, exp)) {
                return;
            }
            // a.**或a.*形式
            if (/^[1-9a-zA-Z.]+(\*\*$|\*$)/.test(exp) || exp === '**') {
                var isGlobal = /\*\*$/.test(exp);
                if (isGlobal) {
                    // a.**的形式
                    exp = exp.replace('.**', '');
                } else {
                    // a.*的形式
                    exp = exp.replace('.*', '');
                }
                var getter = isGlobal ? exp : function () {
                    var result = {};
                    _$1.each(model.model, function (v, key) {
                        if (key in $$skipArray) return;
                        result[key] = v;
                    });

                    return result;
                };
                model.$watch(getter, function (newValue, oldValue, attrs) {
                    callback(i, newValue, oldValue, _$1.extend({ index: i }, attrs));
                }, _$1.extend(options, {
                    deep: isGlobal
                }));

                return;
            }
            if (/\*\*$|\*$/.test(exp)) {
                throw new Error('not support');
            }
            // 其他含有*的情况，如*.a,*.*.a,a.*.a
            if (/\*/.test(exp)) {
                // 先获取到能获取到的对象
                var paths = exp.split('.');
                var _getter = function _getter() {
                    var currentModels = {
                        root: model.model
                    };

                    var _loop = function _loop(len, _i) {
                        var models = {};
                        if (paths[_i] === '*') {
                            _$1.each(currentModels, function (model, key) {
                                _$1.each(model, function (v, k) {
                                    if (key + k in $$skipArray) return;
                                    models[key + k] = v;
                                });
                            });
                        } else {
                            _$1.each(currentModels, function (model, key) {
                                if (key + paths[_i] in $$skipArray) return;
                                models[key + paths[_i]] = model[paths[_i]];
                            });
                        }
                        currentModels = models;
                    };

                    for (var _i = 0, len = paths.length; _i < len; _i++) {
                        _loop(len, _i);
                    }

                    return currentModels;
                };
                model.$watch(_getter, function (newValue, oldValue, attrs) {
                    callback(i, newValue, oldValue, _$1.extend({ index: i }, attrs));
                }, options);

                return;
            }
            model.$watch(exp, function (newValue, oldValue, attrs) {
                callback(i, newValue, oldValue, _$1.extend({ index: i }, attrs));
            }, options);
        });

        return watchers;
    }

    var allModelInstances = {};
    var allDefineModelInstances = {};
    var emptyFn = function emptyFn() {};
    var TTL = 10;

    var Watcher = function () {
        function Watcher(_ref) {
            var get = _ref.get,
                last = _ref.last,
                listener = _ref.listener,
                sync = _ref.sync,
                deep = _ref.deep,
                id = _ref.id;

            _classCallCheck(this, Watcher);

            this.id = id;
            this.get = get;
            this.last = cloneShadow(last);
            this.listener = listener || emptyFn;
            this.sync = sync || false;

            return {
                id: this.id,
                get: this.get,
                last: this.last,
                listener: this.listener
            };
        }

        // 不要去掉，为了兼容IE8，IE8下instance of Constructor如果不绑定函数会出错


        Watcher.prototype.getInstance = function getInstance() {
            return this;
        };

        return Watcher;
    }();

    function initState(vm, state) {
        var watchers = vm._stateWatchers = {};
        for (var key in state) {
            vm.model[key] = state[key];
        }
        // state暂不支持func和context

        var _loop2 = function _loop2(_key2) {
            var userDef = state[_key2];

            watchers[_key2] = new Watcher({
                id: vm._modelHashId + '-' + _key2,
                get: function get() {
                    return vm.model[_key2];
                },
                last: userDef,
                listener: vm.options.defaultCallback || emptyFn
            });
        };

        for (var _key2 in state) {
            _loop2(_key2);
        }
    }

    function initComputed(vm, computed) {
        var watchers = vm._computedWatchers = {};
        var order = vm._computedOrder = [];

        for (var key in computed) {
            var userDef = computed[key],
                context = vm;

            order.push(key);

            watchers[key] = new Watcher({
                id: vm._modelHashId + '-' + key,
                get: _$1.bind(userDef, context),
                last: undefined,
                listener: emptyFn
            });
        }
    }

    function initWatch(vm, watchObj) {
        vm._watchers || (vm._watchers = []);
        for (var expOrFn in watchObj) {
            var handler = watchObj[expOrFn];
            if (_$1.isArray(handler)) {
                for (var i = 0; i < handler.length; i++) {
                    watch(vm, expOrFn, handler[i]);
                }
            } else {
                watch(vm, expOrFn, handler);
            }
        }
    }

    /* eslint no-param-reassign: ['off'] */
    function createWatcher(vm, expOrFn, cb) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        if (isPlainObject(cb)) {
            options = cb;
            cb = cb.handler;
        }
        if (typeof cb === 'string') {
            cb = vm[cb];
        }
        var getter = _$1.isFunction(expOrFn) ? _$1.bind(expOrFn, vm) : _$1.bind(function () {
            return parsePath('model.' + expOrFn)(vm);
        }, vm);

        return new Watcher({
            get: getter,
            listener: _$1.bind(cb, vm),
            last: getter(),
            sync: options.sync,
            deep: options.deep,
            id: options.id
        });
    }

    function injectMethod(method, vm) {
        return function () {
            var result = method.apply(vm, [].concat(Array.prototype.slice.call(arguments)));
            // 有回调的函数不作处理，拦截ajax请求
            vm.$digest();

            return result;
        };
    }

    function initMethods(vm, methods) {
        for (var key in methods) {
            vm[key] = methods[key] == null ? noop : injectMethod(methods[key], vm);
        }
    }

    function initMixins(vm) {
        var mixins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _$1.each(mixins.reverse(), function (mixinType) {
            var mixin$$1 = getMixins(mixinType);

            for (var key in mixin$$1) {
                if (typeof mixin$$1[key] !== 'function') continue;

                if (_$1.has(vm, key)) continue;

                vm[key] = injectMethod(mixin$$1[key], vm);
            }
        });
    }

    function defineContext(vm, keys) {
        var watchers = vm._contextWatchers = {};

        // 相关context挂上别的model中的修改监听
        function getSingleContext(key) {
            var p = vm._parent;
            while (p) {
                if (p.childContext && p.childContext.indexOf(key) > -1) {
                    p.$watch(key, function (cur, last, p) {
                        if (!vm._contextWatchers[key]) return;
                        vm.model[key] = cur;
                        vm._contextWatchers[key].last = cloneShadow(cur); // 避免重复调用（可以改成给watch添加一个参数保证下次比较一定相同）
                        vm.$digest();
                    }, {
                        id: vm._modelHashId + '-' + key
                    });

                    return {
                        p: p,
                        value: p.model[key]
                    };
                }
                p = p._parent;
            }
        }

        _$1.each(keys, function (key) {
            var context = getSingleContext(key);
            if (!context) return;
            vm.model[key] = context.p ? context.p.model[key] : undefined;
            watchers[key] = new Watcher({
                id: context.p._modelHashId + '-' + key,
                get: function get() {
                    return vm.model[key];
                },
                last: vm.model[key],
                listener: _$1.bind(function (c) {
                    context.p.model[key] = c;
                    // context.p.model[key] = vm.model[key];
                    context.p.$digest();
                }, context.p)
            });
        });
    }

    function digestState(vm) {
        var dirty = false;
        _$1.each(vm._stateWatchers, function (watcher, key) {
            var cur = watcher.get();
            var last = watcher.last;
            if (!isShadowEqual(cur, last)) {
                // addToListenerQueue(vm, watcher, cur, last);
                vm.model[key] = cur;
                dirty = true;
                watcher.last = cloneShadow(cur);
            }
        });

        return dirty;
    }

    function digestComputed(vm) {
        var dirty = false;
        var dirtyQueue = [],
            cleanQueue = [];

        _$1.each(vm._computedOrder, function (key) {
            var watcher = vm._computedWatchers[key];

            try {
                var cur = watcher.get();
                var last = watcher.last;
                if (!isShadowEqual(cur, last)) {
                    // addToListenerQueue(vm, watcher, cur, last);
                    vm.model[key] = cur;
                    dirty = true;
                    dirtyQueue.push(key);
                    watcher.last = cloneShadow(cur);
                } else {
                    cleanQueue.push(key);
                }
            } catch (err) {
                dirty = true;
                dirtyQueue.push(key);
            }
        });

        vm._computedOrder = [].concat(cleanQueue, dirtyQueue);

        return dirty;
    }

    function digestContext(vm) {
        var dirty = false;
        _$1.each(vm._contextWatchers, function (watcher, key) {
            var cur = watcher.get();
            var last = watcher.last;
            if (!isShadowEqual(cur, last)) {
                var listener = {
                    id: watcher.id,
                    cb: _$1.bind(watcher.listener, vm, cur, last, vm)
                };
                vm.contextListeners.push(listener);
                vm.model[key] = cur;
                dirty = true;
                watcher.last = cloneShadow(cur);
            }
        });

        return dirty;
    }

    function digest(vm) {
        var stateDirty = true,
            contextDirty = true,
            computedDirty = true;
        for (var ttl = TTL; stateDirty && ttl > 0; ttl--) {
            stateDirty = digestState(vm);
        }
        for (var _ttl = TTL; contextDirty && _ttl > 0; _ttl--) {
            contextDirty = digestContext(vm);
        }
        for (var _ttl2 = TTL; computedDirty && _ttl2 > 0; _ttl2--) {
            computedDirty = digestComputed(vm);
        }
    }

    var nextListener = function () {
        var callbackMap = {};

        return function queueNextListener(listener, ctx) {
            var id = listener.id;
            var cb = listener.cb;
            if (id && callbackMap[id]) {
                return;
            }
            nextTick(function () {
                cb();
                callbackMap[id] = false;
            }, ctx);
            callbackMap[id] = true;
        };
    }();

    function executeWatchListeners(vm) {
        var syncListeners = [].concat(vm.syncListeners || []);
        var asyncListeners = [].concat(vm.asyncListeners || []);
        var contextListeners = [].concat(vm.contextListeners || []);

        vm.asyncListeners = [];
        vm.syncListeners = [];

        var watchers = [].concat(vm._watchers);

        _$1.each(watchers, function (watcher) {
            if (!watcher) return;
            var cur = watcher.get();
            var last = watcher.last;

            if (isShadowEqual(cur, last)) return;

            var listner = {
                id: watcher.id,
                cb: _$1.bind(watcher.listener, vm, cur, last, vm)
            };

            watcher.sync === true ? syncListeners.push(listner) : asyncListeners.push(listner);

            watcher.last = cloneShadow(cur);
        });

        _$1.each(syncListeners, function (listener) {
            listener.cb();
        });
        if (contextListeners.length !== 0 || asyncListeners.length !== 0) {
            nextTick(function () {
                _$1.each(BI.uniqBy(contextListeners.reverse(), "id").reverse(), function (listener) {
                    listener.cb();
                });
                _$1.each(asyncListeners, function (listener) {
                    listener.cb();
                });
            });
        }
    }

    function refreshAllDefineModel() {
        _$1.each(allDefineModelInstances, function (insta) {
            insta && insta.$digest && insta.$digest();
        });
    }

    var Model = function () {
        function Model() {
            _classCallCheck(this, Model);
        }

        Model.prototype._constructor = function _constructor(model) {
            this.alive = true;
            this.options = model || {};
            this.model = {
                $vm: this
            };
            this._modelHashId = makeHashCode('model');
            this.syncListeners = [];
            this.asyncListeners = [];
            this.contextListeners = [];

            this._parent = Model.target;
            var state = _$1.isFunction(this.state) ? this.state() : this.state;
            var computed = this.computed;
            // Todo
            var context = this.context;
            var childContext = this.childContext;
            var watch$$1 = this.watch;
            var actions = this.actions;
            var mixins = this.mixins;

            context && defineContext(this, context);

            initMixins(this, mixins);
            this.init();
            initState(this, state);
            initComputed(this, computed);
            digest(this);
            initWatch(this, watch$$1);
            initMethods(this, actions);
            this.created && this.created();
            allModelInstances[this._modelHashId] = this;
        };

        Model.prototype._init = function _init() {};

        Model.prototype.init = function init() {
            this._init();
        };

        Model.prototype.destroy = function destroy() {
            this.alive = false;
            allModelInstances[this._modelHashId] = null;
            this._watchers && (this._watchers = []);
            this._computedWatchers && (this._computedWatchers = []);
            this._stateWatchers && (this._stateWatchers = []);
            this._contextWatchers && (this._contextWatchers = []);
            this.destroyed && this.destroyed();
        };

        Model.prototype.$watch = function $watch(expOrFn, cb, options) {
            var watcher = createWatcher(this, expOrFn, cb, options);
            this._watchers.push(watcher);
        };

        Model.prototype.$digest = function $digest() {
            digest(this);

            executeWatchListeners(this);

            // 非define创建的model$digest触发所有define定义的model的$digest(未来需要平台去除这些写法))
            if (!this.options.define) {
                refreshAllDefineModel();
            }
        };

        Model.prototype.getModelID = function getModelID() {
            return this._modelHashId;
        };

        return Model;
    }();

    function getAllModelInstances() {
        return allModelInstances;
    }

    function refreshAll() {
        _$1.each(getAllModelInstances(), function (insta) {
            insta && insta.$digest && insta.$digest();
        });
    }

    function define(model) {
        var OB = inherit(Model, {
            state: function state() {
                return model;
            }
        });
        var ob = new OB();
        ob._constructor({
            define: true
        });
        allDefineModelInstances[ob.getModelID()] = ob;

        return ob.model;
    }

    var version = '2.0';

    exports.version = version;
    exports.$$skipArray = $$skipArray;
    exports.mixin = mixin;
    exports.toJSON = toJSON;
    exports.nextListener = nextListener;
    exports.Model = Model;
    exports.getAllModelInstances = getAllModelInstances;
    exports.refreshAll = refreshAll;
    exports.define = define;
    exports.inherit = inherit;
    exports.watch = watch;

    exports.__esModule = true;
});