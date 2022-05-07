BI.NumberIntervalSingleEidtor = BI.inherit(BI.Single, {
    props: {
        baseCls: "bi-number-interval-single-editor",
        tipType: "success",
        title: ""
    },

    render: function () {
        var self = this, o = this.options;

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.editor",
                simple: o.simple,
                ref: function (_ref) {
                    self.editor = _ref;
                },
                height: o.height,
                watermark: o.watermark,
                allowBlank: o.allowBlank,
                value: o.value,
                quitChecker: o.quitChecker,
                validationChecker: o.validationChecker,
                listeners: [{
                    eventName: BI.Editor.EVENT_ERROR,
                    action: function () {
                        self.fireEvent(BI.NumberIntervalSingleEidtor.EVENT_ERROR, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_FOCUS,
                    action: function () {
                        self.fireEvent(BI.NumberIntervalSingleEidtor.EVENT_FOCUS, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_BLUR,
                    action: function () {
                        self.fireEvent(BI.NumberIntervalSingleEidtor.EVENT_BLUR, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_VALID,
                    action: function () {
                        self.fireEvent(BI.NumberIntervalSingleEidtor.EVENT_VALID, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.NumberIntervalSingleEidtor.EVENT_CHANGE, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.NumberIntervalSingleEidtor.EVENT_CONFIRM, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_CHANGE_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.NumberIntervalSingleEidtor.EVENT_CHANGE_CONFIRM, arguments);
                    }
                }]
            }]
        };
    },

    isValid: function () {
        return this.editor.isValid();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    setValue: function (v) {
        return this.editor.setValue(v);
    },

    focus: function () {
        this.editor.focus();
    }
});

BI.NumberIntervalSingleEidtor.EVENT_FOCUS = "EVENT_FOCUS";
BI.NumberIntervalSingleEidtor.EVENT_BLUR = "EVENT_BLUR";
BI.NumberIntervalSingleEidtor.EVENT_ERROR = "EVENT_ERROR";
BI.NumberIntervalSingleEidtor.EVENT_VALID = "EVENT_VALID";
BI.NumberIntervalSingleEidtor.EVENT_CHANGE = "EVENT_CHANGE";
BI.NumberIntervalSingleEidtor.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.NumberIntervalSingleEidtor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.number_interval_single_editor", BI.NumberIntervalSingleEidtor);