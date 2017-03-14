/**
 * 简单选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.ColorPicker
 * @extends BI.Widget
 */
BI.ColorPicker = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorPicker.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-picker",
            items: null
        })
    },

    _items: [
        [{
            value: "#ff0000"
        }, {
            value: "#ffff02"
        }, {
            value: "#00ff00"
        }, {
            value: "#00ffff"
        }, {
            value: "#0000ff"
        }, {
            value: "#ff02ff"
        }, {
            value: "#ffffff"
        }, {
            value: "#e6e6e6"
        }, {
            value: "#cccccc"
        }, {
            value: "#b3b3b3"
        }, {
            value: "#999999"
        }, {
            value: "#808080"
        }, {
            value: "#666666"
        }, {
            value: "#4d4d4d"
        }, {
            value: "#333333"
        }, {
            value: "#1a1a1a"
        }],
        [{
            value: "#ea9b5e"
        }, {
            value: "#ebb668"
        }, {
            value: "#efca69"
        }, {
            value: "#faf4a2"
        }, {
            value: "#c9da73"
        }, {
            value: "#b6d19c"
        }, {
            value: "#86be85"
        }, {
            value: "#87c5c3"
        }, {
            value: "#75bfec"
        }, {
            value: "#85a9e0"
        }, {
            value: "#8890d3"
        }, {
            value: "#a484b9"
        }, {
            value: "#b48bbf"
        }, {
            value: "#ba8dc6"
        }, {
            value: "#e697c8"
        }, {
            value: "#e49da0"
        }],
        [{
            value: "#df6a18"
        }, {
            value: "#df8d04"
        }, {
            value: "#efb500"
        }, {
            value: "#faf201"
        }, {
            value: "#b2cc23"
        }, {
            value: "#7dbd2f"
        }, {
            value: "#48a754"
        }, {
            value: "#27acaa"
        }, {
            value: "#09abe9"
        }, {
            value: "#357bcc"
        }, {
            value: "#4d67c1"
        }, {
            value: "#5b4aa5"
        }, {
            value: "#7e52a5"
        }, {
            value: "#a057a4"
        }, {
            value: "#d1689c"
        }, {
            value: "#d66871"
        }],
        [{
            value: "#d12d02"
        }, {
            value: "#db6700"
        }, {
            value: "#ee9106"
        }, {
            value: "#f7ed02"
        }, {
            value: "#92b801"
        }, {
            value: "#37a600"
        }, {
            value: "#289100"
        }, {
            value: "#1a9589"
        }, {
            value: "#0292e0"
        }, {
            value: "#005dbb"
        }, {
            value: "#005eb4"
        }, {
            value: "#0041a3"
        }, {
            value: "#00217f"
        }, {
            value: "#811e89"
        }, {
            value: "#cd2a7c"
        }, {
            value: "#cd324a"
        }]
    ],

    _init: function () {
        BI.ColorPicker.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colors = BI.createWidget({
            type: "bi.button_group",
            element: this.element,
            items: BI.createItems(o.items || this._items, {
                type: "bi.color_picker_button",
                once: false
            }),
            layouts: [{
                type: "bi.grid"
            }]
        });
        this.colors.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.ColorPicker.EVENT_CHANGE, arguments);
        })
    },

    populate: function(items){
        var args  =[].slice.call(arguments);
        args[0] = BI.createItems(items, {
            type: "bi.color_picker_button",
            once: false
        });
        this.colors.populate.apply(this.colors, args);
    },

    setValue: function (color) {
        this.colors.setValue(color);
    },

    getValue: function () {
        return this.colors.getValue();
    }
});
BI.ColorPicker.EVENT_CHANGE = "ColorPicker.EVENT_CHANGE";
$.shortcut("bi.color_picker", BI.ColorPicker);