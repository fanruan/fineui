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
            baseCls: "bi-select-text-trigger",
            height: 24,
        });
    },

    _init: function () {
        BI.SelectTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var obj = this._digest(o.value, o.items);
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            element: this,
            height: o.height,
            readonly: o.readonly,
            text: obj.text,
            textCls: obj.textCls,
            textHgap: o.textHgap,
            textVgap: o.textVgap,
            textLgap: o.textLgap,
            textRgap: o.textRgap,
            textTgap: o.textTgap,
            textBgap: o.textBgap,
            tipType: o.tipType,
            warningTitle: o.warningTitle
        });
    },

    _digest: function(vals, items){
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result = [];
        var formatItems = BI.Tree.transformToArrayFormat(items);
        BI.each(formatItems, function (i, item) {
            if (BI.deepContains(vals, item.value) && !BI.contains(result, item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            return {
                textCls: "",
                text: result.join(",")
            }
        } else {
            return {
                textCls: "bi-water-mark",
                text: BI.isFunction(o.text) ? o.text() : o.text
            }
        }
    },

    setValue: function (vals) {
        var formatValue = this._digest(vals, this.options.items);
        this.trigger.setTextCls(formatValue.textCls);
        this.trigger.setText(formatValue.text);
    },

    setTipType: function (v) {
        this.trigger.setTipType(v);
    },

    getTextor: function() {
        return this.trigger.getTextor();
    },

    populate: function (items) {
        this.options.items = items;
    }
});
BI.shortcut("bi.select_text_trigger", BI.SelectTextTrigger);
