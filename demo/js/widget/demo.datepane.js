


Demo.DatePane = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-datepane"
    },
    render: function () {

        var datepane = BI.createWidget({
            type: "bi.date_pane_widget",
            selectedTime: {
                year: 2017,
                month: 12,
                day: 11
            }
        })

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.vertical",
                vgap: 10,
                items: [
                    {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "bi.date_pane_widget"
                    }, {
                        el: datepane
                    },
                    {
                        type:"bi.button",
                        text:"getValue",
                        handler:function(){
                            BI.Msg.toast("date"+JSON.stringify(datepane.getValue()));
                        }
                    }
                ],
                width: "50%"
            }]
        }
    }
})

BI.shortcut("demo.date_pane", Demo.DatePane);