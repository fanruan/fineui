/**
 * Created by Windy on 2018/2/4.
 */
Demo.SearchTextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var combo;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.search_text_value_combo",
                ref: function () {
                    combo = this;
                },
                text: "默认值",
                value: 2,
                width: 300,
                items: [{
                    text: "ABC-1",
                    iconCls: "date-font",
                    value: 1
                }, {
                    text: "BCD-2",
                    iconCls: "search-font",
                    value: 2
                }, {
                    text: "CDE-3",
                    iconCls: "pull-right-font",
                    value: 3
                }, {
                    text: "DEF-3",
                    iconCls: "pull-right-font",
                    value: 4
                }, {
                    text: "FEG-3",
                    iconCls: "pull-right-font",
                    value: 5
                }, {
                    text: "FGH-3",
                    iconCls: "pull-right-font",
                    value: 6
                }, {
                    text: "GHI-3",
                    iconCls: "pull-right-font",
                    value: 7
                }, {
                    text: "HIJ-3",
                    iconCls: "pull-right-font",
                    value: 8
                }, {
                    text: "IJK-3",
                    iconCls: "pull-right-font",
                    value: 9
                }, {
                    text: "JKL-3",
                    iconCls: "pull-right-font",
                    value: 10
                }]
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                handler: function () {
                    combo.setValue(3);
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.search_text_value_combo", Demo.SearchTextValueCombo);