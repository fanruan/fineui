/**
 * 简单的复选下拉框控件, 适用于数据量少的情况， 与valuechooser的区别是allvaluechooser setValue和getValue返回的是所有值
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AllValueChooserCombo
 * @extends BI.AbstractAllValueChooser
 */
BI.AllValueChooserCombo = BI.inherit(BI.AbstractAllValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.AllValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-all-value-chooser-combo",
            width: 200,
            height: 24,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.AllValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.combo = BI.createWidget({
            type: "bi.multi_select_combo",
            simple: o.simple,
            text: o.text,
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height,
            value: this._assertValue({
                type: BI.Selection.Multi,
                value: o.value || []
            })
        });

        this.combo.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.AllValueChooserCombo.EVENT_CONFIRM);
        });
    },

    setValue: function (v) {
        this.combo.setValue(this._assertValue({
            type: BI.Selection.Multi,
            value: v || []
        }));
    },

    getValue: function () {
        return this.getAllValue();
    },

    getAllValue: function () {
        var val = this.combo.getValue() || {};
        if (val.type === BI.Selection.Multi) {
            return val.value || [];
        }

        return BI.difference(BI.map(this.items, "value"), val.value || []);
    },

    populate: function (items) {
        // 直接用combo的populate不会作用到AbstractValueChooser上
        if (BI.isNotNull(items)) {
            this.items = items;
        }
        this.combo.populate();
    }
});
BI.AllValueChooserCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.all_value_chooser_combo", BI.AllValueChooserCombo);
