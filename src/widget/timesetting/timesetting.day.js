/**
 * Created by Young's on 2016/4/22.
 */
BI.DayTimeSetting = BI.inherit(BI.Widget, {
    _defaultConfig: function(){
        return BI.extend(BI.DayTimeSetting.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-time-setting-day",
            day: 1
        })
    },

    _init: function(){
        BI.DayTimeSetting.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var decrease = BI.createWidget({
            type: "bi.text_button",
            cls: "operator-button",
            text: "-",
            height: 28,
            width: 28
        });
        decrease.on(BI.Button.EVENT_CHANGE, function(){
            var day = BI.parseInt(self.day.getValue());
            if(day === 1) {
                day = 31;
            } else {
                day --;
            }
            self.day.setValue(day);
            self.fireEvent(BI.DayTimeSetting.EVENT_CHANGE);
        });

        var increase = BI.createWidget({
            type: "bi.text_button",
            cls: "operator-button",
            text: "+",
            height: 28,
            width: 28
        });
        increase.on(BI.Button.EVENT_CHANGE, function(){
            var day = BI.parseInt(self.day.getValue());
            if(day === 31) {
                day = 1;
            } else {
                day ++;
            }
            self.day.setValue(day);
            self.fireEvent(BI.DayTimeSetting.EVENT_CHANGE);
        });

        this.day = BI.createWidget({
            type: "bi.label",
            value: o.day,
            height: 30,
            width: 40
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [decrease, this.day, increase, {
                type: "bi.label",
                text: BI.i18nText("BI-Day_Ri"),
                height: 30,
                width: 20
            }],
            height: 30
        })
    },

    getValue: function(){
        return BI.parseInt(this.day.getValue());
    },

    setValue: function(v) {
        this.day.setValue(v);
    }
});
BI.DayTimeSetting.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.day_time_setting", BI.DayTimeSetting);