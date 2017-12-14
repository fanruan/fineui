Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var items = [[{
            text: "第一行第一列"
        }, {
            text: "第一行第二列"
        }, {
            text: "第一行第三列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第二行第二列"
        }, {
            text: "第二行第三列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第三行第二列"
        }, {
            text: "第三行第三列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第四行第二列"
        }, {
            text: "第四行第三列"
        }], [{
            text: "第五行第一列"
        }, {
            text: "第五行第二列"
        }, {
            text: "第五行第三列"
        }], [{
            text: "第六行第一列"
        }, {
            text: "第六行第二列"
        }, {
            text: "第六行第三列"
        }], [{
            text: "第七行第一列"
        }, {
            text: "第七行第二列"
        }, {
            text: "第七行第三列"
        }], [{
            text: "第八行第一列"
        }, {
            text: "第八行第二列"
        }, {
            text: "第八行第三列"
        }], [{
            text: "第九行第一列"
        }, {
            text: "第九行第二列"
        }, {
            text: "第九行第三列"
        }], [{
            text: "第十行第一列"
        }, {
            text: "第十行第二列"
        }, {
            text: "第十行第三列"
        }], [{
            text: "第十一行第一列"
        }, {
            text: "第十一行第二列"
        }, {
            text: "第十一行第三列"
        }], [{
            text: "第十二行第一列"
        }, {
            text: "第十二行第二列"
        }, {
            text: "第十二行第三列"
        }], [{
            text: "第十三行第一列"
        }, {
            text: "第十三行第二列"
        }, {
            text: "第十三行第三列"
        }], [{
            text: "第十四行第一列"
        }, {
            text: "第十四行第二列"
        }, {
            text: "第十四行第三列"
        }], [{
            text: "第十五行第一列"
        }, {
            text: "第十五行第二列"
        }, {
            text: "第十五行第三列"
        }], [{
            text: "第十六行第一列"
        }, {
            text: "第十六行第二列"
        }, {
            text: "第十六行第三列"
        }], [{
            text: "第十七行第一列"
        }, {
            text: "第十七行第二列"
        }, {
            text: "第十七行第三列"
        }], [{
            text: "第十八行第一列"
        }, {
            text: "第十八行第二列"
        }, {
            text: "第十八行第三列"
        }]];

        var header = [[{
            text: "表头1"
        }, {
            text: "表头2"
        }, {
            text: "表头3"
        }]];

        var table1 = BI.createWidget({
            type: "bi.preview_table",
            columnSize: ["", "", ""],
            header: header,
            items: items
        });
        var table2 = BI.createWidget({
            type: "bi.preview_table",
            header: header,
            columnSize: [100, "", 50],
            items: items
        });
        var table3 = BI.createWidget({
            type: "bi.preview_table",
            header: header,
            columnSize: [0.2, 0.4, 0.4],
            headerRowSize: 30,
            items: items
        });
        var table4 = BI.createWidget({
            type: "bi.preview_table",
            header: header,
            isNeedFreeze: true,
            freezeCols: [0, 1],
            columnSize: [0.2, "", 0.4],
            items: items
        });
        var table5 = BI.createWidget({
            type: "bi.preview_table",
            header: header,
            isNeedFreeze: true,
            freezeCols: [0, 1],
            columnSize: [200, 100, ""],
            items: items
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.grid",
                    columns: 3,
                    rows: 2,
                    items: [[{
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table1,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table2,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table3,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }], [{
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table4,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table5,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }]]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        });
    }
});
BI.shortcut("demo.preview_table", Demo.Func);