/**
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaComboPopup
 * @extend BI.Widget
 */
BI.FormulaComboPopup = BI.inherit(BI.Widget, {

    _constant: {
        BUTTON_HEIGHT: 30,
        SOUTH_HEIGHT: 60,
        SOUTH_H_GAP: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.FormulaComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-pane-popup"
        })
    },

    _init: function () {
        BI.FormulaComboPopup.superclass._init.apply(this, arguments);
        this.populate();
    },

    populate: function () {
        var self = this, fieldItems = this.options.fieldItems;
        this.formula = BI.createWidget({
            type: "bi.formula_insert"
        });
        this.formula.populate(fieldItems);
        var confirmButton = BI.createWidget({
            type: "bi.button",
            level: "common",
            height: this._constant.BUTTON_HEIGHT,
            text: BI.i18nText("BI-Basic_OK")
        });
        var cancelButton = BI.createWidget({
            type: "bi.button",
            level: "ignore",
            height: this._constant.BUTTON_HEIGHT,
            text: BI.i18nText("BI-Basic_Cancel")
        });

        this.formula.on(BI.FormulaInsert.EVENT_CHANGE, function () {
            confirmButton.setEnable(self.formula.checkValidation());
        });
        confirmButton.on(BI.Button.EVENT_CHANGE, function () {
            self.fireEvent(BI.FormulaComboPopup.EVENT_CHANGE);
        });
        cancelButton.on(BI.Button.EVENT_CHANGE, function () {
            self.setValue(self.oldValue);
            self.fireEvent(BI.FormulaComboPopup.EVENT_VALUE_CANCEL);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.formula,
                height: "fill"
            }, {
                el: {
                    type: "bi.right_vertical_adapt",
                    height: this._constant.SOUTH_HEIGHT,
                    items: [cancelButton, confirmButton],
                    hgap: this._constant.SOUTH_H_GAP
                },
                height: this._constant.SOUTH_HEIGHT
            }]
        })
    },

    getFormulaTargetIds: function(){
        return this.formula.getUsedFields();
    },

    getValue: function () {
        return this.formula.getValue();
    },

    setValue: function (v) {
        this.oldValue = v;
        this.formula.setValue(v);
    }
});
BI.FormulaComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.FormulaComboPopup.EVENT_VALUE_CANCEL = "EVENT_VALUE_CANCEL";
BI.shortcut("bi.formula_combo_popup", BI.FormulaComboPopup);