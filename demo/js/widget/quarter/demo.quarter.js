/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Quarter = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.quarter_combo",
                width: 300
            }]

        }
    }
})

BI.shortcut("demo.quarter", Demo.Quarter);