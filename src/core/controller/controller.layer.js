/**
 * 弹出层面板控制器, z-index在10w层级
 *
 * Created by GUY on 2015/6/24.
 * @class
 */
BI.LayerController = BI.inherit(BI.Controller, {
    props: function () {
        return {
            render: "body"
        };
    },

    init: function () {
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
        });
    },

    make: function (name, container, op, context) {
        if (BI.isWidget(container)) {
            op = op || {};
            op.container = container;
        } else {
            context = op;
            op = container;
        }
        return this.create(name, null, op, context);
    },

    create: function (name, from, op, context) {
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
            w = BI.Widget._renderEngine.createElement(w);
        }
        if (this.has(name)) {
            return this.get(name);
        }
        var widget = BI.createWidget((op.render || {}), BI.extend({
            type: "bi.layout"
        }, op), context);
        var layout = BI.createWidget({
            type: "bi.absolute",
            invisible: true,
            items: [{
                el: widget,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        }, context);
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
            layout.element.addClass("bi-popup-view");
            layout.element.css({
                left: w.offset().left + (offset.left || 0),
                top: w.offset().top + (offset.top || 0),
                width: offset.width || (w.outerWidth() - (offset.left || 0) - (offset.right || 0)) || "",
                height: offset.height || (w.outerHeight() - (offset.top || 0) - (offset.bottom || 0)) || ""
            });
            layout.element.on("__resize__", function () {
                w.is(":visible") &&
                layout.element.css({
                    left: w.offset().left + (offset.left || 0),
                    top: w.offset().top + (offset.top || 0),
                    width: offset.width || (w.outerWidth() - (offset.left || 0) - (offset.right || 0)) || "",
                    height: offset.height || (w.outerHeight() - (offset.top || 0) - (offset.bottom || 0)) || ""
                });
            });
        }
        this.add(name, widget, layout);
        return widget;
    },

    show: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        this._getLayout(name).visible();
        this._getLayout(name).element.css("z-index", this.zindex++).show(0, callback).trigger("__resize__");
        return this;
    },

    hide: function (name, callback) {
        if (!this.has(name)) {
            return this;
        }
        this._getLayout(name).invisible();
        this._getLayout(name).element.hide(0, callback);
        return this;
    },

    isVisible: function (name) {
        return this.has(name) && this._getLayout(name).isVisible();
    },

    add: function (name, layer, layout) {
        if (this.has(name)) {
            throw new Error("不能创建同名的Layer");
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
    },

    removeAll: function () {
        var self = this;
        BI.each(BI.keys(this.layerManager), function (index, name) {
            self.layerManager[name].destroy();
            self.layouts[name].destroy();
        });
        this.layerManager = {};
        this.layouts = {};
        return this;
    }
});
