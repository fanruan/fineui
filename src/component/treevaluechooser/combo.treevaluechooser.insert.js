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
            itemsCreator: BI.emptyFn,
            isNeedAdjustWidth: true
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
            simple: o.simple,
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            allowEdit: o.allowEdit,
            text: o.text,
            value: o.value,
            watermark: o.watermark,
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height,
            listeners: [{
                eventName: BI.MultiTreeInsertCombo.EVENT_FOCUS,
                action: function () {
                    self.fireEvent(BI.TreeValueChooserCombo.EVENT_FOCUS);
                }
            }, {
                eventName: BI.MultiTreeInsertCombo.EVENT_BLUR,
                action: function () {
                    self.fireEvent(BI.TreeValueChooserCombo.EVENT_BLUR);
                }
            }, {
                eventName: BI.MultiTreeInsertCombo.EVENT_STOP,
                action: function () {
                    self.fireEvent(BI.TreeValueChooserInsertCombo.EVENT_STOP);
                }
            }, {
                eventName: BI.MultiTreeInsertCombo.EVENT_CLICK_ITEM,
                action: function (v) {
                    self.fireEvent(BI.TreeValueChooserInsertCombo.EVENT_CLICK_ITEM, v);
                }
            }, {
                eventName: BI.MultiTreeInsertCombo.EVENT_SEARCHING,
                action: function () {
                    self.fireEvent(BI.TreeValueChooserInsertCombo.EVENT_SEARCHING);
                }
            }, {
                eventName: BI.MultiTreeInsertCombo.EVENT_CONFIRM,
                action: function () {
                    self.fireEvent(BI.TreeValueChooserInsertCombo.EVENT_CONFIRM);
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

BI.TreeValueChooserInsertCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.TreeValueChooserInsertCombo.EVENT_BLUR = "EVENT_BLUR";
BI.TreeValueChooserInsertCombo.EVENT_STOP = "EVENT_STOP";
BI.TreeValueChooserInsertCombo.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.TreeValueChooserInsertCombo.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.TreeValueChooserInsertCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.TreeValueChooserInsertCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.tree_value_chooser_insert_combo", BI.TreeValueChooserInsertCombo);
