(function () {
    var _global;
    if (typeof window !== "undefined") {
        _global = window;
    } else if (typeof global !== "undefined") {
        _global = global;
    } else if (typeof self !== "undefined") {
        _global = self;
    } else {
        _global = this;
    }
    if (!_global.BI) {
        _global.BI = {};
    }

    function isEmpty (value) {
        // 判断是否为空值
        var result = value === "" || value === null || value === undefined;
        return result;
    }

    // 判断是否是无效的日期
    function isInvalidDate (date) {
        return date == "Invalid Date" || date == "NaN";
    }

    /**
     * CHART-1400
     * 使用数值计算的方式来获取任意数值的科学技术表示值。
     * 科学计数格式
     */
    function _eFormat (text, fmt) {
        text = +text;

        return eFormat(text, fmt);

        /**
         * 科学计数格式具体计算过程
         * @param num
         * @param format {String}有两种形式，
         *      1、"0.00E00"这样的字符串表示正常的科学计数表示，只不过规定了数值精确到百分位，
         *         而数量级的绝对值如果是10以下的时候在前面补零。
         *      2、 "##0.0E0"这样的字符串则规定用科学计数法表示之后的数值的整数部分是三位，精确到十分位，
         *         数量级没有规定，因为没见过实数里有用科学计数法表示之后E的后面会小于一位的情况（0无所谓）。
         * @returns {*}
         */
        function eFormat (num, format) {
            var neg = num < 0 ? (num *= -1, "-") : "",
                magnitudeNeg = "";

            var funcName = num > 0 && num < 1 ? "floor" : "ceil";  // -0.9999->-1
            // 数量级
            var magnitude = Math[funcName](Math.log(num) / Math.log(10));

            if (!isFinite(magnitude)) {
                return format.replace(/#/ig, "").replace(/\.e/ig, "E");
            }

            num = num / Math.pow(10, magnitude);

            // 让num转化成[1, 10)区间上的数
            if (num > 0 && num < 1) {
                num *= 10;
                magnitude -= 1;
            }

            // 计算出format中需要显示的整数部分的位数，然后更新这个数值，也更新数量级
            var integerLen = getInteger(magnitude, format);
            integerLen > 1 && (magnitude -= integerLen - 1, num *= Math.pow(10, integerLen - 1));

            magnitude < 0 && (magnitudeNeg = "-", magnitude *= -1);

            // 获取科学计数法精确到的位数
            var precision = getPrecision(format);
            // 判断num经过四舍五入之后是否有进位
            var isValueCarry = isValueCarried(num);

            num *= Math.pow(10, precision);
            num = Math.round(num);
            // 如果出现进位的情况，将num除以10
            isValueCarry && (num /= 10, magnitude += magnitudeNeg === "-" ? -1 : 1);
            num /= Math.pow(10, precision);

            // 小数部分保留precision位
            num = num.toFixed(precision);
            // 格式化指数的部分
            magnitude = formatExponential(format, magnitude, magnitudeNeg);

            return neg + num + "E" + magnitude;
        }

        // 获取format格式规定的数量级的形式
        function formatExponential (format, num, magnitudeNeg) {
            num += "";
            if (!/e/ig.test(format)) {
                return num;
            }
            format = format.split(/e/ig)[1];

            while (num.length < format.length) {
                num = "0" + num;
            }

            // 如果magnitudeNeg是一个"-"，而且num正好全是0，那么就别显示负号了
            var isAllZero = true;
            for (var i = 0, len = num.length; i < len; i++) {
                if (!isAllZero) {
                    continue;
                }
                isAllZero = num.charAt(i) === "0";
            }
            magnitudeNeg = isAllZero ? "" : magnitudeNeg;

            return magnitudeNeg + num;
        }

        // 获取format规定的科学计数法精确到的位数
        function getPrecision (format) {
            if (!/e/ig.test(format)) {
                return 0;
            }
            var arr = format.split(/e/ig)[0].split(".");

            return arr.length > 1 ? arr[1].length : 0;
        }

        // 获取数值科学计数法表示之后整数的位数
        // 这边我们还需要考虑#和0的问题
        function getInteger (magnitude, format) {
            if (!/e/ig.test(format)) {
                return 0;
            }
            // return format.split(/e/ig)[0].split(".")[0].length;

            var formatLeft = format.split(/e/ig)[0].split(".")[0], i, f, len = formatLeft.length;
            var valueLeftLen = 0;

            for (i = 0; i < len; i++) {
                f = formatLeft.charAt(i);
                // "#"所在的位置到末尾长度小于等于值的整数部分长度，那么这个#才可以占位
                if (f == 0 || (f == "#" && (len - i <= magnitude + 1))) {
                    valueLeftLen++;
                }
            }

            return valueLeftLen;
        }

        // 判断num通过round函数之后是否有进位
        function isValueCarried (num) {
            var roundNum = Math.round(num);
            num = (num + "").split(".")[0];
            roundNum = (roundNum + "").split(".")[0];
            return num.length !== roundNum.length;
        }
    }

    //'#.##'之类的格式处理 1.324e-18 这种的科学数字
    function _dealNumberPrecision (text, fright) {
        if (/[eE]/.test(text)) {
            var precision = 0, i = 0, ch;

            if (/[%‰]$/.test(fright)) {
                precision = /[%]$/.test(fright) ? 2 : 3;
            }

            for (var len = fright.length; i < len; i++) {
                if ((ch = fright.charAt(i)) == "0" || ch == "#") {
                    precision++;
                }
            }
            return Number(text).toFixed(precision);
        }

        return text;
    }

    /**
     * 数字格式
     */
    function _numberFormat (text, format) {
        var text = text + "";

        //在调用数字格式的时候如果text里没有任何数字则不处理
        if (!(/[0-9]/.test(text)) || !format) {
            return text;
        }

        // 数字格式，区分正负数
        var numMod = format.indexOf(";");
        if (numMod > -1) {
            if (text >= 0) {
                return _numberFormat(text + "", format.substring(0, numMod));
            }
            return _numberFormat((-text) + "", format.substr(numMod + 1));

        } else {
            // 兼容格式处理负数的情况(copy:fr-jquery.format.js)
            if (+text < 0 && format.charAt(0) !== "-") {
                return _numberFormat((-text) + "", "-" + format);
            }
        }

        var fp = format.split("."), fleft = fp[0] || "", fright = fp[1] || "";
        text = _dealNumberPrecision(text, fright);
        var tp = text.split("."), tleft = tp[0] || "", tright = tp[1] || "";

        // 百分比,千分比的小数点移位处理
        if (/[%‰]$/.test(format)) {
            var paddingZero = /[%]$/.test(format) ? "00" : "000";
            tright += paddingZero;
            tleft += tright.substr(0, paddingZero.length);
            tleft = tleft.replace(/^0+/gi, "");
            tright = tright.substr(paddingZero.length).replace(/0+$/gi, "");
        }
        var right = _dealWithRight(tright, fright);
        if (right.leftPlus) {
            // 小数点后有进位
            tleft = parseInt(tleft) + 1 + "";

            tleft = isNaN(tleft) ? "1" : tleft;
        }
        right = right.num;
        var left = _dealWithLeft(tleft, fleft);
        if (!(/[0-9]/.test(left))) {
            left = left + "0";
        }
        if (!(/[0-9]/.test(right))) {
            return left + right;
        } else {
            return left + "." + right;
        }
    }

    /**
     * 处理小数点右边小数部分
     * @param tright 右边内容
     * @param fright 右边格式
     * @returns {JSON} 返回处理结果和整数部分是否需要进位
     * @private
     */
    function _dealWithRight (tright, fright) {
        var right = "", j = 0, i = 0;
        for (var len = fright.length; i < len; i++) {
            var ch = fright.charAt(i);
            var c = tright.charAt(j);
            switch (ch) {
                case "0":
                    if (isEmpty(c)) {
                        c = "0";
                    }
                    right += c;
                    j++;
                    break;
                case "#":
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
            // 有多余字符，需要四舍五入
            result.leftPlus = true;
            var numReg = right.match(/^[0-9]+/);
            if (numReg) {
                var num = numReg[0];
                var orilen = num.length;
                var newnum = parseInt(num) + 1 + "";
                // 进位到整数部分
                if (newnum.length > orilen) {
                    newnum = newnum.substr(1);
                } else {
                    newnum = BI.leftPad(newnum, orilen, "0");
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
    function _dealWithLeft (tleft, fleft) {
        var left = "";
        var j = tleft.length - 1;
        var combo = -1, last = -1;
        var i = fleft.length - 1;
        for (; i >= 0; i--) {
            var ch = fleft.charAt(i);
            var c = tleft.charAt(j);
            switch (ch) {
                case "0":
                    if (isEmpty(c)) {
                        c = "0";
                    }
                    last = -1;
                    left = c + left;
                    j--;
                    break;
                case "#":
                    last = i;
                    left = c + left;
                    j--;
                    break;
                case ",":
                    if (!isEmpty(c)) {
                        // 计算一个,分隔区间的长度
                        var com = fleft.match(/,[#0]+/);
                        if (com) {
                            combo = com[0].length - 1;
                        }
                        left = "," + left;
                    }
                    break;
                default :
                    left = ch + left;
                    break;
            }
        }
        if (last > -1) {
            // 处理剩余字符
            var tll = tleft.substr(0, j + 1);
            left = left.substr(0, last) + tll + left.substr(last);
        }
        if (combo > 0) {
            // 处理,分隔区间
            var res = left.match(/[0-9]+,/);
            if (res) {
                res = res[0];
                var newstr = "", n = res.length - 1 - combo;
                for (; n >= 0; n = n - combo) {
                    newstr = res.substr(n, combo) + "," + newstr;
                }
                var lres = res.substr(0, n + combo);
                if (!isEmpty(lres)) {
                    newstr = lres + "," + newstr;
                }
            }
            left = left.replace(/[0-9]+,/, newstr);
        }
        return left;
    }


    BI.cjkEncode = function (text) {
        // alex:如果非字符串,返回其本身(cjkEncode(234) 返回 ""是不对的)
        if (typeof text !== "string") {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code >= 128 || code === 91 || code === 93) {// 91 is "[", 93 is "]".
                newText += "[" + code.toString(16) + "]";
            } else {
                newText += text.charAt(i);
            }
        }

        return newText;
    };

    /**
     * 将cjkEncode处理过的字符串转化为原始字符串
     *
     * @static
     * @param text 需要做解码的字符串
     * @return {String} 解码后的字符串
     */
    BI.cjkDecode = function (text) {
        if (text == null) {
            return "";
        }
        // 查找没有 "[", 直接返回.  kunsnat:数字的时候, 不支持indexOf方法, 也是直接返回.
        if (!isNaN(text) || text.indexOf("[") == -1) {
            return text;
        }

        var newText = "";
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (ch == "[") {
                var rightIdx = text.indexOf("]", i + 1);
                if (rightIdx > i + 1) {
                    var subText = text.substring(i + 1, rightIdx);
                    // james：主要是考虑[CDATA[]]这样的值的出现
                    if (subText.length > 0) {
                        ch = String.fromCharCode(eval("0x" + subText));
                    }

                    i = rightIdx;
                }
            }

            newText += ch;
        }

        return newText;
    };

    // replace the html special tags
    var SPECIAL_TAGS = {
        "&": "&amp;",
        "\"": "&quot;",
        "<": "&lt;",
        ">": "&gt;",
        "\x20": "&nbsp;",
        "\n": "&#10;"
    };
    BI.htmlEncode = function (text) {
        return BI.isNull(text) ? "" : BI.replaceAll(text + "", BI.keys(SPECIAL_TAGS).join("|"), function (v) {
            return SPECIAL_TAGS[v] ? SPECIAL_TAGS[v] : v;
        });
    };
    // html decode
    BI.htmlDecode = function (text) {
        return BI.isNull(text) ? "" : BI.replaceAll(text + "", BI.values(SPECIAL_TAGS).join("|"), function (v) {
            switch (v) {
                case "&amp;":
                    return "&";
                case "&quot;":
                    return "\"";
                case "&lt;":
                    return "<";
                case "&gt;":
                    return ">";
                case "&nbsp;":
                    return " ";
                case "&#10;":
                    return "\n";
                default:
                    return v;
            }
        });
    };

    BI.cjkEncodeDO = function (o) {
        if (BI.isPlainObject(o)) {
            var result = {};
            _.each(o, function (v, k) {
                if (!(typeof v === "string")) {
                    v = BI.jsonEncode(v);
                }
                // wei:bug 43338，如果key是中文，cjkencode后o的长度就加了1，ie9以下版本死循环，所以新建对象result。
                k = BI.cjkEncode(k);
                result[k] = BI.cjkEncode(v);
            });
            return result;
        }
        return o;
    };

    BI.jsonEncode = function (o) {
        // james:这个Encode是抄的EXT的
        var useHasOwn = !!{}.hasOwnProperty;

        // crashes Safari in some instances
        // var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

        var m = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };

        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return "\"" + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                    var c = m[b];
                    if (c) {
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + "\"";
            }
            return "\"" + s + "\"";
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
                            a.push(",");
                        }
                        a.push(v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };

        if (typeof o === "undefined" || o === null) {
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
            });
        } else if (typeof o === "string") {
            return encodeString(o);
        } else if (typeof o === "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o === "boolean") {
            return String(o);
        } else if (BI.isFunction(o)) {
            return String(o);
        }
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
                            a.push(",");
                        }
                        a.push(BI.jsonEncode(i), ":",
                            v === null ? "null" : BI.jsonEncode(v));
                        b = true;
                }
            }
        }
        a.push("}");
        return a.join("");

    };

    BI.jsonDecode = function (text) {

        try {
            // 注意0啊
            // var jo = $.parseJSON(text) || {};
            var jo = BI.$ ? BI.$.parseJSON(text) : _global.JSON.parse(text);
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
                // do nothing
            }
            if (jo == null) {
                jo = [];
            }
        }
        if (!_hasDateInJson(text)) {
            return jo;
        }

        function _hasDateInJson (json) {
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
                if (o[a] == o || typeof o[a] === "object" || _.isFunction(o[a])) {
                    break;
                }
                o[a] = arguments.callee(o[a]);
            }

            return o;
        })(jo);
    };

    /**
     * 获取编码后的url
     * @param urlTemplate url模板
     * @param param 参数
     * @returns {*|String}
     * @example
     * BI.getEncodeURL("design/{tableName}/{fieldName}",{tableName: "A", fieldName: "a"}) //  design/A/a
     */
    BI.getEncodeURL = function (urlTemplate, param) {
        return BI.replaceAll(urlTemplate, "\\{(.*?)\\}", function (ori, str) {
            return BI.encodeURIComponent(BI.isObject(param) ? param[str] : param);
        });
    };

    BI.encodeURIComponent = function (url) {
        BI.specialCharsMap = BI.specialCharsMap || {};
        url = url || "";
        url = BI.replaceAll(url + "", BI.keys(BI.specialCharsMap || []).join("|"), function (str) {
            switch (str) {
                case "\\":
                    return BI.specialCharsMap["\\\\"] || str;
                default:
                    return BI.specialCharsMap[str] || str;
            }
        });
        return _global.encodeURIComponent(url);
    };

    BI.decodeURIComponent = function (url) {
        var reserveSpecialCharsMap = {};
        BI.each(BI.specialCharsMap, function (initialChar, encodeChar) {
            reserveSpecialCharsMap[encodeChar] = initialChar === "\\\\" ? "\\" : initialChar;
        });
        url = url || "";
        url = BI.replaceAll(url + "", BI.keys(reserveSpecialCharsMap || []).join("|"), function (str) {
            return reserveSpecialCharsMap[str] || str;
        });
        return _global.decodeURIComponent(url);
    };

    BI.contentFormat = function (cv, fmt) {
        if (isEmpty(cv)) {
            // 原值为空，返回空字符
            return "";
        }
        var text = cv.toString();
        if (isEmpty(fmt)) {
            // 格式为空，返回原字符
            return text;
        }
        if (fmt.match(/^T/)) {
            // T - 文本格式
            return text;
        } else if (fmt.match(/^D/)) {
            // D - 日期(时间)格式
            if (!(cv instanceof Date)) {
                if (typeof cv === "number") {
                    // 毫秒数类型
                    cv = new Date(cv);
                } else {
                    //字符串类型转化为date类型
                    cv = new Date(Date.parse(("" + cv).replace(/-|\./g, "/")));
                }
            }
            if (!isInvalidDate(cv) && !BI.isNull(cv)) {
                var needTrim = fmt.match(/^DT/);
                text = BI.date2Str(cv, fmt.substring(needTrim ? 2 : 1));
            }
        } else if (fmt.match(/E/)) {
            // 科学计数格式
            text = _eFormat(text, fmt);
        } else {
            // 数字格式
            text = _numberFormat(text, fmt);
        }
        // ¤ - 货币格式
        text = text.replace(/¤/g, "￥");
        return text;
    };

    /**
     * 将Java提供的日期格式字符串装换为JS识别的日期格式字符串
     * @class FR.parseFmt
     * @param fmt 日期格式
     * @returns {String}
     */
    BI.parseFmt = function (fmt) {
        if (!fmt) {
            return "";
        }
        //日期
        fmt = String(fmt)
        //年
            .replace(/y{4,}/g, "%Y")//yyyy的时候替换为Y
            .replace(/y{2}/g, "%y")//yy的时候替换为y
            //月
            .replace(/M{4,}/g, "%b")//MMMM的时候替换为b，八
            .replace(/M{3}/g, "%B")//MMM的时候替换为M，八月
            .replace(/M{2}/g, "%X")//MM的时候替换为X，08
            .replace(/M{1}/g, "%x")//M的时候替换为x，8
            .replace(/a{1}/g, "%p");
        //天
        if (new RegExp("d{2,}", "g").test(fmt)) {
            fmt = fmt.replace(/d{2,}/g, "%d");//dd的时候替换为d
        } else {
            fmt = fmt.replace(/d{1}/g, "%e");//d的时候替换为j
        }
        //时
        if (new RegExp("h{2,}", "g").test(fmt)) {//12小时制
            fmt = fmt.replace(/h{2,}/g, "%I");
        } else {
            fmt = fmt.replace(/h{1}/g, "%I");
        }
        if (new RegExp("H{2,}", "g").test(fmt)) {//24小时制
            fmt = fmt.replace(/H{2,}/g, "%H");
        } else {
            fmt = fmt.replace(/H{1}/g, "%H");
        }
        fmt = fmt.replace(/m{2,}/g, "%M")//分
        //秒
            .replace(/s{2,}/g, "%S");

        return fmt;
    };

    /**
     * 把字符串按照对应的格式转化成日期对象
     *
     *      @example
     *      var result = BI.str2Date('2013-12-12', 'yyyy-MM-dd');//Thu Dec 12 2013 00:00:00 GMT+0800
     *
     * @class BI.str2Date
     * @param str 字符串
     * @param format 日期格式
     * @returns {*}
     */
    BI.str2Date = function (str, format) {
        if (typeof str != "string" || typeof format != "string") {
            return null;
        }
        var fmt = BI.parseFmt(format);
        return BI.parseDateTime(str, fmt);
    };

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
    BI.date2Str = function (date, format) {
        if (!date) {
            return "";
        }
        // O(len(format))
        var len = format.length, result = "";
        if (len > 0) {
            var flagch = format.charAt(0), start = 0, str = flagch;
            for (var i = 1; i < len; i++) {
                var ch = format.charAt(i);
                if (flagch !== ch) {
                    result += compileJFmt({
                        char: flagch,
                        str: str,
                        len: i - start
                    }, date);
                    flagch = ch;
                    start = i;
                    str = flagch;
                } else {
                    str += ch;
                }
            }
            result += compileJFmt({
                char: flagch,
                str: str,
                len: len - start
            }, date);
        }
        return result;

        function compileJFmt (jfmt, date) {
            var str = jfmt.str, len = jfmt.len, ch = jfmt["char"];
            switch (ch) {
                case "E": // 星期
                    str = BI.Date._DN[date.getDay()];
                    break;
                case "y": // 年
                    if (len <= 3) {
                        str = (date.getFullYear() + "").slice(2, 4);
                    } else {
                        str = date.getFullYear();
                    }
                    break;
                case "M": // 月
                    if (len > 2) {
                        str = BI.Date._MN[date.getMonth()];
                    } else if (len < 2) {
                        str = date.getMonth() + 1;
                    } else {
                        str = BI.leftPad(date.getMonth() + 1 + "", 2, "0");
                    }
                    break;
                case "d": // 日
                    if (len > 1) {
                        str = BI.leftPad(date.getDate() + "", 2, "0");
                    } else {
                        str = date.getDate();
                    }
                    break;
                case "h": // 时(12)
                    var hour = date.getHours() % 12;
                    if (hour === 0) {
                        hour = 12;
                    }
                    if (len > 1) {
                        str = BI.leftPad(hour + "", 2, "0");
                    } else {
                        str = hour;
                    }
                    break;
                case "H": // 时(24)
                    if (len > 1) {
                        str = BI.leftPad(date.getHours() + "", 2, "0");
                    } else {
                        str = date.getHours();
                    }
                    break;
                case "m":
                    if (len > 1) {
                        str = BI.leftPad(date.getMinutes() + "", 2, "0");
                    } else {
                        str = date.getMinutes();
                    }
                    break;
                case "s":
                    if (len > 1) {
                        str = BI.leftPad(date.getSeconds() + "", 2, "0");
                    } else {
                        str = date.getSeconds();
                    }
                    break;
                case "a":
                    str = date.getHours() < 12 ? "am" : "pm";
                    break;
                case "z":
                    str = BI.getTimezone(date);
                    break;
                default:
                    str = jfmt.str;
                    break;
            }
            return str;
        }
    };

    BI.object2Number = function (value) {
        if (value == null) {
            return 0;
        }
        if (typeof value === "number") {
            return value;
        }
        var str = value + "";
        if (str.indexOf(".") === -1) {
            return parseInt(str);
        }
        return parseFloat(str);
    };

    BI.object2Date = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        } else if (typeof obj === "number") {
            return new Date(obj);
        }
        var str = obj + "";
        str = str.replace(/-/g, "/");
        var dt = new Date(str);
        if (!isInvalidDate(dt)) {
            return dt;
        }

        return new Date();

    };

    BI.object2Time = function (obj) {
        if (obj == null) {
            return new Date();
        }
        if (obj instanceof Date) {
            return obj;
        }
        var str = obj + "";
        str = str.replace(/-/g, "/");
        var dt = new Date(str);
        if (!isInvalidDate(dt)) {
            return dt;
        }
        if (str.indexOf("/") === -1 && str.indexOf(":") !== -1) {
            dt = new Date("1970/01/01 " + str);
            if (!isInvalidDate(dt)) {
                return dt;
            }
        }
        dt = BI.parseDateTime(str, "HH:mm:ss");
        if (!isInvalidDate(dt)) {
            return dt;
        }
        return new Date();

    };
})();
