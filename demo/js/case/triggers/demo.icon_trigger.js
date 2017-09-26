Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.label",
                text: "只有一个图标的trigger"
            }, {
                type: "bi.icon_trigger",
                width: 30,
                height: 30
            }],
            hgap: 20,
            vgap: 20
        })
    }
});
BI.shortcut("demo.icon_trigger", Demo.Func);