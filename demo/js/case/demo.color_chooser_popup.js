Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.color_chooser_popup",
                    cls: "bi-card"
                },
                left: 100,
                top: 250
            }, {
                el: {
                    type: "bi.simple_color_chooser_popup",
                    cls: "bi-card"
                },
                left: 400,
                top: 250
            }]
        };
    }
});
BI.shortcut("demo.color_chooser_popup", Demo.Func);