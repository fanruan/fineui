/**
 * Created by Dailer on 2017/7/13.
 */
Demo.TimeInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.time_interval",
                ref: function (_ref) {
                    self.interval = _ref;
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.interval.getValue()));
                },
                width: 300
            }],
            vgap: 20
        }
    }
});

BI.shortcut("demo.time_interval", Demo.TimeInterval);