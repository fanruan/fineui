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

        return BI.createWidget({
            type: "bi.vertical",
            vgap: 10,
            items: [{
             el:{
                    type: "bi.date_calendar_popup"
             }
            }]
        })
    }
})

BI.shortcut("demo.date", Demo.Date);