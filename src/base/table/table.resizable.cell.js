/**
 *
 * 表格单元格
 *
 * Created by GUY on 2016/1/12.
 * @class BI.ResizableTableCell
 * @extends BI.Widget
 */
BI.ResizableTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ResizableTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-resizable-table-cell",
            cell: {},
            minSize: 15,
            // suitableSize,
            maxSize: Number.MAX_VALUE,
            start: BI.emptyFn,
            resize: BI.emptyFn,
            stop: BI.emptyFn
        })
    },

    _init: function () {
        BI.ResizableTableCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.cell = BI.createWidget(BI.extend({type: "bi.label"}, o.cell, {width: o.width, height: o.height}));

        var startDrag = false;
        var size = 0, offset = 0, defaultSize = o.width;

        function optimizeSize(s) {
            var optSize = BI.clamp(s, o.minSize, o.maxSize || Number.MAX_VALUE);
            if (o.suitableSize) {
                if (Math.abs(o.suitableSize - optSize) < 5) {
                    optSize = o.suitableSize;
                    self.handler.element.addClass("suitable");
                } else {
                    self.handler.element.removeClass("suitable");
                }
            }
            return optSize;
        }

        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX, deltaY) {
            if (mouseMoveTracker.isDragging()) {
                startDrag = true;
                offset += deltaX;
                size = optimizeSize(defaultSize + offset);
                self.handler.element.addClass("dragging");
                o.resize(size);
            }
        }, function () {
            if (startDrag === true) {
                size = optimizeSize(size);
                o.stop(size);
                size = 0;
                offset = 0;
                defaultSize = o.width;
                self.handler.element.removeClass("dragging");
                self.handler.element.removeClass("suitable");
                startDrag = false;
            }
            mouseMoveTracker.releaseMouseMoves();
        }, document);
        this.handler = BI.createWidget({
            type: "bi.absolute",
            cls: "resizable-table-cell-resizer-container",
            width: 6,
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "resizable-table-cell-resizer-knob",
                    width: 4
                },
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.handler.element.on("mousedown", function (event) {
            defaultSize = o.width;
            mouseMoveTracker.captureMouseMoves(event);
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.cell,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: this.handler,
                right: 0,
                top: 0,
                bottom: 0
            }]
        })
    },

    setWidth: function (width) {
        BI.ResizableTableCell.superclass.setWidth.apply(this, arguments);
        var o = this.options;
        this.cell.setWidth(o.width);
    },

    setHeight: function (height) {
        BI.ResizableTableCell.superclass.setHeight.apply(this, arguments);
        var o = this.options;
        this.cell.setHeight(o.height);
    }
});
BI.shortcut("bi.resizable_table_cell", BI.ResizableTableCell);