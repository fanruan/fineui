/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.StaticYearCard
 * @extends BI.Trigger
 */
BI.StaticYearCard = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.StaticYearCard.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-card",
            behaviors: {},
            min: "1900-01-01", // 最小日期
            max: "2099-12-31" // 最大日期
        });
    },

    _createYearCalendar: function (v) {
        var o = this.options, y = this._year;

        var calendar = BI.createWidget({
            type: "bi.year_calendar",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max,
            logic: {
                dynamic: true
            },
            year: y + v * 12
        });
        calendar.setValue(this._year);
        return calendar;
    },

    _init: function () {
        BI.StaticYearCard.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.selectedYear = this._year = BI.getDate().getFullYear();

        this.backBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 25,
            height: 25,
            value: -1,
            listeners: [{
                eventName: BI.IconButton.EVENT_CHANGE,
                action: function () {
                    self.navigation.setSelect(self.navigation.getSelect() - 1);
                    self._checkLeftValid();
                    self._checkRightValid();
                }
            }]
        });

        this.preBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 25,
            height: 25,
            value: 1,
            listeners: [{
                eventName: BI.IconButton.EVENT_CHANGE,
                action: function () {
                    self.navigation.setSelect(self.navigation.getSelect() + 1);
                    self._checkLeftValid();
                    self._checkRightValid();
                }
            }]
        });

        this.navigation = BI.createWidget({
            type: "bi.navigation",
            direction: "top",
            element: this,
            single: true,
            logic: {
                dynamic: true
            },
            tab: {
                type: "bi.htape",
                cls: "bi-split-top bi-split-bottom",
                height: 30,
                items: [{
                    el: {
                        type: "bi.center_adapt",
                        items: [self.backBtn]
                    },
                    width: 25
                }, {
                    type: "bi.layout"
                }, {
                    el: {
                        type: "bi.center_adapt",
                        items: [self.preBtn]
                    },
                    width: 25
                }]
            },
            cardCreator: BI.bind(this._createYearCalendar, this),

            afterCardShow: function () {
                this.setValue(self.selectedYear);
                // var calendar = this.getSelectedCard();
                // self.backBtn.setEnable(!calendar.isFrontYear());
                // self.preBtn.setEnable(!calendar.isFinalYear());
            }
        });

        this.navigation.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedYear = this.getValue();
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            self.fireEvent(BI.StaticYearCard.EVENT_CHANGE, self.selectedYear);
        });

        if(BI.isKey(o.value)){
            this.setValue(o.value);
        }
    },

    _checkLeftValid: function () {
        var o = this.options;
        var valid = true;
        this.backBtn.setEnable(valid);
        return valid;
    },

    _checkRightValid: function () {
        var o = this.options;
        var valid = true;
        this.preBtn.setEnable(valid);
        return valid;
    },

    _checkMin: function () {
        var o = this.options;
        BI.each(this.navigation.getAllCard(), function (idx, calendar) {
            calendar.setMinDate(o.min);
        });
    },

    _checkMax: function () {
        var o = this.options;
        BI.each(this.navigation.getAllCard(), function (idx, calendar) {
            calendar.setMaxDate(o.max);
        });
    },

    setMinDate: function (minDate) {
        if (BI.isNotEmptyString(this.options.min)) {
            this.options.min = minDate;
            this._checkLeftValid();
            this._checkRightValid();
            this._checkMin();
        }
    },

    setMaxDate: function (maxDate) {
        if (BI.isNotEmptyString(this.options.max)) {
            this.options.max = maxDate;
            this._checkLeftValid();
            this._checkRightValid();
            this._checkMax();
        }
    },

    getValue: function () {
        return {
            year: this.selectedYear
        };
    },

    setValue: function (obj) {
        var o = this.options;
        obj = obj || {};
        var v = obj.year;
        if (BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]) {
            v = BI.getDate().getFullYear();
            this.selectedYear = "";
            this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
            this.navigation.setValue("");
        } else {
            this.selectedYear = BI.parseInt(v);
            this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
            this.navigation.setValue(this.selectedYear);
        }
        this._checkLeftValid();
        this._checkRightValid();
    }
});
BI.StaticYearCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_year_card", BI.StaticYearCard);