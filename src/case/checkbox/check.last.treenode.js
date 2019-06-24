/**
 * 十字型的树节点
 * @class BI.LastTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.LastTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend(BI.LastTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type4",
            iconWidth: 24,
            iconHeight: 24
        });
    },

    setSelected: function (v) {
        BI.LastTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if (v === true) {
            this.element.addClass("tree-expand-icon-type4");
        } else {
            this.element.removeClass("tree-expand-icon-type4");
        }
    }
});
BI.shortcut("bi.last_tree_node_checkbox", BI.LastTreeNodeCheckbox);