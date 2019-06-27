BI.StaticYearMonthCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-static-year-month-card",
        behaviors: {}
    },

    _createMonths: function () {
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
                    height: 30,
                    width: 38,
                    value: td,
                    text: td
                };
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
                behaviors: o.behaviors,
                height: 30,
                listeners: [{
                    eventName: BI.YearPicker.EVENT_CHANGE,
                    action: function () {
                        var value = this.getValue();
                        self.setValue({
                            year: value,
                            month: self.selectedMonth
                        });
                    }
                }]
            }, {
                type: "bi.button_group",
                cls: "bi-split-top",
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
                    rowSize: 30
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
            }]
        };
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
    }
});
BI.StaticYearMonthCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_year_month_card", BI.StaticYearMonthCard);
