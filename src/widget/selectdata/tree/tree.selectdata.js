/**
 * 字段列表展开Expander
 *
 * Created by GUY on 2015/9/14.
 * @class BI.SelectDataTree
 * @extends BI.Widget
 */
BI.SelectDataTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-tree",
            el: {},
            expander: {},
            items: [],
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: BI.extend({
                type: "bi.select_data_expander",
                el: {},
                popup: {
                    type: "bi.select_data_tree"
                }
            }, o.expander),
            items: o.items,
            itemsCreator: o.itemsCreator,

            el: BI.extend({
                type: "bi.select_data_loader"
            }, o.el)
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.tree.on(BI.CustomTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataTree.EVENT_CHANGE, arguments);
        })
    },


    setEnable: function (v) {
        BI.SelectDataTree.superclass.setEnable.apply(this, arguments);
        this.tree.setEnable(v)
    },

    showView: function(b){
        BI.each(this.tree.getAllButtons(),function(i, button){
            button.showView && button.showView(b);
        })
    },

    hideView: function(b){
        BI.each(this.tree.getAllButtons(),function(i, button){
            button.hideView && button.hideView(b);
        })
    },

    getAllButtons: function(){
        return this.tree.getAllButtons();
    },

    doBehavior: function () {
        this.tree.doBehavior.apply(this.tree, arguments);
    },

    empty: function () {

    },

    populate: function (items) {
        this.tree.populate.apply(this.tree, arguments);
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        //这里需要去重，因为很有可能expander中保存了之前的value值
        return BI.uniq(this.tree.getValue());
    }
});
BI.SelectDataTree.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.select_data_tree", BI.SelectDataTree);