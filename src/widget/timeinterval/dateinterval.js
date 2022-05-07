/**
 * Created by Baron on 2015/10/19.
 */
BI.DateInterval = BI.inherit(BI.Single, {
    constants: {
        height: 24,
        width: 24,
        lgap: 15,
        offset: 0,
        timeErrorCls: "time-error"
    },
    _defaultConfig: function () {
        var conf = BI.DateInterval.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-date-interval",
            minDate: "1900-01-01",
            maxDate: "2099-12-31",
            height: 24,
            supportDynamic: true,
        });
    },
    _init: function () {
        var self = this, o = this.options;
        BI.DateInterval.superclass._init.apply(this, arguments);

        o.value = o.value || {};
        this.left = this._createCombo(o.value.start);
        this.right = this._createCombo(o.value.end);
        this.label = BI.createWidget({
            type: "bi.label",
            height: o.height,
            width: this.constants.width,
            text: "-"
        });
        BI.createWidget({
            element: self,
            type: "bi.center",
            height: o.height,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: self.left,
                    left: this.constants.offset,
                    right: this.constants.width / 2,
                    top: 0,
                    bottom: 0
                }]
            }, {
                type: "bi.absolute",
                items: [{
                    el: self.right,
                    left: this.constants.width / 2,
                    right: this.constants.offset,
                    top: 0,
                    bottom: 0
                }]
            }]
        });
        BI.createWidget({
            type: "bi.horizontal_auto",
            element: this,
            items: [
                self.label
            ]
        });
    },

    _createCombo: function (v) {
        var self = this, o = this.options;
        var combo = BI.createWidget({
            type: "bi.dynamic_date_combo",
            supportDynamic: o.supportDynamic,
            minDate: o.minDate,
            maxDate: o.maxDate,
            behaviors: o.behaviors,
            watermark: o.watermark,
            value: v,
            height: o.height,
            listeners: [{
                eventName: BI.DynamicDateCombo.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW,
                action: function () {
                    self.fireEvent(BI.DateInterval.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW);
                }
            }]
        });
        combo.on(BI.DynamicDateCombo.EVENT_ERROR, function () {
            self._clearTitle();
            BI.Bubbles.hide("error");
            self.element.removeClass(self.constants.timeErrorCls);
            self.fireEvent(BI.DateInterval.EVENT_ERROR);
        });

        combo.on(BI.DynamicDateCombo.EVENT_VALID, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.DateInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.DynamicDateCombo.EVENT_FOCUS, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.DateInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        // combo.on(BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW, function () {
        //     self.left.hidePopupView();
        //     self.right.hidePopupView();
        // });

        combo.on(BI.DynamicDateCombo.EVENT_CONFIRM, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                self.fireEvent(BI.DateInterval.EVENT_ERROR);
            }else{
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
                self.fireEvent(BI.DateInterval.EVENT_CHANGE);
            }
        });
        return combo;
    },
    _dateCheck: function (date) {
        return BI.print(BI.parseDateTime(date, "%Y-%x-%d"), "%Y-%x-%d") === date ||
            BI.print(BI.parseDateTime(date, "%Y-%X-%d"), "%Y-%X-%d") === date ||
            BI.print(BI.parseDateTime(date, "%Y-%x-%e"), "%Y-%x-%e") === date ||
            BI.print(BI.parseDateTime(date, "%Y-%X-%e"), "%Y-%X-%e") === date;
    },
    _checkVoid: function (obj) {
        var o = this.options;
        return !BI.checkDateVoid(obj.year, obj.month, obj.day, o.minDate, o.maxDate)[0];
    },
    _check: function (smallDate, bigDate) {
        var smallObj = smallDate.match(/\d+/g), bigObj = bigDate.match(/\d+/g);
        return this._dateCheck(smallDate) && BI.checkDateLegal(smallDate) && this._checkVoid({
            year: smallObj[0],
            month: smallObj[1],
            day: smallObj[2]
        }) && this._dateCheck(bigDate) && BI.checkDateLegal(bigDate) && this._checkVoid({
            year: bigObj[0],
            month: bigObj[1],
            day: bigObj[2]
        });
    },
    _compare: function (smallDate, bigDate) {
        smallDate = BI.print(BI.parseDateTime(smallDate, "%Y-%X-%d"), "%Y-%X-%d");
        bigDate = BI.print(BI.parseDateTime(bigDate, "%Y-%X-%d"), "%Y-%X-%d");
        return BI.isNotNull(smallDate) && BI.isNotNull(bigDate) && smallDate > bigDate;
    },
    _setTitle: function (v) {
        this.left.setTitle(v);
        this.right.setTitle(v);
        this.label.setTitle(v);
    },
    _clearTitle: function () {
        this.left.setTitle("");
        this.right.setTitle("");
        this.label.setTitle("");
    },

    setMinDate: function (minDate) {
        var o = this.options;
        o.minDate = minDate;
        this.left.setMinDate(minDate);
        this.right.setMinDate(minDate);
    },

    setMaxDate: function (maxDate) {
        var o = this.options;
        o.maxDate = maxDate;
        this.left.setMaxDate(maxDate);
        this.right.setMaxDate(maxDate);
    },

    setValue: function (date) {
        date = date || {};
        this.left.setValue(date.start);
        this.right.setValue(date.end);
    },
    getValue: function () {
        return {start: this.left.getValue(), end: this.right.getValue()};
    }
});
BI.DateInterval.EVENT_VALID = "EVENT_VALID";
BI.DateInterval.EVENT_ERROR = "EVENT_ERROR";
BI.DateInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateInterval.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW = "EVENT_BEFORE_YEAR_MONTH_POPUPVIEW";
BI.shortcut("bi.date_interval", BI.DateInterval);
