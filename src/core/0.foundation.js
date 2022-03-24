/**
 * Created by richie on 15/7/8.
 */
/**
 * 初始化BI对象
 */
var _global = undefined;
if (typeof window !== "undefined") {
    _global = window;
} else if (typeof global !== "undefined") {
    _global = global;
} else if (typeof self !== "undefined") {
    _global = self;
} else {
    _global = this;
}

if (_global) {
    _global._global = _global;
}

if (_global.BI == null) {
    _global.BI = {prepares: []};
}
if(_global.BI.prepares == null) {
    _global.BI.prepares = [];
}