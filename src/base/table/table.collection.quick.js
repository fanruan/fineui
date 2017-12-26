/**
 * QuickCollectionTable
 *
 * Created by GUY on 2016/1/12.
 * @class BI.QuickCollectionTable
 * @extends BI.CollectionTable
 */
BI.QuickCollectionTable = BI.inherit(BI.CollectionTable, {
    _defaultConfig: function () {
        return BI.extend(BI.QuickCollectionTable.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-quick-collection-table"
        });
    },

    render: function () {
        BI.QuickCollectionTable.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.topLeftCollection.setOverflowX(false);
        this.topLeftCollection.setOverflowY(false);
        this.topRightCollection.setOverflowX(false);
        this.topRightCollection.setOverflowY(false);
        this.bottomLeftCollection.setOverflowX(false);
        this.bottomLeftCollection.setOverflowY(false);
        this.bottomRightCollection.setOverflowX(false);
        this.bottomRightCollection.setOverflowY(false);
    },

    mounted: function () {
        BI.QuickCollectionTable.superclass.mounted.apply(this, arguments);
        var self = this;
        this._topLeftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelLeft, this),
            BI.bind(this._shouldHandleLeftX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._topRightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelRight, this),
            BI.bind(this._shouldHandleRightX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._bottomLeftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelLeft, this),
            BI.bind(this._shouldHandleLeftX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._bottomRightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelRight, this),
            BI.bind(this._shouldHandleRightX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this.topLeftCollection.element.mousewheel(function (e) {
            self._topLeftWheelHandler.onWheel(e.originalEvent);
        });
        this.topRightCollection.element.mousewheel(function (e) {
            self._topRightWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomLeftCollection.element.mousewheel(function (e) {
            self._bottomLeftWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomRightCollection.element.mousewheel(function (e) {
            self._bottomRightWheelHandler.onWheel(e.originalEvent);
        });
    },

    _shouldHandleLeftX: function (delta) {
        if (delta > 0) {
            return this.bottomLeftCollection.getScrollLeft() < this.bottomLeftCollection.getMaxScrollLeft();
        }
        return this.bottomLeftCollection.getScrollLeft() > 0;
        
    },

    _shouldHandleRightX: function (delta) {
        if (delta > 0) {
            return this.bottomRightCollection.getScrollLeft() < this.bottomRightCollection.getMaxScrollLeft();
        }
        return this.bottomRightCollection.getScrollLeft() > 0;
        
    },

    _shouldHandleY: function (delta) {
        if (delta > 0) {
            return this.bottomRightCollection.getScrollTop() < this.bottomRightCollection.getMaxScrollTop();
        }
        return this.bottomRightCollection.getScrollTop() > 0;
        
    },

    _onWheelLeft: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomLeftCollection.getScrollTop();
        var scrollLeft = this.bottomLeftCollection.getScrollLeft();
        scrollTop += deltaY;
        scrollLeft += deltaX;
        this.bottomLeftCollection.setScrollTop(scrollTop);
        this.bottomRightCollection.setScrollTop(scrollTop);
        this.topLeftCollection.setScrollLeft(scrollLeft);
        this.bottomLeftCollection.setScrollLeft(scrollLeft);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _onWheelRight: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomRightCollection.getScrollTop();
        var scrollLeft = this.bottomRightCollection.getScrollLeft();
        scrollTop += deltaY;
        scrollLeft += deltaX;
        this.bottomLeftCollection.setScrollTop(scrollTop);
        this.bottomRightCollection.setScrollTop(scrollTop);
        this.topRightCollection.setScrollLeft(scrollLeft);
        this.bottomRightCollection.setScrollLeft(scrollLeft);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _populateTable: function () {
        var self = this, o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0,
            summaryColumnSizeArray = [];
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });

        var otlw = regionSize;
        var otlh = this._getFreezeHeaderHeight();
        var otrw = this._width - regionSize;
        var otrh = this._getFreezeHeaderHeight();
        var oblw = regionSize;
        var oblh = this._height - otlh;
        var obrw = this._width - regionSize;
        var obrh = this._height - otrh;

        this.topLeft.setWidth(otlw);
        this.topLeft.setHeight(otlh);
        this.topRight.setWidth(otrw);
        this.topRight.setHeight(otrh);
        this.bottomLeft.setWidth(oblw);
        this.bottomLeft.setHeight(oblh);
        this.bottomRight.setWidth(obrw);
        this.bottomRight.setHeight(obrh);

        this.topLeftCollection.setWidth(otlw);
        this.topLeftCollection.setHeight(otlh);
        this.topRightCollection.setWidth(otrw);
        this.topRightCollection.setHeight(otrh);
        this.bottomLeftCollection.setWidth(oblw);
        this.bottomLeftCollection.setHeight(oblh);
        this.bottomRightCollection.setWidth(obrw);
        this.bottomRightCollection.setHeight(obrh);

        var items = this.contextLayout.attr("items");
        items[1].left = regionSize;
        items[2].top = this._getFreezeHeaderHeight();
        items[3].left = regionSize;
        items[3].top = this._getFreezeHeaderHeight();
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();

        var leftHeader = [], rightHeader = [], leftItems = [], rightItems = [];
        var run = function (positions, items, rendered) {
            BI.each(positions, function (i, item) {
                var cell = {
                    type: "bi.collection_table_cell",
                    cell: items[item.row][item.col]
                };
                rendered.push(cell);
            });
        };
        run(this.topLeftItems, o.header, leftHeader);
        run(this.topRightItems, o.header, rightHeader);
        run(this.bottomLeftItems, this._getActualItems(), leftItems);
        run(this.bottomRightItems, this._getActualItems(), rightItems);

        this.topLeftCollection.populate(leftHeader);
        this.topRightCollection.populate(rightHeader);
        this.bottomLeftCollection.populate(leftItems);
        this.bottomRightCollection.populate(rightItems);
    }
});
BI.shortcut("bi.quick_collection_table", BI.QuickCollectionTable);