/**
 * @class BI.BranchExpander
 * @extend BI.Widget
 * create by young
 */
BI.BranchExpander = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.BranchExpander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-branch-expander",
            direction: BI.Direction.Left,
            logic: {
                dynamic: true
            },
            el: {},
            popup: {}
        })
    },

    _init: function () {
        BI.BranchExpander.superclass._init.apply(this, arguments);
        var o = this.options;
        this._initExpander();
        this._initBranchView();
        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.expander, this.branchView)
        }))));
    },

    _initExpander: function () {
        var self = this, o = this.options;
        this.expander = BI.createWidget(o.el, {
            type: "bi.label",
            width: 30,
            height: "100%"
        });
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
BI.BranchExpander.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.branch_expander", BI.BranchExpander);