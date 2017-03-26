/**
 * 日期控件中的年份或月份trigger
 *
 * Created by GUY on 2015/9/7.
 * @class BI.DateTriangleTrigger
 * @extends BI.Trigger
 */
BI.DateTriangleTrigger = BI.inherit(BI.Trigger, {
    _const: {
        height: 25,
        iconWidth: 16,
        iconHeight: 13
    },

    _defaultConfig: function() {
        return BI.extend( BI.DateTriangleTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-triangle-trigger pull-down-ha-font cursor-pointer",
            height: 25
        });
    },
    _init: function() {
        BI.DateTriangleTrigger.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "right",
            text: o.text,
            value: o.value,
            height: c.height
        })
        this.icon = BI.createWidget({
            type: "bi.icon",
            width: c.iconWidth,
            height: c.iconHeight
        });

        BI.createWidget({
            type: "bi.center_adapt",
            element: this.element,
            items: [{
                type: "bi.center_adapt",
                width: 50,
                height: c.height,
                items: [this.text, this.icon]
            }]
        })
    },

    setValue: function(v){
        this.text.setValue(v);
    },

    getValue: function(){
        return this.text.getValue();
    },

    setText: function(v){
        this.text.setText(v);
    },

    getText: function(){
        return this.item.getText();
    },

    getKey: function(){

    }
});
$.shortcut('bi.date_triangle_trigger', BI.DateTriangleTrigger);