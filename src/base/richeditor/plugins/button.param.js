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
            var param = "<span data-type='param' style='background-color: #009de3;color:white;padding:0 5px;'>参数</span>"
            if (o.editor.instance.getElm().element.find(sel).length <= 0) {
                o.editor.instance.getElm().element.append(param);
                return;
            }
            var ln = sel.closest("a");
            if (ln.length === 0) {
                sel.after(param)
            }
        });
    },
    activate: function () {
    },

    deactivate: function () {
    },

    key: function (e) {
        var o = this.options;
        if (e.keyCode === BI.KeyCode.BACKSPACE) {
            var sel = $(o.editor.selectedInstance.selElm()).parent();
            if (sel.attr("data-type") === "param") {
                sel.destroy();
            }
        }
    }
});
BI.shortcut("bi.rich_editor_param_button", BI.RichEditorParamButton)