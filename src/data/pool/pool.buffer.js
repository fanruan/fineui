/**
 * 缓冲池
 * @type {{Buffer: {}}}
 */

(function () {
    var Buffer = {};
    var MODE = false;// 设置缓存模式为关闭

    BI.BufferPool = {
        put: function (name, cache) {
            if (BI.isNotNull(Buffer[name])) {
                throw new Error("key值：[" + name + "] 已存在!", Buffer);
            }
            Buffer[name] = cache;
        },

        get: function (name) {
            return Buffer[name];
        }
    };
})();
