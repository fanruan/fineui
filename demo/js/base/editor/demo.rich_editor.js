Demo.RichEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-rich-editor"
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.rich_editor",
            cls: "mvc-border",
            width: 600,
            height: 400
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            hgap: 30,
            vgap: 20,
            items: [editor]
        })
    }
});
BI.shortcut("demo.rich_editor", Demo.RichEditor);