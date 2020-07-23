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
            max: "2099-12-31", // 最大日期
        });
    },

    _init: function () {
        BI.DatePicker.superclass._init.apply(this, arguments);
        var self = this; var o = this.options;
        this._year = BI.getDate().getFullYear();
        this._month = BI.getDate().getMonth() + 1;
        this.left = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 24,
            height: 24,
        });
        this.left.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self._month === 1) {
                self.setValue({
                    year: self.year.getValue() - 1,
                    month: 12,
                });
            } else {
                self.setValue({
                    year: self.year.getValue(),
                    month: (self.month.getValue() - 1) || BI.getDate().getMonth(),
                });
            }
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
            self._checkLeftValid();
            self._checkRightValid();
        });

        this.right = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 24,
            height: 24,
        });

        this.right.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self._month === 12) {
                self.setValue({
                    year: self.year.getValue() + 1,
                    month: 1,
                });
            } else {
                self.setValue({
                    year: self.year.getValue(),
                    month: (self.month.getValue() + 1) || (BI.getDate().getMonth() + 2),
                });
            }
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
            self._checkLeftValid();
            self._checkRightValid();
        });

        this.year = BI.createWidget({
            type: "bi.year_date_combo",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max,
        });
        this.year.on(BI.YearDateCombo.EVENT_CHANGE, function () {
            self.setValue({
                year: self.year.getValue(),
                month: self._refreshMonth()
            });
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });
        this.month = BI.createWidget({
            type: "bi.month_date_combo",
            behaviors: o.behaviors,
            allowMonths: this._getAllowMonths()
        });
        this.month.on(BI.MonthDateCombo.EVENT_CHANGE, function () {
            self.setValue({
                year: self.year.getValue(),
                month: self.month.getValue(),
            });
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [this.left],
                },
                width: 24,
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: {
                        type: "bi.horizontal",
                        width: 120,
                        rgap: 10,
                        items: [{
                            el: this.year,
                            lgap: 10,
                        }, this.month],
                    },
                }],
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.right],
                },
                width: 24,
            }],
        });
        this.setValue({
            year: this._year,
            month: this._month,
        });
    },

    _refreshMonth: function () {
        var month = this.month.getValue();
        this.month.populate(this._getAllowMonths());
        var allowMonth = this._getAllowMonths();
        if (!BI.contains(allowMonth, month)) {
            month = allowMonth[0];
        }
        return month;
    },

    _getAllowMonths: function () {
        var self = this, o = this.options;
        var minDate = BI.parseDateTime(o.min, "%Y-%X-%d");
        var maxDate = BI.parseDateTime(o.max, "%Y-%X-%d");
        minDate.setDate(1);
        maxDate.setDate(1);
        var calcMin = BI.print(minDate, "%Y-%X-%d");
        var calcMax = BI.print(maxDate, "%Y-%X-%d");

        return BI.filter(BI.range(1, 13), function (idx, v) {
            return !BI.checkDateVoid(self.year.getValue(), v, 1, calcMin, calcMax)[0];
        });
    },

    _checkLeftValid: function () {
        var o = this.options;
        var minDate = BI.parseDateTime(o.min, "%Y-%X-%d");
        var valid = !(this._month <= (minDate.getMonth() + 1) && this._year <= minDate.getFullYear());
        this.left.setEnable(valid);

        return valid;
    },

    _checkRightValid: function () {
        var o = this.options;
        var maxDate = BI.parseDateTime(o.max, "%Y-%X-%d");
        var valid = !(this._month >= (maxDate.getMonth() + 1) && this._year >= maxDate.getFullYear());
        this.right.setEnable(valid);

        return valid;
    },

    setMinDate: function (minDate) {
        this.options.min = minDate;
        this.year.setMinDate(minDate);
    },

    setMaxDate: function (maxDate) {
        this.options.max = maxDate;
        this.year.setMaxDate(maxDate);
    },

    setValue: function (ob) {
        this._year = BI.parseInt(ob.year);
        this._month = BI.parseInt(ob.month);
        this.year.setValue(ob.year);
        this._refreshMonth();
        this.month.setValue(ob.month);
        this._checkLeftValid();
        this._checkRightValid();
    },

    getValue: function () {
        return {
            year: this.year.getValue(),
            month: this.month.getValue(),
        };
    },
});
BI.DatePicker.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.date_picker", BI.DatePicker);
