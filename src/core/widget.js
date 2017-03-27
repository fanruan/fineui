/**
 * Widget超类
 * @class BI.Widget
 * @extends BI.OB
 *
 * @cfg {JSON} options 配置属性
 */
BI.Widget = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.Widget.superclass._defaultConfig.apply(this), {
            tagName: "div",
            attributes: null,
            data: null,

            tag: null,
            disabled: false,
            invisible: false,
            invalid: false,
            baseCls: "",
            extraCls: "",
            cls: ""
        })
    },

    //生命周期函数
    beforeCreate: function () {

    },

    created: function () {

    },

    render: function () {

    },

    beforeMounted: function () {

    },

    mounted: function () {

    },

    update: null,

    destroyed: function () {
    },

    _init: function () {
        BI.Widget.superclass._init.apply(this, arguments);
        this.beforeCreate();
        this._initRoot();
        this._initElementWidth();
        this._initElementHeight();
        this._initVisualEffects();
        this._initState();
        this._initElement();
        this.created();
    },

    /**
     * 初始化根节点
     * @private
     */
    _initRoot: function () {
        var o = this.options;
        this.widgetName = o.widgetName || BI.uniqueId("widget");
        if (BI.isWidget(o.element)) {
            if (o.element instanceof BI.Widget) {
                this._parent = o.element;
                this._parent.addWidget(this.widgetName, this);
            } else {
                this._isRoot = true;
            }
            this.element = this.options.element.element;
        } else if (o.element) {
            this.element = $(o.element);
            this._isRoot = true;
        } else {
            this.element = $(document.createElement(o.tagName));
        }
        if (o.baseCls || o.extraCls || o.cls) {
            this.element.addClass((o.baseCls || "") + " " + (o.extraCls || "") + " " + (o.cls || ""));
        }
        if (o.attributes) {
            this.element.attr(o.attributes);
        }
        if (o.data) {
            this.element.data(o.data);
        }
        this._children = {};
    },

    _initElementWidth: function () {
        var o = this.options;
        if (BI.isWidthOrHeight(o.width)) {
            this.element.css("width", o.width);
        }
    },

    _initElementHeight: function () {
        var o = this.options;
        if (BI.isWidthOrHeight(o.height)) {
            this.element.css("height", o.height);
        }
    },

    _initVisualEffects: function () {
        var o = this.options;
        if (o.invisible) {
            this.element.hide();
        }
        if (o.disabled || o.invalid) {
            BI.nextTick(BI.bind(function () {
                if (this.options.disabled) {
                    this.setEnable(false);
                }
                if (this.options.invalid) {
                    this.setValid(false);
                }
            }, this));
        }
    },

    _initState: function () {
        this._isMounted = false;
    },

    _initElement: function () {
        var self = this;
        var els = this.render();
        if (BI.isPlainObject(els)) {
            els = [els];
        }
        if (BI.isArray(els)) {
            BI.each(els, function (i, el) {
                BI.createWidget(el, {
                    element: self
                })
            })
        }
        // if (this._isRoot === true || !(this instanceof BI.Layout)) {
        this._mount();
        // }
    },

    _setParent: function (parent) {
        this._parent = parent;
    },

    _mount: function () {
        var self = this;
        var isMounted = this._isMounted;
        if (isMounted || !this.isVisible()) {
            return;
        }
        if (this._isRoot === true) {
            isMounted = true;
        } else if (this._parent && this._parent._isMounted === true) {
            isMounted = true;
        }
        if (!isMounted) {
            return;
        }
        this.beforeMounted();
        this._isMounted = true;
        this._mountChildren();
        BI.each(this._children, function (i, widget) {
            widget._mount && widget._mount();
        });
        this.mounted();
    },

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.element.append(frag);
        }
    },

    _unMount: function () {
        BI.each(this._children, function (i, widget) {
            widget._unMount && widget._unMount();
        });
        this._children = {};
        this._parent = null;
        this._isMounted = false;
        this.purgeListeners();
        this.destroyed();
    },

    setWidth: function (w) {
        this.options.width = w;
        this._initElementWidth();
    },

    setHeight: function (h) {
        this.options.height = h;
        this._initElementHeight();
    },

    setEnable: function (enable) {
        if (enable === true) {
            this.options.disabled = false;
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.options.disabled = true;
            this.element.addClass("base-disabled disabled");
        }
    },

    setVisible: function (visible) {
        if (visible === true) {
            this.options.invisible = false;
            this.element.show();
            this._mount();
        } else if (visible === false) {
            this.options.invisible = true;
            this.element.hide();
        }
        this.fireEvent(BI.Events.VIEW, visible);
    },

    setValid: function (valid) {
        this.options.invalid = !valid;
        if (valid === true) {
            this.element.removeClass("base-invalid invalid");
        } else if (valid === false) {
            this.element.addClass("base-invalid invalid");
        }
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
        name = name || widget.getName() || BI.uniqueId("widget");
        if (this._children[name]) {
            throw new Error("name has already been existed");
        }
        widget._setParent && widget._setParent(this);
        widget.on(BI.Events.DESTROY, function () {
            delete self._children[name]
        });
        return (this._children[name] = widget);
    },

    getWidgetByName: function (name) {
        if (!BI.isKey(name) || name == this.getName()) {
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
            BI.each(this._children, function (name, widget) {
                if (widget === nameOrWidget) {
                    delete self._children[name];
                }
            })
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
        if (BI.isNotNull(value)) {
            return this.options[key] = value;
        }
        return this.options[key];
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

    isolate: function () {
        if (this._parent) {
            this._parent.removeWidget(this);
            BI.DOM.hang([this]);
        }
    },

    empty: function () {
        BI.each(this._children, function (i, widget) {
            widget._unMount();
        });
        this._children = {};
        this.element.empty();
    },

    destroy: function () {
        BI.each(this._children, function (i, widget) {
            widget._unMount && widget._unMount();
        });
        this._children = {};
        this._parent = null;
        this._isMounted = false;
        this.destroyed();
        this.element.destroy();
        this.fireEvent(BI.Events.DESTROY);
        this.purgeListeners();
    }
});