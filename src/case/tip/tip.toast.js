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
        hgap: 20
    },

    _defaultConfig: function () {
        return BI.extend(BI.Toast.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-toast",
            text: "",
            level: "success",//success或warning
            height: 30
        })
    },
    _init: function () {
        BI.Toast.superclass._init.apply(this, arguments);
        var o = this.options;
        this.element.css({
            minWidth: this._const.minWidth + "px"
        })
        this.element.addClass("toast-" + o.level);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({"click": fn, "mousedown": fn, "mouseup": fn, "mouseover": fn, "mouseenter": fn, "mouseleave": fn, "mousemove": fn});

        this.text = BI.createWidget({
            type: "bi.label",
            element: this.element,
            text: o.text,
            height: 30,
            hgap: this._const.hgap
        })
    },

    setWidth: function(width){
        this.element.width(width);
    },

    setText: function (text) {
        this.text.setText(text);
    }
});

$.shortcut("bi.toast", BI.Toast);