BI.DynamicDatePane = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-dynamic-date-pane",
        minDate: "1900-01-01",
        maxDate: "2099-12-31",
        supportDynamic: true
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vtape",
            items: [{
                el: {
                    type: "bi.linear_segment",
                    invisible: !o.supportDynamic,
                    cls: "bi-split-bottom",
                    height: 30,
                    items: BI.createItems([{
                        text: BI.i18nText("BI-Multi_Date_YMD"),
                        value: BI.DynamicDatePane.Static
                    }, {
                        text: BI.i18nText("BI-Basic_Dynamic_Title"),
                        value: BI.DynamicDatePane.Dynamic
                    }], {
                        textAlign: "center"
                    }),
                    listeners: [{
                        eventName: BI.ButtonGroup.EVENT_CHANGE,
                        action: function () {
                            var value = this.getValue()[0];
                            self.dateTab.setSelect(value);
                            switch (value) {
                                case BI.DynamicDatePane.Static:
                                    var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                                    self.ymd.setValue({
                                        year: date.getFullYear(),
                                        month: date.getMonth() + 1,
                                        day: date.getDate()
                                    });
                                    break;
                                case BI.DynamicDatePane.Dynamic:
                                    self.dynamicPane.setValue({
                                        year: 0
                                    });
                                    break;
                                default:
                                    break;
                            }
                            self.fireEvent(BI.DynamicDatePane.EVENT_CHANGE);
                        }
                    }],
                    ref: function () {
                        self.switcher = this;
                    }
                },
                height: o.supportDynamic ? 30 : 0
            }, {
                type: "bi.tab",
                ref: function () {
                    self.dateTab = this;
                },
                showIndex: BI.DynamicDatePane.Static,
                cardCreator: function (v) {
                    switch (v) {
                        case BI.DynamicDatePane.Static:
                            return {
                                type: "bi.static_date_pane_card",
                                min: o.minDate,
                                max: o.maxDate,
                                behaviors: o.behaviors,
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self.fireEvent(BI.DynamicDatePane.EVENT_CHANGE);
                                    }
                                }, {
                                    eventName: "EVENT_BEFORE_YEAR_MONTH_POPUPVIEW",
                                    action: function () {
                                        self.fireEvent(BI.DynamicDatePane.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW);
                                    }
                                }],
                                ref: function () {
                                    self.ymd = this;
                                }
                            };
                        case BI.DynamicDatePane.Dynamic:
                        default:
                            return {
                                type: "bi.vtape",
                                items: [{
                                    type: "bi.dynamic_date_card",
                                    min: o.minDate,
                                    max: o.maxDate,
                                    ref: function () {
                                        self.dynamicPane = this;
                                    }
                                }, {
                                    el: {
                                        type: "bi.center",
                                        items: [{
                                            type: "bi.text_button",
                                            cls: "bi-high-light bi-border-top",
                                            shadow: true,
                                            text: BI.i18nText("BI-Basic_Clear"),
                                            textHeight: 23,
                                            listeners: [{
                                                eventName: BI.TextButton.EVENT_CHANGE,
                                                action: function () {
                                                    self.setValue();
                                                    self.fireEvent(BI.DynamicDatePane.EVENT_CHANGE);
                                                }
                                            }]
                                        }, {
                                            type: "bi.text_button",
                                            cls: "bi-border-left bi-high-light bi-border-top",
                                            textHeight: 23,
                                            shadow: true,
                                            text: BI.i18nText("BI-Basic_OK"),
                                            listeners: [{
                                                eventName: BI.TextButton.EVENT_CHANGE,
                                                action: function () {
                                                    var type = self.dateTab.getSelect();
                                                    if (type === BI.DynamicDateCombo.Dynamic) {
                                                        self.dynamicPane.checkValidation(true) && self.fireEvent(BI.DynamicDatePopup.EVENT_CHANGE);
                                                    } else {
                                                        self.fireEvent(BI.DynamicDatePane.EVENT_CHANGE);
                                                    }
                                                }
                                            }]
                                        }]
                                    },
                                    height: 24
                                }]
                            };
                    }
                }
            }]
        };
    },

    created: function () {
        this.setValue(this.options.value);
    },

    _checkValueValid: function (value) {
        return BI.isNull(value) || BI.isEmptyObject(value) || BI.isEmptyString(value);
    },

    _checkValue: function (v) {
        switch (v.type) {
            case BI.DynamicDateCombo.Dynamic:
                return BI.isNotEmptyObject(v.value);
            case BI.DynamicDateCombo.Static:
            default:
                return true;
        }
    },

    setMinDate: function (minDate) {
        if (this.options.minDate !== minDate) {
            this.options.minDate = minDate;
            this.ymd.setMinDate(minDate);
        }
    },

    setMaxDate: function (maxDate) {
        if (this.options.maxDate !== maxDate) {
            this.options.maxDate = maxDate;
            this.ymd.setMaxDate(maxDate);
        }
    },

    setValue: function (v) {
        v = v || {};
        var type = v.type || BI.DynamicDateCombo.Static;
        var value = v.value || v;
        this.switcher.setValue(type);
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.dynamicPane.setValue(value);
                break;
            case BI.DynamicDateCombo.Static:
            default:
                if (this._checkValueValid(value)) {
                    var date = BI.getDate();
                    this.ymd.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1
                    });
                } else {
                    this.ymd.setValue(value);
                }
                break;
        }
    },

    getValue: function () {
        var type = this.dateTab.getSelect();
        return {
            type: type,
            value: type === BI.DynamicDatePane.Static ? this.dateTab.getValue() : this.dynamicPane.getValue()
        };
    }
});

BI.DynamicDatePane.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDatePane.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW = "EVENT_BEFORE_YEAR_MONTH_POPUPVIEW";

BI.shortcut("bi.dynamic_date_pane", BI.DynamicDatePane);

BI.extend(BI.DynamicDatePane, {
    Static: 1,
    Dynamic: 2
});
