/**
 * Created by Dailer on 2017/7/11.
 */
Demo.RecordEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.record_editor",
                cls: "editor",
                width: 300,
                watermark: "这个是可以记录输入的"
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.record_editor", Demo.RecordEditor);