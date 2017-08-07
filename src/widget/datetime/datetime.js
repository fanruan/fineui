/**
 * Created by Urthur on 2017/7/14.
 */
BI.CustomDateTimeCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CustomDateTimeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-custom-date-time-combo"
        })
    },

    _init: function () {
        BI.CustomDateTimeCombo.superclass._init.apply(this, arguments);
        var self = this;
        this.DateTime = BI.createWidget({
            type: "bi.date_time_combo",
            element: this
        });
        this.DateTime.on(BI.DateTimeCombo.EVENT_CANCEL, function () {
            self.fireEvent(BI.CustomDateTimeCombo.EVENT_CHANGE);
            self.fireEvent(BI.CustomDateTimeCombo.EVENT_CANCEL);
        });

        this.DateTime.on(BI.DateTimeCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.CustomDateTimeCombo.EVENT_CHANGE);
            self.fireEvent(BI.CustomDateTimeCombo.EVENT_CONFIRM);
        });

        this.DateTime.on(BI.DateTimeCombo.EVENT_CHANGE, function () {
            self.fireEvent(BI.CustomDateTimeCombo.EVENT_CHANGE);
        });
    },

    getValue: function () {
        return this.DateTime.getValue();
    },

    setValue: function (v) {
        this.DateTime.setValue(v);
    }
});
BI.CustomDateTimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.CustomDateTimeCombo.EVENT_CANCEL = "EVENT_CANCEL";
BI.CustomDateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.custom_date_time_combo", BI.CustomDateTimeCombo);
