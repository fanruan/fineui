/**
 * 对数组对象的扩展
 * @class Array
 */
_.extend(BI, {

    pushArray: function (sArray, array) {
        for (var i = 0; i < array.length; i++) {
            sArray.push(array[i]);
        }
    },
    pushDistinct: function (sArray, obj) {
        if (!BI.contains(obj)) {
            sArray.push(obj);
        }
    },
    pushDistinctArray: function (sArray, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            sArray.pushDistinct(array[i]);
        }
    }
});
