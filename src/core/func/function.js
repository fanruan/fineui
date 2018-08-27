/**
 * 基本的函数
 * Created by GUY on 2015/6/24.
 */
BI.Func = {};
BI.extend(BI.Func, {
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
                    return item.name !== name;
                })) {
                break;
            }
            name = src + (idx++);
        }
        return name;
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
                find: BI.deepClone(items),
                match: isArray ? [] : {}
            };
        }
        var t, text, py;
        keyword = BI.toUpperCase(keyword);
        var matched = isArray ? [] : {}, find = isArray ? [] : {};
        BI.each(items, function (i, item) {
            item = BI.deepClone(item);
            t = BI.stripEL(item);
            text = BI.find([t[param], t.text, t.value, t.name, t], function (index, val) {
                return BI.isNotNull(val);
            });

            if (BI.isNull(text) || BI.isObject(text)) return;

            py = BI.makeFirstPY(text);
            text = BI.toUpperCase(text);
            py = BI.toUpperCase(py);
            var pidx;
            if (text.indexOf(keyword) > -1) {
                if (text === keyword) {
                    isArray ? matched.push(item) : (matched[i] = item);
                } else {
                    isArray ? find.push(item) : (find[i] = item);
                }
            } else if (pidx = py.indexOf(keyword), (pidx > -1 && Math.floor(pidx / text.length) === Math.floor((pidx + keyword.length - 1) / text.length))) {
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
    }
});
