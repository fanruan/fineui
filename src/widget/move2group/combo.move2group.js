/**
 * 移动到分组下拉框
 *
 * Created by GUY on 2015/9/25.
 * @class BI.Move2GroupCombo
 * @extends BI.Widget
 */
BI.Move2GroupCombo = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Move2GroupCombo.superclass._defaultConfig.apply(this, arguments)
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-move2group-combo",
            height: 30,
            tipType: "warning",
            items: []
        });
    },
    _init: function () {
        BI.Move2GroupCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.button",
            text: BI.i18nText("BI-Move_To_Group"),
            title: o.title,
            height: o.height
        });

        this.tools = BI.createWidget({
            type: "bi.move2group_bar"
        });

        this.tools.on(BI.Move2GroupBar.EVENT_START, function () {
            self.combo.adjustHeight();
            self.searcher.adjustHeight();
        });
        this.tools.on(BI.Move2GroupBar.EVENT_EMPTY, function () {
            self.combo.adjustHeight();
        });
        this.tools.on(BI.Move2GroupBar.EVENT_CLICK_BUTTON, function () {
            self.fireEvent(BI.Move2GroupCombo.EVENT_CLICK_NEW_BUTTON);
            self.searcher.stopSearch();
            self.combo.hideView();
        });
        this.tools.on(BI.Move2GroupBar.EVENT_CHANGE, function () {
            this.setButtonVisible(!self.searcher.hasMatched());
            self.combo.adjustHeight();
            self.searcher.adjustHeight();
        });

        this.popup = this._createPopup(this.options.items);


        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: this.tools,
            adapter: this.popup
        });

        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.Move2GroupCombo.EVENT_CONFIRM);
            self.combo.hideView();
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            el: this.trigger,
            isNeedAdjustWidth: false,
            popup: {
                width: 200,
                stopPropagation: false,
                el: this.popup,
                tool: this.searcher
            }
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            self.combo.hideView();
            self.fireEvent(BI.Move2GroupCombo.EVENT_CONFIRM);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.Move2GroupCombo.EVENT_BEFORE_POPUPVIEW);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.searcher.stopSearch();
        })
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.single_select_item",
            height: 25,
            handler: function (v) {

            }
        })
    },

    _createPopup: function (items, opt) {
        return BI.createWidget(BI.extend({
            type: "bi.button_group",
            items: this._createItems(items),
            chooseType: 0,
            layouts: [{
                type: "bi.vertical"
            }]
        }, opt));
    },

    populate: function (items) {
        this.options.items = items;
        this.combo.populate(this._createItems(items));
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },
    setEnable: function (enable) {
        this.combo.setEnable.apply(this.combo, arguments);
    },

    getTargetValue: function () {
        return this.tools.getValue();
    },

    getValue: function () {
        var value = this.searcher.getValue();
        return value[0];

    }
});
BI.Move2GroupCombo.EVENT_BEFORE_POPUPVIEW = "Move2GroupCombo.EVENT_BEFORE_POPUPVIEW";
BI.Move2GroupCombo.EVENT_CHANGE = "Move2GroupCombo.EVENT_CHANGE";
BI.Move2GroupCombo.EVENT_CONFIRM = "Move2GroupCombo.EVENT_CONFIRM";
BI.Move2GroupCombo.EVENT_CLICK_NEW_BUTTON = "Move2GroupCombo.EVENT_CLICK_NEW_BUTTON";
$.shortcut('bi.move2group_combo', BI.Move2GroupCombo);