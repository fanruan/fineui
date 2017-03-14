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

    _init: function () {
        BI.QuickCollectionTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.topLeftCollection.setOverflowX(false);
        this.topLeftCollection.setOverflowY(false);
        this.topRightCollection.setOverflowX(false);
        this.topRightCollection.setOverflowY(false);
        this.bottomLeftCollection.setOverflowX(false);
        this.bottomLeftCollection.setOverflowY(false);
        this.bottomRightCollection.setOverflowX(false);
        this.bottomRightCollection.setOverflowY(false);
        this._leftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelY, this),
            BI.bind(this._shouldHandleX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._rightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelY, this),
            BI.bind(this._shouldHandleX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this.bottomLeftCollection.element.mousewheel(function (e) {
            self._leftWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomRightCollection.element.mousewheel(function (e) {
            self._rightWheelHandler.onWheel(e.originalEvent);
        });
    },

    _shouldHandleX: function (delta) {
        return false;
    },

    _shouldHandleY: function (delta) {
        if (delta > 0) {
            return this.bottomRightCollection.getScrollTop() < this.bottomRightCollection.getMaxScrollTop();
        } else {
            return this.bottomRightCollection.getScrollTop() > 0;
        }
    },

    _onWheelY: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomRightCollection.getScrollTop();
        scrollTop += deltaY;
        this.bottomLeftCollection.setScrollTop(scrollTop);
        this.bottomRightCollection.setScrollTop(scrollTop);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _populateTable: function () {
        var self = this, o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0, summaryColumnSizeArray = [], totalRowSize = o.items.length * o.rowSize;
        var freezeColLength = this._getFreezeColLength();
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
        var otlh = o.header.length * o.headerRowSize;
        var otrw = this._width - regionSize;
        var otrh = o.header.length * o.headerRowSize;
        var oblw = regionSize;
        var oblh = this._height - o.header.length * o.headerRowSize;
        var obrw = this._width - regionSize;
        var obrh = this._height - o.header.length * o.headerRowSize;

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
        items[2].top = o.header.length * o.headerRowSize;
        items[3].left = regionSize;
        items[3].top = o.header.length * o.headerRowSize;
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
        run(this.bottomLeftItems, o.items, leftItems);
        run(this.bottomRightItems, o.items, rightItems);

        this.topLeftCollection.populate(leftHeader);
        this.topRightCollection.populate(rightHeader);
        this.bottomLeftCollection.populate(leftItems);
        this.bottomRightCollection.populate(rightItems);
    }
});
$.shortcut('bi.quick_collection_table', BI.QuickCollectionTable);