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
            }]
        }
    }
});
$.shortcut("demo.color_chooser", Demo.Func);