/**
 * Created by Dailer on 2017/7/12.
 */
Demo.ExcelTable = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.excel_table",
                columnSize: [200,200,200,200,200],
                items: [
                    [{
                        type: "bi.label",
                        cls: "layout-bg1",
                        text: "第一行第一列"
                    }, {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "第一行第二列"
                    }],
                    [{
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "第二行第一列"
                    }, {
                        type: "bi.label",
                        cls: "layout-bg4",
                        text: "第二行第二列"
                    }]
                ]
            }],
            width:500
        }
    }
})

BI.shortcut("demo.excel_table", Demo.ExcelTable);