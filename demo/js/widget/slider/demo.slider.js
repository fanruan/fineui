/**
 * Created by Urthur on 2017/9/4.
 */
Demo.Slider = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-slider",
        width: 300,
        height: 50,
        min: 0,
        max: 100
    },

    render: function () {
        var self = this, o = this.options;
        var singleSlider = BI.createWidget({
            type: "bi.single_slider",
            digit: 0,
            width: o.width,
            height: o.height,
            cls: "layout-bg-white"
        });

        singleSlider.setMinAndMax({
            min: 10,
            max: o.max
        });

        singleSlider.setValue(30);
        singleSlider.populate();
        singleSlider.on(BI.SingleSlider.EVENT_CHANGE, function () {
            console.log(this.getValue());
        });

        var normalSingleSlider = BI.createWidget({
            type: "bi.single_slider_normal",
            width: o.width,
            height: 30,
            cls: "layout-bg-white"
        });
        normalSingleSlider.setMinAndMax({
            min: o.min,
            max: o.max
        });
        normalSingleSlider.setValue(10);
        normalSingleSlider.populate();

        var singleSliderLabel = BI.createWidget({
            type: "bi.single_slider_label",
            width: o.width,
            height: o.height,
            digit: 0,
            unit: "个",
            cls: "layout-bg-white"
        });
        singleSliderLabel.setMinAndMax({
            min: o.min,
            max: o.max
        });
        singleSliderLabel.setValue(10);
        singleSliderLabel.populate();

        var intervalSlider = BI.createWidget({
            type: "bi.interval_slider",
            width: o.width,
            digit: 0,
            cls: "layout-bg-white"
        });
        intervalSlider.setMinAndMax({
            min: o.min,
            max: o.max
        });
        intervalSlider.setValue({
            min: 10,
            max: 120
        });
        intervalSlider.populate();

        var intervalSliderLabel = BI.createWidget({
            type: "bi.interval_slider",
            width: o.width,
            unit: "px",
            cls: "layout-bg-white",
            digit: 1
        });
        intervalSliderLabel.setMinAndMax({
            min: 0,
            max: 120
        });
        intervalSliderLabel.setValue({
            min: 10,
            max: 120
        });
        intervalSliderLabel.populate();


        return {
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.center_adapt",
                items: [{
                    el: singleSlider
                }]
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: normalSingleSlider
                }]
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: singleSliderLabel
                }]
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: intervalSlider
                }]
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: intervalSliderLabel
                }]
            }],
            vgap: 20
        };
    }
});
BI.shortcut("demo.slider", Demo.Slider);