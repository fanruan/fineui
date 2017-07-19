/**
 * Created by dailer on 2017/7/19.
 * 时间微调器练习
 */

BI.TimeTuning = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TimeTuning.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-fine-tuning-number-editor bi-border",
            disabled: false,
            currentTime: {
                hour: 0,
                minute: 0,
                second: 0
            }
        })
    },

    _init: function () {
        BI.TimeTuning.superclass._init.apply(this, arguments);
        var self = this,
            o = this.options;
        if (o.formatter == BI.emptyFn) {
            this.formatter = function (v) {
                return v;
            }
        } else {
            this.formatter = o.formatter;
        }

        this.parser = o.parser;
        this.step = o.step;
        this.min = o.min;
        this.max = o.max;
        this.currentTime = BI.deepClone(o.currentTime);
        this.last = {
            lastH: o.currentTime.hour,
            lastM: o.currentTime.minute,
            lastS: o.currentTime.second
        }


        //时
        this.h = BI.createWidget({
            type: "bi.test_editor",
            value: this.currentTime.hour,
            min: 0,
            max: 23,
            width: 60,
            height: 30
        });
        this.h.on(BI.FineTuningNumberEditor.EVENT_CONFIRM, function () {});

        //分
        this.m = BI.createWidget({
            type: "bi.test_editor",
            value: this.currentTime.minute,
            min: 0,
            max: 59,
            width: 60,
            height: 30
        })
        this.m.on(BI.FineTuningNumberEditor.EVENT_CONFIRM, function () {
            self._reviseHour();
        });

        //秒
        this.s = BI.createWidget({
            type: "bi.test_editor",
            value: this.currentTime.second,
            min: 0,
            max: 59,
            width: 60,
            height: 30
        })
        this.s.on(BI.FineTuningNumberEditor.EVENT_CONFIRM, function () {
            self._reviseMinute();
        });



        this.editor = BI.createWidget({
            type: "bi.horizontal",
            items: [{
                    type: "bi.label",
                    text: "时间",
                    width: 45,
                    height: 30
                },
                this.h,
                {
                    type: "bi.text",
                    text: ":",
                    textAlign: "center",
                    width: 15
                },
                this.m,
                {
                    type: "bi.text",
                    text: ":",
                    textAlign: "center",
                    width: 15
                },
                this.s
            ]
        });

        BI.createWidget({
            type: "bi.htape",
            cls: "bi-border demo-clolor",
            element: this,
            items: [this.editor],
            width: 270,
            height: 50
        });
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
        this.value = v;
        this.editor.setValue();
    }

});
BI.TimeTuning.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.time_tunning", BI.TimeTuning);