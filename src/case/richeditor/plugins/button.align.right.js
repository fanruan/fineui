/**
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorAlignRightButton
 * @extends BI.RichEditorAction
 */
BI.RichEditorAlignRightButton = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorAlignRightButton.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20,
            command: "justifyright"
        });
    },

    _init: function () {
        BI.RichEditorAlignRightButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.align = BI.createWidget({
            type: "bi.icon_button",
            element: this,
            forceNotSelected: true,
            title: BI.i18nText("BI-Word_Align_Right"),
            height: o.height,
            width: o.width,
            cls: "text-toolbar-button bi-list-item-active text-align-right-font"
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
BI.shortcut("bi.rich_editor_align_right_button", BI.RichEditorAlignRightButton);