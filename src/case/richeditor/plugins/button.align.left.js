/**
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorAlignLeftButton
 * @extends BI.RichEditorAction
 */
BI.RichEditorAlignLeftButton = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorAlignLeftButton.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20,
            command: "justifyleft"
        });
    },

    _init: function () {
        BI.RichEditorAlignLeftButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.align = BI.createWidget({
            type: "bi.icon_button",
            element: this,
            forceNotSelected: true,
            title: BI.i18nText("BI-Word_Align_Left"),
            height: o.height,
            width: o.width,
            cls: "text-toolbar-button bi-list-item-active text-align-left-font"
        });
        this.align.on(BI.IconButton.EVENT_CHANGE, function () {
            self.doCommand();
        });
    },
    activate: function () {
    },

    deactivate: function () {
    }
});
BI.shortcut("bi.rich_editor_align_left_button", BI.RichEditorAlignLeftButton);