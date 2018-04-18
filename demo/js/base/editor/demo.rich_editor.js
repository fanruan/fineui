Demo.RichEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-rich-editor"
    },
    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.rich_editor",
                    cls: "bi-border",
                    ref: function () {
                        self.editor = this;
                    }
                },
                left: 10,
                top: 10,
                bottom: 10,
                right: 10
            }]
        });
    },

    mounted: function () {
        var image = BI.DOM.getImage("测试");
        var src = image.src;
        var style = image.style;
        this.editor.setValue("<div>这是一条<font size=\"4\" color=\"#009de3\">测试</font>数据<img class=\"rich-editor-param\" width='" + image.width + "' height='" + image.height + "' src='" + src + "' style='" + style + "' /></div>");
        this.editor.setBackColor("#aacf53");
    }
});
BI.shortcut("demo.rich_editor", Demo.RichEditor);