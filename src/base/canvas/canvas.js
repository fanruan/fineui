/**
 * canvas绘图
 *
 * Created by GUY on 2015/11/18.
 * @class BI.Canvas
 * @extends BI.Widget
 */
BI.Canvas = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Canvas.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-canvas"
        })
    },

    _init: function () {
        BI.Canvas.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var canvas = document.createElement("canvas");
        if (!document.createElement('canvas').getContext) {
            canvas = window.G_vmlCanvasManager.initElement(canvas);
        }
        this.element.append(canvas);
        canvas.width = o.width;
        canvas.height = o.height;
        $(canvas).width("100%");
        $(canvas).height("100%");
        this.canvas = canvas;
        this._queue = [];
    },

    _getContext: function () {
        if (!this.ctx) {
            this.ctx = this.canvas.getContext('2d');
        }
        return this.ctx;
    },

    _attr: function (key, value) {
        var self = this;
        if (BI.isNull(key)) {
            return;
        }
        if (BI.isObject(key)) {
            BI.each(key, function (k, v) {
                self._queue.push({k: k, v: v});
            });
            return;
        }
        this._queue.push({k: key, v: value});
    },

    _line: function (x0, y0) {
        var self = this;
        var args = [].slice.call(arguments, 2);
        if (BI.isOdd(args.length)) {
            this._attr(BI.last(args));
            args = BI.initial(args);
        }
        this._attr("moveTo", [x0, y0]);
        var odd = BI.filter(args, function (i) {
            return i % 2 === 0;
        });
        var even = BI.filter(args, function (i) {
            return i % 2 !== 0;
        });
        args = BI.zip(odd, even);
        BI.each(args, function (i, point) {
            self._attr("lineTo", point);
        });
    },

    line: function (x0, y0, x1, y1) {
        this._line.apply(this, arguments);
        this._attr("stroke", []);
    },

    rect: function (x, y, w, h, color) {
        this._attr("fillStyle", color);
        this._attr("fillRect", [x, y, w, h]);
    },

    circle: function (x, y, radius, color) {
        this._attr({
            fillStyle: color,
            beginPath: [],
            arc: [x, y, radius, 0, Math.PI * 2, true],
            closePath: [],
            fill: []
        });
    },

    hollow: function () {
        this._attr("beginPath", []);
        this._line.apply(this, arguments);
        this._attr("closePath", []);
        this._attr("stroke", []);
    },

    solid: function () {
        this.hollow.apply(this, arguments);
        this._attr("fill", []);
    },

    gradient: function (x0, y0, x1, y1, start, end) {
        var grd = this._getContext().createLinearGradient(x0, y0, x1, y1);
        grd.addColorStop(0, start);
        grd.addColorStop(1, end);
        return grd;
    },

    reset: function () {
        this._getContext().clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stroke: function (callback) {
        var self = this;
        BI.nextTick(function () {
            var ctx = self._getContext();
            BI.each(self._queue, function (i, q) {
                if (BI.isFunction(ctx[q.k])) {
                    ctx[q.k].apply(ctx, q.v);
                } else {
                    ctx[q.k] = q.v;
                }
            });
            self._queue = [];
            callback && callback();
        });
    }
});
$.shortcut("bi.canvas", BI.Canvas);