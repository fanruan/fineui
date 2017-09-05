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
        var self = this;
        BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            width: 100,
            items: [{
                type: "bi.htape",
                items: [{
                    el: {
                        type: "bi.slider",
                        min: 16,
                        max: 50,
                        ref: function (_ref) {
                            self.slider = _ref;
                        }
                    }
                }],
                height: 30,
                width: 100
            }]
        });
        this.slider.setValue("30");

        this.slider.on(BI.SliderNormal.EVENT_CHANGE, function () {
            console.log(this.getValue());
        })
    }
});
BI.shortcut("demo.slider", Demo.Slider);