BI.RootTreeLeafItem = BI.inherit(BI.BasicButton, {
    props: {
        baseCls: "bi-root-tree-leaf-item bi-list-item-active",
        logic: {
            dynamic: false
        },
        id: "",
        pId: "",
        layer: 0,
        height: 24
    },

    render: function () {
        var self = this;
        var o = this.options;
        var text = {
            type: "bi.label",
            ref: function (_ref) {
                self.text = _ref;
            },
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        };

        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            el: {
                type: "bi.layout",
                width: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
                height: o.height
            }
        }, {
            el: text
        });

        return BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }));
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

BI.shortcut("bi.root_tree_leaf_item", BI.RootTreeLeafItem);
