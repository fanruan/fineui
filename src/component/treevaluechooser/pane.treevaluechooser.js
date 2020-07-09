/**
 * 简单的树面板, 适用于数据量少的情况
 *
 * Created by GUY on 2015/10/29.
 * @class BI.TreeValueChooserPane
 * @extends BI.AbstractTreeValueChooser
 */
BI.TreeValueChooserPane = BI.inherit(BI.AbstractTreeValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.TreeValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-value-chooser-pane",
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.TreeValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.pane = BI.createWidget({
            type: "bi.multi_select_tree",
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this)
        });

        this.pane.on(BI.MultiSelectTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.TreeValueChooserPane.EVENT_CHANGE);
        });
        if (BI.isNotNull(o.items)) {
            this._initData(o.items);
            this.populate();
        }
    },

    setSelectedValue: function (v) {
        this.pane.setSelectedValue(v);
    },

    setValue: function (v) {
        this.pane.setValue(v);
    },

    getValue: function () {
        return this.pane.getValue();
    },

    getAllValue: function() {
        return this.buildCompleteTree(this.combo.getValue());
    },

    populate: function () {
        this.pane.populate.apply(this.pane, arguments);
    }
});
BI.TreeValueChooserPane.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.tree_value_chooser_pane", BI.TreeValueChooserPane);