/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.editor_icon_check_combo",
                watermark: "默认值",
                width: 200,
                height: 30,
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
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.editor_icon_check_combo", Demo.TextValueCombo);