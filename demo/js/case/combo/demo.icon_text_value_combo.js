/**
 * Created by Windy on 2017/12/13.
 */
Demo.IconTextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.icon_text_value_combo",
                text: "默认值",
                value: 1,
                width: 300,
                items: [{
                    text: "MVC-1",
                    iconClass: "close-font",
                    value: 1
                }, {
                    text: "MVC-2",
                    iconClass: "date-font",
                    value: 2
                }, {
                    text: "MVC-3",
                    iconClass: "search-close-h-font",
                    value: 3
                }]
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.icon_text_value_combo", Demo.IconTextValueCombo);