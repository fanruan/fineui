Demo.Editor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        var editor1 = BI.createWidget({
            type: "bi.editor",
            cls: "mvc-border",
            watermark: "alert信息显示在下面",
            errorText: "字段不可重名!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
            width: 200,
            height: 30
        });
        editor1.on(BI.Editor.EVENT_ENTER, function () {
            editor1.blur();
        });
        var editor2 = BI.createWidget({
            type: "bi.editor",
            cls: "mvc-border",
            watermark: "输入'a'会有错误信息",
            disabled: true,
            errorText: "字段不可重名",
            validationChecker: function (v) {
                if (v == "a") {
                    return false;
                }
                return true;
            },
            allowBlank: true,
            width: 200,
            height: 30
        });
        var editor3 = BI.createWidget({
            type: "bi.editor",
            cls: "mvc-border",
            watermark: "输入'a'会有错误信息且回车键不能退出编辑",
            errorText: "字段不可重名",
            validationChecker: function (v) {
                if (v == "a") {
                    return false;
                }
                return true;
            },
            quitChecker: function (v) {
                return false;
            },
            allowBlank: true,
            width: 300,
            height: 30
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: editor1,
                left: 0,
                top: 0
            }, {
                el: editor2,
                left: 250,
                top: 30
            }, {
                el: editor3,
                left: 500,
                top: 60
            }, {
                el: {
                    type: "bi.button",
                    text: "disable",
                    handler: function () {
                        editor1.setEnable(false);
                        editor2.setEnable(false);
                        editor3.setEnable(false);
                    },
                    height: 30
                },
                left: 100,
                bottom: 60
            }, {
                el: {
                    type: "bi.button",
                    text: "enable",
                    handler: function () {
                        editor1.setEnable(true);
                        editor2.setEnable(true);
                        editor3.setEnable(true);
                    },
                    height: 30
                },
                left: 200,
                bottom: 60
            }]
        })
    }
});
BI.shortcut("demo.editor", Demo.Editor);