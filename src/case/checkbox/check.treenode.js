/**
 * 十字型的树节点
 * @class BI.TreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.TreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.TreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: BI.STYLE_CONSTANTS.LINK_LINE_TYPE === "solid" ? "tree-solid-collapse-icon-type1" : "tree-collapse-icon-type1",
            iconWidth: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            iconHeight: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT
        });
    },

    getLineCls: function () {
        switch (BI.STYLE_CONSTANTS.LINK_LINE_TYPE) {
            case "solid":
                return "tree-solid-expand-icon-type1";
            default:
                return "tree-expand-icon-type1";
        }
    },

    setSelected: function (v) {
        BI.TreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.addClass(this.getLineCls());
        } else {
            this.element.removeClass(this.getLineCls());
        }
    }
});
BI.shortcut("bi.tree_node_checkbox", BI.TreeNodeCheckbox);