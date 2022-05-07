/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/1/25
 */
Demo.YearInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.year_interval",
                ref: function (_ref) {
                    self.widget = _ref;
                },
                width: 300,
                minDate: "2012-01-01",
                maxDate: "2013-12-31",
                value: {
                    type: 1,
                    value: {
                        year: 2012
                    }
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.widget.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue '2017-12'",
                width: 300,
                handler: function () {
                    self.widget.setValue({
                        year: 2017
                    });
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.year_interval", Demo.YearInterval);