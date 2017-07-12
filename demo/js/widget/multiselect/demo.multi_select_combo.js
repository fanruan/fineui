/**
 * Created by Dailer on 2017/7/12.
 */
Demo.MultiSelectCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.multi_select_combo",
                ref: function (_ref) {
                    self.numerical = _ref;
                },
                itemsCreator:BI.emptyFn
            }, {
                type: "bi.label",
                ref: function (_ref) {
                    self.label = _ref;
                },
                text: "显示结果"
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.musdflti_select_combo", Demo.MultiSelectCombo);