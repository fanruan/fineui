/**
 * 十字型的树节点
 * @class BI.MidTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.MidTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.MidTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: BI.STYLE_CONSTANTS.LINK_LINE_TYPE === "solid" ? "tree-solid-collapse-icon-type3" : "tree-collapse-icon-type3",
            iconWidth: 24,
            iconHeight: 24
        });
    },

    getLineCls: function () {
        switch (BI.STYLE_CONSTANTS.LINK_LINE_TYPE) {
            case "solid":
                return "tree-solid-expand-icon-type3";
            default:
                return "tree-expand-icon-type3";
        }
    },

    setSelected: function (v) {
        BI.MidTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v === true) {
            this.element.addClass(this.getLineCls());
        } else {
            this.element.removeClass(this.getLineCls());
        }
    }
});
BI.shortcut("bi.mid_tree_node_checkbox", BI.MidTreeNodeCheckbox);