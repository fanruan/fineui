/**
 * Created by Dailer on 2017/7/13.
 */
Demo.TimeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.time_combo",
                ref: function (_ref) {
                    self.timeCombo = _ref;
                },
                // allowEdit: true,
                // format: "%H:%M:%S",  // HH:mm:ss
                // format: "%I:%M:%S",  // hh:mm:ss
                // format: "%l:%M:%S",  // h:mm:ss
                // format: "%k:%M:%S",  // H:mm:ss
                // format: "%l:%M:%S %p",  // h:mm:ss a
                // format: "%l:%M",  // h:mm
                // format: "%k:%M",  // H:mm
                // format: "%I:%M",  // hh:mm
                // format: "%H:%M",  // HH:mm
                // format: "%M:%S",  // mm:ss
                value: {
                    hour: 12,
                    minute: 0,
                    second: 0
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.timeCombo.getValue()));
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.time_combo", Demo.TimeCombo);