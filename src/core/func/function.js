/**
 * 基本的函数
 * Created by GUY on 2015/6/24.
 */
BI.Func = BI.Func || {};
_.extend(BI.Func, {
    /**
     * 创建唯一的名字
     * @param array
     * @param name
     * @returns {*}
     */
    createDistinctName: function (array, name) {
        var src = name, idx = 1;
        name = name || "";
        while (true) {
            if (BI.every(array, function (i, item) {
                return BI.isKey(item) ? item !== name : item.name !== name;
            })) {
                break;
            }
            name = src + (idx++);
        }
        return name;
    },

    /**
     * 获取字符宽度
     * @param str
     * @return {number}
     */
    getGBWidth: function (str) {
        str = str + "";
        str = str.replace(/[^\x00-\xff]/g, "xx");
        return Math.ceil(str.length / 2);
    },

    /**
     * 获取搜索结果
     * @param items
     * @param keyword
     * @param param  搜索哪个属性
     */
    getSearchResult: function (items, keyword, param) {
        var isArray = BI.isArray(items);
        items = isArray ? BI.flatten(items) : items;
        param || (param = "text");
        if (!BI.isKey(keyword)) {
            return {
                find: items,
                match: isArray ? [] : {}
            };
        }
        var t, text, py;
        keyword = BI.toUpperCase(keyword);
        var matched = isArray ? [] : {}, find = isArray ? [] : {};
        BI.each(items, function (i, item) {
            // 兼容item为null的处理
            if (BI.isNull(item)) {
                return;
            }
            t = BI.stripEL(item);
            text = BI.find([t[param], t.text, t.value, t.name, t], function (index, val) {
                return BI.isNotNull(val);
            });

            if (BI.isNull(text) || BI.isObject(text)) return;

            py = BI.makeFirstPY(text, {
                splitChar: "\u200b"
            });
            text = BI.toUpperCase(text);
            py = BI.toUpperCase(py);
            var pidx;
            if (text.indexOf(keyword) > -1) {
                if (text === keyword) {
                    isArray ? matched.push(item) : (matched[i] = item);
                } else {
                    isArray ? find.push(item) : (find[i] = item);
                }
                // BI-56386 这边两个pid / text.length是为了防止截取的首字符串不是完整的，但光这样做还不够，即时错位了，也不能说明就不符合条件
            } else if (pidx = py.indexOf(keyword), (pidx > -1)) {
                if (text === keyword || keyword.length === text.length) {
                    isArray ? matched.push(item) : (matched[i] = item);
                } else {
                    isArray ? find.push(item) : (find[i] = item);
                }
            }
        });
        return {
            match: matched,
            find: find
        };
    },

    /**
     * 获取按GB2312排序的结果
     * @param items
     * @param key
     * @return {any[]}
     */
    getSortedResult: function (items, key) {
        var getTextOfItem = BI.isFunction(key) ? key :
            function (item, key) {
                if (BI.isNotNull(key)) {
                    return item[key];
                }
                if (BI.isNotNull(item.text)) {
                    return item.text;
                }
                if (BI.isNotNull(item.value)) {
                    return item.value;
                }
                return item;
            };

        return items.sort(function (item1, item2) {
            var str1 = getTextOfItem(item1, key);
            var str2 = getTextOfItem(item2, key);
            if (BI.isNull(str1) && BI.isNull(str2)) {
                return 0;
            }
            if (BI.isNull(str1)) {
                return -1;
            }
            if (BI.isNull(str2)) {
                return 1;
            }
            if (str1 === str2) {
                return 0;
            }
            var len1 = str1.length, len2 = str2.length;
            for (var i = 0; i < len1 && i < len2; i++) {
                var char1 = str1[i];
                var char2 = str2[i];
                if (char1 !== char2) {
                    // 找不到的字符都往后面放
                    return (BI.isNull(BI.CODE_INDEX[char1]) ? BI.MAX : BI.CODE_INDEX[char1]) - (BI.isNull(BI.CODE_INDEX[char2]) ? BI.MAX : BI.CODE_INDEX[char2]);
                }
            }
            return len1 - len2;
        });
    }
});

_.extend(BI, {
    beforeFunc: function (sFunc, func) {
        var __self = sFunc;
        return function () {
            if (func.apply(sFunc, arguments) === false) {
                return false;
            }
            return __self.apply(sFunc, arguments);
        };
    },

    afterFunc: function (sFunc, func) {
        var __self = sFunc;
        return function () {
            var ret = __self.apply(sFunc, arguments);
            if (ret === false) {
                return false;
            }
            func.apply(sFunc, arguments);
            return ret;
        };
    }
});
