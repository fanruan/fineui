/**
 * @class BI.SingleTreeTrigger
 * @extends BI.Trigger
 */

BI.SingleTreeTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleTreeTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-tree-trigger",
            height: 30,
            text: "",
            items: []
        });
    },

    _init: function () {
        BI.SingleTreeTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            element: this,
            text: o.text,
            items: o.items,
            height: o.height
        });
    },

    _checkTitle: function () {
        var self = this, val = this.getValue();
        BI.any(this.options.items, function (i, item) {
            if (val.contains(item.value)) {
                self.trigger.setTitle(item.text || item.value);
                return true;
            }
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.options.value = v;
        this.trigger.setValue(v);
        this._checkTitle();
    },

    getValue: function () {
        return this.options.value || [];
    },

    populate: function (items) {
        BI.SingleTreeTrigger.superclass.populate.apply(this, arguments);
        this.trigger.populate(items);
    }

});

BI.shortcut("bi.single_tree_trigger", BI.SingleTreeTrigger);