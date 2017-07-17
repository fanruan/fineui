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
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 25
        });
    },
    _init: function () {
        BI.DateTimeTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            hgap: c.hgap,
            vgap: c.vgap,
            disabled: true
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: BI.createWidget(),
                width: 30
            }, {
                el: this.editor
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
            this.editor.setValue(dateStr);
        }
    }

});
BI.shortcut("bi.date_time_trigger", BI.DateTimeTrigger);
