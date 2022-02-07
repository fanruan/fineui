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
            level: "success", // success或warning
            autoClose: true,
            closable: null
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.element.css({
            minWidth: this._const.minWidth / BI.pixRatio + BI.pixUnit
        });
        this.element.addClass("toast-" + o.level);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({
            click: fn,
            mousedown: fn,
            mouseup: fn,
            mouseover: fn,
            mouseenter: fn,
            mouseleave: fn,
            mousemove: fn
        });
        var cls = "close-font";
        switch (o.level) {
            case "success":
                cls = "toast-success-font";
                break;
            case "error":
                cls = "toast-error-font";
                break;
            case "warning":
                cls = "toast-warning-font";
                break;
            case "normal":
            default:
                cls = "toast-message-font";
                break;
        }

        var hasCloseIcon = function () {
            return o.closable === true || (o.closable === null && o.autoClose === false);
        };
        var items = [{
            type: "bi.icon_label",
            cls: cls + " toast-icon",
            width: 36
        }, {
            el: BI.isPlainObject(o.text) ? o.text : {
                type: "bi.label",
                whiteSpace: "normal",
                text: o.text,
                textHeight: 16,
                textAlign: "left"
            },
            rgap: hasCloseIcon() ? 0 : this._const.hgap
        }];

        var columnSize = [36, "fill"];

        if (hasCloseIcon()) {
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
            type: "bi.horizontal",
            horizontalAlign: BI.HorizontalAlign.Stretch,
            verticalAlign: BI.VerticalAlign.Middle,
            element: this,
            items: items,
            vgap: 7,
            columnSize: columnSize
        });
    },

    setText: function (text) {
        this.text.setText(text);
    },

    beforeDestroy: function () {
        this.fireEvent(BI.Toast.EVENT_DESTORY);
    }
});
BI.Toast.EVENT_DESTORY = "EVENT_DESTORY";
BI.shortcut("bi.toast", BI.Toast);
