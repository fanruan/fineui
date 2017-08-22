if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {

} else {
    Set = function () {
        this.set = {}
    };
    Set.prototype.has = function (key) {
        return this.set[key] !== undefined;
    };
    Set.prototype.add = function (key) {
        this.set[key] = 1
    };
    Set.prototype.clear = function () {
        this.set = {}
    };
}