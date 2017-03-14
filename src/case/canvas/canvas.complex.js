/**
 * 绘制一些较复杂的canvas
 *
 * Created by GUY on 2015/11/24.
 * @class BI.ComplexCanvas
 * @extends BI.Widget
 */
BI.ComplexCanvas = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ComplexCanvas.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-complex-canvas"
        })
    },


    _init: function () {
        BI.ComplexCanvas.superclass._init.apply(this, arguments);
        var o = this.options;
        this.canvas = BI.createWidget({
            type: "bi.canvas",
            element: this.element,
            width: o.width,
            height: o.height
        });
    },

    //绘制树枝节点
    branch: function (x0, y0, x1, y1, x2, y2) {
        var self = this, args = [].slice.call(arguments);
        if (args.length <= 5) {
            return this.canvas.line.apply(this.canvas, arguments);
        }
        var options;
        if (BI.isOdd(args.length)) {
            options = BI.last(args);
            args = BI.initial(args);
        }
        args = [].slice.call(args, 2);
        var odd = BI.filter(args, function (i) {
            return i % 2 === 0;
        });
        var even = BI.filter(args, function (i) {
            return i % 2 !== 0;
        });
        options || (options = {});
        var offset = options.offset || 20;
        if ((y0 > y1 && y0 > y2) || (y0 < y1 && y0 < y2)) {
            if (y0 > y1 && y0 > y2) {
                var y = Math.max.apply(this, even) + offset;
            } else {
                var y = Math.min.apply(this, even) - offset;
            }
            var minx = Math.min.apply(this, odd);
            var minix = BI.indexOf(odd, minx);
            var maxx = Math.max.apply(this, odd);
            var maxix = BI.indexOf(odd, maxx);
            this.canvas.line(minx, even[minix], minx, y, maxx, y, maxx, even[maxix], options);
            BI.each(odd, function (i, dot) {
                if (i !== maxix && i !== minix) {
                    self.canvas.line(dot, even[i], dot, y, options);
                }
            });
            this.canvas.line(x0, y, x0, y0, options);
            return;
        }
        if ((x0 > x1 && x0 > x2) || (x0 < x1 && x0 < x2)) {
            if (x0 > x1 && x0 > x2) {
                var x = Math.max.apply(this, odd) + offset;
            } else {
                var x = Math.min.apply(this, odd) - offset;
            }
            var miny = Math.min.apply(this, even);
            var miniy = BI.indexOf(even, miny);
            var maxy = Math.max.apply(this, even);
            var maxiy = BI.indexOf(even, maxy);
            this.canvas.line(odd[miniy], miny, x, miny, x, maxy, odd[maxiy], maxy, options);
            BI.each(even, function (i, dot) {
                if (i !== miniy && i !== maxiy) {
                    self.canvas.line(odd[i], dot, x, dot, options);
                }
            });
            this.canvas.line(x, y0, x0, y0, options);
            return;
        }
    },

    stroke: function (callback) {
        this.canvas.stroke(callback);
    }
});

$.shortcut("bi.complex_canvas", BI.ComplexCanvas);