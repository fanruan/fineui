BI.AllValueMultiTextValueCombo = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-all-value-multi-text-value-combo",
        width: 200,
        height: 24,
        items: []
    },

    render: function () {
        var self = this, o = this.options;
        var value = this._digestValue(o.value);
        return {
            type: "bi.search_multi_text_value_combo",
            simple: o.simple,
            text: o.text,
            height: o.height,
            items: o.items,
            value: value,
            numOfPage: 100,
            valueFormatter: o.valueFormatter,
            warningTitle: o.warningTitle,
            listeners: [{
                eventName: BI.SearchMultiTextValueCombo.EVENT_CONFIRM,
                action: function () {
                    self.fireEvent(BI.AllValueMultiTextValueCombo.EVENT_CONFIRM);
                }
            }],
            ref: function () {
                self.combo = this;
            }
        };
    },

    setValue: function (v) {
        var value = this._digestValue(v);
        this.combo.setValue(value);
    },

    getValue: function () {
        var obj = this.combo.getValue() || {};
        obj.value = obj.value || [];
        if(obj.type === BI.Selection.All) {
            var values = [];
            BI.each(this.options.items, function (idx, item) {
                !BI.contains(obj.value, item.value) && values.push(item.value);
            });
            return values;
        }
        return obj.value || [];
    },

    populate: function (items) {
        this.options.items = items;
        this.combo.populate.apply(this.combo, arguments);
    },

    _digestValue: function (v) {
        return {
            type: BI.Selection.Multi,
            value: v || []
        };
    }
});
BI.AllValueMultiTextValueCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.all_value_multi_text_value_combo", BI.AllValueMultiTextValueCombo);
