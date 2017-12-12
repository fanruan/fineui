/**
 * guy
 * 二级树
 * @class BI.PlatformLevelTree
 * @extends BI.Select
 */
BI.PlatformLevelTree = BI.inherit(BI.Widget, {
    props: {
        baseCls: "platform-level-tree",
        itemsCreator: BI.emptyFn
    },

    render: function () {
        var self = this, o = this.options;
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: {
                type: "bi.select_tree_expander",
                isDefaultInit: false,
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (items) {
                    callback(self._formatItems(items));
                });
            },

            el: {
                type: "bi.loader",
                next: false,
                el: {
                    type: "bi.button_tree",
                    chooseType: 0,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            }
        });
        this.tree.on(BI.CustomTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.PlatformLevelTree.EVENT_CHANGE, arguments);
        });
    },

    _formatItems: function (nodes) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {};
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.multilayer_select_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.multilayer_select_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.multilayer_select_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.multilayer_single_tree_last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.multilayer_single_tree_mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    populate: function () {
        this.tree.populate();
    },

    getValue: function () {
        return this.tree.getValue();
    }
});
BI.PlatformLevelTree.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.platform_level_tree", BI.PlatformLevelTree);


BI.DemoLevelTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                el: {
                    type: "bi.platform_level_tree",
                    ref: function () {
                        self.tree = this;
                    },
                    itemsCreator: function (op, callback) {
                        if (!op.node) {// 根节点
                            callback([{
                                id: 1,
                                pId: 0,
                                text: "A",
                                value: 1,
                                isParent: true
                            }, {
                                id: 2,
                                pId: 0,
                                text: "B",
                                value: 2,
                                isParent: true,
                                open: true
                            }]);
                        } else {
                            if (op.node.id == 1) {
                                callback([
                                    {
                                        id: 11,
                                        pId: 1,
                                        text: "test11",
                                        value: 11,
                                        layer: 1,
                                        isParent: true
                                    },
                                    {
                                        id: 12,
                                        pId: 1,
                                        text: "test12",
                                        value: 12,
                                        layer: 1
                                    },
                                    {
                                        id: 13,
                                        pId: 1,
                                        text: "test13",
                                        value: 13,
                                        layer: 1
                                    },
                                    {
                                        id: 14,
                                        pId: 1,
                                        text: "test14",
                                        value: 14,
                                        layer: 1,
                                        height: 35
                                    },
                                    {
                                        id: 15,
                                        pId: 1,
                                        text: "test15",
                                        value: 15,
                                        layer: 1
                                    },
                                    {
                                        id: 16,
                                        pId: 1,
                                        text: "test16",
                                        value: 16,
                                        layer: 1
                                    },
                                    {id: 17, pId: 1, text: "test17", layer: 1, value: 17}
                                ]);
                            } else if (op.node.id == 2) {
                                callback([{
                                    id: 21,
                                    pId: 2,
                                    text: "test21",
                                    value: 21,
                                    layer: 1
                                },
                                {
                                    id: 22,
                                    pId: 2,
                                    text: "test22",
                                    value: 22,
                                    layer: 1
                                }]);
                            } else if (op.node.id == 11) {
                                callback([{
                                    id: 111,
                                    pId: 11,
                                    text: "test111",
                                    value: 111,
                                    layer: 2
                                }]);
                            }
                        }
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "确定",
                    handler: function () {
                        BI.Msg.toast(JSON.stringify(self.tree.getValue()));
                    }
                },
                height: 25
            }]

        };
    },

    mounted: function () {

    }
});
BI.shortcut("demo.platform_level_tree", BI.DemoLevelTree);