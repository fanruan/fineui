/**
 * Created by Urthur on 2017/9/4.
 */
BI.SliderNormal = BI.inherit(BI.Widget, {
    _constant: {
        HEIGHT: 28,
        SLIDER_WIDTH_HALF: 10,
        SLIDER_WIDTH: 25,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },

    _defaultConfig: function () {
        return BI.extend(BI.SliderNormal.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-slider",
            min: 10,
            max: 50
        })
    },

    _init: function () {
        BI.SliderNormal.superclass._init.apply(this, arguments);
        var self = this;
        var c = this._constant, o = this.options;
        this.enable = false;
        this.value = o.min;
        this.min = o.min;
        this.max = o.max;

        this.rightTrack = BI.createWidget({
            type: "bi.layout",
            cls: "bi-slider-track",
            height: 5
        });
        this.track = this._createTrack();

        this.slider = BI.createWidget({
            type: "bi.slider_button"
        });
        this.slider.setValue(this.getValue());
        this.slider.element.draggable({
            axis: "x",
            containment: this.rightTrack.element,
            scroll: false,
            drag: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getRightTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));//直接对计算出来的百分数保留到小数点后一位，相当于分成了1000份。
                var v = self._getValueByPercent(significantPercent);
                self.value = BI.parseInt(v) + 1;
                self.slider.setValue(self.getValue());
                self.fireEvent(BI.SliderNormal.EVENT_CHANGE);
            },
            stop: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getRightTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                self.fireEvent(BI.SliderNormal.EVENT_CHANGE);
            }
        });
        var sliderVertical = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.absolute",
                items: [{
                    el: this.slider,
                    top: 10
                }]
            }],
            hgap: c.SLIDER_WIDTH_HALF,
            height: c.SLIDER_HEIGHT
        });
        sliderVertical.element.click(function (e) {
            if (self.enable) {
                var offset = e.clientX - self.element.offset().left - c.SLIDER_WIDTH_HALF;
                var trackLength = self.track.element[0].scrollWidth;
                var percent = 0;
                if (offset < 0) {
                    percent = 0
                }
                if (offset > 0 && offset < (trackLength - c.SLIDER_WIDTH)) {
                    percent = offset * 100 / self._getRightTrackLength();
                }
                if (offset > (trackLength - c.SLIDER_WIDTH)) {
                    percent = 100
                }
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.value = BI.parseInt(v);
                self.slider.setValue(self.getValue());
                self.fireEvent(BI.SliderNormal.EVENT_CHANGE);
            }
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.track,
                            width: "100%",
                            height: c.TRACK_HEIGHT
                        }]
                    }],
                    height: c.TRACK_HEIGHT
                },
                top: 33,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 15,
                left: 0,
                width: "100%"
            }]
        });
    },

    _createTrack: function () {
        return BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.rightTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }]
                    }],
                    hgap: 8,
                    height: 5
                },
                top: 5,
                left: 0,
                width: "100%"
            }]
        })
    },

    _checkValidation: function (v) {
        return !(BI.isNull(v) || v < this.min || v > this.max)
    },

    _setSliderPosition: function (percent) {
        this.slider.element.css({"left": percent + "%"});
    },

    _getRightTrackLength: function () {
        return this.rightTrack.element[0].scrollWidth
    },

    _getValueByPercent: function (percent) {
        var thousandth = BI.parseInt(percent * 10);
        return (((this.max - this.min) * thousandth) / 1000 + this.min);
    },

    _getPercentByValue: function (v) {
        return (v - this.min) * 100 / (this.max - this.min);
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (v) {
        var value = BI.parseFloat(v);
        if ((!isNaN(value))) {
            if (this._checkValidation(value)) {
                this.value = value;
            }
            if (value > this.max) {
                this.value = this.max;
            }
            if (value < this.min) {
                this.value = this.min;
            }
        }

        if (!isNaN(this.min) && !isNaN(this.max)) {
            this.enable = true;
            if (BI.isNumeric(this.value) || BI.isNotEmptyString(this.value)) {
                this.slider.setValue(BI.parseInt(this.value));
                this._setSliderPosition(this._getPercentByValue(this.value));
            } else {
                this.slider.setValue(this.max);
                this._setSliderPosition(100);
            }
        }
    }
});

BI.SliderNormal.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.slider", BI.SliderNormal);