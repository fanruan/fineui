Demo = {
    version: 1.0
};$(function () {
    var ref;
    BI.createWidget({
        type: "demo.main",
        ref: function (_ref) {
            console.log(_ref);
            ref = _ref;
        },
        element: '#wrapper'
    });
    // ref.destroy();
});Demo.Center = BI.inherit(BI.Widget, {
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
$.shortcut("demo.center", Demo.Center);Demo.Main = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-main"
    },
    render: function () {
        return {
            type: "bi.border",
            items: {
                north: {
                    height: 50,
                    el: {
                        type: "demo.north"
                    }
                },
                west: {
                    width: 230,
                    el: {
                        type: "demo.west"
                    }
                },
                center: {
                    el: {
                        type: "demo.center",
                    }
                }
            }
        }
    }
});
$.shortcut("demo.main", Demo.Main);Demo.North = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-north"
    },
    render: function () {

    }
});
$.shortcut("demo.north", Demo.North);Demo.West = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-west"
    },
    render: function () {

    }
});
$.shortcut("demo.west", Demo.West);