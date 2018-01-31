/**
 * toast提示
 *
 * Created by GUY on 2015/9/7.
 * @class BI.Toast
 * @extends BI.Tip
 */
BI.Toast = BI.inherit(BI.Tip, {
    _const: {
        minWidth: 200,
        hgap: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.Toast.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-toast",
            text: "",
            level: "success" // success或warning
        });
    },
    _init: function () {
        BI.Toast.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.element.css({
            minWidth: this._const.minWidth + "px"
        });
        this.element.addClass("toast-" + o.level);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({click: fn, mousedown: fn, mouseup: fn, mouseover: fn, mouseenter: fn, mouseleave: fn, mousemove: fn});

        var cls = "close-font";
        switch(o.level) {
            case "success":
                break;
            case "error":
                break;
            case "warning":
                break;
            case "normal":
            default:
                break;
        }

        var items = [{
            type: "bi.center_adapt",
            cls: cls + " toast-icon",
            items: [{
                type: "bi.icon"
            }],
            width: 36
        }, {
            el: {
                type: "bi.label",
                whiteSpace: "normal",
                text: o.text,
                textAlign: "left"
            },
            rgap: o.autoClose ? this._const.hgap : 0
        }];

        var columnSize = [36, ""];

        if(o.autoClose === false) {
            items.push({
                type: "bi.icon_button",
                cls: "close-font toast-icon",
                handler: function () {
                    self.destroy();
                },
                width: 36
            });
            columnSize.push(36);
        }

        this.text = BI.createWidget({
            type: "bi.horizontal_adapt",
            element: this,
            items: items,
            vgap: 5,
            columnSize: columnSize
        });
    },

    setText: function (text) {
        this.text.setText(text);
    }
});

BI.shortcut("bi.toast", BI.Toast);