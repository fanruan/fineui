/**
 * 日期控件中的月份下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.MonthDateCombo
 * @extends BI.Trigger
 */
BI.MonthDateCombo = BI.inherit(BI.Trigger, {
    _defaultConfig: function() {
        return BI.extend( BI.MonthDateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-month-combo",
            height: 25
        });
    },
    _init: function() {
        BI.MonthDateCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_triangle_trigger"
        });

        this.popup = BI.createWidget({
            type: "bi.month_popup"
        });

        this.popup.on(BI.YearPopup.EVENT_CHANGE, function(){
            self.setValue(self.popup.getValue());
        })


        this.combo = BI.createWidget({
            type: "bi.combo",
            offsetStyle: "center",
            element: this.element,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: this.popup
            }
        })
        this.combo.on(BI.Combo.EVENT_CHANGE, function(){
            self.combo.hideView();
            self.fireEvent(BI.MonthDateCombo.EVENT_CHANGE);
        });
    },

    setValue: function(v){
        this.trigger.setValue(v + 1);
        this.popup.setValue(v);
    },

    getValue: function(){
        return this.popup.getValue();
    }
});
BI.MonthDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.month_date_combo', BI.MonthDateCombo);