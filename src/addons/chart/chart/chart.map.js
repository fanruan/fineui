/**
 * 图表控件
 * @class BI.MapChart
 * @extends BI.Widget
 */
BI.MapChart = BI.inherit(BI.AbstractChart, {

    _defaultConfig: function () {
        return BI.extend(BI.MapChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-map-chart"
        });
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
            self.fireEvent(BI.AbstractChart.EVENT_ITEM_CLICK, obj);
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
            tip += ("<div>" + point.seriesName + ":" + BI.contentFormat(point.size || point.y, formatterArray[index]) + "</div>");
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
                config.geo.wmsLayer = this.config.backgroundLayerInfo.wmsLayer;
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
            });
        }

        return [items, config];

        function formatRangeLegend () {
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
                    to = BI.contentFormat(to, legendFormat);
                }
                return to;
            };
        }

        function formatToolTipAndDataLabel (format, numberLevel, unit, numSeparators) {
            var formatter = "#.##";
            switch (format) {
                case self.constants.NORMAL:
                    formatter = "#.##";
                    if (numSeparators) formatter = "#,###.##";
                    break;
                case self.constants.ZERO2POINT:
                    formatter = "#0";
                    if (numSeparators) formatter = "#,###";
                    break;
                case self.constants.ONE2POINT:
                    formatter = "#0.0";
                    if (numSeparators) formatter = "#,###.0";
                    break;
                case self.constants.TWO2POINT:
                    formatter = "#0.00";
                    if (numSeparators) formatter = "#,###.00";
                    break;
            }

            switch (numberLevel) {
                case BICst.TARGET_STYLE.NUM_LEVEL.NORMAL:
                    formatter += "";
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
                    formatter += "%";
                    break;
            }

            return formatter + unit;
        }

        function getRangeStyle (styles, change, defaultColor) {
            var range = [], color = null, defaultStyle = {};
            var conditionMax = null, conditionMin = null, min = null;

            BI.each(items, function (idx, item) {
                BI.each(item.data, function (id, it) {
                    if (BI.isNull(min) || BI.parseFloat(min) > BI.parseFloat(it.y)) {
                        min = it.y;
                    }
                });
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
                                    to: to
                                });
                            }
                            color = style.color;
                            conditionMax = style.range.max;
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
                    }
                    defaultStyle.color = defaultColor;
                    return defaultStyle;
                    
            }
        }

        function _calculateValueNiceDomain (minValue, maxValue) {
            minValue = Math.min(0, minValue);
            var tickInterval = _linearTickInterval(minValue, maxValue);

            return _linearNiceDomain(minValue, maxValue, tickInterval);
        }

        function _linearTickInterval (minValue, maxValue, m) {
            m = m || 5;
            var span = maxValue - minValue;
            var step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10));
            var err = m / span * step;

            if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;

            return step;
        }

        function _linearNiceDomain (minValue, maxValue, tickInterval) {
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
            });
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
BI.shortcut("bi.map_chart", BI.MapChart);