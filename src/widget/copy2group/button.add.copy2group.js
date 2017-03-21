/**
 * 新建并选中某个分组按钮
 *
 * Created by GUY on 2015/9/25.
 * @class BI.Copy2GroupAddButton
 * @extends BI.BasicButton
 */
BI.Copy2GroupAddButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.Copy2GroupAddButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + ' bi-copy2group-add-button',
            shadow: true,
            isShadowShowingOnSelected: true,
            height: 30
        })
    },

    _init: function () {
        BI.Copy2GroupAddButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            text: BI.i18nText("BI-Create_And_Select") + "\"江苏\"",
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
        this.text.setValue(BI.i18nText("BI-Create_And_Select") + "\"" + v + "\"");
        this.setTitle(BI.i18nText("BI-Create_And_Select") + "\"" + v + "\"", {
            container: "body"
        });
    },

    doClick: function () {
        BI.Copy2GroupAddButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.Copy2GroupAddButton.EVENT_CHANGE);
        }
    }
});
BI.Copy2GroupAddButton.EVENT_CHANGE = "Copy2GroupAddButton.EVENT_CHANGE";
$.shortcut('bi.copy2group_add_button', BI.Copy2GroupAddButton);