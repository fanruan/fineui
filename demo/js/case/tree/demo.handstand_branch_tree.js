Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createHandStandBranchTree: function () {
        var tree = BI.createWidget({
            type: "bi.handstand_branch_tree",
            expander: {},
            el: {
                layouts: [{
                    type: "bi.horizontal_adapt",
                    verticalAlign: BI.VerticalAlign.Top
                }]
            },
            items: [{
                el: {
                    text: "且",
                    value: "且1",
                    cls: "layout-bg7"
                },
                children: [{
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1",
                    value: "这里是一段文字1"
                }, {
                    el: {
                        text: "或",
                        value: "或2",
                        cls: "layout-bg7"
                    },
                    children: [{
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字1435",
                        value: "这里是一段文字1435"
                    }, {
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字1xx",
                        value: "这里是一段文字1xx"
                    }, {
                        el: {
                            text: "且",
                            value: "且3",
                            cls: "layout-bg7"
                        },
                        children: [{
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件",
                            value: "可以理解为一个条件"
                        }, {
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件v",
                            value: "可以理解为一个条件v"
                        }]
                    }]
                }, {
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1xa",
                    value: "这里是一段文字1xa"
                }]
            }]
        });
        return tree;
    },

    render: function () {
        var tree = this._createHandStandBranchTree();

        BI.createWidget({
            type: "bi.center",
            element: this,
            items: [{
                type: "bi.vtape",
                items: [{
                    el: tree
                }, {
                    height: 30,
                    el: {
                        type: "bi.button",
                        height: 30,
                        text: "getValue",
                        handler: function () {
                            BI.Msg.alert("", tree.getValue());
                        }
                    }
                }]
            }]
        })
    }
});
$.shortcut("demo.handstand_branch_tree", Demo.Func);