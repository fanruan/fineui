
/** Constants used for time computations */
Date.SECOND = 1000;
Date.MINUTE = 60 * Date.SECOND;
Date.HOUR = 60 * Date.MINUTE;
Date.DAY = 24 * Date.HOUR;
Date.WEEK = 7 * Date.DAY;

/**
 * 获取时区
 * @returns {String}
 */
Date.prototype.getTimezone = function () {
    return this.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
};

/** Returns the number of days in the current month */
Date.prototype.getMonthDays = function (month) {
    var year = this.getFullYear();
    if (typeof month === "undefined") {
        month = this.getMonth();
    }
    if (((0 == (year % 4)) && ( (0 != (year % 100)) || (0 == (year % 400)))) && month == 1) {
        return 29;
    }
    return Date._MD[month];

};

/**
 * 获取每月的最后一天
 * @returns {Date}
 */
Date.prototype.getLastDateOfMonth = function () {
    return BI.getDate(this.getFullYear(), this.getMonth(), this.getMonthDays());
};

/** Returns the number of day in the year. */
Date.prototype.getDayOfYear = function () {
    var now = BI.getDate(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    var then = BI.getDate(this.getFullYear(), 0, 0, 0, 0, 0);
    var time = now - then;
    return Math.floor(time / Date.DAY);
};

/** Returns the number of the week in year, as defined in ISO 8601. */
Date.prototype.getWeekNumber = function () {
    var d = BI.getDate(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    // 周一是一周第一天
    var week = d.getDay() === 0 ? 7 : d.getDay();
    // var week = d.getDay();
    if (this.getMonth() === 0 && this.getDate() <= week) {
        return 1;
    }
    d.setDate(this.getDate() - (week - 1));
    var ms = d.valueOf(); // GMT
    d.setMonth(0);
    d.setDate(1);
    var offset = Math.floor((ms - d.valueOf()) / (7 * 864e5)) + 1;
    if (d.getDay() !== 1) {
        offset++;
    }
    return offset;
};

Date.prototype.getQuarter = function () {
    return Math.floor(this.getMonth() / 3) + 1;
};

// 离当前时间多少天的时间
Date.prototype.getOffsetDate = function (offset) {
    return BI.getDate(BI.getTime(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds()) + offset * 864e5);
};

Date.prototype.getOffsetQuarter = function (n) {
    var dt = BI.getDate(BI.getTime(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds()));
    var day = dt.getDate();
    var monthDay = BI.getDate(dt.getFullYear(), dt.getMonth() + BI.parseInt(n) * 3, 1).getMonthDays();
    if (day > monthDay) {
        day = monthDay;
    }
    dt.setDate(day);
    dt.setMonth(dt.getMonth() + parseInt(n) * 3);
    return dt;
};

// 得到本季度的起始月份
Date.prototype.getQuarterStartMonth = function () {
    var quarterStartMonth = 0;
    var nowMonth = this.getMonth();
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
};
// 获得本季度的起始日期
Date.prototype.getQuarterStartDate = function () {
    return BI.getDate(this.getFullYear(), this.getQuarterStartMonth(), 1);
};
// 得到本季度的结束日期
Date.prototype.getQuarterEndDate = function () {
    var quarterEndMonth = this.getQuarterStartMonth() + 2;
    return BI.getDate(this.getFullYear(), quarterEndMonth, this.getMonthDays(quarterEndMonth));
};

// 指定日期n个月之前或之后的日期
Date.prototype.getOffsetMonth = function (n) {
    var dt = BI.getDate(BI.getTime(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds()));
    var day = dt.getDate();
    var monthDay = BI.getDate(dt.getFullYear(), dt.getMonth() + parseInt(n), 1).getMonthDays();
    if (day > monthDay) {
        day = monthDay;
    }
    dt.setDate(day);
    dt.setMonth(dt.getMonth() + parseInt(n));
    return dt;
};

// 获得本周的起始日期
Date.prototype.getWeekStartDate = function () {
    var w = this.getDay();
    return this.getOffsetDate(w === 0 ? -6 : 1 - w);
};
// 得到本周的结束日期
Date.prototype.getWeekEndDate = function () {
    var w = this.getDay();
    return this.getOffsetDate(w === 0 ? 0 : 7 - w);
};

/** Checks date and time equality */
Date.prototype.equalsTo = function (date) {
    return ((this.getFullYear() == date.getFullYear()) &&
    (this.getMonth() == date.getMonth()) &&
    (this.getDate() == date.getDate()) &&
    (this.getHours() == date.getHours()) &&
    (this.getMinutes() == date.getMinutes()) &&
    (this.getSeconds() == date.getSeconds()));
};

/** Set only the year, month, date parts (keep existing time) */
Date.prototype.setDateOnly = function (date) {
    var tmp = BI.getDate(date);
    this.setDate(1);
    this.setFullYear(tmp.getFullYear());
    this.setMonth(tmp.getMonth());
    this.setDate(tmp.getDate());
};
/** Prints the date in a string according to the given format. */
Date.prototype.print = function (str) {
    var m = this.getMonth();
    var d = this.getDate();
    var y = this.getFullYear();
    var yWith4number = y + "";
    while (yWith4number.length < 4) {
        yWith4number = "0" + yWith4number;
    }
    var wn = this.getWeekNumber();
    var qr = this.getQuarter();
    var w = this.getDay();
    var s = {};
    var hr = this.getHours();
    var pm = (hr >= 12);
    var ir = (pm) ? (hr - 12) : hr;
    var dy = this.getDayOfYear();
    if (ir == 0) {
        ir = 12;
    }
    var min = this.getMinutes();
    var sec = this.getSeconds();
    s["%a"] = Date._SDN[w]; // abbreviated weekday name [FIXME: I18N]
    s["%A"] = Date._DN[w]; // full weekday name
    s["%b"] = Date._SMN[m]; // abbreviated month name [FIXME: I18N]
    s["%B"] = Date._MN[m]; // full month name
    // FIXME: %c : preferred date and time representation for the current locale
    s["%C"] = 1 + Math.floor(y / 100); // the century number
    s["%d"] = (d < 10) ? ("0" + d) : d; // the day of the month (range 01 to 31)
    s["%e"] = d; // the day of the month (range 1 to 31)
    // FIXME: %D : american date style: %m/%d/%y
    // FIXME: %E, %F, %G, %g, %h (man strftime)
    s["%H"] = (hr < 10) ? ("0" + hr) : hr; // hour, range 00 to 23 (24h format)
    s["%I"] = (ir < 10) ? ("0" + ir) : ir; // hour, range 01 to 12 (12h format)
    s["%j"] = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy; // day of the year (range 001 to 366)
    s["%k"] = hr;		// hour, range 0 to 23 (24h format)
    s["%l"] = ir;		// hour, range 1 to 12 (12h format)
    s["%X"] = (m < 9) ? ("0" + (1 + m)) : (1 + m); // month, range 01 to 12
    s["%x"] = m + 1; // month, range 1 to 12
    s["%M"] = (min < 10) ? ("0" + min) : min; // minute, range 00 to 59
    s["%n"] = "\n";		// a newline character
    s["%p"] = pm ? "PM" : "AM";
    s["%P"] = pm ? "pm" : "am";
    // FIXME: %r : the time in am/pm notation %I:%M:%S %p
    // FIXME: %R : the time in 24-hour notation %H:%M
    s["%s"] = Math.floor(this.getTime() / 1000);
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
    s["%Q"] = qr;

    var re = /%./g;
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
};
