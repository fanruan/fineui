BI.DynamicDatePane = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-dynamic-date-pane",
        minDate: "1900-01-01",
        maxDate: "2099-12-31",
        supportDynamic: true,
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
                height: 30
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
                                type: "bi.dynamic_date_card",
                                min: o.minDate,
                                max: o.maxDate,
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        if(self._checkValue(self.getValue())) {
                                            self.fireEvent(BI.DynamicDatePane.EVENT_CHANGE);
                                        }
                                    }
                                }],
                                ref: function () {
                                    self.dynamicPane = this;
                                }
                            };
                    }
                }
            }]
        };
    },

    mounted: function () {
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
        return {
            type: this.dateTab.getSelect(),
            value: this.dateTab.getValue()
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
