export type _Date = {
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
}

export type _date = {

    /**
     * 获取时区
     */
    getTimezone: (date: Date) => string;

    /**
     * 获取指定月共有多少天
     */
    getMonthDays: (date: Date, month: number) => number;

    /**
     * 获取指定月的最后一天
     */
    getLastDateOfMonth: (data: Date) => Date;

    /**
     * 获取指定时间距离当年已经过了多少天
     */
    getDayOfYear: (data: Date) => number;

    /**
     * 获取指定时间距离当年已经过了多少周
     */
    getWeekNumber: (data: Date) => number;

    /**
     * 获取指定时间的所处季度
     */
    getQuarter: (date: Date) => number;

    /**
     * 离当前时间多少天的时间
     */
    getOffsetDate: (date: Date, offset: number) => Date;

    /**
     * 离当前时间多少天季度的时间
     */
    getOffsetQuarter: (date: Date, n: number) => Date;

    /**
     * 得到本季度的起始月份
     */
    getQuarterStartMonth: (date: Date) => number;

    /**
     * 获得本季度的起始日期
     */
    getQuarterStartDate: (date: Date) => number;

    /**
     * 获取本季度的其实日期
     */
    getQuarterEndDate: (date: Date) => number;

    /**
     * 指定日期n个月之前或之后的日期
     */
    getOffsetMonth: (date: Date, n: number) => Date;

    /**
     * 获取本周的起始日期
     */
    getWeekStartDate: (date: Date) => Date;

    /**
     * 获取本周的结束日期
     */
    getWeekEndDate: (date: Date) => Date;
    
    /**
     * 格式化打印日期
     */
    print: (date: Date, str: string) => string;
}
