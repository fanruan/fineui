/**
 * Created by Dailer on 2017/7/13.
 */
Demo.MultiTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.multi_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                itemsCreator: function (options, callback) {
                    console.log(options);
                    // 根据不同的类型处理相应的结果
                    switch (options.type) {
                        case BI.TreeView.REQ_TYPE_INIT_DATA:
                            break;
                        case BI.TreeView.REQ_TYPE_ADJUST_DATA:
                            break;
                        case BI.TreeView.REQ_TYPE_SELECT_DATA:
                            break;
                        case BI.TreeView.REQ_TYPE_GET_SELECTED_DATA:
                            break;
                        default :
                            break;
                    }
                    callback({
                        items: items
                    });
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.tree.getValue()));
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.multi_tree_combo", Demo.MultiTreeCombo);