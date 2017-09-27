/**
 * Created by Urthur on 2017/9/4.
 */
Demo.Slider = BI.inherit(BI.Widget, {
    _props: {
        baseCls: "demo-slider",
        min: 10,
        max: 50
    },

    render: function () {
        var singleSlider = BI.createWidget({
            type: "bi.single_slider",
            digit: 0,
            width: 300,
            height: 50,
            cls: "layout-bg-white"
        });

        singleSlider.setMinAndMax({
            min: 10,
            max: 100
        });

        singleSlider.setValue(30);
        singleSlider.populate();
        singleSlider.on(BI.SingleSlider.EVENT_CHANGE, function () {
            console.log(this.getValue());
        });

        var singleSliderLabel = BI.createWidget({
            type: "bi.single_slider_label",
            height: 50,
            width: 300,
            digit: 0,
            unit: "个",
            cls: "layout-bg-white"
        });
        singleSliderLabel.setMinAndMax({
            min: 0,
            max: 100
        });
        singleSliderLabel.setValue(10);
        singleSliderLabel.populate();

        var normalSingleSlider = BI.createWidget({
            type: "bi.single_slider_normal",
            height: 30,
            width: 300,
            cls: "layout-bg-white"
        });
        normalSingleSlider.setMinAndMax({
            min: 0,
            max: 100
        });
        normalSingleSlider.setValue(10);
        normalSingleSlider.populate();


        var intervalSlider = BI.createWidget({
            type: "bi.interval_slider",
            width: 300,
            cls: "layout-bg-white"
        });
        intervalSlider.setMinAndMax({
            min: 0,
            max: 120
        });
        intervalSlider.setValue({
            min: 10,
            max: 120
        });
        intervalSlider.populate();

        var intervalSliderLabel = BI.createWidget({
            type: "bi.interval_slider_label",
            width: 300,
            unit: "个",
            cls: "layout-bg-white"
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