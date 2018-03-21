Demo.Preview = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-preview"
    },
    render: function () {
        var self = this;
        var items = [], header = [], columnSize = [];

        var rowCount = 100, columnCount = 100;
        for (var i = 0; i < 1; i++) {
            header[i] = [];
            for (var j = 0; j < columnCount; j++) {
                header[i][j] = {
                    type: "bi.label",
                    text: "表头" + i + "-" + j
                };
                columnSize[j] = 100;
            }
        }
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: (i < 3 ? 0 : i) + "-" + j
                };
            }
        }
        return {
            type: "bi.absolute",
            cls: "preview-background",
            items: [{
                el: {
                    type: "bi.vtape",
                    cls: "preview-card bi-card",
                    items: [{
                        el: {
                            type: "bi.label",
                            cls: "preview-title bi-border-bottom",
                            height: 40,
                            text: "Card",
                            hgap: 10,
                            textAlign: "left"
                        },
                        height: 40
                    }, {
                        type: "bi.center_adapt",
                        scrollable: true,
                        items: [{
                            type: "bi.resizable_table",
                            el: {
                                type: "bi.collection_table"
                            },
                            width: 500,
                            height: 400,
                            isResizeAdapt: true,
                            isNeedResize: true,
                            isNeedMerge: true,
                            mergeCols: [0, 1],
                            mergeRule: function (col1, col2) {
                                return BI.isEqual(col1, col2);
                            },
                            isNeedFreeze: true,
                            freezeCols: [0, 1],
                            columnSize: columnSize,
                            items: items,
                            header: header
                        }]
                    }]
                },
                left: 60,
                right: 60,
                top: 60,
                bottom: 60
            }]
        };
    },
    mounted: function () {
    }
});
BI.shortcut("demo.preview", Demo.Preview);