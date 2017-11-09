/**
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorBoldButton
 * @extends BI.RichEditorAction
 */
BI.RichEditorBoldButton = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorBoldButton.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20,
            command: "Bold",
            tags: ["B", "STRONG"],
            css: {fontWeight: "bold"}
        });
    },

    _init: function () {
        BI.RichEditorBoldButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.bold = BI.createWidget({
            type: "bi.icon_button",
            element: this,
            title: BI.i18nText("BI-Basic_Bold"),
            height: 20,
            width: 20,
            cls: "text-toolbar-button bi-list-item-active text-bold-font"
        });
        this.bold.on(BI.IconButton.EVENT_CHANGE, function () {
            self.doCommand();
        });
    },
    activate: function () {
        this.bold.setSelected(true);
    },

    deactivate: function () {
        this.bold.setSelected(false);
    }
});
BI.shortcut("bi.rich_editor_bold_button", BI.RichEditorBoldButton)