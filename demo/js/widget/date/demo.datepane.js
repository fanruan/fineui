Demo.DatePane = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-datepane"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.vertical",
                vgap: 10,
                items: [{
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "bi.date_pane_widget"
                    }, {
                        type: "bi.date_pane_widget",
                        selectedTime: {
                            year: 2017,
                            month: 12,
                            day: 11
                        },
                        ref: function (_ref) {
                            self.datepane = _ref;
                        },
                        height: 300
                    },
                    {
                        type: "bi.button",
                        text: "getValue",
                        handler: function () {
                            BI.Msg.toast("date" + JSON.stringify(self.datepane.getValue()));
                        }
                    }, {
                        type: "bi.button",
                        text: "setVlaue '2017-12-31'",
                        handler: function () {
                            self.datepane.setValue({
                                year: 2017,
                                month: 11,
                                day: 31
                            })
                        }
                    }
                ],
                width: "50%"
            }]
        }
    }
})

BI.shortcut("demo.date_pane_widget", Demo.DatePane);