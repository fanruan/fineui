/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.editor_icon_check_combo",
                ref: function () {
                    self.combo = this;
                },
                watermark: "默认值",
                width: 200,
                height: 24,
                value: 2,
                items: [{
                    // text: "MVC-1",
                    value: "1"
                }, {
                    // text: "MVC-2",
                    value: "2"
                }, {
                    // text: "MVC-3",
                    value: "3"
                }]
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                text: "setValue为空",
                handler: function () {
                    self.combo.setValue()
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.editor_icon_check_combo", Demo.TextValueCombo);