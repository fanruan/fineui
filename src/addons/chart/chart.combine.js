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
BI.shortcut('bi.combine_chart', BI.CombineChart);