/**
 * Created by zcf on 2016/9/22.
 */
BI.SingleSlider = BI.inherit(BI.Single, {
    _constant: {
        EDITOR_WIDTH: 90,
        EDITOR_HEIGHT: 20,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24,
        TRACK_GAP_HALF: 7,
        TRACK_GAP: 14
    },

    props: {
        baseCls: "bi-single-slider bi-slider-track",
        digit: false,
        unit: ""
    },

    render: function () {
        var self = this, o = this.options;
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
            type: "bi.single_slider_button"
        });
        this._draggable(this.slider);
        var sliderVertical = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.absolute",
                items: [this.slider]
            }],
            hgap: c.SLIDER_WIDTH_HALF,
            height: c.SLIDER_HEIGHT
        });
        // 这边其实是有问题的，拖拽区域是个圆，在圆的边缘拖拽后放开，这边计算出来的蓝条宽度实际上会比放开时长一点或者短一点
        sliderVertical.element.click(function (e) {
            if (self.enable && self.isEnabled() && sliderVertical.element[0] === e.originalEvent.target) {
                var offset = e.clientX - self.element.offset().left - c.SLIDER_WIDTH_HALF;
                var trackLength = self.track.element[0].scrollWidth - c.TRACK_GAP;
                var percent = 0;
                if (offset < 0) {
                    percent = 0;
                }
                if (offset > 0 && offset < trackLength) {
                    percent = offset * 100 / self._getGrayTrackLength();
                }
                if (offset >= trackLength) {
                    percent = 100;
                }
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setAllPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                v = o.digit === false ? v : v.toFixed(o.digit);
                self.label.setValue(v);
                self.value = v;
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });
        this.label = BI.createWidget({
            type: "bi.sign_text_editor",
            cls: "slider-editor-button",
            text: o.unit,
            width: c.EDITOR_WIDTH - 2,
            height: c.EDITOR_HEIGHT - 2,
            allowBlank: false,
            textAlign: "center",
            validationChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.label.element.hover(function () {
            self.label.element.removeClass("bi-border").addClass("bi-border");
        }, function () {
            self.label.element.removeClass("bi-border");
        });
        this.label.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var v = BI.parseFloat(this.getValue());
            var percent = self._getPercentByValue(v);
            var significantPercent = BI.parseFloat(percent.toFixed(1));
            self._setAllPosition(significantPercent);
            this.setValue(v);
            self.value = v;
            self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
        });
        this._setVisible(false);
        return {
            type: "bi.absolute",
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
                    hgap: c.TRACK_GAP_HALF,
                    height: c.TRACK_HEIGHT
                },
                top: 23,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 20,
                left: 0,
                width: "100%"
            }, {
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.horizontal_auto",
                        items: [this.label]
                    }],
                    height: c.EDITOR_HEIGHT
                },
                top: 0,
                left: 0,
                width: "100%"
            }]
        };
    },

    _draggable: function (widget) {
        var self = this, o = this.options;
        var startDrag = false;
        var size = 0, offset = 0, defaultSize = 0;
        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX) {
            if (mouseMoveTracker.isDragging()) {
                startDrag = true;
                offset += deltaX;
                size = optimizeSize(defaultSize + offset);
                widget.element.addClass("dragging");
                var percent = size * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));// 直接对计算出来的百分数保留到小数点后一位，相当于分成了1000份。
                self._setBlueTrack(significantPercent);
                self._setLabelPosition(significantPercent);
                self._setSliderPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                v = o.digit === false ? v : v.toFixed(o.digit);
                self.label.setValue(v);
                self.value = v;
            }
        }, function () {
            if (startDrag === true) {
                size = optimizeSize(size);
                var percent = size * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                size = 0;
                offset = 0;
                defaultSize = size;
                startDrag = false;
            }
            widget.element.removeClass("dragging");
            mouseMoveTracker.releaseMouseMoves();
            self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
        }, window);
        widget.element.on("mousedown", function (event) {
            if(!widget.isEnabled()) {
                return;
            }
            defaultSize = this.offsetLeft;
            optimizeSize(defaultSize);
            mouseMoveTracker.captureMouseMoves(event);
        });

        function optimizeSize (s) {
            return BI.clamp(s, 0, self._getGrayTrackLength());
        }
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
        });
    },

    _checkValidation: function (v) {
        var o = this.options;
        var valid = false;
        if (BI.isNumeric(v) && !(BI.isNull(v) || v < this.min || v > this.max)) {
            if(o.digit === false) {
                valid = true;
            }else{
                var dotText = (v + "").split(".")[1] || "";
                valid = (dotText.length === o.digit);
            }
        }
        return valid;
    },

    _setBlueTrack: function (percent) {
        this.blueTrack.element.css({width: percent + "%"});
    },

    _setLabelPosition: function (percent) {
        // this.label.element.css({left: percent + "%"});
    },

    _setSliderPosition: function (percent) {
        this.slider.element.css({left: percent + "%"});
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
        return this.grayTrack.element[0].scrollWidth;
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
        var o = this.options;
        v = BI.parseFloat(v);
        v = o.digit === false ? v : v.toFixed(o.digit);
        if ((!isNaN(v))) {
            if (this._checkValidation(v)) {
                this.value = v;
            }
            if (v > this.max) {
                this.value = this.max;
            }
            if (v < this.min) {
                this.value = this.min;
            }
        }
    },

    _setEnable: function (b) {
        BI.SingleSlider.superclass._setEnable.apply(this, [b]);
        if(b) {
            this.blueTrack.element.removeClass("disabled-blue-track").addClass("blue-track");
        } else {
            this.blueTrack.element.removeClass("blue-track").addClass("disabled-blue-track");
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
        var o = this.options;
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this._setVisible(true);
            this.enable = true;
            if (o.digit) {
                this.label.setErrorText(BI.i18nText("BI-Basic_Please_Enter_Number_Between", this.min, this.max));
            } else {
                this.label.setErrorText(BI.i18nText("BI-Basic_Please_Enter_Integer_Number_Between", this.min, this.max));
            }

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
BI.shortcut("bi.single_slider", BI.SingleSlider);