/**
 * Created by GUY on 2015/9/7.
 * @class BI.DateCalendarPopup
 * @extends BI.Widget
 */
BI.DateCalendarPopup = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-date-calendar-popup",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        selectedTime: null
    },

    _createNav: function (v) {
        var date = BI.Calendar.getDateJSONByPage(v);
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: true
            },
            min: this.options.min,
            max: this.options.max,
            year: date.year,
            month: date.month,
            // BI-45616 此处为确定当前应该展示哪个年月对应的Calendar, day不是关键数据, 给1号就可
            day: 1
        });
        return calendar;
    },

    render: function () {
        var self = this,
            o = this.options;
        this.today = BI.getDate();
        this._year = this.today.getFullYear();
        this._month = this.today.getMonth() + 1;
        this._day = this.today.getDate();

        this.selectedTime = o.selectedTime || {
            year: this._year,
            month: this._month,
            day: this._day
        };
        this.datePicker = BI.createWidget({
            type: "bi.date_picker",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max
        });

        this.calendar = BI.createWidget({
            direction: "top",
            logic: {
                dynamic: true
            },
            type: "bi.navigation",
            tab: this.datePicker,
            cardCreator: BI.bind(this._createNav, this),

            afterCardCreated: function () {

            },

            afterCardShow: function () {
                this.setValue(self.selectedTime);
            }
        });

        this.datePicker.on(BI.DatePicker.EVENT_CHANGE, function () {
            self.selectedTime = self.datePicker.getValue();
            self.selectedTime.day = 1;
            self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
        });

        this.datePicker.on(BI.DatePicker.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW, function () {
            self.fireEvent(BI.DateCalendarPopup.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW);
        });

        this.calendar.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedTime = self.calendar.getValue();
            self.setValue(self.selectedTime);
            self.fireEvent(BI.DateCalendarPopup.EVENT_CHANGE);
        });

        return [{
            type: "bi.vertical",
            items: [{
                el: this.calendar,
                hgap: 12,
                bgap: 7
            }]
        }, {
            type: "bi.absolute",
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
        }]
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
        this.datePicker.setValue(timeOb);
        this.calendar.setSelect(BI.Calendar.getPageByDateJSON(timeOb));
        this.calendar.setValue(timeOb);
        this.selectedTime = timeOb;
    },

    getValue: function () {
        return this.selectedTime;
    }
});
BI.DateCalendarPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateCalendarPopup.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW = "EVENT_BEFORE_YEAR_MONTH_POPUPVIEW";
BI.shortcut("bi.date_calendar_popup", BI.DateCalendarPopup);
