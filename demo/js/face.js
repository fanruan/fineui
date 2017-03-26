Demo.Face = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-face"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.svg",
                    ref: function () {
                        self.svg = this;
                    }
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        }
    },
    mounted: function () {
        var circle = this.svg.circle(this.element.width() / 2, this.element.height() / 2, 20);
        circle.animate({fill: "#223fa3", stroke: "#000", "stroke-width": 80, "stroke-opacity": 0.5}, 2000);
    }
});
$.shortcut("demo.face", Demo.Face);