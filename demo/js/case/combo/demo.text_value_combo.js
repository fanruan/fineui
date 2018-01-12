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
                type: "bi.text_value_combo",
                value: "默认值",
                width: 300,
                items: [{
                    text: "MVC-1",
                    iconClass: "date-font",
                    value: 1
                }, {
                    text: "MVC-2",
                    iconClass: "search-font",
                    value: 2
                }, {
                    text: "MVC-3",
                    iconClass: "pull-right-font",
                    value: 3
                }]
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.text_value_combo", Demo.TextValueCombo);