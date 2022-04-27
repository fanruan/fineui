/**
 * Created by Windy on 2017/12/12.
 */
BI.SelectIconTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectIconTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-text-trigger",
            height: 24,
            iconHeight: null,
            iconWidth: null,
            iconCls: ""
        });
    },

    _init: function () {
        BI.SelectIconTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var obj = this._digist(o.value, o.items);
        this.trigger = BI.createWidget({
            type: "bi.icon_text_trigger",
            element: this,
            text: obj.text,
            textCls: obj.textCls,
            iconCls: obj.iconCls,
            textHgap: o.textHgap,
            textVgap: o.textVgap,
            textLgap: o.textLgap,
            textRgap: o.textRgap,
            textTgap: o.textTgap,
            textBgap: o.textBgap,
            height: o.height,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            iconWrapperWidth: o.iconWrapperWidth
        });
    },

    _digist: function (vals, items) {
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result;
        var formatItems = BI.Tree.transformToArrayFormat(items);
        BI.any(formatItems, function (i, item) {
            if (BI.deepContains(vals, item.value)) {
                result = {
                    text: item.text || item.value,
                    iconCls: item.iconCls
                };
                return true;
            }
        });

        if (BI.isNotNull(result)) {
            return {
                text: result.text,
                textCls: "",
                iconCls: result.iconCls
            };
        } else {
            return {
                text: BI.isFunction(o.text) ? o.text() : o.text,
                textCls: "bi-water-mark",
                iconCls: o.iconCls
            };
        }
    },

    setValue: function (vals) {
        var obj = this._digist(vals, this.options.items);
        this.trigger.setText(obj.text);
        this.trigger.setIcon(obj.iconCls);
        this.trigger.setTextCls(obj.textCls);
    },

    populate: function (items) {
        this.options.items = items;
    }
});
BI.shortcut("bi.select_icon_text_trigger", BI.SelectIconTextTrigger);
