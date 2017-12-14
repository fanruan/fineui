Demo.Face = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-face"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.sequence_table",
                    ref: function () {
                        self.table = this;
                    },
                    isNeedFreeze: null,
                    isNeedMerge: false,
                    summaryCellStyleGetter: function (isLast) {
                        return {
                            background: "rgb(4, 177, 194)",
                            color: "#ffffff",
                            fontWeight: "bold"
                        };
                    },
                    sequenceCellStyleGetter: function (index) {
                        return {
                            background: "rgb(4, 177, 194)",
                            color: "#ffffff",
                            fontWeight: "bold"
                        };
                    },
                    headerCellStyleGetter: function () {
                        return {
                            background: "rgb(4, 177, 194)",
                            color: "#ffffff",
                            fontWeight: "bold"
                        };
                    },
                    el: {
                        type: "bi.adaptive_table",
                        el: {
                            type: "bi.resizable_table",
                            el: {
                                type: "bi.grid_table"
                            }
                        }
                    },
                    sequence: {
                        type: "bi.sequence_table_list_number",
                        pageSize: 100,
                        sequenceHeaderCreator: {
                            type: "bi.normal_sequence_header_cell",
                            styleGetter: function () {
                                return {
                                    background: "rgb(4, 177, 194)",
                                    color: "#ffffff",
                                    fontWeight: "bold"
                                };
                            }
                        }
                    },
                    itemsCreator: function (op, populate) {
                    }
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        };
    },

    mounted: function () {
        var self = this;
        if (BI.isNull(BI.isExpanded)) {
            BI.isExpanded = false;
        } else if (!BI.isExpanded) {
            TABLE_ITEMS = this._expandData(TABLE_ITEMS, 3);
            TABLE_HEADER = this._expandHeadData(TABLE_HEADER, 3);
            BI.isExpanded = true;
        }
        this._resizeHandler = BI.debounce(function () {
            var width = self.element.width(), height = self.element.height();
            if (self.table.getWidth() !== width || self.table.getHeight() !== height) {
                self.table.setWidth(width);
                self.table.setHeight(height);
                self.table.populate();
            }
        }, 0);
        BI.ResizeDetector.addResizeListener(this, function () {
            self._resizeHandler();
        });
        this.table.setWidth(this.element.width());
        this.table.setHeight(this.element.height());
        this.table.attr("columnSize", BI.makeArray(TABLE_HEADER[0].length, ""));
        this.table.attr("minColumnSize", BI.makeArray(TABLE_HEADER[0].length, 60));
        this.table.attr("isNeedFreeze", true);
        this.table.attr("freezeCols", []);
        this.table.attr("showSequence", true);
        this.table.attr("headerRowSize", 15);
        this.table.attr("rowSize", 15);
        this.table.populate(TABLE_ITEMS, TABLE_HEADER);
    },
    
    _expandData: function (items, times) {
        var copy = BI.deepClone(items);
        for (var m = 0; m < times - 1; m++) {
            BI.each(items, function (i, row) {
                copy.push(row);
            });
        }
        
        for (var n = 0; n < copy.length; n++) {
            for (var m = 0; m < times - 1; m++) {
                BI.each(items[n % 100], function (j, item) {
                    copy[n].push(item);
                });
            }
        }
        return copy;
    },

    _expandHeadData: function (items, times) {
        var copy = BI.deepClone(items);
        for (var n = 0; n < copy.length; n++) {
            for (var m = 0; m < times - 1; m++) {
                BI.each(items[n], function (j, item) {
                    copy[n].push(item);
                });
            }
        }
        return copy;
    }
});
BI.shortcut("demo.large_table", Demo.Face);