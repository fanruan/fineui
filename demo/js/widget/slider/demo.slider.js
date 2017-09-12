/**
 * Created by Urthur on 2017/9/4.
 */
Demo.Slider = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(Demo.Slider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "demo-slider",
            min: 10,
            max: 50
        })
    },
    _init: function () {
        Demo.Slider.superclass._init.apply(this, arguments);

        var singleSlider = BI.createWidget({
            type: "bi.single_slider",
            digit: 0,
            width: 300,
            height: 50
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
            height: 30,
            width: 300,
            digit: 0,
            unit: "个"
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
            width: 300
        });
        normalSingleSlider.setMinAndMax({
            min: 0,
            max: 100
        });
        normalSingleSlider.setValue(10);
        normalSingleSlider.populate();

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [{
                        el: singleSlider
                    }]
                },
                height: 200
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [{
                        el: normalSingleSlider
                    }]
                },
                height: 200
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [{
                        el: singleSliderLabel
                    }]
                },
                height: 200
            }],
            hgap: 20
        });
    }
});
BI.shortcut("demo.slider", Demo.Slider);