/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Year = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            vgap: 10,
            items: [{
                type: "bi.dynamic_year_combo",
                width: 300,
                ref: function () {
                    self.yearcombo = this;
                },
                value: {
                    type: 1,
                    value: {
                        year: 2017
                    }
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.yearcombo.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue : 2018",
                handler: function () {
                    self.yearcombo.setValue(2018);
                },
                width: 300
            }],
            vgap: 10
        };
    }
});

BI.shortcut("demo.year", Demo.Year);