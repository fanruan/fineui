/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimePopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateTimePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-time-popup",
            width: 268,
            height: 374
        });
    },
    _init: function () {
        BI.DateTimePopup.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.cancelButton = BI.createWidget({
            type: "bi.text_button",
            cls: "multidate-popup-button bi-border-top bi-border-right",
            shadow: true,
            text: BI.i18nText("BI-Basic_Cancel")
        });
        this.cancelButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.BUTTON_CANCEL_EVENT_CHANGE);
        });

        this.okButton = BI.createWidget({
            type: "bi.text_button",
            cls: "multidate-popup-button bi-border-top",
            shadow: true,
            text: BI.i18nText("BI-Basic_OK")
        });
        this.okButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.BUTTON_OK_EVENT_CHANGE);
        });

        this.dateCombo = BI.createWidget({
            type: "bi.date_calendar_popup",
            behaviors: opts.behaviors,
            min: self.options.min,
            max: self.options.max
        });
        self.dateCombo.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTimePopup.CALENDAR_EVENT_CHANGE);
        });

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
                el: {
                    type: "bi.center_adapt",
                    cls: "bi-split-top",
                    items: [{
                        type: "bi.dynamic_date_time_select",
                        ref: function (_ref) {
                            self.timeSelect = _ref;
                        }
                    }]
                },
                height: 50
            }, {
                el: this.dateButton,
                height: 30
            }]
        });
        this.setValue(opts.value);
    },

    setValue: function (v) {
        var value = v, date;
        if (BI.isNull(value)) {
            date = BI.getDate();
            this.dateCombo.setValue({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            });
            this.timeSelect.setValue({
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds()
            });
        } else {
            this.dateCombo.setValue({
                year: value.year,
                month: value.month,
                day: value.day
            });
            this.timeSelect.setValue({
                hour: value.hour,
                minute: value.minute,
                second: value.second
            });
        }
    },

    getValue: function () {
        return BI.extend({
            year: this.dateCombo.getValue().year,
            month: this.dateCombo.getValue().month,
            day: this.dateCombo.getValue().day
        }, this.timeSelect.getValue());
    }
});
BI.DateTimePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DateTimePopup.BUTTON_CANCEL_EVENT_CHANGE = "BUTTON_CANCEL_EVENT_CHANGE";
BI.DateTimePopup.CALENDAR_EVENT_CHANGE = "CALENDAR_EVENT_CHANGE";
BI.shortcut("bi.date_time_popup", BI.DateTimePopup);
