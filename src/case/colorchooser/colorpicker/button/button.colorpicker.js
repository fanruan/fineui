/**
 * 简单选色控件按钮
 *
 * Created by GUY on 2015/11/16.
 * @class BI.ColorPickerButton
 * @extends BI.BasicButton
 */
BI.ColorPickerButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.ColorPickerButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-picker-button bi-background bi-border-top bi-border-left"
        });
    },

    _init: function () {
        BI.ColorPickerButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.value)) {
            if (o.value === '') {
                this.element.addClass("auto-color-no-square-normal-background");
            } else if (o.value === "transparent") {
                this.element.addClass("trans-color-background");
            } else {
                this.element.css("background-color", o.value);
            }
            var name = this.getName();
            this.element.hover(function () {
                self._createMask();
                if (self.isEnabled()) {
                    BI.Maskers.show(name);
                }
            }, function () {
                if (!self.isSelected()) {
                    BI.Maskers.hide(name);
                }
            });
        }
    },

    _createMask: function () {
        var o = this.options, name = this.getName();
        if (this.isEnabled() && !BI.Maskers.has(name)) {
            var w = BI.Maskers.make(name, this, {
                offset: {
                    left: -1,
                    top: -1,
                    right: -1,
                    bottom: -1
                }
            });
            w.element.addClass("color-picker-button-mask").css("background-color", o.value);
        }
    },

    setSelected: function (b) {
        BI.ColorPickerButton.superclass.setSelected.apply(this, arguments);
        if (b) {
            this._createMask();
        }
        BI.Maskers[b ? "show" : "hide"](this.getName());
    }
});
BI.ColorPickerButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.color_picker_button", BI.ColorPickerButton);