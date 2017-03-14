/**
 * 十字型的树节点
 * @class BI.MidTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.MidTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        return BI.extend( BI.MidTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type3",
            iconWidth: 25,
            iconHeight: 25
        });
    },
    _init:function() {
        BI.MidTreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.MidTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v===true) {
            this.element.addClass("tree-expand-icon-type3");
        } else {
            this.element.removeClass("tree-expand-icon-type3");
        }
    }
});
$.shortcut("bi.mid_tree_node_checkbox", BI.MidTreeNodeCheckbox);