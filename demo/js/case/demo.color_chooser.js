Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.color_chooser",
                    width: 30,
                    height: 30
                },
                left: 100,
                top: 250
            }, {
                el: {
                    type: "bi.simple_color_chooser",
                    width: 30,
                    height: 30
                },
                left: 400,
                top: 250
            }, {
                el: {
                    type: "bi.color_chooser",
                    disabled: true,
                    width: 230,
                    height: 30
                },
                left: 100,
                top: 350
            }]
        };
    }
});
BI.shortcut("demo.color_chooser", Demo.Func);