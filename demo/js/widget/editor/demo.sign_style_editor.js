/**
 * Created by Dailer on 2017/7/11.
 */
Demo.SignStyleEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.sign_style_editor",
                cls:"layout-bg5",
                value:"12313",
                width: 300
            }],
            vgap:20
        }
    }
})

BI.shortcut("demo.sign_style_editor", Demo.SignStyleEditor);