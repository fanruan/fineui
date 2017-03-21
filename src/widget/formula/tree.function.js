/**
 * Created by roy on 15/9/14.
 */
BI.FunctionTree = BI.inherit(BI.Widget, {
    _const: {
        leafGap: 10,
        nodeTypes: [BICst.FUNCTION.MATH, BICst.FUNCTION.ARRAY, BICst.FUNCTION.DATE, BICst.FUNCTION.LOGIC, BICst.FUNCTION.OTHER, BICst.FUNCTION.TEXT]
    },
    _defaultConfig: function () {
        return BI.extend(BI.FunctionTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-function-tree",
            chooseType: 0,
            items: [],
            redmark: BI.emptyFn
        });
    },

    _init: function () {
        BI.FunctionTree.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getFieldNum: function (map, fieldtype) {
        if (BI.isNotNull(map[fieldtype])) {
            return map[fieldtype].length
        } else {
            return 0
        }
    },

    populate: function (items) {
        var o = this.options, c = this._const, self = this;
        this.empty();
        var map = {};
        o.items = items;
        BI.each(items, function (i, item) {
            if (!map[item.fieldType]) {
                map[item.fieldType] = [];
            }
            map[item.fieldType].push(item);
        });
        this.nodes = [
            {
                id: BICst.FUNCTION.MATH,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Numberic_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.MATH) + ")",
                value: BICst.FUNCTION.MATH,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.TEXT,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Text_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.TEXT) + ")",
                value: BICst.FUNCTION.TEXT,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.DATE,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Time_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.DATE) + ")",
                value: BICst.FUNCTION.DATE,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.ARRAY,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Array_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.ARRAY) + ")",
                value: BICst.FUNCTION.ARRAY,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.LOGIC,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Logic_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.LOGIC) + ")",
                value: BICst.FUNCTION.LOGIC,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.OTHER,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Other_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.OTHER) + ")",
                value: BICst.FUNCTION.OTHER,
                isParent: true,
                open: false
            }
        ];
        BI.each(items, function (i, item) {
            self.nodes.push(BI.extend({
                id: BI.UUID(),
                pId: item.fieldType
            }, item, {
                type: "bi.button_text_tree_leaf_item",
                textAlign: "left",
                lgap: c.leafGap
            }))
        });
        this.fieldtree = BI.createWidget({
            type: "bi.level_tree",
            element: this,
            items: self.nodes,
            el: {
                behaviors: {
                    "redmark": o.redmark
                }
            }
        });

        this.fieldtree.on(BI.Controller.EVENT_CHANGE, function (type, value) {
            if (type === BI.Events.ADD) {
                self.fireEvent(BI.FunctionTree.FUNCTION_INSERT, value);
            }
        });
        this.fieldtree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.FunctionTree.EVENT_CHANGE, self.getValue());
            self.fireEvent(BI.FunctionTree.EVENT_DESCRIPTION_CHANGE, self._getDescription(self.getValue(), o.items))
            self.fieldtree.setValue(self.getValue());
        })
    },

    getValue: function () {
        return this.fieldtree.getValue();
    },

    setValue: function (v) {
        this.fieldtree.setValue(v);
    },

    doBehavior: function () {
        this.fieldtree.doBehavior.apply(this.fieldtree, arguments)
    },

    getNodeByValue: function (v) {
        return this.fieldtree.getNodeByValue(v)
    },

    setTriggerExpand: function (v) {
        var node = this.fieldtree.getNodeById(v);
        node.showView();
    },

    setTriggerCollapse: function (v) {
        var node = this.fieldtree.getNodeById(v);
        node.hideView();
    },

    expandAll: function () {
        var self = this;
        BI.each(self._const.nodeTypes, function (i, id) {
            self.setTriggerExpand(id);
        })
    },

    _getDescription: function (v, items) {
        var description = "";
        BI.each(items, function (i, item) {
            if (item.value === v[0]) {
                description = item.description;
            }
        });
        return description
    },

    getAllLeaves: function () {
        return this.fieldtree.getAllLeaves()
    }
});
BI.FunctionTree.EVENT_CHANGE = "EVENT_CHANGE";
BI.FunctionTree.EVENT_DESCRIPTION_CHANGE = "EVENT_DESCRIPTION_CHANGE";
BI.FunctionTree.FUNCTION_INSERT = "FUNCTION_INSERT";
$.shortcut("bi.function_tree", BI.FunctionTree);