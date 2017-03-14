/**
 * guy
 * FloatBox弹出层控制器, z-index在100w层级
 * @class BI.FloatBoxController
 * @extends BI.Controller
 */
BI.FloatBoxController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatBoxController.superclass._defaultConfig.apply(this, arguments), {
            modal: true, // 模态窗口
            render: "body"
        });
    },

    _init: function () {
        BI.FloatBoxController.superclass._init.apply(this, arguments);
        this.modal = this.options.modal;
        this.floatManager = {};
        this.floatLayer = {};
        this.floatContainer = {};
        this.zindex = BI.zIndex_floatbox;
        this.zindexMap = {};
    },

    _check: function (name) {
        return BI.isNotNull(this.floatManager[name]);
    },

    create: function (name, section, options) {
        if (this._check(name)) {
            return this;
        }
        var floatbox = BI.createWidget({
            type: "bi.float_box"
        }, options);
        floatbox.populate(section);
        this.add(name, floatbox, options);
        return this;
    },

    add: function (name, floatbox, options) {
        var self = this;
        options || (options = {});
        if (this._check(name)) {
            return this;
        }
        this.floatContainer[name] = BI.createWidget({
            type: "bi.absolute",
            cls: "bi-list-view",
            items: [{
                el: (this.floatLayer[name] = BI.createWidget({
                    type: 'bi.absolute',
                    items: [floatbox]
                })),
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.floatManager[name] = floatbox;
        (function (key) {
            floatbox.on(BI.FloatBox.EVENT_FLOAT_BOX_CLOSED, function () {
                self.close(key);
            })
        })(name);
        BI.createWidget({
            type: "bi.absolute",
            element: options.container || this.options.render,
            items: [{
                el: this.floatContainer[name],
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        return this;
    },

    open: function (name) {
        if (!this._check(name)) {
            return this;
        }
        var container = this.floatContainer[name];
        container.element.css("zIndex", this.zindex++);
        this.modal && container.element.__hasZIndexMask__(this.zindexMap[name]) && container.element.__releaseZIndexMask__(this.zindexMap[name]);
        this.zindexMap[name] = this.zindex;
        this.modal && container.element.__buildZIndexMask__(this.zindex++);
        this.get(name).setZindex(this.zindex++);
        this.floatContainer[name].visible();
        var floatbox = this.get(name);
        floatbox.show();
        var W = $(this.options.render).width(), H = $(this.options.render).height();
        var w = floatbox.element.width(), h = floatbox.element.height();
        var left = (W - w) / 2, top = (H - h) / 2;
        if (left < 0) {
            left = 0;
        }
        if (top < 0) {
            top = 0;
        }
        floatbox.element.css({
            left: left + "px",
            top: top + "px"
        });
        return this;
    },

    close: function (name) {
        if (!this._check(name)) {
            return this;
        }
        this.floatContainer[name].invisible();
        this.modal && this.floatContainer[name].element.__releaseZIndexMask__(this.zindexMap[name]);
        return this;
    },

    get: function (name) {
        return this.floatManager[name];
    },

    remove: function (name) {
        if (!this._check(name)) {
            return this;
        }
        this.floatContainer[name].destroy();
        this.modal && this.floatContainer[name].element.__releaseZIndexMask__(this.zindexMap[name]);
        delete this.floatManager[name];
        delete this.floatLayer[name];
        delete this.zindexMap[name];
        delete this.floatContainer[name];
        return this;
    }
});