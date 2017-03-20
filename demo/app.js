$(function () {
    var ref;
    var w = BI.createWidget({
        type: "bi.float_center_adapt",
        items: [{
            el: {
                type: "bi.layout",
                cls: 'bg1',
                width: 100,
                height: 100
            },
            left: 0,
            top: 0
        }]
    });
    var Widget = BI.inherit(BI.Widget, {
        props: {
            a: {}
        },
        init: function () {
            console.log("init");
        },
        beforeCreated: function () {
            console.log("beforeCreated");
        },
        render: function () {
            console.log("render");
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
                    type: "bi.collection_table",
                    isNeedMerge: true,
                    mergeCols: [0, 1],
                    mergeRule: function (col1, col2) {
                        return BI.isEqual(col1, col2);
                    }
                },
                width: 600,
                height: 500,
                isResizeAdapt: true,
                isNeedResize: true,
                isNeedMerge: true,
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
        },
        created: function () {
            console.log("created");
        },
        mounted: function () {
            console.log("mounted");
        },
        destroyed: function () {
            console.log("destroyed")
        }
    });
    $.shortcut("t", Widget);
    BI.createWidget({
        type: "t",
        ref: function (_ref) {
            console.log(_ref);
            ref = _ref;
        },
        element: '#wrapper'
    })
    // ref.destroy();
})