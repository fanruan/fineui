/**
 * 颜色选择trigger
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorBackgroundChooserTrigger
 * @extends BI.Widget
 */
BI.RichEditorBackgroundChooserTrigger = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.RichEditorBackgroundChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            width: 20,
            height: 20
        });
    },

    _init: function () {
        BI.RichEditorBackgroundChooserTrigger.superclass._init.apply(this, arguments);
        this.font = BI.createWidget({
            type: "bi.icon_button",
            cls: "text-background-font"
        });

        this.underline = BI.createWidget({
            type: "bi.icon_button",
            cls: "text-color-underline-font"
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.font,
                top: 2,
                left: 2
            }, {
                el: this.underline,
                top: 7,
                left: 2
            }]
        })
    },

    setValue: function (color) {
        this.underline.element.css("color", color);
    },

    getValue: function () {
        return this.font.element.css("color");
    }
});
BI.shortcut('bi.rich_editor_background_color_chooser_trigger', BI.RichEditorBackgroundChooserTrigger);