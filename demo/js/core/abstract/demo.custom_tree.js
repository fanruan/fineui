Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createDefaultTree: function () {
        var TREEITEMS = [{id: -1, pId: -2, value: "根目录", open: true, type: "bi.plus_group_node", height: 25},
            {id: 1, pId: -1, value: "第一级目录1", type: "bi.plus_group_node", height: 25},
            {id: 11, pId: 1, value: "第二级文件1", type: "bi.single_select_item", height: 25},
            {id: 12, pId: 1, value: "第二级目录2", type: "bi.plus_group_node", height: 25},
            {id: 121, pId: 12, value: "第三级目录1", type: "bi.plus_group_node", height: 25},
            {id: 122, pId: 12, value: "第三级文件1", type: "bi.single_select_item", height: 25},
            {id: 1211, pId: 121, value: "第四级目录1", type: "bi.plus_group_node", height: 25},
            {id: 12111, pId: 1211, value: "第五级文件1", type: "bi.single_select_item", height: 25},
            {id: 2, pId: -1, value: "第一级目录2", type: "bi.plus_group_node", height: 25},
            {id: 21, pId: 2, value: "第二级目录3", type: "bi.plus_group_node", height: 25},
            {id: 22, pId: 2, value: "第二级文件2", type: "bi.single_select_item", height: 25},
            {id: 211, pId: 21, value: "第三级目录2", type: "bi.plus_group_node", height: 25},
            {id: 212, pId: 21, value: "第三级文件2", type: "bi.single_select_item", height: 25},
            {id: 2111, pId: 211, value: "第四级文件1", type: "bi.single_select_item", height: 25}];
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            el: {
                type: "bi.button_tree",
                chooseType: 0,
                layouts: [{
                    type: "bi.vertical",
                    hgap: 30
                }]
            },
            items: BI.deepClone(TREEITEMS)
        });
        return this.tree;
    },

    _createAsyncTree: function () {
        this.asyncTree = BI.createWidget({
            type: "bi.custom_tree",
            itemsCreator: function (op, callback) {
                if (!op.node) {// 根节点
                    callback([{
                        id: 1,
                        pId: 0,
                        type: "bi.plus_group_node",
                        text: "test1",
                        value: 1,
                        height: 25,
                        isParent: true
                    }, {
                        id: 2,
                        pId: 0,
                        type: "bi.plus_group_node",
                        text: "test2",
                        value: 1,
                        isParent: true,
                        open: true,
                        height: 25
                    }]);
                } else {
                    if (op.node.id == 1) {
                        callback([
                            {
                                id: 11,
                                pId: 1,
                                type: "bi.plus_group_node",
                                text: "test11",
                                value: 11,
                                height: 25,
                                isParent: true
                            },
                            {
                                id: 12,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test12",
                                value: 12,
                                height: 35
                            },
                            {
                                id: 13,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test13",
                                value: 13,
                                height: 35
                            },
                            {
                                id: 14,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test14",
                                value: 14,
                                height: 35
                            },
                            {
                                id: 15,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test15",
                                value: 15,
                                height: 35
                            },
                            {
                                id: 16,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test16",
                                value: 16,
                                height: 35
                            },
                            {id: 17, pId: 1, type: "bi.single_select_item", text: "test17", value: 17, height: 35}
                        ]);
                    } else if (op.node.id == 2) {
                        callback([{
                            id: 21,
                            pId: 2,
                            type: "bi.single_select_item",
                            text: "test21",
                            value: 21,
                            height: 35
                        },
                        {
                            id: 22,
                            pId: 2,
                            type: "bi.single_select_item",
                            text: "test22",
                            value: 22,
                            height: 35
                        }]);
                    } else if (op.node.id == 11) {
                        callback([{
                            id: 111,
                            pId: 11,
                            type: "bi.single_select_item",
                            text: "test111",
                            value: 111,
                            height: 35
                        }]);
                    }
                }
            },
            el: {
                type: "bi.loader",
                next: false,
                el: {
                    type: "bi.button_tree",
                    chooseType: 0,
                    layouts: [{
                        type: "bi.vertical",
                        hgap: 30,
                        vgap: 0
                    }]
                }
            }
        });
        return this.asyncTree;
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.grid",
            columns: 2,
            rows: 1,
            element: this,
            items: [{
                column: 0,
                row: 0,
                el: {
                    type: "bi.vtape",
                    items: [
                        {
                            el: this._createDefaultTree()
                        },
                        {
                            el: {
                                type: "bi.center",
                                hgap: 10,
                                items: [{
                                    type: "bi.text_button",
                                    cls: "mvc-button layout-bg2",
                                    text: "getValue",
                                    height: 30,
                                    handler: function () {
                                        BI.Msg.alert("", JSON.stringify(self.tree.getValue()));
                                    }
                                }, {
                                    type: "bi.text_button",
                                    cls: "mvc-button layout-bg2",
                                    text: "getNodeByValue(第一级目录1)",
                                    height: 30,
                                    handler: function () {
                                        BI.Msg.alert("", "节点名称为: " + self.tree.getNodeByValue("第一级目录1").getValue());
                                    }
                                }]
                            },
                            height: 30
                        }
                    ]
                }
            }, {
                column: 1,
                row: 0,
                el: {
                    type: "bi.vtape",
                    items: [
                        {
                            type: "bi.label",
                            text: "异步加载数据",
                            height: 30
                        },
                        {
                            el: this._createAsyncTree()
                        },
                        {
                            el: {
                                type: "bi.center",
                                hgap: 10,
                                items: [{
                                    type: "bi.text_button",
                                    cls: "mvc-button layout-bg2",
                                    text: "getValue",
                                    height: 30,
                                    handler: function () {
                                        BI.Msg.alert("", JSON.stringify(self.asyncTree.getValue()));
                                    }
                                }, {
                                    type: "bi.text_button",
                                    cls: "mvc-button layout-bg2",
                                    text: "getNodeById(11)",
                                    height: 30,
                                    handler: function () {
                                        BI.Msg.alert("", "节点名称为: " + (self.asyncTree.getNodeById(11) && self.asyncTree.getNodeById(11).getText()));
                                    }
                                }]
                            },
                            height: 30
                        }
                    ]
                }
            }]
        });
    }
});
BI.shortcut("demo.custom_tree", Demo.Func);