Demo.Downlist = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-downlist"
    },

    mounted: function () {
        var downlist = this.downlist;
        var label = this.label;
        this.downlist.setValue([{
            value: [11, 6],
            childValue: 67
        }]);
        downlist.on(BI.DownListCombo.EVENT_CHANGE, function (value, fatherValue) {
            label.setValue(JSON.stringify(downlist.getValue()));
        });

        this.downlist.on(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, function (value, fatherValue) {
            label.setValue(JSON.stringify(downlist.getValue()));
        });
    },


    render: function () {
        var self = this;
        // test
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.down_list_combo",
                ref: function (_ref) {
                    self.downlist = _ref;
                },
                // value: [{"childValue":22,"value":11},{"value":18},{"value":20}],
                height: 30,
                width: 100,
                items: [
                    [{
                        el: {
                            text: "column 1111",
                            iconCls1: "dot-e-font",
                            value: 12
                        },
                        children: [{
                            text: "column 1.1",
                            value: 21,
                            cls: "dot-e-font"
                        }, {
                            text: "column 1.2",
                            value: 22,
                            cls: "dot-e-font"
                        }]
                    }],
                    [{
                        el: {
                            text: "column 1111",
                            iconCls1: "dot-e-font",
                            value: 11
                        },
                        children: [{
                            text: "column 1.1",
                            value: 21,
                            cls: "dot-e-font"
                        }, {
                            text: "column 1.2",
                            value: 22,
                            cls: "dot-e-font"
                        }]
                        // children: [{
                        //     text: BI.i18nText("BI-Basic_None"),
                        //     cls: "dot-e-font",
                        //     value: 1
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Calculate_Same_Period"),
                        //     cls: "dot-e-font",
                        //     value: 2
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Calculate_Same_Ring"),
                        //     cls: "dot-e-font",
                        //     value: 3
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Calculate_Same_Period_Rate"),
                        //     cls: "dot-e-font",
                        //     value: 4
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Calculate_Same_Ring_Rate"),
                        //     cls: "dot-e-font",
                        //     value: 5
                        // }, {
                        //     el: {
                        //         text: BI.i18nText("BI-Basic_Rank"),
                        //         iconCls1: "dot-e-font",
                        //         value: 6
                        //     },
                        //     children: [{
                        //         text: "test1",
                        //         cls: "dot-e-font",
                        //         value: 67
                        //     }, {
                        //         text: "test2",
                        //         cls: "dot-e-font",
                        //         value: 68
                        //     }]
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Rank_In_Group"),
                        //     cls: "dot-e-font",
                        //     value: 7
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Sum_Of_All"),
                        //     cls: "dot-e-font",
                        //     value: 8
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Sum_Of_All_In_Group"),
                        //     cls: "dot-e-font",
                        //     value: 9
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Sum_Of_Above"),
                        //     cls: "dot-e-font",
                        //     value: 10
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Sum_Of_Above_In_Group"),
                        //     cls: "dot-e-font",
                        //     value: 11
                        // }, {
                        //     text: BI.i18nText("BI-Design_Current_Dimension_Percent"),
                        //     cls: "dot-e-font",
                        //     value: 12
                        // }, {
                        //     text: BI.i18nText("BI-Design_Current_Target_Percent"),
                        //     cls: "dot-e-font",
                        //     value: 13
                        // }]
                    }]

                ]
            }, {
                type: "bi.label",
                text: "显示选择值",
                width: 500,
                cls: "layout-bg3",
                ref: function (_ref) {
                    self.label = _ref;
                }
            }],
            vgap: 20
        };
    },
});

BI.shortcut("demo.down_list", Demo.Downlist);