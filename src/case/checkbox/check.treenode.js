/**
 * 十字型的树节点
 * @class BI.TreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.TreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        return BI.extend( BI.TreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type1",
            iconWidth: 25,
            iconHeight: 25
        });
    },
    _init:function() {
        BI.TreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.TreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.addClass("tree-expand-icon-type1");
        } else {
            this.element.removeClass("tree-expand-icon-type1");
        }
    }
});
$.shortcut("bi.tree_node_checkbox", BI.TreeNodeCheckbox);