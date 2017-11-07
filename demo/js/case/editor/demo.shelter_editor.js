/**
 * Created by Dailer on 2017/7/11.
 */
Demo.ClearEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.shelter_editor",
            cls: "bi-border",
            validationChecker: function (v) {
                return v != "a";
            },
            watermark: "可以设置标记的输入框",
            text: "这是一个遮罩"
        })
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            hgap: 30,
            vgap: 20,
            bgap: 50,
            items: [editor]
        })
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.button",
                    text: "focus",
                    height: 25,
                    handler: function () {
                        editor.focus();
                    }
                },
                right: 10,
                left: 10,
                bottom: 10
            }]
        })
    }
})

BI.shortcut("demo.shelter_editor", Demo.ClearEditor);