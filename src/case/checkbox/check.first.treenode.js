/**
 * 十字型的树节点
 * @class BI.FirstTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.FirstTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.FirstTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: BI.STYLE_CONSTANTS.LINK_LINE_TYPE === "solid" ? "tree-solid-collapse-icon-type2" : "tree-collapse-icon-type2",
            iconWidth: 24,
            iconHeight: 24
        });
    },

    getLineCls: function () {
        switch (BI.STYLE_CONSTANTS.LINK_LINE_TYPE) {
            case "solid":
                return "tree-solid-expand-icon-type2";
            default:
                return "tree-expand-icon-type2";
        }
    },

    setSelected: function (v) {
        BI.FirstTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v === true) {
            this.element.addClass(this.getLineCls());
        } else {
            this.element.removeClass(this.getLineCls());
        }
    }
});
BI.shortcut("bi.first_tree_node_checkbox", BI.FirstTreeNodeCheckbox);