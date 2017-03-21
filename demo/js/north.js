Demo.North = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-north"
    },
    render: function () {
        return {
            type: "bi.htape",
            items: [{
                width: 230,
                el: {
                    type: "bi.label",
                    cls: "logo",
                    height: 50,
                    text: "FineUI"
                }
            }, {
                el: {
                    type: "bi.layout"
                }
            }]
        }
    }
});
$.shortcut("demo.north", Demo.North);