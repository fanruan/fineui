/**
 * Created by zcf on 2016/9/22.
 */
BI.Slider = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Slider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider-slider"
        });
    },
    _init: function () {
        BI.extend(BI.Slider.superclass._init.apply(this, arguments));
        this.slider = BI.createWidget({
            type: "bi.icon_button",
            cls: "widget-slider-icon",
            iconWidth: 30,
            iconHeight: 30,
            height: 30,
            width: 30
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.slider,
                top: 0,
                left: -15
            }],
            width: 0,
            height: 30
        });
    }
});
$.shortcut("bi.single_slider_slider", BI.Slider);