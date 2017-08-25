/**
 * 图表控件
 * @class BI.Chart
 * @extends BI.Widget
 */
BI.Chart = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.Chart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-chart"
        })
    },

    _init: function () {
        BI.Chart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.isSetOptions = false;
        this.vanCharts = VanCharts.init(self.element[0]);

        this._resizer = BI.debounce(function () {
            if (self.element.width() > 0 && self.element.height() > 0) {
                self.vanCharts.resize();
            }
        }, 30);
        BI.ResizeDetector.addResizeListener(this, function (e) {
            self._resizer();
        });
    },

    resize: function () {
        if (this.isSetOptions === true) {
            this._resizer();
        }
    },

    magnify: function () {
        this.vanCharts.refreshRestore()
    },

    populate: function (items, options) {
        var self = this, o = this.options;
        o.items = items;
        this.config = options || {};
        this.config.series = o.items;

        var setOptions = function () {
            self.vanCharts.setOptions(self.config);
            self.isSetOptions = true;
        };
        BI.nextTick(setOptions);
    }
});
BI.Chart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.chart', BI.Chart);/**
 * 图表控件
 * @class BI.CombineChart
 * @extends BI.Widget
 */
BI.CombineChart = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.CombineChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-combine-chart",
            items: [],
            xAxis: [{type: "category"}],
            yAxis: [{type: "value"}],
            types: [[], []],
            popupItemsGetter: BI.emptyFn,
            formatConfig: BI.emptyFn
        })
    },

    _init: function () {
        BI.CombineChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        //图可配置属性
        this.CombineChart = BI.createWidget({
            type: "bi.chart",
            element: this.element
        });
        this.CombineChart.on(BI.Chart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.CombineChart.EVENT_CHANGE, obj);
        });

        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
    },

    _formatItems: function (items) {
        var result = [], self = this, o = this.options;
        var yAxisIndex = 0;
        BI.each(items, function (i, belongAxisItems) {
            var combineItems = BI.ChartCombineFormatItemFactory.combineItems(o.types[i], belongAxisItems);
            BI.each(combineItems, function (j, axisItems) {
                if (BI.isArray(axisItems)) {
                    result = BI.concat(result, axisItems);
                } else {
                    result.push(BI.extend(axisItems, {"yAxis": yAxisIndex}));
                }
            });
            if (BI.isNotEmptyArray(combineItems)) {
                yAxisIndex++;
            }
        });
        var config = BI.ChartCombineFormatItemFactory.combineConfig();
        config.plotOptions.click = function () {
            var data = BI.clone(this.options);
            data.toolTipRect = this.getTooltipRect();
            var items = o.popupItemsGetter(data);
            if (items && items.length === 1) {
                self.fireEvent(BI.CombineChart.EVENT_ITEM_CLICK, BI.extend({}, items[0], data));
            }
            if (items && items.length > 1) {
                self._createPopup(items, data.toolTipRect, data);
            }
            self.fireEvent(BI.CombineChart.EVENT_CHANGE, data);
        };
        return [result, config];
    },

    _createPopup: function (items, rect, opt) {
        var self = this;
        if (this.combo) {
            this.combo.destroy();
        }
        this._doDestroy = true;
        this.combo = BI.createWidget({
            type: "bi.combo",
            direction: "bottom",
            isNeedAdjustWidth: false,
            popup: {
                el: BI.createWidget({
                    type: "bi.vertical",
                    cls: "bi-linkage-list",
                    items: BI.map(items, function (i, item) {
                        return {
                            el: BI.extend({
                                type: "bi.text_button",
                                cls: "bi-linkage-list-item",
                                height: 30,
                                handler: function () {
                                    self.fireEvent(BI.CombineChart.EVENT_ITEM_CLICK, BI.extend({}, item, opt));
                                    self.combo.destroy();
                                },
                                hgap: 10
                            }, item)
                        }
                    })
                })
            },
            width: 0
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: this.combo,
                top: rect.y,
                left: rect.x
            }]
        });
        this.combo.element.hover(function () {
            self._doDestroy = false;
        }, function () {
            self._doDestroy = true;
            self._debounce2Destroy();
        });
        this._debounce2Destroy = BI.debounce(BI.bind(destroyCombo, this.combo), 3000);
        this.combo.showView();
        this._debounce2Destroy();

        function destroyCombo() {
            if (self._doDestroy) {
                this.destroy();
            }
        }
    },

    setTypes: function (types) {
        this.options.types = types || [[]];
    },

    populate: function (items, types) {
        var o = this.options;
        if (BI.isNotNull(types)) {
            this.setTypes(types);
        }
        var opts = this._formatItems(items);
        BI.extend(opts[1], {
            xAxis: o.xAxis,
            yAxis: o.yAxis
        });
        var result = o.formatConfig(opts[1], opts[0]) || opts;
        this.CombineChart.populate(result[0], result[1]);
    },

    resize: function () {
        this.CombineChart.resize();
    },

    magnify: function () {
        this.CombineChart.magnify();
    }
});
BI.CombineChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.CombineChart.EVENT_ITEM_CLICK = "EVENT_ITEM_CLICK";
BI.shortcut('bi.combine_chart', BI.CombineChart);BI.ChartCombineFormatItemFactory = {
    combineItems: function (types, items) {
        var calItems = BI.values(items);
        return BI.map(calItems, function (idx, item) {
            return BI.ChartCombineFormatItemFactory.formatItems(types[idx], item);
        });
    },

    formatItems: function (type, items) {
        var item = {};
        switch (type) {
            case BICst.WIDGET.BAR:
            case BICst.WIDGET.ACCUMULATE_BAR:
            case BICst.WIDGET.COMPARE_BAR:
                item = BI.extend({"type": "bar"}, items);
                break;
            case BICst.WIDGET.BUBBLE:
                item = BI.extend({"type": "bubble"}, items);
                break;
            case BICst.WIDGET.FORCE_BUBBLE:
                item = BI.extend({"type": "forceBubble"}, items);
                break;
            case BICst.WIDGET.SCATTER:
                item = BI.extend({"type": "scatter"}, items);
                break;
            case BICst.WIDGET.AXIS:
            case BICst.WIDGET.ACCUMULATE_AXIS:
            case BICst.WIDGET.PERCENT_ACCUMULATE_AXIS:
            case BICst.WIDGET.COMPARE_AXIS:
            case BICst.WIDGET.FALL_AXIS:
                item = BI.extend({"type": "column"}, items);
                break;
            case BICst.WIDGET.LINE:
                item = BI.extend({"type": "line"}, items);
                break;
            case BICst.WIDGET.AREA:
            case BICst.WIDGET.ACCUMULATE_AREA:
            case BICst.WIDGET.COMPARE_AREA:
            case BICst.WIDGET.RANGE_AREA:
            case BICst.WIDGET.PERCENT_ACCUMULATE_AREA:
                item = BI.extend({"type": "area"}, items);
                break;
            case BICst.WIDGET.DONUT:
                item = BI.extend({"type": "pie"}, items);
                break;
            case BICst.WIDGET.RADAR:
            case BICst.WIDGET.ACCUMULATE_RADAR:
                item = BI.extend({"type": "radar"}, items);
                break;
            case BICst.WIDGET.PIE:
                item = BI.extend({"type": "pie"}, items);
                break;
            case BICst.WIDGET.DASHBOARD:
                item = BI.extend({"type": "gauge"}, items);
                break;
            case BICst.WIDGET.MAP:
                item = BI.extend({"type": "areaMap"}, items);
                break;
            case BICst.WIDGET.GIS_MAP:
                item = BI.extend({"type": "pointMap"}, items);
                break;
            default:
                item = BI.extend({"type": "column"}, items);
                break;
        }
        return item;
    },

    combineConfig: function () {
        return {
            "title": "",
            "chartType": "column",
            "plotOptions": {
                "rotatable": false,
                "startAngle": 0,
                "borderRadius": 0,
                "endAngle": 360,
                "innerRadius": "0.0%",
                "layout": "horizontal",
                "hinge": "rgb(101,107,109)",
                "dataLabels": {
                    "autoAdjust": true,
                    "style": {"fontFamily": "inherit", "color": "inherit", "fontSize": "12px"},
                    "formatter": {
                        "identifier": "${VALUE}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat,
                        "XFormat": this._contentFormat2Decimal,
                        "YFormat": this._contentFormat2Decimal,
                        "sizeFormat": this._contentFormat2Decimal
                    },
                    "align": "outside",
                    "enabled": false
                },
                "percentageLabel": {
                    "formatter": {
                        "identifier": "${PERCENT}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "style": {
                        "fontFamily": "inherit", "color": "inherit", "fontSize": "12px"
                    },
                    "align": "bottom",
                    "enabled": true
                },
                "valueLabel": {
                    "formatter": {
                        "identifier": "${SERIES}${VALUE}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "backgroundColor": "rgb(255,255,0)",
                    "style": {
                        "fontFamily": "inherit", "color": "inherit", "fontSize": "12px"
                    },
                    "align": "inside",
                    "enabled": true
                },
                "hingeBackgroundColor": "rgb(220,242,249)",
                "seriesLabel": {
                    "formatter": {
                        "identifier": "${CATEGORY}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "style": {
                        "fontFamily": "inherit", "color": "inherit", "fontSize": "12px"
                    },
                    "align": "bottom",
                    "enabled": true
                },
                "paneBackgroundColor": "rgb(252,252,252)",
                "needle": "rgb(229,113,90)",
                "large": false,
                "connectNulls": false,
                "shadow": true,
                "curve": false,
                "sizeBy": "area",
                "tooltip": {
                    "formatter": {
                        "identifier": "${SERIES}${X}${Y}${SIZE}{CATEGORY}${SERIES}${VALUE}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat,
                        "XFormat": this._contentFormat2Decimal,
                        "sizeFormat": this._contentFormat2Decimal,
                        "YFormat": this._contentFormat2Decimal
                    },
                    "shared": false,
                    "padding": 5,
                    "backgroundColor": "rgba(0,0,0,0.4980392156862745)",
                    "borderColor": "rgb(0,0,0)",
                    "shadow": false,
                    "borderRadius": 2,
                    "borderWidth": 0,
                    "follow": false,
                    "enabled": true,
                    "animation": true,
                    "style": {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3",
                        "color": "#c4c6c6",
                        "fontSize": "12px",
                        "fontWeight": ""
                    }
                },
                "maxSize": 80,
                "fillColorOpacity": 0.5,
                "step": false,
                "force": false,
                "minSize": 15,
                "displayNegative": true,
                "categoryGap": "16.0%",
                "borderColor": "rgb(255,255,255)",
                "borderWidth": 1,
                "gap": "22.0%",
                "animation": true,
                "lineWidth": 2,
                "bubble": {
                    "large": false,
                    "connectNulls": false,
                    "shadow": true,
                    "curve": false,
                    "sizeBy": "area",
                    "maxSize": 80,
                    "minSize": 15,
                    "lineWidth": 0,
                    "animation": true,
                    "fillColorOpacity": 0.699999988079071,
                    "marker": {
                        "symbol": "circle",
                        "radius": 28.39695010101295,
                        "enabled": true
                    }
                }
            },
            "dTools": {
                "enabled": false,
                "style": {
                    "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3",
                    "color": "#1a1a1a",
                    "fontSize": "12px"
                },
                "backgroundColor": 'white'
            },
            "dataSheet": {
                "enabled": false,
                "borderColor": "rgb(0,0,0)",
                "borderWidth": 1,
                "formatter": this._contentFormat2Decimal,
                "style": {
                    "fontFamily": "inherit", "color": "inherit", "fontSize": "12px"
                }
            },
            "borderColor": "rgb(238,238,238)",
            "shadow": false,
            "legend": {
                "borderColor": "rgb(204,204,204)",
                "borderRadius": 0,
                "shadow": false,
                "borderWidth": 0,
                "visible": true,
                "style": {
                    "fontFamily": "inherit", "color": "inherit", "fontSize": "12px"
                },
                "position": "right",
                "enabled": false
            },
            "rangeLegend": {
                "range": {
                    "min": 0,
                    "color": [
                        [
                            0,
                            "rgb(182,226,255)"
                        ],
                        [
                            0.5,
                            "rgb(109,196,255)"
                        ],
                        [
                            1,
                            "rgb(36,167,255)"
                        ]
                    ],
                    "max": 266393
                },
                "enabled": false
            },
            "zoom": {"zoomType": "xy", "zoomTool": {"visible": false, "resize": true, "from": "", "to": ""}},
            "plotBorderColor": "rgba(255,255,255,0)",
            "tools": {
                "hidden": false,
                "toImage": {"enabled": false},
                "sort": {"enabled": false},
                "fullScreen": {"enabled": false},
                "refresh": {
                    "enabled": false
                }
            },
            "plotBorderWidth": 0,
            "style": "normal",
            "colors": ["rgb(99,178,238)", "rgb(118,218,145)"],
            "borderRadius": 0,
            "borderWidth": 0,
            "plotShadow": false,
            "plotBorderRadius": 0
        };
    },

    _contentFormat: function () {
        return BI.contentFormat(arguments[0], '')
    },

    _contentFormat2Decimal: function () {
        return BI.contentFormat(arguments[0], '#.##;-#.##')
    },

    _contentFormatPercentage: function () {
        return BI.contentFormat(arguments[0], '#.##%;-#.##%')
    }
};/**
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
/**
 * 图表控件
 * @class BI.AccumulateAreaChart
 * @extends BI.Widget
 */
BI.AccumulateAreaChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.AccumulateAreaChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-accumulate-area-chart"
        })
    },

    _init: function () {
        BI.AccumulateAreaChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.xAxis = [{
            type: "category",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE
        }];
        this.yAxis = [];

        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.AccumulateAreaChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this;

        config.colors = this.config.chartColor;
        config.style = formatChartStyle(this.config.chartStyle);
        formatChartLineStyle(this.config.chartLineType);
        formatCordon(this.config.cordon);
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
            var unit = "";
            switch (axis.axisIndex) {
                case self.constants.LEFT_AXIS:
                    unit = self.getXYAxisUnit(self.config.leftYAxisNumberLevel, self.config.leftYAxisUnit);
                    axis.title.text = self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + unit : unit;
                    axis.title.rotation = self.constants.ROTATION;
                    BI.extend(axis, {
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        reversed: self.config.leftYAxisReversed,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators)
                    });
                    self.formatNumberLevelInYaxis(config, items, self.config.leftYAxisNumberLevel, idx, axis.formatter, self.config.numSeparators);

                    break;
                case self.constants.RIGHT_AXIS:
                    unit = self.getXYAxisUnit(self.config.rightYAxisNumberLevel, self.config.rightYAxisUnit);
                    axis.title.text = self.config.showRightYAxisTitle === true ? self.config.rightYAxisTitle + unit : unit;
                    axis.title.rotation = self.constants.ROTATION;
                    BI.extend(axis, {
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        reversed: self.config.rightYAxisReversed,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.rightYAxisStyle, self.config.rightYAxisNumberLevel, self.config.rightNumSeparators)
                    });
                    self.formatNumberLevelInYaxis(config, items, self.config.rightYAxisNumberLevel, idx, axis.formatter, self.config.rightNumSeparators);
                    break;
            }
        });

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        config.chartType = "area";

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

        //全局样式的图表文字
        this.setFontStyle(this.config.chartFont, config);

        return [items, config];

        function formatChartStyle(v) {
            switch (v) {
                case BICst.CHART_STYLE.STYLE_GRADUAL:
                    return "gradual";
                case BICst.CHART_STYLE.STYLE_NORMAL:
                default:
                    return "normal";
            }
        }

        function formatChartLineStyle(v) {
            switch (v) {
                case BICst.CHART_SHAPE.RIGHT_ANGLE:
                    config.plotOptions.curve = false;
                    config.plotOptions.step = true;
                    break;
                case BICst.CHART_SHAPE.CURVE:
                    config.plotOptions.curve = true;
                    config.plotOptions.step = false;
                    break;
                case BICst.CHART_SHAPE.NORMAL:
                default:
                    config.plotOptions.curve = false;
                    config.plotOptions.step = false;
                    break;
            }
        }

        function formatCordon(cordon) {
            BI.each(cordon, function (idx, cor) {
                if (idx === 0 && self.xAxis.length > 0) {
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }
    },

    _formatItems: function (items) {
        return BI.map(items, function (idx, item) {
            var i = BI.UUID();
            return BI.map(item, function (id, it) {
                return BI.extend({}, it, {stack: i});
            });
        });
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            rightYAxisTitle: options.rightYAxisTitle || "",
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.STYLE_NORMAL,
            chartLineType: options.chartLineType || c.NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            rightYAxisStyle: options.rightYAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            showRightYAxisTitle: options.showRightYAxisTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            rightYAxisReversed: options.rightYAxisReversed || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            rightYAxisNumberLevel: options.rightYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            rightYAxisUnit: options.rightYAxisUnit || "",
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
        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.AREA);
            });
            types.push(type);
        });
        BI.each(types, function (idx, type) {
            if (BI.isEmptyArray(type)) {
                return;
            }
            var newYAxis = {
                type: "value",
                title: {
                    style: self.constants.FONT_STYLE
                },
                labelStyle: self.constants.FONT_STYLE,
                position: idx > 0 ? "right" : "left",
                lineWidth: 1,
                axisIndex: idx,
                gridLineWidth: 0
            };
            self.yAxis.push(newYAxis);
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
BI.AccumulateAreaChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.accumulate_area_chart', BI.AccumulateAreaChart);/**
 * 图表控件
 * @class BI.AccumulateAxisChart
 * @extends BI.Widget
 */
BI.AccumulateAxisChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.AccumulateAxisChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-accumulate-axis-chart"
        })
    },

    _init: function () {
        BI.AccumulateAxisChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "category",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE
        }];
        this.yAxis = [];
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.AccumulateAxisChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.dataSheet.enabled = this.config.showDataTable;
        config.xAxis[0].showLabel = !config.dataSheet.enabled;
        config.zoom.zoomTool.enabled = this.config.showZoom;
        if (this.config.showZoom === true) {
            delete config.dataSheet;
            delete config.zoom.zoomType;
        }

        config.yAxis = this.yAxis;
        BI.each(config.yAxis, function (idx, axis) {
            switch (axis.axisIndex) {
                case self.constants.LEFT_AXIS:
                    axis.title.text = getTitleText(self.config.leftYAxisNumberLevel, self.constants.LEFT_AXIS, self.config.showLeftYAxisTitle, self.config.leftYAxisTitle);
                    axis.title.rotation = self.constants.ROTATION;
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
                    axis.title.text = getTitleText(self.config.rightYAxisNumberLevel, self.constants.RIGHT_AXIS, self.config.showRightYAxisTitle, self.config.rightYAxisTitle);
                    axis.title.rotation = self.constants.ROTATION;
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
            }
        });

        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        config.xAxis[0].title.align = "center";
        BI.extend(config.xAxis[0], {
            lineWidth: self.config.lineWidth,
            enableTick: self.config.enableTick,
            labelRotation: this.config.textDirection,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        config.chartType = "column";

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

        //全局样式的图表文字
        this.setFontStyle(this.config.chartFont, config);

        return [items, config];

        function formatCordon() {
            BI.each(self.config.cordon, function (idx, cor) {
                if (idx === 0 && self.xAxis.length > 0) {
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }

        function formatChartStyle() {
            switch (self.config.chartStyle) {
                case BICst.CHART_STYLE.STYLE_GRADUAL:
                    return "gradual";
                case BICst.CHART_STYLE.STYLE_NORMAL:
                default:
                    return "normal";
            }
        }

        function getTitleText(numberLevelType, position, show, title) {
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

            unit = unit === "" ? unit : "(" + unit + ")";

            return show === true ? title + unit : unit;
        }
    },

    _formatItems: function (items) {
        return BI.map(items, function (idx, item) {
            var i = BI.UUID();
            return BI.map(item, function (id, it) {
                return BI.extend({}, it, {stack: i});
            });
        });
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            rightYAxisTitle: options.rightYAxisTitle || "",
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.STYLE_NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            rightYAxisStyle: options.rightYAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            showRightYAxisTitle: options.showRightYAxisTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            rightYAxisReversed: options.rightYAxisReversed || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            rightYAxisNumberLevel: options.rightYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            rightYAxisUnit: options.rightYAxisUnit || "",
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
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;
        this.yAxis = [];
        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.AXIS);
            });
            types.push(type);
        });
        BI.each(types, function (idx, type) {
            if (BI.isEmptyArray(type)) {
                return;
            }
            var newYAxis = {
                type: "value",
                title: {
                    style: self.constants.FONT_STYLE
                },
                labelStyle: self.constants.FONT_STYLE,
                position: idx > 0 ? "right" : "left",
                lineWidth: 1,
                axisIndex: idx,
                gridLineWidth: 0
            };
            self.yAxis.push(newYAxis);
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
BI.AccumulateAxisChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.accumulate_axis_chart', BI.AccumulateAxisChart);/**
 * 图表控件
 * @class BI.AccumulateBarChart
 * @extends BI.Widget
 */
BI.AccumulateBarChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.AccumulateBarChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-accumulate-bar-chart"
        })
    },

    _init: function () {
        BI.AccumulateBarChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "value",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            formatter: function () {
                return this > 0 ? this : (-1) * this
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
            self.fireEvent(BI.AccumulateBarChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this;
        var unit = getXYAxisUnit(this.config.xAxisNumberLevel, this.constants.LEFT_AXIS);
        var xTitle = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.X_AXIS);
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;

        config.yAxis = this.yAxis;
        config.yAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle + unit : unit;
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        BI.extend(config.yAxis[0], {
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            labelRotation: this.config.textDirection,
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            maxWidth: '40%'
        });

        self.formatNumberLevelInXaxis(items, this.config.leftYAxisNumberLevel);
        config.xAxis[0].title.text = this.config.showLeftYAxisTitle === true ? this.config.leftYAxisTitle + xTitle : xTitle;
        config.xAxis[0].title.align = "center";
        BI.extend(config.xAxis[0], {
            formatter: self.formatTickInXYaxis(this.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators),
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            showLabel: this.config.showLabel,
            enableTick: this.config.enableTick,
            lineWidth: this.config.lineWidth,
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
        BI.each(items, function (idx, item) {
            var stackId = BI.UUID();
            BI.each(item, function (id, it) {
                it.stack = stackId;
                BI.each(it.data, function (i, t) {
                    var tmp = t.x;
                    t.x = t.y;
                    t.y = tmp;
                })
            });
        });
        return items;
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
            minimalist_model: options.minimalist_model || false,
            lineWidth: BI.isNull(options.lineWidth) ? 1 : options.lineWidth,
            showLabel: BI.isNull(options.showLabel) ? true : options.showLabel,
            enableTick: BI.isNull(options.enableTick) ? true : options.enableTick,
            enableMinorTick: BI.isNull(options.enableMinorTick) ? true : options.enableMinorTick,
            numSeparators: options.numSeparators || false,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;
        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.BAR);
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
BI.AccumulateBarChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.accumulate_bar_chart', BI.AccumulateBarChart);/**
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
BI.shortcut('bi.accumulate_radar_chart', BI.AccumulateRadarChart);/**
 * 图表控件
 * @class BI.AreaChart
 * @extends BI.Widget
 */
BI.AreaChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.AreaChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-area-chart"
        })
    },

    _init: function () {
        BI.AreaChart.superclass._init.apply(this, arguments);
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
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.AreaChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatChartLineStyle();
        formatCordon();
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
                    title = getXYAxisUnit(self.config.leftYAxisNumberLevel, self.constants.LEFT_AXIS);
                    axis.title.text = self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + title : title;
                    axis.title.rotation = self.constants.ROTATION;
                    BI.extend(axis, {
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        reversed: self.config.leftYAxisReversed,
                        enableMinorTick: self.config.enableMinorTick,
                        formatter: self.formatTickInXYaxis(self.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators),
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0
                    });
                    self.formatNumberLevelInYaxis(config, items, self.config.leftYAxisNumberLevel, idx, axis.formatter);
                    break;
                case self.constants.RIGHT_AXIS:
                    title = getXYAxisUnit(self.config.rightYAxisNumberLevel, self.constants.RIGHT_AXIS);
                    axis.title.text = self.config.showRightYAxisTitle === true ? self.config.rightYAxisTitle + title : title;
                    axis.title.rotation = self.constants.ROTATION;
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
            }
        });

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        config.chartType = "area";

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

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
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }

        function formatChartLineStyle() {
            switch (self.config.chartLineType) {
                case BICst.CHART_SHAPE.RIGHT_ANGLE:
                    config.plotOptions.curve = false;
                    config.plotOptions.step = true;
                    break;
                case BICst.CHART_SHAPE.CURVE:
                    config.plotOptions.curve = true;
                    config.plotOptions.step = false;
                    break;
                case BICst.CHART_SHAPE.NORMAL:
                default:
                    config.plotOptions.curve = false;
                    config.plotOptions.step = false;
                    break;
            }
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
            leftYAxisTitle: options.leftYAxisTitle || "",
            rightYAxisTitle: options.rightYAxisTitle || "",
            rightYAxisSecondTitle: options.rightYAxisSecondTitle || "",
            chartLineType: options.chartLineType || c.NORMAL,
            chartColor: options.chartColor || [],
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

        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.AREA);
            });
            types.push(type);
        });

        this.yAxis = [];
        BI.each(types, function (idx, type) {
            if (BI.isEmptyArray(type)) {
                return;
            }
            var newYAxis = {
                type: "value",
                title: {
                    style: self.constants.FONT_STYLE
                },
                labelStyle: self.constants.FONT_STYLE,
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
BI.AreaChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.area_chart', BI.AreaChart);/**
 * 图表控件 柱状
 * @class BI.AxisChart
 * @extends BI.Widget
 * leftYxis 左值轴属性
 * rightYxis 右值轴属性
 * xAxis    分类轴属性
 */
BI.AxisChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.AxisChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-axis-chart"
        })
    },

    _init: function () {
        BI.AxisChart.superclass._init.apply(this, arguments);
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
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.AxisChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
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
            var title;
            switch (axis.axisIndex) {
                case self.constants.LEFT_AXIS:
                    title = getXYAxisUnit(self.config.leftYAxisNumberLevel, self.constants.LEFT_AXIS);
                    axis.title.text = self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + title : title;
                    axis.title.rotation = self.constants.ROTATION;
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
                    title = getXYAxisUnit(self.config.rightYAxisNumberLevel, self.constants.RIGHT_AXIS);
                    axis.title.text = self.config.showRightYAxisTitle === true ? self.config.rightYAxisTitle + title : title;
                    axis.title.rotation = self.constants.ROTATION;
                    BI.extend(axis, {
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        reversed: self.config.rightYAxisReversed,
                        enableMinorTIck: self.config.enableMinorTick,
                        formatter: self.formatTickInXYaxis(self.config.rightYAxisStyle, self.config.rightYAxisNumberLevel, self.config.rightNumSeparators),
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0
                    });
                    self.formatNumberLevelInYaxis(config, items, self.config.rightYAxisNumberLevel, idx, axis.formatter);
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
            maxHeight: '40%'
        });

        var lineItem = [];
        var otherItem = [];
        BI.each(items, function (idx, item) {
            if (item.type === "line") {
                lineItem.push(item);
            } else {
                otherItem.push(item);
            }
        });

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

        //全局样式的图表文字
        this.setFontStyle(this.config.chartFont, config);

        return [BI.concat(otherItem, lineItem), config];

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
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                            magnify = self.calcMagnify(self.config.leftYAxisNumberLevel);
                            break;
                        case self.constants.RIGHT_AXIS:
                            magnify = self.calcMagnify(self.config.rightYAxisNumberLevel);
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

    populate: function (items, options, types) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            rightYAxisTitle: options.rightYAxisTitle || "",
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            rightYAxisStyle: options.rightYAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            showRightYAxisTitle: options.showRightYAxisTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            rightYAxisReversed: options.rightYAxisReversed || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            rightYAxisNumberLevel: options.rightYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            rightYAxisUnit: options.rightYAxisUnit || "",
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
            nullContinue: true
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
                    style: self.constants.FONT_STYLE
                },
                labelStyle: self.constants.FONT_STYLE,
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
BI.AxisChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.axis_chart', BI.AxisChart);/**
 * 图表控件
 * @class BI.BarChart
 * @extends BI.Widget
 */
BI.BarChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.BarChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-bar-chart"
        })
    },

    _init: function () {
        BI.BarChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "value",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            formatter: function () {
                return this > 0 ? this : (-1) * this
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
            var tmp = obj.x;
            obj.x = obj.y;
            obj.y = tmp;
            self.fireEvent(BI.BarChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;

        //分类轴
        config.yAxis = this.yAxis;
        config.yAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        BI.extend(config.yAxis[0], {
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            labelRotation: this.config.textDirection,
            enableTick: this.config.enableTick,
            lineWidth: this.config.lineWidth,
            maxWidth: '40%'
        });

        //值轴
        self.formatNumberLevelInXaxis(items, this.config.leftYAxisNumberLevel);
        config.xAxis[0].title.text = getXAxisTitle(this.config.leftYAxisNumberLevel, this.constants.X_AXIS);
        config.xAxis[0].title.align = "center";
        BI.extend(config.xAxis[0], {
            formatter: self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators),
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            enableTick: this.config.enableTick,
            showLabel: this.config.showLabel,
            lineWidth: this.config.lineWidth,
            enableMinorTick: this.config.enableMinorTick
        });
        config.chartType = "bar";

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

        function getXAxisTitle(numberLevelType, position) {
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
            unit = unit === "" ? unit : "(" + unit + ")";

            return self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + unit : unit;
        }
    },

    _formatItems: function (items) {
        BI.each(items, function (idx, item) {
            BI.each(item, function (id, it) {
                BI.each(it.data, function (i, t) {
                    var tmp = t.x;
                    t.x = t.y;
                    t.y = tmp;
                })
            });
        });
        return items;
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
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.BAR);
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
BI.BarChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.bar_chart', BI.BarChart);/**
 * 图表控件
 * @class BI.BubbleChart
 * @extends BI.Widget
 */
BI.BubbleChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.BubbleChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-bubble-chart"
        })
    },

    _init: function () {
        BI.BubbleChart.superclass._init.apply(this, arguments);
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
            self.fireEvent(BI.BubbleChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        delete config.zoom;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.plotOptions.dataLabels.formatter.identifier = "${X}${Y}${SIZE}";
        config.plotOptions.shadow = this.config.bubbleStyle !== this.constants.NO_PROJECT;
        config.yAxis = this.yAxis;

        config.yAxis[0].formatter = self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators);
        formatNumberLevelInYaxis(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS);
        config.yAxis[0].title.text = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS);
        config.yAxis[0].title.text = this.config.showLeftYAxisTitle === true ? this.config.leftYAxisTitle + config.yAxis[0].title.text : config.yAxis[0].title.text;
        config.yAxis[0].gridLineWidth = this.config.showGridLine === true ? 1 : 0;
        config.yAxis[0].lineWidth = 1;
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        config.yAxis[0].maxWidth = '40%';

        config.xAxis[0].formatter = self.formatTickInXYaxis(this.config.xAxisStyle, this.config.xAxisNumberLevel, this.config.rightNumSeparators);
        self.formatNumberLevelInXaxis(items, this.config.xAxisNumberLevel);
        config.xAxis[0].title.text = getXYAxisUnit(this.config.xAxisNumberLevel, this.constants.X_AXIS);
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle + config.xAxis[0].title.text : config.xAxis[0].title.text;
        config.xAxis[0].title.align = "center";
        config.xAxis[0].gridLineWidth = this.config.showGridLine === true ? 1 : 0;
        config.xAxis[0].maxHeith = '40%';
        config.chartType = "bubble";

        if (BI.isNotEmptyArray(this.config.tooltip)) {
            config.plotOptions.bubble.tooltip = {
                useHtml: true,
                style: {
                    color: 'RGB(184, 184, 184)'
                },
                formatter: function () {
                var y = self.formatTickInXYaxis(self.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators)(this.y);
                var x = self.formatTickInXYaxis(self.config.xAxisStyle, self.config.xAxisNumberLevel, self.config.rightNumSeparators)(this.x);
                return this.seriesName + '<div>(X)' + self.config.tooltip[0] + ':' + x + '</div><div>(Y)' + self.config.tooltip[1]
                    + ':' + y + '</div><div>(' + BI.i18nText("BI-Size") + ')' + self.config.tooltip[2] + ':' + this.size + '</div>'}
            };
        }

        //为了给数据标签加个%,还要遍历所有的系列，唉
        if (config.plotOptions.dataLabels.enabled === true) {
            BI.each(items, function (idx, item) {
                item.dataLabels = {
                    "style" : self.config.chartFont,
                    "align": "outside",
                    "autoAdjust": true,
                    enabled: true,
                    formatter: {
                        identifier: "${X}${Y}${SIZE}",
                        "XFormat": function () {
                            return BI.contentFormat(arguments[0], '#.##;-#.##')
                        },
                        "YFormat": function () {
                            return BI.contentFormat(arguments[0], '#.##;-#.##')
                        },
                        "sizeFormat": function () {
                            return BI.contentFormat(arguments[0], '#.##;-#.##')
                        }
                    }
                };
                item.dataLabels.formatter.XFormat = config.xAxis[0].formatter;
                item.dataLabels.formatter.YFormat = config.yAxis[0].formatter;
            });
        }

        //全局样式图表文字
        config.yAxis[0].title.style = config.yAxis[0].labelStyle = this.config.chartFont;
        config.xAxis[0].title.style = config.xAxis[0].labelStyle = this.config.chartFont;
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

        function formatCordon() {
            BI.each(self.config.cordon, function (idx, cor) {
                if (idx === 0 && self.xAxis.length > 0) {
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }

        function formatNumberLevelInYaxis(type, position) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, da) {
                    if (position === item.yAxis) {
                        da.y = self.formatXYDataWithMagnify(da.y, magnify);
                    }
                })
            });
            if (type === BICst.TARGET_STYLE.NUM_LEVEL.PERCENT) {
                //config.plotOptions.tooltip.formatter.valueFormat = "function(){return window.FR ? FR.contentFormat(arguments[0], '#0%') : arguments[0]}";
            }
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

    _formatItems: function (items) {
        BI.each(items, function (idx, item) {
            BI.each(item, function (id, it) {
                BI.each(it.data, function (i, da) {
                    var data = da.size;
                    da.size = BI.contentFormat(data, '#.##;-#.##')
                })
            })
        });
        return items;
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
            bubbleStyle: options.bubbleStyle || c.NO_PROJECT,
            numSeparators: options.numSeparators || false,
            rightNumSeparators: options.rightNumSeparators || false,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;
        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.BUBBLE);
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
BI.BubbleChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.bubble_chart', BI.BubbleChart);
/**
 * 图表控件
 * @class BI.CompareAreaChart
 * @extends BI.Widget
 */
BI.CompareAreaChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.CompareAreaChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-compare-area-chart"
        })
    },

    _init: function () {
        BI.CompareAreaChart.superclass._init.apply(this, arguments);
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
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.CompareAreaChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatChartLineStyle();
        formatCordon();
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
                    title = getXYAxisUnit(self.config.leftYAxisNumberLevel, self.constants.LEFT_AXIS);
                    axis.title.rotation = self.constants.ROTATION;
                    axis.title.text = self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + title : title;
                    BI.extend(axis, {
                        reversed: false,
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators)
                    });
                    formatNumberLevelInYaxis(self.config.leftYAxisNumberLevel, idx, axis.formatter);
                    break;
                case self.constants.RIGHT_AXIS:
                    title = getXYAxisUnit(self.config.rightYAxisNumberLevel, self.constants.RIGHT_AXIS);
                    axis.title.rotation = self.constants.ROTATION;
                    axis.title.text = self.config.showRightYAxisTitle === true ? self.config.rightYAxisTitle + title : title;
                    BI.extend(axis, {
                        reversed: true,
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.rightYAxisStyle, self.config.rightYAxisNumberLevel, self.config.rightNumSeparators)
                    });
                    formatNumberLevelInYaxis(self.config.rightYAxisNumberLevel, idx, axis.formatter);
                    break;
            }
            var res = _calculateValueNiceDomain(0, self.maxes[idx]);
            axis.max = res[1].mul(2);
            axis.min = res[0].mul(2);
            axis.tickInterval = BI.parseFloat((BI.parseFloat(axis.max).sub(BI.parseFloat(axis.min)))).div(5);
        });

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        config.chartType = "area";

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

        //全局样式的图表文字
        this.setFontStyle(this.config.chartFont, config);

        return [items, config];

        function _calculateValueNiceDomain(minValue, maxValue) {

            minValue = Math.min(0, minValue);

            var tickInterval = _linearTickInterval(minValue, maxValue);

            return _linearNiceDomain(minValue, maxValue, tickInterval);
        }

        function _linearTickInterval(minValue, maxValue, m) {

            m = m || 5;
            var span = maxValue - minValue;
            var step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10));
            var err = m / span * step;

            if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;

            return step;
        }

        function _linearNiceDomain(minValue, maxValue, tickInterval) {

            minValue = VanUtils.accMul(Math.floor(minValue / tickInterval), tickInterval);

            maxValue = VanUtils.accMul(Math.ceil(maxValue / tickInterval), tickInterval);

            return [minValue, maxValue];
        }

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
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
                    self.xAxis[0].plotLines = BI.map(cor, function (i, t) {
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
                                "style": self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }

        function formatChartLineStyle() {
            switch (self.config.chartLineType) {
                case BICst.CHART_SHAPE.RIGHT_ANGLE:
                    config.plotOptions.area = {
                        curve: false,
                        step: true
                    };
                    break;
                case BICst.CHART_SHAPE.CURVE:
                    config.plotOptions.area = {
                        curve: true,
                        step: false
                    };
                    break;
                case BICst.CHART_SHAPE.NORMAL:
                default:
                    config.plotOptions.area = {
                        curve: false,
                        step: false
                    };
                    break;
            }
        }

        function formatNumberLevelInYaxis(type, position, formatter) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                var max = null;
                BI.each(item.data, function (id, da) {
                    if (position === item.yAxis) {
                        da.y = self.formatXYDataWithMagnify(da.y, magnify);
                        if ((BI.isNull(max) || BI.parseFloat(da.y) > BI.parseFloat(max))) {
                            max = da.y;
                        }
                    }
                });
                if (position === item.yAxis) {
                    item.tooltip = BI.deepClone(config.plotOptions.tooltip);
                    item.tooltip.formatter.valueFormat = formatter;
                }
                if (BI.isNotNull(max)) {
                    self.maxes.push(max);
                }
            });
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

    _formatItems: function (items) {
        var self = this;
        this.maxes = [];
        BI.each(items, function (idx, item) {
            BI.each(item, function (id, it) {
                if (idx > 0) {
                    BI.extend(it, {reversed: true, xAxis: 0});
                } else {
                    BI.extend(it, {reversed: false, xAxis: 1});
                }
            });
        });
        return items;
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            rightYAxisTitle: options.rightYAxisTitle || "",
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.NORMAL,
            chartLineType: options.chartLineType || c.NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            rightYAxisStyle: options.rightYAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            showRightYAxisTitle: options.showRightYAxisTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            rightYAxisReversed: options.rightYAxisReversed || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            rightYAxisNumberLevel: options.rightYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            rightYAxisUnit: options.rightYAxisUnit || "",
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

        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.AREA);
            });
            types.push(type);
        });

        this.yAxis = [];
        BI.each(types, function (idx, type) {
            if (BI.isEmptyArray(type)) {
                return;
            }
            var newYAxis = {
                type: "value",
                title: {
                    style: self.constants.FONT_STYLE
                },
                labelStyle: self.constants.FONT_STYLE,
                position: idx > 0 ? "right" : "left",
                lineWidth: 1,
                axisIndex: idx,
                gridLineWidth: 0
            };
            self.yAxis.push(newYAxis);
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
BI.CompareAreaChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.compare_area_chart', BI.CompareAreaChart);/**
 * 图表控件
 * @class BI.CompareAxisChart
 * @extends BI.Widget
 */
BI.CompareAxisChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.CompareAxisChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-compare-axis-chart"
        })
    },

    _init: function () {
        BI.CompareAxisChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "category",
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            position: "bottom",
            gridLineWidth: 0
        }, {
            title: {
                style: this.constants.FONT_STYLE
            },
            labelStyle: this.constants.FONT_STYLE,
            position: "top",
            gridLineWidth: 0,
            type: "category",
            showLabel: false
        }];
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.CompareAxisChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function(config, items){
        var self = this, o = this.options;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatChartLineStyle();
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.dataSheet.enabled = this.config.showDataTable;
        config.xAxis[0].showLabel = !config.dataSheet.enabled;
        config.zoom.zoomTool.enabled = this.config.showZoom;
        if(this.config.showZoom === true){
            delete config.dataSheet;
            delete config.zoom.zoomType;
        }

        config.yAxis = this.yAxis;
        BI.each(config.yAxis, function(idx, axis){
            var unit = '';
            switch (axis.axisIndex){
                case self.constants.LEFT_AXIS:
                    unit = getXYAxisUnit(self.config.leftYAxisNumberLevel, self.constants.LEFT_AXIS);
                    axis.title.rotation = self.constants.ROTATION;
                    axis.title.text = self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + unit : unit;
                    BI.extend(axis, {
                        reversed: false,
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators)
                    });
                    formatNumberLevelInYaxis(self.config.leftYAxisNumberLevel, idx, axis.formatter);
                    break;
                case self.constants.RIGHT_AXIS:
                    unit = getXYAxisUnit(self.config.rightYAxisNumberLevel, self.constants.RIGHT_AXIS);
                    axis.title.rotation = self.constants.ROTATION;
                    axis.title.text = self.config.showRightYAxisTitle === true ? self.config.rightYAxisTitle + unit : unit;
                    BI.extend(axis, {
                        reversed: true,
                        lineWidth: self.config.lineWidth,
                        showLabel: self.config.showLabel,
                        enableTick: self.config.enableTick,
                        enableMinorTick: self.config.enableMinorTick,
                        gridLineWidth: self.config.showGridLine === true ? 1 : 0,
                        formatter: self.formatTickInXYaxis(self.config.rightYAxisStyle, self.config.rightYAxisNumberLevel, self.config.rightNumSeparators)
                    });
                    formatNumberLevelInYaxis(self.config.rightYAxisNumberLevel, idx, axis.formatter);
                    break;
            }
            var res = _calculateValueNiceDomain(0, self.maxes[idx]);
            axis.max = res[1].mul(2);
            axis.min = res[0].mul(2);
            axis.tickInterval = BI.parseFloat((BI.parseFloat(axis.max).sub(BI.parseFloat(axis.min)))).div(5);
        });

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            enableMinorTick: this.config.enableMinorTick,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        BI.extend(config.xAxis[1], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            enableMinorTick: this.config.enableMinorTick
        });

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

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
                    var magnify = self.calcMagnify(self.config.leftYAxisNumberLevel);
                    self.xAxis[0].plotLines = BI.map(cor, function(i, t){
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
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }

        function formatChartLineStyle(){
            switch (self.config.chartLineType) {
                case BICst.CHART_SHAPE.RIGHT_ANGLE:
                    config.plotOptions.curve = false;
                    config.plotOptions.step = true;
                    break;
                case BICst.CHART_SHAPE.CURVE:
                    config.plotOptions.curve = true;
                    config.plotOptions.step = false;
                    break;
                case BICst.CHART_SHAPE.NORMAL:
                default:
                    config.plotOptions.curve = false;
                    config.plotOptions.step = false;
                    break;
            }
        }

        function formatNumberLevelInYaxis(type, position, formatter){
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                var max = null;
                BI.each(item.data, function (id, da) {
                    if (position === item.yAxis) {
                        da.y = self.formatXYDataWithMagnify(da.y, magnify);
                        if((BI.isNull(max) || BI.parseFloat(da.y) > BI.parseFloat(max))){
                            max = da.y;
                        }
                    }
                });
                if(position === item.yAxis){
                    item.tooltip = BI.deepClone(config.plotOptions.tooltip);
                    item.tooltip.formatter.valueFormat = formatter;
                }
                if(BI.isNotNull(max)){
                    self.maxes.push(max);
                }
            });
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

        function _calculateValueNiceDomain(minValue, maxValue){

            minValue = Math.min(0, minValue);

            var tickInterval = _linearTickInterval(minValue, maxValue);

            return _linearNiceDomain(minValue, maxValue, tickInterval);
        }

        function _linearTickInterval(minValue, maxValue, m){

            m = m || 5;
            var span = maxValue - minValue;
            var step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10));
            var err = m / span * step;

            if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;

            return step;
        }

        function _linearNiceDomain(minValue, maxValue, tickInterval){

            minValue = VanUtils.accMul(Math.floor(minValue / tickInterval), tickInterval);

            maxValue = VanUtils.accMul(Math.ceil(maxValue / tickInterval), tickInterval);

            return [minValue, maxValue];
        }
    },

    _formatItems: function(items){
        var self = this;
        this.maxes = [];
        BI.each(items, function(idx, item){
            BI.each(item, function(id, it){
                if(idx > 0){
                    BI.extend(it, {reversed: true, xAxis: 1});
                }else{
                    BI.extend(it, {reversed: false, xAxis: 0});
                }
            });
        });
        return items;
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            leftYAxisTitle: options.leftYAxisTitle || "",
            rightYAxisTitle: options.rightYAxisTitle || "",
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.NORMAL,
            chartLineType: options.chartLineType || c.NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            rightYAxisStyle: options.rightYAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            showRightYAxisTitle: options.showRightYAxisTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            rightYAxisReversed: options.rightYAxisReversed || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            rightYAxisNumberLevel:  options.rightYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            rightYAxisUnit: options.rightYAxisUnit || "",
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
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;

        this.yAxis = [];

        var types = [];
        BI.each(items, function(idx, axisItems){
            var type = [];
            BI.each(axisItems, function(id, item){
                type.push(BICst.WIDGET.AXIS);
            });
            types.push(type);
        });

        BI.each(types, function(idx, type){
            if(BI.isEmptyArray(type)){
                return;
            }
            var newYAxis = {
                type: "value",
                title: {
                    style: self.constants.FONT_STYLE
                },
                labelStyle: self.constants.FONT_STYLE,
                position: idx > 0 ? "right" : "left",
                lineWidth: 1,
                axisIndex: idx,
                gridLineWidth: 0,
                reversed: idx > 0
            };
            self.yAxis.push(newYAxis);
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
BI.CompareAxisChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.compare_axis_chart', BI.CompareAxisChart);/**
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
BI.shortcut('bi.compare_bar_chart', BI.CompareBarChart);/**
 * 图表控件
 * @class BI.DashboardChart
 * @extends BI.Widget
 */
BI.DashboardChart = BI.inherit(BI.AbstractChart, {


    _defaultConfig: function () {
        return BI.extend(BI.DashboardChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-dashboard-chart"
        })
    },

    _init: function () {
        BI.DashboardChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.gaugeAxis = [{
            "minorTickColor": "rgb(226,226,226)",
            "tickColor": "rgb(186,186,186)",
            labelStyle: this.constants.FONT_STYLE,
            "step": 0,
            "showLabel": true
        }];
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.DashboardChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        var isDashboard = BI.contains([self.constants.NORMAL, self.constants.HALF_DASHBOARD], self.config.chartDashboardType);
        var isMultiPointers = self.config.numberOfPointer === self.constants.MULTI_POINTER;
        formatChartDashboardStyle();
        config.chartType = "gauge";
        delete config.zoom;
        delete config.xAxis;
        delete config.yAxis;
        if (isDashboard && !isMultiPointers) {
            config.plotOptions.seriesLabel.enabled = false;
            if(BI.isNull(items[0].data[0].z)) {
                config.plotOptions.tooltip.formatter.identifier = "${SERIES}${X}${Y}${SIZE}${VALUE}"
            }
        }
        config.gaugeAxis[0].labelStyle = this.config.chartFont;
        return [items, config];

        function formatChartDashboardStyle() {
            var bands = getBandsStyles(self.config.bandsStyles, self.config.autoCustomStyle);
            var percentageLabel = BI.extend(config.plotOptions.percentageLabel, {
                enabled: self.config.showPercentage === BICst.PERCENTAGE.SHOW
            });

            config.gaugeAxis = self.gaugeAxis;
            var slotValueLAbel = {
                enabled: true,
                formatter: function () {
                    var value = this.value;
                    if (self.config.dashboardNumberLevel === BICst.TARGET_STYLE.NUM_LEVEL.PERCENT && self.config.numSeparators) {
                        value = BI.contentFormat(this.value, "#,##0%;-#,##0%")
                    } else if (self.config.dashboardNumberLevel === BICst.TARGET_STYLE.NUM_LEVEL.PERCENT && !self.config.numSeparators) {
                        value = BI.contentFormat(this.value, "#0.00%");
                    } else if (!(self.config.dashboardNumberLevel === BICst.TARGET_STYLE.NUM_LEVEL.PERCENT) && self.config.numSeparators) {
                        value = BI.contentFormat(this.value, "#,###.##;-#,###.##")
                    } else {
                        value = BI.contentFormat(this.value, "#.##;-#.##");
                    }

                    var label = '<div style="text-align: center">' + this.seriesName + '</div>' + '<div style="text-align: center">' + value +
                        getXYAxisUnit(self.config.dashboardNumberLevel, self.constants.DASHBOARD_AXIS) + '</div>';

                    if (isDashboard && items[0].data.length > 1) {
                        if (isMultiPointers) {
                            return '<div style="text-align: center">' + this.seriesName + ':' + value +
                                getXYAxisUnit(self.config.dashboardNumberLevel, self.constants.DASHBOARD_AXIS) + '</div>';
                        }
                        return label
                    } else if (isDashboard &&  BI.isNull(items[0].data[0].z)) {
                        return label
                    }

                    return '<div style="text-align: center">' + this.category + '</div>' + label;
                },
                style: self.config.chartFont,
                useHtml: true
            };
            switch (self.config.chartDashboardType) {
                case BICst.CHART_SHAPE.HALF_DASHBOARD:
                    setPlotOptions("pointer_semi", bands, slotValueLAbel, percentageLabel);
                    break;
                case BICst.CHART_SHAPE.PERCENT_DASHBOARD:
                    setPlotOptions("ring", bands, slotValueLAbel, percentageLabel);
                    break;
                case BICst.CHART_SHAPE.PERCENT_SCALE_SLOT:
                    setPlotOptions("slot", bands, slotValueLAbel, percentageLabel);
                    break;
                case BICst.CHART_SHAPE.HORIZONTAL_TUBE:
                    BI.extend(slotValueLAbel, {
                        align: "bottom"
                    });
                    BI.extend(percentageLabel, {
                        align: "bottom"
                    });
                    setPlotOptions("thermometer", bands, slotValueLAbel, percentageLabel, "horizontal", "vertical");
                    break;
                case BICst.CHART_SHAPE.VERTICAL_TUBE:
                    BI.extend(slotValueLAbel, {
                        align: "left"
                    });
                    BI.extend(percentageLabel, {
                        align: "left"
                    });
                    setPlotOptions("thermometer", bands, slotValueLAbel, percentageLabel, "vertical", "horizontal");
                    break;
                case BICst.CHART_SHAPE.NORMAL:
                default:
                    setPlotOptions("pointer", bands, slotValueLAbel, percentageLabel);
                    break;
            }
            changeMaxMinScale();
            formatNumberLevelInYaxis(self.config.dashboardNumberLevel, self.constants.LEFT_AXIS);
            if (self.config.dashboardNumberLevel === BICst.TARGET_STYLE.NUM_LEVEL.PERCENT) {
                config.gaugeAxis[0].formatter = function () {
                    var scaleValue = this;
                    if (self.config.numSeparators) {
                        scaleValue = BI.contentFormat(scaleValue, '#,##0%;-#,##0%')
                    } else {
                        scaleValue = BI.contentFormat(scaleValue, '#0.00%')
                    }
                    return scaleValue + getXYAxisUnit(self.config.dashboardNumberLevel, self.constants.DASHBOARD_AXIS);
                };
            } else {
                config.gaugeAxis[0].formatter = function () {
                    var value = this;
                    if (self.config.numSeparators) {
                        value = BI.contentFormat(value, "#,###;-#,###")
                    }
                    return value + getXYAxisUnit(self.config.dashboardNumberLevel, self.constants.DASHBOARD_AXIS);
                };
            }
        }

        function setPlotOptions(style, bands, slotValueLAbel, percentageLabel, thermometerLayout, layout) {
            config.style = style;
            config.plotOptions.bands = bands;
            config.plotOptions.valueLabel = slotValueLAbel;
            config.plotOptions.percentageLabel = percentageLabel;
            config.plotOptions.thermometerLayout = thermometerLayout;
            config.plotOptions.layout = layout;
        }

        function changeMaxMinScale() {
            self.gaugeAxis[0].min = BI.parseFloat(self.config.minScale) || null;
            self.gaugeAxis[0].max = BI.parseFloat(self.config.maxScale) || null;
        }

        function formatNumberLevelInYaxis(type, position) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, da) {
                    if (position === item.yAxis) {
                        da.y = self.formatXYDataWithMagnify(da.y, magnify);
                    }
                })
            });

            config.plotOptions.tooltip.formatter.valueFormat = function () {
                return BI.contentFormat(this, '#.##;-#.##') + getXYAxisUnit(type, position)
            };

            if (self.config.numSeparators) {
                config.plotOptions.tooltip.formatter.valueFormat = function () {
                    return BI.contentFormat(arguments[0], '#,###.##;-#,###.##')
                };
            }

            if (type === BICst.TARGET_STYLE.NUM_LEVEL.PERCENT) {
                config.plotOptions.tooltip.formatter.valueFormat = function () {
                    return BI.contentFormat(arguments[0], '#0.00%')
                };
                if (self.config.numSeparators) {
                    config.plotOptions.tooltip.formatter.valueFormat = function () {
                        return BI.contentFormat(arguments[0], '#,##0%;-#,##0%')
                    };
                }
            }
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
            if (position === self.constants.DASHBOARD_AXIS) {
                self.config.dashboardUnit !== "" && (unit = unit + self.config.dashboardUnit)
            }
            return unit;
        }

        function getBandsStyles(styles, change) {
            var min = 0, bands = [], color = null, max = null, conditionMax = null;

            BI.each(items, function (idx, item) {
                var data = item.data[0];
                if ((BI.isNull(max) || data.y > max)) {
                    max = data.y
                }
            });

            switch (change) {

                case BICst.SCALE_SETTING.AUTO:
                    break;
                case BICst.SCALE_SETTING.CUSTOM:
                    if (styles.length === 0) {
                        return bands
                    } else {
                        var maxScale = _calculateValueNiceDomain(0, max)[1];

                        BI.each(styles, function (idx, style) {
                            if(BI.parseFloat(style.range.min) > BI.parseFloat(style.range.max)) {
                               return bands.push({
                                    color: color,
                                    from: conditionMax,
                                    to: maxScale
                                });
                            }
                            bands.push({
                                color: style.color,
                                from: style.range.min,
                                to: style.range.max
                            });
                            color = style.color;
                            conditionMax = style.range.max
                        });
                        min = BI.parseInt(styles[0].range.min);
                        bands.push({
                            color: "#808080",
                            from: 0,
                            to: min
                        });

                        bands.push({
                            color: color,
                            from: conditionMax,
                            to: maxScale
                        });

                        return bands;
                    }
            }
        }

        function _calculateValueNiceDomain(minValue, maxValue) {
            minValue = Math.min(0, minValue);
            var tickInterval = _linearTickInterval(minValue, maxValue);

            return _linearNiceDomain(minValue, maxValue, tickInterval);
        }

        function _linearTickInterval(minValue, maxValue, m) {
            m = m || 5;
            var span = maxValue - minValue;
            var step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10));
            var err = m / span * step;
            if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;

            return step;
        }

        function _linearNiceDomain(minValue, maxValue, tickInterval) {
            minValue = VanUtils.accMul(Math.floor(minValue / tickInterval), tickInterval);
            maxValue = VanUtils.accMul(Math.ceil(maxValue / tickInterval), tickInterval);

            return [minValue, maxValue];
        }
    },

    _formatItems: function (items) {
        if (items.length === 0) {
            return [];
        }
        var c = this.constants;
        if (this.config.chartDashboardType === c.NORMAL || this.config.chartDashboardType === c.HALF_DASHBOARD) {
            var result = [];
            if (this.config.numberOfPointer === c.ONE_POINTER && items[0].length === 1) {//单个系列
                BI.each(items[0][0].data, function (idx, da) {
                    result.push({
                        data: [BI.extend({}, da, {
                            x: items[0][0].name
                        })],
                        name: da.x
                    })
                });
                return [result];
            } else if(this.config.numberOfPointer === c.ONE_POINTER && items[0].length > 1) {
                BI.each(items[0], function (idx, item) {
                    result.push({
                        data: [BI.extend(item.data[0], {
                            x: item.name
                        })],
                        name: BI.UUID()
                    })
                });
                return [result]
            }
            if (this.config.numberOfPointer === c.MULTI_POINTER && items[0].length > 1) {//多个系列
                BI.each(items, function (idx, item) {
                    BI.each(item, function (id, it) {
                        var data = it.data[0];
                        data.x = it.name;
                        result.push(data);
                    })
                });
                return [[{
                    data: result,
                    name: ""
                }]];
            }
        } else {
            var others = [];
            if (BI.isNotNull(items[0][0].data[0].z)) {
                BI.each(items[0], function (idx, item) {
                    BI.each(item.data, function (id, da) {
                        others.push({
                            data: [BI.extend({}, da, {
                                x: item.name,
                                y: da.y
                            })],
                            name: da.x
                        })
                    })
                });
                return [others];
            }
        }
        return items;
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants, o = this.options;
        this.config = {
            dashboardNumberLevel: options.dashboardNumberLevel || c.NORMAL,
            dashboardUnit: options.dashboardUnit || "",
            chartDashboardType: options.chartDashboardType || c.NORMAL,
            numberOfPointer: options.numberOfPointer || c.ONE_POINTER,
            bandsStyles: options.bandsStyles || [],
            autoCustomStyle: options.autoCustom || c.AUTO,
            minScale: options.minScale,
            maxScale: options.maxScale,
            showPercentage: options.showPercentage || c.NOT_SHOW,
            numSeparators: options.numSeparators || false,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        o.items = this._formatItems(items);
        var types = [];
        BI.each(o.items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.DASHBOARD);
            });
            types.push(type);
        });

        this.combineChart.populate(o.items, types);
    },

    resize: function () {
        this.combineChart.resize();
    },

    magnify: function () {
        this.combineChart.magnify();
    }
});
BI.DashboardChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.dashboard_chart', BI.DashboardChart);/**
 * 图表控件
 * @class BI.DonutChart
 * @extends BI.Widget
 */
BI.DonutChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.DonutChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-donut-chart"
        })
    },

    _init: function () {
        BI.DonutChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.DonutChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function(config, items){
        var self = this;
        delete config.zoom;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();

        this.formatChartLegend(config, this.config.chartLegend);

        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;

        config.plotOptions.innerRadius = "50.0%";
        config.chartType = "pie";
        config.plotOptions.dataLabels.align = "outside";
        config.plotOptions.dataLabels.connectorWidth = "outside";
        config.plotOptions.dataLabels.style = this.config.chartFont;
        config.plotOptions.dataLabels.formatter.identifier = "${VALUE}${PERCENT}";
        delete config.xAxis;
        delete config.yAxis;
        BI.each(items, function (idx, item) {
            BI.each(item.data, function (id, da) {
                da.y = self.formatXYDataWithMagnify(da.y, 1);
            })
        });

        config.legend.style = this.config.chartFont;
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

    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.NORMAL,
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            showDataLabel: options.showDataLabel || false,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;

        var types = [];
        BI.each(items, function(idx, axisItems){
            var type = [];
            BI.each(axisItems, function(id, item){
                type.push(BICst.WIDGET.DONUT);
            });
            types.push(type);
        });

        this.combineChart.populate(items, types);
    },

    resize: function () {
        this.combineChart.resize();
    },

    magnify: function(){
        this.combineChart.magnify();
    }
});
BI.DonutChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.donut_chart', BI.DonutChart);/**
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
BI.shortcut('bi.fall_axis_chart', BI.FallAxisChart);/**
 * 图表控件
 * @class BI.ForceBubbleChart
 * @extends BI.Widget
 */
BI.ForceBubbleChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.ForceBubbleChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-force-bubble-chart"
        })
    },

    _init: function () {
        BI.ForceBubbleChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.ForceBubbleChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        config.chartType = 'forceBubble';
        config.colors = this.config.chartColor;
        this.formatChartLegend(config, this.config.chartLegend);

        config.plotOptions.force = true;
        config.plotOptions.shadow = this.config.bubbleStyle !== this.constants.NO_PROJECT;
        config.plotOptions.dataLabels.enabled = true;
        config.plotOptions.dataLabels.align = "inside";
        config.plotOptions.dataLabels.style = this.config.chartFont;
        config.plotOptions.dataLabels.formatter.identifier = "${CATEGORY}${VALUE}";
        delete config.xAxis;
        delete config.yAxis;
        delete config.zoom;
        BI.each(items, function (idx, item) {
            BI.each(item.data, function (id, da) {
                da.y = self.formatXYDataWithMagnify(da.y, 1);
            })
        });
        config.legend.style = this.config.chartFont;
        return [items, config];
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            chartColor: options.chartColor || [],
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            bubbleStyle: options.bubbleStyle || c.NO_PROJECT,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;

        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.FORCE_BUBBLE);
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
BI.ForceBubbleChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.force_bubble_chart', BI.ForceBubbleChart);/**
 * 图表控件
 * @class BI.GISMapChart
 * @extends BI.Widget
 */
BI.GISMapChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.GISMapChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-gis-map-chart"
        })
    },

    _init: function () {
        BI.GISMapChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.GISMapChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        delete config.dataSheet;
        delete config.legend;
        delete config.zoom;
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.plotOptions.dataLabels.useHtml = true;
        config.plotOptions.dataLabels.style = this.config.chartFont;
        config.plotOptions.dataLabels.formatter = function () {
            var name = (BI.isArray(this.name) ? '' : this.name + ',') + BI.contentFormat(this.value, '#.##;-#.##') ;
            var style = "padding: 5px; background-color: rgba(0,0,0,0.4980392156862745);border-color: rgb(0,0,0); border-radius:2px; border-width:0px;";
            var a = '<div style = ' + style + '>' + name + '</div>';
            return a;
        };
        config.plotOptions.tooltip.shared = true;
        config.plotOptions.tooltip.formatter = function () {
            var tip = BI.isArray(this.name) ? '' : this.name;
            BI.each(this.points, function (idx, point) {
                tip += ('<div>' + point.seriesName + ':' + BI.contentFormat((point.size || point.y), '#.##;-#.##') + '</div>');
            });
            return tip;
        };
        config.geo = {
            "tileLayer": "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            "attribution": "<a><img src='http://webapi.amap.com/theme/v1.3/mapinfo_05.png'>&copy; 2016 AutoNavi</a>"
        };
        if (this.config.showBackgroundLayer === true && BI.isNotNull(this.config.backgroundLayerInfo)) {
            config.geo = {};
            if (this.config.backgroundLayerInfo.type === BICst.WMS_SERVER) {
                config.geo.tileLayer = false;
                config.geo.wmsUrl = this.config.backgroundLayerInfo.url;
                config.geo.wmsLayer = this.config.backgroundLayerInfo.wmsLayer
            } else {
                config.geo.tileLayer = this.config.backgroundLayerInfo.url;
            }
        }
        config.chartType = "pointMap";
        config.plotOptions.icon = {
            iconUrl: BICst.GIS_ICON_PATH,
            iconSize: [24, 24]
        };

        config.plotOptions.marker = {
            symbol: BICst.GIS_ICON_PATH,
            width: 24,
            height: 24,
            enable: true
        };
        delete config.xAxis;
        delete config.yAxis;
        return [items, config];

    },

    _checkLngLatValid: function (lnglat) {
        if (lnglat.length < 2) {
            return false;
        }
        return lnglat[0] <= 180 && lnglat[0] >= -180 && lnglat[1] <= 90 && lnglat[1] >= -90;
    },

    _formatItems: function (items) {
        var self = this;
        var results = [];
        BI.each(items, function (idx, item) {
            var result = [];
            BI.each(item, function (id, it) {
                var res = [];
                BI.each(it.data, function (i, da) {
                    da.y = self.formatXYDataWithMagnify(da.y, 1);
                    var lnglat = da.x.split(",");
                    if (self.config.lnglat === self.constants.LAT_FIRST) {
                        var lng = lnglat[1];
                        lnglat[1] = lnglat[0];
                        lnglat[0] = lng;
                    }
                    da.lnglat = lnglat;
                    da.value = da.y;
                    da.name = BI.isNotNull(da.z) ? da.z : da.lnglat;
                    if (self._checkLngLatValid(da.lnglat)) {
                        res.push(da);
                    }
                });
                if (BI.isNotEmptyArray(res)) {
                    result.push(BI.extend(it, {
                        data: res
                    }));
                }
            });
            if (BI.isNotEmptyArray(result)) {
                results.push(result);
            }
        });
        return results;
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            showDataLabel: options.showDataLabel || false,
            lnglat: options.lnglat || c.LNG_FIRST,
            chartFont: options.chartFont || c.FONT_STYLE,
            showBackgroundLayer: options.showBackgroundLayer || false,
            backgroundLayerInfo: options.backgroundLayerInfo
        };
        this.options.items = items;

        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function () {
                type.push(BICst.WIDGET.GIS_MAP);
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
BI.GISMapChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.gis_map_chart', BI.GISMapChart);/**
 * 图表控件
 * @class BI.LineChart
 * @extends BI.Widget
 */
BI.LineChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.LineChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-line-chart"
        })
    },

    _init: function () {
        BI.LineChart.superclass._init.apply(this, arguments);
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
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            xAxis: this.xAxis,
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.LineChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatChartLineStyle();
        formatCordon();
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
                    axis.title.rotation = self.constants.ROTATION;
                    title = getXYAxisUnit(self.config.leftYAxisNumberLevel, self.constants.LEFT_AXIS);
                    axis.title.text = self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + title : title;
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
                    title = getXYAxisUnit(self.config.rightYAxisNumberLevel, self.constants.RIGHT_AXIS);
                    axis.title.text = self.config.showRightYAxisTitle === true ? self.config.rightYAxisTitle + title : title;
                    axis.title.rotation = self.constants.ROTATION;
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
            }
        });

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            enableMinorTick: self.config.enableMinorTick,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        config.chartType = "line";

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

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
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }

        function formatChartLineStyle() {
            switch (self.config.chartLineType) {
                case BICst.CHART_SHAPE.RIGHT_ANGLE:
                    config.plotOptions.curve = false;
                    config.plotOptions.step = true;
                    break;
                case BICst.CHART_SHAPE.CURVE:
                    config.plotOptions.curve = true;
                    config.plotOptions.step = false;
                    break;
                case BICst.CHART_SHAPE.NORMAL:
                default:
                    config.plotOptions.curve = false;
                    config.plotOptions.step = false;
                    break;
            }
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
            leftYAxisTitle: options.leftYAxisTitle || "",
            rightYAxisTitle: options.rightYAxisTitle || "",
            chartLineType: options.chartLineType || c.NORMAL,
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.NORMAL,
            leftYAxisStyle: options.leftYAxisStyle || c.NORMAL,
            rightYAxisStyle: options.rightYAxisStyle || c.NORMAL,
            showXAxisTitle: options.showXAxisTitle || false,
            showLeftYAxisTitle: options.showLeftYAxisTitle || false,
            showRightYAxisTitle: options.showRightYAxisTitle || false,
            leftYAxisReversed: options.leftYAxisReversed || false,
            rightYAxisReversed: options.rightYAxisReversed || false,
            leftYAxisNumberLevel: options.leftYAxisNumberLevel || c.NORMAL,
            rightYAxisNumberLevel: options.rightYAxisNumberLevel || c.NORMAL,
            xAxisUnit: options.xAxisUnit || "",
            leftYAxisUnit: options.leftYAxisUnit || "",
            rightYAxisUnit: options.rightYAxisUnit || "",
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

        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.LINE);
            });
            types.push(type);
        });

        this.yAxis = [];
        BI.each(types, function (idx, type) {
            if (BI.isEmptyArray(type)) {
                return;
            }
            var newYAxis = {
                type: "value",
                title: {
                    style: self.constants.FONT_STYLE
                },
                labelStyle: self.constants.FONT_STYLE,
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
BI.LineChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.line_chart', BI.LineChart);/**
 * 图表控件
 * @class BI.MapChart
 * @extends BI.Widget
 */
BI.MapChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.MapChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-map-chart"
        })
    },

    _init: function () {
        BI.MapChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.MapChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, c = this.constants;
        formatRangeLegend();
        delete config.legend;
        delete config.zoom;
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.plotOptions.tooltip.shared = true;
        var formatterArray = [];
        BI.each(items, function (idx, item) {
            if (BI.has(item, "settings")) {
                formatterArray.push(formatToolTipAndDataLabel(item.settings.format || c.NORMAL, item.settings.num_level || c.NORMAL,
                    item.settings.unit || "", item.settings.numSeparators || c.NUM_SEPARATORS));
            }
        });
        config.plotOptions.tooltip.formatter = function () {
            var tip = this.name;
            var point = this.points[0];
            var index = BI.isNull(point.size) ? 0 : 1;
            tip += ('<div>' + point.seriesName + ':' + BI.contentFormat(point.size || point.y, formatterArray[index]) + '</div>');
            return tip;
        };
        config.plotOptions.dataLabels.formatter.valueFormat = function () {
            return BI.contentFormat(arguments[0], formatterArray[0]);
        };
        config.plotOptions.dataLabels.style = this.config.chartFont;

        config.plotOptions.bubble.dataLabels = config.plotOptions.dataLabels;
        config.plotOptions.bubble.dataLabels.formatter.identifier = "${SIZE}";

        config.plotOptions.bubble.tooltip = config.plotOptions.tooltip;

        config.geo = this.config.geo;
        if (this.config.showBackgroundLayer === true && BI.isNotNull(this.config.backgroundLayerInfo)) {
            if (this.config.backgroundLayerInfo.type === BICst.WMS_SERVER) {
                config.geo.tileLayer = false;
                config.geo.wmsUrl = this.config.backgroundLayerInfo.url;
                config.geo.wmsLayer = this.config.backgroundLayerInfo.wmsLayer
            } else {
                config.geo.tileLayer = this.config.backgroundLayerInfo.url;
            }
        }
        if (this.config.initDrillPath.length > 1) {
            config.initDrillPath = this.config.initDrillPath;
        }
        config.dTools.enabled = true;
        config.dTools.click = function (point) {
            point = point || {};
            var pointOption = point.options || {};
            self.fireEvent(BI.MapChart.EVENT_CLICK_DTOOL, pointOption);
        };
        config.chartType = "areaMap";
        delete config.xAxis;
        delete config.yAxis;

        var find = BI.find(items, function (idx, item) {
            return BI.has(item, "type") && item.type === "areaMap";
        });
        if (BI.isNull(find)) {
            items.push({
                type: "areaMap",
                data: []
            })
        }

        return [items, config];

        function formatRangeLegend() {
            config.rangeLegend.enabled = true;
            switch (self.config.chartLegend) {
                case BICst.CHART_LEGENDS.BOTTOM:
                    config.rangeLegend.visible = true;
                    config.rangeLegend.position = "bottom";
                    break;
                case BICst.CHART_LEGENDS.RIGHT:
                    config.rangeLegend.visible = true;
                    config.rangeLegend.position = "right";
                    break;
                case BICst.CHART_LEGENDS.NOT_SHOW:
                    config.rangeLegend.visible = false;
                    break;
            }
            config.rangeLegend.continuous = false;
            config.rangeLegend.range = getRangeStyle(self.config.mapStyles, self.config.autoCustom, self.config.themeColor);
            config.rangeLegend.formatter = function () {
                var to = this.to;
                if (BI.isNotEmptyArray(items) && BI.has(items[0], "settings")) {
                    var settings = items[0].settings;
                    var legendFormat = formatToolTipAndDataLabel(settings.format || c.NORMAL, settings.num_level || c.NORMAL,
                        settings.unit || "", settings.numSeparators || c.NUM_SEPARATORS);
                    to = BI.contentFormat(to, legendFormat)
                }
                return to
            };
        }

        function formatToolTipAndDataLabel(format, numberLevel, unit, numSeparators) {
            var formatter = '#.##';
            switch (format) {
                case self.constants.NORMAL:
                    formatter = '#.##';
                    if (numSeparators) formatter = '#,###.##';
                    break;
                case self.constants.ZERO2POINT:
                    formatter = '#0';
                    if (numSeparators) formatter = '#,###';
                    break;
                case self.constants.ONE2POINT:
                    formatter = '#0.0';
                    if (numSeparators) formatter = '#,###.0';
                    break;
                case self.constants.TWO2POINT:
                    formatter = '#0.00';
                    if (numSeparators) formatter = '#,###.00';
                    break;
            }

            switch (numberLevel) {
                case BICst.TARGET_STYLE.NUM_LEVEL.NORMAL:
                    formatter += '';
                    break;
                case BICst.TARGET_STYLE.NUM_LEVEL.TEN_THOUSAND:
                    formatter += BI.i18nText("BI-Wan");
                    break;
                case BICst.TARGET_STYLE.NUM_LEVEL.MILLION:
                    formatter += BI.i18nText("BI-Million");
                    break;
                case BICst.TARGET_STYLE.NUM_LEVEL.YI:
                    formatter += BI.i18nText("BI-Yi");
                    break;
                case BICst.TARGET_STYLE.NUM_LEVEL.PERCENT:
                    formatter += '%';
                    break;
            }

            return formatter + unit;
        }

        function getRangeStyle(styles, change, defaultColor) {
            var range = [], color = null, defaultStyle = {};
            var conditionMax = null, conditionMin = null, min = null;

            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, it) {
                    if (BI.isNull(min) || BI.parseFloat(min) > BI.parseFloat(it.y)) {
                        min = it.y
                    }
                })
            });

            switch (change) {
                case BICst.SCALE_SETTING.AUTO:
                    defaultStyle.color = defaultColor;
                    return defaultStyle;
                case BICst.SCALE_SETTING.CUSTOM:
                    if (styles.length !== 0) {
                        var maxScale = _calculateValueNiceDomain(0, self.max)[1];
                        BI.each(styles, function (idx, style) {
                            if (style.range.max) {
                                range.push({
                                    color: style.color || "rgba(255,255,255,0)",
                                    from: style.range.min,
                                    to: style.range.max
                                });
                            } else {
                                var to = style.range.min < maxScale ? maxScale : 266396;
                                range.push({
                                    color: style.color || "rgba(255,255,255,0)",
                                    from: style.range.min,
                                    to: to,
                                });
                            }
                            color = style.color;
                            conditionMax = style.range.max
                        });

                        conditionMin = BI.parseFloat(styles[0].range.min);
                        if (conditionMin !== 0) {
                            range.push({
                                color: "#808080",
                                from: 0,
                                to: conditionMin
                            });
                        }

                        if (conditionMax && conditionMax < maxScale) {
                            range.push({
                                color: color || "rgba(255,255,255,0)",
                                from: conditionMax,
                                to: maxScale
                            });
                        }
                        return range;
                    } else {
                        defaultStyle.color = defaultColor;
                        return defaultStyle;
                    }
            }
        }

        function _calculateValueNiceDomain(minValue, maxValue) {
            minValue = Math.min(0, minValue);
            var tickInterval = _linearTickInterval(minValue, maxValue);

            return _linearNiceDomain(minValue, maxValue, tickInterval);
        }

        function _linearTickInterval(minValue, maxValue, m) {
            m = m || 5;
            var span = maxValue - minValue;
            var step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10));
            var err = m / span * step;

            if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;

            return step;
        }

        function _linearNiceDomain(minValue, maxValue, tickInterval) {
            minValue = VanUtils.accMul(Math.floor(minValue / tickInterval), tickInterval);
            maxValue = VanUtils.accMul(Math.ceil(maxValue / tickInterval), tickInterval);

            return [minValue, maxValue];
        }
    },

    _formatDrillItems: function (items) {
        var self = this;
        BI.each(items.series, function (idx, da) {
            var hasArea = false;
            BI.each(da.data, function (idx, data) {
                data.y = self.formatXYDataWithMagnify(data.y, 1);
                if (BI.has(da, "settings")) {
                    data.y = self.formatXYDataWithMagnify(data.y, self.calcMagnify(da.settings.num_level || self.constants.NORMAL));
                }
                if (BI.has(da, "type") && da.type == "bubble") {
                    data.name = data.x;
                    data.size = data.y;
                } else {
                    data.name = data.x;
                    data.value = data.y;
                }
                if (BI.has(da, "type") && da.type === "areaMap") {
                    hasArea = true;
                }
                if (BI.has(data, "drilldown")) {
                    self._formatDrillItems(data.drilldown);
                }
            });
            if (hasArea === false) {
                items.series.push({
                    type: "areaMap",
                    data: []
                });
            }
        });
    },

    _formatItems: function (items) {
        var self = this;
        this.max = null;
        this.min = null;
        BI.each(items, function (idx, item) {
            BI.each(item, function (id, it) {
                BI.each(it.data, function (i, da) {
                    da.y = self.formatXYDataWithMagnify(da.y, 1);
                    if (BI.has(it, "settings")) {
                        da.y = self.formatXYDataWithMagnify(da.y, self.calcMagnify(it.settings.num_level || self.constants.NORMAL));
                    }
                    if ((BI.isNull(self.max) || BI.parseFloat(da.y) > BI.parseFloat(self.max)) && id === 0) {
                        self.max = da.y;
                    }
                    if ((BI.isNull(self.min) || BI.parseFloat(da.y) < BI.parseFloat(self.min)) && id === 0) {
                        self.min = da.y;
                    }
                    if (BI.has(it, "type") && it.type == "bubble") {
                        da.name = da.x;
                        da.size = da.y;
                    } else {
                        da.name = da.x;
                        da.value = da.y;
                    }
                    if (BI.has(da, "drilldown")) {
                        self._formatDrillItems(da.drilldown);
                    }
                });
            })
        });
        return items;
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            showDataLabel: options.showDataLabel || false,
            geo: options.geo,
            initDrillPath: options.initDrillPath || [],
            tooltip: options.tooltip || "",
            themeColor: options.themeColor || "#65bce7",
            mapStyles: options.mapStyles || [],
            autoCustom: options.autoCustom || c.AUTO_CUSTOM,
            showBackgroundLayer: options.showBackgroundLayer || false,
            backgroundLayerInfo: options.backgroundLayerInfo,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;

        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.MAP);
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
BI.MapChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.MapChart.EVENT_CLICK_DTOOL = "EVENT_CLICK_DTOOL";
BI.shortcut('bi.map_chart', BI.MapChart);/**
 * 图表控件
 * @class BI.MultiAxisChart
 * @extends BI.Widget
 * leftYxis 左值轴属性
 * rightYxis 右值轴属性
 * xAxis    分类轴属性
 */
BI.MultiAxisChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiAxisChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-axis-chart"
        })
    },

    _init: function () {
        BI.MultiAxisChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "category",
            title: {
                style: {"fontFamily": "inherit", "color": "#808080", "fontSize": "12px", "fontWeight": ""}
            },
            labelStyle: {
                "fontFamily": "inherit", "color": "#808080", "fontSize": "12px"
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
            self.fireEvent(BI.MultiAxisChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
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
            maxHeight: '40%'
        });

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

        //全局样式的图表文字
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
                            "style": {
                                "fontFamily": "inherit",
                                "color": "#808080",
                                "fontSize": "12px",
                                "fontWeight": ""
                            },
                            "text": t.text,
                            "align": "top"
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
                            "style": {
                                "fontFamily": "inherit",
                                "color": "#808080",
                                "fontSize": "12px",
                                "fontWeight": ""
                            },
                            "text": t.text,
                            "align": "left"
                        }
                    });
                });
            }
        })
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
            this.config.xAxisUnit !== "" && (unit = unit + this.config.xAxisUnit)
        }
        if (position === this.constants.LEFT_AXIS) {
            this.config.leftYAxisUnit !== "" && (unit = unit + this.config.leftYAxisUnit)
        }
        if (position === this.constants.RIGHT_AXIS) {
            this.config.rightYAxisUnit !== "" && (unit = unit + this.config.rightYAxisUnit)
        }
        if (position === this.constants.RIGHT_AXIS_SECOND) {
            this.config.rightYAxisSecondUnit !== "" && (unit = unit + this.config.rightYAxisSecondUnit)
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
                    style: {"fontFamily": "inherit", "color": "#808080", "fontSize": "12px", "fontWeight": ""}
                },
                labelStyle: {
                    "fontFamily": "inherit", "color": "#808080", "fontSize": "12px"
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
BI.MultiAxisChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.multi_axis_chart', BI.MultiAxisChart);/**
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
        })
    },

    _init: function () {
        BI.MultiAxisCombineChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.xAxis = [{
            type: "category",
            title: {
                style: {"fontFamily": "inherit", "color": "#808080", "fontSize": "12px", "fontWeight": ""}
            },
            labelStyle: {
                "fontFamily": "inherit", "color": "#808080", "fontSize": "12px"
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
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
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
            maxHeight: '40%'
        });

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabel(config.plotOptions.dataLabels.enabled, items, config, this.config.chartFont);

        //全局样式的图表文字
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
                            "style": {
                                "fontFamily": "inherit",
                                "color": "#808080",
                                "fontSize": "12px",
                                "fontWeight": ""
                            },
                            "text": t.text,
                            "align": "top"
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
                            "style": {
                                "fontFamily": "inherit",
                                "color": "#808080",
                                "fontSize": "12px",
                                "fontWeight": ""
                            },
                            "text": t.text,
                            "align": "left"
                        }
                    });
                });
            }
        })
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
            this.config.xAxisUnit !== "" && (unit = unit + this.config.xAxisUnit)
        }
        if (position === this.constants.LEFT_AXIS) {
            this.config.leftYAxisUnit !== "" && (unit = unit + this.config.leftYAxisUnit)
        }
        if (position === this.constants.RIGHT_AXIS) {
            this.config.rightYAxisUnit !== "" && (unit = unit + this.config.rightYAxisUnit)
        }
        if (position === this.constants.RIGHT_AXIS_SECOND) {
            this.config.rightYAxisSecondUnit !== "" && (unit = unit + this.config.rightYAxisSecondUnit)
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
                    style: {"fontFamily": "inherit", "color": "#808080", "fontSize": "12px", "fontWeight": ""}
                },
                labelStyle: {
                    "fontFamily": "inherit", "color": "#808080", "fontSize": "12px"
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
BI.shortcut('bi.multi_axis_combine_chart', BI.MultiAxisCombineChart);/**
 * 图表控件
 * @class BI.PercentAccumulateAreaChart
 * @extends BI.Widget
 */
BI.PercentAccumulateAreaChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.PercentAccumulateAreaChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-percent-accumulate-area-chart"
        })
    },

    _init: function () {
        BI.PercentAccumulateAreaChart.superclass._init.apply(this, arguments);
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
            self.fireEvent(BI.PercentAccumulateAreaChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
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
        config.yAxis[0].title.text = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS);
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        BI.extend(config.yAxis[0], {
            lineWidth: this.config.lineWidth,
            showLabel: this.config.showLabel,
            enableTick: this.config.enableTick,
            reversed: this.config.leftYAxisReversed,
            enableMinorTick: this.config.enableMinorTick,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            formatter: self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators)
        });
        self.formatNumberLevelInYaxis(config, items, this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS, config.yAxis[0].formatter, true);

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        config.chartType = "area";

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabelForAxis(config.plotOptions.dataLabels.enabled, items, config.yAxis[0].formatter, this.config.chartFont, true);

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
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
                    self.xAxis[0].plotLines = BI.map(cor, function (i, t) {
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
                                "style": self.config.chartFont,
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
                self.config.xAxisUnit !== "" && (unit = unit + self.config.xAxisUnit)
            }
            if (position === self.constants.LEFT_AXIS) {
                self.config.leftYAxisUnit !== "" && (unit = unit + self.config.leftYAxisUnit)
            }

            unit = unit === "" ? unit : "(" + unit + ")";

            return self.config.showLeftYAxisTitle === true ? self.config.leftYAxisTitle + unit : unit
        }
    },

    _formatItems: function (items) {
        return BI.map(items, function (idx, item) {
            var i = BI.UUID();
            return BI.map(item, function (id, it) {
                return BI.extend({}, it, {stack: i, stackByPercent: true});
            });
        });
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
            chartFont: options.chartFont || c.FONT_STYLE,
            nullContinue: options.nullContinue || false
        };
        this.options.items = items;

        var types = [];
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.AREA);
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
BI.PercentAccumulateAreaChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.percent_accumulate_area_chart', BI.PercentAccumulateAreaChart);/**
 * 图表控件 百分比堆积柱状
 * @class BI.PercentAccumulateAxisChart
 * @extends BI.Widget
 */
BI.PercentAccumulateAxisChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.PercentAccumulateAxisChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-percent-accumulate-axis-chart"
        })
    },

    _init: function () {
        BI.PercentAccumulateAxisChart.superclass._init.apply(this, arguments);
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
                style: self.constants.FONT_STYLE
            },
            labelStyle: self.constants.FONT_STYLE,
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
            self.fireEvent(BI.PercentAccumulateAxisChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function (config, items) {
        var self = this, o = this.options;
        var yTitle = getXYAxisUnit(this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS);
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatCordon();
        this.formatChartLegend(config, this.config.chartLegend);
        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.dataSheet.enabled = this.config.showDataTable;
        config.xAxis[0].showLabel = !config.dataSheet.enabled;
        config.zoom.zoomTool.enabled = this.config.showZoom;
        if (this.config.showZoom === true) {
            delete config.dataSheet;
            delete config.zoom.zoomType;
        }

        config.yAxis = this.yAxis;
        config.yAxis[0].title.rotation = this.constants.ROTATION;
        config.yAxis[0].title.text = this.config.showLeftYAxisTitle === true ? this.config.leftYAxisTitle + yTitle : yTitle;
        BI.extend(config.yAxis[0], {
            lineWidth: this.config.lineWidth,
            showLabel: this.config.showLabel,
            enableTick: this.config.enableTick,
            reversed: this.config.leftYAxisReversed,
            enableMinorTick: this.config.enableMinorTick,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            formatter: self.formatTickInXYaxis(this.config.leftYAxisStyle, this.config.leftYAxisNumberLevel, this.config.numSeparators)
        });
        self.formatNumberLevelInYaxis(config, items, this.config.leftYAxisNumberLevel, this.constants.LEFT_AXIS, config.yAxis[0].formatter, true);

        config.xAxis[0].title.align = "center";
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle : "";
        BI.extend(config.xAxis[0], {
            lineWidth: this.config.lineWidth,
            enableTick: this.config.enableTick,
            labelRotation: this.config.textDirection,
            enableMinorTick: this.config.enableMinorTick,
            gridLineWidth: this.config.showGridLine === true ? 1 : 0,
            maxHeight: '40%'
        });

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabelForAxis(config.plotOptions.dataLabels.enabled, items, config.yAxis[0].formatter, this.config.chartFont, true);

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
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                self.config.xAxisUnit !== "" && (unit = unit + self.config.xAxisUnit)
            }
            if (position === self.constants.LEFT_AXIS) {
                self.config.leftYAxisUnit !== "" && (unit = unit + self.config.leftYAxisUnit)
            }
            return unit === "" ? unit : "(" + unit + ")";
        }
    },

    _formatItems: function (items) {
        return BI.map(items, function (idx, item) {
            var i = BI.UUID();
            return BI.map(item, function (id, it) {
                return BI.extend({}, it, {stack: i, stackByPercent: true});
            });
        });
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
        BI.each(items, function (idx, axisItems) {
            var type = [];
            BI.each(axisItems, function (id, item) {
                type.push(BICst.WIDGET.AXIS);
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
BI.PercentAccumulateAxisChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.percent_accumulate_axis_chart', BI.PercentAccumulateAxisChart);/**
 * 图表控件
 * @class BI.PieChart
 * @extends BI.Widget
 */
BI.PieChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.PieChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-pie-chart"
        })
    },

    _init: function () {
        BI.PieChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.combineChart = BI.createWidget({
            type: "bi.combine_chart",
            popupItemsGetter: o.popupItemsGetter,
            formatConfig: BI.bind(this._formatConfig, this),
            element: this.element
        });
        this.combineChart.on(BI.CombineChart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.PieChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },

    _formatConfig: function(config, items){
        var self = this, o = this.options;
        delete config.zoom;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        formatChartPieStyle();

        this.formatChartLegend(config, this.config.chartLegend);

        config.plotOptions.dataLabels.enabled = this.config.showDataLabel;
        config.plotOptions.tooltip.formatter.identifier = "${CATEGORY}${SERIES}${VALUE}${PERCENT}";

        config.chartType = "pie";
        delete config.xAxis;
        delete config.yAxis;
        config.plotOptions.dataLabels.align = "outside";
        config.plotOptions.dataLabels.connectorWidth = "outside";
        config.plotOptions.dataLabels.formatter.identifier = "${VALUE}${PERCENT}";
        config.plotOptions.dataLabels.style = this.config.chartFont;
        BI.each(items, function (idx, item) {
            BI.each(item.data, function (id, da) {
                da.y = self.formatXYDataWithMagnify(da.y, 1);
            })
        });

        config.legend.style = this.config.chartFont;

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

        function formatChartPieStyle(){
            switch (self.config.chartPieType){
                case BICst.CHART_SHAPE.EQUAL_ARC_ROSE:
                    config.plotOptions.roseType = "sameArc";
                    break;
                case BICst.CHART_SHAPE.NOT_EQUAL_ARC_ROSE:
                    config.plotOptions.roseType = "differentArc";
                    break;
                case BICst.CHART_SHAPE.NORMAL:
                default:
                    delete config.plotOptions.roseType;
                    break;
            }
            config.plotOptions.innerRadius = self.config.chartInnerRadius + "%";
            config.plotOptions.endAngle = self.config.chartTotalAngle;
        }

    },

    //目前饼图不会有多个系列，如果有多个就要把它们合并在一起
    _isNeedConvert: function(items){
        var result = BI.find(items, function(idx, item){
            return item.length > 1;
        });
        return BI.isNotNull(result);
    },

    _formatItems: function(items){
        if(this._isNeedConvert(items)){
            //把每个坐标轴所有的多个系列合并成一个系列
            return BI.map(items, function(idx, item){
                var seriesItem = [];
                var obj = {data: [], name: ""};
                seriesItem.push(obj);
                BI.each(item, function(id, series){
                    BI.each(series.data, function(i, da){
                        obj.data.push(BI.extend({}, da, {x: series.name}));
                    });
                });
                return seriesItem;
            })
        }else{
            return items;
        }
    },

    populate: function (items, options) {
        options || (options = {});
        var self = this, c = this.constants;
        this.config = {
            chartColor: options.chartColor || [],
            chartStyle: options.chartStyle || c.NORMAL,
            chartPieType: options.chartPieType || c.NORMAL,
            chartLegend: options.chartLegend || c.LEGEND_BOTTOM,
            showDataLabel: options.showDataLabel || false,
            chartInnerRadius: options.chartInnerRadius || 0,
            chartTotalAngle: options.chartTotalAngle || BICst.PIE_ANGLES.TOTAL,
            chartFont: options.chartFont || c.FONT_STYLE
        };
        this.options.items = items;

        var types = [];
        BI.each(items, function(idx, axisItems){
            var type = [];
            BI.each(axisItems, function(id, item){
                type.push(BICst.WIDGET.PIE);
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
BI.PieChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.pie_chart', BI.PieChart);

/**
 * 图表控件
 * @class BI.RadarChart
 * @extends BI.Widget
 */
BI.RadarChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.RadarChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-radar-chart"
        })
    },

    _init: function () {
        BI.RadarChart.superclass._init.apply(this, arguments);
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
            self.fireEvent(BI.RadarChart.EVENT_CHANGE, obj);
        });
        this.combineChart.on(BI.CombineChart.EVENT_ITEM_CLICK, function (obj) {
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
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
        delete config.xAxis;
        delete config.yAxis;
        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabelForAxis(config.plotOptions.dataLabels.enabled, items, config.radiusAxis[0].formatter, this.config.chartFont);

        //全局样式
        config.legend.style = this.config.chartFont;
        config.radiusAxis[0].title.style = config.radiusAxis[0].labelStyle = this.config.chartFont;
        config.angleAxis[0].title.style = config.angleAxis[0].labelStyle = this.config.chartFont;

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
            chartRadarType: options.chartRadarType || c.POLYGON,
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
        this.combineChart.populate(items, types);
    },

    resize: function () {
        this.combineChart.resize();
    },

    magnify: function () {
        this.combineChart.magnify();
    }
});
BI.RadarChart.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.radar_chart', BI.RadarChart);/**
 * 图表控件
 * @class BI.RangeAreaChart
 * @extends BI.Widget
 * 范围面积图的构造范围的两组item的必须有对应y值item1完全大于item2
 */
BI.RangeAreaChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.RangeAreaChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-range-area-chart"
        })
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
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
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
            maxHeight: '40%'
        });

        config.chartType = "area";
        config.plotOptions.tooltip.formatter.identifier = "${CATEGORY}${VALUE}";

        //为了给数据标签加个%,还要遍历所有的系列，唉
        this.formatDataLabelForAxis(config.plotOptions.dataLabels.enabled, items, config.yAxis[0].formatter, this.config.chartFont);

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
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
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
                                "style" : self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
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
BI.shortcut('bi.range_area_chart', BI.RangeAreaChart);/**
 * 图表控件
 * @class BI.ScatterChart
 * @extends BI.Widget
 */
BI.ScatterChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.ScatterChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-scatter-chart"
        })
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
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj)
        });
    },


    _formatConfig: function (config, items) {
        var self = this;
        delete config.zoom;
        config.colors = this.config.chartColor;
        config.style = formatChartStyle();
        config.plotOptions.marker = {"symbol": "circle", "radius": 4.5, "enabled": true};
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
        config.yAxis[0].maxWidth = '40%';

        config.xAxis[0].formatter = self.formatTickInXYaxis(this.config.xAxisStyle, this.config.xAxisNumberLevel, this.config.rightNumSeparators);
        formatNumberLevelInXaxis(this.config.xAxisNumberLevel);
        config.xAxis[0].title.text = getXYAxisUnit(this.config.xAxisNumberLevel, this.constants.X_AXIS);
        config.xAxis[0].title.text = this.config.showXAxisTitle === true ? this.config.xAxisTitle + config.xAxis[0].title.text : config.xAxis[0].title.text;
        config.xAxis[0].title.align = "center";
        config.xAxis[0].gridLineWidth = this.config.showGridLine === true ? 1 : 0;
        config.xAxis[0].maxHeight = '40%';
        config.chartType = "scatter";

        if (BI.isNotEmptyArray(this.config.tooltip)) {
            config.plotOptions.tooltip.formatter = function () {
                var y = self.formatTickInXYaxis(self.config.leftYAxisStyle, self.config.leftYAxisNumberLevel, self.config.numSeparators)(this.y);
                var x = self.formatTickInXYaxis(self.config.xAxisStyle, self.config.xAxisNumberLevel, self.config.rightNumSeparators)(this.x);
                return this.seriesName + '<div>(X)' + self.config.tooltip[0]
                    + ':' + x + '</div><div>(Y)' + self.config.tooltip[1] + ':' + y + '</div>'
            };
        }

        if (config.plotOptions.dataLabels.enabled === true) {
            BI.each(items, function (idx, item) {
                item.dataLabels = {
                    "style": self.config.chartFont,
                    "align": "outside",
                    "autoAdjust": true,
                    enabled: true,
                    formatter: {
                        identifier: "${X}${Y}",
                        "XFormat": function () {
                            return BI.contentFormat(arguments[0], '#.##;-#.##')
                        },
                        "YFormat": function () {
                            return BI.contentFormat(arguments[0], '#.##;-#.##')
                        }
                    }
                };
                item.dataLabels.formatter.XFormat = config.xAxis[0].formatter;
                item.dataLabels.formatter.YFormat = config.yAxis[0].formatter;
            });
        }

        //全局样式图表文字
        config.legend.style = this.config.chartFont;
        config.yAxis[0].title.style = config.yAxis[0].labelStyle = this.config.chartFont;
        config.xAxis[0].title.style = config.xAxis[0].labelStyle = this.config.chartFont;

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
                    var magnify = self.calcMagnify(self.config.xAxisNumberLevel);
                    self.xAxis[0].plotLines = BI.map(cor, function (i, t) {
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
                                "style": self.config.chartFont,
                                "text": t.text,
                                "align": "left"
                            }
                        });
                    });
                }
            })
        }

        function formatNumberLevelInXaxis(type) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, da) {
                    da.x = self.formatXYDataWithMagnify(da.x, magnify);
                })
            })
        }

        function formatNumberLevelInYaxis(type) {
            var magnify = self.calcMagnify(type);
            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, da) {
                        da.y = self.formatXYDataWithMagnify(da.y, magnify);
                })
            });
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
BI.shortcut('bi.scatter_chart', BI.ScatterChart);