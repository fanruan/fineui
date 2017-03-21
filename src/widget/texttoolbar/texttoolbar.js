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
            baseCls: "bi-text-toolbar",
            width: 253,
            height: 28
        });
    },

    _init: function () {
        BI.TextToolbar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.size = BI.createWidget({
            type: "bi.text_toolbar_size_chooser",
            cls: "text-toolbar-size-chooser-trigger",
            title: BI.i18nText("BI-Font_Size")
        });
        this.size.on(BI.TextToolbarSizeChooser.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.bold = BI.createWidget({
            type: "bi.icon_button",
            title: BI.i18nText("BI-Basic_Bold"),
            height: 20,
            width: 20,
            cls: "text-toolbar-button bi-list-item-active text-bold-font"
        });
        this.bold.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.italic = BI.createWidget({
            type: "bi.icon_button",
            title: BI.i18nText("BI-Basic_Italic"),
            height: 20,
            width: 20,
            cls: "text-toolbar-button bi-list-item-active text-italic-font"
        });
        this.italic.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.underline = BI.createWidget({
            type: "bi.icon_button",
            title: BI.i18nText("BI-Underline"),
            height: 20,
            width: 20,
            cls: "text-toolbar-button bi-list-item-active text-underline-font"
        });
        this.underline.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.colorchooser = BI.createWidget({
            type: "bi.color_chooser",
            el: {
                type: "bi.text_toolbar_color_chooser_trigger",
                title: BI.i18nText("BI-Font_Colour"),
                cls: "text-toolbar-button"
            }
        });
        this.colorchooser.on(BI.ColorChooser.EVENT_CHANGE, function () {

            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.backgroundchooser = BI.createWidget({
            type: "bi.color_chooser",
            el: {
                type: "bi.text_toolbar_background_chooser_trigger",
                title: BI.i18nText("BI-Widget_Background_Colour"),
                cls: "text-toolbar-button"
            }
        });
        this.backgroundchooser.on(BI.ColorChooser.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.alignchooser = BI.createWidget({
            type: "bi.text_toolbar_align_chooser",
            cls: "text-toolbar-button"
        });
        this.alignchooser.on(BI.TextToolbarAlignChooser.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.size, this.bold, this.italic, this.underline, this.colorchooser, this.backgroundchooser, this.alignchooser],
            hgap: 3,
            vgap: 3
        })
    },

    isColorChooserVisible: function () {
        return this.colorchooser.isViewVisible();
    },

    isBackgroundChooserVisible: function () {
        return this.backgroundchooser.isViewVisible();
    },

    setValue: function (v) {
        v || (v = {});
        this.size.setValue(v["fontSize"] || 14);
        this.bold.setSelected(v["fontWeight"] === "bold");
        this.italic.setSelected(v["fontStyle"] === "italic");
        this.underline.setSelected(v["textDecoration"] === "underline");
        this.colorchooser.setValue(v["color"] || "#000000");
        this.backgroundchooser.setValue(v["backgroundColor"] || "#ffffff");
        this.alignchooser.setValue(v["textAlign"] || "left");
    },

    getValue: function () {
        return {
            "fontSize": this.size.getValue(),
            "fontWeight": this.bold.isSelected() ? "bold" : "normal",
            "fontStyle": this.italic.isSelected() ? "italic" : "normal",
            "textDecoration": this.underline.isSelected() ? "underline" : "initial",
            "color": this.colorchooser.getValue(),
            "backgroundColor": this.backgroundchooser.getValue(),
            "textAlign": this.alignchooser.getValue()
        }
    }
});
BI.TextToolbar.EVENT_CHANGE = "BI.TextToolbar.EVENT_CHANGE";
$.shortcut('bi.text_toolbar', BI.TextToolbar);