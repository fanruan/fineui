/**
 * Created by roy on 15/10/16.
 * 上箭头与下箭头切换的树节点
 */
BI.ArrowTreeGroupNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend(BI.ArrowTreeGroupNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-arrow-tree-group-node"
        });
    },
    _init: function () {
        BI.ArrowTreeGroupNodeCheckbox.superclass._init.apply(this, arguments);
    },
    setSelected: function (v) {
        BI.ArrowTreeGroupNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.removeClass("pull-right-font").addClass("pull-down-font");
        } else {
            this.element.removeClass("pull-down-font").addClass("pull-right-font");
        }
    }
});
BI.shortcut("bi.arrow_tree_group_node_checkbox", BI.ArrowTreeGroupNodeCheckbox);