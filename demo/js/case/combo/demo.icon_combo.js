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
                container: "body",
                ref: function (_ref) {
                    self.refs = _ref;
                },
                value: "第二项",
                items: [{
                    value: "第一项",
                    iconCls: "close-font"
                }, {
                    value: "第二项",
                    iconCls: "search-font"
                }, {
                    value: "第三项",
                    iconCls: "copy-font"
                }]
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.icon_combo", Demo.IconCombo);