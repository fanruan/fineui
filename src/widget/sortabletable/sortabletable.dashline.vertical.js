BI.VerticalDashLine = BI.inherit(BI.Widget, {


    _defaultConfig: function () {
        return BI.extend(BI.VerticalDashLine.superclass._defaultConfig.apply(this, arguments), {
            baseCls:"bi-svg-line-vertical",
            gap:5,
            line:8,
            stroke: "#009de3",
            fill:"white",
            height:200,
            width:3
        })
    },

    _init: function () {
        BI.VerticalDashLine.superclass._init.apply(this, arguments);
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
        if(w === this.options.height){
            return;
        }
        BI.VerticalDashLine.superclass.setHeight.apply(this, arguments);
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
        for(var j = 0; j < o.width; j++) {
            for(var i = startPos - o.line; i < o.height; i+= o.line) {
                path +="M"+ j + "," + (i + j)
                path +="L" + j + "," + (i + j + o.line)
                i+= o.gap
            }
        }
        return path;
    }

})
$.shortcut("bi.vertical_dash_line", BI.VerticalDashLine);