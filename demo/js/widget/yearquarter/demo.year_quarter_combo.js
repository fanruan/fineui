/**
 * Created by Dailer on 2017/7/13.
 */
Demo.YearQuarterCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.dynamic_year_quarter_combo",
                width: 300,
                ref: function (_ref) {
                    self.widget = _ref;
                },
                yearBehaviors: {},
                quarterBehaviors: {},
                value: {
                    type: 1,
                    value: {
                        year: 2018,
                        quarter: 1
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
                text: "setVlaue '2017 季度3'",
                width: 300,
                handler: function () {
                    self.widget.setValue({
                        year: 2017,
                        quarter: 3
                    });
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.year_quarter_combo", Demo.YearQuarterCombo);