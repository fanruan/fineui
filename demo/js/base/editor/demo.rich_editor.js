Demo.RichEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-rich-editor"
    },
    render: function () {
        this.editor = BI.createWidget({
            type: "bi.rich_editor",
            cls: "mvc-border",
            width: 600,
            height: 400
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            hgap: 30,
            vgap: 50,
            items: [this.editor]
        })
    },

    mounted: function(){
        this.editor.setValue('这是一条<font size="4" color="#009de3">测试</font>数据')
    }
});
BI.shortcut("demo.rich_editor", Demo.RichEditor);