/**
 * @class BI.RangeValueCombo
 * @extend BI.Widget
 */
BI.RangeValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.RangeValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-range-value-combo",
            width: 100,
            height: 30
        })
    },

    _init: function () {
        BI.RangeValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.dateRangeCombo = BI.createWidget({
            type: "bi.text_value_combo",
            height: o.height,
            width: o.width,
            items: BICst.Date_Range_FILTER_COMBO
        });
        this.dateRangeCombo.on(BI.TextValueCombo.EVENT_CHANGE, function(){
            self.fireEvent(BI.RangeValueCombo.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.default",
            element: this,
            items: [this.dateRangeCombo]
        });
    },

    setValue: function (v) {
        v = v || {};
        this.dateRangeCombo.setValue(v.type);
    },

    getValue: function () {
        return {
            type: this.dateRangeCombo.getValue()[0]
        };
    }
});
BI.RangeValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.range_value_combo", BI.RangeValueCombo);