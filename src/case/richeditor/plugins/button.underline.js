/**
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorItalicButton
 * @extends BI.RichEditorAction
 */
BI.RichEditorUnderlineButton = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorUnderlineButton.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20,
            command: "Underline",
            tags: ["U"],
            css: {textDecoration: "underline"}
        });
    },

    _init: function () {
        BI.RichEditorUnderlineButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.underline = BI.createWidget({
            type: "bi.icon_button",
            element: this,
            title: BI.i18nText("BI-Basic_Underline"),
            height: o.height,
            width: o.width,
            cls: "text-toolbar-button bi-list-item-active text-underline-font"
        });
        this.underline.on(BI.IconButton.EVENT_CHANGE, function () {
            self.doCommand();
        });
    },

    checkNodes: function (e) {
        var self = this;
        try {
            BI.defer(function() {
                if(document.queryCommandState("underline") ) {
                    self.activate();
                } else {
                    self.deactivate();
                }
            });
        } catch (error) {
            BI.RichEditorBoldButton.superclass.checkNodes(e);
        }
    },

    activate: function () {
        this.underline.setSelected(true);
    },

    deactivate: function () {
        this.underline.setSelected(false);
    }
});
BI.shortcut("bi.rich_editor_underline_button", BI.RichEditorUnderlineButton);