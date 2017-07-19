/**
 * Created by Dailer on 2017/7/13.
 */
Demo.MultiLayerSelectTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.multilayer_select_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                text: "默认值",
                items: items,
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(self.tree.getValue()[0]);
                },
                width: 300
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.multilayer_select_tree_combo", Demo.MultiLayerSelectTreeCombo);