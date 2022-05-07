/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/1/25
 */
Demo.YearQuarterInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.year_quarter_interval",
                ref: function (_ref) {
                    self.interval = _ref;
                },
                minDate: "2012-07-01",
                maxDate: "2012-12-31",
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

BI.shortcut("demo.year_quarter_interval", Demo.YearQuarterInterval);