/**
 * Created by Urthur on 2017/9/12.
 */
BI.SingleSliderLabel = BI.inherit(BI.Single, {
    _constant: {
        EDITOR_WIDTH: 90,
        EDITOR_HEIGHT: 20,
        HEIGHT: 20,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24,
        TRACK_GAP_HALF: 7,
        TRACK_GAP: 14
    },
    _defaultConfig: function () {
        return BI.extend(BI.SingleSliderLabel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider-label bi-slider-track",
            digit: false,
            unit: ""
        });
    },
    _init: function () {
        BI.SingleSliderLabel.superclass._init.apply(this, arguments);

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
                self.label.setText(v + o.unit);
                self.value = v;
                self.fireEvent(BI.SingleSliderLabel.EVENT_CHANGE);
            }
        });
        this.label = BI.createWidget({
            type: "bi.label",
            height: c.HEIGHT,
            width: c.EDITOR_WIDTH - 2
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
                    hgap: c.TRACK_GAP_HALF,
                    height: c.TRACK_HEIGHT
                },
                top: 13,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 10,
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
        });
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
                self.label.setValue(v + o.unit);
                self.value = v;
                self.fireEvent(BI.SingleSliderLabel.EVENT_CHANGE);
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
            self.fireEvent(BI.SingleSliderLabel.EVENT_CHANGE);
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
        return BI.isNumeric(v) && !(BI.isNull(v) || v < this.min || v > this.max);
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

    _setEnable: function (b) {
        BI.SingleSliderLabel.superclass._setEnable.apply(this, [b]);
        if(b) {
            this.blueTrack.element.removeClass("disabled-blue-track").addClass("blue-track");
        } else {
            this.blueTrack.element.removeClass("blue-track").addClass("disabled-blue-track");
        }
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
            if (BI.isNumeric(this.value) || BI.isNotEmptyString(this.value)) {
                this.label.setValue(this.value + o.unit);
                this._setAllPosition(this._getPercentByValue(this.value));
            } else {
                this.label.setValue(this.max + o.unit);
                this._setAllPosition(100);
            }
        }
    }
});
BI.SingleSliderLabel.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_slider_label", BI.SingleSliderLabel);