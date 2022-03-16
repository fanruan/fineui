/**
 * 文字trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.IconTextTrigger
 * @extends BI.Trigger
 */
BI.IconTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        var conf = BI.IconTextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 24,
            iconHeight: null,
            iconWidth: null,
            textCls: ""
        });
    },

    _init: function () {
        BI.IconTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "select-text-label" + (BI.isKey(o.textCls) ? (" " + o.textCls) : ""),
            textAlign: "left",
            height: o.height,
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            tgap: o.textTgap,
            bgap: o.textBgap,
            text: o.text
        });
        this.trigerButton = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.triggerWidth || o.height
        });

        BI.createWidget({
            element: this,
            type: "bi.horizontal_fill",
            columnSize: [BI.isEmptyString(o.iconCls) ? 0 : (o.iconWrapperWidth || o.height), "fill", o.triggerWidth || o.height],
            ref: function (_ref) {
                self.wrapper = _ref;
            },
            items: [{
                el: {
                    type: "bi.icon_change_button",
                    cls: "icon-combo-trigger-icon",
                    iconCls: o.iconCls,
                    ref: function (_ref) {
                        self.icon = _ref;
                    },
                    iconHeight: o.iconHeight,
                    iconWidth: o.iconWidth,
                    disableSelected: true
                }
            }, {
                el: this.text,
                lgap: BI.isEmptyString(o.iconCls) ? 5 : 0
            }, {
                el: this.trigerButton
            }]
        });
    },

    setValue: function (value) {
        this.text.setValue(value);
    },

    setIcon: function (iconCls) {
        var o = this.options;
        this.icon.setIcon(iconCls);
        var iconItem = this.wrapper.attr("items")[0];
        var textItem = this.wrapper.attr("items")[1];
        if (BI.isNull(iconCls) || BI.isEmptyString(iconCls)) {
            if (iconItem.width !== 0) {
                iconItem.width = 0;
                textItem.lgap = 5;
                this.wrapper.resize();
            }
        } else {
            if (iconItem.width !== (o.iconWrapperWidth || o.height)) {
                iconItem.width = (o.iconWrapperWidth || o.height);
                textItem.lgap = 0;
                this.wrapper.resize();
            }
        }
    },

    setTextCls: function (cls) {
        var o = this.options;
        var oldCls = o.textCls;
        o.textCls = cls;
        this.text.element.removeClass(oldCls).addClass(cls);
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
BI.shortcut("bi.icon_text_trigger", BI.IconTextTrigger);
