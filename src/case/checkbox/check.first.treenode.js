/**
 * 十字型的树节点
 * @class BI.FirstTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.FirstTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        return BI.extend( BI.FirstTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type2",
            iconWidth: 25,
            iconHeight: 25
        });
    },
    _init:function() {
        BI.FirstTreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.FirstTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v===true) {
            this.element.addClass("tree-expand-icon-type2");
        } else {
            this.element.removeClass("tree-expand-icon-type2");
        }
    }
});
$.shortcut("bi.first_tree_node_checkbox", BI.FirstTreeNodeCheckbox);