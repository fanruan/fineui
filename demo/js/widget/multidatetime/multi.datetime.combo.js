/**
 * Created by Urthur on 2017/7/14.
 */
BI.MultiDateTimeCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 290,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1,
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },
    _defaultConfig: function () {
        return BI.extend(BI.MultiDateTimeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-date-time-combo bi-border',
            height: 24
        });
    },
    _init: function () {
        BI.MultiDateTimeCombo.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        var date = new Date();
        this.storeValue = {
            value: {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds()
            }
        };
        this.trigger = BI.createWidget({
            type: 'bi.date_time_trigger',
            min: this.constants.DATE_MIN_VALUE,
            max: this.constants.DATE_MAX_VALUE
        });

        this.popup = BI.createWidget({
            type: "bi.multi_date_time_popup",
            min: this.constants.DATE_MIN_VALUE,
            max: this.constants.DATE_MAX_VALUE
        });

        this.popup.on(BI.MultiDateTimePopup.BUTTON_CANCEL_EVENT_CHANGE, function () {
            self.setValue({
                value: {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate(),
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    second: date.getSeconds()
                }
            });
            self.combo.hideView();
            self.fireEvent(BI.MultiDateTimeCombo.EVENT_CONFIRM);
        });
        this.popup.on(BI.MultiDateTimePopup.BUTTON_OK_EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MultiDateTimeCombo.EVENT_CONFIRM);
        });
        this.popup.on(BI.MultiDateTimePopup.CALENDAR_EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
        });
        this.combo = BI.createWidget({
            type: 'bi.combo',
            toggle: false,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            adjustLength: this.constants.comboAdjustHeight,
            popup: {
                el: this.popup,
                maxHeight: this.constants.popupHeight,
                width: this.constants.popupWidth,
                stopPropagation: false
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.MultiDateTimeCombo.EVENT_BEFORE_POPUPVIEW);
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            cls: "bi-trigger-date-button chart-date-normal-font bi-border-right",
            width: 30,
            height: 24
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: this.combo,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, {
                    el: triggerBtn,
                    top: 0,
                    left: 0
                }]
            }]
        })
    },

    setValue: function (v) {
        this.storeValue = v;
        this.popup.setValue(v);
        this.trigger.setValue(v);
    },
    getValue: function () {
        return this.storeValue;
    },

    hidePopupView: function () {
        this.combo.hideView();
    }
});

BI.MultiDateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.MultiDateTimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiDateTimeCombo.EVENT_BEFORE_POPUPVIEW = "BI.MultiDateTimeCombo.EVENT_BEFORE_POPUPVIEW";
BI.shortcut('bi.multi_date_time_combo', BI.MultiDateTimeCombo);

