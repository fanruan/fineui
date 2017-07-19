/**
 * Created by dailer on 2017/7/19.
 * 日期时间练习
 */

BI.DateTimeCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TimeTuning.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-fine-tuning-number-editor bi-border",
            selectedTime: {
                year: 2017,
                month: 0,
                day: 1,
                hour: 0,
                minute: 0,
                second: 0
            },
            height: 30
        })
    },

    _init: function () {
        BI.DateCombo.superclass._init.apply(this, arguments);
        var self = this,
            o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_trigger"
        });

        this.trigger.on(BI.DateTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });

        this.popup = BI.createWidget({
            type: "bi.date_time_popup"
        });

        this.popup.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            element: this,
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


    _reviseMinute: function () {
        this.m._finetuning(this.s.isNeedRevise);
        this._reviseHour();
    },

    _reviseHour: function () {
        this.h._finetuning(this.m.isNeedRevise);
    },

    getCurrentTime: function () {
        return {
            hour: this.h.getValue(),
            minute: this.m.getValue(),
            second: this.s.getValue()
        };
    },

    _format: function (p) {
        return p < 10 ? ('0' + p) : p
    },

    getCurrentTimeStr: function () {
        return this._format(this.h.getValue()) + ':' + this._format(this.m.getValue()) + ':' + this._format(this.s.getValue())
    },

    setStep: function (step) {
        this.step = step || this.step;
    },

    setValue: function (v) {

    }

});
BI.DateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.date_time_combo", BI.DateTimeCombo);