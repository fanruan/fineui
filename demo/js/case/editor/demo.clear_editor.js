/**
 * Created by Dailer on 2017/7/11.
 */
Demo.ClearEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.clear_editor",
                cls: "bi-border",
                width: 300,
                watermark: "这个是带清除按钮的"
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.clear_editor", Demo.ClearEditor);