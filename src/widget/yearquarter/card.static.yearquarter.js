BI.StaticYearQuarterCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-static-year-quarter-card",
        behaviors: {}
    },

    _createQuarter: function () {

        var items = [{
            text: Date._QN[1],
            value: 1
        }, {
            text: Date._QN[2],
            value: 2
        }, {
            text: Date._QN[3],
            value: 3
        }, {
            text: Date._QN[4],
            value: 4
        }];
        return BI.map(items, function (j, item) {
            return BI.extend(item, {
                type: "bi.text_item",
                cls: "bi-list-item-active",
                textAlign: "center",
                whiteSpace: "nowrap",
                once: false,
                forceSelected: true,
                height: 24
            });
        });
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.year_picker",
                ref: function () {
                    self.yearPicker = this;
                },
                height: 30,
                listeners: [{
                    eventName: BI.YearPicker.EVENT_CHANGE,
                    action: function () {
                        var value = this.getValue();
                        self.setValue({
                            year: value,
                            quarter: self.selectedQuarter
                        });
                    }
                }]
            }, {
                type: "bi.button_group",
                behaviors: o.behaviors,
                ref: function () {
                    self.quarter = this;
                },
                items: this._createQuarter(),
                layouts: [{
                    type: "bi.vertical",
                    vgap: 10
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
            }]
        };
    },


    getValue: function () {
        return {
            year: this.selectedYear,
            quarter: this.selectedQuarter
        };
    },

    setValue: function (obj) {
        var o = this.options;
        obj = obj || {};
        obj.year = obj.year || 0;
        obj.quarter = obj.quarter || 0;
        if (obj.quarter === 0 || obj.year === 0 || BI.checkDateVoid(obj.year, obj.quarter, 1, o.min, o.max)[0]) {
            var year = BI.getDate().getFullYear();
            this.selectedYear = year;
            this.selectedQuarter = "";
            this.yearPicker.setValue(year);
            this.quarter.setValue();
        } else {
            this.selectedYear = BI.parseInt(obj.year);
            this.selectedQuarter = BI.parseInt(obj.quarter);
            this.yearPicker.setValue(this.selectedYear);
            this.quarter.setValue(this.selectedQuarter);
        }
    }
});
BI.StaticYearQuarterCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_year_quarter_card", BI.StaticYearQuarterCard);