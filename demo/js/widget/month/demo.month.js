/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Month = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.month_combo",
                width: 300
            }]

        }
    }
})

BI.shortcut("demo.month", Demo.Month);