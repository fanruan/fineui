/**
 * 图表控件
 * @class BI.RangeAreaChart
 * @extends BI.Widget
 * 范围面积图的构造范围的两组item的必须有对应y值item1完全大于item2
 */
BI.RangeAreaChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.RangeAreaChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-range-area-chart"
        });
    },

    _init: function () {
        BI.RangeAreaChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "category",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            position: "bottom",
            gridLineWidth: 0
        }];
        this.yAxis = [{
            type: "value",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            position: "left",
            gridLineWidth: 0
        }];
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.RangeAreaChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj);
        });
    },

    _formatConfig: function (config, items) {
        var self = this;
        var title = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS);
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.plotOptions.connectNulls = this.config.nullContinue;

        config.yAxis = this.yAxis;
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        config.yAxis[0].title.text = this.config.showLeftYAxisTitle === true ? this.config.leftYAxisTitle + title : title;
        BI.extend(config.yAxis[0], {
            lineWidth: this.config.lineWidth,
            showLabel: this.config.showLabel,
            enableTick: this.config.enableTick,
            enableMinorTick: this.config.enableMinorTick,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            reversed: config.yAxis[0].reversed = this.config.leftYAxisReversed,
            formatter: self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators)
        });
        formatNumberLevelInYaxis(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS, config.yAxis[0].formatter);

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: "40%"
        });

        config.chartType = "area";
        config.plotOptions.tooltip.formatter.identifier = "${CATEGORY}${VALUE}";

        // 为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabelForAxis(config.plotOptions.dataLabels.enabled, items, config.yAxis[0].formatter, this.config.chartFont);

        // 全局样式的图表文字
        this.setFontStyle(this.config.chartFont, config);

        return [items, config];

        function formatChartStyle () {
            switch (self.config.chartStyle) {
                case BICst.CHART_STYLE.STYLE_GRADUAL:
                    return "gradual";
                case BICst.CHART_STYLE.STYLE_NORMAL:
                default:
                    return "normal";
            }
        }

        function formatCordon () {
            BI.each(self.config.cordon, function (idx, cor) {
                if (idx === 0 && self.xAxis.length > 0) {
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
                    self.xAxis[0].plotLines = BI.map(cor, function (i, t) {
                        return BI.extend(t, {
                            value: t.value.div(magnify),
                            width: 1,
                            label: {
                                style: self.config.chartFont,
                                text: t.text,
                                align: "top"
                            }
                        });
                    });
                }
                if (idx > 0 && self.yAxis.length >= idx) {
                    var magnify = 1;
                    switch (idx - 1) {
                        case self.constants.LEFT_AXIS:
                            magnify = self.calcMagnify(self.config.leftYAxisNumberLevel);
                            break;
                        case self.constants.RIGHT_AXIS:
                            magnify = self.calcMagnify(self.config.rightYAxisNumberLevel);
                            break;
                        case self.constants.RIGHT_AXIS_SECOND:
                            magnify = self.calcMagnify(self.config.rightYAxisSecondNumberLevel);
                            break;
                    }
                    self.yAxis[idx - 1].plotLines = BI.map(cor, function (i, t) {
                        return BI.extend(t, {
                            value: t.value.div(magnify),
                            width: 1,
                            label: {
                                style: self.config.chartFont,
                                text: t.text,
                                align: "left"
                            }
                        });
                    });
                }
            });
        }

        function formatNumberLevelInYaxis (type, position, formatter) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, da) {
                    if (position === item.yAxis) {
                        da.y = self.formatXYDataWithMagnify(da.y, magnify);
                    }
                });
            });
            config.plotOptions.tooltip.formatter.valueFormat = formatter;
        }

        function getXYAxisUnit (numberLevelType, position) {
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
                self.config.xAxisUnit !== "" && (unit = unit + self.config.xAxisUnit);
            }
            if (position === self.constants.LEFT_AXIS) {
                self.config.leftYAxisUnit !== "" && (unit = unit + self.config.leftYAxisUnit);
            }
            return unit === "" ? unit : "(" + unit + ")";
        }
    },

    _formatItems: function (data) {
        var o = this.options;
        var items = [];
        BI.each(data, function (idx, item) {
            items = BI.concat(items, item);
        });
        if (BI.isEmptyArray(items)) {
            return [];
        }
        if (items.length === 1) {
            return [items];
        }
        var colors = this.config.chartColor || [];
        if (BI.isEmptyArray(colors)) {
            colors = ["#5caae4"];
        }
        var seriesMinus = [];
        BI.each(items[0].data, function (idx, item) {
            var res = items[1].data[idx].y - item.y;
            seriesMinus.push({
                x: items[1].data[idx].x,
                y: res,
                targetIds: items[1].data[idx].targetIds
            });
        });
        items[1] = {
            data: seriesMinus,
            name: items[1].name,
            stack: "stackedArea",
            fillColor: colors[0]
        };
        BI.each(items, function (idx, item) {
            if (idx === 0) {
                BI.extend(item, {
                    name: items[0].name,
                    fillColorOpacity: 0,
                    stack: "stackedArea",
                    marker: {enabled: false},
                    fillColor: "#000000"
                });
            }
        });
        return [items];
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            xAxisTitle: options.xAxisTitle || "",
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            showDataLabel: options.showDataLabel || false,
            showGridLine: BI.isNull(options.showGridLine) ? true : options.showGridLine,
            textDirection: options.textDirection || 0,
            cordon: options.cordon || [],
            lineWidth: BI.isNull(options.lineWidth) ? 1 : options.lineWidth,
            showLabel: BI.isNull(options.showLabel) ? true : options.showLabel,
            enableTick: BI.isNull(options.enableTick) ? true : options.enableTick,
            enableMinorTick: BI.isNull(options.enableMinorTick) ? true : options.enableMinorTick,
            numSeparators: options.numSeparators || false,
            chartFont: options.chartFont || c.FONT_STYLE,
            nullContinue: options.nullContinue || false
        };
        this.options.items = items;

        var types = [];
        var type = [];
        BI.each(items, function (idx, axisItems) {
            type.push(BICst.WIDGET.AREA);
        });
        if (BI.isNotEmptyArray(type)) {
            types.push(type);
        }

        this.combineChart.populate(this._formatItems(items), types);
    },

    resize: function () {
        this.combineChart.resize();
    },

    magnify: function () {
        this.combineChart.magnify();
    }
});
BI.RangeAreaChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.range_area_chart", BI.RangeAreaChart);