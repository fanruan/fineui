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
                text: "文本加图标的trigger"
            }, {
                type: "bi.text_trigger",
                text: "这是一个简单的trigger",
                width: 200,
                height: 24
            }],
            hgap: 20,
            vgap: 20
        });
    }
});
BI.shortcut("demo.text_trigger", Demo.Func);