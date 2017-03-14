/**
 * guy
 * 二级树
 * @class BI.LevelTree
 * @extends BI.Single
 */
BI.LevelTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LevelTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-level-tree",
            el: {
                chooseType: 0
            },
            expander: {},
            items: []
        })
    },

    _init: function () {
        BI.LevelTree.superclass._init.apply(this, arguments);

        this.initTree(this.options.items);
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {layer: layer};
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);
                self._formatItems(node.children, layer + 1);
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

    _assertId: function (sNodes) {
        BI.each(sNodes, function (i, node) {
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
        });
    },

    //构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        this.empty();
        this._assertId(nodes);
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this.element,
            expander: BI.extend({
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            }, o.expander),

            items: this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0),

            el: BI.extend({
                type: "bi.button_tree",
                chooseType: 0,
                layouts: [{
                    type: "bi.vertical"
                }]
            }, o.el)
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.LevelTree.EVENT_CHANGE, arguments);
            }
        })
    },

    //生成树方法
    stroke: function (nodes) {
        this.tree.stroke.apply(this.tree, arguments);
    },

    populate: function (items) {
        items = this._formatItems(BI.Tree.transformToTreeFormat(items), 0);
        this.tree.populate(items);
    },

    doBehavior: function () {
        this.tree.doBehavior.apply(this.tree, arguments);
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        return this.tree.getValue();
    },

    getAllLeaves: function () {
        return this.tree.getAllLeaves();
    },

    getNodeById: function (id) {
        return this.tree.getNodeById(id);
    },

    getNodeByValue: function (id) {
        return this.tree.getNodeByValue(id);
    }
});
BI.LevelTree.EVENT_CHANGE = "EVENT_CHANGE";

$.shortcut("bi.level_tree", BI.LevelTree);