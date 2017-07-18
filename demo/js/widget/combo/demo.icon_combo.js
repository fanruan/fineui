/**
 * Created by Dailer on 2017/7/12.
 */
Demo.IconCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {

        var self = this;


        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.icon_combo",
                ref:function(_ref){
                    self.refs=_ref;
                },
               // iconClass: "pull-down-ha-font",
                items: [{
                    value: "第一项",
                    iconClass: "delete-font"
                }, {
                    value: "第二项",
                    iconClass: "rename-font"
                }, {
                    value: "第三项",
                    iconClass: "move-font"
                }]
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.icon_combo", Demo.IconCombo);