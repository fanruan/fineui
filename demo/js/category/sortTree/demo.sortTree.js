Demo.Expander = BI.inherit(BI.Widget, {
    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.expander",
            ref: function () {
                self.expander = this;
            },
            el: o.el,
            popup: o.popup
        };
    },

    update: function (opt) {
        this.expander.populate(opt.items);
        return true;
    }
});
BI.shortcut("demo.sort_tree_expander", Demo.Expander);

/**
 * guy
 * 二级树
 * @class Demo.SortTree
 * @extends BI.Widget
 */
Demo.SortTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this, o = this.options;
        var tree = new BI.Tree();
        tree.initTree(BI.Tree.transformToTreeFormat(Demo.CONSTANTS.TREEITEMS));
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: {
                type: "demo.sort_tree_expander"
            },

            items: this._formatItems(0, tree.toJSON()),

            el: {
                type: "bi.virtual_group",
                layouts: [{
                    type: "bi.vertical",
                    scrolly: false
                }]
            }
        });

        this.tree.element.sortable({
            items: ".sort-item",
            placeholder: {
                element: function ($currentItem) {
                    var holder = BI.createWidget({
                        type: "bi.layout",
                        cls: "bi-sortable-holder",
                        height: $currentItem.outerHeight()
                    });
                    holder.element.css({
                        "margin-left": $currentItem.css("margin-left"),
                        "margin-right": $currentItem.css("margin-right"),
                        "margin-top": $currentItem.css("margin-top"),
                        "margin-bottom": $currentItem.css("margin-bottom"),
                        margin: $currentItem.css("margin")
                    });
                    return holder.element;
                },
                update: function () {

                }
            },
            update: function (event, ui) {
                var node = ui.item.data("node");
                var findTheNode = tree.search(node.id);
                // 这里简单处理下找到它的父节点
                var currentIndex = 0, parentNode;
                if (ui.item.next().length > 0) {
                    var n = ui.item.next().data("node");
                    var nextId = n.id;
                    var nextNode = tree.search(nextId);
                    parentNode = nextNode.getParent();
                    var nextIndex = parentNode.getChildIndex(nextId);
                    currentIndex = nextIndex > 0 && (nextIndex - 1);

                } else if (ui.item.prev().length > 0) {
                    var n = ui.item.prev().data("node");
                    var prevId = n.id;
                    var prevNode = tree.search(prevId);
                    parentNode = prevNode.getParent();
                    var prevIndex = parentNode.getChildIndex(prevId);
                    currentIndex = prevIndex + 1;
                }
                findTheNode.getParent().removeChild(node.id);
                parentNode.addChild(findTheNode, currentIndex);
                console.log(tree.toJSON());
                self.tree.populate(self._formatItems(0, tree.toJSON()));
            },
            start: function (event, ui) {

            },
            stop: function (event, ui) {
            },
            over: function (event, ui) {

            }
        });
    },

    _formatItems: function (layer, nodes) {
        var self = this;
        BI.each(nodes, function (i, node) {
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                BI.defaults(node, {
                    type: "bi.multilayer_icon_arrow_node",
                    height: 30,
                    layer: layer
                });
                self._formatItems(layer + 1, node.children);
            } else {
                BI.defaults(node, {
                    type: "bi.multilayer_icon_tree_leaf_item",
                    cls: "sort-item",
                    height: 30,
                    key: node.id,
                    layer: layer,
                    data: {
                        node: node
                    }
                });
            }
        });
        return nodes;
    }
});
BI.shortcut("demo.sort_tree", Demo.SortTree);