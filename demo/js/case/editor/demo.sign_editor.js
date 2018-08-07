/**
 * Created by Dailer on 2017/7/14.
 */
Demo.SignEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.sign_editor",
            cls: "bi-border bi-focus-shadow",
            validationChecker: function (v) {
                return v != "abc";
            },
            watermark: "可以设置标记的输入框",
            text: "这是一个标记，点击它即可进行输入"
        });
        editor.setValue(2);
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            hgap: 30,
            vgap: 20,
            items: [editor]
        });
    }
});

BI.shortcut("demo.sign_editor", Demo.SignEditor);