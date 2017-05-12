/**
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
BI.shortcut('bi.gis_map_chart', BI.GISMapChart);