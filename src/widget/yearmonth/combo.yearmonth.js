/**
 * 年份 + 月份下拉框
 *
 * @class BI.YearMonthCombo
 * @extends BI.Widget
 */
BI.YearMonthCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearMonthCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-month-combo",
            yearBehaviors: {},
            monthBehaviors: {},
            height: 25
        });
    },
    _init: function () {
        BI.YearMonthCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.year = BI.createWidget({
            type: "bi.year_combo",
            behaviors: o.yearBehaviors
        });

        this.month = BI.createWidget({
            type: "bi.month_combo",
            behaviors: o.monthBehaviors
        });

        this.year.on(BI.YearCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.YearMonthCombo.EVENT_CONFIRM);
        });
        this.year.on(BI.YearCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearMonthCombo.EVENT_BEFORE_POPUPVIEW);
        });

        this.month.on(BI.MonthCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.YearMonthCombo.EVENT_CONFIRM);
        });
        this.month.on(BI.MonthCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearMonthCombo.EVENT_BEFORE_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.center",
            element: this,
            hgap: 5,
            items: [this.year, this.month]
        });

    },

    setValue: function (v) {
        v = v || {};
        this.month.setValue(v.month);
        this.year.setValue(v.year);
    },

    getValue: function () {
        return {
            year: this.year.getValue(),
            month: this.month.getValue()
        };
    }
});
BI.YearMonthCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.YearMonthCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut('bi.year_month_combo', BI.YearMonthCombo);