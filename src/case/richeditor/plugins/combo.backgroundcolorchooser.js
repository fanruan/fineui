/**
 * 颜色选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorBackgroundColorChooser
 * @extends BI.RichEditorAction
 */
BI.RichEditorBackgroundColorChooser = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorBackgroundColorChooser.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20
        });
    },

    _init: function () {
        BI.RichEditorBackgroundColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorchooser = BI.createWidget({
            type: "bi.color_chooser",
            element: this,
            width: o.width,
            height: o.height,
            el: {
                type: "bi.rich_editor_background_color_chooser_trigger",
                title: BI.i18nText("BI-Widget_Background_Colour"),
                cls: "text-toolbar-button"
            }
        });
        this.colorchooser.on(BI.ColorChooser.EVENT_CHANGE, function () {
            var backgroundColor = this.getValue();
            o.editor.element.css({
                backgroundColor: backgroundColor,
                color: BI.DOM.getContrastColor(backgroundColor)
            });
            self.fireEvent("EVENT_CHANGE", backgroundColor);
        });
    },

    hideIf: function (e) {
        if(!this.colorchooser.element.find(e.target).length > 0) {
            this.colorchooser.hideView();
        }
    },

    deactivate: function () {
    }
});
BI.shortcut("bi.rich_editor_background_color_chooser", BI.RichEditorBackgroundColorChooser);