/**
 * 简单的复选下拉框控件, 适用于数据量少的情况， 与valuechooser的区别是allvaluechooser setValue和getValue返回的是所有值
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AllValueChooserPane
 * @extends BI.AbstractAllValueChooser
 */
BI.AllValueChooserPane = BI.inherit(BI.AbstractAllValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.AllValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-all-value-chooser-pane",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.AllValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.list = BI.createWidget({
            type: 'bi.multi_select_list',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height
        });

        this.list.on(BI.MultiSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.AllValueChooserPane.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        this.list.setValue({
            type: BI.Selection.Multi,
            value: v || []
        });
    },

    getValue: function () {
        var val = this.list.getValue() || {};
        if (val.type === BI.Selection.All) {
            return val.assist;
        }
        return val.value || [];
    },

    populate: function () {
        this.list.populate.apply(this.list, arguments);
    }
});
BI.AllValueChooserPane.EVENT_CHANGE = "AllValueChooserPane.EVENT_CHANGE";
BI.shortcut('bi.all_value_chooser_pane', BI.AllValueChooserPane);