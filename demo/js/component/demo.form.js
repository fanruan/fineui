/**
 * @author windy
 * @version 2.0
 * Created by windy on 2022/1/11
 */
Demo.Form = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-form"
    },
    render: function () {
        var widget = BI.createWidget({
            type: "bi.custom_form",
            width: 300,
            labelWidth: 100,
            items: [{
                validate: function (v) {
                    return v !== "a" && v !== "";
                },
                tip: function (v) {
                    if (BI.isEmpty(v)) {
                        return "不能为空";
                    }
                    return "不合法格式"
                },
                label: "E-mail",
                el: {
                    type: 'bi.text_editor',
                    watermark: "输入a报错",
                    allowBlank: true,
                }
            }, {
                validate: function (v) {
                    return BI.isNotEmptyArray(v);
                },
                tip: function () {
                    return "不能为空";
                },
                label: "性别",
                el: {
                    type: 'bi.text_value_combo',
                    text: "请选择",
                    items: [{
                        text: "男",
                        value: 1
                    }, {
                        text: "女",
                        value: 2
                    }]
                }
            }, {
                validate: function (v) {
                    return v !== "";
                },
                tip: function () {
                    return "不能为空";
                },
                label: "姓名",
                el: {
                    type: 'bi.text_editor',
                    watermark: "输入姓名",
                    allowBlank: true,
                }
            }, {
                validate: function (v) {
                    return v !== "";
                },
                tip: function () {
                    return "不能为空";
                },
                label: "姓名",
                el: {
                    type: 'bi.textarea_editor',
                    cls: 'bi-border',
                    watermark: "输入简介",
                    allowBlank: true,
                    height: 200,
                }
            }],
            layout: {
                type: "bi.vertical",
                vgap: 30
            }
        });
        return {
            type: "bi.vertical",
            hgap: 200,
            vgap: 10,
            items: [widget, {
                type: "bi.button",
                text: "提交",
                handler: function () {
                    widget.validate();

                    console.log(widget.getValue());
                }
            }]
        };
    }
});
BI.shortcut("demo.form", Demo.Form);