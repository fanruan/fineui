/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimeSelect = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateTimeSelect.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-time-select bi-border",
            max: 23,
            min: 0
        });
    },

    _init: function () {
        BI.DateTimeSelect.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            value: this._alertInEditorValue(o.min),
            allowBlank: false,
            errorText: BI.i18nText("BI-Please_Input_Natural_Number"),
            validationChecker: function (v) {
                return BI.isNaturalNumber(v);
            }
        });
        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self._finetuning(0);
            self.fireEvent(BI.DateTimeSelect.EVENT_CONFIRM);
        });
        this.topBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "column-pre-page-h-font top-button bi-border-left bi-border-bottom"
        });
        this.topBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(1);
            self.fireEvent(BI.DateTimeSelect.EVENT_CONFIRM);
        });
        this.bottomBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "column-next-page-h-font bottom-button bi-border-left"
        });
        this.bottomBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            self._finetuning(-1);
            self.fireEvent(BI.DateTimeSelect.EVENT_CONFIRM);
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

    _alertOutEditorValue: function (v) {
        if (v > this.options.max) {
            v = this.options.min;
        }
        if (v < this.options.min) {
            v = this.options.max;
        }
        return BI.parseInt(v);
    },

    _alertInEditorValue: function (v) {
        if (v > this.options.max) {
            v = this.options.min;
        }
        if (v < this.options.min) {
            v = this.options.max;
        }
        v = v < 10 ? "0" + v : v;
        return v;
    },

    _finetuning: function (add) {
        var v = BI.parseInt(this._alertOutEditorValue(this.editor.getValue()));
        this.editor.setValue(this._alertInEditorValue(v + add));
    },

    getValue: function () {
        var v = this.editor.getValue();
        return this._alertOutEditorValue(v);
    },

    setValue: function (v) {
        this.editor.setValue(this._alertInEditorValue(v));
        this._finetuning(0);
    }

});
BI.DateTimeSelect.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.date_time_select", BI.DateTimeSelect);