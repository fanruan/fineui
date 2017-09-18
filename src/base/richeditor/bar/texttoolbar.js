/**
 * 颜色选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbar
 * @extends BI.Widget
 */
BI.TextToolbar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextToolbar.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-toolbar bi-background",
            buttons: [
                {type: "bi.rich_editor_size_chooser"},
                {type: "bi.rich_editor_bold_button"},
                {type: "bi.rich_editor_italic_button"},
                {type: "bi.rich_editor_underline_button"},
                {type: "bi.rich_editor_color_chooser"},
                {type: "bi.rich_editor_background_color_chooser"},
                {type: "bi.rich_editor_align_left_button"},
                {type: "bi.rich_editor_align_center_button"},
                {type: "bi.rich_editor_align_right_button"},
            ],
            height: 28
        });
    },

    _init: function () {
        BI.TextToolbar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: BI.map(o.buttons, function (i, btn) {
                return BI.extend(btn, {
                    editor: o.editor
                });
            }),
            hgap: 3,
            vgap: 3
        })
    },
});
BI.TextToolbar.EVENT_CHANGE = "BI.TextToolbar.EVENT_CHANGE";
BI.shortcut('bi.text_toolbar', BI.TextToolbar);