// 修复ie9下sort方法的bug
!function (_global) {
    var ua = _global.navigator.userAgent.toLowerCase(),
        reg = /msie|applewebkit.+safari/;
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
}(_global);