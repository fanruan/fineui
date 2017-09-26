Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {

        var canvas = BI.createWidget({
            type: "bi.canvas",
            width: 500,
            height: 600
        });
        canvas.rect(0, 0, 80, 100, "#7dbd2f");

        canvas.line(80, 0, 100, 100, 200, 100, 300, 0, {
            strokeStyle: "red",
            lineWidth: 2
        });

        canvas.circle(150, 50, 20, "green");

        //渐变矩形
        canvas.rect(0, 120, 80, 100, canvas.gradient(0, 120, 80, 220, "#FF0000", "#00FF00"));

        //空心图形
        canvas.hollow(100, 120, 100, 220, 200, 120, {
            strokeStyle: "blue"
        });

        //实心图形
        canvas.solid(100, 240, 200, 240, 150, 280, 200, 320, 100, 320, {
            strokeStyle: "yellow",
            fillStyle: "pink"
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
BI.shortcut("demo.canvas", Demo.Func);