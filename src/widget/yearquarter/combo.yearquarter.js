/**
 * 年份 + 月份下拉框
 *
 * @class BI.YearQuarterCombo
 * @extends BI.Widget
 */
BI.YearQuarterCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearQuarterCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-quarter-combo",
            yearBehaviors: {},
            quarterBehaviors: {},
            height: 25
        });
    },
    _init: function () {
        BI.YearQuarterCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        o.value = o.value || {};

        this.year = BI.createWidget({
            type: "bi.year_combo",
            behaviors: o.yearBehaviors,
            value: o.value.year
        });

        this.quarter = BI.createWidget({
            type: "bi.quarter_combo",
            behaviors: o.quarterBehaviors,
            value: o.value.quarter
        });

        this.year.on(BI.YearCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.YearQuarterCombo.EVENT_CONFIRM);
        });
        this.year.on(BI.YearCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearQuarterCombo.EVENT_BEFORE_POPUPVIEW);
        });

        this.quarter.on(BI.QuarterCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.YearQuarterCombo.EVENT_CONFIRM);
        });
        this.quarter.on(BI.QuarterCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearQuarterCombo.EVENT_BEFORE_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.center",
            element: this,
            hgap: 5,
            items: [this.year, this.quarter]
        });

    },

    setValue: function (v) {
        v = v || {};
        this.quarter.setValue(v.quarter);
        this.year.setValue(v.year);
    },

    getValue: function () {
        return {
            year: this.year.getValue(),
            quarter: this.quarter.getValue()
        };
    }
});
BI.YearQuarterCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.YearQuarterCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.year_quarter_combo", BI.YearQuarterCombo);