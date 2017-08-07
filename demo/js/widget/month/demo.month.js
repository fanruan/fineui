/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Month = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.month_combo",
                width: 300,
                ref: function () {
                    self.monthcombo = this;
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.monthcombo.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue : 11",
                handler: function () {
                    self.monthcombo.setValue(11);
                },
                width: 300
            }, {
                type: "bi.label",
                text: "月份value 范围为0-11,显示范围为1-12",
                width: 300
            }],
            vgap: 10
        }
    }
})

BI.shortcut("demo.month", Demo.Month);