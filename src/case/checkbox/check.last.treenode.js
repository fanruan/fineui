/**
 * 十字型的树节点
 * @class BI.LastTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.LastTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend(BI.LastTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: BI.STYLE_CONSTANTS.LINK_LINE_TYPE === "solid" ? "tree-solid-collapse-icon-type4" : "tree-collapse-icon-type4",
            iconWidth: 24,
            iconHeight: 24
        });
    },

    getLineCls: function () {
        switch (BI.STYLE_CONSTANTS.LINK_LINE_TYPE) {
            case "solid":
                return "tree-solid-expand-icon-type4";
            default:
                return "tree-expand-icon-type4";
        }
    },

    setSelected: function (v) {
        BI.LastTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if (v === true) {
            this.element.addClass(this.getLineCls());
        } else {
            this.element.removeClass(this.getLineCls());
        }
    }
});
BI.shortcut("bi.last_tree_node_checkbox", BI.LastTreeNodeCheckbox);