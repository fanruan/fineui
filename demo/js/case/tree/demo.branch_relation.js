Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var relation = BI.createWidget({
            type: "bi.branch_relation",
            items: [
                {
                    id: -1,
                    value: "根目录",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 1,
                    pId: -1,
                    value: "第一级目录1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 11,
                    pId: 1,
                    value: "第二级文件1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 12,
                    pId: 1,
                    value: "第二级目录1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 121,
                    pId: 12,
                    value: "第三级目录1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 122,
                    pId: 12,
                    value: "第三级文件1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 1211,
                    pId: 121,
                    value: "第四级目录",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 12111,
                    pId: 1211,
                    value: "第五级文件1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 2,
                    pId: -1,
                    value: "第一级目录2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 21,
                    pId: 2,
                    value: "第二级目录2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 22,
                    pId: 2,
                    value: "第二级文件2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 211,
                    pId: 21,
                    value: "第三级目录2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 212,
                    pId: 21,
                    value: "第三级文件2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 2111,
                    pId: 211,
                    value: "第四级文件2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                }
            ],

            direction: BI.Direction.Right,
            align: BI.HorizontalAlign.Right,

            centerOffset: -50
        });
        BI.createWidget({
            type: "bi.adaptive",
            element: this,
            items: [relation]
        });
    }
});
BI.shortcut("demo.branch_relation", Demo.Func);