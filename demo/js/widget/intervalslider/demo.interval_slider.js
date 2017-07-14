/**
 * Created by Dailer on 2017/7/14.
 */
Demo.IntervalSlider = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.interval_slider",
                ref: function (_ref) {
                    self.slider = _ref;
                },
                width: 300,
                height: 90
            }, {
                type: "bi.button",
                text: "populate",
                handler: function () {
                    self.slider.setMinAndMax({
                        min: 1,
                        max: 100
                    });
                    self.slider.populate();
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue",
                handler: function () {

                    //既然 setVlaue后要重新 populate 才能生效,为何不直接在 setValue方法的结尾调用 populate 方法呢?
                    self.slider.setValue({
                        min: 20,
                        max: 80
                    });
                    self.slider.populate();
                },
                width: 300
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.interval_slider", Demo.IntervalSlider);