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
        HEADER_HEIGHT: 40
    },

    _defaultConfig: function () {
        return BI.extend(BI.Popover.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-popover bi-card",
            // width: 600,
            // height: 500,
            size: "normal", // small, normal, big
            header: null,
            body: null,
            footer: null
        });
    },
    render: function () {
        var self = this, o = this.options;
        this.startX = 0;
        this.startY = 0;
        this.tracker = new BI.MouseMoveTracker(function (deltaX, deltaY) {
            var size = self._calculateSize();
            var W = $("body").width(), H = $("body").height();
            self.startX += deltaX;
            self.startY += deltaY;
            self.element.css({
                left: BI.clamp(self.startX, 0, W - size.width) + "px",
                top: BI.clamp(self.startY, 0, H - size.height) + "px"
            });
            // BI-12134 没有什么特别好的方法
            BI.Resizers._resize();
        }, function () {
            self.tracker.releaseMouseMoves();
        }, window);
        var items = {
            north: {
                el: {
                    type: "bi.border",
                    cls: "bi-message-title bi-background",
                    ref: function (_ref) {
                        self.dragger = _ref;
                    },
                    items: {
                        center: {
                            el: {
                                type: "bi.absolute",
                                items: [{
                                    el: BI.isPlainObject(o.header) ? BI.createWidget(o.header, {
                                        extraCls: "bi-font-bold"
                                    }) : {
                                        type: "bi.label",
                                        cls: "bi-font-bold",
                                        height: this._constant.HEADER_HEIGHT,
                                        text: o.header,
                                        textAlign: "left"
                                    },
                                    left: 10,
                                    top: 0,
                                    right: 0,
                                    bottom: 0
                                }]
                            }
                        },
                        east: {
                            el: {
                                type: "bi.icon_button",
                                cls: "bi-message-close close-font",
                                height: this._constant.HEADER_HEIGHT,
                                handler: function () {
                                    self.close();
                                }
                            },
                            width: 60
                        }
                    }
                },
                height: this._constant.HEADER_HEIGHT
            },
            center: {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: BI.createWidget(o.body),
                        left: 20,
                        top: 10,
                        right: 20,
                        bottom: 0
                    }]
                }
            }
        };
        if (o.footer) {
            items.south = {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: BI.createWidget(o.footer),
                        left: 20,
                        top: 0,
                        right: 20,
                        bottom: 0
                    }]
                },
                height: 44
            };
        }

        var size = this._calculateSize();

        return {
            type: "bi.border",
            items: items,
            width: size.width,
            height: size.height
        };
    },

    mounted: function () {
        var self = this;
        this.dragger.element.mousedown(function (e) {
            var pos = self.element.offset();
            self.startX = pos.left;
            self.startY = pos.top;
            self.tracker.captureMouseMoves(e);
        });
    },

    _calculateSize: function () {
        var o = this.options;
        var size = {};
        if (BI.isNotNull(o.size)) {
            switch (o.size) {
                case this._constant.SIZE.SMALL:
                    size.width = 450;
                    size.height = 220;
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
            btns: [BI.i18nText(BI.i18nText("BI-Basic_Sure")), BI.i18nText(BI.i18nText("BI-Basic_Cancel"))]
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
