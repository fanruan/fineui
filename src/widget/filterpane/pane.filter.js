/**
 * @class BI.FilterPane
 * @extend BI.Widget
 * 过滤面板
 */
BI.FilterPane = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FilterPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-filter-pane",
            expander: {},
            items: [],
            itemsCreator: BI.emptyFn
        })
    },

    _init: function () {
        BI.FilterPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: BI.extend({
                type: "bi.filter_expander",
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            }, o.expander),
            el: {
                type: "bi.filter_list"
            }
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.FilterPane.EVENT_CHANGE, [].slice.call(arguments, 1));
            }
        });

        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
    },

    populate: function (items) {
        this.tree.populate.apply(this.tree, arguments);
    },

    getValue: function () {
        return this.tree.getValue();
    }
});
BI.FilterPane.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.filter_pane", BI.FilterPane);