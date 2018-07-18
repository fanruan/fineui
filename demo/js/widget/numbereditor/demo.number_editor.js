/* 文件管理导航
 Created by dailer on 2017 / 7 / 21.
 */
Demo.FileManager = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var editor = BI.createWidget({
            type: "bi.number_editor",
            validationChecker: function (v) {
                return BI.parseFloat(v) <= 100 && BI.parseFloat(v) >= 0;
            },
            height: 24,
            width: 150,
            errorText: "hahah"
        });
        editor.on(BI.NumberEditor.EVENT_CHANGE, function () {
            if (BI.parseFloat(this.getValue()) < 1) {
                editor.setDownEnable(false);
            } else {
                editor.setDownEnable(true);
            }
            BI.Msg.toast(editor.getValue());
        });
        return {
            type: "bi.vertical",
            items: [{
                el: editor,
                height: 24
            }]
        };
    }
});
BI.shortcut("demo.number_editor", Demo.FileManager);