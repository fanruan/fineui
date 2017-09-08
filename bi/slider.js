/**
 * Created by zcf on 2016/9/22.
 */
BI.Slider = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Slider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-button-button"
        });
    },
    _init: function () {
        BI.extend(BI.Slider.superclass._init.apply(this, arguments));
        this.slider = BI.createWidget({
            type: "bi.icon_button",
            cls: "widget-button-icon button-button",
            iconWidth: 14,
            iconHeight: 14,
            height: 14,
            width: 14
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.slider,
                top: 7,
                left: -7
            }],
            width: 0,
            height: 14
        });
    }
});
BI.shortcut("bi.single_slider_slider", BI.Slider);/**
 * Created by zcf on 2016/9/22.
 */
BI.SingleSlider = BI.inherit(BI.Widget, {
    _constant: {
        EDITOR_WIDTH: 90,
        EDITOR_HEIGHT: 30,
        HEIGHT: 28,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },
    _defaultConfig: function () {
        return BI.extend(BI.SingleSlider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider bi-slider-track"
        });
    },
    _init: function () {
        BI.SingleSlider.superclass._init.apply(this, arguments);

        var self = this;
        var c = this._constant;
        this.enable = false;
        this.value = "";

        this.grayTrack = BI.createWidget({
            type: "bi.layout",
            cls: "gray-track",
            height: 6
        });
        this.blueTrack = BI.createWidget({
            type: "bi.layout",
            cls: "blue-track bi-high-light-background",
            height: 6
        });
        this.track = this._createTrackWrapper();

        this.slider = BI.createWidget({
            type: "bi.single_slider_slider"
        });
        this.slider.element.draggable({
            axis: "x",
            containment: this.grayTrack.element,
            scroll: false,
            drag: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));//直接对计算出来的百分数保留到小数点后一位，相当于分成了1000份。
                self._setBlueTrack(significantPercent);
                self._setLabelPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.label.setValue(v);
                self.value = v;
            },
            stop: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });
        var sliderVertical = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.absolute",
                items: [this.slider]
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
                    percent = offset * 100 / self._getGrayTrackLength();
                }
                if (offset > (trackLength - c.SLIDER_WIDTH)) {
                    percent = 100
                }
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setAllPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.label.setValue(v);
                self.value = v;
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });
        this.label = BI.createWidget({
            type: "bi.sign_editor",
            cls: "slider-editor-button bi-border",
            errorText: "",
            height: c.HEIGHT,
            width: c.EDITOR_WIDTH,
            allowBlank: false,
            validationChecker: function (v) {
                return self._checkValidation(v);
            },
            quitChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.label.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var percent = self._getPercentByValue(this.getValue());
            var significantPercent = BI.parseFloat(percent.toFixed(1));
            self._setAllPosition(significantPercent);
            self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
        });
        this._setVisible(false);
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
                    hgap: 7,
                    height: c.TRACK_HEIGHT
                },
                top: 33,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 30,
                left: 0,
                width: "100%"
            }, {
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [this.label]
                    }],
                    rgap: c.EDITOR_WIDTH,
                    height: c.EDITOR_HEIGHT
                },
                top: 0,
                left: 0,
                width: "100%"
            }]
        })
    },

    _createTrackWrapper: function () {
        return BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.grayTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }, {
                            el: this.blueTrack,
                            top: 0,
                            left: 0,
                            width: "0%"
                        }]
                    }],
                    hgap: 8,
                    height: 8
                },
                top: 8,
                left: 0,
                width: "100%"
            }]
        })
    },

    _checkValidation: function (v) {
        return BI.isNumeric(v) && !(BI.isNull(v) || v < this.min || v > this.max)
    },

    _setBlueTrack: function (percent) {
        this.blueTrack.element.css({"width": percent + "%"});
    },

    _setLabelPosition: function (percent) {
        this.label.element.css({"left": percent + "%"});
    },

    _setSliderPosition: function (percent) {
        this.slider.element.css({"left": percent + "%"});
    },

    _setAllPosition: function (percent) {
        this._setSliderPosition(percent);
        this._setLabelPosition(percent);
        this._setBlueTrack(percent);
    },

    _setVisible: function (visible) {
        this.slider.setVisible(visible);
        this.label.setVisible(visible);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth
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
    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber > minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.value = "";
        this.min = 0;
        this.max = 0;
        this._setBlueTrack(0);
    },

    populate: function () {
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this._setVisible(true);
            this.enable = true;
            this.label.setErrorText(BI.i18nText("BI-Please_Enter") + this.min + "-" + this.max + BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Basic_Number"));
            if (BI.isNumeric(this.value) || BI.isNotEmptyString(this.value)) {
                this.label.setValue(this.value);
                this._setAllPosition(this._getPercentByValue(this.value));
            } else {
                this.label.setValue(this.max);
                this._setAllPosition(100);
            }
        }
    }
});
BI.SingleSlider.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_slider", BI.SingleSlider);/**
 * normal single slider
 * Created by Young on 2017/6/21.
 */
BI.SingleSliderNormal = BI.inherit(BI.Widget, {

    _constant: {
        EDITOR_WIDTH: 90,
        EDITOR_HEIGHT: 30,
        HEIGHT: 28,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },

    props: {
        baseCls: "bi-single-button bi-button-track",
        minMax: {
            min: 0,
            max: 100
        },
        color: "#3f8ce8"
    },

    render: function () {
        var self = this;
        var c = this._constant;
        var track = this._createTrack();
        this.slider = BI.createWidget({
            type: "bi.single_slider_slider"
        });
        this.slider.element.draggable({
            axis: "x",
            containment: this.grayTrack.element,
            scroll: false,
            drag: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));//直接对计算出来的百分数保留到小数点后一位，相当于分成了1000份。
                self._setBlueTrack(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.value = v;
                self.fireEvent(BI.SingleSliderNormal.EVENT_DRAG, v);
            },
            stop: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });

        var sliderVertical = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.absolute",
                items: [this.slider]
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
                    percent = offset * 100 / self._getGrayTrackLength();
                }
                if (offset > (trackLength - c.SLIDER_WIDTH)) {
                    percent = 100
                }
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setAllPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.value = v;
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });

        return {
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: track,
                            width: "100%",
                            height: c.TRACK_HEIGHT
                        }]
                    }],
                    hgap: 7,
                    height: c.TRACK_HEIGHT
                },
                top: 3,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 0,
                left: 0,
                width: "100%"
            }]
        }
    },

    _createTrack: function () {
        var self = this;
        var c = this._constant;
        this.grayTrack = BI.createWidget({
            type: "bi.layout",
            cls: "gray-track",
            height: 6
        });
        this.blueTrack = BI.createWidget({
            type: "bi.layout",
            cls: "blue-track",
            height: 6
        });
        this.blueTrack.element.css({"background-color": this.options.color});

        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.grayTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }, {
                            el: this.blueTrack,
                            top: 0,
                            left: 0,
                            width: "0%"
                        }]
                    }],
                    hgap: 8,
                    height: 8
                },
                top: 8,
                left: 0,
                width: "100%"
            }],
            ref: function (ref) {
                self.track = ref;
            }
        }
    },

    _checkValidation: function (v) {
        return !(BI.isNull(v) || v < this.min || v > this.max)
    },

    _setBlueTrack: function (percent) {
        this.blueTrack.element.css({"width": percent + "%"});
    },

    _setSliderPosition: function (percent) {
        this.slider.element.css({"left": percent + "%"});
    },

    _setAllPosition: function (percent) {
        this._setSliderPosition(percent);
        this._setBlueTrack(percent);
    },

    _setVisible: function (visible) {
        this.slider.setVisible(visible);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth
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
    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber > minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.value = "";
        this.min = 0;
        this.max = 0;
        this._setBlueTrack(0);
    },

    populate: function () {
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this._setVisible(true);
            this.enable = true;
            if (BI.isNumeric(this.value) || BI.isNotEmptyString(this.value)) {
                this._setAllPosition(this._getPercentByValue(this.value));
            } else {
                this._setAllPosition(100);
            }
        }
    }
});
BI.SingleSliderNormal.EVENT_DRAG = "EVENT_DRAG";
BI.shortcut("bi.single_slider_normal", BI.SingleSliderNormal);/**
 * Created by Urthur on 2017/9/4.
 */
BI.SliderButton = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SliderButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-slider-button"
        });
    },
    _init: function () {
        BI.extend(BI.SliderButton.superclass._init.apply(this, arguments));
        var self = this;
        var sliderButton = BI.createWidget({
            type: "bi.icon_button",
            cls: "column-next-page-h-font",
            iconWidth: 16,
            iconHeight: 16,
            height: 16,
            width: 16
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: sliderButton,
                left: -8
            }, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.label = _ref;
                    }
                },
                left: -8,
                top: -10
            }]
        });
    },

    setValue: function (v) {
        this.label.setText(v);
    }
});
BI.shortcut("bi.slider_button", BI.SliderButton);/**
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