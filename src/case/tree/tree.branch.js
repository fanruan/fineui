/**
 * @class BI.BranchTree
 * @extends BI.Widget
 * create by young
 * 横向分支的树
 */
BI.BranchTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.BranchTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-branch-tree",
            expander: {},
            el: {},
            items: []
        })
    },
    _init: function () {
        BI.BranchTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.branchTree = BI.createWidget({
            type: "bi.custom_tree",
            element: this.element,
            expander: BI.extend({
                type: "bi.branch_expander",
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            }, o.expander),
            el: BI.extend({
                type: "bi.button_tree",
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical"
                }]
            }, o.el),
            items: this.options.items
        });
        this.branchTree.on(BI.CustomTree.EVENT_CHANGE, function(){
            self.fireEvent(BI.BranchTree.EVENT_CHANGE, arguments);
        });
        this.branchTree.on(BI.Controller.EVENT_CHANGE, function(){
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    populate: function () {
        this.branchTree.populate.apply(this.branchTree, arguments);
    },

    getValue: function () {
        return this.branchTree.getValue();
    }
});
BI.BranchTree.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.branch_tree", BI.BranchTree);