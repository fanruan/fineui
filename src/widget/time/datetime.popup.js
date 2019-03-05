!(function () {
    BI.TimePopup = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-date-time-popup",
            height: 68
        },
        render: function () {
            var self = this, o = this.options;

            return {
                type: "bi.vtape",
                items: [{
                    el: {
                        type: "bi.center_adapt",
                        cls: "bi-split-top",
                        items: [{
                            type: "bi.dynamic_date_time_select",
                            value: o.value,
                            ref: function (_ref) {
                                self.timeSelect = _ref;
                            }
                        }]
                    },
                    hgap: 10,
                    height: 44
                }, {
                    el: {
                        type: "bi.grid",
                        items: [[{
                            type: "bi.text_button",
                            forceCenter: true,
                            cls: "bi-high-light bi-split-top",
                            shadow: true,
                            text: BI.i18nText("BI-Basic_Clears"),
                            listeners: [{
                                eventName: BI.TextButton.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.TimePopup.BUTTON_CLEAR_EVENT_CHANGE);
                                }
                            }]
                        }, {
                            type: "bi.text_button",
                            forceCenter: true,
                            cls: "bi-split-left bi-split-right bi-high-light bi-split-top",
                            shadow: true,
                            text: BI.i18nText("BI-Basic_Now"),
                            listeners: [{
                                eventName: BI.TextButton.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.TimePopup.BUTTON_NOW_EVENT_CHANGE);
                                }
                            }]
                        }, {
                            type: "bi.text_button",
                            forceCenter: true,
                            cls: "bi-high-light bi-split-top",
                            shadow: true,
                            text: BI.i18nText("BI-Basic_OK"),
                            listeners: [{
                                eventName: BI.TextButton.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.TimePopup.BUTTON_OK_EVENT_CHANGE);
                                }
                            }]
                        }]]
                    },
                    height: 24
                }]
            };
        },

        setValue: function (v) {
            var value = v;
            if (BI.isNull(value)) {
                var date = BI.getDate();
                this.timeSelect.setValue({
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    second: date.getSeconds()
                });
            } else {
                this.timeSelect.setValue({
                    hour: value.hour,
                    minute: value.minute,
                    second: value.second
                });
            }
        },

        getValue: function () {
            return this.timeSelect.getValue();
        }
    });
    BI.TimePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
    BI.TimePopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
    BI.TimePopup.BUTTON_NOW_EVENT_CHANGE = "BUTTON_NOW_EVENT_CHANGE";
    BI.TimePopup.CALENDAR_EVENT_CHANGE = "CALENDAR_EVENT_CHANGE";
    BI.shortcut("bi.time_popup", BI.TimePopup);
})();