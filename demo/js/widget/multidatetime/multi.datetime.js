/**
 * Created by Urthur on 2017/7/14.
 */
BI.CustomMultiDateTimeCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CustomMultiDateTimeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-custom-multi-date-time-combo"
        })
    },

    _init: function () {
        BI.CustomMultiDateTimeCombo.superclass._init.apply(this, arguments);
        var self = this;
        this.multiDateTime = BI.createWidget({
            type: "bi.multi_date_time_combo",
            element: this
        });
        this.multiDateTime.on(BI.MultiDateTimeCombo.EVENT_CANCEL, function () {
            self.fireEvent(BI.CustomMultiDateTimeCombo.EVENT_CANCEL);
        });

        this.multiDateTime.on(BI.MultiDateTimeCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.CustomMultiDateTimeCombo.EVENT_CONFIRM);
        });
    },

    getValue: function () {
        return this.multiDateTime.getValue();
    },

    setValue: function (v) {
        this.multiDateTime.setValue(v);
    }
});
BI.CustomMultiDateTimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.CustomMultiDateTimeCombo.EVENT_CANCEL = "EVENT_CANCEL";
BI.CustomMultiDateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.custom_multi_date_time_combo", BI.CustomMultiDateTimeCombo);
