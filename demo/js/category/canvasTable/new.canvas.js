/**
 * canvas绘图
 *
 * Created by Shichao on 2017/09/29.
 * @class BI.CanvasNew
 * @extends BI.Widget
 */
BI.CanvasNew = BI.inherit(BI.Widget, {
    
        _defaultConfig: function () {
            return BI.extend(BI.CanvasNew.superclass._defaultConfig.apply(this, arguments), {
                baseCls: "bi-canvas-new"
            })
        },
    
        _init: function () {
            BI.CanvasNew.superclass._init.apply(this, arguments);
            var self = this, o = this.options;
            var canvas = this._createHiDPICanvas(o.width, o.height);
            this.element.append(canvas);
            this.canvas = canvas;
            this._queue = [];
        },
    
        _getContext: function () {
            if (!this.ctx) {
                this.ctx = this.canvas.getContext('2d');
            }
            return this.ctx;
        },
    
        getContext: function () {
            return this._getContext();
        },
    
        _getPixelRatio: function () {
            var ctx = document.createElement("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
                bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
            return dpr / bsr;
        },
    
        getPixelRatio: function () {
            return this._getPixelRatio();
        },
    
        _createHiDPICanvas: function (w, h, ratio) {
            if (!ratio) {
                ratio = this._getPixelRatio();
            }
            this.ratio = ratio;
            var canvas = document.createElement("canvas");
            if (!document.createElement('canvas').getContext) {
                canvas = window.G_vmlCanvasManager.initElement(canvas);
            }
            canvas.width = w * ratio;
            canvas.height = h * ratio;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
            return canvas;
        },
    
        _attr: function (key, value) {
            var self = this;
            if (BI.isNull(key)) {
                return;
            }
            if (BI.isObject(key)) {
                BI.each(key, function (k, v) {
                    self._queue.push({ k: k, v: v });
                });
                return;
            }
            this._queue.push({ k: key, v: value });
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
    
        text: function (x, y, text, fillStyle) {
            this._attr("fillStyle", BI.isNull(fillStyle) ? "rgb(102, 102, 102)" : fillStyle);
            this._attr("fillText", [text, x, y]);
        },
    
        setFontStyle: function (fontStyle) {
            this.fontStyle = fontStyle;
        },
    
        setFontVariant: function (fontVariant) {
            this.fontVariant = fontVariant;
        },
    
        setFontWeight: function (fontWeight) {
            this.fontWeight = fontWeight;
        },
    
        setFontSize: function (fontSize) {
            this.fontSize = fontSize;
        },
    
        setFontFamily: function (fontFamily) {
            this.fontFamily = fontFamily;
        },
    
        setFont: function () {
            var fontStyle = this.fontStyle || "",
                fontVariant = this.fontVariant || "",
                fontWeight = this.fontWeight || "",
                fontSize = this.fontSize || "12px",
                fontFamily = this.fontFamily || "sans-serif",
                font = fontStyle + " " + fontVariant + " " + fontWeight + " " + fontSize + " " + fontFamily;
            this._getContext().font = font;
        },
    
        gradient: function (x0, y0, x1, y1, start, end) {
            var grd = this._getContext().createLinearGradient(x0, y0, x1, y1);
            grd.addColorStop(0, start);
            grd.addColorStop(1, end);
            return grd;
        },
    
        reset: function (x, y) {
            this._getContext().clearRect(x, y, this.canvas.width, this.canvas.height);
        },
    
        remove: function (x, y, width, height) {
            this._getContext().clearRect(x, y, width, height);
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
        },
    
        setWidth: function (width) {
            BI.CanvasNew.superclass.setWidth.apply(this, arguments);
            this.ratio = this._getPixelRatio();
            this.canvas.width = width * this.ratio;
            this.canvas.style.width = width + "px";
            this.canvas.getContext("2d").setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
        },
    
        setHeight: function (height) {
            BI.CanvasNew.superclass.setHeight.apply(this, arguments);
            this.ratio = this._getPixelRatio();
            this.canvas.height = height * this.ratio;
            this.canvas.style.height = height + "px";
            this.canvas.getContext("2d").setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
        },
    
        setBlock: function () {
            this.canvas.style.display = "block";
        },
    
        transform: function (a, b, c, d, e, f) {
            this._attr("transform", [a, b, c, d, e, f]);
        },
    
        translate: function (x, y) {
            this._attr("translate", [x, y]);
        }
    });
    BI.shortcut("bi.canvas_new", BI.CanvasNew);