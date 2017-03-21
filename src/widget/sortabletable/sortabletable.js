/**
 * 可以交换列位置的表格
 *
 * @class BI.SortableTable
 * @extends BI.Widget
 */
BI.SortableTable = BI.inherit(BI.Widget, {

    _const: {
        perColumnSize: 100,
        dragButtonWidth: 24,
        dragButtonHeight: 24,
        lineCount: 6,
        lineWidth: 3
    },

    _defaultConfig: function () {
        return BI.extend(BI.SortableTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sortable-table",

            headerRowSize: 30,
            footerRowSize: 25,
            rowSize: 25,
            sortable: true,

            header: [],
            items: [] //二维数组
        });
    },

    _init: function () {
        BI.SortableTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.insertLine = [];

        this.table = BI.createWidget({
            type: "bi.table_view",
            isNeedResize: false,
            isResizeAdapt: false,
            columnSize: [],
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: false,
            header: o.header,
            items: o.items
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            if(o.sortable === true){
                self._initDrag();
                self._createDashedLines();
                self._createInsertLine();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            if(o.sortable === true){
                self._createDashedLines();
                self._createInsertLine();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });

        this.table.element.mousemove(function(e){
            BI.each(self.dragHelpers, function(idx, dragHelper){
                var visible = (idx === self._getMouseInColumnIndex(e));
                dragHelper.setVisible(visible);
                BI.each(self.dragHelpersLines[idx], function(id, line){
                    line.setVisible(visible);
                })
            })
        })

        this.table.element.hover(function(e){
        }, function(e){
            BI.each(self.dragHelpers, function(idx, dragHelper){
                dragHelper.setVisible(false);
                BI.each(self.dragHelpersLines[idx], function(id, line){
                    line.setVisible(false);
                })
            })
        });

        this.element.droppable({
            accept: ".drag-header",
            drop: function (e, ui) {
                var absolutePosition = ui.position.left + self.table.getRightHorizontalScroll() + (e.pageX - ui.helper.offset().left);
                var dropPosition = self._getColumnsLeftBorderDistance();
                var insertIndex = self._getNearIndexFromArray(dropPosition, absolutePosition)
                //这个insertIndex是包含原元素的index
                //调整item顺序，重新populate
                var flag = self._exchangeItemsAndHeaderPosition(ui.helper.data("index"), insertIndex)
                if(flag === true){
                    BI.nextTick(function(){
                        self.populate(o.items, o.header);
                    });
                    self.fireEvent(BI.SortableTable.EVENT_CHANGE, ui.helper.data("index"), insertIndex);
                }
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            scrollx: false,
            element: this,
            items: [this.table]
        });
    },

    /**
     * 插入到对应列的辅助线
     * @private
     */
    _createInsertLine: function(){
        var self = this;
        var dropPosition = this._getColumnsLeftBorderDistance();
        var height = this.table.getClientRegionRowSize()[0];
        var lineObj = {
            type: "bi.layout",
            cls: "insert-help-line",
            invisible: true
        };
        this.insertLine = [BI.createWidget(lineObj)];
        var hearders = this.table.getColumns().header[0];
        BI.each(hearders, function(idx, header){
            var line = BI.createWidget(BI.extend(lineObj));
            self.insertLine.push(line);
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.table.element,
            items: BI.map(self.insertLine, function(idx, line){
                if(idx === self.insertLine.length - 1){
                    return {
                        el: line,
                        top: 0,
                        height: height,
                        right: 0
                    }
                }
                return {
                    el: line,
                    top: 0,
                    height: height,
                    left: dropPosition[idx]
                }
            })
        })
    },

    _createDashedLines: function(){
        var self = this, c = this._const, o = this.options;
        var RowsSize = this.table.getClientRegionRowSize();
        var columnsSizes = this.table.getCalculateColumnSize();
        var dropPosition = this._getColumnsLeftBorderDistance();
        var len = this.table.getCalculateRegionColumnSize()[0];
        this.dragHelpersLines = [];
        BI.each(this.table.getColumns().header[0], function(idx, header){
            self.dragHelpersLines.push([BI.createWidget({
                type:"bi.horizontal_dash_line",      //上
                width: columnsSizes[idx],
                height: c.lineWidth,
                invisible: true
            }),BI.createWidget({
                type:"bi.vertical_dash_line",        //右
                width: c.lineWidth,
                height: RowsSize[0],
                invisible: true
            }),BI.createWidget({
                type:"bi.horizontal_dash_line",      //下
                width: columnsSizes[idx],
                height: c.lineWidth,
                invisible: true
            }),BI.createWidget({                //左
                type:"bi.vertical_dash_line",
                width: c.lineWidth,
                height: RowsSize[0],
                invisible: true
            })]);
        });
        var length = this.dragHelpersLines.length;
        BI.createWidget({
            type: "bi.absolute",
            element: self.table,
            items: BI.flatten(BI.map(this.dragHelpersLines, function(idx, children){
                return BI.map(children, function(id, child){
                    var baseObj = {
                        el: child,
                        width: id % 2 === 0 ? columnsSizes[idx] : c.lineWidth,
                        height: id % 2 === 0 ? c.lineWidth : RowsSize[0]
                    }
                    if(id === 0 || id === children.length - 1){     //上和左
                        return BI.extend({
                            top: 0,
                            left: dropPosition[idx],
                        }, baseObj)
                    }else{
                        return BI.extend({                                    //右和下
                            bottom: 0,
                            right:  idx === length - 1 ? 0 : len - dropPosition[idx + 1],
                        }, baseObj)
                    }
                });
            }))
        })
    },

    _initDrag: function(){
        var self = this, c = this._const, o = this.options;
        this.dragHelpers = [];
        BI.each(this.table.getColumns().header[0], function(idx, header){
            var dragButton = BI.createWidget({
                type: "bi.triangle_drag_button",
                cls: "drag-header",
                width: c.dragButtonWidth,
                height: c.dragButtonHeight,
                lineCount: c.lineCount,
                invisible: true
            });
            BI.createWidget({
                type: "bi.absolute",
                element: header,
                items: [{
                    el: dragButton,
                    top: 0,
                    left: 0
                }]
            })

            dragButton.element.draggable({
                axis: "x",      //拖拽路径
                revert: false,
                cursor: BICst.cursorUrl,
                cursorAt: {left: 5, top: 5},
                containment: self.element,   //约束拖拽区域
                drag: function(e, ui){
                    self._showInsertHelpLine(e, ui);
                },
                stop: function(){
                    BI.each(self.insertLine, function(idx, line){
                        line.setVisible(false);
                    })
                },
                helper: function () {
                    var RowsSize = self.table.getClientRegionRowSize();
                    var columnsSizes = self.table.getCalculateColumnSize();
                    var clone = BI.createWidget({
                        type: "bi.layout",
                        cls: "sortable_table_drag_clone",
                        data: {index: BI.parseInt(idx)},
                        width: columnsSizes[idx],
                        height: RowsSize[0]
                    })
                    clone.element.appendTo(self.element);
                    return clone.element;
                }
            })
            self.dragHelpers.push(dragButton);
        });
    },

    _getMouseInColumnIndex: function(e){
        var dropPosition = this._getColumnsLeftBorderDistance();
        var columnsSizes = this.table.getCalculateColumnSize();
        var tableHeight = this.table.getClientRegionRowSize()[0];
        var tableOffsetLeft = e.pageX - this.table.element.offset().left;
        var tableOffsetTop = this.table.element.offset().top;
        return BI.find(BI.makeArray(dropPosition.length, null), function(idx){
            return !(tableOffsetLeft < dropPosition[idx] || tableOffsetLeft > dropPosition[idx] + columnsSizes[idx]
            || e.pageY < tableOffsetTop || e.pageY >= tableOffsetTop + tableHeight);
        })
    },

    _getColumnsLeftBorderDistance: function(){
        var dropPosition = [];
        var columnSizes = this.table.getCalculateColumnSize();
        BI.each(columnSizes, function(idx, columnSize){
            if(idx === 0){
                dropPosition.push(0)
            }else{
                //+ 1边框偏移值
                dropPosition.push(dropPosition[idx - 1] + columnSizes[idx - 1] + 1)
            }
        });
        return dropPosition;
    },

    _showInsertHelpLine: function(e, ui){
        var absolutePosition =  ui.position.left + this.table.getRightHorizontalScroll() + (e.pageX - ui.helper.offset().left);
        var dropPosition = this._getColumnsLeftBorderDistance();
        var insertIndex = this._getNearIndexFromArray(dropPosition, absolutePosition);
        BI.each(this.insertLine, function(idx, line){
            line.setVisible(insertIndex === idx);
        })
        BI.each(this.dragHelpers, function(idx, helper){
            helper.setVisible(false);
        })
    },

    _exchangeItemsAndHeaderPosition: function (sourceIndex, targetIndex) {
        var o = this.options;
        if(sourceIndex === targetIndex){
            return false;
        }
        var header = BI.unzip(o.header);
        var items = BI.unzip(o.items);
        var sourceHeader = header[sourceIndex];
        var sourceitems = items[sourceIndex];
        header.splice(targetIndex, 0, sourceHeader);
        items.splice(targetIndex, 0, sourceitems);
        var deleteIndex = (sourceIndex < targetIndex) ? sourceIndex : sourceIndex + 1;
        BI.removeAt(header, deleteIndex);
        BI.removeAt(items, deleteIndex);
        o.header = BI.unzip(header);
        o.items = BI.unzip(items);
        return true;
    },

    _getNearIndexFromArray: function (array, v) {
        var self = this;
        var index = 0;
        BI.some(array, function (idx, item) {
            if (idx === array.length - 1) {
                index = idx;
                //如果是最后一列，且鼠标位置超出最后一列的中间位置，表示插入到最后
                var len = self.table.getCalculateRegionColumnSize()[0];
                var columnSizes = self.table.getCalculateColumnSize();
                if(v > len - columnSizes[idx] / 2){
                    index++;
                }
            } else {
                if (v < array[idx + 1]) {
                    var avg = (item + array[idx + 1]) / 2;

                    index = v < avg ? idx : idx + 1;
                    return true;
                }
            }
        })
        return index;
    },

    getColumns: function(){
        return this.table.getColumns();
    },

    setSortable: function(sortable){
        this.options.sortable = sortable;
    },

    populate: function (items, headers) {
        var self = this, o = this.options;
        o.header = headers;
        o.items = items;
        self.table.populate(o.items, o.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.SortableTable.superclass.destroy.apply(this, arguments);
    }
});

BI.SortableTable.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.sortable_table', BI.SortableTable);