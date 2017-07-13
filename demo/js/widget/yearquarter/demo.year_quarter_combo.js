/**
 * Created by Dailer on 2017/7/13.
 */
Demo.YearQuarterCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var self=this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.year_quarter_combo",
                width: 300,
                ref:function(_ref){
                    self.widget=_ref;
                },
                yearBehaviors: {},
                quarterBehaviors: {},
            }, {
                type: "bi.button",
                text: "getValue",
                handler:function(){
                    BI.Msg.toast(JSON.stringify(self.widget.getValue()))
                },
                width: 300
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.year_quarter_combo", Demo.YearQuarterCombo);