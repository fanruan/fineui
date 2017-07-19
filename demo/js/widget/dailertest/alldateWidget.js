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
                type: "bi.date_picker",
                width: 300
            }, {
                type: "bi.date_trigger",
                width: 300
            }, {
                type: "bi.date_calendar_popup",
                width: 300
            }, {
                type: "bi.date_triangle_trigger",
                width: 300
            }, {
                type: "bi.calendar",
                logic: {
                    dynamic: true
                },
                width: 300
            }]
        }
    }
})

BI.shortcut("demo.all_date_widget", Demo.Date);