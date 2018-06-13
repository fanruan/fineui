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
                text: "输入框加图标的trigger"
            }, {
                type: "bi.editor_trigger",
                watermark: "这是水印",
                width: 200,
                height: 24
            }],
            hgap: 20,
            vgap: 20
        });
    }
});
BI.shortcut("demo.editor_trigger", Demo.Func);