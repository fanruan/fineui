/**
 * @class BI.YearMonthParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.YearMonthParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearMonthParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-month-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.YearMonthParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.year_month_param_popup_view",
            maxHeight: 300
        });

        this.popup.on(BI.ParamPopupView.EVENT_CONFIRM, function(){
            self.YearMonthParamCombo.hideView();
        });

        this.YearMonthParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.YearMonthParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.YearMonthParamCombo.EVENT_CONFIRM);
        });

        this.YearMonthParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.setValue(self.getValue());
        });

    },

    _getShowTextByValue: function(v){
        v = v || {};
        var value = v.value;
        var midText = (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
            BI.i18nText("BI-Basic_De") + (value.soffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) + value.svalue;
        switch (v.type) {
            case BICst.YEAR:
                return value.fvalue + BI.i18nText("BI-Year") +
                    (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
                    BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Year_Fen");
            case BICst.YEAR_MONTH:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Month_De");
        }
    },

    setValue: function (v) {
        this.YearMonthParamCombo.setValue(v);
        this.trigger.setValue(this._getShowTextByValue(v));
    },

    setEnable: function (v) {
        BI.YearMonthParamCombo.superclass.setEnable.apply(this, arguments);
        this.YearMonthParamCombo.setEnable(v);
    },

    getValue: function () {
        return this.YearMonthParamCombo.getValue();
    },

    getCalculationValue: function(){
        return this.popup.getCalculationValue();
    }
});
BI.YearMonthParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.year_month_param_combo", BI.YearMonthParamCombo);