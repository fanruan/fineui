/**
 * Widget超类
 * @class BI.Widget
 * @extends BI.OB
 *
 * @cfg {JSON} options 配置属性
 */
BI.Widget = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.Widget.superclass._defaultConfig.apply(this, arguments), {
            tagName: "div",
            attributes: {},
            data: {},

            tag: null,
            widgetName: "",
            disabled: false,
            invisible: false,
            invalid: false,
            baseCls: "",
            extraCls: "",
            cls: ""
        })
    },

    _initOpts: function () {
    },

    _init: function () {
        var o = this.options;
        this._initOpts()
        BI.isWidget(o.element) && (o.element = o.element.element);
        BI.isString(o.element) && (o.element = $(o.element));
        o.renderEl || (o.renderEl = o.element);
        o.element || (o.element = o.renderEl);
        o.element || (o.renderEl = o.element = $(document.createElement(o.tagName)));
        this.widgetName = o.widgetName || (o.widgetName = BI.uniqueId("widget"));
        this._initRoot();
        this._initElementWidth();
        this._initElementHeight();
        this._initVisualEffects();
        o.extraCls && this.element.addClass(o.extraCls);
        o.cls && this.element.addClass(o.cls);
        this.element.attr(o.attributes).data(o.data);
        this.widgets = {};//保存子组件
    },

    /**
     * 初始化根节点
     * @private
     */
    _initRoot: function () {
        if (this.options.renderEl != null) {
            this.element = $(this.options.renderEl);
        } else {
            this.element = this._defaultRoot();
        }
        if (this.options.baseCls) {
            this.element.addClass(this.options.baseCls);
        }
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
        BI.nextTick(BI.bind(function () {
            if (this.options.disabled) {
                this.setEnable(false);
            }
            if (this.options.invalid) {
                this.setValid(false);
            }
        }, this));

        if (this.options.invisible) {
            this.setVisible(false);
        }
    },

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
                var args = Array.prototype.slice.call(arguments, 1)
                for (var i = 0; i < fns.length; i++) {
                    if (fns[i].apply(this, args) === false) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    setWidth: function (w) {
        this.options.width = w;
        this._initElementWidth();
    },

    setHeight: function (h) {
        this.options.height = h;
        this._initElementHeight();
    },

    setElement: function (widget) {
        if (widget == this) {
            return;
        }
        this.element = BI.isWidget(widget) ? widget.element : $(widget);
        return this;
    },

    setEnable: function (enable) {
        BI.assert(enable, [true, false]);
        if (enable === true) {
            this.options.disabled = false;
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.options.disabled = true;
            this.element.addClass("base-disabled disabled");
        }
    },

    setVisible: function (visible) {
        BI.assert(visible, [true, false]);
        if (visible === true) {
            this.options.invisible = false;
            this.element.show();
        } else if (visible === false) {
            this.options.invisible = true;
            this.element.hide();
        }
        this.fireEvent(BI.Events.VIEW, visible);
    },

    setValid: function (valid) {
        BI.assert(valid, [true, false]);
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

    valid: function () {
        this.setValid(true);
    },

    invalid: function () {
        this.setValid(false);
    },

    addWidget: function (name, widget) {
        var self = this;
        if (name instanceof BI.Widget) {
            widget = name;
            name = widget.getName();
        }
        if (!BI.isKey(name)) {
            throw new Error("name cannot be null");
        }
        name = BI.isKey(name) ? (name + "") : "";
        name = name || widget.getName() || BI.UUID();
        if (this.widgets[name]) {
            throw new Error("name has already been existed");
        }
        widget.on(BI.Events.DESTROY, function () {
            delete self.widgets[name]
        });
        return (this.widgets[name] = widget);
    },

    getWidgetByName: function (name) {
        if (!BI.isKey(name) || name == this.getName()) {
            return this;
        }
        name = name + "";
        var widget = void 0, other = {};
        BI.any(this.widgets, function (i, wi) {
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

    hasWidget: function (name) {
        return this.widgets[name] != null;
    },

    getWidgets: function () {
        return this.widgets;
    },

    getValidWidgets: function () {
        var widgets = [];
        BI.each(this.widgets, function (i, wi) {
            if (wi.isValid()) {
                widgets.push(wi);
            }
        });
        return widgets;
    },

    getName: function () {
        return this.options.widgetName;
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

    getText : function() {

    },

    setText : function(text) {

    },

    getValue: function () {

    },

    setValue: function (value, shouldFireEvent) {

    },

    getType: function () {
        return this.options.type;
    },

    isEnabled: function () {
        return !this.options.disabled;
    },

    isVisible: function () {
        return !this.options.invisible;
    },

    render: function () {
        this.element.append(this.hang());
        return this;
    },

    hang: function () {
        return BI.DOM.hang(BI.trans2Element(this.widgets));
    },

    clear: function () {
        this.hang();
        this.element.empty();
        this.widgets = {};
    },

    empty: function () {
        BI.each(this.widgets, function (i, wi) {
            wi.destroy();
        });
        this.element.empty();
        this.widgets = {};
    },

    destroy: function () {
        this.empty();
        this.element.each(function () {
            $(this).remove();
            if (BI.isIE()) {
                this.outerHTML = '';
            }
        });
        this.fireEvent(BI.Events.DESTROY);
    },

    _defaultRoot: function () {
        return $("<div/>");
    },

    disable: function () {
        this.setEnable(false);
    },

    enable: function () {
        this.setEnable(true);
    },

    invisible: function () {
        this.setVisible(false);
    },

    visible: function () {
        this.setVisible(true);
    }
});