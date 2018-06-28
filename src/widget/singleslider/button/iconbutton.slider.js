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
                    height: this.constants.NORMAL_SIZE,
                    width: this.constants.NORMAL_SIZE,
                    ref: function () {
                        self.slider = this;
                    }
                },
                top: this.constants.NORMAL_OFFSET,
                left: -8
            }],
            width: 0,
            height: this.constants.NORMAL_SIZE
        };
    },

    mounted: function () {
        var self = this;
        this.slider.element.hover(function () {
            self._enlarge();
        }, function () {
            self._normalize();
        });
    },


    _enlarge: function () {
        this.slider.setWidth(this.constants.LARGE_SIZE);
        this.slider.setHeight(this.constants.LARGE_SIZE);
        this.wrapper.attr("items")[0].top = this.constants.LARGE_OFFSET;
        this.wrapper.attr("items")[0].left = -10;
        this.wrapper.resize();
    },

    _normalize: function () {
        this.slider.setWidth(this.constants.NORMAL_SIZE);
        this.slider.setHeight(this.constants.NORMAL_SIZE);
        this.wrapper.attr("items")[0].top = this.constants.NORMAL_OFFSET;
        this.wrapper.attr("items")[0].left = -8;
        this.wrapper.resize();
    }
});
BI.shortcut("bi.single_slider_button", BI.SliderIconButton);