Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var svg = BI.createWidget({
            type: "bi.svg",
            width: 500,
            height: 600
        });

        var circle = svg.circle(100, 100, 10);
        circle.animate({fill: "#223fa3", stroke: "#000", "stroke-width": 80, "stroke-opacity": 0.5}, 2000);

        var el = svg.rect(10, 200, 300, 200);
        el.transform("t100,100r45t-100,0");

        svg.path("M10,10L50,50M50,10L10,50")
            .attr({stroke: "red"});

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: svg,
                left: 100,
                top: 50
            }]
        })
    }
});
BI.shortcut("demo.svg", Demo.Func);