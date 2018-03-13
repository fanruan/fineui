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
        }
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
        this.element.draggable && this.element.draggable({
            handle: ".bi-message-title",
            drag: function (e, ui) {
                var W = $("body").width(), H = $("body").height();
                if (ui.position.left + o.width > W) {
                    ui.position.left = W - o.width;
                }
                if (ui.position.top + o.height > H) {
                    ui.position.top = H - o.height;
                }
                if (ui.position.left < 0) {
                    ui.position.left = 0;
                }
                if (ui.position.top < 0) {
                    ui.position.top = 0;
                }
                // BI-12134 没有什么特别好的方法
                BI.Resizers._resize();
            }
        });
        var items = {
            north: {
                el: {
                    type: "bi.border",
                    cls: "bi-message-title bi-background",
                    items: {
                        center: {
                            el: {
                                type: "bi.absolute",
                                items: [{
                                    el: BI.isPlainObject(o.header) ? BI.createWidget(o.header) : {
                                        type: "bi.label",
                                        height: 36,
                                        text: o.header
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
                                height: 36,
                                handler: function () {
                                    self.close();
                                }
                            },
                            width: 60
                        }
                    }
                },
                height: 36
            },
            center: {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: BI.createWidget(o.body),
                        left: 20,
                        top: 20,
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
