BI.LastTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.LastTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-last-tree-leaf-item bi-list-item-active",
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
        BI.LastTreeLeafItem.superclass._init.apply(this, arguments);
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
            width: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT / 2,
            el: {
                type: "bi.layout",
                cls: (o.pNode && o.pNode.isLastNode) ? "" : this._getBaseLineCls(),
                width: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT / 2,
                height: o.height
            }
        }), {
            width: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            el: {
                type: "bi.layout",
                cls: this._getLastLineCls(),
                width: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
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

    _getBaseLineCls: function () {
        switch (BI.STYLE_CONSTANTS.LINK_LINE_TYPE) {
            case "solid":
                return "base-solid-line-conn-background";
            default:
                return "base-line-conn-background";
        }
    },

    _getLastLineCls: function () {
        switch (BI.STYLE_CONSTANTS.LINK_LINE_TYPE) {
            case "solid":
                return "last-solid-line-conn-background";
            default:
                return "last-line-conn-background";
        }
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

BI.shortcut("bi.last_tree_leaf_item", BI.LastTreeLeafItem);