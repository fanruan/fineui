/**
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaCombo
 * @extend BI.Widget
 */
BI.FormulaCombo = BI.inherit(BI.Widget, {

    _constant: {
        POPUP_HEIGHT: 450,
        POPUP_WIDTH: 600,
        POPUP_V_GAP: 10,
        POPUP_H_GAP: 10,
        ADJUST_LENGTH: 2,
        HEIGHT_MAX: 10000,
        MAX_HEIGHT: 500,
        MAX_WIDTH: 600,
        COMBO_TRIGGER_WIDTH: 300
    },

    _defaultConfig: function () {
        return BI.extend(BI.FormulaCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-combo",
            height: 30,
            items: []
        })
    },

    _init: function () {
        BI.FormulaCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.formula_ids = [];
        this.input = BI.createWidget({
            type: "bi.formula_combo_trigger",
            height: o.height,
            items: o.items
        });
        this.formulaPopup = BI.createWidget({
            type: "bi.formula_combo_popup",
            fieldItems: o.items
        });

        this.formulaInputCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: true,
            isNeedAdjustWidth: false,
            adjustLength: this._constant.ADJUST_LENGTH,
            el: this.input,
            popup: {
                el: {
                    type: "bi.absolute",
                    height: this._constant.HEIGHT_MAX,
                    width: this._constant.POPUP_WIDTH,
                    items: [{
                        el: this.formulaPopup,
                        top: this._constant.POPUP_V_GAP,
                        left: this._constant.POPUP_H_GAP,
                        right: this._constant.POPUP_V_GAP,
                        bottom: 0
                    }]
                },
                stopPropagation: false,
                maxHeight: this._constant.MAX_HEIGHT,
                width: this._constant.MAX_WIDTH
            }
        });
        this.formulaInputCombo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.formulaPopup.setValue(self.input.getValue());
        });
        this.formulaPopup.on(BI.FormulaComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.formulaPopup.getValue());
            self.formulaInputCombo.hideView();
            self.fireEvent(BI.FormulaCombo.EVENT_CHANGE);
        });
        this.formulaPopup.on(BI.FormulaComboPopup.EVENT_VALUE_CANCEL, function () {
            self.formulaInputCombo.hideView();
        });
    },

    setValue: function (v) {
        if (this.formulaInputCombo.isViewVisible()) {
            this.formulaInputCombo.hideView();
        }
        this.input.setValue(v);
        this.input.setText(BI.Func.getFormulaStringFromFormulaValue(v));
        this.formulaPopup.setValue(this.input.getValue());
    },

    getFormulaTargetIds: function() {
        return this.formulaPopup.getFormulaTargetIds();
    },

    getValue: function () {
        return this.input.getValue();
    }
});
BI.FormulaCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.formula_combo", BI.FormulaCombo);