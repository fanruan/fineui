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
            // minHeight: 50,
            showArrow: true,
        });
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
                value: false,
                text: BI.i18nText("BI-Basic_Cancel"),
                level: "ignore"
            }, {
                text: BI.i18nText(BI.i18nText("BI-Basic_OK")),
                value: true
            }]
        });
    },

    _createToolBar: function () {
        var o = this.options, self = this;

        var items = [];
        BI.each(o.buttons, function (i, buttonOpt) {
            if (BI.isWidget(buttonOpt)) {
                items.push({
                    el: buttonOpt,
                    lgap: i === 0 ? 20 : 15,
                    rgap: i === o.buttons.length - 1 ? 20 : 0
                });
            } else {
                items.push({
                    el: BI.extend({
                        type: "bi.button",
                        height: 24,
                        handler: function (v) {
                            self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, v);
                        }
                    }, buttonOpt),
                    lgap: i === 0 ? 20 : 15,
                    rgap: i === o.buttons.length - 1 ? 20 : 0
                });
            }
        });
        return BI.createWidget({
            type: "bi.right_vertical_adapt",
            height: 54,
            items: items
        });
    },

    _createContent: function () {
        return this.options.el;
    },

    _createView: function () {
        var o = this.options;

        var button = BI.createWidget({
            type: "bi.button_group",
            items: [this._createContent()],
            layouts: [{
                type: "bi.vertical",
                cls: "bar-popup-container",
                hgap: BI.SIZE_CONSANTS.H_GAP_SIZE,
                tgap: BI.SIZE_CONSANTS.V_GAP_SIZE
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
BI.TextBubblePopupBarView = BI.inherit(BI.BubblePopupBarView, {

    _defaultConfig: function () {
        var config = BI.TextBubblePopupBarView.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(config, {
            baseCls: config.baseCls + " bi-text-bubble-bar-popup-view",
            text: "",
        });
    },

    _createContent: function () {
        var self = this, o = this.options;
        return {
            type: "bi.label",
            text: o.text,
            whiteSpace: "normal",
            textAlign: "left",
            ref: function () {
                self.text = this;
            }
        };
    },

    populate: function (v) {
        this.text.setText(v || this.options.text);
    }
});
BI.TextBubblePopupBarView.EVENT_CHANGE = "EVENT_CLICK_TOOLBAR_BUTTON";
BI.shortcut("bi.text_bubble_bar_popup_view", BI.TextBubblePopupBarView);
