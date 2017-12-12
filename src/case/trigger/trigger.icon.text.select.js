/**
 * Created by Windy on 2017/12/12.
 */
BI.SelectIconTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectIconTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-text-trigger bi-border",
            height: 24
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.SelectIconTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.icon_text_trigger",
            element: this,
            height: o.height
        });
        if (BI.isKey(o.text)) {
            this.setValue(o.text);
        }
    },

    setValue: function (vals) {
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result;
        var items = BI.Tree.transformToArrayFormat(this.options.items);
        BI.any(items, function (i, item) {
            if (BI.deepContains(vals, item.value)) {
                result = {
                    text: item.text || item.value,
                    iconClass: item.iconClass
                };
                return true;
            }
        });

        if (BI.isNotNull(result)) {
            this.trigger.setText(result.text);
            this.trigger.setIcon(result.iconClass);
        } else {
            this.trigger.setText(o.text);
            this.trigger.setIcon("");
        }
    },

    populate: function (items) {
        this.options.items = items;
    }
});
BI.shortcut("bi.select_icon_text_trigger", BI.SelectIconTextTrigger);