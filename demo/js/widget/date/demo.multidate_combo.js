/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Date = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-date"
    },

    _init: function () {
        Demo.Date.superclass._init.apply(this, arguments);
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            vgap: 10,
            items: [{
                type: "bi.multidate_combo",
                ref: function () {
                    self.datecombo = this;
                },
                width: 300,
                value: {
                    year: 2018,
                    month: 1,
                    day: 23
                }
            }, {
                type: "bi.button",
                text: "getVlaue",
                width: 300,
                handler: function () {
                    BI.Msg.alert("date", JSON.stringify(self.datecombo.getValue()));
                }
            }, {
                type: "bi.button",
                text: "setVlaue '2017-12-31'",
                width: 300,
                handler: function () {
                    self.datecombo.setValue({
                        year: 2017,
                        month: 11,
                        day: 31
                    });
                }
            }]
        };
    }
});

BI.shortcut("demo.multidate_combo", Demo.Date);