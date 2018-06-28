/**
 * Created by zcf on 2016/9/22.
 */
BI.SliderIconButton = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-single-slider-button"
    },

    constants: {
        LARGE_SIZE: 16,
        NORMAL_SIZE: 12,
        LARGE_OFFSET: 4,
        NORMAL_OFFSET: 6
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            ref: function () {
                self.wrapper = this;
            },
            items: [{
                el: {
                    type: "bi.text_button",
                    cls: "slider-button",
                    ref: function () {
                        self.slider = this;
                    }
                }
            }]
        };
    }
});
BI.shortcut("bi.single_slider_button", BI.SliderIconButton);