/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var combo;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_value_combo",
                ref: function () {
                    combo = this;
                },
                text: "默认值",
                value: 2,
                width: 300,
                items: [{
                    text: "MVC-1",
                    iconCls: "date-font",
                    value: 1
                }, {
                    text: "MVC-2",
                    iconCls: "search-font",
                    value: 2
                }, {
                    text: "MVC-3",
                    iconCls: "pull-right-font",
                    value: 3
                }]
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                handler: function () {
                    combo.setValue("");
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.text_value_combo", Demo.TextValueCombo);