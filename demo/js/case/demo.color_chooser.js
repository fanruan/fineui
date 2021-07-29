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
                    recommendColorsGetter: function () {
                        return ["#ffffff", "#9d775f", "#dd4b4b", "#ef8b07", "#fcc800"]
                    },
                    width: 24,
                    height: 24
                },
                left: 100,
                top: 250
            }, {
                el: {
                    type: "bi.simple_color_chooser",
                    width: 30,
                    height: 24
                },
                left: 400,
                top: 250
            }, {
                el: {
                    type: "bi.color_chooser",
                    width: 230,
                    height: 24
                },
                left: 100,
                top: 350
            }]
        };
    }
});
BI.shortcut("demo.color_chooser", Demo.Func);