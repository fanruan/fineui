Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var canvas = BI.createWidget({
            type: "bi.complex_canvas",
            width: 500,
            height: 600
        });
        canvas.branch(55, 100, 10, 10, 100, 10, 200, 10, {
            offset: 20,
            strokeStyle: "red",
            lineWidth: 2
        });

        canvas.branch(220, 155, 120, 110, 150, 200, {
            offset: 40
        });

        canvas.stroke();

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: canvas,
                left: 100,
                top: 50
            }]
        })
    }
});
BI.shortcut("demo.complex_canvas", Demo.Func);