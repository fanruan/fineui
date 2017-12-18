/**
 * 选择字段trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.SelectTextTrigger
 * @extends BI.Trigger
 */
BI.SelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-text-trigger bi-border",
            height: 24
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.SelectTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
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
        var result = [];
        var items = BI.Tree.transformToArrayFormat(this.options.items);
        BI.each(items, function (i, item) {
            if (BI.deepContains(vals, item.value) && !result.contains(item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            this.trigger.setText(result.join(","));
        } else {
            this.trigger.setText(o.text);
        }
    },

    populate: function (items) {
        this.options.items = items;
    }
});
BI.shortcut("bi.select_text_trigger", BI.SelectTextTrigger);