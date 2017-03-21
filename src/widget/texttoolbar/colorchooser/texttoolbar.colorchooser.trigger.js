/**
 * 颜色选择trigger
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbarColorChooserTrigger
 * @extends BI.Widget
 */
BI.TextToolbarColorChooserTrigger = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        var conf = BI.TextToolbarColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-toolbar-color-chooser-trigger",
            width: 20,
            height: 20
        });
    },

    _init: function () {
        BI.TextToolbarColorChooserTrigger.superclass._init.apply(this, arguments);
        this.font = BI.createWidget({
            type: "bi.icon_button",
            cls: "text-color-font"
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
                top: 4,
                left: 2
            },{
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
$.shortcut('bi.text_toolbar_color_chooser_trigger', BI.TextToolbarColorChooserTrigger);