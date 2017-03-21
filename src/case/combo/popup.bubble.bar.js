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
            buttons: [{value: BI.i18nText(BI.i18nText("BI-Basic_Sure"))}, {value: BI.i18nText("BI-Basic_Cancel"), level: "ignore"}]
        })
    },
    _init: function () {
        BI.BubblePopupBarView.superclass._init.apply(this, arguments);
    },
    _createToolBar: function () {
        var o = this.options, self = this;

        var items = [];
        BI.each(o.buttons.reverse(), function (i, buttonOpt) {
            if(BI.isWidget(buttonOpt)){
                items.push(buttonOpt);
            }else{
                items.push(BI.extend({
                    type: 'bi.button',
                    height: 30,
                    handler: function (v) {
                        self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, v);
                    }
                }, buttonOpt))
            }
        });
        return BI.createWidget({
            type: 'bi.right_vertical_adapt',
            height: 40,
            hgap: 10,
            bgap: 10,
            items: items
        });
    }
});
BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON = "EVENT_CLICK_TOOLBAR_BUTTON";
$.shortcut("bi.bubble_bar_popup_view", BI.BubblePopupBarView);