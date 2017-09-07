/**
 * 日期控件
 * @class BI.MultiDatePopup
 * @extends BI.Widget
 */
BI.MultiDatePopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 30,
        tabWidth: 42,
        titleHeight: 27,
        itemHeight: 30,
        triggerHeight: 24,
        buttonWidth: 90,
        buttonHeight: 25,
        cardHeight: 229,
        cardWidth: 270,
        popupHeight: 259,
        popupWidth: 270,
        comboAdjustHeight: 1,
        ymdWidth: 58,
        lgap: 2,
        border: 1
    },
    _defaultConfig: function () {
        return BI.extend(BI.MultiDatePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multidate-popup',
            width: 268,
            height: 260
        });
    },
    _init: function () {
        BI.MultiDatePopup.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.storeValue = "";
        this.textButton = BI.createWidget({
            type: 'bi.text_button',
            forceCenter: true,
            cls: 'bi-multidate-popup-label bi-border-left bi-border-right bi-border-top',
            shadow: true,
            text: BI.i18nText("BI-Multi_Date_Today")
        });
        this.textButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiDatePopup.BUTTON_lABEL_EVENT_CHANGE);
        });
        this.clearButton = BI.createWidget({
            type: "bi.text_button",
            forceCenter: true,
            cls: 'bi-multidate-popup-button bi-border-top',
            shadow: true,
            text: BI.i18nText("BI-Basic_Clear")
        });
        this.clearButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiDatePopup.BUTTON_CLEAR_EVENT_CHANGE);
        });
        this.okButton = BI.createWidget({
            type: "bi.text_button",
            forceCenter: true,
            cls: 'bi-multidate-popup-button bi-border-top',
            shadow: true,
            text: BI.i18nText("BI-Basic_OK")
        });
        this.okButton.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiDatePopup.BUTTON_OK_EVENT_CHANGE);
        });
        this.dateTab = BI.createWidget({
            type: 'bi.tab',
            tab: {
                cls: "bi-multidate-popup-tab bi-border-bottom",
                height: this.constants.tabHeight,
                items: BI.createItems([{
                    text: BI.i18nText("BI-Multi_Date_YMD"),
                    value: BI.MultiDateCombo.MULTI_DATE_YMD_CARD,
                    width: this.constants.ymdWidth
                }, {
                    text: BI.i18nText("BI-Multi_Date_Year"),
                    value: BI.MultiDateCombo.MULTI_DATE_YEAR_CARD
                }, {
                    text: BI.i18nText("BI-Multi_Date_Quarter"),
                    value: BI.MultiDateCombo.MULTI_DATE_QUARTER_CARD
                }, {
                    text: BI.i18nText("BI-Multi_Date_Month"),
                    value: BI.MultiDateCombo.MULTI_DATE_MONTH_CARD
                }, {
                    text: BI.i18nText("BI-Multi_Date_Week"),
                    value: BI.MultiDateCombo.MULTI_DATE_WEEK_CARD
                }, {
                    text: BI.i18nText("BI-Multi_Date_Day"),
                    value: BI.MultiDateCombo.MULTI_DATE_DAY_CARD
                }], {
                    width: this.constants.tabWidth,
                    textAlign: "center",
                    height: this.constants.itemHeight,
                    cls: 'bi-multidate-popup-item bi-list-item-active'
                }),
                layouts: [{
                    type: 'bi.left'
                }]
            },
            cardCreator: function (v) {
                switch (v) {
                    case BI.MultiDateCombo.MULTI_DATE_YMD_CARD:
                        self.ymd = BI.createWidget({
                            type: "bi.date_calendar_popup",
                            min: self.options.min,
                            max: self.options.max
                        });
                        self.ymd.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
                            self.fireEvent(BI.MultiDatePopup.CALENDAR_EVENT_CHANGE);
                        });
                        return self.ymd;
                    case BI.MultiDateCombo.MULTI_DATE_YEAR_CARD:
                        self.year = BI.createWidget({
                            type: "bi.yearcard"
                        });
                        self.year.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                            self._setInnerValue(self.year, v);
                        });
                        return self.year;
                    case BI.MultiDateCombo.MULTI_DATE_QUARTER_CARD:
                        self.quarter = BI.createWidget({
                            type: 'bi.quartercard'
                        });
                        self.quarter.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                            self._setInnerValue(self.quarter, v);
                        });
                        return self.quarter;
                    case BI.MultiDateCombo.MULTI_DATE_MONTH_CARD:
                        self.month = BI.createWidget({
                            type: 'bi.monthcard'
                        });
                        self.month.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                            self._setInnerValue(self.month, v);
                        });
                        return self.month;
                    case BI.MultiDateCombo.MULTI_DATE_WEEK_CARD:
                        self.week = BI.createWidget({
                            type: 'bi.weekcard'
                        });
                        self.week.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                            self._setInnerValue(self.week, v);
                        });
                        return self.week;
                    case BI.MultiDateCombo.MULTI_DATE_DAY_CARD:
                        self.day = BI.createWidget({
                            type: 'bi.daycard'
                        });
                        self.day.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                            self._setInnerValue(self.day, v);
                        });
                        return self.day;
                }
            }
        });
        this.dateTab.setSelect(BI.MultiDateCombo.MULTI_DATE_YMD_CARD);
        this.cur = BI.MultiDateCombo.MULTI_DATE_YMD_CARD;
        this.dateTab.on(BI.Tab.EVENT_CHANGE, function () {
            var v = self.dateTab.getSelect();
            switch (v) {
                case BI.MultiDateCombo.MULTI_DATE_YMD_CARD:
                    var date = this.getTab(self.cur).getCalculationValue();
                    self.ymd.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth(),
                        day: date.getDate()
                    });
                    self._setInnerValue(self.ymd);
                    break;
                case BI.MultiDateCombo.MULTI_DATE_YEAR_CARD:
                    self.year.setValue(self.storeValue);
                    self._setInnerValue(self.year);
                    break;
                case BI.MultiDateCombo.MULTI_DATE_QUARTER_CARD:
                    self.quarter.setValue(self.storeValue);
                    self._setInnerValue(self.quarter);
                    break;
                case BI.MultiDateCombo.MULTI_DATE_MONTH_CARD:
                    self.month.setValue(self.storeValue);
                    self._setInnerValue(self.month);
                    break;
                case BI.MultiDateCombo.MULTI_DATE_WEEK_CARD:
                    self.week.setValue(self.storeValue);
                    self._setInnerValue(self.week);
                    break;
                case BI.MultiDateCombo.MULTI_DATE_DAY_CARD:
                    self.day.setValue(self.storeValue);
                    self._setInnerValue(self.day);
                    break;
            }
            self.cur = v;
        });
        this.dateButton = BI.createWidget({
            type: "bi.grid",
            items: [[this.clearButton, this.textButton, this.okButton]]
        });
        BI.createWidget({
            element: this,
            type: "bi.vtape",
            items: [{
                el: this.dateTab
            }, {
                el: this.dateButton,
                height: 30
            }]
        });
    },
    _setInnerValue: function (obj) {
        if (this.dateTab.getSelect() === BI.MultiDateCombo.MULTI_DATE_YMD_CARD) {
            this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
            this.textButton.setEnable(true);
        } else {
            var date = obj.getCalculationValue();
            date = date.print("%Y-%x-%e");
            this.textButton.setValue(date);
            this.textButton.setEnable(false);
        }
    },
    setValue: function (v) {
        this.storeValue = v;
        var self = this, date;
        var type, value;
        if (BI.isNotNull(v)) {
            type = v.type || BICst.DATE_TYPE.MULTI_DATE_CALENDAR;
            value = v.value;
            if (BI.isNull(value)) {
                value = v;
            }
        }
        switch (type) {
            case BICst.DATE_TYPE.MULTI_DATE_YEAR_PREV:
            case BICst.DATE_TYPE.MULTI_DATE_YEAR_AFTER:
            case BICst.DATE_TYPE.MULTI_DATE_YEAR_BEGIN:
            case BICst.DATE_TYPE.MULTI_DATE_YEAR_END:
                this.dateTab.setSelect(BICst.MULTI_DATE_YEAR_CARD);
                this.year.setValue({type: type, value: value});
                this.cur = BICst.MULTI_DATE_YEAR_CARD;
                self._setInnerValue(this.year);
                break;
            case BICst.DATE_TYPE.MULTI_DATE_QUARTER_PREV:
            case BICst.DATE_TYPE.MULTI_DATE_QUARTER_AFTER:
            case BICst.DATE_TYPE.MULTI_DATE_QUARTER_BEGIN:
            case BICst.DATE_TYPE.MULTI_DATE_QUARTER_END:
                this.dateTab.setSelect(BICst.MULTI_DATE_QUARTER_CARD);
                this.cur = BICst.MULTI_DATE_QUARTER_CARD;
                this.quarter.setValue({type: type, value: value});
                self._setInnerValue(this.quarter);
                break;
            case BICst.DATE_TYPE.MULTI_DATE_MONTH_PREV:
            case BICst.DATE_TYPE.MULTI_DATE_MONTH_AFTER:
            case BICst.DATE_TYPE.MULTI_DATE_MONTH_BEGIN:
            case BICst.DATE_TYPE.MULTI_DATE_MONTH_END:
                this.dateTab.setSelect(BICst.MULTI_DATE_MONTH_CARD);
                this.cur = BICst.MULTI_DATE_MONTH_CARD;
                this.month.setValue({type: type, value: value});
                self._setInnerValue(this.month);
                break;
            case BICst.DATE_TYPE.MULTI_DATE_WEEK_PREV:
            case BICst.DATE_TYPE.MULTI_DATE_WEEK_AFTER:
                this.dateTab.setSelect(BICst.MULTI_DATE_WEEK_CARD);
                this.cur = BICst.MULTI_DATE_WEEK_CARD;
                this.week.setValue({type: type, value: value});
                self._setInnerValue(this.week);
                break;
            case BICst.DATE_TYPE.MULTI_DATE_DAY_PREV:
            case BICst.DATE_TYPE.MULTI_DATE_DAY_AFTER:
            case BICst.DATE_TYPE.MULTI_DATE_DAY_TODAY:
                this.dateTab.setSelect(BICst.MULTI_DATE_DAY_CARD);
                this.cur = BICst.MULTI_DATE_DAY_CARD;
                this.day.setValue({type: type, value: value});
                self._setInnerValue(this.day);
                break;
            default:
                if (BI.isNull(value) || BI.isEmptyObject(value)) {
                    var date = new Date();
                    this.dateTab.setSelect(BI.MultiDateCombo.MULTI_DATE_YMD_CARD);
                    this.ymd.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth(),
                        day: date.getDate()
                    });
                    this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                } else {
                    this.dateTab.setSelect(BI.MultiDateCombo.MULTI_DATE_YMD_CARD);
                    this.ymd.setValue(value);
                    this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                }
                this.textButton.setEnable(true);
                break;
        }
    },
    getValue: function () {
        var tab = this.dateTab.getSelect();
        switch (tab) {
            case BI.MultiDateCombo.MULTI_DATE_YMD_CARD:
                return this.ymd.getValue();
            case BI.MultiDateCombo.MULTI_DATE_YEAR_CARD:
                return this.year.getValue();
            case BI.MultiDateCombo.MULTI_DATE_QUARTER_CARD:
                return this.quarter.getValue();
            case BI.MultiDateCombo.MULTI_DATE_MONTH_CARD:
                return this.month.getValue();
            case BI.MultiDateCombo.MULTI_DATE_WEEK_CARD:
                return this.week.getValue();
            case BI.MultiDateCombo.MULTI_DATE_DAY_CARD:
                return this.day.getValue();
        }
    }
});
BI.MultiDatePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.MultiDatePopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
BI.MultiDatePopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
BI.MultiDatePopup.CALENDAR_EVENT_CHANGE = "CALENDAR_EVENT_CHANGE";
BI.shortcut('bi.multidate_popup', BI.MultiDatePopup);
