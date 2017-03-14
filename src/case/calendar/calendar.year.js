/**
 * Created by GUY on 2015/8/28.
 * @class BI.YearCalendar
 * @extends BI.Widget
 */
BI.YearCalendar = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        var conf = BI.YearCalendar.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-year-calendar",
            logic: {
                dynamic: false
            },
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            year: null
        })
    },

    _yearCreator: function (Y) {
        var o = this.options;
        Y = Y | 0;
        var start = BI.YearCalendar.getStartYear(Y);
        var items = [];
        BI.each(BI.range(BI.YearCalendar.INTERVAL), function (i) {
            var td = {};
            if (Date.checkVoid(start + i, 1, 1, o.min, o.max)[0]) {
                td.disabled = true;
            }
            td.text = start + i;
            items.push(td);
        });
        return items;
    },

    _init: function () {
        BI.YearCalendar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.currentYear = new Date().getFullYear();
        var years = this._yearCreator(o.year || this.currentYear);

        //纵向排列年
        var len = years.length, tyears = BI.makeArray(len, "");
        var map = [0, 6, 1, 7, 2, 8, 3, 9, 4, 10, 5, 11];
        BI.each(years, function (i, y) {
            tyears[i] = years[map[i]];
        });
        var items = [];
        items.push(tyears.slice(0, 2));
        items.push(tyears.slice(2, 4));
        items.push(tyears.slice(4, 6));
        items.push(tyears.slice(6, 8));
        items.push(tyears.slice(8, 10));
        items.push(tyears.slice(10, 12));

        items = BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return BI.extend(td, {
                    type: "bi.text_item",
                    cls: "bi-list-item-active",
                    textAlign: "center",
                    whiteSpace: "normal",
                    once: false,
                    forceSelected: true,
                    height: 23,
                    width: 38,
                    value: td.text,
                    disabled: td.disabled
                });
            });
        });

        this.years = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(items, {}),
            layouts: [BI.LogicFactory.createLogic("table", BI.extend({}, o.logic, {
                columns: 2,
                rows: 6,
                columnSize: [1 / 2, 1 / 2],
                rowSize: 25
            })), {
                type: "bi.center_adapt",
                vgap: 1
            }]
        });
        this.years.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        BI.createWidget(BI.extend({
            element: this.element

        }, BI.LogicFactory.createLogic("vertical", BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", this.years)
        }))));
    },

    isFrontYear: function () {
        var o = this.options;
        var Y = o.year;
        Y = Y | 0;
        return !!Date.checkVoid(BI.YearCalendar.getStartYear(Y) - 1, 1, 1, o.min, o.max)[0];
    },

    isFinalYear: function () {
        var o = this.options, c = this._const;
        var Y = o.year;
        Y = Y | 0;
        return !!Date.checkVoid(BI.YearCalendar.getEndYear(Y) + 1, 1, 1, o.min, o.max)[0];
    },

    setValue: function (val) {
        this.years.setValue([val]);
    },

    getValue: function () {
        return this.years.getValue()[0];
    }
});
//类方法
BI.extend(BI.YearCalendar, {
    INTERVAL: 12,

    //获取显示的第一年
    getStartYear: function (year) {
        var cur = new Date().getFullYear();
        return year - ((year - cur + 3) % BI.YearCalendar.INTERVAL + 12) % BI.YearCalendar.INTERVAL;
    },

    getEndYear: function (year) {
        return BI.YearCalendar.getStartYear(year) + BI.YearCalendar.INTERVAL;
    },

    getPageByYear: function (year) {
        var cur = new Date().getFullYear();
        year = BI.YearCalendar.getStartYear(year);
        return (year - cur + 3) / BI.YearCalendar.INTERVAL;
    }
});

$.shortcut("bi.year_calendar", BI.YearCalendar);