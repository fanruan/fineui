Demo.Center = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    beforeCreate: function(){
        console.log("beforeCreate");
    },
    render: function () {
        console.log("render");
    },
    created: function () {
        console.log("created");
    },
    mounted: function () {
        console.log("mounted");
    }
});
$.shortcut("demo.center", Demo.Center);