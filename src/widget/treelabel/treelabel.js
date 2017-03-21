BI.TreeLabel = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TreeLabel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-label",
            itemsCreator: BI.emptyFn,
            titles: [],
            items: []
        })
    },

    _init: function () {
        BI.TreeLabel.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.titles = o.titles;
        this.items = o.items;

        this.view = BI.createWidget({
            type: "bi.tree_label_view",
            element: this,
            titles: o.titles,
            items: o.items
        });
        this.view.on(BI.TreeLabelView.EVENT_CHANGE, function (floors)  {
            var op = {};
            if (floors !== self.view.getMaxFloor() - 1) {
                op.floors = floors;
                op.selectedValues = self.getValue();
                self._itemsCreator(op);
            }
            self.fireEvent(BI.TreeLabel.EVENT_CHANGE, arguments);
        });
    },

    _itemsCreator: function (options) {
        var self = this, o = this.options;
        o.itemsCreator(options, function (data) {
            self.populate(data);
        })
    },

    populate: function (v) {
        this.view.populate(v);
    },

    getValue: function () {
        return this.view.getValue();
    }
});
BI.TreeLabel.EVENT_CHANGE = "BI.TreeLabel.EVENT_CHANGE";
$.shortcut('bi.tree_label', BI.TreeLabel);