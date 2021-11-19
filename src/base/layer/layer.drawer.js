/**
 * Popover弹出层，
 * @class BI.Popover
 * @extends BI.Widget
 */
BI.Drawer = BI.inherit(BI.Widget, {
    SIZE: {
        SMALL: "small",
        NORMAL: "normal",
        BIG: "big"
    },
    props: {
        baseCls: "bi-drawer bi-card",
        size: "normal",
        placement: "right", //  top/bottom/left/right
        header: null,
        headerHeight: 40,
        body: null,
        closable: true, // BI-40839 是否显示右上角的关闭按钮
        bodyHgap: 20,
        bodyTgap: 10,
        bodyBgap: 10
    },

    render: function () {
        var self = this;
        var o = this.options;
        var items = [{
            el: {
                type: "bi.htape",
                cls: "bi-message-title bi-header-background",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: BI.isPlainObject(o.header) ? BI.extend({}, o.header, {
                            extraCls: "bi-font-bold"
                        }) : {
                            type: "bi.label",
                            cls: "bi-font-bold",
                            height: o.headerHeight,
                            text: o.header,
                            title: o.header,
                            textAlign: "left"
                        },
                        left: 20,
                        top: 0,
                        right: 0,
                        bottom: 0
                    }]
                }, {
                    el: o.closable ? {
                        type: "bi.icon_button",
                        cls: "bi-message-close close-font",
                        height: o.headerHeight,
                        handler: function () {
                            self.close();
                        }
                    } : {
                        type: "bi.layout"
                    },
                    width: 56
                }],
                height: o.headerHeight
            },
            height: o.headerHeight
        }, {
            el: {
                type: "bi.vertical",
                scrolly: true,
                cls: "drawer-body",
                ref: function () {
                    self.body = this;
                },
                items: [{
                    el: o.body
                }]
            },
            hgap: o.bodyHgap,
            tgap: o.bodyTgap,
            bgap: o.bodyBgap
        }];

        return BI.extend({
            type: "bi.vtape",
            items: items
        }, this._getSuitableSize());
    },

    _getSuitableSize: function () {
        var o = this.options;
        var size = 0;
        switch (o.size) {
            case "big":
                size = 736;
                break;
            case "small":
                size = 200;
                break;
            case "normal":
            default:
                size = 378;
                break;
        }
        if (o.placement === "top" || o.placement === "bottom") {
            return {
                height: o.height || size
            };
        }
        if (o.placement === "left" || o.placement === "right") {
            return {
                width: o.width || size
            };
        }
    },

    mounted: function () {
        var self = this, o = this.options;
        switch (o.placement) {
            case "right":
                self.element.css({
                    top: 0,
                    left: "100%",
                    bottom: 0
                });
                break;
            case "left":
                self.element.css({
                    top: 0,
                    right: "100%",
                    bottom: 0
                });
                break;
            case "top":
                self.element.css({
                    left: 0,
                    right: 0,
                    bottom: "100%"
                });
                break;
            case "bottom":
                self.element.css({
                    left: 0,
                    right: 0,
                    top: "100%"
                });
                break;
        }
    },

    show: function (callback) {
        var self = this, o = this.options;
        requestAnimationFrame(function () {
            var size = self._getSuitableSize();
            switch (o.placement) {
                case "right":
                    self.element.css({
                        transform: "translateX(-" + size.width + "px)"
                    });
                    break;
                case "left":
                    self.element.css({
                        transform: "translateX(" + size.width + "px)"
                    });
                    break;
                case "top":
                    self.element.css({
                        transform: "translateY(" + size.height + "px)"
                    });
                    break;
                case "bottom":
                    self.element.css({
                        transform: "translateY(-" + size.height + "px)"
                    });
                    break;
            }
            callback && callback();
        });
    },

    hide: function (callback) {
        var self = this, o = this.options;
        requestAnimationFrame(function () {
            switch (o.placement) {
                case "right":
                case "left":
                    self.element.css({
                        transform: "translateX(0px)"
                    });
                    break;
                case "top":
                case "bottom":
                    self.element.css({
                        transform: "translateY(0px)"
                    });
                    break;
            }
            setTimeout(callback, 300);
        });
    },

    open: function () {
        var self = this;
        this.show(function () {
            self.fireEvent(BI.Drawer.EVENT_OPEN);
        });
    },

    close: function () {
        var self = this;
        this.hide(function () {
            self.fireEvent(BI.Drawer.EVENT_CLOSE);
        });
    },

    setZindex: function (zindex) {
        this.element.css({"z-index": zindex});
    },

    destroyed: function () {
    }
});

BI.shortcut("bi.drawer", BI.Drawer);

BI.Drawer.EVENT_CLOSE = "EVENT_CLOSE";
BI.Drawer.EVENT_OPEN = "EVENT_OPEN";
