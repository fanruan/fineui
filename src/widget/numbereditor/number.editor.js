/**
 * Created by windy on 2017/3/13.
 * 数值微调器
 */
BI.NumberEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function (conf) {
        return BI.extend(BI.NumberEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-number-editor bi-focus-shadow " + (conf.simple ? "bi-border-bottom" : "bi-border"),
            validationChecker: BI.emptyFn,
            valueFormatter: function (v) {
                return v;
            },
            value: 0,
            allowBlank: false,
            errorText: "",
            step: 1,
            min: BI.MIN,
            max: BI.MAX
        });
    },

    _init: function () {
        BI.NumberEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height - 2,
            simple: o.simple,
            allowBlank: o.allowBlank,
            value: o.valueFormatter(o.value),
            validationChecker: function (v) {
                // 不设置validationChecker就自动检测
                if(o.validationChecker === BI.emptyFn && !self._checkValueInRange(v)) {
                    return false;
                }
                return o.validationChecker(v);
            },
            errorText: o.errorText
        });
        this.editor.on(BI.TextEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.NumberEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.TextEditor.EVENT_ERROR, function () {
            o.value = BI.parseFloat(this.getLastValidValue());
            self._checkAdjustDisabled(o.value);
            self.element.addClass("error");
        });
        this.editor.on(BI.TextEditor.EVENT_VALID, function () {
            o.value = BI.parseFloat(this.getValue());
            self._checkAdjustDisabled(o.value);
            self.element.removeClass("error");
        });
        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.NumberEditor.EVENT_CONFIRM);
        });
        this.topBtn = BI.createWidget({
            type: "bi.icon_button",
            forceNotSelected: true,
            trigger: "lclick,",
            cls: (o.simple ? "solid-triangle-top-font " : "add-up-font bi-border-left ") + "top-button bi-list-item-active2 icon-size-12"
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
            cls: (o.simple ? "solid-triangle-bottom-font " : "minus-down-font bi-border-left ") + "bottom-button bi-list-item-active2 icon-size-12"
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

    _checkValueInRange: function(v) {
        var o = this.options;
        return !!(BI.isNumeric(v) && BI.parseFloat(v) >= o.min && BI.parseFloat(v) <= o.max);
    },

    _checkAdjustDisabled: function(v) {
        if(this.options.validationChecker === BI.emptyFn) {
            this.bottomBtn.setEnable(BI.parseFloat(v) > this.options.min);
            this.topBtn.setEnable(BI.parseFloat(v) < this.options.max);
        }
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