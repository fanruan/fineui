BI.DynamicDatePane = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-dynamic-date-pane"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                el: {
                    type: "bi.linear_segment",
                    cls: "bi-border-bottom",
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
                                        month: date.getMonth(),
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
                        }
                    }],
                    ref: function () {
                        self.switch = this;
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
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self.fireEvent("EVENT_CHANGE");
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
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self.fireEvent("EVENT_CHANGE");
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

    setValue: function (v) {
        v = v || {};
        var type = v.type || BI.DynamicDateCombo.Static;
        var value = v.value || v;
        this.switch.setValue(type);
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
                        month: date.getMonth()
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
BI.shortcut("bi.dynamic_date_pane", BI.DynamicDatePane);

BI.extend(BI.DynamicDatePane, {
    Static: 1,
    Dynamic: 2
});