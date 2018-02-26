/**
 * floatBox弹出层，
 * @class BI.FloatBox
 * @extends BI.Widget
 */
BI.FloatBox = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatBox.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-box bi-card",
            width: 600,
            height: 500
        });
    },
    _init: function () {
        BI.FloatBox.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.showAction = new BI.ShowAction({
            tar: this
        });
        this._center = BI.createWidget();
        this._north = BI.createWidget();
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
        this._south = BI.createWidget();
        BI.createWidget({
            type: "bi.border",
            element: this,
            items: {
                north: {
                    el: {
                        type: "bi.border",
                        cls: "bi-message-title bi-background",
                        items: {
                            center: {
                                el: {
                                    type: "bi.absolute",
                                    items: [{
                                        el: this._north,
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
                                        self.currentSectionProvider.close();
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
                            el: this._center,
                            left: 20,
                            top: 20,
                            right: 20,
                            bottom: 0
                        }]
                    }
                },
                south: {
                    el: {
                        type: "bi.absolute",
                        items: [{
                            el: this._south,
                            left: 20,
                            top: 0,
                            right: 20,
                            bottom: 0
                        }]
                    },
                    height: 44
                }
            }
        });
    },

    populate: function (sectionProvider) {
        var self = this;
        if (this.currentSectionProvider && this.currentSectionProvider !== sectionProvider) {
            this.currentSectionProvider.destroy();
        }
        this.currentSectionProvider = sectionProvider;
        sectionProvider.rebuildNorth(this._north);
        sectionProvider.rebuildCenter(this._center);
        sectionProvider.rebuildSouth(this._south);
        sectionProvider.on(BI.PopoverSection.EVENT_CLOSE, function () {
            self.close();
        });
    },

    show: function () {
        this.showAction.actionPerformed();
    },

    hide: function () {
        this.showAction.actionBack();
    },

    open: function () {
        this.show();
        this.fireEvent(BI.FloatBox.EVENT_FLOAT_BOX_OPEN);
    },

    close: function () {
        this.hide();
        this.fireEvent(BI.FloatBox.EVENT_FLOAT_BOX_CLOSED);
    },

    setZindex: function (zindex) {
        this.element.css({"z-index": zindex});
    },

    destroyed: function () {
        this.currentSectionProvider && this.currentSectionProvider.destroy();
    }
});

BI.shortcut("bi.float_box", BI.FloatBox);

BI.FloatBox.EVENT_FLOAT_BOX_CLOSED = "EVENT_FLOAT_BOX_CLOSED";
BI.FloatBox.EVENT_FLOAT_BOX_OPEN = "EVENT_FLOAT_BOX_CLOSED";
