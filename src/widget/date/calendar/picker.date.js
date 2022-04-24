/**
 * Created by GUY on 2015/9/7.
 * @class BI.DatePicker
 * @extends BI.Widget
 */
BI.DatePicker = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.DatePicker.superclass._defaultConfig.apply(this, arguments);

        return BI.extend(conf, {
            baseCls: "bi-date-picker",
            height: 40,
            min: "1900-01-01", // 最小日期
            max: "2099-12-31" // 最大日期
        });
    },

    _init: function () {
        BI.DatePicker.superclass._init.apply(this, arguments);
        var self = this;
        var o = this.options;
        this._year = BI.getDate().getFullYear();
        this._month = BI.getDate().getMonth() + 1;
        this.left = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 24,
            height: 24
        });
        this.left.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self._month === 1) {
                self.setValue({
                    year: (self.year.getValue() - 1) || (BI.getDate().getFullYear() - 1),
                    month: 12
                });
            } else {
                self.setValue({
                    year: self.year.getValue() || BI.getDate().getFullYear(),
                    month: (self.month.getValue() - 1) || BI.getDate().getMonth()
                });
            }
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
            // self._checkLeftValid();
            // self._checkRightValid();
        });

        this.right = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 24,
            height: 24
        });

        this.right.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self._month === 12) {
                self.setValue({
                    year: (self.year.getValue() + 1) || (BI.getDate().getFullYear() + 1),
                    month: 1
                });
            } else {
                self.setValue({
                    year: self.year.getValue() || BI.getDate().getFullYear(),
                    month: (self.month.getValue() + 1) || (BI.getDate().getMonth() + 2)
                });
            }
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
            // self._checkLeftValid();
            // self._checkRightValid();
        });

        this.year = BI.createWidget({
            type: "bi.year_date_combo",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max
        });
        this.year.on(BI.YearDateCombo.EVENT_CHANGE, function () {
            self.setValue({
                year: self.year.getValue(),
                month: self._refreshMonth()
            });
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });
        this.year.on(BI.YearDateCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.DatePicker.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW);
        });
        this.month = BI.createWidget({
            type: "bi.month_date_combo",
            behaviors: o.behaviors,
            allowMonths: this._getAllowMonths()
        });
        this.month.on(BI.MonthDateCombo.EVENT_CHANGE, function () {
            self.setValue({
                year: self.year.getValue() || self._year,
                month: self.month.getValue()
            });
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });
        this.month.on(BI.YearDateCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.DatePicker.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [this.left]
                },
                width: 24
            }, {
                el: {
                    type: "bi.center_adapt",
                    hgap: 10,
                    items: [this.year, this.month]
                }
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.right]
                },
                width: 24
            }]
        });
        this.setValue({
            year: this._year,
            month: this._month
        });
    },

    _refreshMonth: function (defaultMonth) {
        var month = this.month.getValue();
        this.month.populate(this._getAllowMonths());
        var allowMonth = this._getAllowMonths();
        if (!BI.contains(allowMonth, month)) {
            month = defaultMonth || allowMonth[0];
        }
        this.month.setValue(month);
        return month;
    },

    _getAllowMonths: function () {
        var obj = this._getCheckMinMaxDate();
        var year = this.year.getValue() || this._year;

        return BI.filter(BI.range(1, 13), function (idx, v) {
            return !BI.checkDateVoid(year, v, 1, obj.min, obj.max)[0];
        });
    },

    // 上一年月不合法则灰化
    _checkLeftValid: function () {
        var obj = this._getCheckMinMaxDate();
        var year = this._month === 1 ? this._year - 1 : this._year;
        var month = this._month === 1 ? 12 : this._month - 1;
        var valid = BI.isNull(BI.checkDateVoid(year, month, 1, obj.min, obj.max)[0]);
        this.left.setEnable(valid);

        return valid;
    },

    // 下一年月不合法则灰化
    _checkRightValid: function () {
        var obj = this._getCheckMinMaxDate();
        var year = this._month === 12 ? this._year + 1 : this._year;
        var month = this._month === 12 ? 1 : this._month + 1;
        var valid = BI.isNull(BI.checkDateVoid(year, month, 1, obj.min, obj.max)[0]);
        this.right.setEnable(valid);

        return valid;
    },

    _getCheckMinMaxDate: function () {
        var o = this.options;
        var minDate = BI.parseDateTime(o.min, "%Y-%X-%d");
        var maxDate = BI.parseDateTime(o.max, "%Y-%X-%d");
        minDate.setDate(1);
        maxDate.setDate(1);

        return {
            min: BI.print(minDate, "%Y-%X-%d"),
            max: BI.print(maxDate, "%Y-%X-%d")
        };
    },

    setMinDate: function (minDate) {
        this.options.min = minDate;
        this.year.setMinDate(minDate);
        this._refreshMonth(this._month);
        // this._checkLeftValid();
        // this._checkRightValid();
    },

    setMaxDate: function (maxDate) {
        this.options.max = maxDate;
        this.year.setMaxDate(maxDate);
        this._refreshMonth(this._month);
        // this._checkLeftValid();
        // this._checkRightValid();
    },

    setValue: function (ob) {
        this._year = BI.parseInt(ob.year);
        this._month = BI.parseInt(ob.month);
        this.year.setValue(ob.year);
        this._refreshMonth(this._month);
        this.month.setValue(ob.month);
        // this._checkLeftValid();
        // this._checkRightValid();
    },

    getValue: function () {
        return {
            year: this.year.getValue(),
            month: this.month.getValue()
        };
    }
});
BI.DatePicker.EVENT_CHANGE = "EVENT_CHANGE";
BI.DatePicker.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW = "EVENT_BEFORE_YEAR_MONTH_POPUPVIEW";
BI.shortcut("bi.date_picker", BI.DatePicker);
