/**
 * Created by User on 2017/3/22.
 */
Demo.TableLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-table-layout"
    },

    _createTable1: function () {
        return {
            type: "bi.table",
            items: BI.createItems([
                [
                    {
                        el: {
                            cls: "layout-bg1"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg2"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg3"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg4"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg5"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg6"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg7"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg8"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg1"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg2"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg3"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg4"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg5"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg6"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg7"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg8"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg1"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg2"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg6"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg7"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg8"
                        }
                    }
                ]
            ], {
                type: "bi.layout"
            }),
            columnSize: [100, "fill", 200],
            rowSize: [10, 30, 50, 70, 90, 110, 130],
            hgap: 20,
            vgap: 10
        };
    },

    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 1,
            items: [
                {
                    column: 0,
                    row: 0,
                    el: this._createTable1()
                }
                // , {
                //    column: 0,
                //    row: 1,
                //    el: this._createTable2()
                // }
            ]
        };
    }
});
BI.shortcut("demo.table_layout", Demo.TableLayout);