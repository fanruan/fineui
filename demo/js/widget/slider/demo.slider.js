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

        var slider = BI.createWidget({
            type: "bi.slider",
            min: 16,
            max: 50,
            width: 100,
            height: 50
        });

        slider.setValue("30");

        slider.on(BI.SliderNormal.EVENT_CHANGE, function () {
            console.log(this.getValue());
        });

        var singleSlider = BI.createWidget({
            type: "bi.single_slider",
            min: 16,
            max: 50
        });

        singleSlider.populate();

        var normalSingleSlider = BI.createWidget({
            type: "bi.single_slider_normal",
            min: 16,
            max: 50
        });

        normalSingleSlider.populate();

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [{
                        el: slider
                    }]
                },
                height: 200
            }, {
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
            }],
            hgap: 20
        });
    }
});
BI.shortcut("demo.slider", Demo.Slider);