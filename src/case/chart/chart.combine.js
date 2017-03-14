/**
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
            formatConfig: function(config){return config;}
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
            self.fireEvent(BI.CombineChart.EVENT_CHANGE, this.pointOption);
        };
        return [result, config];
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
        var result = o.formatConfig(opts[1], opts[0]);
        this.CombineChart.populate(result[0], result[1]);
    },

    resize: function () {
        this.CombineChart.resize();
    },

    magnify: function(){
        this.CombineChart.magnify();
    }
});
BI.CombineChart.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.combine_chart', BI.CombineChart);