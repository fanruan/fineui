/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/7/28
 */
BI.HexColorPicker = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-hex-color-picker",
        items: null,
    },

    _items: [
        [{
            value: "#808080"
        }, {
            value: "#ffffff"
        }, {
            value: "#ffebe5"
        }, {
            value: "#ffddba"
        }, {
            value: "#ffeebb"
        }, {
            value: "#d4e9bf"
        }, {
            value: "#c7e1e1"
        }, {
            value: "#bfe3f0"
        }, {
            value: "#ccd6eb"
        }],
        [{
            value: "#616161"
        }, {
            value: "#f2f2f2"
        }, {
            value: "#ffd6cc"
        }, {
            value: "#ffb87a"
        }, {
            value: "#ffdf91"
        }, {
            value: "#b7d2b6"
        }, {
            value: "#a3d2c9"
        }, {
            value: "#8ab6d6"
        }, {
            value: "#bcbce0"
        }],
        [{
            value: "#404040"
        }, {
            value: "#dedede"
        }, {
            value: "#ffab9b"
        }, {
            value: "#eb8a3a"
        }, {
            value: "#ffc947"
        }, {
            value: "#8aa964"
        }, {
            value: "#5eaaa0"
        }, {
            value: "#2978b5"
        }, {
            value: "#8f8faa"
        }],
        [{
            value: "#202020"
        }, {
            value: "#bfbfbf"
        }, {
            value: "#df7461"
        }, {
            value: "#cf7536"
        }, {
            value: "#e6b63b"
        }, {
            value: "#5b8a72"
        }, {
            value: "#3b9aa3"
        }, {
            value: "#336291"
        }, {
            value: "#58568f"
        }],
        [{
            value: "#000000"
        }, {
            value: "#a1a1a1"
        }, {
            value: "#b55140"
        }, {
            value: "#a6713c"
        }, {
            value: "#ad975f"
        }, {
            value: "#5f7d6e"
        }, {
            value: "#3b7480"
        }, {
            value: "#425d78"
        }, {
            value: "#62608a"
        }]
    ],

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.button_group",
            items: this._digest(o.items || this._items),
            layouts: [{
                type: "bi.grid",
            }],
            value: o.value,
            listeners: [{
                eventName: BI.ButtonGroup.EVENT_CHANGE,
                action: function () {
                    self.fireEvent(BI.HexColorPicker.EVENT_CHANGE, arguments);
                }
            }],
            ref: function (_ref) {
                self.colors = _ref;
            }
        };
    },

    _digest: function (items) {
        var o = this.options;
        var blocks = [];
        BI.each(items, function (idx, row) {
            var bRow = [];
            BI.each(row, function (idx, item) {
                bRow.push(BI.extend({
                    type: "bi.color_picker_button",
                    once: false,
                    cls: o.space ? 'bi-border-right' : '',
                }, item));
                if (o.space && idx < row.length - 1) {
                    bRow.push({ type: 'bi.layout' });
                }
            });
            blocks.push(bRow);
        });

        return blocks;
    },

    populate: function (items) {
        var args = [].slice.call(arguments);
        args[0] = this._digest(items);
        this.colors.populate.apply(this.colors, args);
    },

    setValue: function (color) {
        this.colors.setValue(color);
    },

    getValue: function () {
        return this.colors.getValue();
    }
});
BI.HexColorPicker.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.hex_color_picker", BI.HexColorPicker);
