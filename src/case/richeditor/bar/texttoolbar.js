/**
 * 颜色选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorTextToolbar
 * @extends BI.Widget
 */
BI.RichEditorTextToolbar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorTextToolbar.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-rich-editor-text-toolbar",
            buttons: [
                {type: "bi.rich_editor_font_chooser"},
                {type: "bi.rich_editor_size_chooser"},
                {type: "bi.rich_editor_bold_button"},
                {type: "bi.rich_editor_italic_button"},
                {type: "bi.rich_editor_underline_button"},
                {type: "bi.rich_editor_color_chooser"},
                {type: "bi.rich_editor_background_color_chooser"},
                {type: "bi.rich_editor_align_left_button"},
                {type: "bi.rich_editor_align_center_button"},
                {type: "bi.rich_editor_align_right_button"},
                {type: "bi.rich_editor_param_button"}
            ],
            height: 34
        });
    },

    _init: function () {
        BI.RichEditorTextToolbar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var buttons = BI.createWidgets(BI.map(o.buttons, function (i, btn) {
            return BI.extend(btn, {
                editor: o.editor
            });
        }));
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: buttons,
            hgap: 3,
            vgap: 6
        });
    },

    mounted: function () {
        var self = this;
        if (BI.isIE9Below()) {// IE8下必须要设置unselectable才能不blur输入框
            this.element.mousedown(function () {
                self._noSelect(self.element[0]);
            });
            this._noSelect(this.element[0]);
        }
    },

    _noSelect: function (element) {
        if (element.setAttribute && element.nodeName.toLowerCase() != "input" && element.nodeName.toLowerCase() != "textarea") {
            element.setAttribute("unselectable", "on");
        }
        for (var i = 0; i < element.childNodes.length; i++) {
            this._noSelect(element.childNodes[i]);
        }
    }
});
BI.shortcut("bi.rich_editor_text_toolbar", BI.RichEditorTextToolbar);