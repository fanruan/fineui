/**
 * Created by Dailer on 2017/7/13.
 */
Demo.SingleTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.LEVELTREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.single_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                text: "默认值",
                items: items,
                width: 300,
                value: "11"
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(self.tree.getValue()[0]);
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setVlaue (第二级文件1)",
                handler: function () {
                    self.tree.setValue(["2"]);
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.single_tree_combo", Demo.SingleTreeCombo);