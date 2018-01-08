/**
 * 对数组对象的扩展
 * @class Array
 */
_.extend(Array.prototype, {
    contains: function (o) {
        return this.indexOf(o) > -1;
    },

    /**
     * 从数组中移除指定的值，如果值不在数组中，则不产生任何效果
     * @param {Object} o 要移除的值
     * @return {Array} 移除制定值后的数组
     */
    remove: function (o) {
        var index = this.indexOf(o);
        if (index !== -1) {
            this.splice(index, 1);
        }
        return this;
    },

    pushArray: function (array) {
        for (var i = 0; i < array.length; i++) {
            this.push(array[i]);
        }
    },
    pushDistinct: function (obj) {
        if (!this.contains(obj)) {
            this.push(obj);
        }
    },
    pushDistinctArray: function (array) {
        for (var i = 0, len = array.length; i < len; i++) {
            this.pushDistinct(array[i]);
        }
    }
});
