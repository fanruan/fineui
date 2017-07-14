/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Date = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-date"
    },

    _init: function () {
        Demo.Date.superclass._init.apply(this, arguments);
    },

    render: function () {

        return {
            type: "bi.horizontal_auto",
            vgap: 10,
            items: [{
                type: "bi.date_combo",
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                height: 50,
                width: 300
            }]
        }
    }
})

BI.shortcut("demo.date", Demo.Date);