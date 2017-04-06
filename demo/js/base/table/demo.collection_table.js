Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
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

        var table = BI.createWidget({
            type: "bi.resizable_table",
            el: {
                type: "bi.collection_table"
            },
            width: 600,
            height: 500,
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
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: table,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.collection_table", Demo.Func);