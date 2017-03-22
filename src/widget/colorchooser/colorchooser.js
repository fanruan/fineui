/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooser
 * @extends BI.Widget
 */
BI.ColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser",
            el: {}
        })
    },

    _init: function () {
        BI.ColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(BI.extend({
            type: "bi.color_chooser_trigger",
            width: o.width,
            height: o.height
        }, o.el));
        this.colorPicker = BI.createWidget({
            type: "bi.color_chooser_popup"
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 1,
            el: this.trigger,
            popup: {
                el: this.colorPicker,
                stopPropagation: false,
                minWidth: 202
            }
        });

        var fn = function () {
            var color = self.colorPicker.getValue();
            self.trigger.setValue(color);
            var colors = BI.string2Array(BI.Cache.getItem("colors") || "");
            var que = new BI.Queue(8);
            que.fromArray(colors);
            que.remove(color);
            que.unshift(color);
            BI.Cache.setItem("colors", BI.array2String(que.toArray()));
        };

        this.colorPicker.on(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, function () {
            fn();
        });

        this.colorPicker.on(BI.ColorChooserPopup.EVENT_CHANGE, function () {
            fn();
            self.combo.hideView();
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.colorPicker.setStoreColors(BI.string2Array(BI.Cache.getItem("colors") || ""));
        });

        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.fireEvent(BI.ColorChooser.EVENT_CHANGE, arguments);
        })
    },

    isViewVisible: function () {
        return this.combo.isViewVisible();
    },

    setEnable: function (v) {
        this.combo.setEnable(v)
    },

    setValue: function (color) {
        this.combo.setValue(color);
    },

    getValue: function () {
        return this.colorPicker.getValue();
    }
});
BI.ColorChooser.EVENT_CHANGE = "ColorChooser.EVENT_CHANGE";
$.shortcut("bi.color_chooser", BI.ColorChooser);