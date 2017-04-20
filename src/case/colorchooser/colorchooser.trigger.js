/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooserTrigger
 * @extends BI.Trigger
 */
BI.ColorChooserTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        var conf = BI.ColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-chooser-trigger bi-card",
            height: 30
        })
    },

    _init: function () {
        BI.ColorChooserTrigger.superclass._init.apply(this, arguments);
        this.colorContainer = BI.createWidget({
            type: "bi.layout"
        });

        var down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font",
            width: 12,
            height: 8
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.colorContainer,
                left: 3,
                right: 3,
                top: 3,
                bottom: 3
            }, {
                el: down,
                right: 3,
                bottom: 3
            }]
        });
        if (this.options.value) {
            this.setValue(this.options.value);
        }
    },

    setValue: function (color) {
        BI.ColorChooserTrigger.superclass.setValue.apply(this, arguments);
        this.colorContainer.element.css("background-color", color);
    }
});
BI.ColorChooserTrigger.EVENT_CHANGE = "ColorChooserTrigger.EVENT_CHANGE";
BI.shortcut("bi.color_chooser_trigger", BI.ColorChooserTrigger);