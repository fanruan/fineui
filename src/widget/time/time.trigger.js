!(function () {
    BI.TimeTrigger = BI.inherit(BI.Trigger, {

        _const: {
            COMPARE_FORMAT: "%H:%M:%S",
            COMPLETE_COMPARE_FORMAT: "%Y-%M-%d %H:%M:%S %P",
            FORMAT_ARRAY: [
                "%H:%M:%S",  // HH:mm:ss
                "%I:%M:%S",  // hh:mm:ss
                "%l:%M:%S",  // h:mm:ss
                "%k:%M:%S",  // H:mm:ss
                "%l:%M:%S %p",  // h:mm:ss a
                "%l:%M:%S %P",  // h:mm:ss a
                "%H:%M:%S %p",  // HH:mm:ss a
                "%H:%M:%S %P",  // HH:mm:ss a
                "%l:%M",  // h:mm
                "%k:%M",  // H:mm
                "%I:%M",  // hh:mm
                "%H:%M",  // HH:mm
                "%M:%S"   // mm:ss
            ],
            DEFAULT_DATE_STRING: "2000-01-01",
            DEFAULT_HOUR: "00"
        },

        props: {
            extraCls: "bi-time-trigger",
            value: {},
            format: "",
            allowEdit: false
        },

        render: function () {
            var self = this, o = this.options;
            this.storeTriggerValue = "";
            this.storeValue = o.value;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.sign_editor",
                        height: o.height,
                        validationChecker: function (v) {
                            return self._dateCheck(v);
                        },
                        quitChecker: function () {
                            return false;
                        },
                        ref: function (_ref) {
                            self.editor = _ref;
                        },
                        value: this._formatValue(o.value),
                        hgap: 4,
                        allowBlank: true,
                        watermark: BI.isKey(o.watermark) ? o.watermark : BI.i18nText("BI-Basic_Unrestricted"),
                        title: BI.bind(this._getTitle, this),
                        listeners: [{
                            eventName: "EVENT_KEY_DOWN",
                            action: function () {
                                self.fireEvent("EVENT_KEY_DOWN", arguments);
                            }
                        }, {
                            eventName: "EVENT_FOCUS",
                            action: function () {
                                self.storeTriggerValue = self.getKey();
                                self.fireEvent("EVENT_FOCUS");
                            }
                        }, {
                            eventName: "EVENT_BLUR",
                            action: function () {
                                self.fireEvent("EVENT_BLUR");
                            }
                        }, {
                            eventName: "EVENT_STOP",
                            action: function () {
                                self.fireEvent("EVENT_STOP");
                            }
                        }, {
                            eventName: "EVENT_VALID",
                            action: function () {
                                self.fireEvent("EVENT_VALID");
                            }
                        }, {
                            eventName: "EVENT_ERROR",
                            action: function () {
                                self.fireEvent("EVENT_ERROR");
                            }
                        }, {
                            eventName: "EVENT_CONFIRM",
                            action: function () {
                                var value = self.editor.getValue();
                                if (BI.isNotNull(value)) {
                                    self.editor.setState(value);
                                }
                                if (BI.isNotEmptyString(value) && !BI.isEqual(self.storeTriggerValue, self.getKey())) {
                                    var date = value.match(/\d+/g);
                                    self.storeValue = {
                                        hour: date[0] | 0,
                                        minute: date[1] | 0,
                                        second: date[2] | 0
                                    };
                                }
                                self.fireEvent("EVENT_CONFIRM");
                            }
                        }, {
                            eventName: "EVENT_START",
                            action: function () {
                                self.fireEvent("EVENT_START");
                            }
                        }, {
                            eventName: "EVENT_CHANGE",
                            action: function () {
                                self.fireEvent("EVENT_CHANGE");
                            }
                        }]
                    },
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }, {
                    el: {
                        type: "bi.text",
                        invisible: o.allowEdit,
                        cls: "show-text",
                        title: BI.bind(this._getTitle, this),
                        hgap: 4
                    },
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            };
        },

        _dateCheck: function (date) {
            var c = this._const;
            var self = this;
            return BI.any(c.FORMAT_ARRAY, function (idx, format) {
                return BI.print(BI.parseDateTime(c.DEFAULT_DATE_STRING + " " + self._getCompleteHMS(date, format), c.COMPLETE_COMPARE_FORMAT), format) === date;
            });
        },

        _getCompleteHMS: function (str, format) {
            var c = this._const;
            switch (format) {
                case "%M:%S":
                    str = c.DEFAULT_HOUR + ":" + str;
                    break;
                default:
                    break;
            }
            return str;
        },

        _getTitle: function () {
            var storeValue = this.storeValue || {};
            var date = BI.getDate();
            return BI.print(BI.getDate(date.getFullYear(), 0, 1, storeValue.hour, storeValue.minute, storeValue.second), this._getFormatString());
        },

        _getFormatString: function () {
            return this.options.format || this._const.COMPARE_FORMAT;
        },

        _formatValue: function (v) {
            var now = BI.getDate();
            return BI.isNotEmptyObject(v) ? BI.print(BI.getDate(now.getFullYear(), now.getMonth(), now.getDay(), v.hour, v.minute, v.second), this._getFormatString()) : "";
        },

        getKey: function () {
            return this.editor.getValue();
        },

        setValue: function (v) {
            this.storeValue = v;
            this.editor.setValue(this._formatValue(v));
        },

        getValue: function () {
            return this.storeValue;
        },

        focus: function () {
            this.editor.focus();
        },
    
        blur: function () {
            this.editor.blur();
        },

        setWaterMark: function (v) {
            this.editor.setWaterMark(v);
        }
    });
    BI.shortcut("bi.time_trigger", BI.TimeTrigger);
})();