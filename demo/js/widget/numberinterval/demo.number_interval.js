/**
 * Created by Dailer on 2017/7/12.
 */
Demo.NumericalInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    mounted: function () {
        var numerical = this.numerical;
        var label = this.label;
        numerical.on(BI.NumberInterval.EVENT_CHANGE, function () {
            var temp = numerical.getValue();
            var res = "大于" + (temp.closemin ? "等于 " : " ") + temp.min + " 小于" + (temp.closemax ? "等于 " : " ") + temp.max;
            label.setValue(res);
        });
    },


    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.number_interval",
                ref: function (_ref) {
                    self.numerical = _ref;
                },
                width: 500
            }, {
                type: "bi.label",
                ref: function (_ref) {
                    self.label = _ref;
                },
                text: "显示结果"
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.number_interval", Demo.NumericalInterval);