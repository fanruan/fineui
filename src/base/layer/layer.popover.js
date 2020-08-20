/**
 * Popover弹出层，
 * @class BI.Popover
 * @extends BI.Widget
 */
BI.Popover = BI.inherit(BI.Widget, {
    _constant: {
        SIZE: {
            SMALL: "small",
            NORMAL: "normal",
            BIG: "big"
        },
    },

    _defaultConfig: function () {
        return BI.extend(BI.Popover.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-popover bi-card bi-border-radius",
            // width: 600,
            // height: 500,
            size: "normal", // small, normal, big
            logic: {
                dynamic: false
            },
            header: null,
            headerHeight: 40,
            body: null,
            footer: null,
            footerHeight: 44,
            closable: true // BI-40839 是否显示右上角的关闭按钮
        });
    },
    render: function () {
        var self = this, o = this.options;
        this.startX = 0;
        this.startY = 0;
        this.tracker = new BI.MouseMoveTracker(function (deltaX, deltaY) {
            var size = self._calculateSize();
            var W = BI.Widget._renderEngine.createElement("body").width(), H = BI.Widget._renderEngine.createElement("body").height();
            self.startX += deltaX;
            self.startY += deltaY;
            self.element.css({
                left: BI.clamp(self.startX, 0, W - self.element.width()) + "px",
                top: BI.clamp(self.startY, 0, H - self.element.height()) + "px"
            });
            // BI-12134 没有什么特别好的方法
            BI.Resizers._resize();
        }, function () {
            self.tracker.releaseMouseMoves();
        }, _global);
        var items = [{
            el: {
                type: "bi.htape",
                cls: "bi-message-title bi-header-background",
                ref: function (_ref) {
                    self.dragger = _ref;
                },
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: BI.isPlainObject(o.header) ? BI.createWidget(o.header, {
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
            el: o.logic.dynamic ? {
                type: "bi.vertical",
                scrolly: false,
                cls: "popover-body",
                ref: function () {
                    self.body = this;
                },
                hgap: 20,
                tgap: 10,
                items: [{
                    el: BI.createWidget(o.body)
                }]
            } : {
                type: "bi.absolute",
                items: [{
                    el: BI.createWidget(o.body),
                    left: 20,
                    top: 10,
                    right: 20,
                    bottom: 0
                }]
            }
        }];
        if (o.footer) {
            items.push({
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: BI.createWidget(o.footer),
                        left: 20,
                        top: 0,
                        right: 20,
                        bottom: 0
                    }],
                    height: o.footerHeight
                },
                height: o.footerHeight
            });
        }

        var size = this._calculateSize();

        return BI.extend({
            type: o.logic.dynamic ? "bi.vertical" : "bi.vtape",
            items: items,
            width: size.width
        }, o.logic.dynamic ? {
            type: "bi.vertical",
            scrolly: false
        } : {
            type: "bi.vtape",
            height: size.height
        });
    },

    mounted: function () {
        var self = this, o = this.options;
        this.dragger.element.mousedown(function (e) {
            var pos = self.element.offset();
            self.startX = pos.left;
            self.startY = pos.top;
            self.tracker.captureMouseMoves(e);
        });
        if (o.logic.dynamic) {
            var size = this._calculateSize();
            var height = this.element.height();
            var compareHeight = BI.clamp(height, size.height, 600) - (o.footer ? o.footerHeight + o.headerHeight : o.headerHeight);
            this.body.element.height(compareHeight);
        }
    },

    _calculateSize: function () {
        var o = this.options;
        var size = {};
        if (BI.isNotNull(o.size)) {
            switch (o.size) {
                case this._constant.SIZE.SMALL:
                    size.width = 450;
                    size.height = 200;
                    break;
                case this._constant.SIZE.BIG:
                    size.width = 900;
                    size.height = 500;
                    break;
                default:
                    size.width = 550;
                    size.height = 500;
            }
        }
        return {
            width: o.width || size.width,
            height: o.height || size.height
        };
    },

    hide: function () {

    },

    open: function () {
        this.show();
        this.fireEvent(BI.Popover.EVENT_OPEN, arguments);
    },

    close: function () {
        this.hide();
        this.fireEvent(BI.Popover.EVENT_CLOSE, arguments);
    },

    setZindex: function (zindex) {
        this.element.css({"z-index": zindex});
    },

    destroyed: function () {
    }
});

BI.shortcut("bi.popover", BI.Popover);

BI.BarPopover = BI.inherit(BI.Popover, {
    _defaultConfig: function () {
        return BI.extend(BI.BarPopover.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText("BI-Basic_Sure"), BI.i18nText("BI-Basic_Cancel")]
        });
    },

    beforeCreate: function () {
        var self = this, o = this.options;
        o.footer || (o.footer = {
            type: "bi.right_vertical_adapt",
            lgap: 10,
            items: [{
                type: "bi.button",
                text: this.options.btns[1],
                value: 1,
                level: "ignore",
                handler: function (v) {
                    self.fireEvent(BI.Popover.EVENT_CANCEL, v);
                    self.close(v);
                }
            }, {
                type: "bi.button",
                text: this.options.btns[0],
                warningTitle: o.warningTitle,
                value: 0,
                handler: function (v) {
                    self.fireEvent(BI.Popover.EVENT_CONFIRM, v);
                    self.close(v);
                }
            }]
        });
    }
});

BI.shortcut("bi.bar_popover", BI.BarPopover);

BI.Popover.EVENT_CLOSE = "EVENT_CLOSE";
BI.Popover.EVENT_OPEN = "EVENT_OPEN";
BI.Popover.EVENT_CANCEL = "EVENT_CANCEL";
BI.Popover.EVENT_CONFIRM = "EVENT_CONFIRM";
