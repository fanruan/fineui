Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.button_group",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_NONE,
            layouts: [{
                type: "bi.vertical"
            }, {
                type: "bi.center_adapt",
            }],
            items: [{
                type: "bi.label",
                text: "button_group是一类具有相同属性或相似属性的抽象, 本案例实现的是布局的嵌套(vertical布局下内嵌center_adapt布局)"
            }, {
                type: "bi.button",
                text: "1"
            }]
        }
    }
});
$.shortcut("demo.button_group", Demo.Func);