/**
 * 日期控件
 * @class BI.MultiDateCombo
 * @extends BI.Widget
 */
BI.MultiDateCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 259,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1,
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },
    _defaultConfig: function () {
        return BI.extend(BI.MultiDateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multidate-combo bi-border',
            height: 24
        });
    },
    _init: function () {
        BI.MultiDateCombo.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.storeTriggerValue = "";
        var date = new Date();
        this.storeValue = null;
        this.trigger = BI.createWidget({
            type: 'bi.date_trigger',
            min: this.constants.DATE_MIN_VALUE,
            max: this.constants.DATE_MAX_VALUE
        });
        this.trigger.on(BI.DateTrigger.EVENT_KEY_DOWN, function () {
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            }
        });
        this.trigger.on(BI.DateTrigger.EVENT_STOP, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });
        this.trigger.on(BI.DateTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });
        this.trigger.on(BI.DateTrigger.EVENT_FOCUS, function () {
            self.storeTriggerValue = self.trigger.getKey();
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
            self.fireEvent(BI.MultiDateCombo.EVENT_FOCUS);
        });
        this.trigger.on(BI.DateTrigger.EVENT_ERROR, function () {
            self.storeValue = {
                year: date.getFullYear(),
                month: date.getMonth()
            };
            self.popup.setValue();
            self.fireEvent(BI.MultiDateCombo.EVENT_ERROR);
        });
        this.trigger.on(BI.DateTrigger.EVENT_VALID, function () {
            self.fireEvent(BI.MultiDateCombo.EVENT_VALID);
        });
        this.trigger.on(BI.DateTrigger.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiDateCombo.EVENT_CHANGE);
        });
        this.trigger.on(BI.DateTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            var dateStore = self.storeTriggerValue;
            var dateObj = self.trigger.getKey();
            if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                self.storeValue = self.trigger.getValue();
                self.setValue(self.trigger.getValue());
            } else if (BI.isEmptyString(dateObj)) {
                self.storeValue = null;
                self.trigger.setValue();
            }
            self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
        });
        this.popup = BI.createWidget({
            type: "bi.multidate_popup",
            min: this.constants.DATE_MIN_VALUE,
            max: this.constants.DATE_MAX_VALUE
        });
        this.popup.on(BI.MultiDatePopup.BUTTON_CLEAR_EVENT_CHANGE, function () {
            self.setValue();
            self.combo.hideView();
            self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
        });
        this.popup.on(BI.MultiDatePopup.BUTTON_lABEL_EVENT_CHANGE, function () {
            var date = new Date();
            self.setValue({
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate()
            });
            self.combo.hideView();
            self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
        });
        this.popup.on(BI.MultiDatePopup.BUTTON_OK_EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
        });
        this.popup.on(BI.MultiDatePopup.CALENDAR_EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            //self.fireEvent(BI.MultiDateCombo.EVENT_CHANGE);
            self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
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
            self.fireEvent(BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW);
        });

        var triggerBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "bi-trigger-icon-button date-font",
            width: 30,
            height: 23
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        this.changeIcon = BI.createWidget({
            type: "bi.icon_button",
            cls: "bi-trigger-icon-button date-change-h-font",
            width: 30,
            height: 23
        });


        var leftPart = BI.createWidget({
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
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [leftPart, {
                el: this.changeIcon,
                width: 30
            }],
            ref: function (_ref) {
                self.comboWrapper = _ref;
            }
        })
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type
        }
        switch (type) {
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_YEAR_PREV:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_YEAR_AFTER:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_YEAR_BEGIN:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_YEAR_END:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_QUARTER_PREV:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_QUARTER_AFTER:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_QUARTER_BEGIN:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_QUARTER_END:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_MONTH_PREV:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_MONTH_AFTER:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_MONTH_BEGIN:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_MONTH_END:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_WEEK_PREV:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_WEEK_AFTER:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_DAY_PREV:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_DAY_AFTER:
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_DAY_TODAY:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[1].width = 30;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[1].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    setValue: function (v) {
        this.storeValue = v;
        this.popup.setValue(v);
        this.trigger.setValue(v);
        this._checkDynamicValue(v)
    },
    getValue: function () {
        return this.storeValue;
    },
    getKey: function () {
        return this.trigger.getKey();
    },
    hidePopupView: function () {
        this.combo.hideView();
    }
});
BI.shortcut('bi.multidate_combo', BI.MultiDateCombo);

BI.MultiDateCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.MultiDateCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiDateCombo.EVENT_VALID = "EVENT_VALID";
BI.MultiDateCombo.EVENT_ERROR = "EVENT_ERROR";
BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW = "BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW";

BI.extend(BI.MultiDateCombo, {
    MULTI_DATE_YMD_CARD: 1,
    MULTI_DATE_YEAR_CARD: 2,
    MULTI_DATE_QUARTER_CARD: 3,
    MULTI_DATE_MONTH_CARD: 4,
    MULTI_DATE_WEEK_CARD: 5,
    MULTI_DATE_DAY_CARD: 6
});

BI.extend(BI.MultiDateCombo, {
    DATE_TYPE: {
        MULTI_DATE_YEAR_PREV: 1,
        MULTI_DATE_YEAR_AFTER: 2,
        MULTI_DATE_YEAR_BEGIN: 3,
        MULTI_DATE_YEAR_END: 4,
        MULTI_DATE_MONTH_PREV: 5,
        MULTI_DATE_MONTH_AFTER: 6,
        MULTI_DATE_MONTH_BEGIN: 7,
        MULTI_DATE_MONTH_END: 8,
        MULTI_DATE_QUARTER_PREV: 9,
        MULTI_DATE_QUARTER_AFTER: 10,
        MULTI_DATE_QUARTER_BEGIN: 11,
        MULTI_DATE_QUARTER_END: 12,
        MULTI_DATE_WEEK_PREV: 13,
        MULTI_DATE_WEEK_AFTER: 14,
        MULTI_DATE_DAY_PREV: 15,
        MULTI_DATE_DAY_AFTER: 16,
        MULTI_DATE_DAY_TODAY: 17,
        MULTI_DATE_PARAM: 18,
        MULTI_DATE_CALENDAR: 19,
        YEAR_QUARTER: 20,
        YEAR_MONTH: 21,
        YEAR_WEEK: 22,
        YEAR_DAY: 23,
        MONTH_WEEK: 24,
        MONTH_DAY: 25,
        YEAR: 26,
        SAME_PERIOD: 27,
        LAST_SAME_PERIOD: 28
    }
});
