/**
 * toast提示
 *
 * Created by GUY on 2015/9/7.
 * @class BI.Tooltip
 * @extends BI.Tip
 */
BI.Tooltip = BI.inherit(BI.Tip, {
    _const: {
        hgap: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.Tooltip.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-tooltip",
            text: "",
            level: "success",//success或warning
            height: 20
        })
    },
    _init: function () {
        BI.Tooltip.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.element.addClass("tooltip-" + o.level);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({
            "click": fn,
            "mousedown": fn,
            "mouseup": fn,
            "mouseover": fn,
            "mouseenter": fn,
            "mouseleave": fn,
            "mousemove": fn
        });

        var texts = (o.text + "").split("\n");
        if (texts.length > 1) {
            BI.createWidget({
                type: "bi.vertical",
                element: this,
                hgap: this._const.hgap,
                items: BI.map(texts, function (i, text) {
                    return {
                        type: "bi.label",
                        textAlign: "left",
                        whiteSpace: "normal",
                        text: text,
                        textHeight: 16
                    }
                })
            })
        } else {
            this.text = BI.createWidget({
                type: "bi.label",
                element: this,
                textAlign: "left",
                whiteSpace: "normal",
                text: o.text,
                textHeight: 20,
                hgap: this._const.hgap
            });
        }
    },

    setWidth: function (width) {
        this.element.width(width - 2 * this._const.hgap);
    },

    setText: function (text) {
        this.text && this.text.setText(text);
    },

    setLevel: function (level) {
        this.element.removeClass("tooltip-success").removeClass("tooltip-warning");
        this.element.addClass("tooltip-" + level);
    }
});

BI.shortcut("bi.tooltip", BI.Tooltip);