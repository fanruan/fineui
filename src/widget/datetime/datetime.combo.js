/**
 * Created by Urthur on 2017/7/14.
 */
BI.DateTimeCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 290,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1,
        iconWidth: 24
    },
    _defaultConfig: function () {
        return BI.extend(BI.DateTimeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-time-combo bi-border bi-border-radius",
            width: 200,
            height: 24,
            minDate: "1900-01-01",
            maxDate: "2099-12-31"
        });
    },
    _init: function () {
        BI.DateTimeCombo.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        var date = BI.getDate();
        this.storeValue = BI.isNotNull(opts.value) ? opts.value : {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
        this.trigger = BI.createWidget({
            type: "bi.date_time_trigger",
            height: opts.height,
            min: opts.minDate,
            max: opts.maxDate,
            value: opts.value
        });

        this.popup = BI.createWidget({
            type: "bi.date_time_popup",
            behaviors: opts.behaviors,
            min: opts.minDate,
            max: opts.maxDate,
            value: opts.value
        });
        self.setValue(this.storeValue);

        this.popup.on(BI.DateTimePopup.BUTTON_CANCEL_EVENT_CHANGE, function () {
            self.setValue(self.storeValue);
            self.hidePopupView();
            self.fireEvent(BI.DateTimeCombo.EVENT_CANCEL);
        });
        this.popup.on(BI.DateTimePopup.BUTTON_OK_EVENT_CHANGE, function () {
            self.storeValue = self.popup.getValue();
            self.setValue(self.storeValue);
            self.hidePopupView();
            self.fireEvent(BI.DateTimeCombo.EVENT_CONFIRM);
        });
        this.combo = BI.createWidget({
            type: "bi.combo",
            container: opts.container,
            toggle: false,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            adjustLength: this.constants.comboAdjustHeight,
            popup: {
                el: this.popup,
                width: this.constants.popupWidth,
                stopPropagation: false
            },
            // DEC-4250 和复选下拉一样，点击不收起
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.DateTimeCombo.EVENT_BEFORE_POPUPVIEW);
        });

        var triggerBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "bi-trigger-icon-button date-font",
            width: this.constants.iconWidth,
            height: opts.height,
        });
        triggerBtn.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self.combo.isViewVisible()) {
                // self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });

        BI.createWidget({
            type: "bi.htape",
            columnSize: ["", this.constants.iconWidth],
            element: this,
            items: [this.combo, triggerBtn]
        });
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

BI.DateTimeCombo.EVENT_CANCEL = "EVENT_CANCEL";
BI.DateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DateTimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateTimeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.date_time_combo", BI.DateTimeCombo);
