BICst.CONF = {};
BICst.CONF.GROUP = {};
BICst.CONF.GROUP.NUMBER = {};
BICst.CONF.GROUP.NUMBER = {};
BICst.CONF.GROUP.NUMBER.GROUP_BY_VALUE = 1;
BICst.CONF.GROUP.NUMBER.CUSTOM_NUMBER_GROUP = 2;
BICst.CONF.GROUP.NUMBER.SUM = 3;
BICst.CONF.GROUP.NUMBER.AVG = 4;
BICst.CONF.GROUP.NUMBER.MEDIAN = 5;
BICst.CONF.GROUP.NUMBER.MAX = 6;
BICst.CONF.GROUP.NUMBER.MIN = 7;
BICst.CONF.GROUP.NUMBER.STANDARD_DEVIATION = 8;
BICst.CONF.GROUP.NUMBER.VARIANCE = 9;
BICst.CONF.GROUP.NUMBER.COUNT = 10;
BICst.CONF.GROUP.NUMBER.RECORD_COUNT = 11;
BICst.CONF.GROUP.NUMBER.NONE = 12;
BICst.CONF.GROUP.NUMBER.PERIOD = 13;
BICst.CONF.GROUP.NUMBER.RING = 14;
BICst.CONF.GROUP.NUMBER.PERIOD_RATE = 15;
BICst.CONF.GROUP.NUMBER.RING_RATE = 16;
BICst.CONF.GROUP.NUMBER.YEAR = 17;
BICst.CONF.GROUP.NUMBER.QUARTER = 18;
BICst.CONF.GROUP.NUMBER.MONTH = 19;
BICst.CONF.GROUP.NUMBER.WEEK = 20;
BICst.CONF.GROUP.NUMBER.WEEKDAY = 21;
BICst.CONF.GROUP.NUMBER.RENAME = 22;
BICst.CONF.GROUP.NUMBER.DELETE = 23;

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
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.down_list_combo",
                ref: function (_ref) {
                    self.downlist = _ref;
                },
                cls: "layout-bg3",
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
                cls: "layout-bg4",
                ref: function (_ref) {
                    self.label = _ref;
                }
            }],
            vgap: 20
        };
    },
});

BI.shortcut("demo.down_list", Demo.Downlist);