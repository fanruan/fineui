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
                }
                columnSize[j] = 100;
            }
        }
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: (i < 3 ? 0 : i) + "-" + j
                }
            }
        }
        return {
            type: "bi.center",
            cls: "preview-background",
            hgap: 100,
            vgap: 100,
            items: [{
                type: "bi.vtape",
                cls: "preview-card",
                items: [{
                    el: {
                        type: "bi.label",
                        cls: "preview-title",
                        height: 40,
                        text: "统计组件",
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
            }]
        }
    },
    mounted: function () {
    }
});
BI.shortcut("demo.preview", Demo.Preview);