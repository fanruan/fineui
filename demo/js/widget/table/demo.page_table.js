Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var items = [{
            children: [{
                type: "bi.page_table_cell",
                text: "node1",
                children: [{
                    type: "bi.page_table_cell",
                    text: "childnode1",
                    values: [{type: "bi.page_table_cell", text: 101}, {
                        type: "bi.page_table_cell",
                        text: 102
                    }, {type: "bi.page_table_cell", text: 101}, {
                        type: "bi.page_table_cell",
                        text: 102
                    }, {type: "bi.page_table_cell", text: 101}]
                }, {
                    type: "bi.page_table_cell",
                    text: "childnode2",
                    values: [{type: "bi.page_table_cell", text: 201}, {
                        type: "bi.page_table_cell",
                        text: 202
                    }, {type: "bi.page_table_cell", text: 201}, {
                        type: "bi.page_table_cell",
                        text: 202
                    }, {type: "bi.page_table_cell", text: 201}]
                }],
                values: [{type: "bi.page_table_cell", text: 1001}, {
                    type: "bi.page_table_cell",
                    text: 1002
                }, {type: "bi.page_table_cell", text: 1001}, {
                    type: "bi.page_table_cell",
                    text: 1002
                }, {type: "bi.page_table_cell", text: 1001}]
            }], values: [{type: "bi.page_table_cell", text: 12001}, {
                type: "bi.page_table_cell",
                text: 12002
            }, {type: "bi.page_table_cell", text: 12001}, {
                type: "bi.page_table_cell",
                text: 12002
            }, {type: "bi.page_table_cell", text: 12001}]
        }];

        var header = [{
            type: "bi.page_table_cell",
            text: "header1"
        }, {
            type: "bi.page_table_cell",
            text: "header2"
        }, {
            type: "bi.page_table_cell",
            text: "jine",
            tag: 1
        }, {
            type: "bi.page_table_cell",
            text: "jine",
            tag: 2
        }, {
            type: "bi.page_table_cell",
            text: "jine",
            tag: 3
        }, {
            type: "bi.page_table_cell",
            text: "金额汇总",
            tag: 4
        }, {
            type: "bi.page_table_cell",
            text: "金额汇总2",
            tag: 5
        }];

        var crossHeader = [{
            type: "bi.page_table_cell",
            text: "cross1"
        }, {
            type: "bi.page_table_cell",
            text: "cross2"
        }];

        var crossItems = [{
            children: [{
                type: "bi.page_table_cell",
                text: "node1",
                values: [1, 2, 3]
            }, {
                type: "bi.page_table_cell",
                text: "node3",
                values: [1, 2]
            }]
            //values: [1, 2]
        }];

        var table1 = BI.createWidget({
            type: "bi.page_table",
            el: {
                type: "bi.sequence_table",
                showSequence: true,
                el: {
                    type: "bi.dynamic_summary_tree_table",
                    el: {
                        type: "bi.adaptive_table",
                        el: {
                            type: "bi.resizable_table",
                            el: {
                                type: "bi.collection_table"
                            }
                        }
                    }
                },
                sequence: {
                    type: "bi.sequence_table_dynamic_number"
                }
            },
            summaryCellStyleGetter: function (isLast) {
                return isLast ? {
                    backgroundColor: "#6495ED",
                    color: "#ffffff"
                } : {
                    backgroundColor: "#B0C4DE",
                    color: "#ffffff"
                }
            },
            sequenceCellStyleGetter: function (index) {
                return {
                    backgroundColor: "#87CEEB",
                    color: "#ffffff"
                }
            },
            headerCellStyleGetter: function () {
                return {
                    backgroundColor: "#6495ED",
                    color: "#ffffff"
                }
            },
            pager: {
                horizontal: {
                    pages: false, //总页数
                    curr: 1, //初始化当前页， pages为数字时可用

                    hasPrev: function (page) {
                        return page > 1;
                    },
                    hasNext: function (page) {
                        return page < 3;
                    }
                },
                vertical: {
                    pages: false, //总页数
                    curr: 1, //初始化当前页， pages为数字时可用

                    hasPrev: function (page) {
                        return page > 1;
                    },
                    hasNext: function (page) {
                        return page < 3;
                    }
                }
            },
            itemsCreator: function (op, populate) {
                var vpage = op.vpage || "";
                var hpage = op.hpage || "";
                BI.each(header, function (i, h) {
                    h.text = h.text + "V" + vpage + "H" + hpage;
                });
                populate(items, header, crossItems, crossHeader);
            },
            width: 600,
            height: 400,
            columnSize: [100, 100, 100, 100, 100, 100, 100],
            minColumnSize: [100, 100, 100, 100, 100, 100, 100],
            isNeedMerge: true,
            isNeedFreeze: true,
            mergeCols: [0, 1],
            mergeRule: function (col1, col2) {
                if (col1 === col2) {
                    return true;
                }
                if (col1.tag && col2.tag) {
                    return col1.tag === col2.tag;
                }
                return col1 === col2;
            },
            freezeCols: [0, 1],
            header: header,
            items: items,
            crossHeader: crossHeader,
            crossItems: crossItems
        });
        // table1.populate(items, header, crossItems, crossHeader);
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.grid",
                    columns: 1,
                    rows: 1,
                    items: [[{
                        el: table1
                    }]]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.page_table", Demo.Func);