/**
 * Created by Urthur on 2017/7/14.
 */
BI.MultiDateTimePopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 30,
        tabWidth: 42,
        titleHeight: 27,
        itemHeight: 30,
        triggerHeight: 24,
        buttonWidth: 90,
        buttonHeight: 25,
        popupHeight: 290,
        popupWidth: 270,
        comboAdjustHeight: 1,
        lgap: 2,
        border: 1
    },
    _defaultConfig: function () {
        return BI.extend(BI.MultiDateTimePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-date-time-popup',
            width: 268,
            height: 290
        });
    },
    _init: function () {
        BI.MultiDateTimePopup.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.cancelButton = BI.createWidget({
            type: 'bi.text_button',
            forceCenter: true,
            cls: 'bi-multidate-popup-button bi-border-top bi-border-right',
            shadow: true,
            text: BI.i18nText("BI-Basic_Cancel")
        });
        this.cancelButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiDateTimePopup.BUTTON_CANCEL_EVENT_CHANGE);
        });

        this.okButton = BI.createWidget({
            type: "bi.text_button",
            forceCenter: true,
            cls: 'bi-multidate-popup-button bi-border-top',
            shadow: true,
            text: BI.i18nText("BI-Basic_OK")
        });
        this.okButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiDateTimePopup.BUTTON_OK_EVENT_CHANGE);
        });

        this.dateCombo = BI.createWidget({
            type: "bi.date_calendar_popup",
            min: self.options.min,
            max: self.options.max
        });
        self.dateCombo.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiDateTimePopup.CALENDAR_EVENT_CHANGE);
        });

        this.dateSelect = BI.createWidget({
            type: "bi.horizontal",
            cls: "bi-border-top",
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Basic_Time"),
                width: 45
            },{
                type: "bi.multi_date_time_select",
                max: 23,
                min: 0,
                width: 60,
                height: 30,
                ref: function (_ref) {
                    self.hour = _ref;
                    self.hour.on(BI.MultiDateTimeSelect.EVENT_CONFIRM, function () {
                        self.fireEvent(BI.MultiDateTimePopup.CALENDAR_EVENT_CHANGE);
                    });
                }
            },{
                type: "bi.label",
                text: ":",
                width: 15
            },{
                type: "bi.multi_date_time_select",
                max: 59,
                min: 0,
                width: 60,
                height: 30,
                ref: function (_ref) {
                    self.minute = _ref;
                    self.minute.on(BI.MultiDateTimeSelect.EVENT_CONFIRM, function () {
                        self.fireEvent(BI.MultiDateTimePopup.CALENDAR_EVENT_CHANGE);
                    });
                }
            },{
                type: "bi.label",
                text: ":",
                width: 15
            },{
                type: "bi.multi_date_time_select",
                max: 59,
                min: 0,
                width: 60,
                height: 30,
                ref: function (_ref) {
                    self.second = _ref;
                    self.second.on(BI.MultiDateTimeSelect.EVENT_CONFIRM, function () {
                        self.fireEvent(BI.MultiDateTimePopup.CALENDAR_EVENT_CHANGE);
                    });
                }
            }]
        });

        var date = new Date();
        self.dateCombo.setValue({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        });
        self.hour.setValue(date.getHours());
        self.minute.setValue(date.getMinutes());
        self.second.setValue(date.getSeconds());

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
            },{
                el: this.dateButton,
                height: 30
            }]
        });
    },

    setValue: function (v) {
        var value, date;
        if (BI.isNotNull(v)) {
            value = v.value;
            if(BI.isNull(value)){
                date = new Date();
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
        }
    },

    getValue: function () {
        return {
            value: {
                year: this.dateCombo.getValue().year,
                month: this.dateCombo.getValue().month,
                day: this.dateCombo.getValue().day,
                hour: this.hour.getValue(),
                minute: this.minute.getValue(),
                second: this.second.getValue()
            }
        }
    }
});
BI.MultiDateTimePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.MultiDateTimePopup.BUTTON_CANCEL_EVENT_CHANGE = "BUTTON_CANCEL_EVENT_CHANGE";
BI.MultiDateTimePopup.CALENDAR_EVENT_CHANGE = "CALENDAR_EVENT_CHANGE";
BI.shortcut('bi.multi_date_time_popup', BI.MultiDateTimePopup);

