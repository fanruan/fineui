/**
 * Created by Dailer on 2017/7/11.
 */
Demo.SignInitialEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.sign_initial_editor",
                cls:"layout-bg5",
                value:"123",
                text:"456",
                width: 300
            }],
            vgap:20

        }
    }
})

BI.shortcut("demo.sign_initial_editor", Demo.SignInitialEditor);