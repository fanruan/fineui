/**
 * Created by roy on 15/9/14.
 */
BI.SearchEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function (config) {
        var conf = BI.SearchEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-search-editor bi-focus-shadow " + (config.simple ? "bi-border-bottom" : "bi-border"),
            height: 24,
            errorText: "",
            watermark: BI.i18nText("BI-Basic_Search"),
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn
        });
    },
    _init: function () {
        this.options.height -= this.options.simple ? 1 : 2;
        BI.SearchEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.editor",
            simple: o.simple,
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            hgap: 1,
            errorText: o.errorText,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            value: o.value
        });
        this.clear = BI.createWidget({
            type: "bi.icon_button",
            stopEvent: true,
            cls: "close-font",
            invisible: !o.value
        });
        this.clear.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue("");
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT, self.getValue());
            // 从有内容到无内容的清空也是一次change
            self.fireEvent(BI.SearchEditor.EVENT_CHANGE);
            self.fireEvent(BI.SearchEditor.EVENT_CLEAR);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: {
                        type: "bi.icon_label",
                        cls: "search-font"
                    },
                    width: 24
                },
                {
                    el: self.editor
                },
                {
                    el: this.clear,
                    width: 24
                }
            ]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SearchEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SearchEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self._checkClear();
            self.fireEvent(BI.SearchEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SearchEditor.EVENT_KEY_DOWN, v);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_BACKSPACE);
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SearchEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.SearchEditor.EVENT_ERROR);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SearchEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SearchEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self._checkClear();
            self.fireEvent(BI.SearchEditor.EVENT_EMPTY);
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_REMOVE);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE_CONFIRM, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CHANGE_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SearchEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SearchEditor.EVENT_STOP);
        });

        this.clear.invisible();
    },

    _checkClear: function () {
        if (!this.getValue()) {
            this.clear.invisible();
        } else {
            this.clear.visible();
        }
    },

    setWaterMark: function (v) {
        this.options.watermark = v;
        this.editor.setWaterMark(v);
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    getValue: function () {
        if (this.isValid()) {
            return this.editor.getValue();
        }
    },

    getKeywords: function () {
        var val = this.editor.getLastChangedValue();
        var keywords = val.match(/[\S]+/g);
        if (BI.isEndWithBlank(val)) {
            return keywords.concat([" "]);
        }
        return keywords;
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    getLastChangedValue: function () {
        return this.editor.getLastChangedValue();
    },

    setValue: function (v) {
        this.editor.setValue(v);
        if (BI.isKey(v)) {
            this.clear.visible();
        }
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    showClearIcon: function () {
        this.clear.visible();
    },

    hideClearIcon: function () {
        this.clear.invisible();
    }
});
BI.SearchEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SearchEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SearchEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SearchEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SearchEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SearchEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SearchEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";
BI.SearchEditor.EVENT_CLEAR = "EVENT_CLEAR";

BI.SearchEditor.EVENT_START = "EVENT_START";
BI.SearchEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SearchEditor.EVENT_STOP = "EVENT_STOP";
BI.SearchEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SearchEditor.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.SearchEditor.EVENT_VALID = "EVENT_VALID";
BI.SearchEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SearchEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SearchEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SearchEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.SearchEditor.EVENT_EMPTY = "EVENT_EMPTY";
BI.shortcut("bi.search_editor", BI.SearchEditor);
