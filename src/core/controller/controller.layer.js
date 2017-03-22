/**
 * 弹出层面板控制器, z-index在10w层级
 *
 * Created by GUY on 2015/6/24.
 * @class
 */
BI.LayerController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.LayerController.superclass._defaultConfig.apply(this, arguments), {
            render: "body"
        });
    },

    _init: function () {
        BI.LayerController.superclass._init.apply(this, arguments);
        this.layerManager = {};
        this.layouts = {};
        this.zindex = BI.zIndex_layer;
        BI.Resizers.add("layerController" + BI.uniqueId(), BI.bind(this._resize, this));
    },

    _resize: function () {
        BI.each(this.layouts, function (i, layer) {
            if (layer.element.is(":visible")) {
                layer.element.trigger("__resize__");
            }
        })
    },

    make: function (name, container, op) {
        if (this.has(name)) {
            return this.get(name);
        }
        op || (op = {});
        var widget = BI.createWidget((op.render || {}), {
            type: "bi.layout"
        });
        BI.createWidget({
            type: "bi.absolute",
            element: container || this.options.render,
            items: [BI.extend({
                el: widget
            }, {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }, op.offset)]
        });
        this.add(name, widget, widget);
        return widget;
    },

    create: function (name, from, op) {
        if (this.has(name)) {
            return this.get(name);
        }
        op || (op = {});
        var offset = op.offset || {};
        var w = from;
        if (BI.isWidget(from)) {
            w = from.element;
        }
        if (BI.isNotEmptyString(w)) {
            w = $(w);
        }
        if (this.has(name)) {
            return this.get(name);
        }
        var widget = BI.createWidget((op.render || {}), {
            type: "bi.layout"
        });
        var layout = BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: widget,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: op.container || this.options.render,
            items: [{
                el: layout,
                left: offset.left || 0,
                right: offset.right || 0,
                top: offset.top || 0,
                bottom: offset.bottom || 0
            }]
        });
        if (w) {
            layout.element.addClass("bi-list-view");
            layout.element.css({
                left: w.offset().left + (offset.left || 0),
                top: w.offset().top + (offset.top || 0),
                width: offset.width || (w.outerWidth() - (offset.right || 0)) || "",
                height: offset.height || (w.outerHeight() - (offset.bottom || 0)) || ""
            });
            layout.element.on("__resize__", function () {
                w.is(":visible") &&
                layout.element.css({
                    left: w.offset().left + (offset.left || 0),
                    top: w.offset().top + (offset.top || 0),
                    width: offset.width || (w.outerWidth() - (offset.right || 0)) || "",
                    height: offset.height || (w.outerHeight() - (offset.bottom || 0)) || ""
                });
            });
        }
        this.add(name, widget, layout);
        return widget;
    },

    hide: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        this._getLayout(name).invisible();
        this._getLayout(name).element.hide(0, callback);
        return this;
    },

    show: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        this._getLayout(name).visible();
        this._getLayout(name).element.css("z-index", this.zindex++).show(0, callback).trigger("__resize__");
        return this;
    },

    isVisible: function (name) {
        return this.has(name) && this._getLayout(name).isVisible();
    },

    add: function (name, layer, layout) {
        if (this.has(name)) {
            throw new Error("该弹出面板已经存在了，不能添加该key值");
        }
        layout.setVisible(false);
        this.layerManager[name] = layer;
        this.layouts[name] = layout;
        layout.element.css("z-index", this.zindex++);
        return this;
    },

    _getLayout: function (name) {
        return this.layouts[name];
    },

    get: function (name) {
        return this.layerManager[name];
    },

    has: function (name) {
        return this.layerManager[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.layerManager[name].destroy();
        this.layouts[name].destroy();
        delete this.layerManager[name];
        delete this.layouts[name];
        return this;
    }
});