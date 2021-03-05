BI.Farbtastic = BI.inherit(BI.BasicButton, {

    constants: {
        RADIUS: 84,
        SQUARE: 100,
        WIDTH: 194
    },

    props: {
        baseCls: "bi-farbtastic",
        width: 195,
        height: 195,
        stopPropagation: true,
        value: "#000000"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "",
                    ref: function (_ref) {
                        self.colorWrapper = _ref;
                    }
                },
                top: 47,
                left: 47,
                width: 101,
                height: 101
            }, {
                el: {
                    type: "bi.layout",
                    cls: "wheel",
                    ref: function (_ref) {
                        self.wheel = _ref;
                    }
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: {
                    type: "bi.layout",
                    cls: "overlay",
                    ref: function (_ref) {
                        self.overlay = _ref;
                    }
                },
                top: 47,
                left: 47,
                width: 101,
                height: 101
            }, {
                el: {
                    type: "bi.layout",
                    cls: "marker",
                    ref: function (_ref) {
                        self.hMarker = _ref;
                    },
                    scrollable: false,
                    width: 17,
                    height: 17
                }
            }, {
                el: {
                    type: "bi.layout",
                    cls: "marker",
                    ref: function (_ref) {
                        self.slMarker = _ref;
                    },
                    scrollable: false,
                    width: 17,
                    height: 17
                }
            }]
        };
    },

    created: function () {
        var o = this.options;
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    _unpack: function (color) {
        if (color.length === 7) {
            return [parseInt("0x" + color.substring(1, 3)) / 255,
                parseInt("0x" + color.substring(3, 5)) / 255,
                parseInt("0x" + color.substring(5, 7)) / 255];
        } else if (color.length === 4) {
            return [parseInt("0x" + color.substring(1, 2)) / 15,
                parseInt("0x" + color.substring(2, 3)) / 15,
                parseInt("0x" + color.substring(3, 4)) / 15];
        }
    },

    _pack: function (rgb) {
        var r = Math.round(rgb[0] * 255);
        var g = Math.round(rgb[1] * 255);
        var b = Math.round(rgb[2] * 255);
        return "#" + (r < 16 ? "0" : "") + r.toString(16) +
            (g < 16 ? "0" : "") + g.toString(16) +
            (b < 16 ? "0" : "") + b.toString(16);
    },

    _setColor: function (color) {
        var unpack = this._unpack(color);
        if (this.value !== color && unpack) {
            this.value = color;
            this.rgb = unpack;
            this.hsl = this._RGBToHSL(this.rgb);
            this._updateDisplay();
        }
    },

    _setHSL: function (hsl) {
        this.hsl = hsl;
        this.rgb = this._HSLToRGB(hsl);
        this.value = this._pack(this.rgb);
        this._updateDisplay();
        return this;
    },

    _HSLToRGB: function (hsl) {
        var m1, m2, r, g, b;
        var h = hsl[0], s = hsl[1], l = hsl[2];
        m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
        m1 = l * 2 - m2;
        return [this._hueToRGB(m1, m2, h + 0.33333),
            this._hueToRGB(m1, m2, h),
            this._hueToRGB(m1, m2, h - 0.33333)];
    },

    _hueToRGB: function (m1, m2, h) {
        h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
        if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1) return m2;
        if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
        return m1;
    },

    _RGBToHSL: function (rgb) {
        var min, max, delta, h, s, l;
        var r = rgb[0], g = rgb[1], b = rgb[2];
        min = Math.min(r, Math.min(g, b));
        max = Math.max(r, Math.max(g, b));
        delta = max - min;
        l = (min + max) / 2;
        s = 0;
        if (l > 0 && l < 1) {
            s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
        }
        h = 0;
        if (delta > 0) {
            if (max == r && max != g) h += (g - b) / delta;
            if (max == g && max != b) h += (2 + (b - r) / delta);
            if (max == b && max != r) h += (4 + (r - g) / delta);
            h /= 6;
        }
        return [h, s, l];
    },

    _updateDisplay: function () {
        var angle = this.hsl[0] * 6.28;
        this.hMarker.element.css({
            left: Math.round(Math.sin(angle) * this.constants.RADIUS + this.constants.WIDTH / 2) + "px",
            top: Math.round(-Math.cos(angle) * this.constants.RADIUS + this.constants.WIDTH / 2) + "px"
        });

        this.slMarker.element.css({
            left: Math.round(this.constants.SQUARE * (.5 - this.hsl[1]) + this.constants.WIDTH / 2) + "px",
            top: Math.round(this.constants.SQUARE * (.5 - this.hsl[2]) + this.constants.WIDTH / 2) + "px"
        });

        // Saturation/Luminance gradient
        this.colorWrapper.element.css("backgroundColor", this._pack(this._HSLToRGB([this.hsl[0], 1, 0.5])));
    },

    _absolutePosition: function (el) {
        var r = {x: el.offsetLeft, y: el.offsetTop};
        // Resolve relative to offsetParent
        if (el.offsetParent) {
            var tmp = this._absolutePosition(el.offsetParent);
            r.x += tmp.x;
            r.y += tmp.y;
        }
        return r;
    },

    _widgetCoords: function (event) {
        var x, y;
        var el = event.target || event.srcElement;
        var reference = this.wheel.element[0];

        if (typeof event.offsetX !== "undefined") {
            // Use offset coordinates and find common offsetParent
            var pos = {x: event.offsetX, y: event.offsetY};

            // Send the coordinates upwards through the offsetParent chain.
            var e = el;
            while (e) {
                e.mouseX = pos.x;
                e.mouseY = pos.y;
                pos.x += e.offsetLeft;
                pos.y += e.offsetTop;
                e = e.offsetParent;
            }

            // Look for the coordinates starting from the wheel widget.
            var e = reference;
            var offset = {x: 0, y: 0};
            while (e) {
                if (typeof e.mouseX !== "undefined") {
                    x = e.mouseX - offset.x;
                    y = e.mouseY - offset.y;
                    break;
                }
                offset.x += e.offsetLeft;
                offset.y += e.offsetTop;
                e = e.offsetParent;
            }

            // Reset stored coordinates
            e = el;
            while (e) {
                e.mouseX = undefined;
                e.mouseY = undefined;
                e = e.offsetParent;
            }
        } else {
            // Use absolute coordinates
            var pos = this._absolutePosition(reference);
            x = (event.pageX || 0) - pos.x;
            y = (event.pageY || 0) - pos.y;
        }
        // Subtract distance to middle
        return {x: x - this.constants.WIDTH / 2, y: y - this.constants.WIDTH / 2};
    },

    _doMouseMove: function (event) {
        var pos = this._widgetCoords(event);

        // Set new HSL parameters
        if (this.circleDrag) {
            var hue = Math.atan2(pos.x, -pos.y) / 6.28;
            if (hue < 0) hue += 1;
            this._setHSL([hue, this.hsl[1], this.hsl[2]]);
        } else {
            var sat = Math.max(0, Math.min(1, -(pos.x / this.constants.SQUARE) + .5));
            var lum = Math.max(0, Math.min(1, -(pos.y / this.constants.SQUARE) + .5));
            this._setHSL([this.hsl[0], sat, lum]);
        }
        this.fireEvent(BI.Farbtastic.EVENT_CHANGE, this.getValue(), this);
    },

    doClick: function (event) {
        var pos = this._widgetCoords(event);
        this.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > this.constants.SQUARE;

        // Process
        this._doMouseMove(event);
        return false;
    },

    setValue: function (color) {
        this._setColor(color);
    },

    getValue: function () {
        return this.value;
    }
});
BI.Farbtastic.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.farbtastic", BI.Farbtastic);
