/**
 * Created by roy on 15/10/16.
 * 右与下箭头切换的树节点
 */
BI.ArrowTreeGroupNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend(BI.ArrowTreeGroupNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-arrow-group-node-checkbox expander-right-font"
        });
    },

    setSelected: function (v) {
        BI.ArrowTreeGroupNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.removeClass("expander-right-font").addClass("expander-down-font");
        } else {
            this.element.removeClass("expander-down-font").addClass("expander-right-font");
        }
    }
});
BI.shortcut("bi.arrow_group_node_checkbox", BI.ArrowTreeGroupNodeCheckbox);
