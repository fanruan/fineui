/**
 * 图表控件
 * @class BI.Chart
 * @extends BI.Widget
 */
BI.Chart = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.Chart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-chart"
        });
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
        this.vanCharts.refreshRestore();
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
BI.shortcut("bi.chart", BI.Chart);