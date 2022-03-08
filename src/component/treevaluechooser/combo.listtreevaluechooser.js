/**
 * 简单的复选下拉树控件, 适用于数据量少的情况, 可以自增值
 *
 * Created by GUY on 2015/10/29.
 * @class BI.ListTreeValueChooserInsertCombo
 * @extends BI.Widget
 */
BI.ListTreeValueChooserInsertCombo = BI.inherit(BI.AbstractListTreeValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.ListTreeValueChooserInsertCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-list-tree-value-chooser-insert-combo",
            width: 200,
            height: 24,
            items: null,
            itemsCreator: BI.emptyFn,
            isNeedAdjustWidth: true,
        });
    },

    _init: function () {
        BI.ListTreeValueChooserInsertCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this._initData(o.items);
        }
        this.combo = BI.createWidget({
            type: "bi.multi_tree_list_combo",
            simple: o.simple,
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            element: this,
            text: o.text,
            value: o.value,
            watermark: o.watermark,
            allowInsertValue: o.allowInsertValue,
            allowEdit: o.allowEdit,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height,
            listeners: [{
                eventName: BI.MultiTreeListCombo.EVENT_FOCUS,
                action: function () {
                    self.fireEvent(BI.ListTreeValueChooserInsertCombo.EVENT_FOCUS);
                }
            }, {
                eventName: BI.MultiTreeListCombo.EVENT_BLUR,
                action: function () {
                    self.fireEvent(BI.ListTreeValueChooserInsertCombo.EVENT_BLUR);
                }
            }, {
                eventName: BI.MultiTreeListCombo.EVENT_STOP,
                action: function () {
                    self.fireEvent(BI.ListTreeValueChooserInsertCombo.EVENT_STOP);
                }
            }, {
                eventName: BI.MultiTreeListCombo.EVENT_CLICK_ITEM,
                action: function (v) {
                    self.fireEvent(BI.ListTreeValueChooserInsertCombo.EVENT_CLICK_ITEM, v);
                }
            }, {
                eventName: BI.MultiTreeListCombo.EVENT_SEARCHING,
                action: function () {
                    self.fireEvent(BI.ListTreeValueChooserInsertCombo.EVENT_SEARCHING);
                }
            }, {
                eventName: BI.MultiTreeListCombo.EVENT_CONFIRM,
                action: function () {
                    self.fireEvent(BI.ListTreeValueChooserInsertCombo.EVENT_CONFIRM);
                }
            }, {
                eventName: BI.MultiTreeCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.fireEvent(BI.TreeValueChooserInsertCombo.EVENT_BEFORE_POPUPVIEW);
                }
            }]
        });
    },

    showView: function () {
        this.combo.showView();
    },

    hideView: function () {
        this.combo.hideView();
    },

    getSearcher: function () {
        return this.combo.getSearcher();
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    populate: function (items) {
        if (BI.isNotNull(items)) {
            this._initData(items);
        }
        this.combo.populate();
    },

    focus: function () {
        this.combo.focus();
    },

    blur: function () {
        this.combo.blur();
    },

    setWaterMark: function (v) {
        this.combo.setWaterMark(v);
    }
});

BI.ListTreeValueChooserInsertCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.ListTreeValueChooserInsertCombo.EVENT_BLUR = "EVENT_BLUR";
BI.ListTreeValueChooserInsertCombo.EVENT_STOP = "EVENT_STOP";
BI.ListTreeValueChooserInsertCombo.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.ListTreeValueChooserInsertCombo.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.ListTreeValueChooserInsertCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.ListTreeValueChooserInsertCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.list_tree_value_chooser_insert_combo", BI.ListTreeValueChooserInsertCombo);
