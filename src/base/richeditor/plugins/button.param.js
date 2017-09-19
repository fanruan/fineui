/**
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorParamButton
 * @extends BI.RichEditorAction
 */
BI.RichEditorParamButton = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorParamButton.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 20,
        });
    },

    _init: function () {
        BI.RichEditorParamButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.param = BI.createWidget({
            type: "bi.button",
            element: this,
            level: "ignore",
            minWidth: 0,
            text: BI.i18nText("BI-Formula_Insert"),
            height: 20,
            width: 30
        });
        this.param.on(BI.Button.EVENT_CHANGE, function () {
            var sel = $(o.editor.selectedInstance.selElm());
            var param = $("<span data-type='param' data-value='参数' style='background-color: #009de3;color:white;padding:0 5px;'>参数</span>").mousedown(function (e) {
                e.stopEvent();
                return false;
            });
            var wrapper = o.editor.instance.getElm().element;
            if (wrapper.find(sel).length <= 0) {
                wrapper.append(param);
                return;
            }
            var ln = sel.closest("a");
            if (ln.length === 0) {
                if (sel[0].nodeType === 3 && wrapper.find(sel.parent()).length > 0) {
                    sel.parent().after(param)
                } else {
                    sel.after(param)
                }
            }
        });
    },
    activate: function () {
    },

    deactivate: function () {
    },

    key: function (e) {
        var o = this.options;
        var instance = o.editor.selectedInstance;
        var wrapper = instance.getElm().element;
        var sel = $(instance.selElm());
        if (sel[0].nodeType === 3 && wrapper.find(sel.parent()).length > 0) {
            sel = sel.parent();
        }
        if (BI.Key[e.keyCode]) {
            if (sel.attr("data-type") === "param") {
                var span = $("<span></span>").text(BI.Key[e.keyCode]);
                if (sel.text() !== BI.Key[e.keyCode]) {
                    sel.after(span);
                    sel.text(sel.attr("data-value"));
                } else {
                    sel.after(span);
                    sel.destroy();
                }
                instance.setFocus(span[0]);
            }
        }
        if (e.keyCode === BI.KeyCode.BACKSPACE) {
            if (sel.attr("data-type") === "param") {
                if (sel.text() !== sel.attr("data-value")) {
                    sel.destroy();
                }
            }
        }
    }
});
BI.shortcut("bi.rich_editor_param_button", BI.RichEditorParamButton)