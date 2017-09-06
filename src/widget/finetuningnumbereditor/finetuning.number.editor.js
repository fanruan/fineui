/**
 * Created by windy on 2017/3/13.
 * 数值微调器
 */
BI.FineTuningNumberEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FineTuningNumberEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-fine-tuning-number-editor bi-border",
            validationChecker: function () {return true;},
            valueFormatter: function (v) {return v;},
            value: 0,
            errorText: ""
        })
    },

    _init: function () {
        BI.FineTuningNumberEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            value: o.valueFormatter(o.value),
            validationChecker: o.validationChecker,
            errorText: o.errorText
        });
        this.editor.on(BI.TextEditor.EVENT_CHANGE, function () {
            o.value = this.getValue();
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function(){
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CONFIRM);
        });
        this.topBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            cls: "column-pre-page-h-font top-button bi-border-left bi-border-bottom"
        });
        this.topBtn.on(BI.IconButton.EVENT_CHANGE, function(){
            self._finetuning(1);
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CHANGE);
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CONFIRM);
        });
        this.bottomBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            cls: "column-next-page-h-font bottom-button bi-border-left bi-border-top"
        });
        this.bottomBtn.on(BI.IconButton.EVENT_CHANGE, function(){
            self._finetuning(-1);
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CHANGE);
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CONFIRM);
        });
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
                width: 23
            }]
        });
    },

    //微调
    _finetuning: function(add){
        var v = BI.parseFloat(this.getValue());
        this.setValue(v.add(add));
    },

    setUpEnable: function (v) {
        this.topBtn.setEnable(!!v);
    },

    setBottomEnable: function (v) {
        this.bottomBtn.setEnable(!!v);
    },

    getValue: function () {
        return this.options.value;
    },

    setValue: function (v) {
        var o = this.options;
        o.value = v;
        this.editor.setValue(o.valueFormatter(v));
    }

});
BI.FineTuningNumberEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.FineTuningNumberEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.fine_tuning_number_editor", BI.FineTuningNumberEditor);