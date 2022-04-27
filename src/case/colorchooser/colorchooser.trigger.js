/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooserTrigger
 * @extends BI.Trigger
 */
BI.ColorChooserTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function (config) {
        var conf = BI.ColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-chooser-trigger bi-focus-shadow " + (config.simple ? "bi-border-bottom" : "bi-border"),
            height: 22
        });
    },

    _init: function () {
        BI.ColorChooserTrigger.superclass._init.apply(this, arguments);
        this.colorContainer = BI.createWidget({
            type: "bi.layout",
            cls: "color-chooser-trigger-content" + (BI.isIE9Below && BI.isIE9Below() ? " hack" : "")
        });

        var down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font icon-size-12",
            width: 12,
            height: 8
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.colorContainer,
                left: 2,
                right: 2,
                top: 2,
                bottom: 2
            }, {
                el: down,
                right: -1,
                bottom: 1
            }]
        });
        if (BI.isNotNull(this.options.value)) {
            this.setValue(this.options.value);
        }
    },

    setValue: function (color) {
        BI.ColorChooserTrigger.superclass.setValue.apply(this, arguments);
        if (color === "") {
            this.colorContainer.element.css("background-color", "").removeClass("trans-color-background").addClass("auto-color-background");
        } else if (color === "transparent") {
            this.colorContainer.element.css("background-color", "").removeClass("auto-color-background").addClass("trans-color-background");
        } else {
            this.colorContainer.element.css({"background-color": color}).removeClass("auto-color-background").removeClass("trans-color-background");
        }
    }
});
BI.ColorChooserTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.color_chooser_trigger", BI.ColorChooserTrigger);
