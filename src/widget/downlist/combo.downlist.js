/**
 * Created by roy on 15/8/14.
 */
BI.DownListCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DownListCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-combo",
            height: 24,
            items: [],
            adjustLength: 0,
            direction: "bottom",
            trigger: "click",
            container: null,
            stopPropagation: false,
            el: {},
            minWidth: 140,
            maxHeight: 1000
        });
    },

    _init: function () {
        BI.DownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popupview = BI.createWidget({
            type: "bi.down_list_popup",
            items: o.items,
            chooseType: o.chooseType,
            value: o.value
        });

        this.popupview.on(BI.DownListPopup.EVENT_CHANGE, function (value) {
            self.fireEvent(BI.DownListCombo.EVENT_CHANGE, value);
            self.downlistcombo.hideView();
        });

        this.popupview.on(BI.DownListPopup.EVENT_SON_VALUE_CHANGE, function (value, fatherValue) {
            self.fireEvent(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, value, fatherValue);
            self.downlistcombo.hideView();
        });


        this.downlistcombo = BI.createWidget({
            element: this,
            type: "bi.combo",
            trigger: o.trigger,
            isNeedAdjustWidth: false,
            container: o.container,
            adjustLength: o.adjustLength,
            direction: o.direction,
            belowMouse: o.belowMouse,
            stopPropagation: o.stopPropagation,
            el: BI.createWidget(o.el, {
                type: "bi.icon_trigger",
                extraCls: o.iconCls,
                width: o.width,
                height: o.height
            }),
            popup: {
                el: this.popupview,
                stopPropagation: o.stopPropagation,
                maxHeight: o.maxHeight,
                minWidth: o.minWidth
            }
        });

        this.downlistcombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.DownListCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    hideView: function () {
        this.downlistcombo.hideView();
    },

    showView: function (e) {
        this.downlistcombo.showView(e);
    },

    populate: function (items) {
        this.popupview.populate(items);
    },

    setValue: function (v) {
        this.popupview.setValue(v);
    },
    getValue: function () {
        return this.popupview.getValue();
    }
});
BI.DownListCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DownListCombo.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.DownListCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.down_list_combo", BI.DownListCombo);