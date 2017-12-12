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
                trigger: "click-hover",
                container: "body",
                ref: function (_ref) {
                    self.refs = _ref;
                },
                iconClass: "search-font",
                items: [{
                    value: "第一项",
                    iconClass: "close-font"
                }, {
                    value: "第二项",
                    iconClass: "search-font"
                }, {
                    value: "第三项",
                    iconClass: "copy-font"
                }]
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.icon_combo", Demo.IconCombo);