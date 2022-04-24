BI.StaticYearQuarterCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-static-year-quarter-card",
        behaviors: {}
    },

    _createQuarter: function () {
        var self = this;
        var items = [{
            text: BI.Date._QN[1],
            value: 1
        }, {
            text: BI.Date._QN[2],
            value: 2
        }, {
            text: BI.Date._QN[3],
            value: 3
        }, {
            text: BI.Date._QN[4],
            value: 4
        }];
        return BI.map(items, function (j, item) {
            return BI.extend(item, {
                type: "bi.text_item",
                cls: "bi-border-radius bi-list-item-select",
                textAlign: "center",
                whiteSpace: "nowrap",
                once: false,
                forceSelected: true,
                height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT,
                ref: function (_ref) {
                    self.quarterMap[j + 1] = _ref;
                }
            });
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.quarterMap = {};
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.year_picker",
                cls: "bi-split-bottom",
                ref: function () {
                    self.yearPicker = this;
                },
                min: o.min,
                max: o.max,
                behaviors: o.behaviors,
                height: 30,
                listeners: [{
                    eventName: BI.YearPicker.EVENT_CHANGE,
                    action: function () {
                        var value = this.getValue();
                        self._checkQuarterStatus(value);
                        self.setValue({
                            year: value,
                            quarter: self.selectedQuarter
                        });
                    }
                }]
            }, {
                el: {
                    type: "bi.button_group",
                    behaviors: o.behaviors,
                    ref: function () {
                        self.quarter = this;
                    },
                    items: this._createQuarter(),
                    layouts: [{
                        type: "bi.vertical",
                        vgap: 10,
                        hgap: 12,
                    }],
                    value: o.value,
                    listeners: [{
                        eventName: BI.ButtonGroup.EVENT_CHANGE,
                        action: function () {
                            self.selectedYear = self.yearPicker.getValue();
                            self.selectedQuarter = this.getValue()[0];
                            self.fireEvent(BI.StaticYearQuarterCard.EVENT_CHANGE);
                        }
                    }]
                },
                vgap: 5
            }]
        };
    },

    _checkQuarterStatus: function (year) {
        var o = this.options;
        var minDate = BI.parseDateTime(o.min, "%Y-%X-%d"), maxDate = BI.parseDateTime(o.max, "%Y-%X-%d");
        var minYear = minDate.getFullYear(), maxYear = maxDate.getFullYear();
        var minQuarter = 1; var maxQuarter = 4;
        minYear === year && (minQuarter = BI.parseInt(BI.getQuarter(minDate)));
        maxYear === year && (maxQuarter = BI.parseInt(BI.getQuarter(maxDate)));
        var yearInvalid = year < minYear || year > maxYear;
        BI.each(this.quarterMap, function (quarter, obj) {
            var quarterInvalid = quarter < minQuarter || quarter > maxQuarter;
            obj.setEnable(!yearInvalid && !quarterInvalid);
        });
    },

    setMinDate: function (minDate) {
        if (this.options.min !== minDate) {
            this.options.min = minDate;
            this.yearPicker.setMinDate(minDate);
            this._checkQuarterStatus(this.selectedYear);
        }
    },

    setMaxDate: function (maxDate) {
        if (this.options.max !== maxDate) {
            this.options.max = maxDate;
            this.yearPicker.setMaxDate(maxDate);
            this._checkQuarterStatus(this.selectedYear);
        }
    },


    getValue: function () {
        return {
            year: this.selectedYear,
            quarter: this.selectedQuarter
        };
    },

    setValue: function (obj) {
        var o = this.options;
        var newObj = {};
        newObj.year = obj.year || 0;
        newObj.quarter = obj.quarter || 0;
        if (newObj.quarter === 0 || newObj.year === 0 || BI.checkDateVoid(newObj.year, newObj.quarter, 1, o.min, o.max)[0]) {
            var year = newObj.year || BI.getDate().getFullYear();
            this.selectedYear = year;
            this.selectedQuarter = "";
            this.yearPicker.setValue(year);
            this.quarter.setValue();
        } else {
            this.selectedYear = BI.parseInt(newObj.year);
            this.selectedQuarter = BI.parseInt(newObj.quarter);
            this.yearPicker.setValue(this.selectedYear);
            this.quarter.setValue(this.selectedQuarter);
        }
        this._checkQuarterStatus(this.selectedYear);
    }
});
BI.StaticYearQuarterCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_year_quarter_card", BI.StaticYearQuarterCard);
