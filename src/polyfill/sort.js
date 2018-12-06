// 修复ie9下sort方法的bug
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