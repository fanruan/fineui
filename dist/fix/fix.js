function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.Fix = global.Fix || {});
})(this, function (exports) {
    'use strict';

    function noop(a, b, c) {}

    function isNative(Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
    }

    var rhashcode = /\d\.\d{4}/;

    //生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    function makeHashCode(prefix) {
        /* istanbul ignore next*/
        prefix = prefix || 'bi';
        /* istanbul ignore next*/
        return String(Math.random() + Math.random()).replace(rhashcode, prefix);
    }

    var hasProto = '__proto__' in {};

    var isIE = function isIE() {
        if (typeof navigator === "undefined") {
            return false;
        }
        return (/(msie|trident)/i.test(navigator.userAgent.toLowerCase())
        );
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
    var isIE9Below = isIE() && getIEVersion() < 9;

    var _toString = Object.prototype.toString;

    function isPlainObject(obj) {
        return _toString.call(obj) === '[object Object]';
    }

    function isConfigurable(obj, key) {
        var configurable = true;
        var property = Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            configurable = false;
        }
        return configurable;
    }

    function isExtensible(obj) {
        if (Object.isExtensible) {
            return Object.isExtensible(obj);
        }
        var name = '';
        while (obj.hasOwnProperty(name)) {
            name += '?';
        }
        obj[name] = true;
        var returnValue = obj.hasOwnProperty(name);
        delete obj[name];
        return returnValue;
    }

    function remove(arr, item) {
        if (arr && arr.length) {
            var _index = arr.indexOf(item);
            if (_index > -1) {
                return arr.splice(_index, 1);
            }
        }
    }

    // const bailRE = /[^\w.$]/

    function parsePath(path) {
        // 正常表达式比较慢，能不要的就不要了
        // if (bailRE.test(path)) {
        //     return
        // }
        var segments = path.split('.');
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
        } else
            /* istanbul ignore next */
            if (typeof Promise !== 'undefined' && isNative(Promise)) {
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

    var falsy;
    var $$skipArray = {
        __ob__: falsy,
        $accessors: falsy,
        $vbthis: falsy,
        $vbsetter: falsy
    };

    var uid = 0;

    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     */

    var Dep = function () {
        function Dep() {
            _classCallCheck(this, Dep);

            this.id = uid++;
            this.subs = [];
        }

        Dep.prototype.addSub = function addSub(sub) {
            this.subs.push(sub);
        };

        Dep.prototype.removeSub = function removeSub(sub) {
            remove(this.subs, sub);
        };

        Dep.prototype.depend = function depend() {
            if (Dep.target) {
                Dep.target.addDep(this);
            }
        };

        Dep.prototype.notify = function notify(options) {
            // stabilize the subscriber list first
            var subs = this.subs.slice();
            for (var i = 0, l = subs.length; i < l; i++) {
                subs[i].update(options);
            }
        };

        return Dep;
    }();

    // the current target watcher being evaluated.
    // this is globally unique because there could be only one
    // watcher being evaluated at any time.


    Dep.target = null;
    var targetStack = [];

    function pushTarget(_target) {
        if (Dep.target) targetStack.push(Dep.target);
        Dep.target = _target;
    }

    function popTarget() {
        Dep.target = targetStack.pop();
    }

    //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
    //标准浏览器使用__defineGetter__, __defineSetter__实现
    var canHideProperty = true;
    try {
        Object.defineProperty({}, '_', {
            value: 'x'
        });
        delete $$skipArray.$vbsetter;
        delete $$skipArray.$vbthis;
    } catch (e) {
        /* istanbul ignore next*/
        canHideProperty = false;
    }

    var createViewModel = Object.defineProperties;
    var defineProperty = void 0;

    var timeBucket = new Date() - 0;
    /* istanbul ignore if*/
    if (!canHideProperty) {
        if ('__defineGetter__' in {}) {
            defineProperty = function defineProperty(obj, prop, desc) {
                if ('value' in desc) {
                    obj[prop] = desc.value;
                }
                if ('get' in desc) {
                    obj.__defineGetter__(prop, desc.get);
                }
                if ('set' in desc) {
                    obj.__defineSetter__(prop, desc.set);
                }
                return obj;
            };
            createViewModel = function createViewModel(obj, descs) {
                for (var prop in descs) {
                    if (descs.hasOwnProperty(prop)) {
                        defineProperty(obj, prop, descs[prop]);
                    }
                }
                return obj;
            };
        }
        /* istanbul ignore if*/
        if (isIE9Below) {
            var VBClassPool = {};
            window.execScript([// jshint ignore:line
            'Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function' //转换一段文本为VB代码
            ].join('\n'), 'VBScript');

            var VBMediator = function VBMediator(instance, accessors, name, value) {
                // jshint ignore:line
                var accessor = accessors[name];
                if (arguments.length === 4) {
                    accessor.set.call(instance, value);
                } else {
                    return accessor.get.call(instance);
                }
            };
            createViewModel = function createViewModel(name, accessors, properties) {
                // jshint ignore:line
                var buffer = [];
                buffer.push('\tPrivate [$vbsetter]', '\tPublic  [$accessors]', '\tPublic Default Function [$vbthis](ac' + timeBucket + ', s' + timeBucket + ')', '\t\tSet  [$accessors] = ac' + timeBucket + ': set [$vbsetter] = s' + timeBucket, '\t\tSet  [$vbthis]    = Me', //链式调用
                '\tEnd Function');
                //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
                var uniq = {
                    $vbthis: true,
                    $vbsetter: true,
                    $accessors: true
                };
                for (name in $$skipArray) {
                    if (!uniq[name]) {
                        buffer.push('\tPublic [' + name + ']');
                        uniq[name] = true;
                    }
                }
                //添加访问器属性
                for (name in accessors) {
                    if (uniq[name]) {
                        continue;
                    }
                    uniq[name] = true;
                    buffer.push(
                    //由于不知对方会传入什么,因此set, let都用上
                    '\tPublic Property Let [' + name + '](val' + timeBucket + ')', //setter
                    '\t\tCall [$vbsetter](Me, [$accessors], "' + name + '", val' + timeBucket + ')', '\tEnd Property', '\tPublic Property Set [' + name + '](val' + timeBucket + ')', //setter
                    '\t\tCall [$vbsetter](Me, [$accessors], "' + name + '", val' + timeBucket + ')', '\tEnd Property', '\tPublic Property Get [' + name + ']', //getter
                    '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
                    '\t\tSet[' + name + '] = [$vbsetter](Me, [$accessors],"' + name + '")', '\tIf Err.Number <> 0 Then', '\t\t[' + name + '] = [$vbsetter](Me, [$accessors],"' + name + '")', '\tEnd If', '\tOn Error Goto 0', '\tEnd Property');
                }

                for (name in properties) {
                    if (!uniq[name]) {
                        uniq[name] = true;
                        buffer.push('\tPublic [' + name + ']');
                    }
                }

                buffer.push('\tPublic [hasOwnProperty]');
                buffer.push('End Class');
                var body = buffer.join('\r\n');
                var className = VBClassPool[body];
                if (!className) {
                    className = makeHashCode('VBClass');
                    window.parseVB('Class ' + className + body);
                    window.parseVB(['Function ' + className + 'Factory(acc, vbm)', //创建实例并传入两个关键的参数
                    '\tDim o', '\tSet o = (New ' + className + ')(acc, vbm)', '\tSet ' + className + 'Factory = o', 'End Function'].join('\r\n'));
                    VBClassPool[body] = className;
                }
                var ret = window[className + 'Factory'](accessors, VBMediator); //得到其产品
                return ret; //得到其产品
            };
        }
    }

    var createViewModel$1 = createViewModel;

    var queue = [];
    var activatedChildren = [];
    var has = {};
    var waiting = false;
    var flushing = false;
    var index = 0;

    function resetSchedulerState() {
        index = queue.length = activatedChildren.length = 0;
        has = {};
        waiting = flushing = false;
    }

    function flushSchedulerQueue() {
        flushing = true;
        var watcher = void 0,
            id = void 0,
            options = void 0;

        // Sort queue before flush.
        // This ensures that:
        // 1. Components are updated from parent to child. (because parent is always
        //    created before the child)
        // 2. A component's user watchers are run before its render watcher (because
        //    user watchers are created before the render watcher)
        // 3. If a component is destroyed during a parent component's watcher run,
        //    its watchers can be skipped.
        queue.sort(function (a, b) {
            return a.id - b.id;
        });

        // do not cache length because more watchers might be pushed
        // as we run existing watchers
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index].watcher;
            options = queue[index].options;
            id = watcher.id;
            has[id] = null;
            watcher.run(options);
        }

        resetSchedulerState();
    }

    function queueWatcher(watcher, options) {
        var id = watcher.id;
        if (has[id] == null) {
            has[id] = true;
            if (!flushing) {
                queue.push({ watcher: watcher, options: options });
            } else {
                // if already flushing, splice the watcher based on its id
                // if already past its id, it will be run next immediately.
                var i = queue.length - 1;
                while (i > index && queue[i].watcher.id > watcher.id) {
                    i--;
                }
                queue.splice(i + 1, 0, { watcher: watcher, options: options });
            }
            // queue the flush
            if (!waiting) {
                waiting = true;
                nextTick(flushSchedulerQueue);
            }
        }
    }

    var uid$1 = 0;

    var Watcher = function () {
        function Watcher(vm, expOrFn, cb, options) {
            _classCallCheck(this, Watcher);

            this.vm = vm;
            // vm._watchers || (vm._watchers = [])
            // vm._watchers.push(this)
            // options
            if (options) {
                this.deep = !!options.deep;
                this.user = !!options.user;
                this.lazy = !!options.lazy;
                this.sync = !!options.sync;
            } else {
                this.deep = this.user = this.lazy = this.sync = false;
            }
            this.cb = cb;
            this.id = ++uid$1; // uid for batching
            this.active = true;
            this.dirty = this.lazy; // for lazy watchers
            this.deps = [];
            this.newDeps = [];
            this.depIds = new Set();
            this.newDepIds = new Set();
            this.expression = '';
            // parse expression for getter
            if (typeof expOrFn === 'function') {
                this.getter = expOrFn;
            } else {
                this.getter = parsePath(expOrFn);
                if (!this.getter) {
                    this.getter = function () {};
                }
            }
            this.value = this.lazy ? undefined : this.get();
        }

        Watcher.prototype.get = function get() {
            pushTarget(this);
            var value = void 0;
            var vm = this.vm;
            try {
                value = this.getter.call(vm, vm);
            } catch (e) {
                // if (this.user) {
                // } else {
                // console.error(e)
                // }
            } finally {
                // "touch" every property so they are all tracked as
                // dependencies for deep watching
                if (this.deep) {
                    traverse(value);
                }
                popTarget();
                this.cleanupDeps();
            }
            return value;
        };

        Watcher.prototype.addDep = function addDep(dep) {
            var id = dep.id;
            if (!this.newDepIds.has(id)) {
                this.newDepIds.add(id);
                this.newDeps.push(dep);
                if (!this.depIds.has(id)) {
                    dep.addSub(this);
                }
            }
        };

        Watcher.prototype.cleanupDeps = function cleanupDeps() {
            var i = this.deps.length;
            while (i--) {
                var dep = this.deps[i];
                if (!this.newDepIds.has(dep.id)) {
                    dep.removeSub(this);
                }
            }
            var tmp = this.depIds;
            this.depIds = this.newDepIds;
            this.newDepIds = tmp;
            this.newDepIds.clear();
            tmp = this.deps;
            this.deps = this.newDeps;
            this.newDeps = tmp;
            this.newDeps.length = 0;
        };

        Watcher.prototype.update = function update(options) {
            /* istanbul ignore else */
            if (this.lazy) {
                this.dirty = true;
            } else if (this.sync) {
                this.run(options);
            } else {
                queueWatcher(this, options);
            }
        };

        Watcher.prototype.run = function run(options) {
            if (this.active) {
                var value = this.get();
                if (value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                _.isObject(value) && options && options.refresh || this.deep) {
                    // set new value
                    var oldValue = this.value;
                    this.value = value;
                    if (this.user) {
                        try {
                            this.cb.call(this.vm, value, oldValue, options);
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        try {
                            this.cb.call(this.vm, value, oldValue, options);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        };

        Watcher.prototype.evaluate = function evaluate() {
            this.value = this.get();
            this.dirty = false;
        };

        Watcher.prototype.depend = function depend() {
            var i = this.deps.length;
            while (i--) {
                this.deps[i].depend();
            }
        };

        Watcher.prototype.teardown = function teardown() {
            if (this.active) {
                // remove self from vm's watcher list
                // this is a somewhat expensive operation so we skip it
                // if the vm is being destroyed.
                remove(this.vm && this.vm._watchers, this);
                var i = this.deps.length;
                while (i--) {
                    this.deps[i].removeSub(this);
                }
                this.active = false;
            }
        };

        return Watcher;
    }();

    var seenObjects = new Set();

    function traverse(val) {
        seenObjects.clear();
        _traverse(val, seenObjects);
    }

    function _traverse(val, seen) {
        var i = void 0,
            keys = void 0;
        var isA = _.isArray(val);
        if (!isA && !_.isObject(val)) {
            return;
        }
        if (val.__ob__) {
            var depId = val.__ob__.dep.id;
            if (seen.has(depId)) {
                return;
            }
            seen.add(depId);
        }
        if (isA) {
            i = val.length;
            while (i--) {
                _traverse(val[i], seen);
            }
        } else {
            keys = _.keys(val);
            i = keys.length;
            while (i--) {
                _traverse(val[keys[i]], seen);
            }
        }
    }

    var arrayProto = Array.prototype;
    var arrayMethods = [];
    _.each(['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'], function (method) {
        var original = arrayProto[method];
        arrayMethods[method] = function mutator() {
            for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var ob = this.__ob__;
            var inserted = void 0;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.slice(2);
                    break;
            }
            if (inserted) inserted = ob.observeArray(inserted);
            switch (method) {
                case 'push':
                case 'unshift':
                    args = inserted;
                    break;
                case 'splice':
                    if (args.length > 2) {
                        args = [args[0], args[1]].concat(inserted ? inserted : []);
                    }
                    break;
            }
            var result = original.apply(this, args);
            notify(ob.parent, ob.parentKey, ob.dep, true);
            return result;
        };
    });

    var arrayKeys = _.keys(arrayMethods);

    var observerState = {
        shouldConvert: true
    };

    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    }

    /**
     * Observer class that are attached to each observed
     * object. Once attached, the observer converts target
     * object's property keys into getter/setters that
     * collect dependencies and dispatches updates.
     */

    var Observer = function () {
        function Observer(value) {
            _classCallCheck(this, Observer);

            this.value = value;
            this.dep = new Dep();
            this.vmCount = 0;
            if (_.isArray(value)) {
                var augment = hasProto ? protoAugment : copyAugment;
                augment(value, arrayMethods, arrayKeys);
                this.model = this.observeArray(value);
            } else {
                this.model = this.walk(value);
            }
            if (isIE9Below) {
                this.model['__ob__'] = this;
            } else {
                def(this.model, "__ob__", this);
            }
        }

        Observer.prototype.walk = function walk(obj) {
            return defineReactive(obj, this);
        };

        Observer.prototype.observeArray = function observeArray(items) {
            for (var i = 0, l = items.length; i < l; i++) {
                var ob = observe(items[i], this, i);
                items[i] = ob ? ob.model : items[i];
            }
            return items;
        };

        return Observer;
    }();

    function protoAugment(target, src, keys) {
        /* eslint-disable no-proto */
        target.__proto__ = src;
        /* eslint-enable no-proto */
    }

    /* istanbul ignore next */
    function copyAugment(target, src, keys) {
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            target[key] = src[key];
        }
    }

    function observe(value, parentObserver, parentKey) {
        if (!_.isObject(value)) {
            return;
        }
        var ob = void 0;
        if (value.__ob__ instanceof Observer) {
            ob = value.__ob__;
        } else if (observerState.shouldConvert && isExtensible(value) && (_.isArray(value) || isPlainObject(value))) {
            ob = new Observer(value);
        }
        if (ob) {
            ob.parent = parentObserver || ob.parent;
            ob.parentKey = parentKey;
        }
        return ob;
    }

    function notify(observer, key, dep, refresh) {
        dep.notify({ observer: observer, key: key, refresh: refresh });
        if (observer) {
            //触发a.*绑定的依赖
            _.each(observer._deps, function (dep) {
                dep.notify({ observer: observer, key: key });
            });
            //触发a.**绑定的依赖
            var parent = observer,
                root = observer,
                route = key || "";
            while (parent) {
                _.each(parent._scopeDeps, function (dep) {
                    dep.notify({ observer: observer, key: key });
                });
                if (parent.parentKey != null) {
                    route = parent.parentKey + '.' + route;
                }
                root = parent;
                parent = parent.parent;
            }
            for (var _key in root._globalDeps) {
                var reg = new RegExp(_key);
                if (reg.test(route)) {
                    for (var i = 0; i < root._globalDeps[_key].length; i++) {
                        root._globalDeps[_key][i].notify({ observer: observer, key: _key });
                    }
                }
            }
        }
    }

    function defineReactive(obj, observer, shallow) {
        var props = {};
        var model = void 0;
        // if (typeof Proxy === 'function') {
        //     const deps = {}, childObs = {}, cache = {}
        //     _.each(obj, function (val, key) {
        //         if (key in $$skipArray) {
        //             return
        //         }
        //         cache[key] = val
        //         const dep = deps[key] = (observer && observer['__dep' + key]) || new Dep()
        //         observer && (observer['__dep' + key] = dep)
        //         childObs[key] = !shallow && observe(val, observer, key)
        //     })
        //     return model = new Proxy(props, {
        //         has: function (target, key) {
        //             return key in obj;
        //         },
        //         get: function (target, key) {
        //             if (key in $$skipArray) {
        //                 return target[key]
        //             }
        //             const value = cache[key]
        //             if (Dep.target) {
        //                 deps[key].depend()
        //                 if (childObs[key]) {
        //                     childObs[key].dep.depend()
        //                     if (_.isArray(value)) {
        //                         dependArray(value)
        //                     }
        //                 }
        //             }
        //             return value
        //         },
        //         set: function (target, key, newVal) {
        //             if (key in $$skipArray) {
        //                 return target[key] = newVal
        //             }
        //             const value = cache[key], dep = deps[key]
        //             if (newVal === value || (newVal !== newVal && value !== value)) {
        //                 return newVal
        //             }
        //             cache[key] = newVal
        //             childObs[key] = !shallow && observe(newVal, observer, key)
        //             obj[key] = childObs[key] ? childObs[key].model : newVal
        //             notify(model, key, dep)
        //             return obj[key]
        //         }
        //     })
        // }
        _.each(obj, function (val, key) {
            if (key in $$skipArray) {
                return;
            }
            var configurable = isConfigurable(obj, key);
            var dep = observer && observer['__dep' + key] || new Dep();
            observer && (observer['__dep' + key] = dep);
            var childOb = configurable && !shallow && observe(val, observer, key);
            props[key] = {
                enumerable: true,
                configurable: true,
                get: function reactiveGetter() {
                    var value = childOb ? childOb.model : val;
                    if (Dep.target) {
                        dep.depend();
                        if (childOb) {
                            childOb.dep.depend();
                            if (_.isArray(value)) {
                                dependArray(value);
                            }
                        }
                    }
                    return value;
                },
                set: function reactiveSetter(newVal) {
                    var value = childOb ? childOb.model : val;
                    if (newVal === value || newVal !== newVal && value !== value) {
                        return;
                    }
                    val = newVal;
                    childOb = configurable && !shallow && observe(newVal, observer, key);
                    if (childOb && value && value.__ob__) {
                        childOb._scopeDeps = value.__ob__._scopeDeps;
                        childOb._deps = value.__ob__._deps;
                    }
                    obj[key] = childOb ? childOb.model : newVal;
                    notify(model.__ob__, key, dep);
                }
            };
        });
        return model = createViewModel$1(obj, props);
    }

    /**
     * Set a property on an object. Adds the new property and
     * triggers change notification if the property doesn't
     * already exist.
     */
    function set(target, key, val) {
        if (_.isArray(target)) {
            target.length = Math.max(target.length, key);
            target.splice(key, 1, val);
            return val;
        }
        if (_.has(target, key)) {
            target[key] = val;
            return val;
        }
        var ob = target.__ob__;
        if (!ob) {
            target[key] = val;
            return val;
        }
        ob.value[key] = val;
        target = defineReactive(ob.value, ob);
        notify(ob, key, ob.dep);
        return target;
    }

    function freeze() {
        return Object.freeze.apply(null, arguments);
    }

    /**
     * Delete a property and trigger change if necessary.
     */
    function del(target, key) {
        if (_.isArray(target)) {
            target.splice(key, 1);
            return;
        }
        var ob = target.__ob__;
        if (!_.has(target, key)) {
            return;
        }
        if (!ob) {
            delete target[key];
            return target;
        }
        delete ob.value[key];
        target = defineReactive(ob.value, ob);
        notify(ob, key, ob.dep);
        return target;
    }

    /**
     * Collect dependencies on array elements when the array is touched, since
     * we cannot intercept array element access like property getters.
     */
    function dependArray(value) {
        for (var e, i = 0, l = value.length; i < l; i++) {
            e = value[i];
            e && e.__ob__ && e.__ob__.dep.depend();
            if (_.isArray(e)) {
                dependArray(e);
            }
        }
    }

    var falsy$1;
    var operators = {
        '||': falsy$1,
        '&&': falsy$1,
        '(': falsy$1,
        ')': falsy$1
    };

    function runBinaryFunction(binarys) {
        var expr = '';
        for (var i = 0, len = binarys.length; i < len; i++) {
            if (_.isBoolean(binarys[i]) || _.has(operators, binarys[i])) {
                expr += binarys[i];
            } else {
                expr += 'false';
            }
        }
        return new Function('return ' + expr)();
    }

    function routeToRegExp(route) {
        route = route.replace(/\*\*/g, '[a-zA-Z0-9_]+').replace(/\*./g, '[a-zA-Z0-9_]+.');
        return '^' + route + '$';
    }

    function watch(model, expOrFn, cb, options) {
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
        if (_.isFunction(expOrFn) || !(exps = expOrFn.match(/[a-zA-Z0-9_.*]+|[|][|]|[&][&]|[(]|[)]/g)) || exps.length === 1 && expOrFn.indexOf("*") < 0) {
            var watcher = new Watcher(model, expOrFn, cb, options);
            if (options.immediate) {
                cb(watcher.value);
            }
            return function unwatchFn() {
                watcher.teardown();
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
                //a.**或a.*形式
                if (/^[1-9a-zA-Z.]+(\*\*$|\*$)/.test(exp) || exp === "**" || exp === "*") {
                    var isGlobal = exp.indexOf("**") >= 0;
                    if (isGlobal) {
                        //a.**的形式
                        exp = exp.replace(".**", "");
                    } else {
                        //a.*的形式
                        exp = exp.replace(".*", "");
                    }
                    var getter = exp === "**" || exp === "*" ? function (m) {
                        return m;
                    } : parsePath(exp);
                    var v = getter.call(model, model);
                    var _dep = new Dep();
                    if (isGlobal) {
                        (v.__ob__._scopeDeps || (v.__ob__._scopeDeps = [])).push(_dep);
                    } else {
                        (v.__ob__._deps || (v.__ob__._deps = [])).push(_dep);
                    }
                    var _w = new Watcher(model, function () {
                        _dep.depend();
                        return NaN;
                    }, function (newValue, oldValue, attrs) {
                        callback(i, newValue, oldValue, _.extend({ index: i }, attrs));
                    }, options);
                    watchers.push(function unwatchFn() {
                        _w.teardown();
                        v.__ob__._scopeDeps && remove(v.__ob__._scopeDeps, _dep);
                        v.__ob__._deps && remove(v.__ob__._deps, _dep);
                    });
                    return;
                }
                // **.a.**的情况，场景：a.b.c, 如果用b.**监听, a被重新赋值b上的_scopeDes就不存在了
                if (/^(\*\*\.)+[1-9a-zA-Z]+(\.\*\*$)/.test(exp)) {
                    //先获取到能获取到的对象
                    var _paths = exp.split(".");
                    var _currentModel = model[_paths[1]];
                    exp = _paths[1] + ".**";
                    //补全路径
                    var _parent = _currentModel.__ob__.parent,
                        _root = _currentModel.__ob__;
                    while (_parent) {
                        exp = '*.' + exp;
                        _root = _parent;
                        _parent = _parent.parent;
                    }
                    var _regStr = routeToRegExp(exp);
                    var _dep2 = new Dep();
                    _root._globalDeps || (_root._globalDeps = {});
                    if (_.isArray(_root._globalDeps[_regStr])) {
                        _root._globalDeps[_regStr].push(_dep2);
                    } else {
                        _root._globalDeps[_regStr] = [_dep2];
                    }

                    var _w2 = new Watcher(_currentModel, function () {
                        _dep2.depend();
                        return NaN;
                    }, function (newValue, oldValue, attrs) {
                        callback(i, newValue, oldValue, _.extend({ index: i }, attrs));
                    }, options);
                    watchers.push(function unwatchFn() {
                        if (_root._globalDeps) {
                            remove(_root._globalDeps[_regStr], _dep2);

                            if (_root._globalDeps[_regStr].length === 0) {
                                delete _root._globalDeps[_regStr];
                                _w2.teardown();
                            }
                        }
                    });
                    return;
                }
                // 再有结尾有*的就不支持了
                if (exp[exp.length - 1] === "*") {
                    throw new Error('not support');
                }
                //其他含有*的情况，如*.a,*.*.a,a.*.a
                var currentModel = model;
                //先获取到能获取到的对象
                var paths = exp.split(".");
                for (var _i = 0, len = paths.length; _i < len; _i++) {
                    if (paths[_i] === "*") {
                        break;
                    }
                    currentModel = model[paths[_i]];
                }
                exp = exp.substr(exp.indexOf("*"));
                //补全路径
                var parent = currentModel.__ob__.parent,
                    root = currentModel.__ob__;
                while (parent) {
                    exp = '*.' + exp;
                    root = parent;
                    parent = parent.parent;
                }
                var regStr = routeToRegExp(exp);
                var dep = new Dep();
                root._globalDeps || (root._globalDeps = {});
                if (_.isArray(root._globalDeps[regStr])) {
                    root._globalDeps[regStr].push(dep);
                } else {
                    root._globalDeps[regStr] = [dep];
                }

                var w = new Watcher(currentModel, function () {
                    dep.depend();
                    return NaN;
                }, function (newValue, oldValue, attrs) {
                    callback(i, newValue, oldValue, _.extend({ index: i }, attrs));
                }, options);
                watchers.push(function unwatchFn() {
                    if (root._globalDeps) {
                        remove(root._globalDeps[regStr], dep);
                        if (root._globalDeps[regStr].length === 0) {
                            delete root._globalDeps[regStr];
                            w.teardown();
                        }
                    }
                });
                return;
            }
            var watcher = new Watcher(model, exp, function (newValue, oldValue, attrs) {
                callback(i, newValue, oldValue, _.extend({ index: i }, attrs));
            }, options);
            watchers.push(function unwatchFn() {
                watcher.teardown();
            });
        });
        return watchers;
    }

    var mixinInjection = {};

    function getMixins(type) {
        return mixinInjection[type];
    }

    function mixin(xtype, cls) {
        mixinInjection[xtype] = _.cloneDeep(cls);
    }

    var computedWatcherOptions = { lazy: true };
    var REACTIVE = true;

    function initState(vm, state) {
        if (state) {
            vm.$$state = REACTIVE ? observe(state).model : state;
        }
    }

    function initComputed(vm, computed) {
        var watchers = vm._computedWatchers = {};
        defineComputed(vm, computed);
        for (var key in computed) {
            watchers[key] = defineComputedWatcher(vm, computed[key]);
        }
    }

    function defineComputedWatcher(vm, userDef) {
        var context = vm.$$model ? vm.model : vm;
        var getter = typeof userDef === "function" ? userDef : userDef.get;

        return new Watcher(context, getter || noop, noop, computedWatcherOptions);
    }

    function defineOneComputedGetter(vm, key, userDef) {
        var shouldCache = true;
        var sharedPropertyDefinition = {
            enumerable: true,
            configurable: true,
            get: noop,
            set: noop
        };
        if (typeof userDef === "function") {
            sharedPropertyDefinition.get = createComputedGetter(vm, key);
            sharedPropertyDefinition.set = noop;
        } else {
            sharedPropertyDefinition.get = userDef.get ? shouldCache && userDef.cache !== false ? createComputedGetter(vm, key) : userDef.get : noop;
            sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
        }
        return sharedPropertyDefinition;
    }

    function defineComputed(vm, computed) {
        var props = {};
        for (var key in computed) {
            if (!(key in vm)) {
                props[key] = defineOneComputedGetter(vm, key, computed[key]);
            }
        }
        vm.$$computed = createViewModel$1({}, props);
    }

    function createComputedGetter(vm, key) {
        return function computedGetter() {
            var watcher = vm._computedWatchers && vm._computedWatchers[key];
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate();
                }
                if (REACTIVE && Dep.target) {
                    watcher.depend();
                }
                return watcher.value;
            }
        };
    }

    function initWatch(vm, watch$$1) {
        vm._watchers || (vm._watchers = []);
        for (var key in watch$$1) {
            var handler = watch$$1[key];
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
        if (typeof cb === 'string') {
            cb = vm[cb];
        }
        return watch(vm.model, keyOrFn, _.bind(cb, vm.$$model ? vm.model : vm), options);
    }

    function initMethods(vm, methods) {
        for (var key in methods) {
            vm[key] = methods[key] == null ? noop : _.bind(methods[key], vm.$$model ? vm.model : vm);
        }
    }

    function initMixins(vm, mixins) {
        mixins = (mixins || []).slice(0);

        _.each(mixins.reverse(), function (mixinType) {
            var mixin$$1 = getMixins(mixinType);

            for (var key in mixin$$1) {
                if (typeof mixin$$1[key] !== "function") continue;

                if (_.has(vm, key)) continue;

                vm[key] = _.bind(mixin$$1[key], vm.$$model ? vm.model : vm);
            }
        });
    }

    function defineProps(vm, keys) {
        var props = {};
        // if (typeof Proxy === 'function') {
        //     return vm.model = new Proxy(props, {
        //         has: function (target, key) {
        //             return keys.indexOf(key) > -1;
        //         },
        //         get: function (target, key) {
        //             if (key in $$skipArray) {
        //                 return props[key]
        //             }
        //             if (vm.$$computed && key in vm.$$computed) {
        //                 return vm.$$computed[key]
        //             }
        //             if (vm.$$state && key in vm.$$state) {
        //                 return vm.$$state[key]
        //             }
        //             return vm.$$model[key]
        //         },
        //         set: function (target, key, val) {
        //             if (key in $$skipArray) {
        //                 return props[key] = val
        //             }
        //             if (vm.$$state && key in vm.$$state) {
        //                 return vm.$$state[key] = val
        //             }
        //             if (vm.$$model && key in vm.$$model) {
        //                 return vm.$$model[key] = val
        //             }
        //         }
        //     })
        // }

        var _loop = function _loop(i, len) {
            var key = keys[i];
            if (!(key in $$skipArray)) {
                props[key] = {
                    enumerable: true,
                    configurable: true,
                    get: function get() {
                        if (vm.$$computed && key in vm.$$computed) {
                            return vm.$$computed[key];
                        }
                        if (vm.$$state && key in vm.$$state) {
                            return vm.$$state[key];
                        }
                        if (vm.$$model && key in vm.$$model) {
                            return vm.$$model[key];
                        }
                        var p = vm._parent;
                        while (p) {
                            if (p.$$context && key in p.$$context) {
                                return p.$$context[key];
                            }
                            p = p._parent;
                        }
                    },
                    set: function set(val) {
                        if (vm.$$state && key in vm.$$state) {
                            return vm.$$state[key] = val;
                        }
                        if (vm.$$model && key in vm.$$model) {
                            return vm.$$model[key] = val;
                        }
                        var p = vm._parent;
                        while (p) {
                            if (p.$$context && key in p.$$context) {
                                return p.$$context[key] = val;
                            }
                            p = p._parent;
                        }
                    }
                };
            }
        };

        for (var i = 0, len = keys.length; i < len; i++) {
            _loop(i, len);
        }
        vm.model = createViewModel$1({}, props);
    }

    function defineContext(vm, keys) {
        var props = {};

        var _loop2 = function _loop2(i, len) {
            var key = keys[i];
            if (!(key in $$skipArray)) {
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
            }
        };

        for (var i = 0, len = keys.length; i < len; i++) {
            _loop2(i, len);
        }
        vm.$$context = createViewModel$1({}, props);
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

    var Model = function () {
        function Model() {
            _classCallCheck(this, Model);
        }

        Model.prototype._constructor = function _constructor(model, destroyHandler) {
            if (model instanceof Observer || model instanceof Model) {
                model = model.model;
            }
            if (model && model.__ob__) {
                this.$$model = model;
            } else {
                this.options = model || {};
            }
            this._parent = Model.target;
            var state = _.isFunction(this.state) ? this.state() : this.state;
            var computed = this.computed;
            var context = this.context;
            var inject = this.inject;
            var childContext = this.childContext;
            var provide = this.provide;
            var watch$$1 = this.watch;
            var actions = this.actions;
            var keys = _.keys(this.$$model).concat(_.keys(state)).concat(_.keys(computed)).concat(inject || []).concat(context || []);
            var mixins = this.mixins;
            defineProps(this, keys);
            // deprecated
            childContext && defineContext(this, childContext);
            provide && defineContext(this, provide);
            this.$$model && (this.model.__ob__ = this.$$model.__ob__);
            initMixins(this, mixins);
            this.init();
            initState(this, _.extend(getInjectValues(this), state));
            initComputed(this, computed);
            REACTIVE && initWatch(this, watch$$1);
            initMethods(this, actions);
            this.created && this.created();
            this._destroyHandler = destroyHandler;
            if (this.$$model) {
                return this.model;
            }
        };

        Model.prototype._init = function _init() {};

        Model.prototype.init = function init() {
            this._init();
        };

        Model.prototype.destroy = function destroy() {
            for (var _key3 in this._computedWatchers) {
                this._computedWatchers[_key3].teardown();
            }
            _.each(this._watchers, function (unwatches) {
                unwatches = _.isArray(unwatches) ? unwatches : [unwatches];
                _.each(unwatches, function (unwatch) {
                    unwatch();
                });
            });
            this._watchers && (this._watchers = []);
            this.destroyed && this.destroyed();
            this.$$model = null;
            this.$$computed = null;
            this.$$state = null;
            this._destroyHandler && this._destroyHandler();
        };

        return Model;
    }();

    function define(model) {
        return REACTIVE ? new Observer(model).model : model;
    }

    var reactive = define;

    function config(options) {
        options || (options = {});
        if ("reactive" in options) {
            REACTIVE = options.reactive;
        }
    }

    function toJSON(model) {
        var result = void 0;
        if (_.isArray(model)) {
            result = [];
            for (var i = 0, len = model.length; i < len; i++) {
                result[i] = toJSON(model[i]);
            }
        } else if (model && isPlainObject(model)) {
            result = {};
            for (var _key4 in model) {
                if (!_.has($$skipArray, _key4)) {
                    result[_key4] = toJSON(model[_key4]);
                }
            }
        } else {
            result = model;
        }
        return result;
    }

    var version = '2.0';

    exports.version = version;
    exports.$$skipArray = $$skipArray;
    exports.mixin = mixin;
    exports.Model = Model;
    exports.define = define;
    exports.reactive = reactive;
    exports.config = config;
    exports.observerState = observerState;
    exports.Observer = Observer;
    exports.observe = observe;
    exports.notify = notify;
    exports.defineReactive = defineReactive;
    exports.set = set;
    exports.freeze = freeze;
    exports.del = del;
    exports.Watcher = Watcher;
    exports.pushTarget = pushTarget;
    exports.popTarget = popTarget;
    exports.watch = watch;
    exports.toJSON = toJSON;

    exports.__esModule = true;
});
