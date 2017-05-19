if(![].indexOf){
    /**
     * 检查指定的值是否在数组中
     * @param {Object} o 要检查的值
     * @return {Number}  o在数组中的索引（如果不在数组中则返回-1）
     */
    Array.prototype.indexOf = function (o) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (_.isEqual(o, this[i])) {
                return i;
            }
        }
        return -1;
    }
}
if(![].lastIndexOf){
    /**
     * 检查指定的值是否在数组中
     * ie67不支持数组的这个方法
     * @param {Object} o 要检查的值
     * @return {Number}  o在数组中的索引（如果不在数组中则返回-1）
     */
    Array.prototype.lastIndexOf = function (o) {
        for (var len = this.length, i = len - 1; i >= 0; i--) {
            if (_.isEqual(o, this[i])) {
                return i;
            }
        }
        return -1;
    }
}