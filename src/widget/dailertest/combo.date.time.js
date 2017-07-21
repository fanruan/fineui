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
            type: "bi.date_time_trigger1"
        });

        this.trigger.on(BI.DateTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });

        this.popup = BI.createWidget({
            type: "bi.date_time_popup"
        });

        this.popup.on(BI.DateTimePopup.EVENT_CHANGE, function () {
            //self.setValue(self.popup.getValue());
        });
        this.popup.on(BI.DateTimePopup.EVENT_CLICK_CONFIRM, function () {
            //do something here
            self.setValue();
            self.combo.hideView();
        });
        this.popup.on(BI.DateTimePopup.EVENT_CLICK_CANCEL, function () {
            self.combo.hideView();
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: true,
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


    getValue: function () {
        return this.popup.getValue();
    },

    setStep: function (step) {
        this.step = step || this.step;
    },

    setValue: function (v) {
        this.trigger.setValue(this.popup.getValue());
    }

});
BI.DateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.date_time_combo", BI.DateTimeCombo);