/**
 * Created by zcf on 2016/9/26.
 */
BI.IntervalSlider = BI.inherit(BI.Single, {
    _constant: {
        EDITOR_WIDTH: 58,
        EDITOR_R_GAP: 60,
        EDITOR_HEIGHT: 20,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },

    props: {
        baseCls: "bi-interval-slider bi-slider-track",
        digit: false,
        unit: ""
    },

    render: function () {

        var self = this;
        var c = this._constant;
        this.enable = false;
        this.valueOne = "";
        this.valueTwo = "";
        this.calculation = new BI.AccurateCalculationModel();

        // this.backgroundTrack = BI.createWidget({
        //     type: "bi.layout",
        //     cls: "background-track",
        //     height: c.TRACK_HEIGHT
        // });
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

        this.labelOne = BI.createWidget({
            type: "bi.sign_text_editor",
            cls: "slider-editor-button",
            text: this.options.unit,
            allowBlank: false,
            width: c.EDITOR_WIDTH - 2,
            height: c.EDITOR_HEIGHT - 2,
            validationChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.labelOne.element.hover(function () {
            self.labelOne.element.removeClass("bi-border").addClass("bi-border");
        }, function () {
            self.labelOne.element.removeClass("bi-border");
        });
        this.labelOne.on(BI.Editor.EVENT_CONFIRM, function () {
            var oldValueOne = self.valueOne;
            var v = BI.parseFloat(this.getValue());
            self.valueOne = v;
            var percent = self._getPercentByValue(v);
            var significantPercent = BI.parseFloat(percent.toFixed(1));// 分成1000份
            self._setSliderOnePosition(significantPercent);
            self._setBlueTrack();
            self._checkLabelPosition(oldValueOne, self.valueTwo, self.valueOne, self.valueTwo);
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
        });

        this.labelTwo = BI.createWidget({
            type: "bi.sign_text_editor",
            cls: "slider-editor-button",
            text: this.options.unit,
            allowBlank: false,
            width: c.EDITOR_WIDTH - 2,
            height: c.EDITOR_HEIGHT - 2,
            validationChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.labelTwo.element.hover(function () {
            self.labelTwo.element.removeClass("bi-border").addClass("bi-border");
        }, function () {
            self.labelTwo.element.removeClass("bi-border");
        });
        this.labelTwo.on(BI.Editor.EVENT_CONFIRM, function () {
            var oldValueTwo = self.valueTwo;
            var v = BI.parseFloat(this.getValue());
            self.valueTwo = v;
            var percent = self._getPercentByValue(v);
            var significantPercent = BI.parseFloat(percent.toFixed(1));
            self._setSliderTwoPosition(significantPercent);
            self._setBlueTrack();
            self._checkLabelPosition(self.valueOne, oldValueTwo, self.valueOne, self.valueTwo);
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
        });

        this.sliderOne = BI.createWidget({
            type: "bi.single_slider_button"
        });
        this.sliderTwo = BI.createWidget({
            type: "bi.single_slider_button"
        });
        this._draggable(this.sliderOne, true);
        this._draggable(this.sliderTwo, false);
        this._setVisible(false);

        return {
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
                top: 23,
                left: 0,
                width: "100%"
            },
                this._createLabelWrapper(),
                this._createSliderWrapper()
            ]
        };
    },

    _rePosBySizeAfterMove: function (size, isLeft) {
        var o = this.options;
        var percent = size * 100 / (this._getGrayTrackLength());
        var significantPercent = BI.parseFloat(percent.toFixed(1));
        var v = this._getValueByPercent(significantPercent);
        v = this._assertValue(v);
        v = o.digit === false ? v : v.toFixed(o.digit);
        var oldValueOne = this.valueOne, oldValueTwo = this.valueTwo;
        if(isLeft) {
            this._setSliderOnePosition(significantPercent);
            this.labelOne.setValue(v);
            this.valueOne = v;
            this._checkLabelPosition(oldValueOne, oldValueTwo, v, this.valueTwo);
        }else{
            this._setSliderTwoPosition(significantPercent);
            this.labelTwo.setValue(v);
            this.valueTwo = v;
            this._checkLabelPosition(oldValueOne, oldValueTwo, this.valueOne, v);
        }
        this._setBlueTrack();
    },

    _rePosBySizeAfterStop: function (size, isLeft) {
        var percent = size * 100 / (this._getGrayTrackLength());
        var significantPercent = BI.parseFloat(percent.toFixed(1));
        isLeft ? this._setSliderOnePosition(significantPercent) : this._setSliderTwoPosition(significantPercent);
    },

    _draggable: function (widget, isLeft) {
        var self = this, o = this.options;
        var startDrag = false;
        var size = 0, offset = 0, defaultSize = 0;
        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX) {
            if (mouseMoveTracker.isDragging()) {
                startDrag = true;
                offset += deltaX;
                size = optimizeSize(defaultSize + offset);
                widget.element.addClass("dragging");
                self._rePosBySizeAfterMove(size, isLeft);
            }
        }, function () {
            if (startDrag === true) {
                size = optimizeSize(size);
                self._rePosBySizeAfterStop(size, isLeft);
                size = 0;
                offset = 0;
                defaultSize = size;
                startDrag = false;
            }
            widget.element.removeClass("dragging");
            mouseMoveTracker.releaseMouseMoves();
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
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

    _createLabelWrapper: function () {
        var c = this._constant;
        return {
            el: {
                type: "bi.vertical",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: this.labelOne,
                        top: 0,
                        left: "0%"
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: this.labelTwo,
                        top: 0,
                        left: "100%"
                    }]
                }],
                rgap: c.EDITOR_R_GAP,
                height: c.SLIDER_HEIGHT
            },
            top: 0,
            left: 0,
            width: "100%"
        };
    },

    _createSliderWrapper: function () {
        var c = this._constant;
        return {
            el: {
                type: "bi.vertical",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: this.sliderOne,
                        top: 0,
                        left: "0%"
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: this.sliderTwo,
                        top: 0,
                        left: "100%"
                    }]
                }],
                hgap: c.SLIDER_WIDTH_HALF,
                height: c.SLIDER_HEIGHT
            },
            top: 20,
            left: 0,
            width: "100%"
        };
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
        // 像90.这样的既不属于整数又不属于小数，是不合法的值
        var dotText = (v + "").split(".")[1];
        if (BI.isEmptyString(dotText)) {
        }else{
            if (BI.isNumeric(v) && !(BI.isNull(v) || v < this.min || v > this.max)) {
                // 虽然规定了所填写的小数位数，但是我们认为所有的整数都是满足设置的小数位数的
                // 100等价于100.0 100.00 100.000
                if(o.digit === false || BI.isInteger(v)) {
                    valid = true;
                }else{
                    dotText = dotText || "";
                    valid = (dotText.length === o.digit);
                }
            }
        }
        return valid;
    },

    _checkOverlap: function () {
        var labelOneLeft = this.labelOne.element[0].offsetLeft;
        var labelTwoLeft = this.labelTwo.element[0].offsetLeft;
        if (labelOneLeft <= labelTwoLeft) {
            if ((labelTwoLeft - labelOneLeft) < 90) {
                this.labelTwo.element.css({top: 40});
            } else {
                this.labelTwo.element.css({top: 0});
            }
        } else {
            if ((labelOneLeft - labelTwoLeft) < 90) {
                this.labelTwo.element.css({top: 40});
            } else {
                this.labelTwo.element.css({top: 0});
            }
        }
    },

    _checkLabelPosition: function (oldValueOne, oldValueTwo, valueOne, valueTwo, isLeft) {
        oldValueOne = BI.parseFloat(oldValueOne);
        oldValueTwo = BI.parseFloat(oldValueTwo);
        valueOne = BI.parseFloat(valueOne);
        valueTwo = BI.parseFloat(valueTwo);
        if((oldValueOne <= oldValueTwo && valueOne > valueTwo) || (oldValueOne >= oldValueTwo && valueOne < valueTwo)) {
            var isSliderOneLeft = BI.parseFloat(this.labelOne.getValue()) < BI.parseFloat(this.labelTwo.getValue());
            this._resetLabelPosition(!isSliderOneLeft);
        }
    },

    _resetLabelPosition: function(needReverse) {
        this.labelOne.element.css({left: needReverse ? "100%" : "0%"});
        this.labelTwo.element.css({left: needReverse ? "0%" : "100%"});
    },

    _setSliderOnePosition: function (percent) {
        this.sliderOne.element.css({left: percent + "%"});
    },

    _setSliderTwoPosition: function (percent) {
        this.sliderTwo.element.css({left: percent + "%"});
    },

    _setBlueTrackLeft: function (percent) {
        this.blueTrack.element.css({left: percent + "%"});
    },

    _setBlueTrackWidth: function (percent) {
        this.blueTrack.element.css({width: percent + "%"});
    },

    _setBlueTrack: function () {
        var percentOne = this._getPercentByValue(this.labelOne.getValue());
        var percentTwo = this._getPercentByValue(this.labelTwo.getValue());
        if (percentOne <= percentTwo) {
            this._setBlueTrackLeft(percentOne);
            this._setBlueTrackWidth(percentTwo - percentOne);
        } else {
            this._setBlueTrackLeft(percentTwo);
            this._setBlueTrackWidth(percentOne - percentTwo);
        }
    },

    _setAllPosition: function (one, two) {
        this._setSliderOnePosition(one);
        this._setSliderTwoPosition(two);
        this._setBlueTrack();
    },

    _setVisible: function (visible) {
        this.sliderOne.setVisible(visible);
        this.sliderTwo.setVisible(visible);
        this.labelOne.setVisible(visible);
        this.labelTwo.setVisible(visible);
    },

    _setErrorText: function () {
        var errorText = BI.i18nText("BI-Basic_Please_Enter_Number_Between", this.min, this.max);
        this.labelOne.setErrorText(errorText);
        this.labelTwo.setErrorText(errorText);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth;
    },

    // 其中取max-min后保留4为有效数字后的值的小数位数为最终value的精度
    // 端点处的值有可能因为min,max相差量级很大(precision很大)而丢失精度，此时直接返回端点值即可
    _getValueByPercent: function (percent) {// return (((max-min)*percent)/100+min)
        if (percent === 0) {
            return this.min;
        }
        if (percent === 100) {
            return this.max;
        }
        var sub = this.calculation.accurateSubtraction(this.max, this.min);
        var mul = this.calculation.accurateMultiplication(sub, percent);
        var div = this.calculation.accurateDivisionTenExponent(mul, 2);
        if(this.precision < 0) {
            var value = BI.parseFloat(this.calculation.accurateAddition(div, this.min));
            var reduceValue = Math.round(this.calculation.accurateDivisionTenExponent(value, -this.precision));
            return this.calculation.accurateMultiplication(reduceValue, Math.pow(10, -this.precision));
        }
        return BI.parseFloat(this.calculation.accurateAddition(div, this.min).toFixed(this.precision));

    },

    _getPercentByValue: function (v) {
        return (v - this.min) * 100 / (this.max - this.min);
    },

    _getPrecision: function () {
        // 计算每一份值的精度(最大值和最小值的差值保留4为有效数字后的精度)
        // 如果差值的整数位数大于4,toPrecision(4)得到的是科学计数法123456 => 1.235e+5
        // 返回非负值: 保留的小数位数
        // 返回负值: 保留的10^n精度中的n
        var sub = this.calculation.accurateSubtraction(this.max, this.min);
        var pre = sub.toPrecision(4);
        // 科学计数法
        var eIndex = pre.indexOf("e");
        var arr = [];
        if(eIndex > -1) {
            arr = pre.split("e");
            var decimalPartLength = BI.size(arr[0].split(".")[1]);
            var sciencePartLength = BI.parseInt(arr[1].substring(1));
            return decimalPartLength - sciencePartLength;
        }
        arr = pre.split(".");
        return arr.length > 1 ? arr[1].length : 0;

    },

    _assertValue: function (value) {
        if(value <= this.min) {
            return this.min;
        }
        if(value >= this.max) {
            return this.max;
        }
        return value;
    },

    _setEnable: function (b) {
        BI.IntervalSlider.superclass._setEnable.apply(this, [b]);
        if(b) {
            this.blueTrack.element.removeClass("disabled-blue-track").addClass("blue-track");
        } else {
            this.blueTrack.element.removeClass("blue-track").addClass("disabled-blue-track");
        }
    },

    getValue: function () {
        if (this.valueOne <= this.valueTwo) {
            return {min: this.valueOne, max: this.valueTwo};
        }
        return {min: this.valueTwo, max: this.valueOne};

    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber >= minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
            this.valueOne = minNumber;
            this.valueTwo = maxNumber;
            this.precision = this._getPrecision();
            this.setEnable(true);
        }
        if (maxNumber === minNumber) {
            this.setEnable(false);
        }
    },

    setValue: function (v) {
        var o = this.options;
        var valueOne = BI.parseFloat(v.min);
        var valueTwo = BI.parseFloat(v.max);
        valueOne = o.digit === false ? valueOne : BI.parseFloat(valueOne.toFixed(o.digit));
        valueTwo = o.digit === false ? valueTwo : BI.parseFloat(valueTwo.toFixed(o.digit));
        if (!isNaN(valueOne) && !isNaN(valueTwo)) {
            if (this._checkValidation(valueOne)) {
                this.valueOne = (this.valueOne <= this.valueTwo ? valueOne : valueTwo);
            }
            if (this._checkValidation(valueTwo)) {
                this.valueTwo = (this.valueOne <= this.valueTwo ? valueTwo : valueOne);
            }
            if (valueOne < this.min) {
                this.valueOne = this.min;
            }
            if (valueTwo > this.max) {
                this.valueTwo = this.max;
            }
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.valueOne = "";
        this.valueTwo = "";
        this.min = NaN;
        this.max = NaN;
        this._setBlueTrackWidth(0);
    },

    populate: function () {
        var o = this.options;
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this.enable = true;
            this._setVisible(true);
            this._setErrorText();
            if ((BI.isNumeric(this.valueOne) || BI.isNotEmptyString(this.valueOne)) && (BI.isNumeric(this.valueTwo) || BI.isNotEmptyString(this.valueTwo))) {
                this.labelOne.setValue(o.digit === false ? this.valueOne : BI.parseFloat(this.valueOne).toFixed(o.digit));
                this.labelTwo.setValue(o.digit === false ? this.valueTwo : BI.parseFloat(this.valueTwo).toFixed(o.digit));
                this._setAllPosition(this._getPercentByValue(this.valueOne), this._getPercentByValue(this.valueTwo));
            } else {
                this.labelOne.setValue(this.min);
                this.labelTwo.setValue(this.max);
                this._setAllPosition(0, 100);
            }
            this._resetLabelPosition(this.valueOne > this.valueTwo);
        }
    }
});
BI.IntervalSlider.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.interval_slider", BI.IntervalSlider);