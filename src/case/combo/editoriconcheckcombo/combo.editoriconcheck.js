/**
 * Created by Young's on 2016/4/28.
 */
BI.EditorIconCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.EditorIconCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-check-editor-combo",
            width: 100,
            height: 30,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: ""
        })
    },

    _init: function () {
        BI.EditorIconCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.editor_trigger",
            items: o.items,
            height: o.height,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.trigger.on(BI.EditorTrigger.EVENT_CHANGE, function () {
            self.popup.setValue(this.getValue());
            self.fireEvent(BI.EditorIconCheckCombo.EVENT_CHANGE);
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.TextValueCheckComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.editorIconCheckCombo.hideView();
            self.fireEvent(BI.EditorIconCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editorIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.editorIconCheckCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.EditorIconCheckCombo.superclass.setEnable.apply(this, arguments);
        this.editorIconCheckCombo.setEnable(v);
    },

    getValue: function () {
        return this.trigger.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.editorIconCheckCombo.populate(items);
    }
});
BI.EditorIconCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.editor_icon_check_combo", BI.EditorIconCheckCombo);