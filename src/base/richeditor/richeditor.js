/**
 * 富文本编辑器
 *
 * Created by GUY on 2017/9/15.
 * @class BI.RichEditor
 * @extends BI.Widget
 */
BI.RichEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-rich-editor bi-card"
        });
    },
    _init: function () {
        BI.RichEditor.superclass._init.apply(this, arguments);
        var o = this.options;
        this.editor = BI.createWidget({
            type: "bi.layout",
            tagName: "textarea",
            width: o.width || "100%",
            height: o.height || "100%"
        });
        BI.createWidget({
            type: "bi.default",
            element: this,
            items: [this.editor]
        })
    },

    mounted: function () {
        this.ne = new BI.nicEditor({
            maxHeight: this.options.height
        }).panelInstance(this.editor.element[0]);
    },

    setValue: function (v) {
    },

    getValue: function () {
    }
});
BI.shortcut('bi.rich_editor', BI.RichEditor);