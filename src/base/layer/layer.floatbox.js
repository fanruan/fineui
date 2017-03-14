/**
 * floatBox弹出层，
 * @class BI.FloatBox
 * @extends BI.Widget
 */
BI.FloatBox = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatBox.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-box",
            width: 600,
            height: 500
        })
    },
    _init: function () {
        BI.FloatBox.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.showAction = new BI.ShowAction({
            tar: this
        });
        this._center = BI.createWidget();
        this._north = BI.createWidget();
        this.element.draggable({
            cursor: BICst.cursorUrl,
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
            }
        });
        this._south = BI.createWidget();
        BI.createWidget({
            type: 'bi.border',
            element: this.element,
            items: {
                'north': {
                    el: {
                        type: 'bi.border',
                        cls: 'bi-message-title',
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
                                    type: 'bi.icon_button',
                                    cls: 'bi-message-close close-font',
                                    height: 50,
                                    handler: function () {
                                        self.currentSectionProvider.close();
                                    }
                                },
                                width: 60
                            }
                        }
                    },
                    height: 50
                },
                'center': {
                    el: {
                        type: "bi.absolute",
                        items: [{
                            el: this._center,
                            left: 10,
                            top: 10,
                            right: 10,
                            bottom: 10
                        }]
                    }
                },
                'south': {
                    el: {
                        type: "bi.absolute",
                        items: [{
                            el: this._south,
                            left: 10,
                            top: 0,
                            right: 10,
                            bottom: 0
                        }]
                    },
                    height: 60
                }
            }
        })
    },

    populate: function (sectionProvider) {
        var self = this;
        this.currentSectionProvider = sectionProvider;
        sectionProvider.rebuildNorth(this._north);
        sectionProvider.rebuildCenter(this._center);
        sectionProvider.rebuildSouth(this._south);
        if (sectionProvider instanceof BI.Widget) {
            sectionProvider.on(BI.PopoverSection.EVENT_CLOSE, function () {
                self.close();
            })
        }
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
    }
});

$.shortcut("bi.float_box", BI.FloatBox);

BI.FloatBox.EVENT_FLOAT_BOX_CLOSED = "EVENT_FLOAT_BOX_CLOSED";
BI.FloatBox.EVENT_FLOAT_BOX_OPEN = "EVENT_FLOAT_BOX_CLOSED";
