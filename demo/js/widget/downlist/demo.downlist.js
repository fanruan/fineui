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
                value: [{"childValue":22,"value":11},{"value":18},{"value":20}],
                height: 30,
                width: 100,
                items: [
                    [{
                        el: {
                            text: "column 1111",
                            iconCls1: "check-mark-e-font",
                            value: 11
                        },
                        children: [{
                            text: "column 1.1",
                            value: 21,
                            cls: "dot-e-font"
                        }, {
                            text: "column 1.222222222222222222222222222222222222",
                            cls: "dot-e-font",
                            value: 22
                        }]
                    }],
                    [{
                        el: {
                            type: "bi.icon_text_icon_item",
                            text: "column 2",
                            iconCls1: "chart-type-e-font",
                            cls: "dot-e-font",
                            value: 12
                        },
                        disabled: true,
                        children: [{
                            type: "bi.icon_text_item",
                            cls: "dot-e-font",
                            height: 25,
                            text: "column 2.1",
                            value: 11
                        }, {
                            text: "column 2.2",
                            value: 12,
                            cls: "dot-e-font"
                        }]
                    }],
                    [{
                        text: "column 8",
                        value: 18,
                        cls: "dot-e-font"
                    },
                    {

                        text: "column 9",
                        cls: "dot-e-font",
                        value: 19
                    }
                    ],
                    [{
                        text: "column 10",
                        value: 20,
                        cls: "dot-e-font"
                    },
                    {

                        text: "column 11",
                        cls: "dot-e-font",
                        value: 21
                    },
                    {

                        text: "column 12",
                        cls: "dot-e-font",
                        value: 22
                    },
                    {

                        text: "column 13",
                        cls: "dot-e-font",
                        value: 23
                    },
                    {

                        text: "column 14",
                        cls: "dot-e-font",
                        value: 24
                    },
                    {

                        text: "column 15",
                        cls: "dot-e-font",
                        value: 23
                    }
                    ]

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
    }
});

BI.shortcut("demo.down_list", Demo.Downlist);