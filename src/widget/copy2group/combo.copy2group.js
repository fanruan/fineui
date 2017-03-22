/**
 * 复制到分组下拉框
 *
 * Created by GUY on 2015/9/25.
 * @class BI.Copy2GroupCombo
 * @extends BI.Widget
 */
BI.Copy2GroupCombo = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Copy2GroupCombo.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-copy2group-combo",
            height: 30,
            tipType: "warning",
            items: []
        });
    },
    _init: function () {
        BI.Copy2GroupCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.button",
            text: BI.i18nText("BI-Copy_To_Group"),
            height: o.height
        });

        this.tools = BI.createWidget({
            type: "bi.copy2group_bar"
        });

        this.tools.on(BI.Copy2GroupBar.EVENT_START, function () {
            self.combo.adjustHeight();
            self.searcher.adjustHeight();
        });
        this.tools.on(BI.Copy2GroupBar.EVENT_EMPTY, function () {
            self.combo.adjustHeight();
        });
        this.tools.on(BI.Copy2GroupBar.EVENT_CLICK_BUTTON, function () {
            self.fireEvent(BI.Copy2GroupCombo.EVENT_CLICK_BUTTON);
            self.searcher.stopSearch();
        });
        this.tools.on(BI.Copy2GroupBar.EVENT_CHANGE, function () {
            this.setButtonVisible(!self.searcher.hasMatched());
            self.combo.adjustHeight();
            self.searcher.adjustHeight();
        });

        this.popup = this._createPopup(this.options.items);


        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: this.tools,
            chooseType: BI.Selection.Multi,
            adapter: this.popup
        });

        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {

        });

        this.multipopup = BI.createWidget({
            type: "bi.multi_popup_view",
            width: 200,
            stopPropagation: false,
            el: this.popup,
            tool: this.searcher
        });


        this.combo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustWidth: false,
            element: this,
            el: this.trigger,
            popup: this.multipopup
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.Copy2GroupCombo.EVENT_BEFORE_POPUPVIEW);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.searcher.stopSearch();
        });

        this.multipopup.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (value) {
            switch (value) {
                case 0 :
                    self.fireEvent(BI.Copy2GroupCombo.EVENT_CONFIRM);
                    self.combo.hideView();
                    break;
                default :
                    break;
            }
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            height: 25,
            handler: function (v) {

            }
        })
    },

    _createPopup: function (items, opt) {
        return BI.createWidget(BI.extend({
            type: "bi.button_group",
            items: this._createItems(items),
            chooseType: 1,
            layouts: [{
                type: "bi.vertical"
            }]
        }, opt));
    },


    scrollToBottom: function () {
        var self = this;
        BI.delay(function () {
            self.popup.element.scrollTop(BI.MAX);
        }, 30);
    },

    populate: function (items) {
        this.options.items = items;
        this.combo.populate(this._createItems(items));
    },

    setValue: function (v) {
        this.combo.setValue(v);
        this.searcher.setValue(v);
    },

    setEnable: function (enable) {
        this.combo.setEnable.apply(this.combo, arguments);
    },

    getTargetValue: function () {
        return this.tools.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});
BI.Copy2GroupCombo.EVENT_BEFORE_POPUPVIEW = "Copy2GroupCombo.EVENT_BEFORE_POPUPVIEW";
BI.Copy2GroupCombo.EVENT_CHANGE = "Copy2GroupCombo.EVENT_CHANGE";
BI.Copy2GroupCombo.EVENT_CONFIRM = "Copy2GroupCombo.EVENT_CONFIRM";
BI.Copy2GroupCombo.EVENT_CLICK_BUTTON = "Copy2GroupCombo.EVENT_CLICK_BUTTON";
$.shortcut('bi.copy2group_combo', BI.Copy2GroupCombo);