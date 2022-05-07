/**
 * guy
 * popover弹出层控制器, z-index在100w层级
 * @class BI.popoverController
 * @extends BI.Controller
 */
BI.PopoverController = BI.inherit(BI.Controller, {
    props: function () {
        return {
            modal: true, // 模态窗口
            render: "body"
        };
    },

    init: function () {
        this.modal = this.options.modal;
        this.floatManager = {};
        this.floatLayer = {};
        this.floatContainer = {};
        this.floatOpened = {};
        this.zindex = BI.zIndex_popover;
        this.zindexMap = {};
    },

    create: function (name, options, context) {
        if (this.has(name)) {
            return this;
        }
        var popover = BI.createWidget(options || {}, {
            type: "bi.popover"
        }, context);
        this.add(name, popover, options, context);
        return this;
    },

    open: function (name) {
        if (!this.has(name)) {
            return this;
        }
        if (!this.floatOpened[name]) {
            this.floatOpened[name] = true;
            var container = this.floatContainer[name];
            container.element.css("zIndex", this.zindex++);
            this.modal && container.element.__hasZIndexMask__(this.zindexMap[name]) && container.element.__releaseZIndexMask__(this.zindexMap[name]);
            this.zindexMap[name] = this.zindex;
            this.modal && container.element.__buildZIndexMask__(this.zindex++);
            this.get(name).setZindex(this.zindex++);
            this.floatContainer[name].visible();
            var popover = this.get(name);
            popover.show && popover.show();
            var W = BI.Widget._renderEngine.createElement(this.options.render).width(),
                H = BI.Widget._renderEngine.createElement(this.options.render).height();
            var w = popover.element.width(), h = popover.element.height();
            var left = (W - w) / 2, top = (H - h) / 2;
            if (left < 0) {
                left = 0;
            }
            if (top < 0) {
                top = 0;
            }
            popover.element.css({
                left: left / BI.pixRatio + BI.pixUnit,
                top: top / BI.pixRatio + BI.pixUnit
            });
        }
        return this;
    },

    close: function (name) {
        if (!this.has(name)) {
            return this;
        }
        if (this.floatOpened[name]) {
            delete this.floatOpened[name];
            this.floatContainer[name].invisible();
            this.modal && this.floatContainer[name].element.__releaseZIndexMask__(this.zindexMap[name]);
        }
        return this;
    },

    show: function (name) {
        return this.open(name);
    },

    hide: function (name) {
        return this.close(name);
    },

    isVisible: function (name) {
        return this.has(name) && this.floatOpened[name] === true;
    },

    add: function (name, popover, options, context) {
        var self = this;
        options || (options = {});
        if (this.has(name)) {
            return this;
        }
        this.floatContainer[name] = BI.createWidget({
            type: "bi.absolute",
            cls: "bi-popup-view",
            items: [{
                el: (this.floatLayer[name] = BI.createWidget({
                    type: "bi.absolute",
                    items: [popover]
                }, context)),
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.floatManager[name] = popover;
        (function (key) {
            popover.on(BI.Popover.EVENT_CLOSE, function () {
                self.close(key);
            });
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

    get: function (name) {
        return this.floatManager[name];
    },

    has: function (name) {
        return BI.isNotNull(this.floatManager[name]);
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        this.floatContainer[name].destroy();
        this.modal && this.floatContainer[name].element.__releaseZIndexMask__(this.zindexMap[name]);
        delete this.floatManager[name];
        delete this.floatLayer[name];
        delete this.zindexMap[name];
        delete this.floatContainer[name];
        delete this.floatOpened[name];
        return this;
    },

    removeAll: function () {
        var self = this;
        BI.each(this.floatContainer, function (name, container) {
            container.destroy();
            self.modal && self.floatContainer[name].element.__releaseZIndexMask__(self.zindexMap[name]);
        });
        this.floatManager = {};
        this.floatLayer = {};
        this.floatContainer = {};
        this.floatOpened = {};
        this.zindexMap = {};
        return this;
    },

    _getZIndex: function () {
        return this.zindex++;
    }
});
