Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    mounted: function () {
        this.syncTree.stroke({
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
                text: "可以异步获取数据的树"
            }, {
                type: "bi.async_tree",
                ref: function (_ref) {
                    self.syncTree = _ref;
                },
                paras: {
                    selectedValues: {"1": {}, "2": {"1": {}}}
                },
                itemsCreator: function (op, callback) {
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
BI.shortcut("demo.sync_tree", Demo.Func);