/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimePopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateTimePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-date-time-popup',
            width: 268,
            height: 290
        });
    },
    _init: function () {
        BI.DateTimePopup.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.cancelButton = BI.createWidget({
            type: 'bi.text_button',
            forceCenter: true,
            cls: 'multidate-popup-button bi-border-top bi-border-right',
            shadow: true,
            text: BI.i18nText("BI-Basic_Cancel")
        });
        this.cancelButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.BUTTON_CANCEL_EVENT_CHANGE);
        });

        this.okButton = BI.createWidget({
            type: "bi.text_button",
            forceCenter: true,
            cls: 'multidate-popup-button bi-border-top',
            shadow: true,
            text: BI.i18nText("BI-Basic_OK")
        });
        this.okButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.BUTTON_OK_EVENT_CHANGE);
        });

        this.dateCombo = BI.createWidget({
            type: "bi.date_calendar_popup",
            min: self.options.min,
            max: self.options.max
        });
        self.dateCombo.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
        });

        this.dateSelect = BI.createWidget({
            type: "bi.vertical_adapt",
            cls: "bi-border-top",
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Basic_Time"),
                width: 45
            }, {
                type: "bi.date_time_select",
                max: 23,
                min: 0,
                width: 60,
                height: 30,
                listeners: [{
                    eventName: BI.DateTimeSelect.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
                    }
                }],
                ref: function (_ref) {
                    self.hour = _ref;
                }
            }, {
                type: "bi.label",
                text: ":",
                width: 15
            }, {
                type: "bi.date_time_select",
                max: 59,
                min: 0,
                width: 60,
                height: 30,
                listeners: [{
                    eventName: BI.DateTimeSelect.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
                    }
                }],
                ref: function (_ref) {
                    self.minute = _ref;
                }
            }, {
                type: "bi.label",
                text: ":",
                width: 15
            }, {
                type: "bi.date_time_select",
                max: 59,
                min: 0,
                width: 60,
                height: 30,
                listeners: [{
                    eventName: BI.DateTimeSelect.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
                    }
                }],
                ref: function (_ref) {
                    self.second = _ref;
                }
            }]
        });

        var date = Date.getDate();
        this.dateCombo.setValue({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        });
        this.hour.setValue(date.getHours());
        this.minute.setValue(date.getMinutes());
        this.second.setValue(date.getSeconds());

        this.dateButton = BI.createWidget({
            type: "bi.grid",
            items: [[this.cancelButton, this.okButton]]
        });
        BI.createWidget({
            element: this,
            type: "bi.vtape",
            items: [{
                el: this.dateCombo
            }, {
                el: this.dateSelect,
                height: 50
            }, {
                el: this.dateButton,
                height: 30
            }]
        });
    },

    setValue: function (v) {
        var value = v, date;
        if (BI.isNull(value)) {
            date = Date.getDate();
            this.dateCombo.setValue({
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate()
            });
            this.hour.setValue(date.getHours());
            this.minute.setValue(date.getMinutes());
            this.second.setValue(date.getSeconds());
        } else {
            this.dateCombo.setValue({
                year: value.year,
                month: value.month,
                day: value.day
            });
            this.hour.setValue(value.hour);
            this.minute.setValue(value.minute);
            this.second.setValue(value.second);
        }
    },

    getValue: function () {
        return {
            year: this.dateCombo.getValue().year,
            month: this.dateCombo.getValue().month,
            day: this.dateCombo.getValue().day,
            hour: this.hour.getValue(),
            minute: this.minute.getValue(),
            second: this.second.getValue()
        }
    }
});
BI.DateTimePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DateTimePopup.BUTTON_CANCEL_EVENT_CHANGE = "BUTTON_CANCEL_EVENT_CHANGE";
BI.DateTimePopup.CALENDAR_EVENT_CHANGE = "CALENDAR_EVENT_CHANGE";
BI.shortcut('bi.date_time_popup', BI.DateTimePopup);
