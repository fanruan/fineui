/**
 * 图表控件
 * @class BI.AbstractChart
 * @extends BI.Widget
 */
BI.AbstractChart = BI.inherit(BI.Widget, {

    constants: {
        LEFT_AXIS: 0,
        RIGHT_AXIS: 1,
        RIGHT_AXIS_SECOND: 2,
        X_AXIS: 3,
        ROTATION: -90,
        NORMAL: 1,
        LEGEND_BOTTOM: 4,
        ZERO2POINT: 2,
        ONE2POINT: 3,
        TWO2POINT: 4,
        MINLIMIT: 1e-5,
        LEGEND_HEIGHT: 80,
        LEGEND_WIDTH: "30.0%",
        FIX_COUNT: 6,
        STYLE_NORMAL: 21,
        NO_PROJECT: 16,
        DASHBOARD_AXIS: 4,
        ONE_POINTER: 1,
        MULTI_POINTER: 2,
        HALF_DASHBOARD: 9,
        PERCENT_DASHBOARD: 10,
        PERCENT_SCALE_SLOT: 11,
        VERTICAL_TUBE: 12,
        HORIZONTAL_TUBE: 13,
        LNG_FIRST: 3,
        LAT_FIRST: 4,
        themeColor: "#65bce7",
        autoCustom: 1,
        POLYGON: 7,
        AUTO_CUSTOM: 1,
        AUTO: 1,
        NOT_SHOW: 2,
        LINE_WIDTH: 1,
        NUM_SEPARATORS: false,
        FONT_STYLE: {
            "fontFamily": "inherit",
            "color": "inherit",
            "fontSize": "12px"
        }
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-abstract-chart",
            popupItemsGetter: BI.emptyFn
        })
    },

    _init: function () {
        BI.AbstractChart.superclass._init.apply(this, arguments);
    },

    /**
     * 格式化坐标轴数量级及其所影响的系列的各项属性
     * @param config  配置信息
     * @param items  系列数据
     * @param type  坐标轴数量级
     * @param position 坐标轴位置
     * @param formatter 系列tooltip格式化内容
     */
    formatNumberLevelInYaxis: function (config, items, type, position, formatter, isPercentChart) {
        var magnify = this.calcMagnify(type);
        BI.each(items, function (idx, item) {
            BI.each(item.data, function (id, da) {
                if (position === item.yAxis) {
                    if (BI.isNotNull(da.y) && !BI.isNumber(da.y)) {
                        da.y = BI.parseFloat(da.y);
                    }
                    if (BI.isNotNull(da.y)) {
                        da.y = BI.contentFormat(BI.parseFloat(da.y.div(magnify).toFixed(4)), "#.####;-#.####");
                    }
                }
            });
            if (position === item.yAxis) {
                item.tooltip = BI.deepClone(config.plotOptions.tooltip);
                item.tooltip.formatter.valueFormat = formatter;
                if(isPercentChart) {
                    item.tooltip.formatter.percentFormat = formatter;
                    item.tooltip.formatter.identifier = "${CATEGORY}${SERIES}${PERCENT}";
                }
            }
        });
    },

    formatNumberLevelInXaxis: function (items, type) {
        var magnify = this.calcMagnify(type);
        BI.each(items, function (idx, item) {
            BI.each(item.data, function (id, da) {
                if (BI.isNotNull(da.x) && !BI.isNumber(da.x)) {
                    da.x = BI.parseFloat(da.x);
                }
                if (BI.isNotNull(da.x)) {
                    da.x = BI.contentFormat(BI.parseFloat(da.x.div(magnify).toFixed(4)), "#.####;-#.####");
                }
            });
        })
    },

    formatXYDataWithMagnify: function (number, magnify) {
        if (BI.isNull(number)) {
            return null
        }
        if (!BI.isNumber(number)) {
            number = BI.parseFloat(number);
        }
        return BI.contentFormat(BI.parseFloat(number.div(magnify).toFixed(4)), "#.####;-#.####");
    },

    calcMagnify: function (type) {
        var magnify = 1;
        switch (type) {
            case BICst.TARGET_STYLE.NUM_LEVEL.NORMAL:
            case BICst.TARGET_STYLE.NUM_LEVEL.PERCENT:
                magnify = 1;
                break;
            case BICst.TARGET_STYLE.NUM_LEVEL.TEN_THOUSAND:
                magnify = 10000;
                break;
            case BICst.TARGET_STYLE.NUM_LEVEL.MILLION:
                magnify = 1000000;
                break;
            case BICst.TARGET_STYLE.NUM_LEVEL.YI:
                magnify = 100000000;
                break;
        }
        return magnify;
    },

    formatChartLegend: function (config, chartLegend) {
        switch (chartLegend) {
            case BICst.CHART_LEGENDS.BOTTOM:
                config.legend.enabled = true;
                config.legend.position = "bottom";
                config.legend.maxHeight = this.constants.LEGEND_HEIGHT;
                break;
            case BICst.CHART_LEGENDS.RIGHT:
                config.legend.enabled = true;
                config.legend.position = "right";
                config.legend.maxWidth = this.constants.LEGEND_WIDTH;
                break;
            case BICst.CHART_LEGENDS.NOT_SHOW:
            default:
                config.legend.enabled = false;
                break;
        }
    },

    getXYAxisUnit: function (numberLevelType, axis_unit) {
        var unit = "";
        switch (numberLevelType) {
            case BICst.TARGET_STYLE.NUM_LEVEL.NORMAL:
                unit = "";
                break;
            case BICst.TARGET_STYLE.NUM_LEVEL.TEN_THOUSAND:
                unit = BI.i18nText("BI-Wan");
                break;
            case BICst.TARGET_STYLE.NUM_LEVEL.MILLION:
                unit = BI.i18nText("BI-Million");
                break;
            case BICst.TARGET_STYLE.NUM_LEVEL.YI:
                unit = BI.i18nText("BI-Yi");
                break;
        }
        return (BI.isEmptyString(unit) && BI.isEmptyString(axis_unit)) ? unit : "(" + unit + axis_unit + ")";
    },

    formatTickInXYaxis: function (type, number_level, separators, isCompareBar) {
        var formatter = '#.##';
        switch (type) {
            case this.constants.NORMAL:
                formatter = '#.##';
                if (separators) {
                    formatter = '#,###.##'
                }
                break;
            case this.constants.ZERO2POINT:
                formatter = '#0';
                if (separators) {
                    formatter = '#,###';
                }
                break;
            case this.constants.ONE2POINT:
                formatter = '#0.0';
                if (separators) {
                    formatter = '#,###.0';
                }
                break;
            case this.constants.TWO2POINT:
                formatter = '#0.00';
                if (separators) {
                    formatter = '#,###.00';
                }
                break;
        }
        if (number_level === BICst.TARGET_STYLE.NUM_LEVEL.PERCENT) {
            formatter += '%';
        }
        formatter += ";-" + formatter;
        if(isCompareBar) {
            return function () {
                arguments[0] = arguments[0] > 0 ? arguments[0] : (-1) * arguments[0];
                return BI.contentFormat(arguments[0], formatter);
            }
        }
        return function () {
            return BI.contentFormat(arguments[0], formatter)
        }
    },

    formatDataLabel: function (state, items, config, style) {
        var self = this;
        if (state === true) {
            BI.each(items, function (idx, item) {
                item.dataLabels = {
                    "align": "outside",
                    "autoAdjust": true,
                    style: style,
                    enabled: true,
                    formatter: {
                        identifier: "${VALUE}",
                        valueFormat: config.yAxis[item.yAxis].formatter
                    }
                };
            });
        }
    },

    formatDataLabelForAxis: function (state, items, format, style, isPercentChart) {
        var self = this;
        if (state === true) {
            BI.each(items, function (idx, item) {
                item.dataLabels = {
                    "align": "outside",
                    "autoAdjust": true,
                    style: style,
                    enabled: true,
                    formatter: {
                        identifier: "${VALUE}",
                        valueFormat: format,
                    }
                };
                if(isPercentChart) {
                    item.dataLabels.formatter.identifier = "${PERCENT}";
                    item.dataLabels.formatter.percentFormat = format;
                }
            });
        }
    },

    setFontStyle: function (fontStyle, config) {
        if (config.dataSheet) {
            config.dataSheet.style = fontStyle;
        }
        config.xAxis[0].title.style = fontStyle;
        config.xAxis[0].labelStyle = fontStyle;
        config.legend.style = fontStyle;
        BI.each(config.yAxis, function (idx, axis) {
            axis.labelStyle = fontStyle;
            axis.title.style = fontStyle;
        })
    },

    _formatItems: function (items) {
        return items;
    },

    populate: function (items, options) {
    },

    resize: function () {
    },

    magnify: function () {
    }
});

BI.AbstractChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.AbstractChart.EVENT_ITEM_CLICK = "EVENT_ITEM_CLICK";
