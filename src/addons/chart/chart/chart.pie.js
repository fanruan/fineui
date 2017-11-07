/**
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

