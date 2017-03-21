/**
 * @class BI.YearParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.YearParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.YearParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });

        this.popup = BI.createWidget({
            type: 'bi.multi_popup_view',
            el: {
                type: "bi.button_tree",
                chooseType: BI.Selection.None,
                items: [{
                    type: "bi.year_param_item"
                }],
                layouts: [{
                    type: "bi.vertical",
                    vgap: 5,
                    hgap: 5
                }]
            },
            minWidth: 310,
            maxHeight: 300,
            stopPropagation: false
        });

        this.popup.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function () {
            self.YearParamCombo.hideView();
        });

        this.YearParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.YearParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.YearParamCombo.EVENT_CONFIRM);
        });

        this.YearParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.setValue(self.getValue());
        });
    },

    _getShowTextByValue: function(v){
        v = v || {};
        return v.fvalue + BI.i18nText("BI-Year") +
            (v.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
            BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Year_Fen");
    },

    getCalculationValue: function () {
        var value = this.YearParamCombo.getValue()[0];
        var fPrevOrAfter = value.foffset === 0 ? -1 : 1;
        var start = new Date((new Date().getFullYear() + fPrevOrAfter * value.fvalue), 0, 1);
        var end = new Date(start.getFullYear(), 11, 31);
        return {
            start: start,
            end: end
        };
    },

    setValue: function (v) {
        v = v || {};
        this.YearParamCombo.setValue(v.value);
        this.trigger.setValue(this._getShowTextByValue(v.value));
    },

    getValue: function () {
        return {
            type: BICst.YEAR,
            value: this.YearParamCombo.getValue()[0]
        }
    }

});
BI.YearParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.year_param_combo", BI.YearParamCombo);