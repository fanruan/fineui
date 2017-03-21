/**
 * @class BI.DateParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.DateParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.DateParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.date_param_popup_view",
            maxHeight: 300
        });

        this.popup.on(BI.ParamPopupView.EVENT_CONFIRM, function(){
            self.DateParamCombo.hideView();
        });

        this.DateParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.DateParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.DateParamCombo.EVENT_CONFIRM);
        });

        this.DateParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
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
            case BICst.YEAR_QUARTER:
                return value.fvalue + BI.i18nText("BI-Year") + midText  + BI.i18nText("BI-Quarter_De");
            case BICst.YEAR_MONTH:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Month_De");
            case BICst.YEAR_WEEK:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Week_De");
            case BICst.YEAR_DAY:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Day_De");
            case BICst.MONTH_WEEK:
                return value.fvalue + BI.i18nText("BI-Basic_Month") + midText + BI.i18nText("BI-Week_De");
            case BICst.MONTH_DAY:
                return value.fvalue + BI.i18nText("BI-Basic_Month") + midText + BI.i18nText("BI-Day_De");
        }
    },

    setValue: function (v) {
        this.DateParamCombo.setValue(v);
        this.trigger.setValue(this._getShowTextByValue(v));
    },

    setEnable: function (v) {
        BI.DateParamCombo.superclass.setEnable.apply(this, arguments);
        this.DateParamCombo.setEnable(v);
    },

    getValue: function () {
        return this.DateParamCombo.getValue();
    },

    getCalculationValue: function(){
        return this.popup.getCalculationValue();
    }
});
BI.DateParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.date_param_combo", BI.DateParamCombo);