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
        }
    },

    mounted: function () {
        var self = this;
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
        this.table.attr("columnSize", BI.makeArray(26, ""));
        this.table.attr("minColumnSize", BI.makeArray(26, 80));
        this.table.attr("isNeedFreeze", true);
        this.table.attr("freezeCols", []);
        this.table.attr("showSequence", true);
        this.table.attr("headerRowSize", 25);
        this.table.attr("rowSize", 25);
        this.table.populate(TABLE_ITEMS, TABLE_HEADER);
    }
});
BI.shortcut("demo.large_table", Demo.Face);