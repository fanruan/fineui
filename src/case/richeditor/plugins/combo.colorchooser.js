/**
 * 颜色选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorColorChooser
 * @extends BI.RichEditorAction
 */
BI.RichEditorColorChooser = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorColorChooser.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20,
            command: "foreColor"
        });
    },

    _init: function () {
        BI.RichEditorColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorchooser = BI.createWidget({
            type: "bi.color_chooser",
            element: this,
            width: o.width,
            height: o.height,
            el: {
                type: "bi.rich_editor_color_chooser_trigger",
                title: BI.i18nText("BI-Font_Colour"),
                cls: "text-toolbar-button"
            }
        });
        this.colorchooser.on(BI.ColorChooser.EVENT_CHANGE, function () {
            self.doCommand(this.getValue());
        });

    },

    hideIf: function (e) {
        if(!this.colorchooser.element.find(e.target).length > 0) {
            this.colorchooser.hideView();
        }
    },

    deactivate: function () {
        this.colorchooser.setValue("");
    }
});
BI.shortcut("bi.rich_editor_color_chooser", BI.RichEditorColorChooser);