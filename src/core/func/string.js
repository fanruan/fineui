/**
 * 对字符串对象的扩展
 * @class String
 */
_.extend(BI, {

    /**
     * 判断字符串是否已指定的字符串开始
     * @param str source字符串
     * @param {String} startTag   指定的开始字符串
     * @return {Boolean}  如果字符串以指定字符串开始则返回true，否则返回false
     */
    startWith: function (str, startTag) {
        str = str || "";
        if (startTag == null || startTag == "" || str.length === 0 || startTag.length > str.length) {
            return false;
        }
        return str.substr(0, startTag.length) == startTag;
    },
    /**
     * 判断字符串是否以指定的字符串结束
     * @param str source字符串
     * @param {String} endTag 指定的字符串
     * @return {Boolean}  如果字符串以指定字符串结束则返回true，否则返回false
     */
    endWith: function (str, endTag) {
        if (endTag == null || endTag == "" || str.length === 0 || endTag.length > str.length) {
            return false;
        }
        return str.substring(str.length - endTag.length) == endTag;
    },

    /**
     * 获取url中指定名字的参数
     * @param str source字符串
     * @param {String} name 参数的名字
     * @return {String} 参数的值
     */
    getQuery: function (str, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = str.substr(str.indexOf("?") + 1).match(reg);
        if (r) {
            return unescape(r[2]);
        }
        return null;
    },

    /**
     * 给url加上给定的参数
     * @param str source字符串
     * @param {Object} paras 参数对象，是一个键值对对象
     * @return {String} 添加了给定参数的url
     */
    appendQuery: function (str, paras) {
        if (!paras) {
            return str;
        }
        var src = str;
        // 没有问号说明还没有参数
        if (src.indexOf("?") === -1) {
            src += "?";
        }
        // 如果以问号结尾，说明没有其他参数
        if (BI.endWith(src, "?") !== false) {
        } else {
            src += "&";
        }
        _.each(paras, function (value, name) {
            if (typeof(name) === "string") {
                src += name + "=" + value + "&";
            }
        });
        src = src.substr(0, src.length - 1);
        return src;
    },
    /**
     * 将所有符合第一个字符串所表示的字符串替换成为第二个字符串
     * @param str source字符串
     * @param {String} s1 要替换的字符串的正则表达式
     * @param {String} s2 替换的结果字符串
     * @returns {String} 替换后的字符串
     */
    replaceAll: function (str, s1, s2) {
        return BI.isString(str) ? str.replace(new RegExp(s1, "gm"), s2) : str;
    },
    /**
     * 总是让字符串以指定的字符开头
     * @param str source字符串
     * @param {String} start 指定的字符
     * @returns {String} 以指定字符开头的字符串
     */
    perfectStart: function (str, start) {
        if (BI.startWith(str, start)) {
            return str;
        }
        return start + str;

    },

    /**
     * 获取字符串中某字符串的所有项位置数组
     * @param str source字符串
     * @param {String} sub 子字符串
     * @return {Number[]} 子字符串在父字符串中出现的所有位置组成的数组
     */
    allIndexOf: function (str, sub) {
        if (typeof sub !== "string") {
            return [];
        }
        var location = [];
        var offset = 0;
        while (str.length > 0) {
            var loc = str.indexOf(sub);
            if (loc === -1) {
                break;
            }
            location.push(offset + loc);
            str = str.substring(loc + sub.length, str.length);
            offset += loc + sub.length;
        }
        return location;
    }
});