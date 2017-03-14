BI.IconTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.IconTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-icon-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            height: 25,
            iconWidth: 16,
            iconHeight: 16,
            iconCls: ""
        })
    },

    _init: function () {
        BI.IconTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var icon = BI.createWidget({
            type: "bi.center_adapt",
            width: 23,
            cls: o.iconCls,
            items: [{
                type: "bi.icon",
                width: o.iconWidth,
                height: o.iconHeight
            }]
        });

        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 23,
            el: icon
        }, {
            el: this.text
        });
        BI.createWidget(BI.extend({
            element: this.element
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
    },

    doClick: function () {
        BI.IconTreeLeafItem.superclass.doClick.apply(this, arguments);
    },

    setSelected: function (v) {
        BI.IconTreeLeafItem.superclass.setSelected.apply(this, arguments);
    }
});

$.shortcut("bi.icon_tree_leaf_item", BI.IconTreeLeafItem);