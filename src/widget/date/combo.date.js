/**
 * 日期下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.DateCombo
 * @extends BI.Widget
 */
BI.DateCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-combo",
            height: 30
        });
    },
    _init: function () {
        BI.DateCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_trigger"
        });

        this.trigger.on(BI.DateTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });

        this.popup = BI.createWidget({
            type: "bi.date_calendar_popup"
        });

        this.popup.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            element: this.element,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                width: 270,
                el: this.popup,
                stopPropagation: false
            }
        })
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
$.shortcut('bi.date_combo', BI.DateCombo);