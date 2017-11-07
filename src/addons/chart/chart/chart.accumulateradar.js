/**
 * 图表控件
 * @class BI.AccumulateRadarChart
 * @extends BI.Widget
 */
BI.AccumulateRadarChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.AccumulateRadarChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-accumulate-radar-chart"
        })
    },

    _init: function () {
        BI.AccumulateRadarChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.radiusAxis = [{
            type: "value",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            formatter: function () {
                return this > 0 ? this : (-1) * this
            },
            gridLineWidth: 0,
            position: "bottom"
        }];

        this.angleAxis = [{
            type: "category",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE
        }];

        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.AccumulateRadarChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatItems: function (items) {
        return BI.map(items, function (idx, item) {
            var i = BI.UUID();
            return BI.map(item, function (id, it) {
                return BI.extend({}, it, {stack: i});
            });
        });
    },

    _formatConfig: function (config, items) {
        var self = this;

        delete config.zoom;

        var title = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS);
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatChartRadarStyle();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.plotOptions.connectNulls = this.config.nullContinue;

        config.radiusAxis = this.radiusAxis;
        config.angleAxis = this.angleAxis;
        config.radiusAxis[0].formatter = self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators);
        formatNumberLevelInYaxis(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS, config.radiusAxis[0].formatter);
        config.radiusAxis[0].title.text = this.config.showLeftYAxisTitle === true ? this.config.leftYAxisTitle + title : title;
        config.radiusAxis[0].gridLineWidth = this.config.showGridLine === true ? 1 : 0;
        config.chartType = "radar";
        config.plotOptions.columnType = true;
        delete config.xAxis;
        delete config.yAxis;
        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabelForAxis(config.plotOptions.dataLabels.enabled, items, config.radiusAxis[0].formatter, this.config.chartFont);

        //全局样式的图表文字
        config.radiusAxis[0].labelStyle = config.radiusAxis[0].title.style = this.config.chartFont;
        config.angleAxis[0].labelStyle = config.angleAxis[0].title.style = this.config.chartFont;
        config.legend.style = this.config.chartFont;

        return [items, config];

        function formatChartStyle() {
            switch (self.config.chartStyle) {
                case BICst.CHART_STYLE.STYLE_GRADUAL:
                    return "gradual";
                case BICst.CHART_STYLE.STYLE_NORMAL:
                default:
                    return "normal";
            }
        }

        function formatChartRadarStyle() {
            switch (self.config.chartRadarType) {
                case BICst.CHART_SHAPE.POLYGON:
                    config.plotOptions.shape = "polygon";
                    break;
                case BICst.CHART_SHAPE.CIRCLE:
                    config.plotOptions.shape = "circle";
                    break;
            }
        }

        function formatNumberLevelInYaxis(type, position, formatter) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, da) {
                    if (position === item.yAxis) {
                        da.y = self.formatXYDataWithMagnify(da.y, magnify);
                    }
                })
            });
            config.plotOptions.tooltip.formatter.valueFormat = formatter;
        }

        function getXYAxisUnit(numberLevelType, position) {
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
            if (position === self.constants.X_AXIS) {
                self.config.xAxisUnit !== "" && (unit = unit + self.config.xAxisUnit)
            }
            if (position === self.constants.LEFT_AXIS) {
                self.config.leftYAxisUnit !== "" && (unit = unit + self.config.leftYAxisUnit)
            }
            if (position === self.constants.RIGHT_AXIS) {
                self.config.rightYAxisUnit !== "" && (unit = unit + self.config.rightYAxisUnit)
            }
            return unit === "" ? unit : "(" + unit + ")";
        }
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            chartRadarType: options.chartRadarType || c.NORMAL,
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.STYLE_NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            showDataLabel: options.showDataLabel || false,
            showGridLine: BI.isNull(options.showGridLine) ? true : options.showGridLine,
            cordon: options.cordon || [],
            numSeparators: options.numSeparators || false,
            chartFont: options.chartFont || c.FONT_STYLE,
            nullContinue: options.nullContinue || false
        };
        this.options.items = items;
        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.RADAR);
            });
            types.push(type);
        });
        this.combineChart.populate(this._formatItems(items), types);
    },

    resize: function () {
        this.combineChart.resize();
    },

    magnify: function () {
        this.combineChart.magnify();
    }
});
BI.AccumulateRadarChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.accumulate_radar_chart', BI.AccumulateRadarChart);