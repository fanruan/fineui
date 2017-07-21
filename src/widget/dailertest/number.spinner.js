/**
 * Created by dailer on 2017/7/18.
 * 数值微调器练习
 */
BI.NumberSpinner = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.NumberSpinner.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-fine-tuning-number-editor bi-border",
            value: 0,
            min: 0,
            max: 100000,
            step: 1,
            formatter: BI.emptyFn,
            parser: BI.emptyFn
        })
    },

    _init: function () {
        BI.NumberSpinner.superclass._init.apply(this, arguments);
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
        this.value = o.value;
        this.isNeedRevise = 0;

        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            value: o.value,
            errorText: BI.i18nText("BI-Please_Input_Natural_Number")
        });
        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.setValue(self.editor.getValue());
            self.fireEvent(BI.NumberSpinner.EVENT_CONFIRM);
        });


        this.topBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            cls: "column-pre-page-h-font top-button bi-border-left bi-border-bottom",
        });
        this.topBtn.on(BI.IconButton.EVENT_CHANGE, function () {

            self._finetuning(1);

            self.fireEvent(BI.NumberSpinner.EVENT_CONFIRM);
        });

        this.bottomBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            cls: "column-next-page-h-font bottom-button bi-border-left bi-border-top"
        });
        this.bottomBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(-1);
            self.fireEvent(BI.NumberSpinner.EVENT_CONFIRM);
        });

        this._finetuning(0);

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [this.editor, {
                el: {
                    type: "bi.grid",
                    columns: 1,
                    rows: 2,
                    items: [{
                        column: 0,
                        row: 0,
                        el: this.topBtn
                    }, {
                        column: 0,
                        row: 1,
                        el: this.bottomBtn
                    }]
                },
                width: 30
            }]
        });
    },

    //微调
    _finetuning: function (add) {
        //窝是在不值该如何处理精度损失问题,所以迫不得已采取了这个方法
        var v = BI.parseFloat(this.editor.getValue()) * 1000000000000;
        var addend = add * this.step * 1000000000000;
        var result = (v + addend) / 1000000000000;

        if (result > this.max) {
            this.editor.setValue(this.formatter(this.min));
            this.isNeedRevise = 1;
            this.value = this.min;
            return;
        }
        if (result < this.min) {
            this.editor.setValue(this.formatter(this.max));
            this.isNeedRevise = -1;
            this.value = this.max;
            return;
        }
        this.value = result;
        this.isNeedRevise = 0;
        this.editor.setValue(this.formatter(result));

    },

    getIsNeedRevise: function () {
        return this.isNeedRevise;
    },

    getMinAndMax: function () {
        return {
            min: this.min,
            max: this.max
        };
    },

    getStep: function () {
        return this.step;
    },

    getValue: function () {
        return this.value;
    },

    setStep: function (step) {
        this.step = step || this.step;
    },

    setValue: function (v) {
        this.value = v;
        this.editor.setValue(this.formatter(v));
    }

});
BI.NumberSpinner.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.test_editor", BI.NumberSpinner);