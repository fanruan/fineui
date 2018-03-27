/**
 * 过滤
 *
 * Created by GUY on 2015/11/20.
 * @class BI.Filter
 * @extend BI.Widget
 */
BI.Filter = BI.inherit(BI.Widget, {

    constants: {
        FIELD_TYPE_NUMBER: 1,
        FIELD_TYPE_STRING: 0,
        FIELD_TYPE_DATE: 2
    },

    props: {
        baseCls: "bi-filter",
        expander: {},
        items: [],
        el: {},
        itemCreator: BI.empty
    },

    render: function () {
        var self = this, o = this.options;
        return BI.extend({
            type: "bi.filter_operation",
            expander: o.expander,
            listeners: [{
                eventName: "EVENT_OPERATION",
                action: function (type) {
                    switch (type) {
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND:
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_CONDITION);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR:
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_CONDITION, 1);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND:
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_FORMULA);
                            break;
                        case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR:
                            self._addAndOrCondition(BI.Filter.FILTER_TYPE.EMPTY_FORMULA, 1);
                            break;
                    }
                }
            }, {
                eventName: "BI.FilterOperation.EVENT_DESTROY_ITEM",
                action: function (id) {
                    self._removeCondition(id);
                }
            }],
            ref: function (_ref) {
                self.filter = _ref;
            }
        }, o.el);
    },

    mounted: function () {
        this.tree = new BI.Tree();
        this.tree.initTree(this.options.items);
        this._populate(this.tree.toJSONWithNode());
    },

    _createEmptyNode: function (type) {
        var node = new BI.Node(BI.UUID());
        node.set("data", {
            value: type
        });
        return node;
    },

    _insertAndOrCondition: function (id, formulaOrField, type) {
        var ANDOR = ["AND", "OR"];
        type || (type = 0);
        var finded = this.tree.search(id);
        if (BI.isNotNull(finded)) {
            var data = finded.get("data");
            var parent = finded.getParent();
            var index = parent.getChildIndex(finded.id);
            var pdata = parent.get("data") || {};
            var node = this._createEmptyNode(formulaOrField);
            if (data.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                this.tree.addNode(finded, node);
                return;
            }
            if (data.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]]) {
                if (pdata.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                    parent.addChild(node, index + 1);
                    return;
                }
            }
            if ((data.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]] && pdata.value !== BI.Filter.FILTER_TYPE[ANDOR[type]])
                || pdata.value === BI.Filter.FILTER_TYPE[ANDOR[1 - type]]
                || (pdata.value !== BI.Filter.FILTER_TYPE.AND && pdata.value !== BI.Filter.FILTER_TYPE.OR)) {
                var andor = new BI.Node(BI.UUID());
                andor.set("data", {
                    value: BI.Filter.FILTER_TYPE[ANDOR[type]],
                    children: [finded.get("data"), node.get("data")]
                });
                parent.removeChildByIndex(index);
                parent.addChild(andor, index);
                andor.addChild(finded);
                andor.addChild(node);
                return;
            }
            parent.addChild(node, index + 1);
        }
    },

    _removeCondition: function (id) {
        var finded = this.tree.search(id);
        if (BI.isNotNull(finded)) {
            var parent = finded.getParent();
            parent.removeChild(id);
            if (parent.getChildrenLength() <= 1) {
                var prev = parent.getParent();
                if (BI.isNotNull(prev)) {
                    var index = prev.getChildIndex(parent.id);
                    prev.removeChildByIndex(index);
                    if (parent.getChildrenLength() === 1) {
                        prev.addChild(parent.getFirstChild(), index);
                    }
                }
            }
            this._populate(this.tree.toJSONWithNode());
            this.fireEvent("EVENT_CHANGE");
        }
    },

    _addAndOrCondition: function (formulaOrField, type) {
        var ANDOR = ["AND", "OR"];
        type || (type = 0);
        var currentSelectItem = this.filter.getCurrentSelectItem();
        if (BI.isNotNull(currentSelectItem)) {
            var id = currentSelectItem.attr("id");
            this._insertAndOrCondition(id, formulaOrField, type);
        } else {
            var node = this._createEmptyNode(formulaOrField);
            var root = this.tree.getRoot();
            var child = root.getLastChild();
            if (BI.isNotNull(child)) {
                var data = child.get("data");
                if (data.value === BI.Filter.FILTER_TYPE[ANDOR[type]]) {
                    this.tree.addNode(child, node);
                } else {
                    var andor = new BI.Node(BI.UUID());
                    andor.set("data", {
                        value: BI.Filter.FILTER_TYPE[ANDOR[type]],
                        children: [child.get("data"), node.get("data")]
                    });
                    root.removeChild(child.id);
                    this.tree.addNode(andor);
                    this.tree.addNode(andor, child);
                    this.tree.addNode(andor, node);
                }
            } else {
                this.tree.addNode(node);
            }
        }
        this._populate(this.tree.toJSONWithNode());
        this.fireEvent("EVENT_CHANGE");
    },

    _populate: function (items) {
        this.filter.defaultState();
        var o = this.options;
        o.items = items;
        BI.Tree.traversal(items, function (i, item) {
            o.itemCreator(item);
        });
        this.filter.populate.apply(this.filter, [items]);
    },

    populate: function (conditions) {
        this.tree.initTree(conditions);
        this._populate(this.tree.toJSONWithNode());
    },

    getValue: function () {
        return this.filter.getValue();
    }
});

BI.shortcut("bi.filter", BI.Filter);

BI.Filter.FILTER_TYPE = {};
BI.Filter.FILTER_TYPE.FORMULA = 33;
BI.Filter.FILTER_TYPE.AND = 34;
BI.Filter.FILTER_TYPE.OR = 35;
BI.Filter.FILTER_TYPE.EMPTY_FORMULA = 36;
BI.Filter.FILTER_TYPE.EMPTY_CONDITION = 37;
