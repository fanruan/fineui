/**
 * Created by Dailer on 2017/7/13.
 */
Demo.SingleTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.single_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                text: "默认值",
                items: [{
                    id: 1,
                    text: "第一项",
                    value: 1,
                    isParent: true,
                    title: "第一项"
                }, {
                    id: 2,
                    text: "第二项",
                    value: 1,
                    isParent: true,
                    title: "第二项"
                }, {
                    id: 3,
                    text: "第三项",
                    value: 1,
                    isParent: true,
                    open: true,
                    title: "第三项"
                }, {
                    id: 4,
                    text: "第四项",
                    value: 1,
                    isParent: true,
                    title: "第四项"
                }, {
                    id: 5,
                    text: "第五项",
                    value: 1,
                    isParent: true,
                    title: "第五项"
                }, {
                    id: 6,
                    text: "第六项",
                    value: 1,
                    isParent: true,
                    open: true,
                    title: "第六项"
                }, {
                    id: 7,
                    text: "第七项",
                    value: 1,
                    isParent: true,
                    open: true,
                    title: "第七项"
                }, {
                    id: 11,
                    pId: 1,
                    text: "子项1",
                    value: 11,
                    title: "子项1"
                }, {
                    id: 12,
                    pId: 1,
                    text: "子项2",
                    value: 12,
                    title: "子项2"
                }, {
                    id: 13,
                    pId: 1,
                    text: "子项3",
                    value: 13,
                    title: "子项3"
                }, {
                    id: 21,
                    pId: 2,
                    text: "子项1",
                    value: 21,
                    title: "子项1"
                }, {
                    id: 22,
                    pId: 2,
                    text: "子项2",
                    value: 22,
                    title: "子项2"
                }, {
                    id: 31,
                    pId: 3,
                    text: "子项1",
                    value: 31,
                    title: "子项1"
                }, {
                    id: 32,
                    pId: 3,
                    text: "子项2",
                    value: 32,
                    title: "子项2"
                }, {
                    id: 33,
                    pId: 3,
                    text: "子项3",
                    value: 33,
                    title: "子项3"
                }, {
                    id: 41,
                    pId: 4,
                    text: "子项1",
                    value: 41,
                    title: "子项1"
                }, {
                    id: 42,
                    pId: 4,
                    text: "子项2",
                    value: 42,
                    title: "子项2"
                }, {
                    id: 43,
                    pId: 4,
                    text: "子项3",
                    value: 43,
                    title: "子项3"
                }, {
                    id: 51,
                    pId: 5,
                    text: "子项1",
                    value: 51,
                    title: "子项1"
                }, {
                    id: 52,
                    pId: 5,
                    text: "子项2",
                    value: 52,
                    title: "子项2"
                }, {
                    id: 61,
                    pId: 6,
                    text: "子项1",
                    value: 61,
                    title: "子项1"
                }, {
                    id: 62,
                    pId: 6,
                    text: "子项2",
                    value: 62,
                    title: "子项2"
                }, {
                    id: 71,
                    pId: 7,
                    text: "子项1",
                    value: 71,
                    title: "子项1"
                }, {
                    id: 72,
                    pId: 7,
                    text: "子项2",
                    value: 72,
                    title: "子项2"
                }],
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(self.tree.getValue()[0]);
                },
                width: 300
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.single_tree_combo", Demo.SingleTreeCombo);