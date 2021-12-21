// 浏览器相关方法
_.extend(BI, {
    isIE: function () {
        if(!_global.navigator) {
            return false;
        }
        if (this.__isIE == null) {
            this.__isIE = /(msie|trident)/i.test(navigator.userAgent.toLowerCase());
        }
        return this.__isIE;
    },

    getIEVersion: function () {
        if(!_global.navigator) {
            return 0;
        }
        if (this.__IEVersion != null) {
            return this.__IEVersion;
        }
        var version = 0;
        var agent = navigator.userAgent.toLowerCase();
        var v1 = agent.match(/(?:msie\s([\w.]+))/);
        var v2 = agent.match(/(?:trident.*rv:([\w.]+))/);
        if (v1 && v2 && v1[1] && v2[1]) {
            version = Math.max(v1[1] * 1, v2[1] * 1);
        } else if (v1 && v1[1]) {
            version = v1[1] * 1;
        } else if (v2 && v2[1]) {
            version = v2[1] * 1;
        } else {
            version = 0;
        }
        return this.__IEVersion = version;
    },

    isIE9Below: function () {
        if (!BI.isIE()) {
            return false;
        }
        return this.getIEVersion() < 9;
    },

    isEdge: function () {
        if(!_global.navigator) {
            return false;
        }
        return /edg/i.test(navigator.userAgent.toLowerCase());
    },

    isChrome: function () {
        if(!_global.navigator) {
            return false;
        }
        return /chrome/i.test(navigator.userAgent.toLowerCase());
    },

    isFireFox: function () {
        if(!_global.navigator) {
            return false;
        }
        return /firefox/i.test(navigator.userAgent.toLowerCase());
    },

    isOpera: function () {
        if(!_global.navigator) {
            return false;
        }
        return /opera/i.test(navigator.userAgent.toLowerCase());
    },

    isSafari: function () {
        if(!_global.navigator) {
            return false;
        }
        return /safari/i.test(navigator.userAgent.toLowerCase()) && !/chrome/i.test(navigator.userAgent.toLowerCase());
    },

    isKhtml: function () {
        if(!_global.navigator) {
            return false;
        }
        return /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
    },

    isMac: function () {
        if(!_global.navigator) {
            return false;
        }
        return /macintosh|mac os x/i.test(navigator.userAgent);
    },

    isWindows: function () {
        if(!_global.navigator) {
            return false;
        }
        return /windows|win32/i.test(navigator.userAgent);
    },

    isSupportCss3: function (style) {
        if(!_global.document) {
            return false;
        }
        var prefix = ["webkit", "Moz", "ms", "o"],
            i, len,
            humpString = [],
            htmlStyle = document.documentElement.style,
            _toHumb = function (string) {
                if (!BI.isString(string)) {
                    return "";
                }

                return string.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            };

        for ( i = 0; i < prefix.length; i++) {
            humpString.push(_toHumb(prefix[i] + "-" + style));
        }
        humpString.push(_toHumb(style));

        for (i = 0, len = humpString.length; i < len; i++) {
            if (humpString[i] in htmlStyle) {
                return true;
            }
        }
        return false;
    }
});
