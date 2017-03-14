/**
 * Created by roy on 15/10/16.
 * 上箭头与下箭头切换的树节点
 */
BI.ArrowTreeGroupNodeCheckbox=BI.inherit(BI.IconButton,{
    _defaultConfig:function(){
        return BI.extend(BI.ArrowTreeGroupNodeCheckbox.superclass._defaultConfig.apply(this,arguments),{
            extraCls:"bi-arrow-tree-group-node",
            iconWidth: 13,
            iconHeight: 13
        });
    },
    _init:function(){
        BI.ArrowTreeGroupNodeCheckbox.superclass._init.apply(this,arguments);
    },
    setSelected: function(v){
        BI.ArrowTreeGroupNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.removeClass("column-next-page-h-font").addClass("column-pre-page-h-font");
        } else {
            this.element.removeClass("column-pre-page-h-font").addClass("column-next-page-h-font");
        }
    }
});
$.shortcut("bi.arrow_tree_group_node_checkbox",BI.ArrowTreeGroupNodeCheckbox);