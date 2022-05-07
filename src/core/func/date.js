/** Constants used for time computations */
BI.Date = BI.Date || {};
BI.Date.SECOND = 1000;
BI.Date.MINUTE = 60 * BI.Date.SECOND;
BI.Date.HOUR = 60 * BI.Date.MINUTE;
BI.Date.DAY = 24 * BI.Date.HOUR;
BI.Date.WEEK = 7 * BI.Date.DAY;

_.extend(BI, {
    /**
     * 获取时区
     * @returns {String}
     */
    getTimezone: function (date) {
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    },

    /** Returns the number of days in the current month */
    getMonthDays: function (date, month) {
        var year = date.getFullYear();
        if (typeof month === "undefined") {
            month = date.getMonth();
        }
        if (((0 == (year % 4)) && ((0 != (year % 100)) || (0 == (year % 400)))) && month == 1) {
            return 29;
        }
        return BI.Date._MD[month];

    },

    /**
     * 获取每月的最后一天
     * @returns {Date}
     */
    getLastDateOfMonth: function (date) {
        return BI.getDate(date.getFullYear(), date.getMonth(), BI.getMonthDays(date));
    },

    /** Returns the number of day in the year. */
    getDayOfYear: function (date) {
        var now = BI.getDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        var then = BI.getDate(date.getFullYear(), 0, 0, 0, 0, 0);
        var time = now - then;
        return Math.floor(time / BI.Date.DAY);
    },

    /** Returns the number of the week in year, as defined in ISO 8601. */
    getWeekNumber: function (date) {
        var d = BI.getDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        var week = d.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        var middleDay = (startOfWeek + 3) % 7;
        middleDay = middleDay || 7;
        // 偏移到周周首之前需要多少天
        var offsetWeekStartCount = week < startOfWeek ? (7 + week - startOfWeek) : (week - startOfWeek);
        var offsetWeekMiddleCount = middleDay < startOfWeek ? (7 + middleDay - startOfWeek) : (middleDay - startOfWeek);
        d.setDate(d.getDate() - offsetWeekStartCount + offsetWeekMiddleCount);
        var ms = d.valueOf();
        d.setMonth(0);
        d.setDate(1);
        return Math.floor((ms - d.valueOf()) / (7 * 864e5)) + 1;
    },

    getQuarter: function (date) {
        return Math.floor(date.getMonth() / 3) + 1;
    },

    // 离当前时间多少天的时间
    getOffsetDate: function (date, offset) {
        return BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()) + offset * 864e5);
    },

    getOffsetQuarter: function (date, n) {
        var dt = BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        var day = dt.getDate();
        var monthDay = BI.getMonthDays(BI.getDate(dt.getFullYear(), dt.getMonth() + BI.parseInt(n) * 3, 1));
        if (day > monthDay) {
            day = monthDay;
        }
        dt.setDate(day);
        dt.setMonth(dt.getMonth() + parseInt(n) * 3);
        return dt;
    },

    // 得到本季度的起始月份
    getQuarterStartMonth: function (date) {
        var quarterStartMonth = 0;
        var nowMonth = date.getMonth();
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    },
    // 获得本季度的起始日期
    getQuarterStartDate: function (date) {
        return BI.getDate(date.getFullYear(), BI.getQuarterStartMonth(date), 1);
    },
    // 得到本季度的结束日期
    getQuarterEndDate: function (date) {
        var quarterEndMonth = BI.getQuarterStartMonth(date) + 2;
        return BI.getDate(date.getFullYear(), quarterEndMonth, BI.getMonthDays(date, quarterEndMonth));
    },

    // 指定日期n个月之前或之后的日期
    getOffsetMonth: function (date, n) {
        var dt = BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        var day = dt.getDate();
        var monthDay = BI.getMonthDays(BI.getDate(dt.getFullYear(), dt.getMonth() + parseInt(n), 1));
        if (day > monthDay) {
            day = monthDay;
        }
        dt.setDate(day);
        dt.setMonth(dt.getMonth() + parseInt(n));
        return dt;
    },

    // 获得本周的起始日期
    getWeekStartDate: function (date) {
        var w = date.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        return BI.getOffsetDate(date, BI.Date._OFFSET[w < startOfWeek ? (7 + w - startOfWeek) : (w - startOfWeek)]);
    },
    // 得到本周的结束日期
    getWeekEndDate: function (date) {
        var w = date.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        return BI.getOffsetDate(date, BI.Date._OFFSET[w < startOfWeek ? (7 + w - startOfWeek) : (w - startOfWeek)] + 6);
    },

    // 格式化打印日期
    print: function (date, str) {
        var m = date.getMonth();
        var d = date.getDate();
        var y = date.getFullYear();
        var yWith4number = y + "";
        while (yWith4number.length < 4) {
            yWith4number = "0" + yWith4number;
        }
        var wn = BI.getWeekNumber(date);
        var qr = BI.getQuarter(date);
        var w = date.getDay();
        var s = {};
        var hr = date.getHours();
        var pm = (hr >= 12);
        var ir = (pm) ? (hr - 12) : hr;
        var dy = BI.getDayOfYear(date);
        if (ir == 0) {
            ir = 12;
        }
        var min = date.getMinutes();
        var sec = date.getSeconds();
        s["%a"] = BI.Date._SDN[w]; // abbreviated weekday name [FIXME: I18N]
        s["%A"] = BI.Date._DN[w]; // full weekday name
        s["%b"] = BI.Date._SMN[m]; // abbreviated month name [FIXME: I18N]
        s["%B"] = BI.Date._MN[m]; // full month name
        // FIXME: %c : preferred date and time representation for the current locale
        s["%C"] = 1 + Math.floor(y / 100); // the century number
        s["%d"] = (d < 10) ? ("0" + d) : d; // the day of the month (range 01 to 31)
        s["%e"] = d; // the day of the month (range 1 to 31)
        // FIXME: %D : american date style: %m/%d/%y
        // FIXME: %E, %F, %G, %g, %h (man strftime)
        s["%H"] = (hr < 10) ? ("0" + hr) : hr; // hour, range 00 to 23 (24h format)
        s["%I"] = (ir < 10) ? ("0" + ir) : ir; // hour, range 01 to 12 (12h format)
        s["%j"] = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy; // day of the year (range 001 to 366)
        s["%k"] = hr + "";		// hour, range 0 to 23 (24h format)
        s["%l"] = ir + "";		// hour, range 1 to 12 (12h format)
        s["%X"] = (m < 9) ? ("0" + (1 + m)) : (1 + m); // month, range 01 to 12
        s["%x"] = m + 1; // month, range 1 to 12
        s["%M"] = (min < 10) ? ("0" + min) : min; // minute, range 00 to 59
        s["%n"] = "\n";		// a newline character
        s["%p"] = pm ? "PM" : "AM";
        s["%P"] = pm ? "pm" : "am";
        // FIXME: %r : the time in am/pm notation %I:%M:%S %p
        // FIXME: %R : the time in 24-hour notation %H:%M
        s["%s"] = Math.floor(date.getTime() / 1000);
        s["%S"] = (sec < 10) ? ("0" + sec) : sec; // seconds, range 00 to 59
        s["%t"] = "\t";		// a tab character
        // FIXME: %T : the time in 24-hour notation (%H:%M:%S)
        s["%U"] = s["%W"] = s["%V"] = (wn < 10) ? ("0" + wn) : wn;
        s["%u"] = w + 1;	// the day of the week (range 1 to 7, 1 = MON)
        s["%w"] = w;		// the day of the week (range 0 to 6, 0 = SUN)
        // FIXME: %x : preferred date representation for the current locale without the time
        // FIXME: %X : preferred time representation for the current locale without the date
        s["%y"] = yWith4number.substr(2, 2); // year without the century (range 00 to 99)
        s["%Y"] = yWith4number;		// year with the century
        s["%%"] = "%";		// a literal '%' character
        s["%q"] = "0" + qr;
        s["%Q"] = qr;

        var re = /%./g;
        BI.isKhtml = BI.isKhtml || function () {
            if(!_global.navigator) {
                return false;
            }
            return /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
        };

        // 包含年周的格式化，ISO8601标准周的计数会影响年
        if ((str.indexOf("%Y") !== -1 || str.indexOf("%y") !== -1) && (str.indexOf("%W") !== -1 || str.indexOf("%U") !== -1 || str.indexOf("%V") !== -1)) {
            switch (wn) {
                // 如果周数是1，但是当前却在12月，表示此周数为下一年的
                case 1:
                    if (m === 11) {
                        s["%y"] = parseInt(s["%y"]) + 1;
                        s["%Y"] = parseInt(s["%Y"]) + 1;
                    }
                    break;
                // 如果周数是53，但是当前却在1月，表示此周数为上一年的
                case 53:
                    if (m === 0) {
                        s["%y"] = parseInt(s["%y"]) - 1;
                        s["%Y"] = parseInt(s["%Y"]) - 1;
                    }
                    break;
                default:
                    break;
            }
        }

        if (!BI.isKhtml()) {
            return str.replace(re, function (par) {
                return s[par] || par;
            });
        }
        var a = str.match(re);
        for (var i = 0; i < a.length; i++) {
            var tmp = s[a[i]];
            if (tmp) {
                re = new RegExp(a[i], "g");
                str = str.replace(re, tmp);
            }
        }

        return str;
    }
});
