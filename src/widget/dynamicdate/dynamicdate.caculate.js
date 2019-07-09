!(function () {
    BI.DynamicDateHelper = {};
    BI.extend(BI.DynamicDateHelper, {
        getCalculation: function (obj) {
            var date = BI.getDate();

            return this.getCalculationByDate(date, obj);
        },

        getCalculationByDate: function (date, obj) {
            if (BI.isNotNull(obj.year)) {
                date = BI.getDate((date.getFullYear() + BI.parseInt(obj.year)), date.getMonth(), date.getDate());
            }
            if (BI.isNotNull(obj.quarter)) {
                date = BI.getOffsetQuarter(date, BI.parseInt(obj.quarter));
            }
            if (BI.isNotNull(obj.month)) {
                date = BI.getOffsetMonth(date, BI.parseInt(obj.month));
            }
            if (BI.isNotNull(obj.week)) {
                date = BI.getOffsetDate(date, BI.parseInt(obj.week) * 7);
            }
            if (BI.isNotNull(obj.day)) {
                date = BI.getOffsetDate(date, BI.parseInt(obj.day));
            }
            if (BI.isNotNull(obj.workDay)) {
                // 配置了节假日就按照节假日计算工作日偏移，否则按正常的天去算
                if(BI.isNotNull(BI.holidays)) {
                    var count = Math.abs(obj.workDay);
                    for (var i = 0; i < count; i++) {
                        date = BI.getOffsetDate(date, obj.workDay < 0 ? -1 : 1);
                        if(BI.isNotNull(BI.holidays[BI.print(date, "%Y-%X-%d")])) {
                            i--;
                        }
                    }
                } else {
                    date = BI.getOffsetDate(date, BI.parseInt(obj.workDay));
                }
            }
            if (BI.isNotNull(obj.position) && obj.position !== BI.DynamicDateCard.OFFSET.CURRENT) {
                date = this.getBeginDate(date, obj);
            }

            return BI.getDate(date.getFullYear(), date.getMonth(), date.getDate());
        },

        getBeginDate: function (date, obj) {
            if (BI.isNotNull(obj.day)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), date.getMonth(), 1) : BI.getDate(date.getFullYear(), date.getMonth(), (BI.getLastDateOfMonth(date)).getDate());
            }
            if (BI.isNotNull(obj.week)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getWeekStartDate(date) : BI.getWeekEndDate(date);
            }
            if (BI.isNotNull(obj.month)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), date.getMonth(), 1) : BI.getDate(date.getFullYear(), date.getMonth(), (BI.getLastDateOfMonth(date)).getDate());
            }
            if (BI.isNotNull(obj.quarter)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getQuarterStartDate(date) : BI.getQuarterEndDate(date);
            }
            if (BI.isNotNull(obj.year)) {
                return obj.position === BI.DynamicDateCard.OFFSET.BEGIN ? BI.getDate(date.getFullYear(), 0, 1) : BI.getDate(date.getFullYear(), 11, 31);
            }
            return date;
        }
    });
})();
