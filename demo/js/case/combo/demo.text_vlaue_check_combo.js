/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCheckCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_value_check_combo",
                text: "默认值",
                width: 300,
                items: [{
                    text: "MVC-1",
                    value: 1
                }, {
                    text: "MVC-2",
                    value: 2
                }, {
                    text: "MVC-3",
                    value: 3
                }]
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.text_value_check_combo", Demo.TextValueCheckCombo);