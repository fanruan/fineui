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
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            year: 2015,
            month: 7,  //7表示八月
            day: 25
        })
    },

    _dateCreator: function (Y, M, D) {
        var self = this, o = this.options, log = {}, De = new Date();
        var mins = o.min.match(/\d+/g);
        var maxs = o.max.match(/\d+/g);
        Y < (mins[0] | 0) && (Y = (mins[0] | 0));
        Y > (maxs[0] | 0) && (Y = (maxs[0] | 0));

        De.setFullYear(Y, M, D);
        log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];

        Date._MD[1] = Date.isLeap(log.ymd[0]) ? 29 : 28;

        De.setFullYear(log.ymd[0], log.ymd[1], 1);
        log.FDay = De.getDay();

        log.PDay = Date._MD[M === 0 ? 11 : M - 1] - log.FDay + 1;
        log.NDay = 1;

        var items = [];
        BI.each(BI.range(42), function (i) {
            var td = {}, YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
            if (i < log.FDay) {
                td.lastMonth = true;
                DD = i + log.PDay;
                MM === 1 && (YY -= 1);
                MM = MM === 1 ? 12 : MM - 1;
            } else if (i >= log.FDay && i < log.FDay + Date._MD[log.ymd[1]]) {
                DD = i - log.FDay + 1;
                if (i - log.FDay + 1 === log.ymd[2]) {
                    td.currentDay = true;
                }
            } else {
                td.nextMonth = true;
                DD = log.NDay++;
                MM === 12 && (YY += 1);
                MM = MM === 12 ? 1 : MM + 1;
            }
            if (Date.checkVoid(YY, MM, DD, mins, maxs)[0]) {
                td.disabled = true;
            }
            td.text = DD;
            items.push(td);
        })
        return items;
    },

    _init: function () {
        BI.Calendar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.map(Date._SDN.slice(0, 7), function (i, value) {
            return {
                type: "bi.label",
                height: 25,
                text: value
            }
        })
        var title = BI.createWidget({
            type: "bi.button_group",
            height: 25,
            items: items
        })
        var days = this._dateCreator(o.year, o.month, o.day);
        items = [];
        items.push(days.slice(0, 7));
        items.push(days.slice(7, 14));
        items.push(days.slice(14, 21));
        items.push(days.slice(21, 28));
        items.push(days.slice(28, 35));
        items.push(days.slice(35, 42));

        items = BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return BI.extend(td, {
                    type: "bi.text_item",
                    cls: "bi-list-item-active",
                    textAlign: "center",
                    whiteSpace: "normal",
                    once: false,
                    forceSelected: true,
                    height: 25,
                    value: o.year + "-" + o.month + "-" + td.text,
                    disabled: td.lastMonth || td.nextMonth || td.disabled
                    //selected: td.currentDay
                });
            });
        });

        this.days = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(items, {}),
            layouts: [BI.LogicFactory.createLogic("table", BI.extend({}, o.logic, {
                columns: 7,
                rows: 6,
                columnSize: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7],
                rowSize: 25
            }))]
        });
        this.days.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        })
        BI.createWidget(BI.extend({
            element: this.element

        }, BI.LogicFactory.createLogic("vertical", BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", title, this.days)
        }))));
    },

    isFrontDate: function () {
        var o = this.options, c = this._const;
        var Y = o.year, M = o.month, De = new Date(), day = De.getDay();
        Y = Y | 0;
        De.setFullYear(Y, M, 1);
        var newDate = De.getOffsetDate(-1 * (day + 1));
        return !!Date.checkVoid(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), o.min, o.max)[0];
    },

    isFinalDate: function () {
        var o = this.options, c = this._const;
        var Y = o.year, M = o.month, De = new Date(), day = De.getDay();
        Y = Y | 0;
        De.setFullYear(Y, M, 1);
        var newDate = De.getOffsetDate(42 - day);
        return !!Date.checkVoid(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), o.min, o.max)[0];
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
        }
    }
});

BI.extend(BI.Calendar, {
    getPageByDateJSON: function (json) {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var page = (json.year - year) * 12;
        page += json.month - month;
        return page;
    }
});

$.shortcut("bi.calendar", BI.Calendar);