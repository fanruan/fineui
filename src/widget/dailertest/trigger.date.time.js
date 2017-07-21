BI.DateTimeTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.DateTimeTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-date-trigger",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 32
        });
    },
    _init: function () {
        BI.DateTimeTrigger.superclass._init.apply(this, arguments);
        var self = this,
            o = this.options;
        this.label = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            text: "",
            height: o.height
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: BI.createWidget({
                    type: "bi.icon_button",
                    cls: "search-font"
                }),
                width: 30
            }, {
                el: this.label
            }]
        })

        var today = new Date(),
            timeObj = {
                year: today.getFullYear(),
                month: today.getMonth(),
                day: today.getDate(),
                hour: today.getHours(),
                minute: today.getMinutes(),
                second: today.getSeconds()
            };
        this.setValue(timeObj);
    },



    _parseTimeObjToStr: function (timeObj) {
        var _format = function (p) {
            return p < 10 ? ('0' + p) : p
        };
        BI.each(timeObj, function (key, val) {
            timeObj[key] = _format(timeObj[key]);
        });
        return timeObj.year + "-" + (1 + BI.parseInt(timeObj.month)) + "-" + timeObj.day + " " + timeObj.hour + ":" + timeObj.minute + ":" + timeObj.second;
    },

    setValue: function (v) {
        this.label.setValue(this._parseTimeObjToStr(v));

    },

    getValue: function () {

    }

});

BI.shortcut("bi.date_time_trigger1", BI.DateTimeTrigger);