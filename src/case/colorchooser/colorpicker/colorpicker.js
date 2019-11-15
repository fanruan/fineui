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
        });
    },

    _items: [
        [{
            value: "#ffffff"
        }, {
            value: "#f2f2f2"
        }, {
            value: "#e5e5e5"
        }, {
            value: "#d9d9d9"
        }, {
            value: "#cccccc"
        }, {
            value: "#bfbfbf"
        }, {
            value: "#b2b2b2"
        }, {
            value: "#a6a6a6"
        }, {
            value: "#999999"
        }, {
            value: "#8c8c8c"
        }, {
            value: "#808080"
        }, {
            value: "#737373"
        }, {
            value: "#666666"
        }, {
            value: "#4d4d4d"
        }, {
            value: "#333333"
        }, {
            value: "#000000"
        }],
        [{
            value: "#d8b5a6"
        }, {
            value: "#ff9e9a"
        }, {
            value: "#ffc17d"
        }, {
            value: "#f5e56b"
        }, {
            value: "#d8e698"
        }, {
            value: "#e0ebaf"
        }, {
            value: "#c3d825"
        }, {
            value: "#bbe2e7"
        }, {
            value: "#85d3cd"
        }, {
            value: "#bde1e6"
        }, {
            value: "#a0d8ef"
        }, {
            value: "#89c3eb"
        }, {
            value: "#bbc8e6"
        }, {
            value: "#bbbcde"
        }, {
            value: "#d6b4cc"
        }, {
            value: "#fbc0d3"
        }],
        [{
            value: "#bb9581"
        }, {
            value: "#f37d79"
        }, {
            value: "#fba74f"
        }, {
            value: "#ffdb4f"
        }, {
            value: "#c7dc68"
        }, {
            value: "#b0ca71"
        }, {
            value: "#99ab4e"
        }, {
            value: "#84b9cb"
        }, {
            value: "#00a3af"
        }, {
            value: "#2ca9e1"
        }, {
            value: "#0095d9"
        }, {
            value: "#4c6cb3"
        }, {
            value: "#8491c3"
        }, {
            value: "#a59aca"
        }, {
            value: "#cc7eb1"
        }, {
            value: "#e89bb4"
        }],
        [{
            value: "#9d775f"
        }, {
            value: "#dd4b4b"
        }, {
            value: "#ef8b07"
        }, {
            value: "#fcc800"
        }, {
            value: "#aacf53"
        }, {
            value: "#82ae46"
        }, {
            value: "#69821b"
        }, {
            value: "#59b9c6"
        }, {
            value: "#2a83a2"
        }, {
            value: "#007bbb"
        }, {
            value: "#19448e"
        }, {
            value: "#274a78"
        }, {
            value: "#4a488e"
        }, {
            value: "#7058a3"
        }, {
            value: "#884898"
        }, {
            value: "#d47596"
        }]
    ],

    _init: function () {
        BI.ColorPicker.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colors = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems(o.items || this._items, {
                type: "bi.color_picker_button",
                once: false
            }),
            layouts: [{
                type: "bi.grid"
            }],
            value: o.value
        });
        this.colors.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.ColorPicker.EVENT_CHANGE, arguments);
        });
    },

    populate: function (items) {
        var args  = [].slice.call(arguments);
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
BI.ColorPicker.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.color_picker", BI.ColorPicker);