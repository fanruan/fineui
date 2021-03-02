/**
 * Widget超类
 * @class BI.Widget
 * @extends BI.OB
 *
 * @cfg {JSON} options 配置属性
 */

!(function () {
    function callLifeHook (self, life) {
        var hook = self.options[life] || self[life];
        if (hook) {
            var hooks = BI.isArray(hook) ? hook : [hook];
            BI.each(hooks, function (i, hook) {
                hook.call(self);
            });
        }
    }

    BI.Widget = BI.Widget || BI.inherit(BI.OB, {
        _defaultConfig: function () {
            return BI.extend(BI.Widget.superclass._defaultConfig.apply(this), {
                root: false,
                tagName: "div",
                attributes: null,
                data: null,

                tag: null,
                disabled: false,
                invisible: false,
                invalid: false,
                baseCls: "",
                extraCls: "",
                cls: "",
                css: null,
                updateMode: "manual" // manual / auto
            });
        },

        _constructor: function () {

        },

        // 覆盖父类的_constructor方法，widget不走ob的生命周期
        _constructed: function () {
            if (this.setup) {
                pushTarget(this);
                this.service = this.setup(this.options);
                this.render = BI.isPlainObject(this.service) ? this.service.render : this.service;
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

        beforeInit: null,

        // 生命周期函数
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
            if (this.options.beforeInit || this.beforeInit) {
                this.__asking = true;
                (this.options.beforeInit || this.beforeInit).call(this, BI.bind(this._render, this));
                if (this.__asking === true) {
                    this.__async = true;
                }
            } else {
                this._render();
            }
        },

        _render: function () {
            this.__asking = false;
            callLifeHook(this, "beforeCreate");
            this._initElement();
            this._initEffects();
            callLifeHook(this, "created");
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
                if (o.element instanceof BI.Widget) {
                    this._parent = o.element;
                    this._parent.addWidget(this.widgetName, this);
                } else {
                    this._isRoot = true;
                }
            } else if (o.element) {
                // if (o.root !== true) {
                //     throw new Error("root is a required property");
                // }
                this.element = BI.Widget._renderEngine.createElement(this);
                this._isRoot = true;
            } else {
                this.element = BI.Widget._renderEngine.createElement(this);
            }
            this.element._isWidget = true;
            if (o._baseCls || o.baseCls || o.extraCls || o.cls) {
                this.element.addClass((o._baseCls || "") + " " + (o.baseCls || "") + " " + (o.extraCls || "") + " " + (o.cls || ""));
            }
            if (o.attributes) {
                this.element.attr(o.attributes);
            }
            if (o.data) {
                this.element.data(o.data);
            }
            if (o.css) {
                this.element.css(o.css);
            }
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
            var o = this.options;
            if (o.invisible) {
                // 用display属性做显示和隐藏，否则jquery会在显示时将display设为block会覆盖掉display:flex属性
                this.element.css("display", "none");
            }
        },

        _initEffects: function () {
            var o = this.options;
            if (o.disabled || o.invalid) {
                if (this.options.disabled) {
                    this.setEnable(false);
                }
                if (this.options.invalid) {
                    this.setValid(false);
                }
            }
        },

        _initState: function () {
            this._isMounted = false;
        },

        _initElement: function () {
            var self = this;
            var render = BI.isFunction(this.options.render) ? this.options.render : this.render;
            var els = render && render.call(this);
            if (BI.isPlainObject(els)) {
                els = [els];
            }
            if (BI.isArray(els)) {
                BI.each(els, function (i, el) {
                    if (el) {
                        BI._lazyCreateWidget(el, {
                            element: self
                        });
                    }
                });
            }
            // if (this._isRoot === true || !(this instanceof BI.Layout)) {
            this._mount();
            // }
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
         * @returns {boolean}
         * @private
         */
        _mount: function (force, deep, lifeHook, predicate) {
            if (this.__beforeMount(force, deep, lifeHook, predicate)) {
                this.__afterMount(lifeHook, predicate);
                return true;
            }
            return false;
        },

        __beforeMount: function (force, deep, lifeHook, predicate) {
            var self = this;
            if (!force && (this._isMounted || !this.isVisible() || this.__asking === true || !(this._isRoot === true || (this._parent && this._parent._isMounted === true)))) {
                return false;
            }
            lifeHook !== false && callLifeHook(this, "beforeMount");
            this._isMounted = true;
            BI.each(this._children, function (i, widget) {
                !self.isEnabled() && widget._setEnable(false);
                !self.isValid() && widget._setValid(false);
                widget.__beforeMount && widget.__beforeMount(deep ? force : false, deep, lifeHook, predicate);
            });
            this._mountChildren && this._mountChildren();
            return true;
        },

        __afterMount: function (lifeHook, predicate) {
            if (this._isMounted) {
                BI.each(this._children, function (i, widget) {
                    widget.__afterMount && widget.__afterMount(lifeHook, predicate);
                });
                lifeHook !== false && callLifeHook(this, "mounted");
                this.fireEvent(BI.Events.MOUNT);
                predicate && predicate(this);
            }
        },

        _mountChildren: null,

        _update: function (nextProps, shouldUpdate) {
            var o = this.options;
            callLifeHook(this, "beforeUpdate");
            if (shouldUpdate) {
                var res = this.update && this.update(nextProps, shouldUpdate);
            } else if (BI.isNull(shouldUpdate)) {
                // 默认使用shallowCompare的方式进行更新
                var nextChange = {};
                BI.each(nextProps, function (key, value) {
                    if (o[key] !== value) {
                        nextChange[key] = value;
                    }
                });
                var res = this.update && BI.isNotEmptyObject(nextChange) && this.update(nextChange);
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

        setVisible: function (visible) {
            this._setVisible(visible);
            if (visible === true) {
                // 用this.element.show()会把display属性改成block
                this.element.css("display", "");
                this._mount();
            } else if (visible === false) {
                this.element.css("display", "none");
            }
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
                throw new Error("name has already been existed");
            }
            widget._setParent && widget._setParent(this);
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
            var self = this;
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
            callLifeHook(this, "beforeDestroy");
            this.beforeDestroy = null;
            BI.each(this._children, function (i, widget) {
                widget && widget._unMount && widget._unMount();
            });
            this._children = {};
            this._parent = null;
            this._isMounted = false;
            callLifeHook(this, "destroyed");
            this.destroyed = null;
        },

        _unMount: function () {
            this.__d();
            this.fireEvent(BI.Events.UNMOUNT);
            this.purgeListeners();
        },

        isolate: function () {
            if (this._parent) {
                this._parent.removeWidget(this);
            }
            BI.DOM.hang([this]);
        },

        empty: function () {
            BI.each(this._children, function (i, widget) {
                widget && widget._unMount && widget._unMount();
            });
            this._children = {};
            this.element.empty();
        },

        _destroy: function () {
            this.__d();
            this.element.destroy();
            this.purgeListeners();
        },

        destroy: function () {
            this.__d();
            this.element.destroy();
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
                    origin = _store.apply(this, arguments);
                    return origin;
                };
                return current.$storeDelegate = proxy;
            }
            current._store = function () {
                var st = _store.apply(this, arguments);
                BI.extend(delegate, st);
                return st;
            };
            return current.$storeDelegate = delegate;
        }
    };

    BI.watch = function (watch, handler) {
        if (BI.Widget.current) {
            BI.Widget.current.$watchDelayCallbacks || (BI.Widget.current.$watchDelayCallbacks = []);
            BI.Widget.current.$watchDelayCallbacks.push([watch, handler]);
        }
    };

    BI.onBeforeMount = function (beforeMount) {
        if (current) {
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
