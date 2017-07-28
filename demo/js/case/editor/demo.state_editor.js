/**
 * Created by Dailer on 2017/7/11.
 */
Demo.StateEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.state_editor",
                value: "123",
                text: "456",
                width: 300
            }],
            vgap: 20

        }
    }
})

BI.shortcut("demo.state_editor", Demo.StateEditor);