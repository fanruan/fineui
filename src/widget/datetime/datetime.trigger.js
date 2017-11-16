/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimeTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.DateTimeTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-date-time-trigger",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 24,
            width: 200
        });
    },
    _init: function () {
        BI.DateTimeTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            height: o.height,
            width: o.width,
            hgap: c.hgap
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: BI.createWidget(),
                width: o.height
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
        var value = v, dateStr;
        if(BI.isNull(value)){
            value = new Date();
            dateStr = value.print("%Y-%X-%d %H:%M:%S");
        } else {
            var date = new Date(value.year,value.month,value.day,value.hour,value.minute,value.second);
            dateStr = date.print("%Y-%X-%d %H:%M:%S");

        }
        this.text.setText(dateStr);
        this.text.setTitle(dateStr);
    }

});
BI.shortcut("bi.date_time_trigger", BI.DateTimeTrigger);