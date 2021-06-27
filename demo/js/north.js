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
                            self.fireEvent(Demo.North.EVENT_VALUE_CHANGE, "");
                        }
                    }],
                    cls: "logo",
                    height: 50,
                    text: "FineUI2.0"
                }
            }, {
                el: {
                    type: "bi.right",
                    hgap: 10,
                    items: [{
                        type: "bi.text_button",
                        text: "星空蓝",
                        handler: function () {
                            BI.$("html").removeClass("bi-theme-default").addClass("bi-theme-dark");
                        }
                    }, {
                        type: "bi.text_button",
                        text: "典雅白",
                        handler: function () {
                            BI.$("html").removeClass("bi-theme-dark").addClass("bi-theme-default");
                        }
                    }]
                }
            }]
        };
    }
});
Demo.North.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.shortcut("demo.north", Demo.North);