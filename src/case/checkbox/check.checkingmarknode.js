/**
 * 十字型的树节点
 * @class BI.CheckingMarkNode
 * @extends BI.IconButton
 */
BI.CheckingMarkNode = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        return BI.extend( BI.CheckingMarkNode.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "check-mark-font",
            iconWidth: 13,
            iconHeight: 13
        });
    },
    _init:function() {
        BI.CheckingMarkNode.superclass._init.apply(this, arguments);
        this.setSelected(this.options.selected);

    },
    setSelected: function(v){
        BI.CheckingMarkNode.superclass.setSelected.apply(this, arguments);
        if(v===true) {
            this.element.addClass("check-mark-font");
        } else {
            this.element.removeClass("check-mark-font");
        }
    }
});
$.shortcut("bi.checking_mark_node", BI.CheckingMarkNode);