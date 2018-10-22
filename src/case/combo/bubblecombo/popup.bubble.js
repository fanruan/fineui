/**
 * Created by GUY on 2017/2/8.
 *
 * @class BI.BubblePopupView
 * @extends BI.PopupView
 */
BI.BubblePopupView = BI.inherit(BI.PopupView, {
    _defaultConfig: function () {
        var config = BI.BubblePopupView.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(config, {
            baseCls: config.baseCls + " bi-bubble-popup-view"
        });
    },
    _init: function () {
        BI.BubblePopupView.superclass._init.apply(this, arguments);
    },

    showLine: function (direction) {
        var pos = {}, op = {};
        switch (direction) {
            case "left":
                pos = {
                    top: 0,
                    bottom: 0,
                    left: -1
                };
                op = {width: 3};
                break;
            case "right":
                pos = {
                    top: 0,
                    bottom: 0,
                    right: -1
                };
                op = {width: 3};
                break;
            case "top":
                pos = {
                    left: 0,
                    right: 0,
                    top: -1
                };
                op = {height: 3};
                break;
            case "bottom":
                pos = {
                    left: 0,
                    right: 0,
                    bottom: -1
                };
                op = {height: 3};
                break;
            default:
                break;
        }
        this.line = BI.createWidget(op, {
            type: "bi.layout",
            cls: "bubble-popup-line bi-high-light-background"
        });
        pos.el = this.line;
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [pos]
        });
    },

    hideLine: function () {
        this.line && this.line.destroy();
    }
});

BI.shortcut("bi.bubble_popup_view", BI.BubblePopupView);

/**
 * Created by GUY on 2017/2/8.
 *
 * @class BI.BubblePopupBarView
 * @extends BI.BubblePopupView
 */
BI.BubblePopupBarView = BI.inherit(BI.BubblePopupView, {
    _defaultConfig: function () {
        return BI.extend(BI.BubblePopupBarView.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-bubble-bar-popup-view",
            buttons: [{
                value: BI.i18nText("BI-Basic_Cancel"),
                ghost: true
            }, {value: BI.i18nText(BI.i18nText("BI-Basic_Sure"))}]
        });
    },
    _init: function () {
        BI.BubblePopupBarView.superclass._init.apply(this, arguments);
    },
    _createToolBar: function () {
        var o = this.options, self = this;

        var items = [];
        BI.each(o.buttons, function (i, buttonOpt) {
            if (BI.isWidget(buttonOpt)) {
                items.push(buttonOpt);
            } else {
                items.push(BI.extend({
                    type: "bi.button",
                    height: 30,
                    handler: function (v) {
                        self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, v);
                    }
                }, buttonOpt));
            }
        });
        return BI.createWidget({
            type: "bi.right_vertical_adapt",
            height: 44,
            hgap: 10,
            bgap: 10,
            items: items
        });
    }
});
BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON = "EVENT_CLICK_TOOLBAR_BUTTON";
BI.shortcut("bi.bubble_bar_popup_view", BI.BubblePopupBarView);

/**
 * Created by Windy on 2018/2/2.
 *
 * @class BI.TextBubblePopupBarView
 * @extends BI.BubblePopupView
 */
BI.TextBubblePopupBarView = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-text-bubble-bar-popup-view",
        text: "",
        width: 250,
        buttons: [{
            level: "ignore",
            value: false
        }, {
            value: true
        }]
    },

    render: function () {
        var self = this, o = this.options;
        var buttons = BI.map(o.buttons, function (index, buttonOpt) {
            if (BI.isWidget(buttonOpt)) {
                return buttonOpt;
            }
            return BI.extend({
                type: "bi.button",
                height: 24,
                text: index === 0 ? BI.i18nText("BI-Basic_Cancel") : BI.i18nText("BI-Basic_Sure"),
                handler: function (v) {
                    self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, v);
                }
            }, buttonOpt);

        });
        return {
            type: "bi.bubble_bar_popup_view",
            ref: function () {
                self.popup = this;
            },
            el: {
                type: "bi.vertical",
                items: [{
                    type: "bi.label",
                    text: o.text,
                    whiteSpace: "normal",
                    textAlign: "left",
                    ref: function () {
                        self.text = this;
                    }
                }],
                hgap: 10,
                tgap: 25,
                bgap: 10
            },
            buttons: buttons
        };
    },

    populate: function (v) {
        this.text.setText(v || this.options.text);
    },

    showLine: function (direction) {
        this.popup.showLine(direction);
    },

    hideLine: function () {
        this.popup.hideLine();
    }
});
BI.TextBubblePopupBarView.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_bubble_bar_popup_view", BI.TextBubblePopupBarView);
