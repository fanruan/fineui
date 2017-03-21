/**
 * 对齐方式选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbarAlignChooser
 * @extends BI.Widget
 */
BI.TextToolbarAlignChooser = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextToolbarAlignChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-toolbar-align-chooser",
            width: 60,
            height: 20
        });
    },

    _init: function () {
        BI.TextToolbarAlignChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button_group = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems([{
                cls: "align-chooser-button text-align-left-font",
                selected: true,
                title: BI.i18nText("BI-Word_Align_Left"),
                value: BI.TextToolbarAlignChooser.TEXT_ALIGN_LEFT
            }, {
                cls: "align-chooser-button text-align-center-font",
                title: BI.i18nText("BI-Word_Align_Middle"),
                value: BI.TextToolbarAlignChooser.TEXT_ALIGN_CENTER
            }, {
                cls: "align-chooser-button text-align-right-font",
                title: BI.i18nText("BI-Word_Align_Right"),
                value: BI.TextToolbarAlignChooser.TEXT_ALIGN_RIGHT
            }], {
                type: "bi.icon_button",
                height: o.height
            }),
            layouts: [{
                type: "bi.center"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbarAlignChooser.EVENT_CHANGE, arguments);
        });
    },

    setValue: function (v) {
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue()[0];
    }
});
BI.extend(BI.TextToolbarAlignChooser, {
    TEXT_ALIGN_LEFT: "left",
    TEXT_ALIGN_CENTER: "center",
    TEXT_ALIGN_RIGHT: "right"
});
BI.TextToolbarAlignChooser.EVENT_CHANGE = "BI.TextToolbarAlignChooser.EVENT_CHANGE";
$.shortcut('bi.text_toolbar_align_chooser', BI.TextToolbarAlignChooser);