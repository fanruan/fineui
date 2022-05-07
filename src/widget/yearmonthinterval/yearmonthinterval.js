BI.YearMonthInterval = BI.inherit(BI.Single, {
    constants: {
        width: 25,
        lgap: 15,
        offset: -15,
        timeErrorCls: "time-error"
    },

    props: {
        extraCls: "bi-year-month-interval",
        minDate: "1900-01-01",
        maxDate: "2099-12-31",
        supportDynamic: true,
        height: 24
    },

    _init: function () {
        var self = this, o = this.options;
        BI.YearMonthInterval.superclass._init.apply(this, arguments);

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
            hgap: 15,
            height: o.height,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: self.left,
                    left: this.constants.offset,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            }, {
                type: "bi.absolute",
                items: [{
                    el: self.right,
                    left: 0,
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
            type: "bi.dynamic_year_month_combo",
            supportDynamic: o.supportDynamic,
            height: o.height,
            minDate: o.minDate,
            maxDate: o.maxDate,
            behaviors: o.behaviors,
            value: v,
            listeners: [{
                eventName: BI.DynamicYearMonthCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.fireEvent(BI.YearMonthInterval.EVENT_BEFORE_POPUPVIEW);
                }
            }]
        });
        combo.on(BI.DynamicYearMonthCombo.EVENT_ERROR, function () {
            self._clearTitle();
            BI.Bubbles.hide("error");
            self.element.removeClass(self.constants.timeErrorCls);
            self.fireEvent(BI.YearMonthInterval.EVENT_ERROR);
        });

        combo.on(BI.DynamicYearMonthCombo.EVENT_VALID, function () {
            self._checkValid();
        });

        combo.on(BI.DynamicYearMonthCombo.EVENT_FOCUS, function () {
            self._checkValid();
        });

        combo.on(BI.DynamicYearMonthCombo.EVENT_CONFIRM, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self.left.isStateValid() && self.right.isStateValid() && self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                self.fireEvent(BI.YearMonthInterval.EVENT_ERROR);
            }else{
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
                self.fireEvent(BI.YearMonthInterval.EVENT_CHANGE);
            }
        });
        return combo;
    },


    _dateCheck: function (date) {
        return BI.print(BI.parseDateTime(date, "%Y-%x"), "%Y-%x") === date || BI.print(BI.parseDateTime(date, "%Y-%X"), "%Y-%X") === date;
    },


    // 判是否在最大最小之间
    _checkVoid: function (obj) {
        var o = this.options;
        return !BI.checkDateVoid(obj.year, obj.month, 1, o.minDate, o.maxDate)[0];
    },

    // 判格式合法
    _check: function (smallDate, bigDate) {
        var smallObj = smallDate.match(/\d+/g), bigObj = bigDate.match(/\d+/g);

        var smallDate4Check = "";
        if (BI.isNotNull(smallObj)) {
            smallDate4Check = (smallObj[0] || "") + "-" + (smallObj[1] || 1);
        }

        var bigDate4Check = "";
        if (BI.isNotNull(bigObj)) {
            bigDate4Check = (bigObj[0] || "") + "-" + (bigObj[1] || 1);
        }

        return this._dateCheck(smallDate4Check) && BI.checkDateLegal(smallDate4Check) && this._checkVoid({
            year: smallObj[0],
            month: smallObj[1] || 1,
            day: 1
        }) && this._dateCheck(bigDate4Check) && BI.checkDateLegal(bigDate4Check) && this._checkVoid({
            year: bigObj[0],
            month: bigObj[1] || 1,
            day: 1
        });
    },

    _compare: function (smallDate, bigDate) {
        smallDate = BI.print(BI.parseDateTime(smallDate, "%Y-%X"), "%Y-%X");
        bigDate = BI.print(BI.parseDateTime(bigDate, "%Y-%X"), "%Y-%X");
        return BI.isNotNull(smallDate) && BI.isNotNull(bigDate) && smallDate > bigDate;
    },
    _setTitle: function (v) {
        this.setTitle(v);
    },
    _clearTitle: function () {
        this.setTitle("");
    },
    _checkValid: function () {
        var self = this;

        BI.Bubbles.hide("error");
        var smallDate = self.left.getKey(), bigDate = self.right.getKey();
        if (self.left.isValid() && self.right.isValid() && self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
            self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
            self.element.addClass(self.constants.timeErrorCls);
            BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                offsetStyle: "center"
            });
            self.fireEvent(BI.YearMonthInterval.EVENT_ERROR);
        } else {
            self._clearTitle();
            self.element.removeClass(self.constants.timeErrorCls);
        }
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

        this._checkValid();
    },
    getValue: function () {
        return {start: this.left.getValue(), end: this.right.getValue()};
    }
});
BI.YearMonthInterval.EVENT_VALID = "EVENT_VALID";
BI.YearMonthInterval.EVENT_ERROR = "EVENT_ERROR";
BI.YearMonthInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.YearMonthInterval.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.year_month_interval", BI.YearMonthInterval);
