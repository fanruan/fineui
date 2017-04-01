;(function () {
    function isEmpty(value) {
        // 判断是否为空值
        var result = value === "" || value === null || value === undefined;
        return result;
    }

    // 判断是否是无效的日期
    function isInvalidDate(date) {
        return date == "Invalid Date" || date == "NaN";
    }

    /**
     * 科学计数格式
     */
    function _eFormat(text, fmt) {
        var e = fmt.indexOf("E");
        var eleft = fmt.substr(0, e), eright = fmt.substr(e + 1);
        if (/^[0\.-]+$/.test(text)) {
            text = BI._numberFormat(0.0, eleft) + 'E' + BI._numberFormat(0, eright)
        } else {
            var isNegative = text < 0;
            if (isNegative) {
                text = text.substr(1);
            }
            var elvl = (eleft.split('.')[0] || '').length;
            var point = text.indexOf(".");
            if (point < 0) {
                point = text.length;
            }
            var i = 0; //第一个不为0的数的位置
            text = text.replace('.', '');
            for (var len = text.length; i < len; i++) {
                var ech = text.charAt(i);
                if (ech <= '9' && ech >= '1') {
                    break;
                }
            }
            var right = point - i - elvl;
            var left = text.substr(i, elvl);
            var dis = i + elvl - text.length;
            if (dis > 0) {
                //末位补全0
                for (var k = 0; k < dis; k++) {
                    left += '0';
                }
            } else {
                left += '.' + text.substr(i + elvl);
            }
            left = left.replace(/^[0]+/, '');
            if (right < 0 && eright.indexOf('-') < 0) {
                eright += ';-' + eright;
            }
            text = BI._numberFormat(left, eleft) + 'E' + BI._numberFormat(right, eright);
            if (isNegative) {
                text = '-' + text;
            }
        }
        return text;
    }

    /**
     * 把日期对象按照指定格式转化成字符串
     *
     *      @example
     *      var date = new Date('Thu Dec 12 2013 00:00:00 GMT+0800');
     *      var result = BI.date2Str(date, 'yyyy-MM-dd');//2013-12-12
     *
     * @class BI.date2Str
     * @param date 日期
     * @param format 日期格式
     * @returns {String}
     */
    function date2Str(date, format) {
        if (!date) {
            return '';
        }
        // O(len(format))
        var len = format.length, result = '';
        if (len > 0) {
            var flagch = format.charAt(0), start = 0, str = flagch;
            for (var i = 1; i < len; i++) {
                var ch = format.charAt(i);
                if (flagch !== ch) {
                    result += compileJFmt({
                        'char': flagch,
                        'str': str,
                        'len': i - start
                    }, date);
                    flagch = ch;
                    start = i;
                    str = flagch;
                } else {
                    str += ch;
                }
            }
            result += compileJFmt({
                'char': flagch,
                'str': str,
                'len': len - start
            }, date);
        }
        return result;

        function compileJFmt(jfmt, date) {
            var str = jfmt.str, len = jfmt.len, ch = jfmt['char'];
            switch (ch) {
                case 'E': //星期
                    str = Date._DN[date.getDay()];
                    break;
                case 'y': //年
                    if (len <= 3) {
                        str = (date.getFullYear() + '').slice(2, 4);
                    } else {
                        str = date.getFullYear();
                    }
                    break;
                case 'M': //月
                    if (len > 2) {
                        str = Date._MN[date.getMonth()];
                    } else if (len < 2) {
                        str = date.getMonth() + 1;
                    } else {
                        str = String.leftPad(date.getMonth() + 1 + '', 2, '0');
                    }
                    break;
                case 'd': //日
                    if (len > 1) {
                        str = String.leftPad(date.getDate() + '', 2, '0');
                    } else {
                        str = date.getDate();
                    }
                    break;
                case 'h': //时(12)
                    var hour = date.getHours() % 12;
                    if (hour === 0) {
                        hour = 12;
                    }
                    if (len > 1) {
                        str = String.leftPad(hour + '', 2, '0');
                    } else {
                        str = hour;
                    }
                    break;
                case 'H': //时(24)
                    if (len > 1) {
                        str = String.leftPad(date.getHours() + '', 2, '0');
                    } else {
                        str = date.getHours();
                    }
                    break;
                case 'm':
                    if (len > 1) {
                        str = String.leftPad(date.getMinutes() + '', 2, '0');
                    } else {
                        str = date.getMinutes();
                    }
                    break;
                case 's':
                    if (len > 1) {
                        str = String.leftPad(date.getSeconds() + '', 2, '0');
                    } else {
                        str = date.getSeconds();
                    }
                    break;
                case 'a':
                    str = date.getHours() < 12 ? 'am' : 'pm';
                    break;
                case 'z':
                    str = date.getTimezone();
                    break;
                default:
                    str = jfmt.str;
                    break;
            }
            return str;
        }
    };

    /**
     * 数字格式
     */
    function _numberFormat(text, format) {
        var text = text + '';
        //数字格式，区分正负数
        var numMod = format.indexOf(';');
        if (numMod > -1) {
            if (text >= 0) {
                return _numberFormat(text + "", format.substring(0, numMod));
            } else {
                return _numberFormat((-text) + "", format.substr(numMod + 1));
            }
        }
        var tp = text.split('.'), fp = format.split('.'),
            tleft = tp[0] || '', fleft = fp[0] || '',
            tright = tp[1] || '', fright = fp[1] || '';
        //百分比,千分比的小数点移位处理
        if (/[%‰]$/.test(format)) {
            var paddingZero = /[%]$/.test(format) ? '00' : '000';
            tright += paddingZero;
            tleft += tright.substr(0, paddingZero.length);
            tleft = tleft.replace(/^0+/gi, '');
            tright = tright.substr(paddingZero.length).replace(/0+$/gi, '');
        }
        var right = _dealWithRight(tright, fright);
        if (right.leftPlus) {
            //小数点后有进位
            tleft = parseInt(tleft) + 1 + '';

            tleft = isNaN(tleft) ? '1' : tleft;
        }
        right = right.num;
        var left = _dealWithLeft(tleft, fleft);
        if (!(/[0-9]/.test(left))) {
            left = left + '0';
        }
        if (!(/[0-9]/.test(right))) {
            return left + right;
        } else {
            return left + '.' + right;
        }
    };
    /**
     * 处理小数点右边小数部分
     * @param tright 右边内容
     * @param fright 右边格式
     * @returns {JSON} 返回处理结果和整数部分是否需要进位
     * @private
     */
    function _dealWithRight(tright, fright) {
        var right = '', j = 0, i = 0;
        for (var len = fright.length; i < len; i++) {
            var ch = fright.charAt(i);
            var c = tright.charAt(j);
            switch (ch) {
                case '0':
                    if (isEmpty(c)) {
                        c = '0';
                    }
                    right += c;
                    j++;
                    break;
                case '#':
                    right += c;
                    j++;
                    break;
                default :
                    right += ch;
                    break;
            }
        }
        var rll = tright.substr(j);
        var result = {};
        if (!isEmpty(rll) && rll.charAt(0) > 4) {
            //有多余字符，需要四舍五入
            result.leftPlus = true;
            var numReg = right.match(/^[0-9]+/);
            if (numReg) {
                var num = numReg[0];
                var orilen = num.length;
                var newnum = BI.parseInt(num) + 1 + '';
                //进位到整数部分
                if (newnum.length > orilen) {
                    newnum = newnum.substr(1);
                } else {
                    newnum = BI.leftPad(newnum, orilen, '0');
                    result.leftPlus = false;
                }
                right = right.replace(/^[0-9]+/, newnum);
            }
        }
        result.num = right;
        return result;
    }

    /**
     * 处理小数点左边整数部分
     * @param tleft 左边内容
     * @param fleft 左边格式
     * @returns {string} 返回处理结果
     * @private
     */
    function _dealWithLeft(tleft, fleft) {
        var left = '';
        var j = tleft.length - 1;
        var combo = -1, last = -1;
        var i = fleft.length - 1;
        for (; i >= 0; i--) {
            var ch = fleft.charAt(i);
            var c = tleft.charAt(j);
            switch (ch) {
                case '0':
                    if (isEmpty(c)) {
                        c = '0';
                    }
                    last = -1;
                    left = c + left;
                    j--;
                    break;
                case '#':
                    last = i;
                    left = c + left;
                    j--;
                    break;
                case ',':
                    if (!isEmpty(c)) {
                        //计算一个,分隔区间的长度
                        var com = fleft.match(/,[#0]+/);
                        if (com) {
                            combo = com[0].length - 1;
                        }
                        left = ',' + left;
                    }
                    break;
                default :
                    left = ch + left;
                    break;
            }
        }
        if (last > -1) {
            //处理剩余字符
            var tll = tleft.substr(0, j + 1);
            left = left.substr(0, last) + tll + left.substr(last);
        }
        if (combo > 0) {
            //处理,分隔区间
            var res = left.match(/[0-9]+,/);
            if (res) {
                res = res[0];
                var newstr = '', n = res.length - 1 - combo;
                for (; n >= 0; n = n - combo) {
                    newstr = res.substr(n, combo) + ',' + newstr;
                }
                var lres = res.substr(0, n + combo);
                if (!isEmpty(lres)) {
                    newstr = lres + ',' + newstr;
                }
            }
            left = left.replace(/[0-9]+,/, newstr);
        }
        return left;
    }

    BI.cjkEncode = function (text) {
        // alex:如果非字符串,返回其本身(cjkEncode(234) 返回 ""是不对的)
        if (typeof text !== 'string') {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code >= 128 || code === 91 || code === 93) {//91 is "[", 93 is "]".
                newText += "[" + code.toString(16) + "]";
            } else {
                newText += text.charAt(i);
            }
        }

        return newText
    };

    BI.cjkEncodeDO = function (o) {
        if (BI.isPlainObject(o)) {
            var result = {};
            $.each(o, function (k, v) {
                if (!(typeof v == "string")) {
                    v = BI.jsonEncode(v);
                }
                //wei:bug 43338，如果key是中文，cjkencode后o的长度就加了1，ie9以下版本死循环，所以新建对象result。
                k = BI.cjkEncode(k);
                result[k] = BI.cjkEncode(v);
            });
            return result;
        }
        return o;
    };

    BI.jsonEncode = function (o) {
        //james:这个Encode是抄的EXT的
        var useHasOwn = {}.hasOwnProperty ? true : false;

        // crashes Safari in some instances
        //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

        var m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"': '\\"',
            "\\": '\\\\'
        };

        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    }) + '"';
            }
            return '"' + s + '"';
        };

        var encodeArray = function (o) {
            var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };

        if (typeof o == "undefined" || o === null) {
            return "null";
        } else if (BI.isArray(o)) {
            return encodeArray(o);
        } else if (o instanceof Date) {
            /*
             * alex:原来只是把年月日时分秒简单地拼成一个String,无法decode
             * 现在这么处理就可以decode了,但是JS.jsonDecode和Java.JSONObject也要跟着改一下
             */
            return BI.jsonEncode({
                __time__: o.getTime()
            })
        } else if (typeof o == "string") {
            return encodeString(o);
        } else if (typeof o == "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o == "boolean") {
            return String(o);
        } else if (BI.isFunction(o)) {
            return String(o);
        } else {
            var a = ["{"], b, i, v;
            for (i in o) {
                if (!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(',');
                            }
                            a.push(BI.jsonEncode(i), ":",
                                v === null ? "null" : BI.jsonEncode(v));
                            b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };

    BI.jsonDecode = function (text) {

        try {
            // 注意0啊
            //var jo = $.parseJSON(text) || {};
            var jo = $.parseJSON(text);
            if (jo == null) {
                jo = {};
            }
        } catch (e) {
            /*
             * richie:浏览器只支持标准的JSON字符串转换，而jQuery会默认调用浏览器的window.JSON.parse()函数进行解析
             * 比如：var str = "{'a':'b'}",这种形式的字符串转换为JSON就会抛异常
             */
            try {
                jo = new Function("return " + text)() || {};
            } catch (e) {
                //do nothing
            }
            if (jo == null) {
                jo = [];
            }
        }
        if (!_hasDateInJson(text)) {
            return jo;
        }

        function _hasDateInJson(json) {
            if (!json || typeof json !== "string") {
                return false;
            }
            return json.indexOf("__time__") != -1;
        }

        return (function (o) {
            if (typeof o === "string") {
                return o;
            }
            if (o && o.__time__ != null) {
                return new Date(o.__time__);
            }
            for (var a in o) {
                if (o[a] == o || typeof o[a] == 'object' || $.isFunction(o[a])) {
                    break;
                }
                o[a] = arguments.callee(o[a]);
            }

            return o;
        })(jo);
    }

    BI.contentFormat = function (cv, fmt) {
        if (isEmpty(cv)) {
            //原值为空，返回空字符
            return '';
        }
        var text = cv.toString();
        if (isEmpty(fmt)) {
            //格式为空，返回原字符
            return text;
        }
        if (fmt.match(/^T/)) {
            //T - 文本格式
            return text;
        } else if (fmt.match(/^D/)) {
            //D - 日期(时间)格式
            if (!(cv instanceof Date)) {
                if (typeof cv === 'number') {
                    //毫秒数类型
                    cv = new Date(cv);
                } else {
                    //字符串类型，如yyyyMMdd、MMddyyyy等这样无分隔符的结构
                    cv = Date.parseDate(cv + "", Date.patterns.ISO8601Long);
                }
            }
            if (!BI.isNull(cv)) {
                var needTrim = fmt.match(/^DT/);
                text = BI.date2Str(cv, fmt.substring(needTrim ? 2 : 1));
            }
        } else if (fmt.match(/E/)) {
            //科学计数格式
            text = _eFormat(text, fmt);
        } else {
            //数字格式
            text = _numberFormat(text, fmt);
        }
        //¤ - 货币格式
        text = text.replace(/¤/g, '￥');
        return text;
    };

    BI.leftPad = function (val, size, ch) {
        var result = String(val);
        if (!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result.toString();
    };

    BI.object2Number = function (value) {
        if (value == null) {
            return 0;
        }
        if (typeof value == 'number') {
            return value;
        } else {
            var str = value + "";
            if (str.indexOf(".") === -1) {
                return parseInt(str);
            } else {
                return parseFloat(str);
            }
        }
    };

    BI.object2Date = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        } else if (typeof obj == 'number') {
            return new Date(obj);
        } else {
            var str = obj + "";
            str = str.replace(/-/g, '/');
            var dt = new Date(str);
            if (!isInvalidDate(dt)) {
                return dt;
            }

            return new Date();
        }
    };

    BI.object2Time = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        } else {
            var str = obj + "";
            str = str.replace(/-/g, '/');
            var dt = new Date(str);
            if (!isInvalidDate(dt)) {
                return dt;
            }
            if (str.indexOf('/') === -1 && str.indexOf(':') !== -1) {
                dt = new Date("1970/01/01 " + str);
                if (!isInvalidDate(dt)) {
                    return dt;
                }
            }
            dt = BI.str2Date(str, "HH:mm:ss");
            if (!isInvalidDate(dt)) {
                return dt;
            }
            return new Date();
        }
    };
})();
