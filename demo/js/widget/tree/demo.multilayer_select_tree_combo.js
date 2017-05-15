/**
 * Created by User on 2017/3/22.
 */
Demo.MultiSelectCombo = BI.inherit(BI.Widget, {
    props: {},

    render: function (vessel) {
        var TREEWITHCHILDREN = [{
            id: -1, value: "根目录", text: "根目录", children: [
                {
                    id: 1, value: "第一级目录1", text: "第一级目录1", children: [
                    {id: 11, value: "第二级文件1", text: "第二级文件1"},
                    {
                        id: 12, value: "第二级目录2", text: "第二级目录2", children: [
                        {
                            id: 121, value: "第三级目录1", text: "第三级目录1", children: [
                            {
                                id: 1211, value: "第四级目录1", text: "第四级目录1", children: [
                                {id: 12111, value: "第五级文件1", text: "第五级文件1"}
                            ]
                            }
                        ]
                        },
                        {id: 122, value: "第三级文件1", text: "第三级文件1"}
                    ]
                    }
                ]
                },
                {
                    id: 2, value: "第一级目录2", text: "第一级目录2", children: [
                    {
                        id: 21, value: "第二级目录3", text: "第二级目录3", children: [
                        {
                            id: 211, value: "第三级目录2", text: "第三级目录2", children: [
                            {id: 2111, value: "第四级文件1", text: "第四级文件1"}
                        ]
                        },
                        {id: 212, value: "第三级文件2", text: "第三级文件2"}
                    ]
                    },
                    {id: 22, value: "第二级文件2", text: "第二级文件2"}
                ]
                }
            ]
        }];
        var items = BI.deepClone(TREEWITHCHILDREN);
        var combo = BI.createWidget({
            type: "bi.multilayer_select_tree_combo",
            itemsCreator: function (op, callback) {
                debugger;
            }
        });

        combo.populate();
        return {
            type: "bi.vertical",
            items: [combo, {
                type: "bi.button",
                width: 100,
                text: "getValue",
                handler: function () {
                    BI.Msg.alert("", JSON.stringify(combo.getValue()));
                }
            }],
            vgap: 100
        }
    }
});
BI.shortcut("demo.multilayer_select_tree_combo", Demo.MultiSelectCombo);