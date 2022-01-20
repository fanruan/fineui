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
            baseCls: config.baseCls + " bi-bubble-popup-view",
            minWidth: 70,
            maxWidth: 300,
            minHeight: 50
        });
    },
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
                value: false,
                text: BI.i18nText("BI-Basic_Cancel"),
                ghost: true
            }, {
                text: BI.i18nText(BI.i18nText("BI-Basic_OK")),
                value: true
            }]
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
                    height: 24,
                    handler: function (v) {
                        self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, v);
                    }
                }, buttonOpt));
            }
        });
        return BI.createWidget({
            type: "bi.center",
            height: 54,
            rgap: 20,
            items: [{
                type: "bi.right_vertical_adapt",
                lgap: 15,
                items: items
            }]
        });
    },

    _createView: function () {
        var o = this.options;

        var button =  BI.createWidget({
            type: "bi.button_group",
            items: [o.el],
            layouts: [{
                type: "bi.vertical",
                cls: "bar-popup-container",
                hgap: 20,
                tgap: 15
            }]
        });

        button.element.css("min-height", o.minHeight - 54);

        return button;
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

    props: function () {
        return {
            baseCls: "bi-text-bubble-bar-popup-view",
            text: "",
            buttons: [{
                level: "ignore",
                value: false,
                stopPropagation: true,
                text: BI.i18nText("BI-Basic_Cancel")
            }, {
                value: true,
                stopPropagation: true,
                text: BI.i18nText("BI-Basic_OK")
            }]
        };
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
                handler: function (v) {
                    self.fireEvent(BI.TextBubblePopupBarView.EVENT_CHANGE, v);
                }
            }, buttonOpt);

        });
        return {
            type: "bi.bubble_bar_popup_view",
            primary: o.primary,
            minWidth: o.minWidth,
            maxWidth: o.maxWidth,
            minHeight: o.minHeight,
            ref: function () {
                self.popup = this;
            },
            el: {
                type: "bi.label",
                text: o.text,
                whiteSpace: "normal",
                textAlign: "left",
                ref: function () {
                    self.text = this;
                }
            },
            buttons: buttons
        };
    },

    populate: function (v) {
        this.text.setText(v || this.options.text);
    },
});
BI.TextBubblePopupBarView.EVENT_CHANGE = "EVENT_CLICK_TOOLBAR_BUTTON";
BI.shortcut("bi.text_bubble_bar_popup_view", BI.TextBubblePopupBarView);
