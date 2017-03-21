BICst.MULTI_DATE_YMD_CARD = 1;
BICst.MULTI_DATE_YEAR_CARD = 2;
BICst.MULTI_DATE_QUARTER_CARD = 3;
BICst.MULTI_DATE_MONTH_CARD = 4;
BICst.MULTI_DATE_WEEK_CARD = 5;
BICst.MULTI_DATE_DAY_CARD = 6;
BICst.MULTI_DATE_SEGMENT_NUM = {};
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_PREV] = BI.i18nText("BI-Multi_Date_Year_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_AFTER] = BI.i18nText("BI-Multi_Date_Year_Next");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_BEGIN] = BI.i18nText("BI-Multi_Date_Year_Begin");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_END] = BI.i18nText("BI-Multi_Date_Year_End");

BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_PREV] = BI.i18nText("BI-Multi_Date_Quarter_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_AFTER] = BI.i18nText("BI-Multi_Date_Quarter_Next");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_BEGIN] = BI.i18nText("BI-Multi_Date_Quarter_Begin");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_END] = BI.i18nText("BI-Multi_Date_Quarter_End");

BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_PREV] = BI.i18nText("BI-Multi_Date_Month_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_AFTER] = BI.i18nText("BI-Multi_Date_Month_Next");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_BEGIN] = BI.i18nText("BI-Multi_Date_Month_Begin");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_END] = BI.i18nText("BI-Multi_Date_Month_End");

BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_WEEK_PREV] = BI.i18nText("BI-Multi_Date_Week_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_WEEK_AFTER] = BI.i18nText("BI-Multi_Date_Week_Next");

BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_PREV] = BI.i18nText("BI-Multi_Date_Day_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_AFTER] = BI.i18nText("BI-Multi_Date_Day_Next");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_TODAY] = BI.i18nText("BI-Multi_Date_Today");

(function ($) {
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
                baseCls: 'bi-multidate-combo',
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
            this.trigger.on(BI.DateTrigger.EVENT_KEY_DOWN, function(){
                if(self.combo.isViewVisible()){
                    self.combo.hideView();
                }
            });
            this.trigger.on(BI.DateTrigger.EVENT_STOP, function(){
                if(!self.combo.isViewVisible()){
                    self.combo.showView();
                }
            });
            this.trigger.on(BI.DateTrigger.EVENT_TRIGGER_CLICK, function(){
                self.combo.toggle();
            });
            this.trigger.on(BI.DateTrigger.EVENT_FOCUS, function () {
                self.storeTriggerValue = self.trigger.getKey();
                if(!self.combo.isViewVisible()){
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
                if(self.combo.isViewVisible()) {
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
                type: "bi.trigger_icon_button",
                cls: "bi-trigger-date-button chart-date-normal-font",
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
                cls: "bi-trigger-date-change widget-date-h-change-font",
                width: 30,
                height: 23,
                invisible: true
            });


            BI.createWidget({
                type: "bi.absolute",
                element: this,
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
                }, {
                    el: this.changeIcon,
                    top: 0,
                    right: 0
                }]
            })
        },

        _checkDynamicValue: function(v){
            var type = null;
            if (BI.isNotNull(v)) {
                type = v.type
            }
            switch (type){
                case BICst.MULTI_DATE_YEAR_PREV:
                case BICst.MULTI_DATE_YEAR_AFTER:
                case BICst.MULTI_DATE_YEAR_BEGIN:
                case BICst.MULTI_DATE_YEAR_END:
                case BICst.MULTI_DATE_QUARTER_PREV:
                case BICst.MULTI_DATE_QUARTER_AFTER:
                case BICst.MULTI_DATE_QUARTER_BEGIN:
                case BICst.MULTI_DATE_QUARTER_END:
                case BICst.MULTI_DATE_MONTH_PREV:
                case BICst.MULTI_DATE_MONTH_AFTER:
                case BICst.MULTI_DATE_MONTH_BEGIN:
                case BICst.MULTI_DATE_MONTH_END:
                case BICst.MULTI_DATE_WEEK_PREV:
                case BICst.MULTI_DATE_WEEK_AFTER:
                case BICst.MULTI_DATE_DAY_PREV:
                case BICst.MULTI_DATE_DAY_AFTER:
                case BICst.MULTI_DATE_DAY_TODAY:
                    this.changeIcon.setVisible(true);
                    break;
                default:
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
        getKey: function(){
            return this.trigger.getKey();
        },
        hidePopupView: function () {
            this.combo.hideView();
        }
    });
    $.shortcut('bi.multidate_combo', BI.MultiDateCombo);

    BI.MultiDateCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
    BI.MultiDateCombo.EVENT_FOCUS = "EVENT_FOCUS";
    BI.MultiDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
    BI.MultiDateCombo.EVENT_VALID = "EVENT_VALID";
    BI.MultiDateCombo.EVENT_ERROR = "EVENT_ERROR";
    BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW = "BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW";
})(jQuery);