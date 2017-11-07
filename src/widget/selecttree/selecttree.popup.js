/**
 * @class BI.SelectTreePopup
 * @extends BI.Pane
 */

BI.SelectTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-level-tree",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            items: []
        });
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {layer: layer};
            node.id = node.id || BI.UUID();
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.select_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.select_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.select_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);
                self._formatItems(node.children);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _init: function () {
        BI.SelectTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: 'bi.level_tree',
            expander: {
                type: "bi.select_tree_expander",
                isDefaultInit: true
            },
            items: this._formatItems(BI.Tree.transformToTreeFormat(o.items)),
            chooseType: BI.Selection.Single
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.SelectTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.SelectTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.select_level_tree", BI.SelectTreePopup);