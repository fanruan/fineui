/**
 * 对字符串对象的扩展
 * @class String
 */
$.extend(String.prototype, {

    /**
     * 判断字符串是否已指定的字符串开始
     * @param {String} startTag   指定的开始字符串
     * @return {Boolean}  如果字符串以指定字符串开始则返回true，否则返回false
     */
    startWith: function (startTag) {
        if (startTag == null || startTag == "" || this.length === 0 || startTag.length > this.length) {
            return false;
        }
        return this.substr(0, startTag.length) == startTag;
    },
    /**
     * 判断字符串是否以指定的字符串结束
     * @param {String} endTag 指定的字符串
     * @return {Boolean}  如果字符串以指定字符串结束则返回true，否则返回false
     */
    endWith: function (endTag) {
        if (endTag == null || endTag == "" || this.length === 0 || endTag.length > this.length) {
            return false;
        }
        return this.substring(this.length - endTag.length) == endTag;
    },

    /**
     * 获取url中指定名字的参数
     * @param {String} name 参数的名字
     * @return {String} 参数的值
     */
    getQuery: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = this.substr(this.indexOf("?") + 1).match(reg);
        if (r) {
            return unescape(r[2]);
        }
        return null;
    },

    /**
     * 给url加上给定的参数
     * @param {Object} paras 参数对象，是一个键值对对象
     * @return {String} 添加了给定参数的url
     */
    appendQuery: function (paras) {
        if (!paras) {
            return this;
        }
        var src = this;
        // 没有问号说明还没有参数
        if (src.indexOf("?") === -1) {
            src += "?";
        }
        // 如果以问号结尾，说明没有其他参数
        if (src.endWith("?") !== false) {
        } else {
            src += "&";
        }
        $.each(paras, function (name, value) {
            if (typeof(name) === 'string') {
                src += name + "=" + value + "&";
            }
        });
        src = src.substr(0, src.length - 1);
        return src;
    },
    /**
     * 将所有符合第一个字符串所表示的字符串替换成为第二个字符串
     * @param {String} s1 要替换的字符串的正则表达式
     * @param {String} s2 替换的结果字符串
     * @returns {String} 替换后的字符串
     */
    replaceAll: function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    },
    /**
     * 总是让字符串以指定的字符开头
     * @param {String} start 指定的字符
     * @returns {String} 以指定字符开头的字符串
     */
    perfectStart: function (start) {
        if (this.startWith(start)) {
            return this;
        } else {
            return start + this;
        }
    },

    /**
     * 获取字符串中某字符串的所有项位置数组
     * @param {String} sub 子字符串
     * @return {Number[]} 子字符串在父字符串中出现的所有位置组成的数组
     */
    allIndexOf: function (sub) {
        if (typeof sub != 'string') {
            return [];
        }
        var str = this;
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

/**
 * 对字符串对象的扩展
 * @class String
 */
$.extend(String, {

    /**
     * 对字符串中的'和\做编码处理
     * @static
     * @param {String} string 要做编码处理的字符串
     * @return {String} 编码后的字符串
     */
    escape: function (string) {
        return string.replace(/('|\\)/g, "\\$1");
    },

    /**
     * 让字符串通过指定字符做补齐的函数
     *
     *      var s = String.leftPad('123', 5, '0');//s的值为：'00123'
     *
     * @static
     * @param {String} val 原始值
     * @param {Number} size 总共需要的位数
     * @param {String} ch 用于补齐的字符
     * @return {String}  补齐后的字符串
     */
    leftPad: function (val, size, ch) {
        var result = String(val);
        if (!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result.toString();
    },

    /**
     * 对字符串做替换的函数
     *
     *      var cls = 'my-class', text = 'Some text';
     *      var res = String.format('<div class="{0}>{1}</div>"', cls, text);
     *      //res的值为：'<div class="my-class">Some text</div>';
     *
     * @static
     * @param {String} format 要做替换的字符串，替换字符串1，替换字符串2...
     * @return {String} 做了替换后的字符串
     */
    format: function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i];
        });
    }
});