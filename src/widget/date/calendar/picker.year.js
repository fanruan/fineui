/**
 * Created by GUY on 2015/9/7.
 * @class BI.YearPicker
 * @extends BI.Widget
 */
BI.YearPicker = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.YearPicker.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-year-picker",
            behaviors: {},
            height: 40,
            min: "1900-01-01", // 最小日期
            max: "2099-12-31" // 最大日期
        });
    },

    _init: function () {
        BI.YearPicker.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._year = BI.getDate().getFullYear();
        this.left = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 25,
            height: 25
        });
        this.left.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue(self.year.getValue() - 1);
            self.fireEvent(BI.YearPicker.EVENT_CHANGE);
            // self._checkLeftValid();
            // self._checkRightValid();
        });

        this.right = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 25,
            height: 25
        });

        this.right.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue(self.year.getValue() + 1);
            self.fireEvent(BI.YearPicker.EVENT_CHANGE);
            // self._checkLeftValid();
            // self._checkRightValid();
        });

        this.year = BI.createWidget({
            type: "bi.year_date_combo",
            min: o.min,
            behaviors: o.behaviors,
            max: o.max,
            width: 50
        });
        this.year.on(BI.YearDateCombo.EVENT_CHANGE, function () {
            self.setValue(self.year.getValue());
            self.fireEvent(BI.YearPicker.EVENT_CHANGE);
        });
        this.year.on(BI.YearDateCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearPicker.EVENT_BEFORE_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [this.left]
                },
                width: 25
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: this.year
                }]
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.right]
                },
                width: 25
            }]
        });
        this.setValue(this._year);
    },

    _checkLeftValid: function () {
        var o = this.options;
        var valid = this._year > BI.parseDateTime(o.min, "%Y-%X-%d").getFullYear();
        this.left.setEnable(valid);
        return valid;
    },

    _checkRightValid: function () {
        var o = this.options;
        var valid = this._year < BI.parseDateTime(o.max, "%Y-%X-%d").getFullYear();
        this.right.setEnable(valid);
        return valid;
    },

    setMinDate: function (minDate) {
        this.options.min = minDate;
        this.year.setMinDate(minDate);
        // this._checkLeftValid();
        // this._checkRightValid();
    },

    setMaxDate: function (maxDate) {
        this.options.max = maxDate;
        this.year.setMaxDate(maxDate);
        // this._checkLeftValid();
        // this._checkRightValid();
    },


    setValue: function (v) {
        this._year = v;
        this.year.setValue(v);
        // this._checkLeftValid();
        // this._checkRightValid();
    },

    getValue: function () {
        return this.year.getValue();
    }
});
BI.YearPicker.EVENT_CHANGE = "EVENT_CHANGE";
BI.YearPicker.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.year_picker", BI.YearPicker);
