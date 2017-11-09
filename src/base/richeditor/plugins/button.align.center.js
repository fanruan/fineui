/**
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorAlignCenterButton
 * @extends BI.RichEditorAction
 */
BI.RichEditorAlignCenterButton = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorAlignCenterButton.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20,
            command: "justifycenter"
        });
    },

    _init: function () {
        BI.RichEditorAlignCenterButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.align = BI.createWidget({
            type: "bi.icon_button",
            element: this,
            forceNotSelected: true,
            title: BI.i18nText("BI-Word_Align_Center"),
            height: 20,
            width: 20,
            cls: "text-toolbar-button bi-list-item-active text-align-center-font"
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
BI.shortcut("bi.rich_editor_align_center_button", BI.RichEditorAlignCenterButton)