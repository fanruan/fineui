/**
 * 日期控件中的年份或月份trigger
 *
 * Created by GUY on 2015/9/7.
 * @class BI.DateTriangleTrigger
 * @extends BI.Trigger
 */
BI.DateTriangleTrigger = BI.inherit(BI.Trigger, {
    _const: {
        height: 24,
        iconWidth: 12,
        iconHeight: 12
    },

    _defaultConfig: function () {
        return BI.extend( BI.DateTriangleTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-triangle-trigger solid-triangle-bottom-font cursor-pointer",
            height: 24
        });
    },
    _init: function () {
        BI.DateTriangleTrigger.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "right",
            text: o.text,
            value: o.value,
            height: c.height
        });

        BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            items: [{
                el: this.text,
                rgap: 5
            }, {
                type: "bi.icon_label",
                width: 16
            }]
        });
    },

    setValue: function (v) {
        this.text.setValue(v);
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function (v) {
        this.text.setText(v);
    },

    getText: function () {
        return this.item.getText();
    },

    getKey: function () {

    }
});
BI.shortcut("bi.date_triangle_trigger", BI.DateTriangleTrigger);