/**
 * Created by richie on 15/7/8.
 */
/**
 * 初始化BI对象
 */
var _global;
if (typeof window !== "undefined") {
    _global = window;
} else if (typeof global !== "undefined") {
    _global = global;
} else if (typeof self !== "undefined") {
    _global = self;
} else {
    _global = this;
}
if (_global.BI == null) {
    _global.BI = {prepares: []};
}
if(_global.BI.prepares == null) {
    _global.BI.prepares = [];
}// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        // 1. Let o be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError("\"this\" is null or not defined");
        }

        var o = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of o with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = o.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = fromIndex | 0;

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of o with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of o with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in o && o[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (searchElement /* , fromIndex*/) {
        "use strict";

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var n, k,
            t = Object(this),
            len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }

        n = len - 1;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) {
                n = 0;
            } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }

        for (k = n >= 0
            ? Math.min(n, len - 1)
            : len - Math.abs(n); k >= 0; k--) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}
/**
 * 特殊情况
 * Created by wang on 15/6/23.
 */
// 解决console未定义问题 guy
_global.console = _global.console || (function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
            = c.clear = c.exception = c.trace = c.assert = function () {
        };
    return c;
})();
/*
 * 前端缓存
 */
_global.localStorage || (_global.localStorage = {
    items: {},
    setItem: function (k, v) {
        BI.Cache.addCookie(k, v);
    },
    getItem: function (k) {
        return BI.Cache.getCookie(k);
    },
    removeItem: function (k) {
        BI.Cache.deleteCookie(k);
    },
    key: function () {

    },
    clear: function () {
        this.items = {};
    }
});
if (!Object.keys) {
    Object.keys = function(o) {
        if (o !== Object(o)) {
            throw new TypeError('Object.keys called on a non-object');
        }
        // fix的问题
        var falsy;
        var skipArray = {
            __ob__: falsy,
            $accessors: falsy,
            $vbthis: falsy,
            $vbsetter: falsy
        };
        var k = [], p;
        for (p in o) {
            if (!(p in skipArray)) {
                if (Object.prototype.hasOwnProperty.call(o, p)) {
                    k.push(p);
                }
            }
        }
        return k;
    };
}

if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

/* 统一采用core-js的polyfill，此块暂去
// https://stackoverflow.com/questions/10919915/ie8-getprototypeof-method
if (typeof Object.getPrototypeOf !== "function") {
    Object.getPrototypeOf = "".__proto__ === String.prototype
        ? function (object) {
            return object.__proto__;
        }
        : function (object) {
            // May break if the constructor has been tampered with
            return object.constructor.prototype;
        };
}
 */

if(!Date.now) {
    Date.now = function () {
        return new Date().valueOf();
    };
}if (typeof Set !== "undefined" && Set.toString().match(/native code/)) {

} else {
    Set = function () {
        this.set = {};
    };
    Set.prototype.has = function (key) {
        return this.set[key] !== undefined;
    };
    Set.prototype.add = function (key) {
        this.set[key] = 1;
    };
    Set.prototype.clear = function () {
        this.set = {};
    };
}// 修复ie9下sort方法的bug
// IE的sort 需要显示声明返回-1, 0, 1三种比较结果才可正常工作，而Chrome， Firefox中可以直接返回true, false等
// BI-36544 sort提供的参数就可以自定义返回值，不需要特别控制。这边使用冒泡相较于快排可能慢了点。
// 这边先将webkit的限制去掉
!function (window) {
    var ua = window.navigator.userAgent.toLowerCase(),
        reg = /msie/;
    if (reg.test(ua)) {
        var _sort = Array.prototype.sort;
        Array.prototype.sort = function (fn) {
            if (!!fn && typeof fn === "function") {
                if (this.length < 2) {
                    return this;
                }
                var i = 0, j = i + 1, l = this.length, tmp, r = false, t = 0;
                for (; i < l; i++) {
                    for (j = i + 1; j < l; j++) {
                        t = fn.call(this, this[i], this[j]);
                        r = (typeof t === "number" ? t :
                            t ? 1 : 0) > 0;
                        if (r === true) {
                            tmp = this[i];
                            this[i] = this[j];
                            this[j] = tmp;
                        }
                    }
                }
                return this;
            }
            return _sort.call(this);

        };
    }
}(window);
//# sourceMappingURL=polyfill.js.map