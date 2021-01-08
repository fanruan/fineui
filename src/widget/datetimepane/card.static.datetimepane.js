BI.StaticDateTimePaneCard = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.StaticDateTimePaneCard.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-time-pane",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            selectedTime: null
        });
    },
    _init: function () {
        BI.StaticDateTimePaneCard.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.today = BI.getDate();
        this._year = this.today.getFullYear();
        this._month = this.today.getMonth() + 1;

        this.selectedTime = o.selectedTime || {
            year: this._year,
            month: this._month
        };

        this.datePicker = BI.createWidget({
            type: "bi.date_picker",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max
        });
        this.datePicker.on(BI.DatePicker.EVENT_CHANGE, function () {
            var value = self.datePicker.getValue();
            var monthDay = BI.getMonthDays(BI.getDate(value.year, value.month - 1, 1));
            var day = self.selectedTime.day || 0;
            if (day > monthDay) {
                day = monthDay;
            }
            self.selectedTime = BI.extend(self.selectedTime, {
                year: value.year,
                month: value.month
            });
            day !== 0 && (self.selectedTime.day = day);
            self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
            self.calendar.setValue(self.selectedTime);
            day !== 0 && self.fireEvent(BI.DateCalendarPopup.EVENT_CHANGE);
        });

        this.datePicker.on(BI.DatePicker.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW, function () {
            self.fireEvent(BI.StaticDateTimePaneCard.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW);
        });

        this.calendar = BI.createWidget({
            direction: "custom",
            // logic: {
            //     dynamic: false
            // },
            type: "bi.navigation",
            tab: this.datePicker,
            cardCreator: BI.bind(this._createNav, this)
        });
        this.calendar.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedTime = BI.extend(self.calendar.getValue(), self.timeSelect.getValue());
            self.calendar.empty();
            self.setValue(self.selectedTime);
            self.fireEvent(BI.DateCalendarPopup.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            hgap: 10,
            items: [{
                el: this.datePicker,
                height: 40
            }, this.calendar, {
                el: {
                    type: "bi.dynamic_date_time_select",
                    cls: "bi-split-top",
                    ref: function () {
                        self.timeSelect = this;
                    },
                    listeners: [{
                        eventName: BI.DynamicDateTimeSelect.EVENT_CONFIRM,
                        action: function () {
                            self.selectedTime = BI.extend(self.calendar.getValue(), self.timeSelect.getValue());
                            self.fireEvent("EVENT_CHANGE");
                        }
                    }]
                },
                height: 40
            }]
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "bi-split-top"
                },
                height: 1,
                top: 40,
                left: 0,
                right: 0
            }]
        });
        this.setValue(o.selectedTime);

    },

    _createNav: function (v) {
        var date = BI.Calendar.getDateJSONByPage(v);
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: false
            },
            min: this.options.min,
            max: this.options.max,
            year: date.year,
            month: date.month,
            day: this.selectedTime.day
        });
        return calendar;
    },

    _getNewCurrentDate: function () {
        var today = BI.getDate();
        return {
            year: today.getFullYear(),
            month: today.getMonth() + 1
        };
    },

    _setCalenderValue: function (date) {
        this.calendar.setSelect(BI.Calendar.getPageByDateJSON(date));
        this.calendar.setValue(date);
        this.selectedTime = BI.extend({}, this.timeSelect.getValue(), date);
    },

    _setDatePicker: function (timeOb) {
        if (BI.isNull(timeOb) || BI.isNull(timeOb.year) || BI.isNull(timeOb.month)) {
            this.datePicker.setValue(this._getNewCurrentDate());
        } else {
            this.datePicker.setValue(timeOb);
        }
    },

    _setCalendar: function (timeOb) {
        if (BI.isNull(timeOb) || BI.isNull(timeOb.day)) {
            this.calendar.empty();
            this._setCalenderValue(this._getNewCurrentDate());
        } else {
            this._setCalenderValue(timeOb);
        }
    },

    _checkMin: function () {
        var o = this.options;
        BI.each(this.calendar.getAllCard(), function (idx, calendar) {
            calendar.setMinDate(o.min);
        });
    },

    _checkMax: function () {
        var o = this.options;
        BI.each(this.calendar.getAllCard(), function (idx, calendar) {
            calendar.setMaxDate(o.max);
        });
    },

    setMinDate: function (minDate) {
        if (BI.isNotEmptyString(this.options.min)) {
            this.options.min = minDate;
            this.datePicker.setMinDate(minDate);
            this._checkMin();
        }
    },

    setMaxDate: function (maxDate) {
        if (BI.isNotEmptyString(this.options.max)) {
            this.options.max = maxDate;
            this.datePicker.setMaxDate(maxDate);
            this._checkMax();
        }
    },

    setValue: function (timeOb) {
        timeOb = timeOb || {};
        this._setDatePicker(timeOb);
        this._setCalendar(timeOb);
        this.timeSelect.setValue({
            hour: timeOb.hour,
            minute: timeOb.minute,
            second: timeOb.second
        });
    },

    getValue: function () {
        return this.selectedTime;
    }

});
BI.StaticDateTimePaneCard.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW = "EVENT_BEFORE_YEAR_MONTH_POPUPVIEW";
BI.shortcut("bi.static_date_time_pane_card", BI.StaticDateTimePaneCard);