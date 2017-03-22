/**
 * Created by Young's on 2016/4/22.
 */
BI.HourTimeSetting = BI.inherit(BI.Widget, {
    _defaultConfig: function(){
        return BI.extend(BI.HourTimeSetting.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-time-setting-hour",
            hour: 0
        })
    },

    _init: function(){
        BI.HourTimeSetting.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var decrease = BI.createWidget({
            type: "bi.text_button",
            cls: "operator-button",
            text: "-",
            height: 28,
            width: 28
        });
        decrease.on(BI.Button.EVENT_CHANGE, function(){
            var hour = BI.parseInt(self.hour.getValue());
            if(hour === 0) {
                hour = 23;
            } else {
                hour --;
            }
            self.hour.setValue(hour);
            self.fireEvent(BI.HourTimeSetting.EVENT_CHANGE);
        });

        var increase = BI.createWidget({
            type: "bi.text_button",
            cls: "operator-button",
            text: "+",
            height: 28,
            width: 28
        });
        increase.on(BI.Button.EVENT_CHANGE, function(){
            var hour = BI.parseInt(self.hour.getValue());
            hour === 23 ? (hour = 0) : (hour ++);
            self.hour.setValue(hour);
            self.fireEvent(BI.HourTimeSetting.EVENT_CHANGE);
        });

        this.hour = BI.createWidget({
            type: "bi.label",
            value: o.hour,
            height: 30,
            width: 40
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [decrease, this.hour, increase, {
                type: "bi.label",
                text: BI.i18nText("BI-Hour_Dian"),
                height: 30,
                width: 20
            }],
            height: 30
        })
    },

    getValue: function(){
        return BI.parseInt(this.hour.getValue());
    },

    setValue: function(v) {
        this.hour.setValue(v);
    }
});
BI.HourTimeSetting.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.hour_time_setting", BI.HourTimeSetting);