Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var tree = BI.createWidget({
            type: "bi.level_tree",
            chooseType: 0,
            items: [{
                id: 1,
                text: "第一项",
                value: 1,
                isParent: true
            }, {
                id: 2,
                text: "第二项",
                value: 2,
                isParent: true
            }, {
                id: 3,
                text: "第三项",
                value: 1,
                isParent: true,
                open: true
            }, {
                id: 4,
                text: "第四项",
                value: 1
            }, {
                id: 11,
                pId: 1,
                text: "子项1",
                value: 11
            }, {
                id: 12,
                pId: 1,
                text: "子项2",
                value: 12
            }, {
                id: 13,
                pId: 1,
                text: "子项3",
                value: 13
            }, {
                id: 21,
                pId: 2,
                text: "子项1",
                value: 21
            }, {
                id: 31,
                pId: 3,
                text: "子项1",
                value: 31
            }, {
                id: 32,
                pId: 3,
                text: "子项2",
                value: 32
            }, {
                id: 33,
                pId: 3,
                text: "子项3",
                value: 33
            }]
        });

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
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", tree.getValue());
                    }
                }
            }]
        });
    }
});
BI.shortcut("demo.level_tree", Demo.Func);
