/**
 * 文本组件中 编辑栏作为trigger
 *
 * Created by GameJian on 2016/1/24.
 */
BI.TextArea = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextArea.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-area"
        });
    },

    _init: function () {
        BI.TextArea.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.textarea = BI.createWidget({
            type: "bi.textarea_editor",
            width: "100%",
            height: "100%"
        });

        this.textarea.on(BI.TextAreaEditor.EVENT_FOCUS, function () {
            self.combo.showView();
        });

        this.textarea.on(BI.TextAreaEditor.EVENT_BLUR, function () {
            if (BI.isEmptyString(this.getValue()) && !self.combo.isViewVisible()) {
                self._showLabel();
            } else {
                self._showInput();
            }
            self.fireEvent(BI.TextArea.EVENT_VALUE_CHANGE, arguments)
        });

        this.toolbar = BI.createWidget({
            type: "bi.text_toolbar"
        });

        this.toolbar.on(BI.TextToolbar.EVENT_CHANGE, function () {
            var style = this.getValue();
            self.textarea.setStyle(style);
            self.element.css(style);
            self.fireEvent(BI.TextArea.EVENT_VALUE_CHANGE, arguments);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            direction: "top",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            adjustLength: 1,
            el: this.textarea,
            popup: {
                el: this.toolbar,
                width: 253,
                height: 30,
                stopPropagation: false
            }
        });

        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            if (BI.isNotEmptyString(self.textarea.getValue())) {
                self._showInput();
            } else {
                self._showLabel();
            }
        });

        this.label = BI.createWidget({
            type: "bi.text_button",
            cls: "text-area-editor-text-button-label",
            whiteSpace: "normal",
            text: BI.i18nText("BI-Click_To_Input_Text")
        });

        this.label.on(BI.TextButton.EVENT_CHANGE, function () {
            self._showInput();
            self.textarea.focus();
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }, {
                el: this.label,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    _showInput: function () {
        this.label.setVisible(false);
    },

    _showLabel: function () {
        this.label.setVisible(true);
    },

    setValue: function (v) {
        v || (v = {});
        if (BI.isNotEmptyString(v.content)) {
            this._showInput();
        }
        this.textarea.setValue(v.content);
        this.toolbar.setValue(v.style);
        this.textarea.setStyle(v.style);
        this.element.css(v.style);
    },

    getValue: function () {
        return {style: this.toolbar.getValue(), content: this.textarea.getValue()};
    }
});
BI.TextArea.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
$.shortcut("bi.text_area", BI.TextArea);