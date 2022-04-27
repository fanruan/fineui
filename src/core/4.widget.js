/**
 * Widget超类
 * @class BI.Widget
 * @extends BI.OB
 *
 * @cfg {JSON} options 配置属性
 */

!(function () {
    var cancelAnimationFrame =
        _global.cancelAnimationFrame ||
        _global.webkitCancelAnimationFrame ||
        _global.mozCancelAnimationFrame ||
        _global.oCancelAnimationFrame ||
        _global.msCancelAnimationFrame ||
        _global.clearTimeout;

    var requestAnimationFrame = _global.requestAnimationFrame || _global.webkitRequestAnimationFrame || _global.mozRequestAnimationFrame || _global.oRequestAnimationFrame || _global.msRequestAnimationFrame || _global.setTimeout;

    function callLifeHook (self, life) {
        var hooks = [], hook;
        hook = self[life];
        if (hook) {
            hooks = hooks.concat(BI.isArray(hook) ? hook : [hook]);
        }
        hook = self.options[life];
        if (hook) {
            hooks = hooks.concat(BI.isArray(hook) ? hook : [hook]);
        }
        BI.each(hooks, function (i, hook) {
            hook.call(self);
        });
    }

    BI.Widget = BI.Widget || BI.inherit(BI.OB, {
        _defaultConfig: function () {
            return BI.extend(BI.Widget.superclass._defaultConfig.apply(this), {
                root: false,
                tagName: "div",
                attributes: null,
                data: null,
                key: null,

                tag: null,
                disabled: false,
                invisible: false,
                animation: "",
                animationDuring: 0,
                invalid: false,
                baseCls: "",
                extraCls: "",
                cls: "",
                css: null

                // vdom: false
            });
        },

        _constructor: function () {

        },

        // 覆盖父类的_constructor方法，widget不走ob的生命周期
        _constructed: function () {
            if (this.setup) {
                pushTarget(this);
                var delegate = this.setup(this.options);
                if (BI.isPlainObject(delegate)) {
                    // 如果setup返回一个json，即对外暴露的方法
                    BI.extend(this, delegate);
                } else {
                    this.render = delegate;
                }
                popTarget();
            }
        },

        _lazyConstructor: function () {
            if (!this.__constructed) {
                this.__constructed = true;
                this._init();
                this._initRef();
            }
        },

        // 生命周期函数
        beforeInit: null,

        beforeRender: null,

        beforeCreate: null,

        created: null,

        render: null,

        beforeMount: null,

        mounted: null,

        shouldUpdate: null,

        update: null,

        beforeUpdate: null,

        updated: null,

        beforeDestroy: null,

        destroyed: null,

        _init: function () {
            BI.Widget.superclass._init.apply(this, arguments);
            this._initElementWidth();
            this._initElementHeight();
            this._initVisual();
            this._initState();
            this._initRender();
        },

        _initRender: function () {
            var self = this;
            var initCallbackCalled = false;
            var renderCallbackCalled = false;

            function init () {
                // 加个保险
                if (initCallbackCalled === true) {
                    _global.console && console.error("组件： 请检查beforeInit内部的写法，callback只能执行一次");
                    return;
                }
                initCallbackCalled = true;

                function render () {
                    // 加个保险
                    if (renderCallbackCalled === true) {
                        _global.console && console.error("组件： 请检查beforeRender内部的写法，callback只能执行一次");
                        return;
                    }
                    renderCallbackCalled = true;
                    self._render();
                    self.__afterRender();
                }

                if (self.options.beforeRender || self.beforeRender) {
                    self.__async = true;
                    var beforeRenderResult = (self.options.beforeRender || self.beforeRender).call(self, render);
                    if (beforeRenderResult instanceof Promise) {
                        beforeRenderResult.then(render).catch(function (e) {
                            _global.console && console.error(e);
                            render();
                        });
                    }
                } else {
                    self._render();
                    self.__afterRender();
                }
            }

            if (this.options.beforeInit || this.beforeInit) {
                this.__asking = true;
                var beforeInitResult = (this.options.beforeInit || this.beforeInit).call(this, init);
                if (beforeInitResult instanceof Promise) {
                    beforeInitResult.then(init).catch(function (e) {
                        _global.console && console.error(e);
                        init();
                    });
                }
            } else {
                init();
            }
        },

        __afterRender: function () {
            pushTarget(this);
            var async = this.__async;
            this.__async = false;
            if (async && this._isMounted) {
                callLifeHook(this, "beforeMount");
                this._mount();
                callLifeHook(this, "mounted");
                this.fireEvent(BI.Events.MOUNT);
            } else {
                this._mount();
            }
            popTarget();
        },

        _render: function () {
            this.__asking = false;
            pushTarget(this);
            callLifeHook(this, "beforeCreate");
            this._initElement();
            this._initEffects();
            callLifeHook(this, "created");
            popTarget();
        },

        _initCurrent: function () {
            var self = this, o = this.options;
            if (o._baseCls || o.baseCls || o.extraCls) {
                this.element.addClass((o._baseCls || "") + " " + (o.baseCls || "") + " " + (o.extraCls || ""));
            }
            if (o.cls) {
                if (BI.isFunction(o.cls)) {
                    var cls = this.__watch(o.cls, function (context, newValue) {
                        self.element.removeClass(cls).addClass(cls = newValue);
                    });
                    this.element.addClass(cls);
                } else {
                    this.element.addClass(o.cls);
                }
            }
            // if (o.key != null) {
            //     this.element.attr("key", o.key);
            // }
            if (o.attributes) {
                this.element.attr(o.attributes);
            }
            if (o.data) {
                this.element.data(o.data);
            }
            if (o.css) {
                if (BI.isFunction(o.css)) {
                    var css = this.__watch(o.css, function (context, newValue) {
                        for (var k in css) {
                            if (!newValue[k]) {
                                newValue[k] = "";
                            }
                        }
                        self.element.css(css = newValue);
                    });
                    this.element.css(css);
                } else {
                    this.element.css(o.css);
                }
            }
        },

        __watch: function (getter, handler, options) {
            var self = this;
            if (_global.Fix) {
                this._watchers = this._watchers || [];
                var watcher = new Fix.Watcher(null, function () {
                    return getter.call(self, self);
                }, (handler && function (v) {
                    handler.call(self, self, v);
                }) || BI.emptyFn, BI.extend({deep: true}, options));
                this._watchers.push(function unwatchFn () {
                    watcher.teardown();
                });
                return watcher.value;
            } else {
                return getter();
            }
        },

        /**
         * 初始化根节点
         * @private
         */
        _initRoot: function () {
            var o = this.options;
            this.widgetName = o.widgetName || BI.uniqueId("widget");
            this._isRoot = o.root;
            this._children = {};
            if (BI.isWidget(o.element)) {
                this.element = this.options.element.element;
                this._parent = o.element;
                this._parent.addWidget(this.widgetName, this);
            } else if (o.element) {
                this.element = BI.Widget._renderEngine.createElement(this);
                this._isRoot = true;
            } else {
                this.element = BI.Widget._renderEngine.createElement(this);
            }
            this.element._isWidget = true;
            // var widgets = this.element.data("__widgets") || [];
            // widgets.push(this);
            // this.element.data("__widgets", widgets);
            this._initCurrent();
        },

        _initElementWidth: function () {
            var o = this.options;
            if (BI.isWidthOrHeight(o.width)) {
                this.element.css("width", BI.isNumber(o.width) ? o.width / BI.pixRatio + BI.pixUnit : o.width);
            }
        },

        _initElementHeight: function () {
            var o = this.options;
            if (BI.isWidthOrHeight(o.height)) {
                this.element.css("height", BI.isNumber(o.height) ? o.height / BI.pixRatio + BI.pixUnit : o.height);
            }
        },

        _initVisual: function () {
            var self = this, o = this.options;
            if (o.invisible) {
                var invisible = o.invisible = BI.isFunction(o.invisible) ? this.__watch(o.invisible, function (context, newValue) {
                    self.setVisible(!newValue);
                }) : o.invisible;
                if (invisible) {
                    // 用display属性做显示和隐藏，否则jquery会在显示时将display设为block会覆盖掉display:flex属性
                    this.element.css("display", "none");
                }
            }
        },

        _initEffects: function () {
            var self = this, o = this.options;
            if (o.disabled || o.invalid) {
                if (this.options.disabled) {
                    var disabled = o.disabled = BI.isFunction(o.disabled) ? this.__watch(o.disabled, function (context, newValue) {
                        self.setEnable(!newValue);
                    }) : o.disabled;
                    if (disabled) {
                        this.setEnable(false);
                    }
                }
                if (this.options.invalid) {
                    var invalid = o.invalid = BI.isFunction(o.invalid) ? this.__watch(o.invalid, function (context, newValue) {
                        self.setValid(!newValue);
                    }) : o.invalid;
                    if (invalid) {
                        this.setValid(false);
                    }
                }
            }
            if (o.effect) {
                if (BI.isArray(o.effect)) {
                    if (BI.isArray(o.effect[0])) {
                        BI.each(o.effect, function (i, effect) {
                            self.__watch(effect[0], effect[1]);
                        });
                    } else {
                        self.__watch(o.effect[0], o.effect[1]);
                    }
                } else {
                    this.__watch(o.effect);
                }
            }
        },

        _initState: function () {
            this._isMounted = false;
        },

        __initWatch: function () {
            // initWatch拦截的方法
        },

        _initElement: function () {
            var self = this;
            this.__isMounting = true;
            // 当开启worker模式时，可以通过$render来实现另一种效果
            var workerMode = BI.Providers.getProvider("bi.provider.system").getWorkerMode();
            var render = BI.isFunction(this.options.render) ? this.options.render : (workerMode ? (this.$render || this.render) : this.render);
            var els = render && render.call(this);
            els = BI.Plugin.getRender(this.options.type, els);
            if (BI.isPlainObject(els)) {
                els = [els];
            }
            this.__initWatch();
            if (BI.isArray(els)) {
                BI.each(els, function (i, el) {
                    if (el) {
                        BI._lazyCreateWidget(el, {
                            element: self
                        });
                    }
                });
            }
        },

        _setParent: function (parent) {
            this._parent = parent;
        },

        /**
         *
         * @param force 是否强制挂载子节点
         * @param deep 子节点是否也是按照当前force处理
         * @param lifeHook 生命周期钩子触不触发，默认触发
         * @param predicate 递归每个widget的回调
         * @param layer 组件层级
         * @returns {boolean}
         * @private
         */
        _mount: function (force, deep, lifeHook, predicate, layer) {
            var self = this;
            if (!force && (this._isMounted || !this.isVisible() || this.__asking === true || !(this._isRoot === true || (this._parent && this._parent._isMounted === true)))) {
                return false;
            }
            layer = layer || 0;
            lifeHook !== false && !this.__async && callLifeHook(this, "beforeMount");
            this._isMounted = true;
            this.__isMounting = false;
            if (this._parent) {
                if (!this._parent.isEnabled()) {
                    this._setEnable(false);
                }
                if (!this._parent.isValid()) {
                    this._setValid(false);
                }
            }
            for (var key in this._children) {
                var child = this._children[key];
                child._mount && child._mount(deep ? force : false, deep, lifeHook, predicate, layer + 1);
            }
            this._mountChildren && this._mountChildren();
            if (layer === 0) {
                // mounted里面会执行scrollTo之类的方法，如果放宏任务里会闪
                // setTimeout(function () {
                self.__afterMount(lifeHook, predicate);
                // }, 0);
            }
            return true;
        },

        __afterMount: function (lifeHook, predicate) {
            if (this._isMounted) {
                for (var key in this._children) {
                    var child = this._children[key];
                    child.__afterMount && child.__afterMount(lifeHook, predicate);
                }
                if (lifeHook !== false && !this.__async) {
                    callLifeHook(this, "mounted");
                    this.fireEvent(BI.Events.MOUNT);
                }
                predicate && predicate(this);
            }
        },

        _mountChildren: null,

        _update: function (nextProps, shouldUpdate) {
            callLifeHook(this, "beforeUpdate");
            if (shouldUpdate) {
                var res = this.update && this.update(nextProps, shouldUpdate);
            }
            callLifeHook(this, "updated");
            return res;
        },

        isMounted: function () {
            return this._isMounted;
        },

        setWidth: function (w) {
            this.options.width = w;
            this._initElementWidth();
        },

        setHeight: function (h) {
            this.options.height = h;
            this._initElementHeight();
        },

        _setEnable: function (enable) {
            if (enable === true) {
                this.options.disabled = false;
            } else if (enable === false) {
                this.options.disabled = true;
            }
            // 递归将所有子组件使能
            BI.each(this._children, function (i, child) {
                !child._manualSetEnable && child._setEnable && child._setEnable(enable);
            });
        },

        _setValid: function (valid) {
            if (valid === true) {
                this.options.invalid = false;
            } else if (valid === false) {
                this.options.invalid = true;
            }
            // 递归将所有子组件使有效
            BI.each(this._children, function (i, child) {
                !child._manualSetValid && child._setValid && child._setValid(valid);
            });
        },

        _setVisible: function (visible) {
            if (visible === true) {
                this.options.invisible = false;
            } else if (visible === false) {
                this.options.invisible = true;
            }
        },

        setEnable: function (enable) {
            this._manualSetEnable = true;
            this._setEnable(enable);
            if (enable === true) {
                this.element.removeClass("base-disabled disabled");
            } else if (enable === false) {
                this.element.addClass("base-disabled disabled");
            }
        },

        _innerSetVisible: function (visible) {
            var self = this, o = this.options;
            var lastVisible = !o.invisible;
            this._setVisible(visible);
            if (visible === true) {
                // 用this.element.show()会把display属性改成block
                this.element.css("display", "");
                this._mount();
                if (o.animation && !lastVisible) {
                    this.element.removeClass(o.animation + "-leave").removeClass(o.animation + "-leave-active").addClass(o.animation + "-enter");
                    if (this._requestAnimationFrame) {
                        cancelAnimationFrame(this._requestAnimationFrame);
                    }
                    this._requestAnimationFrame = function () {
                        self.element.addClass(o.animation + "-enter-active");
                    };
                    requestAnimationFrame(this._requestAnimationFrame);
                    if (this._animationDuring) {
                        clearTimeout(this._animationDuring);
                    }
                    this._animationDuring = setTimeout(function () {
                        self.element.removeClass(o.animation + "-enter").removeClass(o.animation + "-enter-active");
                    }, o.animationDuring);
                }
            } else if (visible === false) {
                if (o.animation && lastVisible) {
                    this.element.removeClass(o.animation + "-enter").removeClass(o.animation + "-enter-active").addClass(o.animation + "-leave");
                    if (this._requestAnimationFrame) {
                        cancelAnimationFrame(this._requestAnimationFrame);
                    }
                    this._requestAnimationFrame = function () {
                        self.element.addClass(o.animation + "-leave-active");
                    };
                    requestAnimationFrame(this._requestAnimationFrame);
                    if (this._animationDuring) {
                        clearTimeout(this._animationDuring);
                    }
                    this._animationDuring = setTimeout(function () {
                        self.element.removeClass(o.animation + "-leave").removeClass(o.animation + "-leave-active");
                        self.element.css("display", "none");
                    }, o.animationDuring);
                } else {
                    this.element.css("display", "none");
                }
            }
        },

        setVisible: function (visible) {
            this._innerSetVisible(visible);
            this.fireEvent(BI.Events.VIEW, visible);
        },

        setValid: function (valid) {
            this._manualSetValid = true;
            this._setValid(valid);
            if (valid === true) {
                this.element.removeClass("base-invalid invalid");
            } else if (valid === false) {
                this.element.addClass("base-invalid invalid");
            }
        },

        doBehavior: function () {
            var args = arguments;
            // 递归将所有子组件使有效
            BI.each(this._children, function (i, child) {
                child.doBehavior && child.doBehavior.apply(child, args);
            });
        },

        getWidth: function () {
            return this.options.width;
        },

        getHeight: function () {
            return this.options.height;
        },

        isValid: function () {
            return !this.options.invalid;
        },

        addWidget: function (name, widget) {
            var self = this;
            if (name instanceof BI.Widget) {
                widget = name;
                name = widget.getName();
            }
            if (BI.isKey(name)) {
                name = name + "";
            }
            name = name || widget.getName() || BI.uniqueId("widget");
            if (this._children[name]) {
                throw new Error("组件：组件名已存在，不能进行添加");
            }
            widget._setParent && widget._setParent(this);
            // if (this.options.disabled) {
            //     widget.options && (widget.options.disabled = true);
            // }
            // if (this.options.invalid) {
            //     widget.options && (widget.options.invalid = true);
            // }
            widget.on(BI.Events.DESTROY, function () {
                BI.remove(self._children, this);
            });
            return (this._children[name] = widget);
        },

        getWidgetByName: function (name) {
            if (!BI.isKey(name) || name === this.getName()) {
                return this;
            }
            name = name + "";
            var widget = void 0, other = {};
            BI.any(this._children, function (i, wi) {
                if (i === name) {
                    widget = wi;
                    return true;
                }
                other[i] = wi;
            });
            if (!widget) {
                BI.any(other, function (i, wi) {
                    return (widget = wi.getWidgetByName(i));
                });
            }
            return widget;
        },

        removeWidget: function (nameOrWidget) {
            if (BI.isWidget(nameOrWidget)) {
                BI.remove(this._children, nameOrWidget);
            } else {
                delete this._children[nameOrWidget];
            }
        },

        hasWidget: function (name) {
            return this._children[name] != null;
        },

        getName: function () {
            return this.widgetName;
        },

        setTag: function (tag) {
            this.options.tag = tag;
        },

        getTag: function () {
            return this.options.tag;
        },

        attr: function (key, value) {
            var self = this;
            if (BI.isPlainObject(key)) {
                BI.each(key, function (k, v) {
                    self.attr(k, v);
                });
                return;
            }
            if (BI.isNotNull(value)) {
                return this.options[key] = value;
            }
            return this.options[key];
        },

        css: function (name, value) {
            return this.element.css(name, value);
        },

        getText: function () {

        },

        setText: function (text) {

        },

        getValue: function () {

        },

        setValue: function (value) {

        },

        isEnabled: function () {
            return !this.options.disabled;
        },

        isVisible: function () {
            return !this.options.invisible;
        },

        disable: function () {
            this.setEnable(false);
        },

        enable: function () {
            this.setEnable(true);
        },

        valid: function () {
            this.setValid(true);
        },

        invalid: function () {
            this.setValid(false);
        },

        invisible: function () {
            this.setVisible(false);
        },

        visible: function () {
            this.setVisible(true);
        },

        __d: function () {
            BI.each(this._children, function (i, widget) {
                widget && widget._unMount && widget._unMount();
            });
            this._children = {};
        },

        // 主要是因为_destroy已经提供了protected方法
        __destroy: function () {
            callLifeHook(this, "beforeDestroy");
            this.beforeDestroy = null;
            this.__d();
            this._parent = null;
            this._isMounted = false;
            callLifeHook(this, "destroyed");
            this.destroyed = null;
        },

        _unMount: function () {
            this.__destroy();
            this.fireEvent(BI.Events.UNMOUNT);
            this.purgeListeners();
        },

        _empty: function () {
            BI.each(this._children, function (i, widget) {
                widget && widget._unMount && widget._unMount();
            });
            this._children = {};
            this.element.empty();
        },

        isolate: function () {
            if (this._parent) {
                this._parent.removeWidget(this);
            }
            BI.DOM.hang([this]);
        },

        empty: function () {
            this._empty();
        },

        // 默认的reset方法就是干掉重来
        reset: function () {
            // 还在异步状态的不需要执行reset
            if (this.__async === true || this.__asking === true) {
                return;
            }
            // if (this.options.vdom) {
            //     var vnode = this._renderVNode();
            //     BI.patchVNode(this.vnode, vnode);
            //     this.vnode = vnode;
            //     return;
            // }
            // this._isMounted = false;
            // this.purgeListeners();

            // 去掉组件绑定的watcher
            BI.each(this._watchers, function (i, unwatches) {
                unwatches = BI.isArray(unwatches) ? unwatches : [unwatches];
                BI.each(unwatches, function (j, unwatch) {
                    unwatch();
                });
            });
            this._watchers && (this._watchers = []);
            this.__d();
            this.element.empty();
            this.element.unbind();
            this._initCurrent();
            this._init();
            // this._initRef();
        },

        _destroy: function () {
            this.__destroy();
            this.element.destroy();
            this.purgeListeners();
        },

        destroy: function () {
            var self = this, o = this.options;
            this.__destroy();
            if (o.animation) {
                this._innerSetVisible(false);
                setTimeout(function () {
                    self.element.destroy();
                }, o.animationDuring);
            } else {
                this.element.destroy();
            }
            this.fireEvent(BI.Events.UNMOUNT);
            this.fireEvent(BI.Events.DESTROY);
            this._purgeRef();
            this.purgeListeners();
        }
    });
    var context = null, current = null;
    var contextStack = [], currentStack = [];

    BI.Widget.pushContext = function (_context) {
        if (context) contextStack.push(context);
        BI.Widget.context = context = _context;
    };

    BI.Widget.popContext = function () {
        BI.Widget.context = context = contextStack.pop();
    };

    function pushTarget (_current) {
        if (current) currentStack.push(current);
        BI.Widget.current = current = _current;
    }

    function popTarget () {
        BI.Widget.current = current = currentStack.pop();
    }

    BI.useStore = function (_store) {
        if (current && current.store) {
            return current.store;
        }
        if (current && current.$storeDelegate) {
            return current.$storeDelegate;
        }
        if (current) {
            var currentStore = current._store;
            var delegate = {}, origin;
            if (_global.Proxy) {
                var proxy = new Proxy(delegate, {
                    get: function (target, key) {
                        return Reflect.get(origin, key);
                    },
                    set: function (target, key, value) {
                        return Reflect.set(origin, key, value);
                    }
                });
                current._store = function () {
                    origin = (_store || currentStore).apply(this, arguments);
                    delegate.$delegate = origin;
                    return origin;
                };
                return current.$storeDelegate = proxy;
            }
            current._store = function () {
                var st = (_store || currentStore).apply(this, arguments);
                BI.extend(delegate, st);
                return st;
            };
            return current.$storeDelegate = delegate;
        }
    };

    BI.useContext = function (inject) {
        if (BI.Model.target) {
            var p = BI.Model.target;
            if (inject) {
                while (p) {
                    if (p.$$context && inject in p.$$context) {
                        return p;
                    }
                    p = p._parent;
                }
            }
        }
        return BI.Model.target;
    };

    BI.watch = function (vm, watch, handler) {
        // 必须要保证组件当前环境存在
        if (BI.Widget.current) {
            if (vm instanceof BI.Model) {
                var watchers = [];
                if (BI.isKey(watch)) {
                    var k = watch;
                    watch = {};
                    watch[k] = handler;
                }
                for (var key in watch) {
                    var innerHandler = watch[key];
                    if (BI.isArray(handler)) {
                        for (var i = 0; i < handler.length; i++) {
                            watchers.push(Fix.watch(vm.model, key, innerHandler, {
                                store: vm
                            }));
                        }
                    } else {
                        watchers.push(Fix.watch(vm.model, key, innerHandler, {
                            store: vm
                        }));
                    }
                }
                // vm中一定有_widget
                BI.Widget.current._watchers || (BI.Widget.current._watchers = []);
                BI.Widget.current._watchers = BI.Widget.current._watchers.concat(watchers);
                return;
            }
            handler = watch;
            watch = vm;
            BI.Widget.current.$watchDelayCallbacks || (BI.Widget.current.$watchDelayCallbacks = []);
            BI.Widget.current.$watchDelayCallbacks.push([watch, handler]);
        }
    };

    BI.onBeforeMount = function (beforeMount) {
        if (current) {
            if (current.__isMounting) {
                beforeMount();
                return;
            }
            if (!current.beforeMount) {
                current.beforeMount = [];
            } else if (!BI.isArray(current.beforeMount)) {
                current.beforeMount = [current.beforeMount];
            }
            current.beforeMount.push(beforeMount);
        }
    };
    BI.onMounted = function (mounted) {
        if (current) {
            if (current._isMounted && !this.__async) {
                mounted();
                return;
            }
            if (!current.mounted) {
                current.mounted = [];
            } else if (!BI.isArray(current.mounted)) {
                current.mounted = [current.mounted];
            }
            current.mounted.push(mounted);
        }
    };
    BI.onBeforeUnmount = function (beforeDestroy) {
        if (current) {
            if (!current.beforeDestroy) {
                current.beforeDestroy = [];
            } else if (!BI.isArray(current.beforeDestroy)) {
                current.beforeDestroy = [current.beforeDestroy];
            }
            current.beforeDestroy.push(beforeDestroy);
        }
    };
    BI.onUnmounted = function (destroyed) {
        if (current) {
            if (!current.destroyed) {
                current.destroyed = [];
            } else if (!BI.isArray(current.destroyed)) {
                current.destroyed = [current.destroyed];
            }
            current.destroyed.push(destroyed);
        }
    };

    BI.Widget.registerRenderEngine = function (engine) {
        BI.Widget._renderEngine = engine;
    };
    BI.Widget.registerRenderEngine({
        createElement: function (widget) {
            if (BI.isWidget(widget)) {
                var o = widget.options;
                if (o.element) {
                    return BI.$(o.element);
                }
                if (o.tagName) {
                    return BI.$(document.createElement(o.tagName));
                }
                return BI.$(document.createDocumentFragment());
            }
            return BI.$(widget);
        },
        createFragment: function () {
            return document.createDocumentFragment();
        }
    });

    BI.mount = function (widget, container, predicate, hydrate) {
        if (hydrate === true) {
            // 将widget的element元素都挂载好，并建立相互关系
            widget.element.data("__widgets", [widget]);
            var res = widget._mount(true, false, false, function (w) {
                BI.each(w._children, function (i, child) {
                    var ws = child.element.data("__widgets");
                    if (!ws) {
                        ws = [];
                    }
                    ws.push(child);
                    child.element.data("__widgets", ws);
                });
                predicate && predicate.apply(this, arguments);
            });
            // 将新的dom树属性（事件等）patch到已存在的dom上
            var c = BI.Widget._renderEngine.createElement;
            BI.DOM.patchProps(widget.element, c(c(container).children()[0]));

            var triggerLifeHook = function (w) {
                w.beforeMount && w.beforeMount();
                w.mounted && w.mounted();
                BI.each(w._children, function (i, child) {
                    triggerLifeHook(child);
                });
            };
            // 最后触发组件树生命周期函数
            triggerLifeHook(widget);
            return res;
        }
        if (container) {
            BI.Widget._renderEngine.createElement(container).append(widget.element);
        }
        return widget._mount(true, false, false, predicate);
    };
})();
