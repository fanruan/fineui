BI.FirstTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.FirstTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-first-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            layer: 0,
            height: 24
        });
    },
    _init: function () {
        BI.FirstTreeLeafItem.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, ((o.layer === 0) ? "" : {
            width: 12,
            el: {
                type: "bi.layout",
                cls: (o.pNode && o.pNode.isLastNode) ? "" : "base-line-conn-background",
                width: 12,
                height: o.height
            }
        }), {
            width: 24,
            el: {
                type: "bi.layout",
                cls: "first-line-conn-background",
                width: 24,
                height: o.height
            }
        }, {
            el: this.text
        });
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    }
});

BI.shortcut("bi.first_tree_leaf_item", BI.FirstTreeLeafItem);