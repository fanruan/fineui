/**
 * 文本输入框trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.EditorTrigger
 * @extends BI.Trigger
 */
BI.EditorTrigger = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        var conf = BI.EditorTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-editor-trigger bi-border bi-border-radius",
            height: 24,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: false,
            watermark: "",
            errorText: ""
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.EditorTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText,
            title: function () {
                return self.getValue();
            }
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.EditorTrigger.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.EditorTrigger.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_EMPTY, function () {
            self.fireEvent(BI.EditorTrigger.EVENT_EMPTY, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.EditorTrigger.EVENT_VALID, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.EditorTrigger.EVENT_ERROR, arguments);
        });

        BI.createWidget({
            element: this,
            type: "bi.horizontal_fill",
            items: [
                {
                    el: this.editor,
                    width: "fill"
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        width: o.triggerWidth || o.height
                    },
                    width: o.triggerWidth || o.height
                }
            ]
        });
    },

    getValue: function () {
        return this.editor.getValue();
    },

    setValue: function (value) {
        this.editor.setValue(value);
    },

    setText: function (text) {
        this.editor.setState(text);
    }
});
BI.EditorTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.EditorTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.EditorTrigger.EVENT_EMPTY = "EVENT_EMPTY";
BI.EditorTrigger.EVENT_VALID = "EVENT_VALID";
BI.EditorTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.shortcut("bi.editor_trigger", BI.EditorTrigger);
