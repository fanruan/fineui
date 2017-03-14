/**
 * 选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.Farbtastic
 * @extends BI.Widget
 */
BI.Farbtastic = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Farbtastic.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-farbtastic",
            width: 195,
            height: 195
        })
    },

    _init: function () {
        BI.Farbtastic.superclass._init.apply(this, arguments);
        var self = this;

        this.farbtastic = $.farbtastic(this.element, function (v) {
            self.fireEvent(BI.Farbtastic.EVENT_CHANGE, self.getValue(), self);
        });
    },

    setValue: function (color) {
        this.farbtastic.setColor(color);
    },

    getValue: function () {
        return this.farbtastic.color;
    }
});
BI.Farbtastic.EVENT_CHANGE = "Farbtastic.EVENT_CHANGE";
$.shortcut("bi.farbtastic", BI.Farbtastic);