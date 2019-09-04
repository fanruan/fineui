/**
 * Created by windy on 2017/3/13.
 * 数值微调器
 */
BI.NumberEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.NumberEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-number-editor bi-border bi-focus-shadow",
            validationChecker: function () {
                return true;
            },
            valueFormatter: function (v) {
                return v;
            },
            value: 0,
            allowBlank: false,
            errorText: "",
            step: 1
        });
    },

    _init: function () {
        BI.NumberEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height - 2,
            allowBlank: o.allowBlank,
            value: o.valueFormatter(o.value),
            validationChecker: o.validationChecker,
            errorText: o.errorText
        });
        this.editor.on(BI.TextEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.NumberEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.TextEditor.EVENT_ERROR, function () {
            o.value = BI.parseFloat(this.getLastValidValue());
        });
        this.editor.on(BI.TextEditor.EVENT_VALID, function () {
            o.value = BI.parseFloat(this.getValue());
        });
        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.NumberEditor.EVENT_CONFIRM);
        });
        this.topBtn = BI.createWidget({
            type: "bi.icon_button",
            forceNotSelected: true,
            trigger: "lclick,",
            cls: "add-up-font top-button bi-border-left bi-list-item-active2 icon-size-12"
        });
        this.topBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(o.step);
            self.fireEvent(BI.NumberEditor.EVENT_CHANGE);
            self.fireEvent(BI.NumberEditor.EVENT_CONFIRM);
        });
        this.bottomBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            forceNotSelected: true,
            cls: "minus-down-font bottom-button bi-border-left bi-list-item-active2 icon-size-12"
        });
        this.bottomBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(-o.step);
            self.fireEvent(BI.NumberEditor.EVENT_CHANGE);
            self.fireEvent(BI.NumberEditor.EVENT_CONFIRM);
        });
        BI.createWidget({
            type: "bi.htape",
            height: o.height - 2,
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

    focus: function () {
        this.editor.focus();
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    // 微调
    _finetuning: function (add) {
        var v = BI.parseFloat(this.getValue());
        this.setValue(BI.add(v, add));
    },

    setUpEnable: function (v) {
        this.topBtn.setEnable(!!v);
    },

    setDownEnable: function (v) {
        this.bottomBtn.setEnable(!!v);
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    getLastChangedValue: function () {
        return this.editor.getLastChangedValue();
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
BI.NumberEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.NumberEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.number_editor", BI.NumberEditor);