/**
 * 倒立的Branch
 * @class BI.HandStandBranchExpander
 * @extend BI.Widget
 * create by young
 */
BI.HandStandBranchExpander = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.HandStandBranchExpander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-handstand-branch-expander",
            direction: BI.Direction.Top,
            logic: {
                dynamic: true
            },
            el: {type: "bi.label"},
            popup: {}
        })
    },

    _init: function () {
        BI.HandStandBranchExpander.superclass._init.apply(this, arguments);
        var o = this.options;
        this._initExpander();
        this._initBranchView();
        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, {
                type: "bi.center_adapt",
                items: [this.expander]
            }, this.branchView)
        }))));
    },

    _initExpander: function () {
        var self = this, o = this.options;
        this.expander = BI.createWidget(o.el);
        this.expander.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _initBranchView: function () {
        var self = this, o = this.options;
        this.branchView = BI.createWidget(o.popup, {});
        this.branchView.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    populate: function (items) {
        this.branchView.populate.apply(this.branchView, arguments);
    },

    getValue: function () {
        return this.branchView.getValue();
    }
});
BI.HandStandBranchExpander.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.handstand_branch_expander", BI.HandStandBranchExpander);