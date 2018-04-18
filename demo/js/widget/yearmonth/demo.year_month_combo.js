/**
 * Created by Dailer on 2017/7/13.
 */
Demo.YearMonthCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.dynamic_year_month_combo",
                ref: function (_ref) {
                    self.widget = _ref;
                },
                width: 300,
                // value: {
                //     type: 1,
                //     value: {
                //         year: 2018,
                //         month: 1
                //     }
                // }
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
                        year: 2017,
                        month: 12
                    });
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.year_month_combo", Demo.YearMonthCombo);