Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.button_tree",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
            layouts: [{
                type: "bi.vertical"
            }, {
                type: "bi.center_adapt"
            }],
            items: [{
                type: "bi.label",
                text: "0",
                value: 0
            }, {
                type: "bi.button",
                text: "1",
                value: 1
            }]
        };
    }
});
BI.shortcut("demo.button_tree", Demo.Func);