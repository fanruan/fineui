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
