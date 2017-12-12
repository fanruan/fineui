/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_editor",
                watermark: "这是水印,watermark",
                width: 300
            }, {
                type: "bi.text_editor",
                watermark: "这个不予许空",
                allowBlank: false,
                errorText: "非空!",
                width: 300
            }],
            vgap: 20

        };
    }
});

BI.shortcut("demo.text_editor", Demo.TextEditor);