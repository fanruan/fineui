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
                text: "可被选择的trigger"
            }, {
                type: "bi.select_text_trigger",
                text: "这是一个简单的trigger",
                width: 200,
                height: 30
            }],
            hgap: 20,
            vgap: 20
        })
    }
});
BI.shortcut("demo.select_text_trigger", Demo.Func);