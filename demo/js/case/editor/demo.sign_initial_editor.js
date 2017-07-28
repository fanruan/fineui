/**
 * Created by Dailer on 2017/7/11.
 */
Demo.SignInitialEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    mounted: function () {
        this.editor.setValue({
            value: "123",
            text: "sdga"
        })
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.sign_initial_editor",
                ref: function () {
                    self.editor = this;
                },
                cls: "layout-bg5",
                text: "原始值",
                width: 300
            }],
            vgap: 20

        }
    }
})

BI.shortcut("demo.sign_initial_editor", Demo.SignInitialEditor);