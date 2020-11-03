/**
 * guy
 * 二级树
 * @class BI.MultiLayerSingleLevelTree
 * @extends BI.Single
 */
BI.MultiLayerSingleLevelTree = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleLevelTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-single-level-tree",
            isDefaultInit: false,
            items: [],
            itemsCreator: BI.emptyFn,
            keywordGetter: BI.emptyFn,
            chooseType: BI.Selection.Single,
            scrollable: true
        });
    },

    _init: function () {
        var o = this.options;
        BI.MultiLayerSingleLevelTree.superclass._init.apply(this, arguments);

        this.storeValue = o.value;

        this.initTree(this.options.items);

        this.check();
    },

    _formatItems: function (nodes, layer, pNode) {
        var self = this, o = this.options;
        var keyword = o.keywordGetter();
        BI.each(nodes, function (i, node) {
            var extend = {
                isFirstNode: i === 0,
                isLastNode: i === nodes.length - 1
            };
            node.layer = layer;
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
            node.keyword = node.keyword || keyword;
            extend.pNode = pNode;
            if (node.isParent === true || node.parent === true || BI.isNotEmptyArray(node.children)) {
                // extend.type = "bi.multilayer_single_tree_mid_plus_group_node";
                // if (i === nodes.length - 1) {
                //     extend.type = "bi.multilayer_single_tree_last_plus_group_node";
                //     extend.isLastNode = true;
                // }
                // if (i === 0 && !pNode) {
                //     extend.type = "bi.multilayer_single_tree_first_plus_group_node";
                // }
                // if (i === 0 && i === nodes.length - 1 && !pNode) {  // 根
                //     extend.type = "bi.multilayer_single_tree_plus_group_node";
                // }

                if (layer === 0 && extend.isFirstNode && extend.isLastNode) {
                    extend.type = "bi.multilayer_single_tree_plus_group_node";
                } else if (layer === 0 && extend.isFirstNode) {
                    extend.type = "bi.multilayer_single_tree_first_plus_group_node";
                } else if (extend.isLastNode) {
                    extend.type = "bi.multilayer_single_tree_last_plus_group_node";
                } else {
                    extend.type = "bi.multilayer_single_tree_mid_plus_group_node";
                }

                BI.defaults(node, extend);
                self._formatItems(node.children, layer + 1, node);
            } else {
                // extend.type = "bi.multilayer_single_tree_mid_tree_leaf_item";
                // if (i === 0 && !pNode) {
                //     extend.type = "bi.multilayer_single_tree_first_tree_leaf_item";
                // }
                // if (i === nodes.length - 1) {
                //     extend.type = "bi.multilayer_single_tree_last_tree_leaf_item";
                // }

                if (layer === 0 && extend.isFirstNode && extend.isLastNode) {
                    extend.type = ""; // todo 缺一个根节点的item
                } else if (layer === 0 && extend.isFirstNode) {
                    extend.type = "bi.multilayer_single_tree_first_tree_leaf_item";
                } else if (extend.isLastNode) {
                    extend.type = "bi.multilayer_single_tree_last_tree_leaf_item";
                } else {
                    extend.type = "bi.multilayer_single_tree_mid_tree_leaf_item";
                }

                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _assertId: function (sNodes) {
        BI.each(sNodes, function (i, node) {
            node.id = node.id || BI.UUID();
        });
    },

    // 构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        var hasNext = false;
        this.empty();
        this._assertId(nodes);
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            cls: "tree-view display-table",
            expander: {
                type: "bi.tree_expander",
                isDefaultInit: o.isDefaultInit,
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            items: this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0),
            value: o.value,
            itemsCreator: function (op, callback) {
                (op.times === 1 && !op.node) && BI.nextTick(function () {
                    self.loading();
                });
                o.itemsCreator(op, function (ob) {
                    hasNext = ob.hasNext;
                    (op.times === 1 && !op.node) && self._populate(ob.items);
                    callback(self._formatItems(BI.Tree.transformToTreeFormat(ob.items), op.node ? op.node.layer + 1 : 0, op.node));
                    self.setValue(self.storeValue);
                    (op.times === 1 && !op.node) && BI.nextTick(function () {
                        self.loaded();
                    });
                });
            },

            el: {
                type: "bi.loader",
                isDefaultInit: o.itemsCreator !== BI.emptyFn,
                el: {
                    type: "bi.button_tree",
                    chooseType: o.chooseType === BI.Selection.None ? BI.Selection.None : BI.Selection.Default, // 不使用buttontree内部getValue逻辑
                    behaviors: o.behaviors,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                hasNext: function () {
                    return hasNext;
                }
            }
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type, v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.setValue(v);
                self.fireEvent(BI.MultiLayerSingleLevelTree.EVENT_CHANGE, v);
            }
        });

        BI.createWidget({
            type: "bi.adaptive",
            element: this,
            scrollable: o.scrollable,
            items: [this.tree]
        });
    },

    _populate: function () {
        BI.MultiLayerSelectLevelTree.superclass.populate.apply(this, arguments);
    },

    populate: function (nodes) {
        this._populate(nodes);
        BI.isNull(nodes) ? this.tree.populate() : this.tree.populate(this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0));
    },

    setValue: function (v) {
        // getValue依赖于storeValue, 那么不选的时候就不要更新storeValue了
        if (this.options.chooseType === BI.Selection.None) {
        } else {
            this.storeValue = v;
            this.tree.setValue(v);
        }
    },

    getValue: function () {
        return BI.isArray(this.storeValue) ?
            this.storeValue : BI.isNull(this.storeValue) ?
                [] : [this.storeValue];
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
BI.MultiLayerSingleLevelTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.multilayer_single_level_tree", BI.MultiLayerSingleLevelTree);
