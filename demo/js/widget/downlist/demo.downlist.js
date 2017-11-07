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
                            cls: "dot-e-font",
                            selected: true
                        }, {
                            text: "column 1.222222222222222222222222222222222222",
                            cls: "dot-e-font",
                            value: 22,
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
                        cls: "dot-e-font",
                        selected: true
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
                        cls: "dot-e-font",
                        selected: true
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
        }
    }
})

BI.shortcut("demo.down_list", Demo.Downlist);