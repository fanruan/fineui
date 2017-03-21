Demo.Center = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    beforeCreate: function () {
        console.log("beforeCreate");
    },
    render: function () {
        return {
            type: "bi.tab",
            defaultShowIndex: 0,
            cardCreator: function (v) {
                return BI.createWidget({
                    type: "bi.label",
                    text: v
                });
            }
        }
    },
    created: function () {
        console.log("created");
    },
    mounted: function () {
        console.log("mounted");
    }
});
$.shortcut("demo.center", Demo.Center);