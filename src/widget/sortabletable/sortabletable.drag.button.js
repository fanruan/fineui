BI.TriangleDragButton = BI.inherit(BI.Widget, {
    _defaultConfig: function() {
        return BI.extend(BI.TriangleDragButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls:  "bi-triangle-drag-button",
            height : 30,
            width : 30,
            lineCount:6,
            stroke: "#009de3",
            fill:"white",
            drag : null
        })
    },


    _init : function() {
        BI.TriangleDragButton.superclass._init.apply(this, arguments);
        var o = this.options;
        var svg = BI.createWidget({
            type:"bi.svg",
            element: this,
            height: o.height,
            width: o.width
        })
        var path = "";
        var h_step = o.height/ o.lineCount;
        var w_step = o.width/ o.lineCount;
        for(var i = 0; i < o.lineCount; i++){
            path +="M0," +(h_step * (i + 1));
            path +="L" + (w_step * (i + 1)) +",0"
        }
        svg.path(path).attr({
            stroke: o.stroke,
            fill: o.fill
        })
        this.reInitDrag();
    },

    reInitDrag : function () {
        var o = this.options;
        if(BI.isNotNull(o.drag)) {
            this.element.draggable(o.drag)
        }
    }
});

$.shortcut("bi.triangle_drag_button", BI.TriangleDragButton);