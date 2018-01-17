Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        // value值一定要是字符串
        var tree = BI.createWidget({
            type: "bi.simple_tree",
            items: [{
                id: 1,
                text: "第一项",
                value: "1"
            }, {
                id: 2,
                text: "第二项",
                value: "2"
            }, {
                id: 3,
                text: "第三项",
                value: "3",
                open: true
            }, {
                id: 11,
                pId: 1,
                text: "子项1",
                value: "11"
            }, {
                id: 12,
                pId: 1,
                text: "子项2",
                value: "12"
            }, {
                id: 13,
                pId: 1,
                text: "子项3",
                value: "13"
            }, {
                id: 31,
                pId: 3,
                text: "子项1",
                value: "31"
            }, {
                id: 32,
                pId: 3,
                text: "子项2",
                value: "32"
            }, {
                id: 33,
                pId: 3,
                text: "子项3",
                value: "33"
            }],
            value: ["31", "32", "33"]
        });

        // tree.populate([{
        //     id: 1,
        //     text: "第一项",
        //     value: "1"
        // }, {
        //     id: 2,
        //     text: "第二项",
        //     value: "2"
        // }, {
        //     id: 3,
        //     text: "第三项",
        //     value: "3",
        //     open: true
        // }, {
        //     id: 11,
        //     pId: 1,
        //     text: "子项1",
        //     value: "11"
        // }, {
        //     id: 12,
        //     pId: 1,
        //     text: "子项2",
        //     value: "12"
        // }, {
        //     id: 13,
        //     pId: 1,
        //     text: "子项3",
        //     value: "13"
        // }, {
        //     id: 31,
        //     pId: 3,
        //     text: "子项1",
        //     value: "31"
        // }, {
        //     id: 32,
        //     pId: 3,
        //     text: "子项2",
        //     value: "32"
        // }, {
        //     id: 33,
        //     pId: 3,
        //     text: "子项3",
        //     value: "33"
        // }], "z");
        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: tree
            }, {
                height: 30,
                el: {
                    type: "bi.button",
                    height: 30,
                    text: "setValue(['31', '32', '33'])",
                    handler: function () {
                        tree.setValue(["31", "32", "33"]);
                    }
                }
            }, {
                height: 30,
                el: {
                    type: "bi.button",
                    height: 30,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", JSON.stringify(tree.getValue()));
                    }
                }
            }]
        });
    }
});
BI.shortcut("demo.simple_tree", Demo.Func);