Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    mounted: function () {
        this.partTree.stroke({
            keyword: "1"
        });
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                type: "bi.label",
                height: 50,
                text: "先初始化一份数据，然后再异步获取数据的树"
            }, {
                type: "bi.part_tree",
                ref: function (_ref) {
                    self.partTree = _ref;
                },
                paras: {
                    selectedValues: {"1": {}, "2": {"1": {}}}
                },
                itemsCreator: function (op, callback) {
                    if (op.type === BI.TreeView.REQ_TYPE_INIT_DATA) {
                        callback({
                            items: [{
                                id: "1",
                                text: 1,
                                isParent: true,
                                open: true
                            }, {
                                id: "11",
                                pId: "1",
                                text: 11,
                                isParent: true,
                                open: true
                            }, {
                                id: "111",
                                pId: "11",
                                text: 111,
                                isParent: true
                            }, {
                                id: "2",
                                text: 2
                            }, {
                                id: "3",
                                text: 3
                            }],
                            hasNext: BI.isNull(op.id)
                        });
                        return;
                    }
                    callback({
                        items: [{
                            id: (op.id || "") + "1",
                            pId: op.id,
                            text: 1,
                            isParent: true
                        }, {
                            id: (op.id || "") + "2",
                            pId: op.id,
                            text: 2
                        }, {
                            id: (op.id || "") + "3",
                            pId: op.id,
                            text: 3
                        }],
                        hasNext: BI.isNull(op.id)
                    });
                }
            }]
        };

    }
});
BI.shortcut("demo.part_tree", Demo.Func);