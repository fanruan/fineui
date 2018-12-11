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
                ref: function (_ref) {
                    self.editor = _ref;
                },
                height: o.height - 2,
                watermark: o.watermark,
                allowBlank: o.allowBlank,
                value: o.value,
                level: o.level,
                quitChecker: o.quitChecker,
                validationChecker: o.validationChecker,
                listeners: [{
                    eventName: BI.Editor.EVENT_ERROR,
                    action: function () {
                        self.fireEvent(BI.Editor.EVENT_ERROR, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_FOCUS,
                    action: function () {
                        self.fireEvent(BI.Editor.EVENT_FOCUS, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_BLUR,
                    action: function () {
                        self.fireEvent(BI.Editor.EVENT_BLUR, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_VALID,
                    action: function () {
                        self.fireEvent(BI.Editor.EVENT_VALID, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.Editor.EVENT_CHANGE, arguments);
                    }
                }, {
                    eventName: BI.Editor.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.Editor.EVENT_CONFIRM, arguments);
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

    setTitle: function () {
        return this.editor.setTitle();
    },

    setEnable: function () {
        return this.editor.setEnable();
    },

    setValue: function (v) {
        return this.editor.setValue(v);
    }
});

BI.shortcut("bi.number_interval_single_editor", BI.NumberIntervalSingleEidtor);