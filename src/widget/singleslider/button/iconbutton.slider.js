/**
 * Created by zcf on 2016/9/22.
 */
BI.SliderIconButton = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SliderIconButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider-button"
        });
    },
    _init: function () {
        BI.extend(BI.SliderIconButton.superclass._init.apply(this, arguments));
        this.slider = BI.createWidget({
            type: "bi.text_button",
            cls: "slider-button",
            height: 12,
            width: 12
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.slider,
                top: 6,
                left: -6
            }],
            width: 0,
            height: 12
        });
    }
});
BI.shortcut("bi.single_slider_button", BI.SliderIconButton);