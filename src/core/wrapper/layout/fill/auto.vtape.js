BI.AutoVerticalTapeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AutoVerticalTapeLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-auto-vtape",
            horizontalAlign: BI.HorizontalAlign.Stretch,
            verticalAlign: BI.VerticalAlign.Stretch,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            rowSize: [],
            items: []
        });
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vtape",
            ref: function (_ref) {
                self.layout = _ref;
            },
            items: o.items,
            horizontalAlign: o.horizontalAlign,
            verticalAlign: o.verticalAlign,
            rowSize: o.rowSize,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
        };
    },

    _handleResize: function () {
        var self = this, o = this.options;
        var items = o.items;
        var top = {}, bottom = {};
        top[0] = o.innerVgap;
        bottom[items.length - 1] = o.innerVgap;

        BI.any(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var w = self.layout.getWidgetByName(self._getChildName(i));
            var rowSize = o.rowSize.length > 0 ? o.rowSize[i] : item.height;
            if (o.rowSize.length > 0) {
                if (item.height >= 1 && o.rowSize[i] >= 1 && o.rowSize[i] !== item.height) {
                    rowSize = item.height;
                }
            }
            if (BI.isNull(top[i])) {
                var preRowSize = o.rowSize.length > 0 ? o.rowSize[i - 1] : items[i - 1].height;
                if (preRowSize === "") {
                    preRowSize = self.layout.getWidgetByName(self._getChildName(i - 1)).element.height();
                }
                top[i] = top[i - 1] + preRowSize + (items[i - 1].tgap || 0) + (items[i - 1].bgap || 0) + 2 * (items[i - 1].vgap || 0) + o.vgap + o.tgap + o.bgap;
            }
            w.element.css({
                top: self._optimiseGap(top[i] + (item.vgap || 0) + (item.tgap || 0) + o.vgap + o.tgap)
            });

            if (rowSize === "fill") {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var w = self.layout.getWidgetByName(self._getChildName(i));
            var rowSize = o.rowSize.length > 0 ? o.rowSize[i] : item.height;
            if (BI.isNull(bottom[i])) {
                var nextRowSize = o.rowSize.length > 0 ? o.rowSize[i + 1] : items[i + 1].height;
                if (nextRowSize === "") {
                    nextRowSize = self.layout.getWidgetByName(self._getChildName(i + 1)).element.height();
                }
                bottom[i] = bottom[i + 1] + nextRowSize + (items[i + 1].tgap || 0) + (items[i + 1].bgap || 0) + 2 * (items[i + 1].vgap || 0) + o.vgap + o.tgap + o.bgap;
            }
            w.element.css({
                bottom: self._optimiseGap(bottom[i] + (item.vgap || 0) + (item.bgap || 0) + o.vgap + o.bgap),
            });

            if (rowSize === "fill") {
                return true;
            }
        });
    },

    mounted: function () {
        if (window.ResizeObserver) {
            this.resizeObserver = new window.ResizeObserver(this._handleResize.bind(this));
            this.resizeObserver.observe(this.element[0]);
        }
        if (window.MutationObserver) {
            this.mutationObserver = new window.MutationObserver(this._handleResize.bind(this));
            this.mutationObserver.observe(this.element[0], {
                attributes: true,
                childList: true,
                subtree: true
            });
        }
        this._handleResize();
    },

    destroyed: function () {
        this.resizeObserver && this.resizeObserver.unobserve(this.element[0]);
        this.mutationObserver && this.mutationObserver.disconnect();
    },

    resize: function () {
        this.layout.resize();
    },

    populate: function (items) {
        this.layout.populate.apply(this.layout, arguments);
    }
});
BI.shortcut("bi.vtape_auto", BI.AutoVerticalTapeLayout);
