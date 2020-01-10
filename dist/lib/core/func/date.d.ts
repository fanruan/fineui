export declare type _Date = {
    SECOND: number;
    MINUTE: number;
    HOUR: number;
    DAY: number;
    WEEK: number;
    _DN: string[];
    _SDN: string[];
    _FD: number;
    _MN: string[];
    _SMN: number[];
    _QN: string[];
    _MD: number[];
    _OFFSET: number[];
};
/**
 * 获取时区
 */
export declare type _getTimezone = (date: Date) => string;
/**
 * 获取指定月共有多少天
 */
export declare type _getMonthDays = (date: Date, month: number) => string;
/**
 * 获取指定月的最后一天
 */
export declare type _getLastDateOfMonth = (data: Date) => Date;
/**
 * 获取指定时间距离当年已经过了多少天
 */
export declare type _getDayOfYear = (data: Date) => number;
/**
 * 获取指定时间距离当年已经过了多少周
 */
export declare type _getWeekNumber = (data: Date) => number;
/**
 * 获取指定时间的所处季度
 */
export declare type _getQuarter = (date: Date) => number;
/**
 * 离当前时间多少天的时间
 */
export declare type _getOffsetDate = (date: Date, offset: number) => Date;
/**
 * 离当前时间多少天季度的时间
 */
export declare type _getOffsetQuarter = (date: Date, n: number) => Date;
/**
 * 得到本季度的起始月份
 */
export declare type _getQuarterStartMonth = (date: Date) => number;
/**
 * 获得本季度的起始日期
 */
export declare type _getQuarterStartDate = (date: Date) => number;
/**
 * 获取本季度的其实日期
 */
export declare type _getQuarterEndDate = (date: Date) => number;
/**
 * 指定日期n个月之前或之后的日期
 */
export declare type _getOffsetMonth = (date: Date, n: number) => Date;
/**
 * 获取本周的起始日期
 */
export declare type _getWeekStartDate = (date: Date) => Date;
/**
 * 获取本周的结束日期
 */
export declare type _getWeekEndDate = (date: Date) => Date;
/**
 * 格式化打印日期
 */
export declare type _print = (date: Date, str: string) => string;
export declare type _date = {
    getTimezone: _getTimezone;
    getMonthDays: _getMonthDays;
    getLastDateOfMonth: _getLastDateOfMonth;
    getDayOfYear: _getDayOfYear;
    getWeekNumber: _getWeekNumber;
    getQuarter: _getQuarter;
    getOffsetDate: _getOffsetDate;
    getOffsetQuarter: _getOffsetQuarter;
    getQuarterStartMonth: _getQuarterStartMonth;
    getQuarterStartDate: _getQuarterStartDate;
    getQuarterEndDate: _getQuarterEndDate;
    getOffsetMonth: _getOffsetMonth;
    getWeekStartDate: _getWeekStartDate;
    getWeekEndDate: _getWeekEndDate;
    print: _print;
};
