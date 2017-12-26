/**
 * 图表控件
 * @class BI.MultiAxisChart
 * @extends BI.Widget
 * leftYxis 左值轴属性
 * rightYxis 右值轴属性
 * xAxis    分类轴属性
 */
BI.MultiAxisCombineChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiAxisCombineChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-axis-combine-chart"
        });
    },

    _init: function () {
        BI.MultiAxisCombineChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "category",
            title: {
                style: {fontFamily: "inherit", color: "#808080", fontSize: "12px", fontWeight: ""}
            },
            labelStyle: {
                fontFamily: "inherit", color: "#808080", fontSize: "12px"
            },
            position: "bottom",
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
            self.fireEvent(BI.MultiAxisCombineChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj);
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        config.colors = this.config.chartColor;
        config.style = this.formatChartStyle();
        this.formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.plotOptions.connectNulls = this.config.nullContinue;
        config.dataSheet.enabled = this.config.showDataTable;
        config.xAxis[0].showLabel = !config.dataSheet.enabled;
        config.zoom.zoomTool.enabled = this.config.showZoom;
        if (this.config.showZoom === true) {
            delete config.dataSheet;
            delete config.zoom.zoomType;
        }

        config.yAxis = this.yAxis;
        BI.each(config.yAxis, function (idx, axis) {
            var title = "";
            switch (axis.axisIndex) {
                case self.constants.LEFT_AXIS:
                    title = self.getXYAxisUnit(self.config.leftYAxisNumberLevel, self.constants.LEFT_AXIS);
                    axis.title.text = self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + title : title;
                    axis.title.rotation = self.constants.ROTATION;
                    axis.labelStyle.color = axis.lineColor = axis.tickColor = config.colors[0];
                    BI.extend(axis, {
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        reversed: self.config.leftYAxisReversed,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators)
                    });
                    self.formatNumberLevelInYaxis(config, items, self.config.leftYAxisNumberLevel, idx, axis.formatter);
                    break;
                case self.constants.RIGHT_AXIS:
                    title = self.getXYAxisUnit(self.config.rightYAxisNumberLevel, self.constants.RIGHT_AXIS);
                    axis.title.text = self.config.showRightYAxisTitle === true ? self.config.rightYAxisTitle + title : title;
                    axis.title.rotation = self.constants.ROTATION;
                    axis.labelStyle.color = axis.lineColor = axis.tickColor = config.colors[1];
                    BI.extend(axis, {
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        reversed: self.config.rightYAxisReversed,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.rightYAxisStyle, self.config.rightYAxisNumberLevel, self.config.rightNumSeparators)
                    });
                    self.formatNumberLevelInYaxis(config, items, self.config.rightYAxisNumberLevel, idx, axis.formatter);
                    break;
                case self.constants.RIGHT_AXIS_SECOND:
                    title = self.getXYAxisUnit(self.config.rightYAxisSecondNumberLevel, self.constants.RIGHT_AXIS_SECOND);
                    axis.title.text = self.config.showRightYAxisSecondTitle === true ? self.config.rightYAxisSecondTitle + title : title;
                    axis.title.rotation = self.constants.ROTATION;
                    axis.labelStyle.color = axis.lineColor = axis.tickColor = config.colors[2];
                    BI.extend(axis, {
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        reversed: self.config.rightYAxisSecondReversed,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.rightYAxisSecondStyle, self.config.rightYAxisSecondNumberLevel, self.config.rightNumSeparators)
                    });
                    self.formatNumberLevelInYaxis(config, items, self.config.rightYAxisSecondNumberLevel, idx, axis.formatter);
                    break;
                default:
                    break;
            }
        });
        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            enableMinorTick: this.config.enableMinorTick,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: "40%"
        });

        // 为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

        // 全局样式的图表文字
        if (config.dataSheet) {
            config.dataSheet.style = this.config.chartFont;
        }
        config.xAxis[0].title.style = config.xAxis[0].labelStyle = this.config.chartFont;
        config.legend.style = this.config.chartFont;
        config.plotOptions.dataLabels.style = this.config.chartFont;
        BI.each(config.yAxis, function (idx, axis) {
            axis.title.style = self.config.chartFont;
        });

        return [items, config];
    },

    formatChartStyle: function () {
        switch (this.config.chartStyle) {
            case BICst.CHART_STYLE.STYLE_GRADUAL:
                return "gradual";
            case BICst.CHART_STYLE.STYLE_NORMAL:
            default:
                return "normal";
        }
    },

    formatCordon: function () {
        var self = this;
        var magnify = 1;
        BI.each(this.config.cordon, function (idx, cor) {
            if (idx === 0 && self.xAxis.length > 0) {
                magnify = self.calcMagnify(self.config.xAxisNumberLevel);
                self.xAxis[0].plotLines = BI.map(cor, function (i, t) {
                    return BI.extend(t, {
                        value: t.value.div(magnify),
                        width: 1,
                        label: {
                            style: {
                                fontFamily: "inherit",
                                color: "#808080",
                                fontSize: "12px",
                                fontWeight: ""
                            },
                            text: t.text,
                            align: "top"
                        }
                    });
                });
            }
            if (idx > 0 && self.yAxis.length >= idx) {
                magnify = 1;
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
                    default:
                        break;
                }
                self.yAxis[idx - 1].plotLines = BI.map(cor, function (i, t) {
                    return BI.extend(t, {
                        value: t.value.div(magnify),
                        width: 1,
                        label: {
                            style: {
                                fontFamily: "inherit",
                                color: "#808080",
                                fontSize: "12px",
                                fontWeight: ""
                            },
                            text: t.text,
                            align: "left"
                        }
                    });
                });
            }
        });
    },

    getXYAxisUnit: function (numberLevelType, position) {
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
            default:
                break;
        }
        if (position === this.constants.X_AXIS) {
            this.config.xAxisUnit !== "" && (unit = unit + this.config.xAxisUnit);
        }
        if (position === this.constants.LEFT_AXIS) {
            this.config.leftYAxisUnit !== "" && (unit = unit + this.config.leftYAxisUnit);
        }
        if (position === this.constants.RIGHT_AXIS) {
            this.config.rightYAxisUnit !== "" && (unit = unit + this.config.rightYAxisUnit);
        }
        if (position === this.constants.RIGHT_AXIS_SECOND) {
            this.config.rightYAxisSecondUnit !== "" && (unit = unit + this.config.rightYAxisSecondUnit);
        }
        return unit === "" ? unit : "(" + unit + ")";
    },

    populate: function (items, options, types) {
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            rightYAxisTitle: options.rightYAxisTitle || "",
            rightYAxisSecondTitle: options.rightYAxisSecondTitle || "",
            chartColor: options.chartColor || ["#5caae4", "#70cc7f", "#ebbb67", "#e97e7b", "#6ed3c9"],
            chartStyle: options.chartStyle || c.NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            rightYAxisStyle: options.rightYAxisStyle || c.NORMAL,
            rightYAxisSecondStyle: options.rightYAxisSecondStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            showRightYAxisTitle: options.showRightYAxisTitle || false,
            showRightYAxisSecondTitle: options.showRightYAxisSecondTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            rightYAxisReversed: options.rightYAxisReversed || false,
            rightYAxisSecondReversed: options.rightYAxisSecondReversed || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            rightYAxisNumberLevel: options.rightYAxisNumberLevel || c.NORMAL,
            rightYAxisSecondNumberLevel: options.rightYAxisSecondNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            rightYAxisUnit: options.rightYAxisUnit || "",
            rightYAxisSecondUnit: options.rightYAxisSecondUnit || "",
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
            rightNumSeparators: options.rightNumSeparators || false,
            chartFont: options.chartFont || c.FONT_STYLE,
            nullContinue: options.nullContinue || false
        };
        this.options.items = items;

        this.yAxis = [];
        BI.each(types, function (idx, type) {
            if (BI.isEmptyArray(type)) {
                return;
            }
            var newYAxis = {
                type: "value",
                title: {
                    style: {fontFamily: "inherit", color: "#808080", fontSize: "12px", fontWeight: ""}
                },
                labelStyle: {
                    fontFamily: "inherit", color: "#808080", fontSize: "12px"
                },
                position: idx > 0 ? "right" : "left",
                lineWidth: 1,
                axisIndex: idx,
                gridLineWidth: 0
            };
            self.yAxis.push(newYAxis);
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
BI.MultiAxisCombineChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_axis_combine_chart", BI.MultiAxisCombineChart);