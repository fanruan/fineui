/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Quarter = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.quarter_combo",
                width: 300,
                ref: function () {
                    self.quartercombo = this;
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.quartercombo.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue : 3",
                handler: function () {
                    self.quartercombo.setValue(3);
                },
                width: 300
            }],
            vgap: 10
        };
    }
});

BI.shortcut("demo.quarter", Demo.Quarter);