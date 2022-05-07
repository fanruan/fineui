/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/1/25
 */
BI.YearInterval = BI.inherit(BI.Single, {
    constants: {
        height: 24,
        width: 25,
        lgap: 15,
        offset: -15,
        timeErrorCls: "time-error"
    },

    props: {
        extraCls: "bi-year-interval",
        minDate: "1900-01-01",
        maxDate: "2099-12-31",
        supportDynamic: true,
    },

    render: function () {
        var self = this, o = this.options;

        o.value = o.value || {};
        this.left = this._createCombo(o.value.start);
        this.right = this._createCombo(o.value.end);

        return [{
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
        }, {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.label",
                height: o.height,
                width: this.constants.width,
                text: "-",
                ref: function (_ref) {
                    self.label = _ref;
                }
            }]
        }]
    },

    _createCombo: function (v) {
        var self = this, o = this.options;
        var combo = BI.createWidget({
            type: "bi.dynamic_year_combo",
            supportDynamic: o.supportDynamic,
            minDate: o.minDate,
            maxDate: o.maxDate,
            height: o.height,
            behaviors: o.behaviors,
            value: v,
            listeners: [{
                eventName: BI.DynamicYearCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.fireEvent(BI.YearInterval.EVENT_BEFORE_POPUPVIEW);
                }
            }]
        });
        combo.on(BI.DynamicYearCombo.EVENT_ERROR, function () {
            self._clearTitle();
            BI.Bubbles.hide("error");
            self.element.removeClass(self.constants.timeErrorCls);
            self.fireEvent(BI.YearInterval.EVENT_ERROR);
        });

        combo.on(BI.DynamicYearCombo.EVENT_VALID, function () {
            self._checkValid();
        });

        combo.on(BI.DynamicYearCombo.EVENT_FOCUS, function () {
            self._checkValid();
        });

        combo.on(BI.DynamicYearCombo.EVENT_CONFIRM, function () {
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self.left.isStateValid() && self.right.isStateValid() && self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                self.fireEvent(BI.YearInterval.EVENT_ERROR);
            }else{
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
                self.fireEvent(BI.YearInterval.EVENT_CHANGE);
            }
        });
        return combo;
    },


    _dateCheck: function (date) {
        return BI.print(BI.parseDateTime(date, "%Y"), "%Y") === date || BI.print(BI.parseDateTime(date, "%Y"), "%Y") === date;
    },


    // 判是否在最大最小之间
    _checkVoid: function (obj) {
        var o = this.options;
        return !BI.checkDateVoid(obj.year, 1, 1, o.minDate, o.maxDate)[0];
    },

    // 判格式合法
    _check: function (smallDate, bigDate) {
        var smallObj = smallDate.match(/\d+/g), bigObj = bigDate.match(/\d+/g);

        var smallDate4Check = "";
        if (BI.isNotNull(smallObj)) {
            smallDate4Check = smallObj[0] || "";
        }

        var bigDate4Check = "";
        if (BI.isNotNull(bigObj)) {
            bigDate4Check = bigObj[0] || "";
        }

        return this._dateCheck(smallDate4Check) && BI.checkDateLegal(smallDate4Check) && this._checkVoid({
            year: smallObj[0],
            month: 1,
            day: 1
        }) && this._dateCheck(bigDate4Check) && BI.checkDateLegal(bigDate4Check) && this._checkVoid({
            year: bigObj[0],
            month: 12,
            day: 1
        });
    },

    _compare: function (smallDate, bigDate) {
        smallDate = BI.print(BI.parseDateTime(smallDate, "%Y"), "%Y");
        bigDate = BI.print(BI.parseDateTime(bigDate, "%Y"), "%Y");
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
            self.fireEvent(BI.YearInterval.EVENT_ERROR);
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
BI.YearInterval.EVENT_VALID = "EVENT_VALID";
BI.YearInterval.EVENT_ERROR = "EVENT_ERROR";
BI.YearInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.YearInterval.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.year_interval", BI.YearInterval);