/**
 * 简单的复选下拉树控件, 适用于数据量少的情况, 可以自增值
 *
 * Created by GUY on 2015/10/29.
 * @class BI.TreeValueChooserInsertCombo
 * @extends BI.Widget
 */
BI.TreeValueChooserInsertCombo = BI.inherit(BI.AbstractTreeValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.TreeValueChooserInsertCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-value-chooser-insert-combo",
            width: 200,
            height: 24,
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.TreeValueChooserInsertCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this._initData(o.items);
        }
        this.combo = BI.createWidget({
            type: "bi.multi_tree_insert_combo",
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height
        });

        this.combo.on(BI.MultiTreeInsertCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.TreeValueChooserInsertCombo.EVENT_CONFIRM);
        });
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    populate: function (items) {
        this._initData(items);
        this.combo.populate.apply(this.combo, arguments);
    }
});
BI.TreeValueChooserInsertCombo.EVENT_CONFIRM = "TreeValueChooserInsertCombo.EVENT_CONFIRM";
BI.shortcut("bi.tree_value_chooser_insert_combo", BI.TreeValueChooserInsertCombo);