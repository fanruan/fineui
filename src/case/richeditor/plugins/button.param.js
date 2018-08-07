/**
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorParamButton
 * @extends BI.RichEditorParamAction
 */
BI.RichEditorParamButton = BI.inherit(BI.RichEditorParamAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorParamButton.superclass._defaultConfig.apply(this, arguments), {
            width: 20,
            height: 30
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
            height: o.height,
            width: o.width
        });
        this.param.on(BI.Button.EVENT_CHANGE, function () {
            self.addParam("参数");
        });
    },
    activate: function () {
    },

    deactivate: function () {
    }
});
BI.shortcut("bi.rich_editor_param_button", BI.RichEditorParamButton);