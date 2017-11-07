/**
 * 图表控件
 * @class BI.FallAxisChart
 * @extends BI.Widget
 */
BI.FallAxisChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.FallAxisChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-fall-axis-chart"
        })
    },

    _init: function () {
        BI.FallAxisChart.superclass._init.apply(this, arguments);
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
            self.fireEvent(BI.FallAxisChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function(config, items){
        var self = this, o = this.options;
        var yTitle = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS);
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
        config.legend.enabled = false;
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.dataSheet.enabled = this.config.showDataTable;
        if(config.dataSheet.enabled === true){
            config.xAxis[0].showLabel = false;
        }
        config.zoom.zoomTool.enabled = this.config.showZoom;
        if(this.config.showZoom === true){
            delete config.dataSheet;
            delete config.zoom.zoomType;
        }

        config.yAxis = this.yAxis;
        BI.extend(config.yAxis[0], {
            lineWidth: this.config.lineWidth,
            showLabel: this.config.showLabel,
            enableTick: this.config.enableTick,
            enableMinorTick: this.config.enableMinorTick,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            formatter: self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators)
        });
        formatNumberLevelInYaxis(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS, config.yAxis[0].formatter);
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        config.yAxis[0].title.text = this.config.showLeftYAxisTitle === true ? this.config.leftYAxisTitle + yTitle : yTitle;

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            enableMinorTick: this.config.enableMinorTick,
            labelRotation: this.config.textDirection,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        //为了给数据标签加个%,还要遍历所有的系列，唉
        if(config.plotOptions.dataLabels.enabled === true){
            BI.each(items, function(idx, item){
                if(idx === 0){
                    item.dataLabels = {};
                    return;
                }
                item.dataLabels = {
                    "style": self.config.chartFont,
                    "align": "outside",
                    "autoAdjust": true,
                    enabled: true,
                    formatter: {
                        identifier: "${VALUE}",
                        valueFormat: config.yAxis[0].formatter
                    }
                };
            });
        }

        //全局样式的图表文字
        this.setFontStyle(this.config.chartFont, config);

        return [items, config];

        function formatChartStyle(){
            switch (self.config.chartStyle) {
                case BICst.CHART_STYLE.STYLE_GRADUAL:
                    return "gradual";
                case BICst.CHART_STYLE.STYLE_NORMAL:
                default:
                    return "normal";
            }
        }

        function formatCordon(){
            BI.each(self.config.cordon, function(idx, cor){
                if(idx === 0 && self.xAxis.length > 0){
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
                    self.xAxis[0].plotLines = BI.map(cor, function(i, t){
                        return BI.extend(t, {
                            value: t.value.div(magnify),
                            width: 1,
                            label: {
                                "style": self.config.chartFont,
                                "text": t.text,
                                "align": "top"
                            }
                        });
                    });
                }
                if(idx > 0 && self.yAxis.length >= idx){
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
                    self.yAxis[idx - 1].plotLines = BI.map(cor, function(i, t){
                        return BI.extend(t, {
                            value: t.value.div(magnify),
                            width: 1,
                            label: {
                                "style": self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }

        function formatNumberLevelInYaxis(type, position, formatter){
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

        function getXYAxisUnit(numberLevelType, position){
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
            if(position === self.constants.X_AXIS){
                self.config.xAxisUnit !== "" && (unit = unit + self.config.xAxisUnit)
            }
            if(position === self.constants.LEFT_AXIS){
                self.config.leftYAxisUnit !== "" && (unit = unit + self.config.leftYAxisUnit)
            }
            if(position === self.constants.RIGHT_AXIS){
                self.config.rightYAxisUnit !== "" && (unit = unit + self.config.rightYAxisUnit)
            }
            return unit === "" ? unit : "(" + unit + ")";
        }
    },

    _formatItems: function(items){
        var o = this.options;
        if(BI.isEmptyArray(items)){
            return [];
        }
        items = items[0];
        var tables = [], sum = 0;
        var colors = this.config.chartColor || [];
        if(BI.isEmptyArray(colors)){
            colors = ["rgb(152, 118, 170)", "rgb(0, 157, 227)"];
        }
        BI.each(items, function(idx, item){
            BI.each(item.data, function(i, t){
                if(t.y < 0){
                    tables.push([t.x, t.y, sum + t.y, t]);
                }else{
                    tables.push([t.x, t.y, sum, t]);
                }
                sum += t.y;
            });
        });

        return [BI.map(BI.makeArray(2, null), function(idx, item){
            return {
                "data": BI.map(tables, function(id, cell){
                    var axis = BI.extend({}, cell[3], {
                        x: cell[0],
                        y: Math.abs(cell[2 - idx])
                    });
                    if(idx === 1){
                        axis.color = cell[2 - idx] < 0 ? colors[1] : colors[0];
                    }else{
                        axis.color = "rgba(0,0,0,0)";
                        axis.borderColor = "rgba(0,0,0,0)";
                        axis.borderWidth = 0;
                        axis.clickColor = "rgba(0,0,0,0)";
                        axis.mouseOverColor = "rgba(0,0,0,0)";
                        axis.tooltip = {
                            enable: false
                        }
                    }
                    return axis;
                }),
                stack: "stackedFall",
                name: idx === 1 ? items[0].name : BI.UUID()
            };
        })];
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            chartColor: options.chartColor || ["#5caae4", "#70cc7f", "#ebbb67", "#e97e7b", "#6ed3c9"],
            chartStyle: options.chartStyle || c.NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            xAxisTitle: options.xAxisTitle || "",
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
        this.options.items = items;
        var types = [];
        BI.each(items, function(idx, axisItems){
            var type = [];
            BI.each(axisItems, function(id, item){
                type.push(BICst.WIDGET.AXIS);
            });
            types.push(type);
        });

        this.combineChart.populate(this._formatItems(items), types);
    },

    resize: function () {
        this.combineChart.resize();
    },

    magnify: function(){
        this.combineChart.magnify();
    }
});
BI.FallAxisChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.fall_axis_chart', BI.FallAxisChart);