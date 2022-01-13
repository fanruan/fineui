/**
 * 年份下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.YearDateCombo
 * @extends BI.Trigger
 */
BI.YearDateCombo = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        return BI.extend( BI.YearDateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-combo",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            behaviors: {},
            height: 24,
            container: null
        });
    },
    _init: function () {
        BI.YearDateCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_triangle_trigger"
        });

        this.popup = BI.createWidget({
            type: "bi.year_popup",
            behaviors: o.behaviors,
            min: o.min,
            max: o.max,
            width: 122
        });

        this.popup.on(BI.YearPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.YearDateCombo.EVENT_CHANGE);
        });


        this.combo = BI.createWidget({
            type: "bi.combo",
            offsetStyle: "center",
            element: this,
            container: o.container,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 100,
                stopPropagation: false,
                el: this.popup
            }
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            self.fireEvent(BI.YearDateCombo.EVENT_CHANGE);
        });
        // BI-22551 popup未初始化传入的behavior无效
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.doBehavior();
            self.fireEvent(BI.YearDateCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    setMinDate: function (minDate) {
        this.popup.setMinDate(minDate);
    },

    setMaxDate: function (maxDate) {
        this.popup.setMaxDate(maxDate);
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.YearDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.YearDateCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.year_date_combo", BI.YearDateCombo);
