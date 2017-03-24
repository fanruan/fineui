Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [];
        var cellCount = 100;
        for (var i = 0; i < cellCount; i++) {
            items[i] = {
                type: "bi.label",
                text: i
            };
        }
        var grid = BI.createWidget({
            type: "bi.collection_view",
            items: items,
            cellSizeAndPositionGetter: function (index) {
                return {
                    x: index % 10 * 50,
                    y: Math.floor(index / 10) * 50,
                    width: 50,
                    height: 50
                }
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: grid,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
$.shortcut("demo.collection_view", Demo.Func);