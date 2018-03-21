/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.YearCard
 * @extends BI.Trigger
 */
BI.DynamicYearMonthCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-month-card"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
                textAlign: "left",
                height: 24
            }, {
                type: "bi.dynamic_date_param_item",
                ref: function () {
                    self.year = this;
                },
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }, {
                type: "bi.dynamic_date_param_item",
                dateType: BI.DynamicDateCard.TYPE.MONTH,
                ref: function () {
                    self.month = this;
                },
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }],
            vgap: 10,
            hgap: 10
        };
    },

    _createValue: function (type, v) {
        return {
            dateType: type,
            value: Math.abs(v),
            offset: v > 0 ? 1 : 0
        };
    },

    setValue: function (v) {
        v = v || {year: 0, month: 0};
        this.year.setValue(this._createValue(BI.DynamicDateCard.TYPE.YEAR, v.year));
        this.month.setValue(this._createValue(BI.DynamicDateCard.TYPE.MONTH, v.month));
    },

    getValue: function () {
        var year = this.year.getValue();
        var month = this.month.getValue();
        return {
            year: (year.offset === 0 ? -year.value : year.value),
            month: (month.offset === 0 ? -month.value : month.value)
        };
    }
});
BI.DynamicYearMonthCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_month_card", BI.DynamicYearMonthCard);