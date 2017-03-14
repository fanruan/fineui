/**
 * @class BI.HandStandBranchTree
 * @extends BI.Widget
 * create by young
 * 横向分支的树
 */
BI.HandStandBranchTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.HandStandBranchTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-handstand-branch-tree",
            expander: {},
            el: {},
            items: []
        })
    },
    _init: function () {
        BI.HandStandBranchTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.branchTree = BI.createWidget({
            type: "bi.custom_tree",
            element: this.element,
            expander: BI.extend({
                type: "bi.handstand_branch_expander",
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            }, o.expander),
            el: BI.extend({
                type: "bi.button_tree",
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.horizontal_adapt"
                }]
            }, o.el),
            items: this.options.items
        });
        this.branchTree.on(BI.CustomTree.EVENT_CHANGE, function(){
            self.fireEvent(BI.HandStandBranchTree.EVENT_CHANGE, arguments);
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
BI.HandStandBranchTree.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.handstand_branch_tree", BI.HandStandBranchTree);