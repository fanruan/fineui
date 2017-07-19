/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimeTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 30
    },

    _defaultConfig: function () {
        return BI.extend(BI.DateTimeTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-date-time-trigger",
            height: 25,
            width: 180
        });
    },
    _init: function () {
        BI.DateTimeTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "bi-border",
            textAlign: "left",
            height: o.height,
            width: o.width,
            hgap: c.hgap,
            vgap: c.vgap
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: BI.createWidget(),
                width: 30
            }, {
                el: this.text
            }]
        })
    },

    _printTime: function (v) {
        return v < 10 ? "0" + v : v;
    },

    setValue: function (v) {
        var self = this;
        if (BI.isNotNull(v)) {
            var value = v.value, dateStr;
            if(BI.isNull(value)){
                value = new Date();
                dateStr = value.getFullYear() + "-" + self._printTime(value.getMonth() + 1) + "-" + self._printTime(value.getDate())
                    + " " + self._printTime(value.getHours()) + ":" + self._printTime(value.getMinutes()) + ":" + self._printTime(value.getSeconds());
            } else {
                dateStr = value.year + "-" + self._printTime(value.month + 1) + "-" + self._printTime(value.day)
                    + " " + self._printTime(value.hour) + ":" + self._printTime(value.minute) + ":" + self._printTime(value.second);
            }
            this.text.setText(dateStr);
        }
    }

});
BI.DateTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.shortcut("bi.date_time_trigger", BI.DateTimeTrigger);
