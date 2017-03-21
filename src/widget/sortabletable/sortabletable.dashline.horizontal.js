BI.HorizontalDashLine = BI.inherit(BI.Widget, {


    _defaultConfig: function () {
        return BI.extend(BI.HorizontalDashLine.superclass._defaultConfig.apply(this, arguments), {
            baseCls:"bi-svg-line-horizontal",
            gap:5,
            line:8,
            stroke: "#009de3",
            fill:"white",
            height:3,
            width:200
        })
    },

    _init: function () {
        BI.HorizontalDashLine.superclass._init.apply(this, arguments);
        var o = this.options;
        this.svg = BI.createWidget({
            type:"bi.svg",
            element: this,
            height: o.height,
            width: o.width
        })
        this.setMove()
    },

    setLength : function (w) {
        if(w === this.options.width){
            return;
        }
        BI.HorizontalDashLine.superclass.setWidth.apply(this, arguments);
        var o = this.options;
        this.setMove()
    },


    setMove:function() {
        var o = this.options;
        this.svg.clear();
        this.svg.path(this._createPath(0)).attr({
            stroke: o.stroke,
            fill: o.fill
        })
    },

    _createPath : function (startPos) {
        var o = this.options;
        var path ="";
        for(var j = 0; j < o.height; j++) {
            for(var i = startPos - o.line; i < o.width; i+= o.line) {
                path +="M" + (i + j)+ ","+ j
                path +="L" + (i + j + o.line) + "," + j
                i+= o.gap
            }
        }
        return path;
    }

})
$.shortcut("bi.horizontal_dash_line", BI.HorizontalDashLine);