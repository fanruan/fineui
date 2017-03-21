/**
 * @class BI.YearSeasonParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.YearSeasonParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearSeasonParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-season-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.YearSeasonParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.year_season_param_popup_view",
            maxHeight: 300
        });

        this.popup.on(BI.ParamPopupView.EVENT_CONFIRM, function(){
            self.YearSeasonParamCombo.hideView();
        });

        this.YearSeasonParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.YearSeasonParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.YearSeasonParamCombo.EVENT_CONFIRM);
        });

        this.YearSeasonParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
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
        }
    },

    setValue: function (v) {
        this.YearSeasonParamCombo.setValue(v);
        this.trigger.setValue(this._getShowTextByValue(v));
    },

    setEnable: function (v) {
        BI.YearSeasonParamCombo.superclass.setEnable.apply(this, arguments);
        this.YearSeasonParamCombo.setEnable(v);
    },

    getValue: function () {
        return this.YearSeasonParamCombo.getValue();
        //return BI.extend(this.popup.getCalculationValue(), this.YearSeasonParamCombo.getValue());
    },

    getCalculationValue: function(){
        return this.popup.getCalculationValue();
    }
});
BI.YearSeasonParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.year_season_param_combo", BI.YearSeasonParamCombo);