/**
 *
 * Created by GUY on 2017/09/18.
 * @class BI.RichEditorParamAction
 * @extends BI.Widget
 */
BI.RichEditorParamAction = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorParamAction.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.RichEditorParamAction.superclass._init.apply(this, arguments);
        this.options.editor.instance.getElm().element.on("textchange", BI.bind(this._checkParam, this));
    },

    _checkParam: function (e) {
        var o = this.options;
        var instance = o.editor.selectedInstance;
        var wrapper = instance.getElm().element;
        var sel = $(instance.selElm());
        if (sel[0].nodeType === 3 && wrapper.find(sel.parent()).length > 0) {
            sel = sel.parent();
        }
        var value = sel.attr("data-value");
        var text = sel.text();
        text = BI.trim(text.replaceAll("　", ""));
        //检查光标前一个元素
        if (sel.attr("data-type") === "param" && text !== value) {
            if (text.indexOf(value) === 0) {
                var extra = sel.text().slice(value.length);
                if (extra.length > 0) {
                    var span = $("<span>").text(extra);
                    sel.after(span);
                    sel.text(sel.attr("data-value"));
                    instance.setFocus(span[0]);
                }
            } else {
                sel.text(sel.attr("data-value"));
            }
        }
        //检查光标后一个元素
        if (sel.next().attr("data-type") === "param" && sel.next().text() !== sel.next().attr("data-value")) {
            sel.next().destroy();
        }
    },

    addParam: function (param) {
        var o = this.options;
        var instance = o.editor.selectedInstance;
        var sel = $(instance.selElm());
        var $param = $("<span>").attr({
            "data-type": "param",
            "data-value": param
        }).css({
            color: "white",
            backgroundColor: "#009de3",
            padding: "0 5px"
        }).text(param).mousedown(function (e) {
            e.stopEvent();
            return false;
        });
        var wrapper = o.editor.instance.getElm().element;
        if (wrapper.find(sel).length <= 0) {
            wrapper.append($param);
            instance.setFocus($param[0]);
            return;
        }
        var ln = sel.closest("a");
        if (ln.length === 0) {
            if (sel[0].nodeType === 3 && wrapper.find(sel.parent()).length > 0) {
                sel.parent().after($param);
            } else {
                sel.after($param)
            }
            instance.setFocus($param[0]);
        }
    },

    keydown: function (e) {
        var o = this.options;
        var instance = o.editor.selectedInstance;
        var wrapper = instance.getElm().element;
        var sel = $(instance.selElm());
        if (sel[0].nodeType === 3 && wrapper.find(sel.parent()).length > 0) {
            sel = sel.parent();
        }
        if (BI.Key[e.keyCode]) {
            if (sel.attr("data-type") === "param") {
                var key = BI.Key[e.keyCode];
                key = e.shiftKey ? key.toUpperCase() : key;
                var span = $("<span>").text(key);
                sel.after(span);
                sel.text(sel.attr("data-value"));
                instance.setFocus(span[0]);
                e.stopEvent();
                return false;
            }
        }
        if (e.keyCode === BI.KeyCode.BACKSPACE) {
            if (sel.attr("data-type") === "param") {//删除后鼠标停留在参数中间
                sel.destroy();
                e.stopEvent();
                return false;
            }
        }
    },

    key: function (e) {
    }
});