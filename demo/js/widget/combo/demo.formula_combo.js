/**
 * Created by Dailer on 2017/7/12.
 */
Demo.FormulaCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {

        var self = this;


        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.formula_combo",
                fieldItems: [{
                    text: "A",
                    value: "A",
                    fieldType: 16
                }],
                width: 200,
                height: 30
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.formula_combo", Demo.FormulaCombo);