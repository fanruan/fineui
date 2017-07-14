/**
 * Created by Dailer on 2017/7/14.
 */
Demo.SingleSlider = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.single_slider",
                ref: function (_ref) {
                    self.slider = _ref;
                },
                width: 300,
                height: 50
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
                    self.slider.setValue(50);
                    self.slider.populate();
                },
                width: 300
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.single_slider", Demo.SingleSlider);