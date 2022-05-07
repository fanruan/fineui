/**
 * Created by GUY on 2015/8/28.
 * @class BI.Calendar
 * @extends BI.Widget
 */
BI.Calendar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.Calendar.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-calendar",
            logic: {
                dynamic: false
            },
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            year: 2015,
            month: 8,
            day: 25
        });
    },

    _dateCreator: function (Y, M, D) {
        var self = this, o = this.options, log = {}, De = BI.getDate();
        var mins = o.min.match(/\d+/g);
        var maxs = o.max.match(/\d+/g);

        De.setFullYear(Y, M, D);
        log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];

        var MD = BI.Date._MD.slice(0);
        MD[1] = BI.isLeapYear(log.ymd[0]) ? 29 : 28;

        // 日期所在月第一天
        De.setFullYear(log.ymd[0], log.ymd[1], 1);
        // 是周几
        log.FDay = De.getDay();

        // 当前BI.StartOfWeek与周日对齐后的FDay是周几
        var offSetFDay = (7 - BI.StartOfWeek + log.FDay) % 7;

        // 当前月页第一天是几号
        log.PDay = MD[M === 0 ? 11 : M - 1] - offSetFDay + 1;
        log.NDay = 1;

        var items = [];
        BI.each(BI.range(42), function (i) {
            var td = {}, YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
            // 上个月的日期
            if (i < offSetFDay) {
                td.lastMonth = true;
                DD = i + log.PDay;
                // 上一年
                MM === 1 && (YY -= 1);
                MM = MM === 1 ? 12 : MM - 1;
            } else if (i >= offSetFDay && i < offSetFDay + MD[log.ymd[1]]) {
                DD = i - offSetFDay + 1;
                if (i - offSetFDay + 1 === log.ymd[2]) {
                    td.currentDay = true;
                }
            } else {
                td.nextMonth = true;
                DD = log.NDay++;
                MM === 12 && (YY += 1);
                MM = MM === 12 ? 1 : MM + 1;
            }
            if (BI.checkDateVoid(YY, MM, DD, mins, maxs)[0]) {
                td.disabled = true;
            }
            td.text = DD;
            items.push(td);
        });
        return items;
    },

    _init: function () {
        BI.Calendar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.map(this._getWeekLabel(), function (i, value) {
            return {
                type: "bi.label",
                height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
                text: value
            };
        });
        var title = BI.createWidget({
            type: "bi.button_group",
            height: 44,
            items: items,
            layouts: [{
                type: "bi.center",
                hgap: 5,
                vgap: 10
            }]
        });

        this.days = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(this._getItems(), {}),
            value: o.year + "-" + o.month + "-" + o.day,
            layouts: [BI.LogicFactory.createLogic("table", BI.extend({}, o.logic, {
                columns: 7,
                rows: 6,
                columnSize: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7],
                rowSize: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT + 8
            }))]
        });
        this.days.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        BI.createWidget(BI.extend({
            element: this

        }, BI.LogicFactory.createLogic("vertical", BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", title, {
                el: this.days,
                tgap: -5
            })
        }))));
    },

    _getWeekLabel: function () {
        return BI.map(BI.range(0, 7), function (idx, v) {
            return BI.Date._SDN[(v + BI.StartOfWeek) % 7];
        });
    },

    isFrontDate: function () {
        var o = this.options, c = this._const;
        var Y = o.year, M = o.month, De = BI.getDate(), day = De.getDay();
        Y = Y | 0;
        De.setFullYear(Y, M, 1);
        var newDate = BI.getOffsetDate(De, -1 * (day + 1));
        return !!BI.checkDateVoid(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), o.min, o.max)[0];
    },

    isFinalDate: function () {
        var o = this.options, c = this._const;
        var Y = o.year, M = o.month, De = BI.getDate(), day = De.getDay();
        Y = Y | 0;
        De.setFullYear(Y, M, 1);
        var newDate = BI.getOffsetDate(De, 42 - day);
        return !!BI.checkDateVoid(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), o.min, o.max)[0];
    },

    _getItems: function () {
        var o = this.options;
        var days = this._dateCreator(o.year, o.month - 1, o.day);
        var items = [];
        items.push(days.slice(0, 7));
        items.push(days.slice(7, 14));
        items.push(days.slice(14, 21));
        items.push(days.slice(21, 28));
        items.push(days.slice(28, 35));
        items.push(days.slice(35, 42));

        return BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                var month = td.lastMonth ? o.month - 1 : (td.nextMonth ? o.month + 1 : o.month);
                return BI.extend(td, {
                    type: "bi.calendar_date_item",
                    textAlign: "center",
                    whiteSpace: "normal",
                    once: false,
                    forceSelected: true,
                    value: o.year + "-" + month + "-" + td.text,
                    disabled: td.lastMonth || td.nextMonth || td.disabled,
                    lgap: 2,
                    rgap: 2,
                    tgap: 4,
                    bgap: 4
                    // selected: td.currentDay
                });
            });
        });
    },

    _populate: function() {
        this.days.populate(this._getItems());
    },

    setMinDate: function (minDate) {
        var o = this.options;
        if (BI.isNotEmptyString(o.min)) {
            o.min = minDate;
            this._populate();
        }
    },

    setMaxDate: function (maxDate) {
        var o = this.options;
        if (BI.isNotEmptyString(o.max)) {
            o.max = maxDate;
            this._populate();
        }
    },

    setValue: function (ob) {
        this.days.setValue([ob.year + "-" + ob.month + "-" + ob.day]);
    },

    getValue: function () {
        var date = this.days.getValue()[0].match(/\d+/g);
        return {
            year: date[0] | 0,
            month: date[1] | 0,
            day: date[2] | 0
        };
    }
});

BI.extend(BI.Calendar, {
    getPageByDateJSON: function (json) {
        var year = BI.getDate().getFullYear();
        var month = BI.getDate().getMonth();
        var page = (json.year - year) * 12;
        page += json.month - 1 - month;
        return page;
    },
    getDateJSONByPage: function (v) {
        var months = BI.getDate().getMonth();
        var page = v;

        // 对当前page做偏移,使到当前年初
        page = page + months;

        var year = BI.parseInt(page / 12);
        if(page < 0 && page % 12 !== 0) {
            year--;
        }
        var month = page >= 0 ? (page % 12) : ((12 + page % 12) % 12);
        return {
            year: BI.getDate().getFullYear() + year,
            month: month + 1
        };
    }
});

BI.shortcut("bi.calendar", BI.Calendar);
