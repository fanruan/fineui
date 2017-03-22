/**
 * 新建并选中某个分组按钮
 *
 * Created by GUY on 2015/9/25.
 * @class BI.Move2GroupAddButton
 * @extends BI.BasicButton
 */
BI.Move2GroupAddButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.Move2GroupAddButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + ' bi-move2group-add-button',
            shadow: true,
            isShadowShowingOnSelected: true,
            height: 30
        })
    },

    _init: function () {
        BI.Move2GroupAddButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            text: BI.i18nText("BI-Create_And_Move_To") + "\"江苏\"",
            height: o.height
        })
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "move2group-add-font"
                },
                width: 30
            }, {
                el: this.text
            }]
        })
    },

    setValue: function (v) {
        this.text.setValue(BI.i18nText("BI-Create_And_Move_To") + "\"" + v + "\"");
        this.setTitle(BI.i18nText("BI-Create_And_Move_To") + "\"" + v + "\"", {
            container: "body"
        });
    },

    doClick: function () {
        BI.Move2GroupAddButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.Move2GroupAddButton.EVENT_CHANGE);
        }
    }
});
BI.Move2GroupAddButton.EVENT_CHANGE = "Move2GroupAddButton.EVENT_CHANGE";
$.shortcut('bi.move2group_add_button', BI.Move2GroupAddButton);