/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.ValueChooserPane
 * @extends BI.Widget
 */
BI.ValueChooserPane = BI.inherit(BI.AbstractValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.ValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-value-chooser-pane",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.ValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.list = BI.createWidget({
            type: 'bi.multi_select_list',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this)
        });

        this.list.on(BI.MultiSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.ValueChooserPane.EVENT_CHANGE);
        });
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
            this.populate();
        }
    },

    setValue: function (v) {
        this.list.setValue(v);
    },

    getValue: function () {
        var val = this.list.getValue() || {};
        return {
            type: val.type,
            value: val.value
        }
    },

    populate: function () {
        this.list.populate.apply(this.list, arguments);
    }
});
BI.ValueChooserPane.EVENT_CHANGE = "ValueChooserPane.EVENT_CHANGE";
BI.shortcut('bi.value_chooser_pane', BI.ValueChooserPane);