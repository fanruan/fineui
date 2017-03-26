//小于号的值为：0，小于等于号的值为:1
//closeMIn：最小值的符号，closeMax：最大值的符号
/**
 * Created by roy on 15/9/17.
 *
 */
BI.NumericalInterval = BI.inherit(BI.Single, {
    constants: {
        typeError: "typeBubble",
        numberError: "numberBubble",
        signalError: "signalBubble",
        editorWidth: 114,
        columns: 5,
        width: 30,
        rows: 1,
        numberErrorCls: "number-error",
        border: 1,
        less: 0,
        less_equal: 1,
        numTip: ""
    },
    _defaultConfig: function () {
        var conf = BI.NumericalInterval.superclass._defaultConfig.apply(this, arguments)
        return BI.extend(conf, {
            extraCls: "bi-numerical-interval",
            height: 25

        })
    },
    _init: function () {
        var self = this, c = this.constants, o = this.options;
        BI.NumericalInterval.superclass._init.apply(this, arguments)
        this.smallEditor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height - 2,
            watermark: BI.i18nText("BI-Unrestricted"),
            allowBlank: true,
            value: o.min,
            level: "warning",
            tipType: "warning",
            quitChecker: function () {
                return false;
            },
            validationChecker: function (v) {
                if (!BI.isNumeric(v)) {
                    self.smallEditorBubbleType = c.typeError;
                    return false;
                }
                return true;
            },
            cls: "numerical-interval-small-editor"
        });

        this.smallTip = BI.createWidget({
            type: "bi.label",
            text: o.numTip,
            height: o.height - 2,
            invisible: true
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.smallEditor.element,
            items: [{
                el: this.smallTip,
                top: 0,
                right: 5
            }]
        });

        this.bigEditor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height - 2,
            watermark: BI.i18nText("BI-Unrestricted"),
            allowBlank: true,
            value: o.max,
            level: "warning",
            tipType: "warning",
            quitChecker: function () {
                return false;
            },
            validationChecker: function (v) {
                if (!BI.isNumeric(v)) {
                    self.bigEditorBubbleType = c.typeError;
                    return false;
                }
                return true;
            },
            cls: "numerical-interval-big-editor"
        });

        this.bigTip = BI.createWidget({
            type: "bi.label",
            text: o.numTip,
            height: o.height - 2,
            invisible: true
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.bigEditor.element,
            items: [{
                el: this.bigTip,
                top: 0,
                right: 5
            }]
        });

        //this.smallCombo = BI.createWidget({
        //    type: "bi.numerical_interval_combo",
        //    cls: "numerical-interval-small-combo",
        //    height: o.height,
        //    value: o.closemin ? 1 : 0,
        //    offsetStyle: "left"
        //});
        //
        //this.bigCombo = BI.createWidget({
        //    type: "bi.numerical_interval_combo",
        //    cls: "numerical-interval-big-combo",
        //    height: o.height,
        //    value: o.closemax ? 1 : 0,
        //    offsetStyle: "left"
        //});
        this.smallCombo = BI.createWidget({
            type: "bi.icon_combo",
            cls: "numerical-interval-small-combo",
            height: o.height - 2,
            items: [{
                text: "(" + BI.i18nText("BI-Less_Than") + ")",
                iconClass: "less-font",
                value: 0
            }, {
                text: "(" + BI.i18nText("BI-Less_And_Equal") + ")",
                value: 1,
                iconClass: "less-equal-font"
            }]
        });
        if (o.closemin === true) {
            this.smallCombo.setValue(1);
        } else {
            this.smallCombo.setValue(0);
        }
        this.bigCombo = BI.createWidget({
            type: "bi.icon_combo",
            cls: "numerical-interval-big-combo",
            height: o.height - 2,
            items: [{
                text: "(" + BI.i18nText("BI-Less_Than") + ")",
                iconClass: "less-font",
                value: 0
            }, {
                text: "(" + BI.i18nText("BI-Less_And_Equal") + ")",
                value: 1,
                iconClass: "less-equal-font"
            }]
        });
        if (o.closemax === true) {
            this.bigCombo.setValue(1);
        } else {
            this.bigCombo.setValue(0);
        }
        this.label = BI.createWidget({
            type: "bi.label",
            text: BI.i18nText("BI-Value"),
            textHeight: o.height - c.border * 2,
            width: c.width - c.border * 2,
            height: o.height - c.border * 2,
            level: "warning",
            tipType: "warning"
        });
        this.left = BI.createWidget({
            type: "bi.htape",
            items: [{
                el: self.smallEditor
            }, {
                el: self.smallCombo,
                width: c.width - c.border * 2
            }]

        });
        this.right = BI.createWidget({
            type: "bi.htape",
            items: [{
                el: self.bigCombo,
                width: c.width - c.border * 2
            }, {
                el: self.bigEditor
            }]
        });


        BI.createWidget({
            element: self,
            type: "bi.center",
            hgap: 15,
            height: o.height,
            items: [
                {
                    type: "bi.absolute",
                    items: [{
                        el: self.left,
                        left: -15,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: self.right,
                        left: 0,
                        right: -15,
                        top: 0,
                        bottom: 0
                    }]
                }
            ]
        });

        BI.createWidget({
            element: self,
            type: "bi.horizontal_auto",
            items: [
                self.label
            ]
        });


        self._setValidEvent(self.bigEditor, c.bigEditor);
        self._setValidEvent(self.smallEditor, c.smallEditor);
        self._setErrorEvent(self.bigEditor, c.bigEditor);
        self._setErrorEvent(self.smallEditor, c.smallEditor);
        self._setBlurEvent(self.bigEditor);
        self._setBlurEvent(self.smallEditor);
        self._setFocusEvent(self.bigEditor);
        self._setFocusEvent(self.smallEditor);
        self._setComboValueChangedEvent(self.bigCombo);
        self._setComboValueChangedEvent(self.smallCombo);
        self._setEditorValueChangedEvent(self.bigEditor);
        self._setEditorValueChangedEvent(self.smallEditor);
    },

    _checkValidation: function () {
        var self = this, c = this.constants, o = this.options;
        self._setTitle("");
        BI.Bubbles.hide(c.typeError);
        BI.Bubbles.hide(c.numberError);
        BI.Bubbles.hide(c.signalError);
        if (!self.smallEditor.isValid() || !self.bigEditor.isValid()) {
            self.element.removeClass("number-error");
            o.validation = "invalid";
            return c.typeError;
        } else {
            if (BI.isEmptyString(self.smallEditor.getValue()) || BI.isEmptyString(self.bigEditor.getValue())) {
                self.element.removeClass("number-error");
                o.validation = "valid";
                return "";
            } else {
                var smallValue = parseFloat(self.smallEditor.getValue()), bigValue = parseFloat(self.bigEditor.getValue()),
                    bigComboValue = self.bigCombo.getValue(), smallComboValue = self.smallCombo.getValue();
                if (bigComboValue[0] === c.less_equal && smallComboValue[0] === c.less_equal) {
                    if (smallValue > bigValue) {
                        self.element.addClass("number-error");
                        o.validation = "invalid";
                        return c.numberError;
                    } else {
                        self.element.removeClass("number-error");
                        o.validation = "valid";
                        return "";
                    }
                } else {
                    if (smallValue > bigValue) {
                        self.element.addClass("number-error");
                        o.validation = "invalid";
                        return c.numberError;
                    } else if (smallValue === bigValue) {
                        self.element.addClass("number-error");
                        o.validation = "invalid";
                        return c.signalError;
                    } else {
                        self.element.removeClass("number-error");
                        o.validation = "valid";
                        return "";
                    }
                }
            }

        }
    },

    _setTitle: function (v) {
        var self = this;
        self.bigEditor.setTitle(v);
        self.smallEditor.setTitle(v);
        self.label.setTitle(v);
    },

    _setFocusEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.SignEditor.EVENT_FOCUS, function () {
            self._setTitle("");
            switch (self._checkValidation()) {
                case c.typeError:
                    BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                default :
                    return
            }

        })
    },
    _setBlurEvent: function (w) {
        var c = this.constants, self = this;
        w.on(BI.SignEditor.EVENT_BLUR, function () {
            BI.Bubbles.hide(c.typeError);
            BI.Bubbles.hide(c.numberError);
            BI.Bubbles.hide(c.signalError);
            switch (self._checkValidation()) {
                case c.typeError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Input_Data"));
                    break;
                case c.numberError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Number_Value"));
                    break;
                case c.signalError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Signal_Value"));
                    break;
                default:
                    self._setTitle("");
            }
        })
    },

    _setErrorEvent: function (w) {
        var c = this.constants, self = this
        w.on(BI.SignEditor.EVENT_ERROR, function () {
            self._checkValidation();
            BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                offsetStyle: "center"
            });
            self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
        })
    },


    _setValidEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.SignEditor.EVENT_VALID, function () {
            switch (self._checkValidation()) {
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                default:
                    self.fireEvent(BI.NumericalInterval.EVENT_VALID);
            }
        })
    },


    _setEditorValueChangedEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.SignEditor.EVENT_CHANGE, function () {
            switch (self._checkValidation()) {
                case c.typeError:
                    BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                default :
                    break;
            }
            self.fireEvent(BI.NumericalInterval.EVENT_CHANGE);
        });
    },

    _setComboValueChangedEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.IconCombo.EVENT_CHANGE, function () {
            switch (self._checkValidation()) {
                case c.typeError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Input_Data"));
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                case c.numberError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Number_Value"));
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                case c.signalError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Signal_Value"));
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                default :
                    self.fireEvent(BI.NumericalInterval.EVENT_CHANGE);
                    self.fireEvent(BI.NumericalInterval.EVENT_VALID);
            }
        })
    },


    isValid: function () {
        return this.options.validation === "valid";
    },

    setEnable: function (b) {
        this.smallEditor.setEnable(b);
        this.smallCombo.setEnable(b);
        this.bigEditor.setEnable(b);
        this.bigCombo.setEnable(b);
    },

    setMinEnable: function (b) {
        this.smallEditor.setEnable(b);
    },

    setCloseMinEnable: function (b) {
        this.smallCombo.setEnable(b);
    },

    setMaxEnable: function (b) {
        this.bigEditor.setEnable(b);
    },

    setCloseMaxEnable: function (b) {
        this.bigCombo.setEnable(b);
    },

    showNumTip: function () {
        this.smallTip.setVisible(true);
        this.bigTip.setVisible(true);
    },

    hideNumTip: function () {
        this.smallTip.setVisible(false);
        this.bigTip.setVisible(false);
    },

    setNumTip: function(numTip) {
        this.smallTip.setText(numTip);
        this.bigTip.setText(numTip);
    },

    getNumTip: function() {
        return this.smallTip.getText();
    },

    setValue: function (data) {
        data = data || {};
        var self = this, combo_value;
        if (BI.isNumeric(data.min) || BI.isEmptyString(data.min)) {
            self.smallEditor.setValue(data.min);
        }

        if (!BI.isNotNull(data.min)) {
            self.smallEditor.setValue("");
        }

        if (BI.isNumeric(data.max) || BI.isEmptyString(data.max)) {
            self.bigEditor.setValue(data.max);
        }

        if (!BI.isNotNull(data.max)) {
            self.bigEditor.setValue("");
        }

        if (!BI.isNull(data.closemin)) {
            if (data.closemin === true) {
                combo_value = 1
            } else {
                combo_value = 0
            }
            self.smallCombo.setValue(combo_value);
        }

        if (!BI.isNull(data.closemax)) {
            if (data.closemax === true) {
                combo_value = 1
            } else {
                combo_value = 0
            }
            self.bigCombo.setValue(combo_value);
        }
    },


    getValue: function () {
        var self = this, value = {}, minComboValue = self.smallCombo.getValue(), maxComboValue = self.bigCombo.getValue();
        value.min = self.smallEditor.getValue();
        value.max = self.bigEditor.getValue();
        if (minComboValue[0] === 0) {
            value.closemin = false
        } else {
            value.closemin = true
        }

        if (maxComboValue[0] === 0) {
            value.closemax = false
        } else {
            value.closemax = true
        }
        return value;
    }
});
BI.NumericalInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.NumericalInterval.EVENT_VALID = "EVENT_VALID";
BI.NumericalInterval.EVENT_ERROR = "EVENT_ERROR";
$.shortcut("bi.numerical_interval", BI.NumericalInterval);