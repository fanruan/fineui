!(function () {
    BI.DynamicDateHelper = {};
    BI.extend(BI.DynamicDateHelper, {
        getCalculation: function (obj) {
            var date = BI.getDate();

            return this.getCalculationByDate(date, obj);
        },

        getDescription: function (obj) {
            var value = "";
            var endText = "";
            if(BI.isNotNull(obj.year)) {
                if(BI.parseInt(obj.year) !== 0) {
                    value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
                }
                endText = getPositionText(BI.i18nText("BI-Basic_Year"), obj.position);
            }
            if(BI.isNotNull(obj.quarter)) {
                if(BI.parseInt(obj.quarter) !== 0) {
                    value += Math.abs(obj.quarter) + BI.i18nText("BI-Basic_Single_Quarter") + (obj.quarter < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
                }
                endText = getPositionText(BI.i18nText("BI-Basic_Single_Quarter"), obj.position);
            }
            if(BI.isNotNull(obj.month)) {
                if(BI.parseInt(obj.month) !== 0) {
                    value += Math.abs(obj.month) + BI.i18nText("BI-Basic_Month") + (obj.month < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
                }
                endText = getPositionText(BI.i18nText("BI-Basic_Month"), obj.position);
            }
            if(BI.isNotNull(obj.week)) {
                if(BI.parseInt(obj.week) !== 0) {
                    value += Math.abs(obj.week) + BI.i18nText("BI-Basic_Week") + (obj.week < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
                }
                endText = getPositionText(BI.i18nText("BI-Basic_Week"), obj.position);
            }
            if(BI.isNotNull(obj.day)) {
                if(BI.parseInt(obj.day) !== 0) {
                    value += Math.abs(obj.day) + BI.i18nText("BI-Basic_Day") + (obj.day < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
                }
                endText = BI.size(obj) === 1 ? getPositionText(BI.i18nText("BI-Basic_Month"), obj.position) : "";
            }
            if(BI.isNotNull(obj.workDay) && BI.parseInt(obj.workDay) !== 0) {
                value += Math.abs(obj.workDay) + BI.i18nText("BI-Basic_Work_Day") + (obj.workDay < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            }
            return value +  endText;

            function getPositionText (baseText, position) {
                switch (position) {
                    case BI.DynamicDateCard.OFFSET.BEGIN:
                        return baseText + BI.i18nText("BI-Basic_Begin_Start");
                    case BI.DynamicDateCard.OFFSET.END:
                        return baseText + BI.i18nText("BI-Basic_End_Stop");
                    case BI.DynamicDateCard.OFFSET.CURRENT:
                    default:
                        return BI.i18nText("BI-Basic_Current_Day");
                }
            }
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
