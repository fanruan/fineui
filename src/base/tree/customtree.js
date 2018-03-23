/**
 *
 * 自定义树
 *
 * Created by GUY on 2015/9/7.
 * @class BI.CustomTree
 * @extends BI.Single
 */
BI.CustomTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CustomTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-custom-tree",
            expander: {
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            items: [],
            itemsCreator: BI.emptyFn,

            el: {
                type: "bi.button_tree",
                chooseType: 0,
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
    },

    _init: function () {
        BI.CustomTree.superclass._init.apply(this, arguments);
        this.initTree(this.options.items);
    },

    _formatItems: function (nodes) {
        var self = this, o = this.options;
        nodes = BI.Tree.transformToTreeFormat(nodes);

        var items = [];
        BI.each(nodes, function (i, node) {
            if (BI.isNotEmptyArray(node.children) || node.isParent === true) {
                var item = BI.extend({
                    type: "bi.expander",
                    el: {
                        value: node.value
                    },
                    popup: {type: "bi.custom_tree"}
                }, BI.deepClone(o.expander), {
                    id: node.id,
                    pId: node.pId
                });
                var el = BI.stripEL(node);
                if (!BI.isWidget(el)) {
                    el = BI.clone(el);
                    delete el.children;
                    BI.extend(item.el, el);
                } else {
                    item.el = el;
                }
                item.popup.expander = BI.deepClone(o.expander);
                item.items = item.popup.items = node.children;
                item.itemsCreator = item.popup.itemsCreator = function (op) {
                    if (BI.isNotNull(op.node)) {// 从子节点传过来的itemsCreator直接向上传递
                        return o.itemsCreator.apply(self, arguments);
                    }
                    var args = Array.prototype.slice.call(arguments, 0);
                    args[0].node = node;
                    return o.itemsCreator.apply(self, args);
                };
                BI.isNull(item.popup.el) && (item.popup.el = BI.deepClone(o.el));
                items.push(item);
            } else {
                items.push(node);
            }
        });
        return items;
    },

    // 构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        this.tree = BI.createWidget(o.el, {
            element: this,
            items: this._formatItems(nodes),
            itemsCreator: function (op, callback) {
                o.itemsCreator.apply(this, [op, function (items) {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args[0] = self._formatItems(items);
                    callback.apply(null, args);
                }]);
            },
            value: o.value
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.CustomTree.EVENT_CHANGE, val, obj);
            }
        });
    },

    // 生成树方法
    stroke: function (nodes) {
        this.populate.apply(this, arguments);
    },

    populate: function (nodes) {
        var args = Array.prototype.slice.call(arguments, 0);
        if (arguments.length > 0) {
            args[0] = this._formatItems(nodes);
        }
        this.tree.populate.apply(this.tree, args);
    },

    setValue: function (v) {
        this.tree && this.tree.setValue(v);
    },

    getValue: function () {
        return this.tree ? this.tree.getValue() : [];
    },

    getAllButtons: function () {
        return this.tree ? this.tree.getAllButtons() : [];
    },

    getAllLeaves: function () {
        return this.tree ? this.tree.getAllLeaves() : [];
    },

    getNodeById: function (id) {
        return this.tree && this.tree.getNodeById(id);
    },

    getNodeByValue: function (id) {
        return this.tree && this.tree.getNodeByValue(id);
    },

    empty: function () {
        this.tree.empty();
    }
});
BI.CustomTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.custom_tree", BI.CustomTree);