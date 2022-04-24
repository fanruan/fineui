/**
 * 十字型的树节点
 * @class BI.CheckingMarkNode
 * @extends BI.IconButton
 */
BI.CheckingMarkNode = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.CheckingMarkNode.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    setSelected: function (v) {
        BI.CheckingMarkNode.superclass.setSelected.apply(this, arguments);
        if(v === true) {
            this.element.addClass("check-mark-font");
        } else {
            this.element.removeClass("check-mark-font");
        }
    }
});
BI.shortcut("bi.checking_mark_node", BI.CheckingMarkNode);
