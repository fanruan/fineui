/**
 * 可以单选多选切换的树
 *
 * Created by GUY on 2015/12/21.
 * @class BI.SwitchTree
 * @extends BI.Widget
 */
BI.SwitchTree = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SwitchTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-switch-tree",
            items: []
        });
    },

    _init: function () {
        BI.SwitchTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tab = BI.createWidget({
            type: "bi.tab",
            element: this,
            tab: null,
            defaultShowIndex: BI.SwitchTree.SelectType.SingleSelect,
            cardCreator: BI.bind(this._createTree, this)
        });
    },

    _createTree: function (type) {
        var self = this, o = this.options;
        switch (type) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.levelTree = BI.createWidget({
                    type: "bi.multilayer_single_level_tree",
                    isDefaultInit: true,
                    items: BI.deepClone(o.items)
                });
                this.levelTree.on(BI.LevelTree.EVENT_CHANGE, function () {
                    self.fireEvent(BI.SwitchTree.EVENT_CHANGE, arguments);
                });
                return this.levelTree;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.tree = BI.createWidget({
                    type: "bi.simple_tree",
                    items: this._removeIsParent(BI.deepClone(o.items))
                });
                this.tree.on(BI.SimpleTreeView.EVENT_CHANGE, function () {
                    self.fireEvent(BI.SwitchTree.EVENT_CHANGE, arguments);
                });
                return this.tree;
        }
    },

    _removeIsParent: function(items) {
        BI.each(items, function(i, item) {
            BI.isNotNull(item.isParent) && delete item.isParent;
        });
        return items;
    },

    switchSelect: function () {
        switch (this.getSelect()) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.setSelect(BI.SwitchTree.SelectType.MultiSelect);
                break;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.setSelect(BI.SwitchTree.SelectType.SingleSelect);
                break;
        }
    },

    setSelect: function (v) {
        this.tab.setSelect(v);
    },

    getSelect: function () {
        return this.tab.getSelect();
    },

    setValue: function (v) {
        this.storeValue = v;
        switch (this.getSelect()) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.levelTree.setValue(v);
                break;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.tree.setValue(v);
                break;
        }
    },

    getValue: function () {
        return this.tab.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        if (BI.isNotNull(this.levelTree)) {
            this.levelTree.populate(BI.deepClone(items));
        }
        if (BI.isNotNull(this.tree)) {
            this.tree.populate(this._removeIsParent(BI.deepClone(items)));
        }
    }
});
BI.SwitchTree.EVENT_CHANGE = "SwitchTree.EVENT_CHANGE";
BI.SwitchTree.SelectType = {
    SingleSelect: BI.Selection.Single,
    MultiSelect: BI.Selection.Multi
};
BI.shortcut('bi.switch_tree', BI.SwitchTree);
