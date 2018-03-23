Demo.YearMonthInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.year_month_interval",
                ref: function (_ref) {
                    self.interval = _ref;
                },
                value: {
                    start: {
                        type: 2,
                        value: {
                            year: -1,
                            month: 1
                        }
                    },
                    end: {
                        type: 1,
                        value: {
                            year: 2018,
                            month: 1
                        }
                    }
                },
                width: 400
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.interval.getValue()));
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.year_month_interval", Demo.YearMonthInterval);