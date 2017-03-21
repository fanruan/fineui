BI.FormulaFieldTree = BI.inherit(BI.Widget, {
    _const: {
        leafGap: 40
    },
    _defaultConfig: function () {
        return BI.extend(BI.FormulaFieldTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-field-tree",
            chooseType: 0,
            items: []
        });
    },

    _init: function () {
        BI.FormulaFieldTree.superclass._init.apply(this, arguments);
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
        BI.each(items, function (i, typeItem) {
            BI.each(typeItem, function (i, item) {
                if (!map[item.fieldType]) {
                    map[item.fieldType] = [];
                }
                map[item.fieldType].push(item);
            })
        });

        var nodes = [{
            id: BICst.COLUMN.NUMBER,
            type: "bi.triangle_group_node",
            text: BI.i18nText("BI-Formula_Numberic_Field") + "(" + self._getFieldNum(map,BICst.COLUMN.NUMBER) + ")",
            value: BICst.COLUMN.NUMBER,
            isParent: true,
            open: items.length === 1
        }];

        if(items.length > 1){
            nodes.push({
                id: BICst.COLUMN.STRING,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Text_Field") + "(" + self._getFieldNum(map, BICst.COLUMN.STRING) + ")",
                value: BICst.COLUMN.STRING,
                isParent: true,
                open: false
            });
        }

        if(items.length > 2){
            nodes.push({
                id: BICst.COLUMN.DATE,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Time_Field") + "(" + self._getFieldNum(map, BICst.COLUMN.DATE) + ")",
                value: BICst.COLUMN.DATE,
                isParent: true,
                open: false
            });
        }

        BI.each(items, function(idx, typeItems){
            BI.each(typeItems, function (i, item) {
                nodes.push(BI.extend({
                    id: BI.UUID(),
                    pId: item.fieldType
                }, item, {
                    type: "bi.tree_text_leaf_item",
                    cls: "tree-text-leaf-item-draggable",
                    textAlign: "left",
                    lgap: c.leafGap
                }))
            });
        });
        this.fieldtree = BI.createWidget({
            type: "bi.level_tree",
            element: this,
            chooseType: o.chooseType,
            expander: {
                isDefaultInit: true
            },
            items: nodes
        });
        this.fieldtree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.FormulaFieldTree.EVENT_CHANGE);
            self.fieldtree.setValue();
        })
    },

    getValue: function () {
        return this.fieldtree.getValue();
    },

    setValue: function (v) {
        this.fieldtree.setValue(v);
    },
    getAllLeaves: function () {
        return this.fieldtree.getAllLeaves()
    }
});
BI.FormulaFieldTree.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.formula_field_tree", BI.FormulaFieldTree);