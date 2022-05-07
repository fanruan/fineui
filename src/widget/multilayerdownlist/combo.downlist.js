/**
 * Created by roy on 15/8/14.
 */
BI.MultiLayerDownListCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerDownListCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-down-list-combo",
            height: 24,
            items: [],
            adjustLength: 0,
            direction: "bottom",
            trigger: "click",
            container: null,
            stopPropagation: false,
            el: {}
        });
    },

    _init: function () {
        BI.MultiLayerDownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popupview = BI.createWidget({
            type: "bi.multi_layer_down_list_popup",
            items: o.items,
            chooseType: o.chooseType,
            value: o.value
        });

        this.popupview.on(BI.MultiLayerDownListPopup.EVENT_CHANGE, function (value) {
            self.fireEvent(BI.MultiLayerDownListCombo.EVENT_CHANGE, value);
            self.downlistcombo.hideView();
        });

        this.popupview.on(BI.MultiLayerDownListPopup.EVENT_SON_VALUE_CHANGE, function (value, fatherValue) {
            self.fireEvent(BI.MultiLayerDownListCombo.EVENT_SON_VALUE_CHANGE, value, fatherValue);
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
            stopPropagation: o.stopPropagation,
            el: BI.createWidget(o.el, {
                type: "bi.icon_trigger",
                extraCls: o.iconCls ? o.iconCls : "pull-down-font",
                width: o.width,
                height: o.height
            }),
            popup: {
                el: this.popupview,
                stopPropagation: o.stopPropagation,
                maxHeight: 1000
            }
        });

        this.downlistcombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.MultiLayerDownListCombo.EVENT_BEFORE_POPUPVIEW);
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
BI.MultiLayerDownListCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiLayerDownListCombo.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.MultiLayerDownListCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.multi_layer_down_list_combo", BI.MultiLayerDownListCombo);