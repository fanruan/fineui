/**
 * 颜色选择trigger
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbarBackgroundChooserTrigger
 * @extends BI.Widget
 */
BI.TextToolbarBackgroundChooserTrigger = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        var conf = BI.TextToolbarBackgroundChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-toolbar-background-chooser-trigger",
            width: 20,
            height: 20
        });
    },

    _init: function () {
        BI.TextToolbarBackgroundChooserTrigger.superclass._init.apply(this, arguments);
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
                top: 3,
                left: 2
            }, {
                el: this.underline,
                top: 9,
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
$.shortcut('bi.text_toolbar_background_chooser_trigger', BI.TextToolbarBackgroundChooserTrigger);