/**
 * Created by astronaut007 on 2018/8/8
 */
// 牵扯到国际化这些常量在页面加载后再生效
// full day names
BI.Date = BI.Date || {};
BI.Date._DN = ["星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日"];

// short day names
BI.Date._SDN = ["日",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "日"];

// Monday first, etc.
BI.Date._FD = 1;

// full month namesdat
BI.Date._MN = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"];

// short month names
BI.Date._SMN = [0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11];

BI.Date._QN = ["", "第1季度",
    "第2季度",
    "第3季度",
    "第4季度"];

/** Adds the number of days array to the Date object. */
BI.Date._MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 实际上无论周几作为一周的第一天，周初周末都是在-6-0间做偏移，用一个数组就可以
BI.Date._OFFSET = [0, -1, -2, -3, -4, -5, -6];
