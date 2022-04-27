BI.DOM = BI.DOM || {};
BI.extend(BI.DOM, {
    isColor: function (color) {
        return color && (this.isRGBColor(color) || this.isHexColor(color));
    },

    isRGBColor: function (color) {
        if (!color) {
            return false;
        }
        return color.substr(0, 3) === "rgb";
    },

    isHexColor: function (color) {
        if (!color) {
            return false;
        }
        return color[0] === "#" && color.length === 7;
    },

    isDarkColor: function (hex) {
        if (!hex || !this.isHexColor(hex)) {
            return false;
        }
        var rgb = this.rgb2json(this.hex2rgb(hex));
        var grayLevel = Math.round(rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
        if (grayLevel < 192/** 网上给的是140**/) {
            return true;
        }
        return false;
    },

    // 获取对比颜色
    getContrastColor: function (color) {
        if (!color || !this.isColor(color)) {
            return "";
        }
        if (this.isDarkColor(color)) {
            return "#FFFFFF";
        }
        return "#3D4D66";
    },

    rgb2hex: function (rgbColour) {
        if (!rgbColour || rgbColour.substr(0, 3) != "rgb") {
            return "";
        }
        var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
        var red = BI.parseInt(rgbValues[0]);
        var green = BI.parseInt(rgbValues[1]);
        var blue = BI.parseInt(rgbValues[2]);

        var hexColour = "#" + this.int2hex(red) + this.int2hex(green) + this.int2hex(blue);

        return hexColour;
    },

    _hue2rgb: function (m1, m2, h) {
        h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
        if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1) return m2;
        if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
        return m1;
    },

    hsl2rgb: function (hsl) {
        var m1, m2, r, g, b;
        var h = hsl[0], s = hsl[1], l = hsl[2];
        m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
        m1 = l * 2 - m2;
        return [this._hue2rgb(m1, m2, h + 0.33333),
            this._hue2rgb(m1, m2, h),
            this._hue2rgb(m1, m2, h - 0.33333)];
    },

    rgb2hsl: function (rgb) {
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

    rgb2json: function (rgbColour) {
        if (!rgbColour) {
            return {};
        }
        if (!this.isRGBColor(rgbColour)) {
            return {};
        }
        var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
        return {
            r: BI.parseInt(rgbValues[0]),
            g: BI.parseInt(rgbValues[1]),
            b: BI.parseInt(rgbValues[2])
        };
    },

    rgba2json: function (rgbColour) {
        if (!rgbColour) {
            return {};
        }
        var rgbValues = rgbColour.match(/\d+(\.\d+)?/g);
        return {
            r: BI.parseInt(rgbValues[0]),
            g: BI.parseInt(rgbValues[1]),
            b: BI.parseInt(rgbValues[2]),
            a: BI.parseFloat(rgbValues[3])
        };
    },

    json2rgb: function (rgb) {
        if (!BI.isKey(rgb.r) || !BI.isKey(rgb.g) || !BI.isKey(rgb.b)) {
            return "";
        }
        return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    },

    json2rgba: function (rgba) {
        if (!BI.isKey(rgba.r) || !BI.isKey(rgba.g) || !BI.isKey(rgba.b)) {
            return "";
        }
        return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
    },

    int2hex: function (strNum) {
        var hexdig = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

        return hexdig[strNum >>> 4] + "" + hexdig[strNum & 15];
    },

    hex2rgb: function (color) {
        if (!color) {
            return "";
        }
        if (!this.isHexColor(color)) {
            return color;
        }
        var tempValue = "rgb(", colorArray;

        if (color.length === 7) {
            colorArray = [BI.parseInt("0x" + color.substring(1, 3)),
                BI.parseInt("0x" + color.substring(3, 5)),
                BI.parseInt("0x" + color.substring(5, 7))];
        } else if (color.length === 4) {
            colorArray = [BI.parseInt("0x" + color.substring(1, 2)),
                BI.parseInt("0x" + color.substring(2, 3)),
                BI.parseInt("0x" + color.substring(3, 4))];
        }
        tempValue += colorArray[0] + ",";
        tempValue += colorArray[1] + ",";
        tempValue += colorArray[2] + ")";

        return tempValue;
    },

    rgba2rgb: function (rgbColor, bgColor) {
        if (BI.isNull(bgColor)) {
            bgColor = 1;
        }
        if (rgbColor.substr(0, 4) != "rgba") {
            return "";
        }
        var rgbValues = rgbColor.match(/\d+(\.\d+)?/g);
        if (rgbValues.length < 4) {
            return "";
        }
        var R = BI.parseFloat(rgbValues[0]);
        var G = BI.parseFloat(rgbValues[1]);
        var B = BI.parseFloat(rgbValues[2]);
        var A = BI.parseFloat(rgbValues[3]);

        return "rgb(" + Math.floor(255 * (bgColor * (1 - A)) + R * A) + "," +
            Math.floor(255 * (bgColor * (1 - A)) + G * A) + "," +
            Math.floor(255 * (bgColor * (1 - A)) + B * A) + ")";
    }
});
