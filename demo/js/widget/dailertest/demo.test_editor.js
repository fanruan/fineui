/**
 * Created by Dailer on 2017/7/18.
 */
Demo.TestEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.sign_editor",
            cls: "bi-border",
            width: 90,
            height: 28,
        });

        var test = BI.createWidget({
            type: "bi.test_editor",
            // formatter: function (v) {
            //     return v + "%";
            // },
            value: 12,
            width: 90,
            height: 28,
            step: 1
        });

        var timetunning = BI.createWidget({
            type: "bi.time_tunning",
            currentTime: {
                hour: 13,
                minute: 45,
                second: 50
            }
        });

        var dateTimeCombo = BI.createWidget({
            type: "bi.date_time_combo",
            width: 300
        });

        var enable = 1;

        return {
            type: "bi.horizontal_auto",
            items: [{
                    el: test
                },
                {
                    type: "bi.left",
                    items: [{
                        el: editor
                    }, {
                        type: "bi.button",
                        text: "设置step",
                        width: 90,
                        height: 28,
                        handler: function () {
                            test.setStep(editor.getValue());
                            BI.Msg.toast("设置成功")
                        },
                        lgap: 5
                    }, {
                        type: "bi.button",
                        text: "toggle disabled",
                        height: 28,
                        handler: function () {
                            enable *= -1;
                            test.setEnable(Boolean(1 + enable));
                            BI.Msg.toast("设置成功")
                        },
                        lgap: 20
                    }]
                },
                {
                    type: "bi.left",
                    items: [
                        timetunning,
                        {
                            type: "bi.label",
                            text: "时间选择控件,自动进位与退位,返回数据自动对小于10的数补0",
                            whiteSpace: "normal",
                            cls: "layout-bg3",
                            height: 50,
                            width: 400,
                            lgap: 10
                        }
                    ],
                },
                {
                    type: "bi.left",
                    items: [{
                        type: "bi.button",
                        text: "getCurrentTime",
                        cls: "layout-bg1",
                        handler: function () {
                            BI.Msg.alert("JSON 形式", JSON.stringify(timetunning.getCurrentTime()));
                        }
                    }, {
                        type: "bi.button",
                        text: "getCurrentTimeStr",
                        cls: "layout-bg1",
                        handler: function () {
                            BI.Msg.alert("字符串形式", timetunning.getCurrentTimeStr());
                        }
                    }],
                    hgap: 10
                },
                {
                    type: "bi.left",
                    items: [dateTimeCombo]
                }
            ],
            vgap: 20,
            hgap: 10
        }
    }
});

BI.shortcut("demo.test_editor", Demo.TestEditor);