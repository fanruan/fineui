/**
 * 富文本编辑器
 *
 * Created by GUY on 2017/9/15.
 * @class BI.RichEditor
 * @extends BI.Widget
 */
BI.RichEditor = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-rich-editor",
        toolbar: {},
        readOnly: false
    },

    render: function () {
        var self = this, o = this.options;
        var editor = {
            type: "bi.nic_editor",
            width: o.width,
            height: o.height,
            readOnly: o.readOnly,
            ref: function () {
                self.editor = this;
            },
            listeners: [{
                eventName: BI.NicEditor.EVENT_BLUR,
                action: function () {
                    self.element.removeClass("bi-rich-editor-focus");
                    self.fireEvent(BI.RichEditor.EVENT_CONFIRM);
                }
            }, {
                eventName: BI.NicEditor.EVENT_FOCUS,
                action: function () {
                    self.element.addClass("bi-rich-editor-focus");
                    if (!o.readOnly && !self.combo.isViewVisible()) {
                        self.combo.showView();
                    }
                    self.fireEvent(BI.RichEditor.EVENT_FOCUS);
                }
            }]
        };
        if(o.readOnly) {
            return editor;
        }
        this.editor = BI.createWidget(editor);
        return {
            type: "bi.combo",
            toggle: false,
            trigger: "click",
            direction: "top,right",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            adjustLength: 1,
            ref: function () {
                self.combo = this;
            },
            el: this.editor,
            popup: {
                el: BI.extend({
                    type: "bi.rich_editor_text_toolbar",
                    editor: this.editor
                }, o.toolbar),
                height: 30,
                stopPropagation: true,
                stopEvent: true
            },
            listeners: [{
                eventName: BI.Combo.EVENT_AFTER_HIDEVIEW,
                action: function () {
                    self.fireEvent(BI.RichEditor.EVENT_AFTER_HIDEVIEW);
                }
            }]
        };
    },

    mounted: function () {
        var o = this.options;
        if(BI.isNull(o.value)) {
            this.editor.setValue(o.value);
        }
    },

    focus: function () {
        this.editor.focus();
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        return this.editor.getValue();
    }
});
BI.RichEditor.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";
BI.RichEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.RichEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.shortcut("bi.rich_editor", BI.RichEditor);