/**
 * Created by Dailer on 2017/7/13.
 */
Demo.MultiTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    mounted: function () {
        this.tree.populate();
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.multi_select_tree",
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
                            items: BI.deepClone(items)
                        });
                    },
                    width: 300,
                    value: {
                        "根目录": {}
                    }
                },
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }, {
                el: {
                    type: "bi.button",
                    height: 30,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.toast(JSON.stringify(self.tree.getValue()));
                    }
                },
                left: 50,
                right: 50,
                bottom: 20
            }]
        };
    }
});

BI.shortcut("demo.multi_select_tree", Demo.MultiTreeCombo);