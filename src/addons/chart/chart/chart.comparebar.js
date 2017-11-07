/**
 * 图表控件
 * @class BI.CompareBarChart
 * @extends BI.Widget
 */
BI.CompareBarChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.CompareBarChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-compare-bar-chart"
        })
    },

    _init: function () {
        BI.CompareBarChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "value",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            formatter: function () {
                return this > 0 ? this : (-1) * this;
            },
            gridLineWidth: 0
        }];
        this.yAxis = [{
            type: "category",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            gridLineWidth: 0,
            position: "left"
        }];
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.CompareBarChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        var yTitle = getXYAxisUnit(this.config.xAxisNumberLevel, this.constants.LEFT_AXIS);
        var xTitle = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.X_AXIS);
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;

        config.yAxis = this.yAxis;
        config.yAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle + yTitle : yTitle;
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        BI.extend(config.yAxis[0], {
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            maxWidth: '40%'
        });

        self.formatNumberLevelInXaxis(items, this.config.leftYAxisNumberLevel);
        config.xAxis[0].title.text = this.config.showLeftYAxisTitle === true ? this.config.leftYAxisTitle + xTitle : xTitle;
        config.xAxis[0].title.align = "center";
        BI.extend(config.xAxis[0], {
            formatter: self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators, true),
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            lineWidth: this.config.lineWidth,
            showLabel: this.config.showLabel,
            enableTick: this.config.enableTick,
            enableMinorTick: this.config.enableMinorTick
        });

        config.chartType = "bar";
        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabelForAxis(config.plotOptions.dataLabels.enabled, items, config.xAxis[0].formatter, this.config.chartFont);

        config.plotOptions.tooltip.formatter.valueFormat = config.xAxis[0].formatter;

        //全局样式的图表文字
        this.setFontStyle(this.config.chartFont, config);

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

        function formatCordon() {
            BI.each(self.config.cordon, function (idx, cor) {
                if (idx === 0 && self.xAxis.length > 0) {
                    var magnify = self.calcMagnify(self.config.leftYAxisNumberLevel);
                    self.xAxis[0].plotLines = BI.map(cor, function (i, t) {
                        return BI.extend(t, {
                            value: t.value.div(magnify),
                            width: 1,
                            label: {
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "top"
                            }
                        });
                    });
                }
                if (idx > 0 && self.yAxis.length >= idx) {
                    var magnify = 1;
                    switch (idx - 1) {
                        case self.constants.LEFT_AXIS:
                            magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
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
                self.config.leftYAxisUnit !== "" && (unit = unit + self.config.leftYAxisUnit)
            }
            if (position === self.constants.LEFT_AXIS) {
                self.config.xAxisUnit !== "" && (unit = unit + self.config.xAxisUnit)
            }
            if (position === self.constants.RIGHT_AXIS) {
                self.config.rightYAxisUnit !== "" && (unit = unit + self.config.rightYAxisUnit)
            }
            return unit === "" ? unit : "(" + unit + ")";
        }
    },

    _formatItems: function (items) {
        var result = [];
        var i = BI.UUID();
        BI.each(items, function (idx, item) {
            BI.each(item, function (id, it) {
                BI.each(it.data, function (i, t) {
                    var tmp = t.x;
                    t.x = t.y;
                    t.y = tmp;
                    if (idx === 0) {
                        t.x = -t.x;
                    }
                });
                it.stack = i;
            })
        });
        BI.each(items, function (idx, item) {
            result = BI.concat(result, item);
        });
        return [result];
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.STYLE_NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            xAxisStyle: options.xAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            xAxisNumberLevel: options.xAxisNumberLevel || c.NORMAL,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            xAxisTitle: options.xAxisTitle || "",
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            showDataLabel: options.showDataLabel || false,
            showDataTable: options.showDataTable || false,
            showGridLine: BI.isNull(options.showGridLine) ? true : options.showGridLine,
            showZoom: options.showZoom || false,
            textDirection: options.textDirection || 0,
            cordon: options.cordon || [],
            lineWidth: BI.isNull(options.lineWidth) ? 1 : options.lineWidth,
            showLabel: BI.isNull(options.showLabel) ? true : options.showLabel,
            enableTick: BI.isNull(options.enableTick) ? true : options.enableTick,
            enableMinorTick: BI.isNull(options.enableMinorTick) ? true : options.enableMinorTick,
            numSeparators: options.numSeparators || false,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = this._formatItems(items);
        var types = [];
        BI.each(this.options.items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.BAR);
            });
            types.push(type);
        });
        this.combineChart.populate(this.options.items, types);
    },

    resize: function () {
        this.combineChart.resize();
    },

    magnify: function () {
        this.combineChart.magnify();
    }
});
BI.CompareBarChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.compare_bar_chart', BI.CompareBarChart);