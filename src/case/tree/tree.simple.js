/**
 * 简单的多选树
 *
 * Created by GUY on 2016/2/16.
 * @class BI.SimpleTreeView
 * @extends BI.Widget
 */
BI.SimpleTreeView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleTreeView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-simple-tree",
            itemsCreator: BI.emptyFn,
            items: null
        })
    },
    _init: function () {
        BI.SimpleTreeView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.structure = new BI.Tree();
        this.tree = BI.createWidget({
            type: "bi.tree",
            element: this.element,
            itemsCreator: function (op, callback) {
                var fn = function (items) {
                    callback({
                        items: items
                    });
                    self.structure.initTree(BI.Tree.transformToTreeFormat(items));
                };
                if (BI.isNotNull(o.items)) {
                    fn(o.items);
                } else {
                    o.itemsCreator(op, fn);
                }
            }
        });
        this.tree.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleTreeView.EVENT_CHANGE, arguments);
        });
        if (BI.isNotEmptyArray(o.items)) {
            this.populate();
        }
    },

    populate: function (items, keyword) {
        if (items) {
            this.options.items = items;
        }
        this.tree.stroke({
            keyword: keyword
        });
    },

    setValue: function (v) {
        v || (v = []);
        var self = this, map = {};
        var selected = [];
        BI.each(v, function (i, val) {
            var node = self.structure.search(val, "value");
            if (node) {
                var p = node;
                p = p.getParent();
                if (p) {
                    if (!map[p.value]) {
                        map[p.value] = 0;
                    }
                    map[p.value]++;
                }

                while (p && p.getChildrenLength() <= map[p.value]) {
                    selected.push(p.value);
                    p = p.getParent();
                    if (p) {
                        if (!map[p.value]) {
                            map[p.value] = 0;
                        }
                        map[p.value]++;
                    }
                }
            }
        });

        this.tree.setValue(BI.makeObject(v.concat(selected)));
    },

    _getValue: function () {
        var self = this, result = [], val = this.tree.getValue();
        var track = function (nodes) {
            BI.each(nodes, function (key, node) {
                if (BI.isEmpty(node)) {
                    result.push(key);
                } else {
                    track(node);
                }
            })
        };
        track(val);
        return result;
    },

    empty: function () {
        this.tree.empty();
    },

    getValue: function () {
        var self = this, result = [], val = this._getValue();
        BI.each(val, function (i, key) {
            var target = self.structure.search(key, "value");
            if (target) {
                self.structure._traverse(target, function (node) {
                    if (node.isLeaf()) {
                        result.push(node.value);
                    }
                })
            }
        });
        return result;
    }
});
BI.SimpleTreeView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.simple_tree", BI.SimpleTreeView);
