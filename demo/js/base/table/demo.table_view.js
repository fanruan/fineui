Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [[{
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }], [{
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }], [{
            text: "第三行第一列"
        }, {
            text: "第三行第二列"
        }, {
            text: "第三行第三列"
        }], [{
            text: "第四行第一列"
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


        var items2 = [[{
            text: "第一行第一列"
        }, {
            text: "第一行第二列"
        }, {
            text: "第一行第三列"
        }, {
            text: "第一行第四列"
        }, {
            text: "第一行第五列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第二行第二列"
        }, {
            text: "第二行第三列"
        }, {
            text: "第二行第四列"
        }, {
            text: "第二行第五列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第二行第二列"
        }, {
            text: "第三行第三列"
        }, {
            text: "第三行第四列"
        }, {
            text: "第三行第五列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第四行第二列"
        }, {
            text: "第四行第三列"
        }, {
            text: "第四行第四列"
        }, {
            text: "第四行第五列"
        }]


            , [{
                text: "第五行第一列"
            }, {
                text: "第五行第一列"
            }, {
                text: "第五行第三列"
            }, {
                text: "第五行第四列"
            }, {
                text: "第五行第五列"
            }], [{
                text: "第六行第一列"
            }, {
                text: "第六行第一列"
            }, {
                text: "第六行第三列"
            }, {
                text: "第六行第四列"
            }, {
                text: "第六行第五列"
            }], [{
                text: "第七行第一列"
            }, {
                text: "第七行第二列"
            }, {
                text: "第七行第三列"
            }, {
                text: "第七行第四列"
            }, {
                text: "第七行第五列"
            }], [{
                text: "第八行第一列"
            }, {
                text: "第八行第二列"
            }, {
                text: "第八行第三列"
            }, {
                text: "第八行第四列"
            }, {
                text: "第八行第五列"
            }], [{
                text: "第九行第一列"
            }, {
                text: "第九行第二列"
            }, {
                text: "第九行第三列"
            }, {
                text: "第九行第四列"
            }, {
                text: "第九行第五列"
            }], [{
                text: "第十行第一列"
            }, {
                text: "第十行第二列"
            }, {
                text: "第十行第三列"
            }, {
                text: "第十行第四列"
            }, {
                text: "第十行第五列"
            }], [{
                text: "第十一行第一列"
            }, {
                text: "第十一行第二列"
            }, {
                text: "第十一行第三列"
            }, {
                text: "第十一行第四列"
            }, {
                text: "第十一行第五列"
            }], [{
                text: "第十二行第一列"
            }, {
                text: "第十二行第二列"
            }, {
                text: "第十二行第三列"
            }, {
                text: "第十二行第四列"
            }, {
                text: "第十二行第五列"
            }], [{
                text: "第十三行第一列"
            }, {
                text: "第十三行第二列"
            }, {
                text: "第十三行第三列"
            }, {
                text: "第十三行第四列"
            }, {
                text: "第十三行第五列"
            }], [{
                text: "第十四行第一列"
            }, {
                text: "第十四行第二列"
            }, {
                text: "第十四行第三列"
            }, {
                text: "第十四行第四列"
            }, {
                text: "第十四行第五列"
            }]];

        var header = [[{
            text: "表头1"
        }, {
            text: "表头2"
        }, {
            text: "表头3"
        }]];

        var header2 = [[{
            text: "表头1"
        }, {
            text: "表头2"
        }, {
            text: "表头3"
        }, {
            text: "表头4"
        }, {
            text: "表头5"
        }]];

        var table1 = BI.createWidget({
            type: "bi.table_view",
            isNeedResize: true,
            isNeedMerge: true,
            mergeCols: [0, 1],
            columnSize: [100, 200, 300],
            items: items,
            header: header
        });
        var table2 = BI.createWidget({
            type: "bi.table_view",
            isNeedMerge: true,
            isNeedFreeze: true,
            freezeCols: [0, 1],
            mergeCols: [0, 1],
            columnSize: [100, 200, 300, 400, 500],
            items: items2,
            header: header2
        });
        var table3 = BI.createWidget({
            type: "bi.table_view",
            isNeedMerge: true,
            isNeedFreeze: true,
            freezeCols: [4],
            mergeCols: [0, 1],
            columnSize: [100, 200, 300, 400, 100],
            items: items2,
            header: header2
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.grid",
                    columns: 2,
                    rows: 2,
                    items: [{
                        column: 0,
                        row: 0,
                        el: table1
                    }, {
                        column: 1,
                        row: 0,
                        el: table2
                    }, {
                        column: 0,
                        row: 1,
                        el: table3
                    }, {
                        column: 1,
                        row: 1,
                        el: {
                            type: "bi.vertical",
                            items: [{
                                type: "bi.button",
                                text: "第一个表setColumnSize([300, 200, 100])",
                                handler: function () {
                                    table1.setColumnSize([300, 200, 100]);
                                }
                            }, {
                                type: "bi.button",
                                text: "第二个表setColumnSize([50, 100, 150, 200, 250])",
                                handler: function () {
                                    table2.setColumnSize([50, 100, 150, 200, 250]);
                                }
                            }, {
                                type: "bi.button",
                                text: "第三个表setColumnSize([50, 100, 150, 200, 50])",
                                handler: function () {
                                    table3.setColumnSize([50, 100, 150, 200, 50]);
                                }
                            }],
                            vgap: 10
                        }
                    }]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
$.shortcut("demo.table_view", Demo.Func);