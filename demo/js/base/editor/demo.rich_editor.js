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
                    height: "100%",
                    cls: "bi-border",
                    disabled: true,
                    ref: function () {
                        self.editor = this;
                    },
                    toolbar: {
                        type: "bi.rich_editor_text_toolbar",
                        buttons: [
                            {type: "bi.rich_editor_font_chooser"},
                            {type: "bi.rich_editor_size_chooser"},
                            {type: "bi.rich_editor_bold_button"},
                            {type: "bi.rich_editor_italic_button"},
                            {type: "bi.rich_editor_underline_button"},
                            {type: "bi.rich_editor_color_chooser"},
                            {
                                type: "bi.rich_editor_background_color_chooser",
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function (backgroundColor) {
                                        self.editor.element.css({
                                            backgroundColor: backgroundColor,
                                            color: BI.DOM.getContrastColor(backgroundColor)
                                        });
                                    }
                                }]
                            },
                            {type: "bi.rich_editor_align_left_button"},
                            {type: "bi.rich_editor_align_center_button"},
                            {type: "bi.rich_editor_align_right_button"},
                            {type: "bi.rich_editor_param_button"}
                        ]
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
    }
});
BI.shortcut("demo.rich_editor", Demo.RichEditor);