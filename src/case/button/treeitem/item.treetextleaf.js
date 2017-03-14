/**
 * 树叶子节点
 * Created by GUY on 2015/9/6.
 * @class BI.TreeTextLeafItem
 * @extends BI.BasicButton
 */
BI.TreeTextLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function() {
        return BI.extend(BI.TreeTextLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-tree-text-leaf-item bi-list-item-active",
            id: "",
            pId: "",
            height: 25,
            hgap: 0,
            lgap: 0,
            rgap: 0
        })
    },
    _init : function() {
        BI.TreeTextLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        BI.createWidget({
            type: "bi.htape",
            element: this.element,
            items: [{
                el: this.text
            }]
        })
    },

    doRedMark: function(){
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function(){
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function(){
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function(){
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function(){
        return this.options.id;
    },

    getPId: function(){
        return this.options.pId;
    }
});

$.shortcut("bi.tree_text_leaf_item", BI.TreeTextLeafItem);