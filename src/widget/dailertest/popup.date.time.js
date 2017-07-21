/**
 * Created by GUY on 2015/9/7.
 * @class BI.DateCalendarPopup
 * @extends BI.Widget
 */
BI.DateTimePopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.DateTimePopup.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-calendar-popup demo-clolor",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            selectedTime: null
        })
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
            day: this.selectedTime.day
        });
        return calendar
    },

    _init: function () {
        BI.DateTimePopup.superclass._init.apply(this, arguments);
        var self = this,
            o = this.options;
        this.today = new Date();
        this._year = this.today.getFullYear();
        this._month = this.today.getMonth();
        this._day = this.today.getDate();
        this._hour = this.today.getHours();
        this._minute = this.today.getMinutes();
        this._second = this.today.getSeconds();

        this.selectedTime = o.selectedTime || {
            year: this._year,
            month: this._month,
            day: this._day,
            hour: this._hour,
            minute: this._minute,
            second: this._second
        };
        this.datePicker = BI.createWidget({
            type: "bi.date_picker",
            min: o.min,
            max: o.max,
            cls: "demo-clolor",
        });

        this.calendar = BI.createWidget({
            direction: "top",
            // element: this,
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
                self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
            }
        });

        this.timeTunning = BI.createWidget({
            type: "bi.time_tunning",
            currentTime: {
                hour: this._hour,
                minute: this._minute,
                second: this._second
            }
        });
        this.timeTunning.on(BI.TimeTuning.EVENT_CHANGE, function () {
            self.selectedTime = self.timeTunning.getValue();
        });

        this.buttons = BI.createWidget({
            type: "bi.button_group",
            items: [{
                type: "bi.button",
                textHeight: 30,
                clear: true,
                text: "取消",
                handler: function () {
                    self.fireEvent(BI.DateTimePopup.EVENT_CLICK_CANCEL);
                }
            }, {
                text: "|"
            }, {
                type: "bi.button",
                textHeight: 30,
                clear: true,
                text: BI.i18nText("BI-Basic_Sure"),
                handler: function () {
                    self.fireEvent(BI.DateTimePopup.EVENT_CLICK_CONFIRM);
                }
            }],
            chooseType: 0,
            behaviors: {},
            layouts: [{
                type: "bi.center_adapt"
            }]
        });

        this.dateTime = BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.calendar, this.timeTunning, this.buttons]
        });

        this.datePicker.on(BI.DatePicker.EVENT_CHANGE, function () {
            self.selectedTime = self.datePicker.getValue();
            self.selectedTime.day = 1;
            self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
        });

        this.calendar.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedTime = self.calendar.getValue();
            self.fireEvent(BI.DateTimePopup.EVENT_CHANGE);
        });

        self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
        this.calendar.setValue(this.selectedTime);
    },

    setValue: function (timeOb) {
        this.datePicker.setValue(timeOb);
        this.calendar.setSelect(BI.Calendar.getPageByDateJSON(timeOb));
        this.calendar.setValue(timeOb);
        this.timeTunning.setValue(timeOb);
        this.selectedTime = timeOb;
    },

    getValue: function () {
        return $.extend({}, this.calendar.getValue(), this.timeTunning.getValue());
    }
});
BI.DateTimePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateTimePopup.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.DateTimePopup.EVENT_CLICK_CANCEL = "EVENT_CLICK_CANCEL";
BI.shortcut("bi.date_time_popup", BI.DateTimePopup);