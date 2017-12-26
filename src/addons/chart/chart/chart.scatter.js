/**
 * 图表控件
 * @class BI.ScatterChart
 * @extends BI.Widget
 */
BI.ScatterChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.ScatterChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-scatter-chart"
        });
    },

    _init: function () {
        BI.ScatterChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "value",
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
            self.fireEvent(BI.ScatterChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj);
        });
    },


    _formatConfig: function (config, items) {
        var self = this;
        delete config.zoom;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        config.plotOptions.marker = {symbol: "circle", radius: 4.5, enabled: true};
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.plotOptions.dataLabels.formatter.identifier = "${X}${Y}";

        config.yAxis = this.yAxis;
        config.xAxis = this.xAxis;

        config.yAxis[0].formatter = self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators);
        formatNumberLevelInYaxis(this.config.leftYAxisNumberLevel);
        config.yAxis[0].title.text = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS);
        config.yAxis[0].title.text = this.config.showLeftYAxisTitle === true ? this.config.leftYAxisTitle + config.yAxis[0].title.text : config.yAxis[0].title.text;
        config.yAxis[0].gridLineWidth = this.config.showGridLine === true ? 1 : 0;
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        config.yAxis[0].maxWidth = "40%";

        config.xAxis[0].formatter = self.formatTickInXYaxis(this.config.xAxisStyle, this.config.xAxisNumberLevel, this.config.rightNumSeparators);
        formatNumberLevelInXaxis(this.config.xAxisNumberLevel);
        config.xAxis[0].title.text = getXYAxisUnit(this.config.xAxisNumberLevel, this.constants.X_AXIS);
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle + config.xAxis[0].title.text : config.xAxis[0].title.text;
        config.xAxis[0].title.align = "center";
        config.xAxis[0].gridLineWidth = this.config.showGridLine === true ? 1 : 0;
        config.xAxis[0].maxHeight = "40%";
        config.chartType = "scatter";

        if (BI.isNotEmptyArray(this.config.tooltip)) {
            config.plotOptions.tooltip.formatter = function () {
                var y = self.formatTickInXYaxis(self.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators)(this.y);
                var x = self.formatTickInXYaxis(self.config.xAxisStyle, self.config.xAxisNumberLevel, self.config.rightNumSeparators)(this.x);
                return this.seriesName + "<div>(X)" + self.config.tooltip[0]
                    + ":" + x + "</div><div>(Y)" + self.config.tooltip[1] + ":" + y + "</div>";
            };
        }

        if (config.plotOptions.dataLabels.enabled === true) {
            BI.each(items, function (idx, item) {
                item.dataLabels = {
                    style: self.config.chartFont,
                    align: "outside",
                    autoAdjust: true,
                    enabled: true,
                    formatter: {
                        identifier: "${X}${Y}",
                        XFormat: function () {
                            return BI.contentFormat(arguments[0], "#.##;-#.##");
                        },
                        YFormat: function () {
                            return BI.contentFormat(arguments[0], "#.##;-#.##");
                        }
                    }
                };
                item.dataLabels.formatter.XFormat = config.xAxis[0].formatter;
                item.dataLabels.formatter.YFormat = config.yAxis[0].formatter;
            });
        }

        // 全局样式图表文字
        config.legend.style = this.config.chartFont;
        config.yAxis[0].title.style = config.yAxis[0].labelStyle = this.config.chartFont;
        config.xAxis[0].title.style = config.xAxis[0].labelStyle = this.config.chartFont;

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

        function formatNumberLevelInXaxis (type) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, da) {
                    da.x = self.formatXYDataWithMagnify(da.x, magnify);
                });
            });
        }

        function formatNumberLevelInYaxis (type) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, da) {
                    da.y = self.formatXYDataWithMagnify(da.y, magnify);
                });
            });
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
            if (position === self.constants.RIGHT_AXIS) {
                self.config.rightYAxisUnit !== "" && (unit = unit + self.config.rightYAxisUnit);
            }
            return unit === "" ? unit : "(" + unit + ")";
        }
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            chartColor: options.chartColor || [],
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            xAxisStyle: options.xAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            xAxisNumberLevel: options.xAxisNumberLevel || c.NORMAL,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            xAxisTitle: options.xAxisTitle || "",
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            showDataLabel: options.showDataLabel || false,
            showGridLine: BI.isNull(options.showGridLine) ? true : options.showGridLine,
            cordon: options.cordon || [],
            tooltip: options.tooltip || [],
            numSeparators: options.numSeparators || false,
            rightNumSeparators: options.rightNumSeparators || false,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;
        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.SCATTER);
            });
            types.push(type);
        });
        this.combineChart.populate(items, types);
    },

    resize: function () {
        this.combineChart.resize();
    },

    magnify: function () {
        this.combineChart.magnify();
    }
});
BI.ScatterChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.scatter_chart", BI.ScatterChart);