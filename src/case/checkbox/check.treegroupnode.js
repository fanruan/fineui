/**
 * 三角形的树节点
 * Created by GUY on 2015/9/6.
 * @class BI.TreeGroupNodeCheckbox
 * @extends BI.IconButton
 */
BI.TreeGroupNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        return BI.extend( BI.TreeGroupNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-node-triangle-collapse-font",
            iconWidth: 13,
            iconHeight: 13
        });
    },
    _init:function() {
        BI.TreeGroupNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.TreeGroupNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.removeClass("tree-node-triangle-collapse-font").addClass("tree-node-triangle-expand-font");
        } else {
            this.element.removeClass("tree-node-triangle-expand-font").addClass("tree-node-triangle-collapse-font");
        }
    }
});
$.shortcut("bi.tree_group_node_checkbox", BI.TreeGroupNodeCheckbox);