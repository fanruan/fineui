BI.StaticYearMonthCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-static-year-month-card",
        behaviors: {}
    },

    _createMonths: function () {
        var self = this;
        // 纵向排列月
        var month = [1, 7, 2, 8, 3, 9, 4, 10, 5, 11, 6, 12];
        var items = [];
        items.push(month.slice(0, 2));
        items.push(month.slice(2, 4));
        items.push(month.slice(4, 6));
        items.push(month.slice(6, 8));
        items.push(month.slice(8, 10));
        items.push(month.slice(10, 12));
        return BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return {
                    type: "bi.text_item",
                    cls: "bi-list-item-select",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    once: false,
                    forceSelected: true,
                    height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT - 1,
                    width: 38,
                    value: td,
                    text: td,
                    ref: function (_ref) {
                        self.monthMap[j === 0 ? i : i + 6] = _ref;
                    }
                };
            });
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.monthMap = {};
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.year_picker",
                cls: "bi-split-bottom",
                min: o.min,
                max: o.max,
                ref: function () {
                    self.yearPicker = this;
                },
                behaviors: o.behaviors,
                height: 30,
                listeners: [{
                    eventName: BI.YearPicker.EVENT_CHANGE,
                    action: function () {
                        var value = this.getValue();
                        self._checkMonthStatus(value);
                        self.setValue({
                            year: value,
                            month: self.selectedMonth
                        });
                    }
                }]
            }, {
                el: {
                    type: "bi.button_group",
                    behaviors: o.behaviors,
                    ref: function () {
                        self.month = this;
                    },
                    items: this._createMonths(),
                    layouts: [BI.LogicFactory.createLogic("table", BI.extend({
                        dynamic: true
                    }, {
                        columns: 2,
                        rows: 6,
                        columnSize: [1 / 2, 1 / 2],
                        rowSize: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT + 1
                    })), {
                        type: "bi.center_adapt",
                        vgap: 1,
                        hgap: 2
                    }],
                    value: o.value,
                    listeners: [{
                        eventName: BI.ButtonGroup.EVENT_CHANGE,
                        action: function () {
                            self.selectedYear = self.yearPicker.getValue();
                            self.selectedMonth = this.getValue()[0];
                            self.fireEvent(BI.StaticYearMonthCard.EVENT_CHANGE);
                        }
                    }]
                },
                vgap: 5
            }]
        };
    },

    created: function() {
        this._checkMonthStatus(this.selectedYear);
    },

    _checkMonthStatus: function (year) {
        var o = this.options;
        var minDate = BI.parseDateTime(o.min, "%Y-%X-%d"), maxDate = BI.parseDateTime(o.max, "%Y-%X-%d");
        var minYear = minDate.getFullYear(), maxYear = maxDate.getFullYear();
        var minMonth = 0; var maxMonth = 11;
        minYear === year && (minMonth = minDate.getMonth());
        maxYear === year && (maxMonth = maxDate.getMonth());
        var yearInvalid = year < minYear || year > maxYear;
        BI.each(this.monthMap, function (month, obj) {
            var monthInvalid = month < minMonth || month > maxMonth;
            obj.setEnable(!yearInvalid && !monthInvalid);
        });
    },

    setMinDate: function (minDate) {
        if (this.options.min !== minDate) {
            this.options.min = minDate;
            this.yearPicker.setMinDate(minDate);
            this._checkMonthStatus(this.selectedYear);
        }
    },

    setMaxDate: function (maxDate) {
        if (this.options.max !== maxDate) {
            this.options.max = maxDate;
            this.yearPicker.setMaxDate(maxDate);
            this._checkMonthStatus(this.selectedYear);
        }
    },

    getValue: function () {
        return {
            year: this.selectedYear,
            month: this.selectedMonth
        };
    },

    setValue: function (obj) {
        var o = this.options;
        var newObj = {};
        newObj.year = obj.year || 0;
        newObj.month = obj.month || 0;
        if (newObj.year === 0 || newObj.month === 0 || BI.checkDateVoid(newObj.year, newObj.month, 1, o.min, o.max)[0]) {
            var year = newObj.year || BI.getDate().getFullYear();
            this.selectedYear = year;
            this.selectedMonth = "";
            this.yearPicker.setValue(year);
            this.month.setValue();
        } else {
            this.selectedYear = BI.parseInt(newObj.year);
            this.selectedMonth = BI.parseInt(newObj.month);
            this.yearPicker.setValue(this.selectedYear);
            this.month.setValue(this.selectedMonth);
        }
        this._checkMonthStatus(this.selectedYear);
    }
});
BI.StaticYearMonthCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_year_month_card", BI.StaticYearMonthCard);
