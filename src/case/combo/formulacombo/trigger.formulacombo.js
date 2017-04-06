/**
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaComboTrigger
 * @extend BI.Widget
 */
BI.FormulaComboTrigger = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FormulaComboTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-combo-trigger",
            height: 30,
            items: []
        })
    },

    _init: function () {
        BI.FormulaComboTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.label = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            textHeight: this.options.height,
            lgap: 10
        });
    },

    _getTextFromFormulaValue: function (formulaValue) {
        var self = this;
        var formulaString = "";
        var regx = /\$[\{][^\}]*[\}]|\w*\w|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)/g;
        var result = formulaValue.match(regx);
        BI.each(result, function (i, item) {
            var fieldRegx = /\$[\{][^\}]*[\}]/;
            var str = item.match(fieldRegx);
            if (BI.isNotEmptyArray(str)) {
                var id = str[0].substring(2, item.length - 1);
                var item = BI.find(self.options.items, function (i, item) {
                    return id === item.value;
                });
                formulaString = formulaString + item.text;
            } else {
                formulaString = formulaString + item;
            }
        });
        return formulaString;
    },

    getValue: function () {
        return this.options.value;
    },

    setValue: function (v) {
        this.options.value = v;
        this.label.setText(this._getTextFromFormulaValue(v));
    }
});
BI.shortcut("bi.formula_combo_trigger", BI.FormulaComboTrigger);