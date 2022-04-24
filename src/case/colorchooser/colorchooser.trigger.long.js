/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.LongColorChooserTrigger
 * @extends BI.Trigger
 */
BI.LongColorChooserTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function (config) {
        var conf = BI.LongColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-chooser-trigger bi-focus-shadow " + (config.simple ? "bi-border-bottom" : "bi-border"),
            height: 24
        });
    },

    _init: function () {
        BI.LongColorChooserTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorContainer = BI.createWidget({
            type: "bi.htape",
            cls: "color-chooser-trigger-content",
            items: [{
                type: "bi.icon_change_button",
                ref: function (_ref) {
                    self.changeIcon = _ref;
                },
                disableSelected: true,
                iconCls: "auto-color-icon",
                width: 24,
                iconWidth: 16,
                iconHeight: 16
            }, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.label = _ref;
                    },
                    textAlign: "left",
                    hgap: 5,
                    height: 18,
                    text: BI.i18nText("BI-Basic_Auto")
                }
            }]
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
                right: 3,
                bottom: 3
            }]
        });
        if (this.options.value) {
            this.setValue(this.options.value);
        }
    },

    setValue: function (color) {
        BI.LongColorChooserTrigger.superclass.setValue.apply(this, arguments);
        if (color === "") {
            this.colorContainer.element.css("background-color", "");
            this.changeIcon.setVisible(true);
            this.label.setVisible(true);
            this.changeIcon.setIcon("auto-color-icon");
            this.label.setText(BI.i18nText("BI-Basic_Auto"));
        } else if (color === "transparent") {
            this.colorContainer.element.css("background-color", "");
            this.changeIcon.setVisible(true);
            this.label.setVisible(true);
            this.changeIcon.setIcon("trans-color-icon");
            this.label.setText(BI.i18nText("BI-Transparent_Color"));
        } else {
            this.colorContainer.element.css({"background-color": color});
            this.changeIcon.setVisible(false);
            this.label.setVisible(false);
        }
    }
});
BI.LongColorChooserTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.long_color_chooser_trigger", BI.LongColorChooserTrigger);
