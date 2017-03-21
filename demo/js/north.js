Demo.North = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-north"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.htape",
            items: [{
                width: 230,
                el: {
                    type: "bi.text_button",
                    listeners: [{
                        eventName: BI.Button.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(Demo.North.EVENT_VALUE_CHANGE, "demo.face")
                        }
                    }],
                    cls: "logo",
                    height: 50,
                    text: "FineUI2.0"
                }
            }, {
                el: {
                    type: "bi.layout"
                }
            }]
        }
    }
});
Demo.North.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
$.shortcut("demo.north", Demo.North);