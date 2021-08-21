/*! time: 2021-8-21 9:00:30 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1279);
/******/ })
/************************************************************************/
/******/ ({

/***/ 100:
/***/ (function(module, exports) {

/**
 * 事件集合
 * @class BI.Events
 */
_.extend(BI, {
    Events: {

        /**
         * @static
         * @property keydown事件
         */
        KEYDOWN: "_KEYDOWN",

        /**
         * @static
         * @property 回撤事件
         */
        BACKSPACE: "_BACKSPACE",

        /**
         * @static
         * @property 空格事件
         */
        SPACE: "_SPACE",

        /**
         * @static
         * @property 回车事件
         */
        ENTER: "_ENTER",

        /**
         * @static
         * @property 确定事件
         */
        CONFIRM: "_CONFIRM",

        /**
         * @static
         * @property 错误事件
         */
        ERROR: "_ERROR",

        /**
         * @static
         * @property 暂停事件
         */
        PAUSE: "_PAUSE",

        /**
         * @static
         * @property destroy事件
         */
        DESTROY: "_DESTROY",

        /**
         * @static
         * @property 挂载事件
         */
        MOUNT: "_MOUNT",

        /**
         * @static
         * @property 取消挂载事件
         */
        UNMOUNT: "_UNMOUNT",

        /**
         * @static
         * @property 清除选择
         */
        CLEAR: "_CLEAR",

        /**
         * @static
         * @property 添加数据
         */
        ADD: "_ADD",

        /**
         * @static
         * @property 正在编辑状态事件
         */
        EDITING: "_EDITING",

        /**
         * @static
         * @property 空状态事件
         */
        EMPTY: "_EMPTY",

        /**
         * @static
         * @property 显示隐藏事件
         */
        VIEW: "_VIEW",

        /**
         * @static
         * @property 窗体改变大小
         */
        RESIZE: "_RESIZE",

        /**
         * @static
         * @property 编辑前事件
         */
        BEFOREEDIT: "_BEFOREEDIT",

        /**
         * @static
         * @property 编辑后事件
         */
        AFTEREDIT: "_AFTEREDIT",

        /**
         * @static
         * @property 开始编辑事件
         */
        STARTEDIT: "_STARTEDIT",

        /**
         * @static
         * @property 停止编辑事件
         */
        STOPEDIT: "_STOPEDIT",

        /**
         * @static
         * @property 值改变事件
         */
        CHANGE: "_CHANGE",

        /**
         * @static
         * @property 下拉弹出菜单事件
         */
        EXPAND: "_EXPAND",

        /**
         * @static
         * @property 关闭下拉菜单事件
         */
        COLLAPSE: "_COLLAPSE",

        /**
         * @static
         * @property 回调事件
         */
        CALLBACK: "_CALLBACK",

        /**
         * @static
         * @property 点击事件
         */
        CLICK: "_CLICK",

        /**
         * @static
         * @property 状态改变事件，一般是用在复选按钮和单选按钮
         */
        STATECHANGE: "_STATECHANGE",

        /**
         * @static
         * @property 状态改变前事件
         */
        BEFORESTATECHANGE: "_BEFORESTATECHANGE",


        /**
         * @static
         * @property 初始化事件
         */
        INIT: "_INIT",

        /**
         * @static
         * @property 初始化后事件
         */
        AFTERINIT: "_AFTERINIT",

        /**
         * @static
         * @property 滚动条滚动事件
         */
        SCROLL: "_SCROLL",


        /**
         * @static
         * @property 开始加载事件
         */
        STARTLOAD: "_STARTLOAD",

        /**
         * @static
         * @property 加载后事件
         */
        AFTERLOAD: "_AFTERLOAD",


        /**
         * @static
         * @property 提交前事件
         */
        BS: "beforesubmit",

        /**
         * @static
         * @property 提交后事件
         */
        AS: "aftersubmit",

        /**
         * @static
         * @property 提交完成事件
         */
        SC: "submitcomplete",

        /**
         * @static
         * @property 提交失败事件
         */
        SF: "submitfailure",

        /**
         * @static
         * @property 提交成功事件
         */
        SS: "submitsuccess",

        /**
         * @static
         * @property 校验提交前事件
         */
        BVW: "beforeverifywrite",

        /**
         * @static
         * @property 校验提交后事件
         */
        AVW: "afterverifywrite",

        /**
         * @static
         * @property 校验后事件
         */
        AV: "afterverify",

        /**
         * @static
         * @property 填报前事件
         */
        BW: "beforewrite",

        /**
         * @static
         * @property 填报后事件
         */
        AW: "afterwrite",

        /**
         * @static
         * @property 填报成功事件
         */
        WS: "writesuccess",

        /**
         * @static
         * @property 填报失败事件
         */
        WF: "writefailure",

        /**
         * @static
         * @property 添加行前事件
         */
        BA: "beforeappend",

        /**
         * @static
         * @property 添加行后事件
         */
        AA: "afterappend",

        /**
         * @static
         * @property 删除行前事件
         */
        BD: "beforedelete",

        /**
         * @static
         * @property 删除行后事件
         */
        AD: "beforedelete",

        /**
         * @static
         * @property 未提交离开事件
         */
        UC: "unloadcheck",


        /**
         * @static
         * @property PDF导出前事件
         */
        BTOPDF: "beforetopdf",

        /**
         * @static
         * @property PDF导出后事件
         */
        ATOPDF: "aftertopdf",

        /**
         * @static
         * @property Excel导出前事件
         */
        BTOEXCEL: "beforetoexcel",

        /**
         * @static
         * @property Excel导出后事件
         */
        ATOEXCEL: "aftertoexcel",

        /**
         * @static
         * @property Word导出前事件
         */
        BTOWORD: "beforetoword",

        /**
         * @static
         * @property Word导出后事件
         */
        ATOWORD: "aftertoword",

        /**
         * @static
         * @property 图片导出前事件
         */
        BTOIMAGE: "beforetoimage",

        /**
         * @static
         * @property 图片导出后事件
         */
        ATOIMAGE: "aftertoimage",

        /**
         * @static
         * @property HTML导出前事件
         */
        BTOHTML: "beforetohtml",

        /**
         * @static
         * @property HTML导出后事件
         */
        ATOHTML: "aftertohtml",

        /**
         * @static
         * @property Excel导入前事件
         */
        BIMEXCEL: "beforeimportexcel",

        /**
         * @static
         * @property Excel导出后事件
         */
        AIMEXCEL: "afterimportexcel",

        /**
         * @static
         * @property PDF打印前事件
         */
        BPDFPRINT: "beforepdfprint",

        /**
         * @static
         * @property PDF打印后事件
         */
        APDFPRINT: "afterpdfprint",

        /**
         * @static
         * @property Flash打印前事件
         */
        BFLASHPRINT: "beforeflashprint",

        /**
         * @static
         * @property Flash打印后事件
         */
        AFLASHPRINT: "afterflashprint",

        /**
         * @static
         * @property Applet打印前事件
         */
        BAPPLETPRINT: "beforeappletprint",

        /**
         * @static
         * @property Applet打印后事件
         */
        AAPPLETPRINT: "afterappletprint",

        /**
         * @static
         * @property 服务器打印前事件
         */
        BSEVERPRINT: "beforeserverprint",

        /**
         * @static
         * @property 服务器打印后事件
         */
        ASERVERPRINT: "afterserverprint",

        /**
         * @static
         * @property 邮件发送前事件
         */
        BEMAIL: "beforeemail",

        /**
         * @static
         * @property 邮件发送后事件
         */
        AEMAIL: "afteremail"
    }
});

/***/ }),

/***/ 101:
/***/ (function(module, exports) {

/**
 * 常量
 */

_.extend(BI, {
    MAX: 0xfffffffffffffff,
    MIN: -0xfffffffffffffff,
    EVENT_RESPONSE_TIME: 200,
    zIndex_layer: 1e5,
    zIndex_popover: 1e6,
    zIndex_popup: 1e7,
    zIndex_masker: 1e8,
    zIndex_tip: 1e9,
    emptyStr: "",
    pixUnit: "px",
    pixRatio: 1,
    emptyFn: function () {
    },
    empty: null,
    Key: {
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/"
    },
    KeyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    },
    Status: {
        SUCCESS: 1,
        WRONG: 2,
        START: 3,
        END: 4,
        WAITING: 5,
        READY: 6,
        RUNNING: 7,
        OUTOFBOUNDS: 8,
        NULL: -1
    },
    Direction: {
        Top: "top",
        Bottom: "bottom",
        Left: "left",
        Right: "right",
        Custom: "custom"
    },
    Axis: {
        Vertical: "vertical",
        Horizontal: "horizontal"
    },
    Selection: {
        Default: -2,
        None: -1,
        Single: 0,
        Multi: 1,
        All: 2
    },
    HorizontalAlign: {
        Left: "left",
        Right: "right",
        Center: "center",
        Stretch: "stretch"
    },
    VerticalAlign: {
        Middle: "middle",
        Top: "top",
        Bottom: "bottom",
        Stretch: "stretch"
    },
    StartOfWeek: 1,
    BlankSplitChar: "\u200b \u200b",
});


/***/ }),

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function () {
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
        " ": "&nbsp;"
    };
    BI.htmlEncode = function (text) {
        return BI.isNull(text) ? "" : BI.replaceAll(text + "", "&|\"|<|>|\\s", function (v) {
            return SPECIAL_TAGS[v] ? SPECIAL_TAGS[v] : "&nbsp;";
        });
    };
    // html decode
    BI.htmlDecode = function (text) {
        return BI.isNull(text) ? "" : BI.replaceAll(text + "", "&amp;|&quot;|&lt;|&gt;|&nbsp;", function (v) {
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
                default:
                    return " ";
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(14)))

/***/ }),

/***/ 103:
/***/ (function(module, exports) {

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
        if (!BI.contains(sArray, obj)) {
            sArray.push(obj);
        }
    },
    pushDistinctArray: function (sArray, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            BI.pushDistinct(sArray, array[i]);
        }
    }
});


/***/ }),

/***/ 104:
/***/ (function(module, exports) {

/** Constants used for time computations */
BI.Date = BI.Date || {};
BI.Date.SECOND = 1000;
BI.Date.MINUTE = 60 * BI.Date.SECOND;
BI.Date.HOUR = 60 * BI.Date.MINUTE;
BI.Date.DAY = 24 * BI.Date.HOUR;
BI.Date.WEEK = 7 * BI.Date.DAY;

_.extend(BI, {
    /**
     * 获取时区
     * @returns {String}
     */
    getTimezone: function (date) {
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    },

    /** Returns the number of days in the current month */
    getMonthDays: function (date, month) {
        var year = date.getFullYear();
        if (typeof month === "undefined") {
            month = date.getMonth();
        }
        if (((0 == (year % 4)) && ((0 != (year % 100)) || (0 == (year % 400)))) && month == 1) {
            return 29;
        }
        return BI.Date._MD[month];

    },

    /**
     * 获取每月的最后一天
     * @returns {Date}
     */
    getLastDateOfMonth: function (date) {
        return BI.getDate(date.getFullYear(), date.getMonth(), BI.getMonthDays(date));
    },

    /** Returns the number of day in the year. */
    getDayOfYear: function (date) {
        var now = BI.getDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        var then = BI.getDate(date.getFullYear(), 0, 0, 0, 0, 0);
        var time = now - then;
        return Math.floor(time / BI.Date.DAY);
    },

    /** Returns the number of the week in year, as defined in ISO 8601. */
    getWeekNumber: function (date) {
        var d = BI.getDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        var week = d.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        var middleDay = (startOfWeek + 3) % 7;
        middleDay = middleDay || 7;
        // 偏移到周周首之前需要多少天
        var offsetWeekStartCount = week < startOfWeek ? (7 + week - startOfWeek) : (week - startOfWeek);
        var offsetWeekMiddleCount = middleDay < startOfWeek ? (7 + middleDay - startOfWeek) : (middleDay - startOfWeek);
        d.setDate(d.getDate() - offsetWeekStartCount + offsetWeekMiddleCount);
        var ms = d.valueOf();
        d.setMonth(0);
        d.setDate(1);
        return Math.floor((ms - d.valueOf()) / (7 * 864e5)) + 1;
    },

    getQuarter: function (date) {
        return Math.floor(date.getMonth() / 3) + 1;
    },

    // 离当前时间多少天的时间
    getOffsetDate: function (date, offset) {
        return BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()) + offset * 864e5);
    },

    getOffsetQuarter: function (date, n) {
        var dt = BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        var day = dt.getDate();
        var monthDay = BI.getMonthDays(BI.getDate(dt.getFullYear(), dt.getMonth() + BI.parseInt(n) * 3, 1));
        if (day > monthDay) {
            day = monthDay;
        }
        dt.setDate(day);
        dt.setMonth(dt.getMonth() + parseInt(n) * 3);
        return dt;
    },

    // 得到本季度的起始月份
    getQuarterStartMonth: function (date) {
        var quarterStartMonth = 0;
        var nowMonth = date.getMonth();
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    },
    // 获得本季度的起始日期
    getQuarterStartDate: function (date) {
        return BI.getDate(date.getFullYear(), BI.getQuarterStartMonth(date), 1);
    },
    // 得到本季度的结束日期
    getQuarterEndDate: function (date) {
        var quarterEndMonth = BI.getQuarterStartMonth(date) + 2;
        return BI.getDate(date.getFullYear(), quarterEndMonth, BI.getMonthDays(date, quarterEndMonth));
    },

    // 指定日期n个月之前或之后的日期
    getOffsetMonth: function (date, n) {
        var dt = BI.getDate(BI.getTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        var day = dt.getDate();
        var monthDay = BI.getMonthDays(BI.getDate(dt.getFullYear(), dt.getMonth() + parseInt(n), 1));
        if (day > monthDay) {
            day = monthDay;
        }
        dt.setDate(day);
        dt.setMonth(dt.getMonth() + parseInt(n));
        return dt;
    },

    // 获得本周的起始日期
    getWeekStartDate: function (date) {
        var w = date.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        return BI.getOffsetDate(date, BI.Date._OFFSET[w < startOfWeek ? (7 + w - startOfWeek) : (w - startOfWeek)]);
    },
    // 得到本周的结束日期
    getWeekEndDate: function (date) {
        var w = date.getDay();
        var startOfWeek = BI.StartOfWeek % 7;
        return BI.getOffsetDate(date, BI.Date._OFFSET[w < startOfWeek ? (7 + w - startOfWeek) : (w - startOfWeek)] + 6);
    },

    // 格式化打印日期
    print: function (date, str) {
        var m = date.getMonth();
        var d = date.getDate();
        var y = date.getFullYear();
        var yWith4number = y + "";
        while (yWith4number.length < 4) {
            yWith4number = "0" + yWith4number;
        }
        var wn = BI.getWeekNumber(date);
        var qr = BI.getQuarter(date);
        var w = date.getDay();
        var s = {};
        var hr = date.getHours();
        var pm = (hr >= 12);
        var ir = (pm) ? (hr - 12) : hr;
        var dy = BI.getDayOfYear(date);
        if (ir == 0) {
            ir = 12;
        }
        var min = date.getMinutes();
        var sec = date.getSeconds();
        s["%a"] = BI.Date._SDN[w]; // abbreviated weekday name [FIXME: I18N]
        s["%A"] = BI.Date._DN[w]; // full weekday name
        s["%b"] = BI.Date._SMN[m]; // abbreviated month name [FIXME: I18N]
        s["%B"] = BI.Date._MN[m]; // full month name
        // FIXME: %c : preferred date and time representation for the current locale
        s["%C"] = 1 + Math.floor(y / 100); // the century number
        s["%d"] = (d < 10) ? ("0" + d) : d; // the day of the month (range 01 to 31)
        s["%e"] = d; // the day of the month (range 1 to 31)
        // FIXME: %D : american date style: %m/%d/%y
        // FIXME: %E, %F, %G, %g, %h (man strftime)
        s["%H"] = (hr < 10) ? ("0" + hr) : hr; // hour, range 00 to 23 (24h format)
        s["%I"] = (ir < 10) ? ("0" + ir) : ir; // hour, range 01 to 12 (12h format)
        s["%j"] = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy; // day of the year (range 001 to 366)
        s["%k"] = hr + "";		// hour, range 0 to 23 (24h format)
        s["%l"] = ir + "";		// hour, range 1 to 12 (12h format)
        s["%X"] = (m < 9) ? ("0" + (1 + m)) : (1 + m); // month, range 01 to 12
        s["%x"] = m + 1; // month, range 1 to 12
        s["%M"] = (min < 10) ? ("0" + min) : min; // minute, range 00 to 59
        s["%n"] = "\n";		// a newline character
        s["%p"] = pm ? "PM" : "AM";
        s["%P"] = pm ? "pm" : "am";
        // FIXME: %r : the time in am/pm notation %I:%M:%S %p
        // FIXME: %R : the time in 24-hour notation %H:%M
        s["%s"] = Math.floor(date.getTime() / 1000);
        s["%S"] = (sec < 10) ? ("0" + sec) : sec; // seconds, range 00 to 59
        s["%t"] = "\t";		// a tab character
        // FIXME: %T : the time in 24-hour notation (%H:%M:%S)
        s["%U"] = s["%W"] = s["%V"] = (wn < 10) ? ("0" + wn) : wn;
        s["%u"] = w + 1;	// the day of the week (range 1 to 7, 1 = MON)
        s["%w"] = w;		// the day of the week (range 0 to 6, 0 = SUN)
        // FIXME: %x : preferred date representation for the current locale without the time
        // FIXME: %X : preferred time representation for the current locale without the date
        s["%y"] = yWith4number.substr(2, 2); // year without the century (range 00 to 99)
        s["%Y"] = yWith4number;		// year with the century
        s["%%"] = "%";		// a literal '%' character
        s["%q"] = "0" + qr;
        s["%Q"] = qr;

        var re = /%./g;
        BI.isKhtml = BI.isKhtml || function () {
            if(!_global.navigator) {
                return false;
            }
            return /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
        };

        // 包含年周的格式化，ISO8601标准周的计数会影响年
        if ((str.indexOf("%Y") !== -1 || str.indexOf("%y") !== -1) && (str.indexOf("%W") !== -1 || str.indexOf("%U") !== -1 || str.indexOf("%V") !== -1)) {
            switch (wn) {
                // 如果周数是1，但是当前却在12月，表示此周数为下一年的
                case 1:
                    if (m === 11) {
                        s["%y"] = parseInt(s["%y"]) + 1;
                        s["%Y"] = parseInt(s["%Y"]) + 1;
                    }
                    break;
                // 如果周数是53，但是当前却在1月，表示此周数为上一年的
                case 53:
                    if (m === 0) {
                        s["%y"] = parseInt(s["%y"]) - 1;
                        s["%Y"] = parseInt(s["%Y"]) - 1;
                    }
                    break;
                default:
                    break;
            }
        }

        if (!BI.isKhtml()) {
            return str.replace(re, function (par) {
                return s[par] || par;
            });
        }
        var a = str.match(re);
        for (var i = 0; i < a.length; i++) {
            var tmp = s[a[i]];
            if (tmp) {
                re = new RegExp(a[i], "g");
                str = str.replace(re, tmp);
            }
        }

        return str;
    }
});


/***/ }),

/***/ 105:
/***/ (function(module, exports) {

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
     * @param clone  是否需要deepClone
     */
    getSearchResult: function (items, keyword, param, clone) {
        var isArray = BI.isArray(items);
        items = isArray ? BI.flatten(items) : items;
        param || (param = "text");
        BI.isNull(clone) && (clone = true);
        if (!BI.isKey(keyword)) {
            return {
                find: clone ? BI.deepClone(items) : items,
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
            clone && (item = BI.deepClone(item));
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


/***/ }),

/***/ 106:
/***/ (function(module, exports) {

_.extend(BI, {
    // 给Number类型增加一个add方法，调用起来更加方便。
    add: function (num, arg) {
        return accAdd(arg, num);

        /**
         ** 加法函数，用来得到精确的加法结果
         ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
         ** 调用：accAdd(arg1,arg2)
         ** 返回值：arg1加上arg2的精确结果
         **/
        function accAdd (arg1, arg2) {
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        }
    },

    // 给Number类型增加一个sub方法，调用起来更加方便。
    sub: function (num, arg) {
        return accSub(num, arg);

        /**
         ** 减法函数，用来得到精确的减法结果
         ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
         ** 调用：accSub(arg1,arg2)
         ** 返回值：arg1加上arg2的精确结果
         **/
        function accSub (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        }
    },

    // 给Number类型增加一个mul方法，调用起来更加方便。
    mul: function (num, arg) {
        return accMul(arg, num);

        /**
         ** 乘法函数，用来得到精确的乘法结果
         ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
         ** 调用：accMul(arg1,arg2)
         ** 返回值：arg1乘以 arg2的精确结果
         **/
        function accMul (arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            } catch (e) {
            }
            try {
                m += s2.split(".")[1].length;
            } catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        }
    },
    
    // 给Number类型增加一个div方法，调用起来更加方便。
    div: function (num, arg) {
        return accDivide(num, arg);

        /**
         * Return digits length of a number
         * @param {*number} num Input number
         */
        function digitLength (num) {
            // Get digit length of e
            var eSplit = num.toString().split(/[eE]/);
            var len = (eSplit[0].split(".")[1] || "").length - (+(eSplit[1] || 0));
            return len > 0 ? len : 0;
        }
        /**
         * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
         * @param {*number} num 输入数
         */
        function float2Fixed (num) {
            if (num.toString().indexOf("e") === -1) {
                return Number(num.toString().replace(".", ""));
            }
            var dLen = digitLength(num);
            return dLen > 0 ? num * Math.pow(10, dLen) : num;
        }

        /**
         * 精确乘法
         */
        function times (num1, num2) {
            var others = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                others[_i - 2] = arguments[_i];
            }
            if (others.length > 0) {
                return times.apply(void 0, [times(num1, num2), others[0]].concat(others.slice(1)));
            }
            var num1Changed = float2Fixed(num1);
            var num2Changed = float2Fixed(num2);
            var baseNum = digitLength(num1) + digitLength(num2);
            var leftValue = num1Changed * num2Changed;
            return leftValue / Math.pow(10, baseNum);
        }

        /**
         * 精确除法
         */
        function accDivide (num1, num2) {
            var others = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                others[_i - 2] = arguments[_i];
            }
            if (others.length > 0) {
                return accDivide.apply(void 0, [accDivide(num1, num2), others[0]].concat(others.slice(1)));
            }
            var num1Changed = float2Fixed(num1);
            var num2Changed = float2Fixed(num2);
            return times((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)));
        }
    }

});

/***/ }),

/***/ 107:
/***/ (function(module, exports) {

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

/***/ }),

/***/ 108:
/***/ (function(module, exports) {

/**
 * 汉字拼音索引
 */

!(function () {
    var _ChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGHGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";

    // 此处收录了375个多音字,数据来自于http://www.51windows.net/pages/pinyin.asp
    var oMultiDiff = {
        19969: "DZ",
        19975: "WM",
        19988: "QJ",
        20048: "YL",
        20056: "SC",
        20060: "NM",
        20094: "QG",
        20127: "QJ",
        20167: "QC",
        20193: "YG",
        20250: "KH",
        20256: "ZC",
        20282: "SC",
        20285: "QJG",
        20291: "TD",
        20314: "YD",
        20315: "BF",
        20340: "NE",
        20375: "TD",
        20389: "YJ",
        20391: "CZ",
        20415: "PB",
        20446: "YS",
        20447: "SQ",
        20504: "TC",
        20608: "KG",
        20854: "QJ",
        20857: "ZC",
        20911: "PF",
        20985: "AW",
        21032: "PB",
        21048: "XQ",
        21049: "SC",
        21089: "YS",
        21119: "JC",
        21242: "SB",
        21273: "SC",
        21305: "YP",
        21306: "QO",
        21330: "ZC",
        21333: "SDC",
        21345: "QK",
        21378: "CA",
        21397: "SC",
        21414: "XS",
        21442: "SC",
        21477: "JG",
        21480: "TD",
        21484: "ZS",
        21494: "YX",
        21505: "YX",
        21512: "HG",
        21523: "XH",
        21537: "PB",
        21542: "PF",
        21549: "KH",
        21571: "E",
        21574: "DA",
        21588: "TD",
        21589: "O",
        21618: "ZC",
        21621: "KHA",
        21632: "ZJ",
        21654: "KG",
        21679: "LKG",
        21683: "KH",
        21710: "A",
        21719: "YH",
        21734: "WOE",
        21769: "A",
        21780: "WN",
        21804: "XH",
        21834: "A",
        21899: "ZD",
        21903: "RN",
        21908: "WO",
        21939: "ZC",
        21956: "SA",
        21964: "YA",
        21970: "TD",
        22003: "A",
        22031: "JG",
        22040: "XS",
        22060: "ZC",
        22066: "ZC",
        22079: "MH",
        22129: "XJ",
        22179: "XA",
        22237: "NJ",
        22244: "TD",
        22280: "JQ",
        22300: "YH",
        22313: "XW",
        22331: "YQ",
        22343: "YJ",
        22351: "PH",
        22395: "DC",
        22412: "TD",
        22484: "PB",
        22500: "PB",
        22534: "ZD",
        22549: "DH",
        22561: "PB",
        22612: "TD",
        22771: "KQ",
        22831: "HB",
        22841: "JG",
        22855: "QJ",
        22865: "XQ",
        23013: "ML",
        23081: "WM",
        23487: "SX",
        23558: "QJ",
        23561: "YW",
        23586: "YW",
        23614: "YW",
        23615: "SN",
        23631: "PB",
        23646: "ZS",
        23663: "ZT",
        23673: "YG",
        23762: "TD",
        23769: "ZS",
        23780: "QJ",
        23884: "QK",
        24055: "XH",
        24113: "DC",
        24162: "ZC",
        24191: "GA",
        24273: "QJ",
        24324: "NL",
        24377: "TD",
        24378: "QJ",
        24439: "PF",
        24554: "ZS",
        24683: "TD",
        24694: "WE",
        24733: "LK",
        24925: "TN",
        25094: "ZG",
        25100: "XQ",
        25103: "XH",
        25153: "PB",
        25170: "PB",
        25179: "KG",
        25203: "PB",
        25240: "ZS",
        25282: "FB",
        25303: "NA",
        25324: "KG",
        25341: "ZY",
        25373: "WZ",
        25375: "XJ",
        25384: "A",
        25457: "A",
        25528: "SD",
        25530: "SC",
        25552: "TD",
        25774: "ZC",
        25874: "ZC",
        26044: "YW",
        26080: "WM",
        26292: "PB",
        26333: "PB",
        26355: "ZY",
        26366: "CZ",
        26397: "ZC",
        26399: "QJ",
        26415: "ZS",
        26451: "SB",
        26526: "ZC",
        26552: "JG",
        26561: "TD",
        26588: "JG",
        26597: "CZ",
        26629: "ZS",
        26638: "YL",
        26646: "XQ",
        26653: "KG",
        26657: "XJ",
        26727: "HG",
        26894: "ZC",
        26937: "ZS",
        26946: "ZC",
        26999: "KJ",
        27099: "KJ",
        27449: "YQ",
        27481: "XS",
        27542: "ZS",
        27663: "ZS",
        27748: "TS",
        27784: "SC",
        27788: "ZD",
        27795: "TD",
        27812: "O",
        27850: "PB",
        27852: "MB",
        27895: "SL",
        27898: "PL",
        27973: "QJ",
        27981: "KH",
        27986: "HX",
        27994: "XJ",
        28044: "YC",
        28065: "WG",
        28177: "SM",
        28267: "QJ",
        28291: "KH",
        28337: "ZQ",
        28463: "TL",
        28548: "DC",
        28601: "TD",
        28689: "PB",
        28805: "JG",
        28820: "QG",
        28846: "PB",
        28952: "TD",
        28975: "ZC",
        29100: "A",
        29325: "QJ",
        29575: "SL",
        29602: "FB",
        30010: "TD",
        30044: "CX",
        30058: "PF",
        30091: "YSP",
        30111: "YN",
        30229: "XJ",
        30427: "SC",
        30465: "SX",
        30631: "YQ",
        30655: "QJ",
        30684: "QJG",
        30707: "SD",
        30729: "XH",
        30796: "LG",
        30917: "PB",
        31074: "NM",
        31085: "JZ",
        31109: "SC",
        31181: "ZC",
        31192: "MLB",
        31293: "JQ",
        31400: "YX",
        31584: "YJ",
        31896: "ZN",
        31909: "ZY",
        31995: "XJ",
        32321: "PF",
        32327: "ZY",
        32418: "HG",
        32420: "XQ",
        32421: "HG",
        32438: "LG",
        32473: "GJ",
        32488: "TD",
        32521: "QJ",
        32527: "PB",
        32562: "ZSQ",
        32564: "JZ",
        32735: "ZD",
        32793: "PB",
        33071: "PF",
        33098: "XL",
        33100: "YA",
        33152: "PB",
        33261: "CX",
        33324: "BP",
        33333: "TD",
        33406: "YA",
        33426: "WM",
        33432: "PB",
        33445: "JG",
        33486: "ZN",
        33493: "TS",
        33507: "QJ",
        33540: "QJ",
        33544: "ZC",
        33564: "XQ",
        33617: "YT",
        33632: "QJ",
        33636: "XH",
        33637: "YX",
        33694: "WG",
        33705: "PF",
        33728: "YW",
        33882: "SR",
        34067: "WM",
        34074: "YW",
        34121: "QJ",
        34255: "ZC",
        34259: "XL",
        34425: "JH",
        34430: "XH",
        34485: "KH",
        34503: "YS",
        34532: "HG",
        34552: "XS",
        34558: "YE",
        34593: "ZL",
        34660: "YQ",
        34892: "XH",
        34928: "SC",
        34999: "QJ",
        35048: "PB",
        35059: "SC",
        35098: "ZC",
        35203: "TQ",
        35265: "JX",
        35299: "JX",
        35782: "SZ",
        35828: "YS",
        35830: "E",
        35843: "TD",
        35895: "YG",
        35977: "MH",
        36158: "JG",
        36228: "QJ",
        36426: "XQ",
        36466: "DC",
        36710: "CJ",
        36711: "ZYG",
        36767: "PB",
        36866: "SK",
        36951: "YW",
        37034: "YX",
        37063: "XH",
        37218: "ZC",
        37325: "ZC",
        38063: "PB",
        38079: "TD",
        38085: "QY",
        38107: "DC",
        38116: "TD",
        38123: "YD",
        38224: "HG",
        38241: "XTC",
        38271: "ZC",
        38415: "YE",
        38426: "KH",
        38461: "YD",
        38463: "AE",
        38466: "PB",
        38477: "XJ",
        38518: "YT",
        38551: "WK",
        38585: "ZC",
        38704: "XS",
        38739: "LJ",
        38761: "GJ",
        38808: "SQ",
        39048: "JG",
        39049: "XJ",
        39052: "HG",
        39076: "CZ",
        39271: "XT",
        39534: "TD",
        39552: "TD",
        39584: "PB",
        39647: "SB",
        39730: "LG",
        39748: "TPB",
        40109: "ZQ",
        40479: "ND",
        40516: "HG",
        40536: "HG",
        40583: "QJ",
        40765: "YQ",
        40784: "QJ",
        40840: "YK",
        40863: "QJG"
    };

    var _checkPYCh = function (ch) {
        var uni = ch.charCodeAt(0);
        // 如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
        if (uni > 40869 || uni < 19968) {return ch;} // dealWithOthers(ch);
        return (oMultiDiff[uni] ? oMultiDiff[uni] : (_ChineseFirstPY.charAt(uni - 19968)));
    };

    var _mkPYRslt = function (arr, options) {
        var ignoreMulti = options.ignoreMulti;
        var splitChar = options.splitChar;
        var arrRslt = [""], k, multiLen = 0;
        for (var i = 0, len = arr.length; i < len; i++) {
            var str = arr[i];
            var strlen = str.length;
            // 多音字过多的情况下，指数增长会造成浏览器卡死，超过20完全卡死，18勉强能用，考虑到不同性能最好是16或者14
            // 超过14个多音字之后，后面的都用第一个拼音
            if (strlen == 1 || multiLen > 14 || ignoreMulti) {
                var tmpStr = str.substring(0, 1);
                for (k = 0; k < arrRslt.length; k++) {
                    arrRslt[k] += tmpStr;
                }
            } else {
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                multiLen ++;
                for (k = 0; k < strlen; k++) {
                    // 复制一个相同的arrRslt
                    var tmp = tmpArr.slice(0);
                    // 把当前字符str[k]添加到每个元素末尾
                    for (var j = 0; j < tmp.length; j++) {
                        tmp[j] += str.charAt(k);
                    }
                    // 把复制并修改后的数组连接到arrRslt上
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        // BI-56386 这边直接将所有多音字组合拼接是有风险的，因为丢失了每一组的起始索引信息, 外部使用indexOf等方法会造成错位
        // 一旦错位就可能认为不符合条件， 但实际上还是有可能符合条件的，故此处以一个无法搜索的不可见字符作为连接
        return arrRslt.join(splitChar || "").toLowerCase();
    };

    _.extend(BI, {
        makeFirstPY: function (str, options) {
            options = options || {};
            if (typeof (str) !== "string") {return "" + str;}
            var arrResult = []; // 保存中间结果的数组
            for (var i = 0, len = str.length; i < len; i++) {
                // 获得unicode码
                var ch = str.charAt(i);
                // 检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
                arrResult.push(_checkPYCh(ch));
            }
            // 处理arrResult,返回所有可能的拼音首字母串数组
            return _mkPYRslt(arrResult, options);
        }
    });
})();

/***/ }),

/***/ 109:
/***/ (function(module, exports) {

!(function () {
    var i18nStore = {};
    _.extend(BI, {
        addI18n: function (i18n) {
            BI.extend(i18nStore, i18n);
        },
        i18nText: function (key) {
            var localeText = i18nStore[key] || (BI.i18n && BI.i18n[key]) || "";
            if (!localeText) {
                localeText = key;
            }
            var len = arguments.length;
            if (len > 1) {
                if (localeText.indexOf("{R1}") > -1) {
                    for (var i = 1; i < len; i++) {
                        var key = "{R" + i + "}";
                        localeText = BI.replaceAll(localeText, key, arguments[i] + "");
                    }
                } else {
                    var args = Array.prototype.slice.call(arguments);
                    var count = 1;
                    return BI.replaceAll(localeText, "\\{\\s*\\}", function () {
                        return args[count++] + "";
                    });
                }
            }
            return localeText;
        }
    });
})();

/***/ }),

/***/ 110:
/***/ (function(module, exports) {

/**
 * 缓冲池
 * @type {{Buffer: {}}}
 */

(function () {
    var Buffer = {};
    var MODE = false;// 设置缓存模式为关闭

    BI.BufferPool = {
        put: function (name, cache) {
            if (BI.isNotNull(Buffer[name])) {
                throw new Error("key值：[" + name + "] 已存在!", Buffer);
            }
            Buffer[name] = cache;
        },

        get: function (name) {
            return Buffer[name];
        }
    };
})();


/***/ }),

/***/ 111:
/***/ (function(module, exports) {

/**
 * 共享池
 * @type {{Shared: {}}}
 */

(function () {
    var _Shared = {};
    BI.SharingPool = {
        _Shared: _Shared,
        put: function (name, shared) {
            _Shared[name] = shared;
        },

        cat: function () {
            var args = Array.prototype.slice.call(arguments, 0),
                copy = _Shared;
            for (var i = 0; i < args.length; i++) {
                copy = copy && copy[args[i]];
            }
            return copy;
        },

        get: function () {
            return BI.deepClone(this.cat.apply(this, arguments));
        },

        remove: function (key) {
            delete _Shared[key];
        }
    };
})();

/***/ }),

/***/ 112:
/***/ (function(module, exports) {

BI.Req = {

};


/***/ }),

/***/ 1137:
/***/ (function(module, exports) {

BI.i18n = {
    "BI-Multi_Date_Quarter_End": "季度末",
    "BI-Multi_Date_Month_Begin": "月初",
    "BI-Multi_Date_YMD": "年月日",
    "BI-Custom_Color": "自定义颜色",
    "BI-Numerical_Interval_Input_Data": "请输入数值",
    "BI-Please_Input_Natural_Number": "请输入非负整数",
    "BI-No_More_Data": "无更多数据",
    "BI-Basic_Altogether": "共",
    "BI-Basic_Sunday": "星期日",
    "BI-Widget_Background_Colour": "组件背景",
    "BI-Color_Picker_Error_Text": "请输入0-255的正整数",
    "BI-Multi_Date_Month": "月",
    "BI-No_Selected_Item": "没有可选项",
    "BI-Multi_Date_Year_Begin": "年初",
    "BI-Quarter_1": "第1季度",
    "BI-Quarter_2": "第2季度",
    "BI-Quarter_3": "第3季度",
    "BI-Quarter_4": "第4季度",
    "BI-Multi_Date_Year_Next": "年后",
    "BI-Multi_Date_Month_Prev": "个月前",
    "BI-Month_Trigger_Error_Text": "请输入1~12的正整数",
    "BI-Less_And_Equal": "小于等于",
    "BI-Year_Trigger_Invalid_Text": "请输入有效时间",
    "BI-Multi_Date_Week_Next": "周后",
    "BI-Font_Size": "字号",
    "BI-Basic_Total": "共",
    "BI-Already_Selected": "已选择",
    "BI-Formula_Insert": "插入",
    "BI-Select_All": "全选",
    "BI-Basic_Tuesday": "星期二",
    "BI-Multi_Date_Month_End": "月末",
    "BI-Load_More": "点击加载更多数据",
    "BI-Basic_September": "九月",
    "BI-Current_Is_Last_Page": "当前已是最后一页",
    "BI-Basic_Auto": "自动",
    "BI-Basic_Count": "个",
    "BI-Basic_Value": "值",
    "BI-Basic_Unrestricted": "无限制",
    "BI-Quarter_Trigger_Error_Text": "请输入1~4的正整数",
    "BI-Basic_More": "更多",
    "BI-Basic_Wednesday": "星期三",
    "BI-Basic_Bold": "加粗",
    "BI-Basic_Simple_Saturday": "六",
    "BI-Multi_Date_Month_Next": "个月后",
    "BI-Basic_March": "三月",
    "BI-Current_Is_First_Page": "当前已是第一页",
    "BI-Basic_Thursday": "星期四",
    "BI-Basic_Prompt": "提示",
    "BI-Multi_Date_Today": "今天",
    "BI-Multi_Date_Quarter_Prev": "个季度前",
    "BI-Row_Header": "行表头",
    "BI-Date_Trigger_Error_Text": "日期格式示例:2015-3-11",
    "BI-Basic_Cancel": "取消",
    "BI-Basic_January": "一月",
    "BI-Basic_June": "六月",
    "BI-Basic_July": "七月",
    "BI-Basic_April": "四月",
    "BI-Multi_Date_Quarter_Begin": "季度初",
    "BI-Multi_Date_Week": "周",
    "BI-Click_Blank_To_Select": "点击\"空格键\"选中完全匹配项",
    "BI-Basic_August": "八月",
    "BI-Word_Align_Left": "文字居左",
    "BI-Basic_November": "十一月",
    "BI-Font_Colour": "字体颜色",
    "BI-Multi_Date_Day_Prev": "天前",
    "BI-Select_Part": "部分选择",
    "BI-Multi_Date_Day_Next": "天后",
    "BI-Less_Than": "小于",
    "BI-Basic_February": "二月",
    "BI-Multi_Date_Year": "年",
    "BI-Number_Index": "序号",
    "BI-Multi_Date_Week_Prev": "周前",
    "BI-Next_Page": "下一页",
    "BI-Right_Page": "向右翻页",
    "BI-Numerical_Interval_Signal_Value": "前后值相等，请将操作符改为“≤”",
    "BI-Basic_December": "十二月",
    "BI-Basic_Saturday": "星期六",
    "BI-Basic_Simple_Wednesday": "三",
    "BI-Multi_Date_Quarter_Next": "个季度后",
    "BI-Basic_October": "十月",
    "BI-Basic_Simple_Friday": "五",
    "BI-Basic_Save": "保存",
    "BI-Numerical_Interval_Number_Value": "请保证前面的数值小于/等于后面的数值",
    "BI-Previous_Page": "上一页",
    "BI-No_Select": "搜索结果为空",
    "BI-Basic_Clears": "清空",
    "BI-Created_By_Me": "我创建的",
    "BI-Basic_Simple_Tuesday": "二",
    "BI-Word_Align_Right": "文字居右",
    "BI-Summary_Values": "汇总",
    "BI-Basic_Clear": "清除",
    "BI-Upload_File_Size_Error": "文件大小不支持",
    "BI-Upload_File_Count_Error": "超出上传数量上限{R1}，请重新上传",
    "BI-Up_Page": "向上翻页",
    "BI-Basic_Simple_Sunday": "日",
    "BI-Multi_Date_Relative_Current_Time": "相对当前时间",
    "BI-Selected_Data": "已选数据：",
    "BI-Multi_Date_Quarter": "季度",
    "BI-Check_Selected": "查看已选",
    "BI-Basic_Search": "搜索",
    "BI-Basic_May": "五月",
    "BI-Continue_Select": "继续选择",
    "BI-Please_Input_Positive_Integer": "请输入正整数",
    "BI-Upload_File_Type_Error": "文件类型不支持",
    "BI-Upload_File_Error": "文件上传失败",
    "BI-Basic_Friday": "星期五",
    "BI-Down_Page": "向下翻页",
    "BI-Basic_Monday": "星期一",
    "BI-Left_Page": "向左翻页",
    "BI-Transparent_Color": "透明",
    "BI-Basic_Simple_Monday": "一",
    "BI-Multi_Date_Year_End": "年末",
    "BI-Time_Interval_Error_Text": "请保证开始时间早于/等于结束时间",
    "BI-Basic_Time": "时间",
    "BI-Basic_OK": "确定",
    "BI-Basic_Sure": "确定",
    "BI-Basic_Simple_Thursday": "四",
    "BI-Multi_Date_Year_Prev": "年前",
    "BI-Tiao_Data": "条数据",
    "BI-Basic_Italic": "斜体",
    "BI-Basic_Dynamic_Title": "动态时间",
    "BI-Basic_Year": "年",
    "BI-Basic_Single_Quarter": "季",
    "BI-Basic_Month": "月",
    "BI-Basic_Week": "周",
    "BI-Basic_Day": "天",
    "BI-Basic_Work_Day": "工作日",
    "BI-Basic_Front": "前",
    "BI-Basic_Behind": "后",
    "BI-Basic_Empty": "空",
    "BI-Basic_Month_End": "月末",
    "BI-Basic_Month_Begin": "月初",
    "BI-Basic_Year_End": "年末",
    "BI-Basic_Year_Begin": "年初",
    "BI-Basic_Quarter_End": "季末",
    "BI-Basic_Quarter_Begin": "季初",
    "BI-Basic_Week_End": "周末",
    "BI-Basic_Week_Begin": "周初",
    "BI-Basic_Current_Day": "当天",
    "BI-Basic_Begin_Start": "初",
    "BI-Basic_End_Stop": "末",
    "BI-Basic_Current_Year": "今年",
    "BI-Basic_Year_Fen": "年份",
    "BI-Basic_Current_Month": "本月",
    "BI-Basic_Current_Quarter": "本季度",
    "BI-Basic_Year_Month": "年月",
    "BI-Basic_Year_Quarter": "年季度",
    "BI-Basic_Input_Can_Not_Null": "输入框不能为空",
    "BI-Basic_Date_Time_Error_Text": "日期格式示例:2015-3-11 00:00:00",
    "BI-Basic_Input_From_To_Number": "请输入{R1}的数值",
    "BI-Basic_Or": "或",
    "BI-Basic_And": "且",
    "BI-Conf_Add_Formula": "添加公式",
    "BI-Conf_Add_Condition": "添加条件",
    "BI-Conf_Formula_And": "且公式条件",
    "BI-Conf_Formula_Or": "或公式条件",
    "BI-Conf_Condition_And": "且条件",
    "BI-Conf_Condition_Or": "或条件",
    "BI-Microsoft_YaHei": "微软雅黑",
    "BI-Apple_Light": "苹方-light",
    "BI-Font_Family": "字体",
    "BI-Basic_Please_Input_Content": "请输入内容",
    "BI-Word_Align_Center": "文字居中",
    "BI-Basic_Please_Enter_Number_Between": "请输入{R1}-{R2}的值",
    "BI-More_Than": "大于",
    "BI-More_And_Equal": "大于等于",
    "BI-Please_Enter_SQL": "请输入SQL",
    "BI-Basic_Click_To_Add_Text": "点按回车键添加\"{R1}\"",
    "BI-Basic_Please_Select": "请选择",
    "BI-Basic_Font_Color": "文字颜色",
    "BI-Basic_Background_Color": "背景色",
    "BI-Basic_Underline": "下划线",
    "BI-Basic_Param_Month": "{R1}月",
    "BI-Basic_Param_Day": "{R1}日",
    "BI-Basic_Param_Quarter": "{R1}季度",
    "BI-Basic_Param_Week_Count": "第{R1}周",
    "BI-Basic_Param_Hour": "{R1}时",
    "BI-Basic_Param_Minute": "{R1}分",
    "BI-Basic_Param_Second": "{R1}秒",
    "BI-Basic_Param_Year": "{R1}年",
    "BI-Basic_Date_Day": "日",
    "BI-Basic_Hour_Sin": "时",
    "BI-Basic_Seconds": "秒",
    "BI-Basic_Minute": "分",
    "BI-Basic_Thousand": "千",
    "BI-Basic_Wan": "万",
    "BI-Basic_Million": "百万",
    "BI-Basic_Billion": "亿",
    "BI-Basic_Quarter": "季度",
    "BI-Basic_No_Select": "不选",
    "BI-Basic_Now": "此刻",
    "BI-Color_Picker_Error_Text_Hex": "请输入6位16进制颜色编号",
    "BI-Basic_Date_Range_Error": "请选择{R1}年{R2}月{R3}日-{R4}年{R5}月{R6}日的日期",
    "BI-Basic_Year_Range_Error": "请选择{R1}年-{R2}年的日期",
    "BI-Basic_Year_Month_Range_Error": "请选择{R1}年{R2}月-{R3}年{R4}月的日期",
    "BI-Basic_Year_Quarter_Range_Error": "请选择{R1}年{R2}季度-{R3}年{R4}季度的日期",
    "BI-Basic_Search_And_Patch_Paste": "搜索，支持批量粘贴、粘贴值通过换行识别",
    "BI-Basic_Recommend_Color": "推荐色"
};

/***/ }),

/***/ 1279:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(91);
__webpack_require__(92);
__webpack_require__(99);
__webpack_require__(100);
__webpack_require__(101);
__webpack_require__(102);
__webpack_require__(103);
__webpack_require__(104);
__webpack_require__(105);
__webpack_require__(106);
__webpack_require__(107);
__webpack_require__(95);
__webpack_require__(97);
__webpack_require__(98);
__webpack_require__(108);
__webpack_require__(109);
__webpack_require__(1137);
__webpack_require__(1280);
__webpack_require__(110);
__webpack_require__(111);
module.exports = __webpack_require__(112);


/***/ }),

/***/ 1280:
/***/ (function(module, exports) {

/**
 * Created by astronaut007 on 2018/8/8
 */
// 牵扯到国际化这些常量在页面加载后再生效
// full day names
BI.Date = BI.Date || {};
BI.Date._DN = ["星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日"];

// short day names
BI.Date._SDN = ["日",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "日"];

// Monday first, etc.
BI.Date._FD = 1;

// full month namesdat
BI.Date._MN = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"];

// short month names
BI.Date._SMN = [0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11];

BI.Date._QN = ["", "第1季度",
    "第2季度",
    "第3季度",
    "第4季度"];

/** Adds the number of days array to the Date object. */
BI.Date._MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 实际上无论周几作为一周的第一天，周初周末都是在-6-0间做偏移，用一个数组就可以
BI.Date._OFFSET = [0, -1, -2, -3, -4, -5, -6];


/***/ }),

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply; // DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};

exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};

exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}

Timeout.prototype.unref = Timeout.prototype.ref = function () {};

Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
}; // Does not start the time, just sets up the members needed.


exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;

  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
}; // setimmediate attaches itself to the global object


__webpack_require__(96); // On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.


exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || void 0 && (void 0).setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || void 0 && (void 0).clearImmediate;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(14)))

/***/ }),

/***/ 75:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Created by richie on 15/7/8.
 */
/**
 * 初始化BI对象
 */
_global = undefined;
if (typeof window !== "undefined") {
    _global = window;
} else if (typeof global !== "undefined") {
    _global = global;
} else if (typeof self !== "undefined") {
    _global = self;
} else {
    _global = this;
}
if (_global.BI == null) {
    _global.BI = {prepares: []};
}
if(_global.BI.prepares == null) {
    _global.BI.prepares = [];
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(14)))

/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(93)(__webpack_require__(94))

/***/ }),

/***/ 93:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ }),

/***/ 94:
/***/ (function(module, exports) {

module.exports = "/**\r\n * @license\r\n * Lodash (Custom Build) <https://lodash.com/>\r\n * Build: `lodash core plus=\"debounce,throttle,get,set,findIndex,findLastIndex,findKey,findLastKey,isArrayLike,invert,invertBy,uniq,uniqBy,omit,omitBy,zip,unzip,rest,range,random,reject,intersection,drop,countBy,union,zipObject,initial,cloneDeep,clamp,isPlainObject,take,takeRight,without,difference,defaultsDeep,trim,merge,groupBy,uniqBy,before,after,unescape\"`\r\n * Copyright JS Foundation and other contributors <https://js.foundation/>\r\n * Released under MIT license <https://lodash.com/license>\r\n * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>\r\n * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\r\n */\r\n;(function() {\r\n\r\n  /** Used as a safe reference for `undefined` in pre-ES5 environments. */\r\n  var undefined;\r\n\r\n  /** Used as the semantic version number. */\r\n  var VERSION = '4.17.5';\r\n\r\n  /** Used as the size to enable large array optimizations. */\r\n  var LARGE_ARRAY_SIZE = 200;\r\n\r\n  /** Error message constants. */\r\n  var FUNC_ERROR_TEXT = 'Expected a function';\r\n\r\n  /** Used to stand-in for `undefined` hash values. */\r\n  var HASH_UNDEFINED = '__lodash_hash_undefined__';\r\n\r\n  /** Used as the maximum memoize cache size. */\r\n  var MAX_MEMOIZE_SIZE = 500;\r\n\r\n  /** Used as the internal argument placeholder. */\r\n  var PLACEHOLDER = '__lodash_placeholder__';\r\n\r\n  /** Used to compose bitmasks for cloning. */\r\n  var CLONE_DEEP_FLAG = 1,\r\n      CLONE_FLAT_FLAG = 2,\r\n      CLONE_SYMBOLS_FLAG = 4;\r\n\r\n  /** Used to compose bitmasks for value comparisons. */\r\n  var COMPARE_PARTIAL_FLAG = 1,\r\n      COMPARE_UNORDERED_FLAG = 2;\r\n\r\n  /** Used to compose bitmasks for function metadata. */\r\n  var WRAP_BIND_FLAG = 1,\r\n      WRAP_BIND_KEY_FLAG = 2,\r\n      WRAP_CURRY_BOUND_FLAG = 4,\r\n      WRAP_CURRY_FLAG = 8,\r\n      WRAP_CURRY_RIGHT_FLAG = 16,\r\n      WRAP_PARTIAL_FLAG = 32,\r\n      WRAP_PARTIAL_RIGHT_FLAG = 64,\r\n      WRAP_ARY_FLAG = 128,\r\n      WRAP_REARG_FLAG = 256,\r\n      WRAP_FLIP_FLAG = 512;\r\n\r\n  /** Used to detect hot functions by number of calls within a span of milliseconds. */\r\n  var HOT_COUNT = 800,\r\n      HOT_SPAN = 16;\r\n\r\n  /** Used to indicate the type of lazy iteratees. */\r\n  var LAZY_FILTER_FLAG = 1,\r\n      LAZY_MAP_FLAG = 2,\r\n      LAZY_WHILE_FLAG = 3;\r\n\r\n  /** Used as references for various `Number` constants. */\r\n  var INFINITY = 1 / 0,\r\n      MAX_SAFE_INTEGER = 9007199254740991,\r\n      MAX_INTEGER = 1.7976931348623157e+308,\r\n      NAN = 0 / 0;\r\n\r\n  /** Used as references for the maximum length and index of an array. */\r\n  var MAX_ARRAY_LENGTH = 4294967295;\r\n\r\n  /** Used to associate wrap methods with their bit flags. */\r\n  var wrapFlags = [\r\n    ['ary', WRAP_ARY_FLAG],\r\n    ['bind', WRAP_BIND_FLAG],\r\n    ['bindKey', WRAP_BIND_KEY_FLAG],\r\n    ['curry', WRAP_CURRY_FLAG],\r\n    ['curryRight', WRAP_CURRY_RIGHT_FLAG],\r\n    ['flip', WRAP_FLIP_FLAG],\r\n    ['partial', WRAP_PARTIAL_FLAG],\r\n    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],\r\n    ['rearg', WRAP_REARG_FLAG]\r\n  ];\r\n\r\n  /** `Object#toString` result references. */\r\n  var argsTag = '[object Arguments]',\r\n      arrayTag = '[object Array]',\r\n      asyncTag = '[object AsyncFunction]',\r\n      boolTag = '[object Boolean]',\r\n      dateTag = '[object Date]',\r\n      errorTag = '[object Error]',\r\n      funcTag = '[object Function]',\r\n      genTag = '[object GeneratorFunction]',\r\n      mapTag = '[object Map]',\r\n      numberTag = '[object Number]',\r\n      nullTag = '[object Null]',\r\n      objectTag = '[object Object]',\r\n      promiseTag = '[object Promise]',\r\n      proxyTag = '[object Proxy]',\r\n      regexpTag = '[object RegExp]',\r\n      setTag = '[object Set]',\r\n      stringTag = '[object String]',\r\n      symbolTag = '[object Symbol]',\r\n      undefinedTag = '[object Undefined]',\r\n      weakMapTag = '[object WeakMap]';\r\n\r\n  var arrayBufferTag = '[object ArrayBuffer]',\r\n      dataViewTag = '[object DataView]',\r\n      float32Tag = '[object Float32Array]',\r\n      float64Tag = '[object Float64Array]',\r\n      int8Tag = '[object Int8Array]',\r\n      int16Tag = '[object Int16Array]',\r\n      int32Tag = '[object Int32Array]',\r\n      uint8Tag = '[object Uint8Array]',\r\n      uint8ClampedTag = '[object Uint8ClampedArray]',\r\n      uint16Tag = '[object Uint16Array]',\r\n      uint32Tag = '[object Uint32Array]';\r\n\r\n  /** Used to match HTML entities and HTML characters. */\r\n  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,\r\n      reUnescapedHtml = /[&<>\"']/g,\r\n      reHasEscapedHtml = RegExp(reEscapedHtml.source),\r\n      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);\r\n\r\n  /** Used to match property names within property paths. */\r\n  var reIsDeepProp = /\\.|\\[(?:[^[\\]]*|([\"'])(?:(?!\\1)[^\\\\]|\\\\.)*?\\1)\\]/,\r\n      reIsPlainProp = /^\\w*$/,\r\n      rePropName = /[^.[\\]]+|\\[(?:(-?\\d+(?:\\.\\d+)?)|([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))/g;\r\n\r\n  /**\r\n   * Used to match `RegExp`\r\n   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).\r\n   */\r\n  var reRegExpChar = /[\\\\^$.*+?()[\\]{}|]/g;\r\n\r\n  /** Used to match leading and trailing whitespace. */\r\n  var reTrim = /^\\s+|\\s+$/g;\r\n\r\n  /** Used to match wrap detail comments. */\r\n  var reWrapComment = /\\{(?:\\n\\/\\* \\[wrapped with .+\\] \\*\\/)?\\n?/,\r\n      reWrapDetails = /\\{\\n\\/\\* \\[wrapped with (.+)\\] \\*/,\r\n      reSplitDetails = /,? & /;\r\n\r\n  /** Used to match backslashes in property paths. */\r\n  var reEscapeChar = /\\\\(\\\\)?/g;\r\n\r\n  /** Used to match `RegExp` flags from their coerced string values. */\r\n  var reFlags = /\\w*$/;\r\n\r\n  /** Used to detect bad signed hexadecimal string values. */\r\n  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;\r\n\r\n  /** Used to detect binary string values. */\r\n  var reIsBinary = /^0b[01]+$/i;\r\n\r\n  /** Used to detect host constructors (Safari). */\r\n  var reIsHostCtor = /^\\[object .+?Constructor\\]$/;\r\n\r\n  /** Used to detect octal string values. */\r\n  var reIsOctal = /^0o[0-7]+$/i;\r\n\r\n  /** Used to detect unsigned integer values. */\r\n  var reIsUint = /^(?:0|[1-9]\\d*)$/;\r\n\r\n  /** Used to compose unicode character classes. */\r\n  var rsAstralRange = '\\\\ud800-\\\\udfff',\r\n      rsComboMarksRange = '\\\\u0300-\\\\u036f',\r\n      reComboHalfMarksRange = '\\\\ufe20-\\\\ufe2f',\r\n      rsComboSymbolsRange = '\\\\u20d0-\\\\u20ff',\r\n      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,\r\n      rsVarRange = '\\\\ufe0e\\\\ufe0f';\r\n\r\n  /** Used to compose unicode capture groups. */\r\n  var rsAstral = '[' + rsAstralRange + ']',\r\n      rsCombo = '[' + rsComboRange + ']',\r\n      rsFitz = '\\\\ud83c[\\\\udffb-\\\\udfff]',\r\n      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',\r\n      rsNonAstral = '[^' + rsAstralRange + ']',\r\n      rsRegional = '(?:\\\\ud83c[\\\\udde6-\\\\uddff]){2}',\r\n      rsSurrPair = '[\\\\ud800-\\\\udbff][\\\\udc00-\\\\udfff]',\r\n      rsZWJ = '\\\\u200d';\r\n\r\n  /** Used to compose unicode regexes. */\r\n  var reOptMod = rsModifier + '?',\r\n      rsOptVar = '[' + rsVarRange + ']?',\r\n      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',\r\n      rsSeq = rsOptVar + reOptMod + rsOptJoin,\r\n      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';\r\n\r\n  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */\r\n  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');\r\n\r\n  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */\r\n  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');\r\n\r\n  /** Used to identify `toStringTag` values of typed arrays. */\r\n  var typedArrayTags = {};\r\n  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =\r\n  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =\r\n  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =\r\n  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =\r\n  typedArrayTags[uint32Tag] = true;\r\n  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =\r\n  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =\r\n  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =\r\n  typedArrayTags[errorTag] = typedArrayTags[funcTag] =\r\n  typedArrayTags[mapTag] = typedArrayTags[numberTag] =\r\n  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =\r\n  typedArrayTags[setTag] = typedArrayTags[stringTag] =\r\n  typedArrayTags[weakMapTag] = false;\r\n\r\n  /** Used to identify `toStringTag` values supported by `_.clone`. */\r\n  var cloneableTags = {};\r\n  cloneableTags[argsTag] = cloneableTags[arrayTag] =\r\n  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =\r\n  cloneableTags[boolTag] = cloneableTags[dateTag] =\r\n  cloneableTags[float32Tag] = cloneableTags[float64Tag] =\r\n  cloneableTags[int8Tag] = cloneableTags[int16Tag] =\r\n  cloneableTags[int32Tag] = cloneableTags[mapTag] =\r\n  cloneableTags[numberTag] = cloneableTags[objectTag] =\r\n  cloneableTags[regexpTag] = cloneableTags[setTag] =\r\n  cloneableTags[stringTag] = cloneableTags[symbolTag] =\r\n  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =\r\n  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;\r\n  cloneableTags[errorTag] = cloneableTags[funcTag] =\r\n  cloneableTags[weakMapTag] = false;\r\n\r\n  /** Used to map characters to HTML entities. */\r\n  var htmlEscapes = {\r\n    '&': '&amp;',\r\n    '<': '&lt;',\r\n    '>': '&gt;',\r\n    '\"': '&quot;',\r\n    \"'\": '&#39;'\r\n  };\r\n\r\n  /** Used to map HTML entities to characters. */\r\n  var htmlUnescapes = {\r\n    '&amp;': '&',\r\n    '&lt;': '<',\r\n    '&gt;': '>',\r\n    '&quot;': '\"',\r\n    '&#39;': \"'\"\r\n  };\r\n\r\n  /** Built-in method references without a dependency on `root`. */\r\n  var freeParseFloat = parseFloat,\r\n      freeParseInt = parseInt;\r\n\r\n  /** Detect free variable `global` from Node.js. */\r\n  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;\r\n\r\n  /** Detect free variable `self`. */\r\n  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;\r\n\r\n  /** Used as a reference to the global object. */\r\n  var root = freeGlobal || freeSelf || Function('return this')();\r\n\r\n  /** Detect free variable `exports`. */\r\n  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;\r\n\r\n  /** Detect free variable `module`. */\r\n  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;\r\n\r\n  /** Detect the popular CommonJS extension `module.exports`. */\r\n  var moduleExports = freeModule && freeModule.exports === freeExports;\r\n\r\n  /** Detect free variable `process` from Node.js. */\r\n  var freeProcess = moduleExports && freeGlobal.process;\r\n\r\n  /** Used to access faster Node.js helpers. */\r\n  var nodeUtil = (function() {\r\n    try {\r\n      return freeProcess && freeProcess.binding && freeProcess.binding('util');\r\n    } catch (e) {}\r\n  }());\r\n\r\n  /* Node.js helper references. */\r\n  var nodeIsDate = nodeUtil && nodeUtil.isDate,\r\n      nodeIsMap = nodeUtil && nodeUtil.isMap,\r\n      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,\r\n      nodeIsSet = nodeUtil && nodeUtil.isSet,\r\n      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;\r\n\r\n  /*--------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * A faster alternative to `Function#apply`, this function invokes `func`\r\n   * with the `this` binding of `thisArg` and the arguments of `args`.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to invoke.\r\n   * @param {*} thisArg The `this` binding of `func`.\r\n   * @param {Array} args The arguments to invoke `func` with.\r\n   * @returns {*} Returns the result of `func`.\r\n   */\r\n  function apply(func, thisArg, args) {\r\n    switch (args.length) {\r\n      case 0: return func.call(thisArg);\r\n      case 1: return func.call(thisArg, args[0]);\r\n      case 2: return func.call(thisArg, args[0], args[1]);\r\n      case 3: return func.call(thisArg, args[0], args[1], args[2]);\r\n    }\r\n    return func.apply(thisArg, args);\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseAggregator` for arrays.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to iterate over.\r\n   * @param {Function} setter The function to set `accumulator` values.\r\n   * @param {Function} iteratee The iteratee to transform keys.\r\n   * @param {Object} accumulator The initial aggregated object.\r\n   * @returns {Function} Returns `accumulator`.\r\n   */\r\n  function arrayAggregator(array, setter, iteratee, accumulator) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length;\r\n\r\n    while (++index < length) {\r\n      var value = array[index];\r\n      setter(accumulator, value, iteratee(value), array);\r\n    }\r\n    return accumulator;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.forEach` for arrays without support for\r\n   * iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @returns {Array} Returns `array`.\r\n   */\r\n  function arrayEach(array, iteratee) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length;\r\n\r\n    while (++index < length) {\r\n      if (iteratee(array[index], index, array) === false) {\r\n        break;\r\n      }\r\n    }\r\n    return array;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.every` for arrays without support for\r\n   * iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to iterate over.\r\n   * @param {Function} predicate The function invoked per iteration.\r\n   * @returns {boolean} Returns `true` if all elements pass the predicate check,\r\n   *  else `false`.\r\n   */\r\n  function arrayEvery(array, predicate) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length;\r\n\r\n    while (++index < length) {\r\n      if (!predicate(array[index], index, array)) {\r\n        return false;\r\n      }\r\n    }\r\n    return true;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.filter` for arrays without support for\r\n   * iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to iterate over.\r\n   * @param {Function} predicate The function invoked per iteration.\r\n   * @returns {Array} Returns the new filtered array.\r\n   */\r\n  function arrayFilter(array, predicate) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length,\r\n        resIndex = 0,\r\n        result = [];\r\n\r\n    while (++index < length) {\r\n      var value = array[index];\r\n      if (predicate(value, index, array)) {\r\n        result[resIndex++] = value;\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.includes` for arrays without support for\r\n   * specifying an index to search from.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to inspect.\r\n   * @param {*} target The value to search for.\r\n   * @returns {boolean} Returns `true` if `target` is found, else `false`.\r\n   */\r\n  function arrayIncludes(array, value) {\r\n    var length = array == null ? 0 : array.length;\r\n    return !!length && baseIndexOf(array, value, 0) > -1;\r\n  }\r\n\r\n  /**\r\n   * This function is like `arrayIncludes` except that it accepts a comparator.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to inspect.\r\n   * @param {*} target The value to search for.\r\n   * @param {Function} comparator The comparator invoked per element.\r\n   * @returns {boolean} Returns `true` if `target` is found, else `false`.\r\n   */\r\n  function arrayIncludesWith(array, value, comparator) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length;\r\n\r\n    while (++index < length) {\r\n      if (comparator(value, array[index])) {\r\n        return true;\r\n      }\r\n    }\r\n    return false;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.map` for arrays without support for iteratee\r\n   * shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @returns {Array} Returns the new mapped array.\r\n   */\r\n  function arrayMap(array, iteratee) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length,\r\n        result = Array(length);\r\n\r\n    while (++index < length) {\r\n      result[index] = iteratee(array[index], index, array);\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Appends the elements of `values` to `array`.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to modify.\r\n   * @param {Array} values The values to append.\r\n   * @returns {Array} Returns `array`.\r\n   */\r\n  function arrayPush(array, values) {\r\n    var index = -1,\r\n        length = values.length,\r\n        offset = array.length;\r\n\r\n    while (++index < length) {\r\n      array[offset + index] = values[index];\r\n    }\r\n    return array;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.reduce` for arrays without support for\r\n   * iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @param {*} [accumulator] The initial value.\r\n   * @param {boolean} [initAccum] Specify using the first element of `array` as\r\n   *  the initial value.\r\n   * @returns {*} Returns the accumulated value.\r\n   */\r\n  function arrayReduce(array, iteratee, accumulator, initAccum) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length;\r\n\r\n    if (initAccum && length) {\r\n      accumulator = array[++index];\r\n    }\r\n    while (++index < length) {\r\n      accumulator = iteratee(accumulator, array[index], index, array);\r\n    }\r\n    return accumulator;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.some` for arrays without support for iteratee\r\n   * shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} [array] The array to iterate over.\r\n   * @param {Function} predicate The function invoked per iteration.\r\n   * @returns {boolean} Returns `true` if any element passes the predicate check,\r\n   *  else `false`.\r\n   */\r\n  function arraySome(array, predicate) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length;\r\n\r\n    while (++index < length) {\r\n      if (predicate(array[index], index, array)) {\r\n        return true;\r\n      }\r\n    }\r\n    return false;\r\n  }\r\n\r\n  /**\r\n   * Gets the size of an ASCII `string`.\r\n   *\r\n   * @private\r\n   * @param {string} string The string inspect.\r\n   * @returns {number} Returns the string size.\r\n   */\r\n  var asciiSize = baseProperty('length');\r\n\r\n  /**\r\n   * Converts an ASCII `string` to an array.\r\n   *\r\n   * @private\r\n   * @param {string} string The string to convert.\r\n   * @returns {Array} Returns the converted array.\r\n   */\r\n  function asciiToArray(string) {\r\n    return string.split('');\r\n  }\r\n\r\n  /**\r\n   * The base implementation of methods like `_.findKey` and `_.findLastKey`,\r\n   * without support for iteratee shorthands, which iterates over `collection`\r\n   * using `eachFunc`.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to inspect.\r\n   * @param {Function} predicate The function invoked per iteration.\r\n   * @param {Function} eachFunc The function to iterate over `collection`.\r\n   * @returns {*} Returns the found element or its key, else `undefined`.\r\n   */\r\n  function baseFindKey(collection, predicate, eachFunc) {\r\n    var result;\r\n    eachFunc(collection, function(value, key, collection) {\r\n      if (predicate(value, key, collection)) {\r\n        result = key;\r\n        return false;\r\n      }\r\n    });\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.findIndex` and `_.findLastIndex` without\r\n   * support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to inspect.\r\n   * @param {Function} predicate The function invoked per iteration.\r\n   * @param {number} fromIndex The index to search from.\r\n   * @param {boolean} [fromRight] Specify iterating from right to left.\r\n   * @returns {number} Returns the index of the matched value, else `-1`.\r\n   */\r\n  function baseFindIndex(array, predicate, fromIndex, fromRight) {\r\n    var length = array.length,\r\n        index = fromIndex + (fromRight ? 1 : -1);\r\n\r\n    while ((fromRight ? index-- : ++index < length)) {\r\n      if (predicate(array[index], index, array)) {\r\n        return index;\r\n      }\r\n    }\r\n    return -1;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to inspect.\r\n   * @param {*} value The value to search for.\r\n   * @param {number} fromIndex The index to search from.\r\n   * @returns {number} Returns the index of the matched value, else `-1`.\r\n   */\r\n  function baseIndexOf(array, value, fromIndex) {\r\n    return value === value\r\n      ? strictIndexOf(array, value, fromIndex)\r\n      : baseFindIndex(array, baseIsNaN, fromIndex);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isNaN` without support for number objects.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.\r\n   */\r\n  function baseIsNaN(value) {\r\n    return value !== value;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.property` without support for deep paths.\r\n   *\r\n   * @private\r\n   * @param {string} key The key of the property to get.\r\n   * @returns {Function} Returns the new accessor function.\r\n   */\r\n  function baseProperty(key) {\r\n    return function(object) {\r\n      return object == null ? undefined : object[key];\r\n    };\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.propertyOf` without support for deep paths.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Function} Returns the new accessor function.\r\n   */\r\n  function basePropertyOf(object) {\r\n    return function(key) {\r\n      return object == null ? undefined : object[key];\r\n    };\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.reduce` and `_.reduceRight`, without support\r\n   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @param {*} accumulator The initial value.\r\n   * @param {boolean} initAccum Specify using the first or last element of\r\n   *  `collection` as the initial value.\r\n   * @param {Function} eachFunc The function to iterate over `collection`.\r\n   * @returns {*} Returns the accumulated value.\r\n   */\r\n  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {\r\n    eachFunc(collection, function(value, index, collection) {\r\n      accumulator = initAccum\r\n        ? (initAccum = false, value)\r\n        : iteratee(accumulator, value, index, collection);\r\n    });\r\n    return accumulator;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.sortBy` which uses `comparer` to define the\r\n   * sort order of `array` and replaces criteria objects with their corresponding\r\n   * values.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to sort.\r\n   * @param {Function} comparer The function to define sort order.\r\n   * @returns {Array} Returns `array`.\r\n   */\r\n  function baseSortBy(array, comparer) {\r\n    var length = array.length;\r\n\r\n    array.sort(comparer);\r\n    while (length--) {\r\n      array[length] = array[length].value;\r\n    }\r\n    return array;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.times` without support for iteratee shorthands\r\n   * or max array length checks.\r\n   *\r\n   * @private\r\n   * @param {number} n The number of times to invoke `iteratee`.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @returns {Array} Returns the array of results.\r\n   */\r\n  function baseTimes(n, iteratee) {\r\n    var index = -1,\r\n        result = Array(n);\r\n\r\n    while (++index < n) {\r\n      result[index] = iteratee(index);\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.unary` without support for storing metadata.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to cap arguments for.\r\n   * @returns {Function} Returns the new capped function.\r\n   */\r\n  function baseUnary(func) {\r\n    return function(value) {\r\n      return func(value);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.values` and `_.valuesIn` which creates an\r\n   * array of `object` property values corresponding to the property names\r\n   * of `props`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @param {Array} props The property names to get values for.\r\n   * @returns {Object} Returns the array of property values.\r\n   */\r\n  function baseValues(object, props) {\r\n    return arrayMap(props, function(key) {\r\n      return object[key];\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Checks if a `cache` value for `key` exists.\r\n   *\r\n   * @private\r\n   * @param {Object} cache The cache to query.\r\n   * @param {string} key The key of the entry to check.\r\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\r\n   */\r\n  function cacheHas(cache, key) {\r\n    return cache.has(key);\r\n  }\r\n\r\n  /**\r\n   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol\r\n   * that is not found in the character symbols.\r\n   *\r\n   * @private\r\n   * @param {Array} strSymbols The string symbols to inspect.\r\n   * @param {Array} chrSymbols The character symbols to find.\r\n   * @returns {number} Returns the index of the first unmatched string symbol.\r\n   */\r\n  function charsStartIndex(strSymbols, chrSymbols) {\r\n    var index = -1,\r\n        length = strSymbols.length;\r\n\r\n    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}\r\n    return index;\r\n  }\r\n\r\n  /**\r\n   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol\r\n   * that is not found in the character symbols.\r\n   *\r\n   * @private\r\n   * @param {Array} strSymbols The string symbols to inspect.\r\n   * @param {Array} chrSymbols The character symbols to find.\r\n   * @returns {number} Returns the index of the last unmatched string symbol.\r\n   */\r\n  function charsEndIndex(strSymbols, chrSymbols) {\r\n    var index = strSymbols.length;\r\n\r\n    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}\r\n    return index;\r\n  }\r\n\r\n  /**\r\n   * Gets the number of `placeholder` occurrences in `array`.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to inspect.\r\n   * @param {*} placeholder The placeholder to search for.\r\n   * @returns {number} Returns the placeholder count.\r\n   */\r\n  function countHolders(array, placeholder) {\r\n    var length = array.length,\r\n        result = 0;\r\n\r\n    while (length--) {\r\n      if (array[length] === placeholder) {\r\n        ++result;\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Used by `_.escape` to convert characters to HTML entities.\r\n   *\r\n   * @private\r\n   * @param {string} chr The matched character to escape.\r\n   * @returns {string} Returns the escaped character.\r\n   */\r\n  var escapeHtmlChar = basePropertyOf(htmlEscapes);\r\n\r\n  /**\r\n   * Gets the value at `key` of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} [object] The object to query.\r\n   * @param {string} key The key of the property to get.\r\n   * @returns {*} Returns the property value.\r\n   */\r\n  function getValue(object, key) {\r\n    return object == null ? undefined : object[key];\r\n  }\r\n\r\n  /**\r\n   * Checks if `string` contains Unicode symbols.\r\n   *\r\n   * @private\r\n   * @param {string} string The string to inspect.\r\n   * @returns {boolean} Returns `true` if a symbol is found, else `false`.\r\n   */\r\n  function hasUnicode(string) {\r\n    return reHasUnicode.test(string);\r\n  }\r\n\r\n  /**\r\n   * Converts `iterator` to an array.\r\n   *\r\n   * @private\r\n   * @param {Object} iterator The iterator to convert.\r\n   * @returns {Array} Returns the converted array.\r\n   */\r\n  function iteratorToArray(iterator) {\r\n    var data,\r\n        result = [];\r\n\r\n    while (!(data = iterator.next()).done) {\r\n      result.push(data.value);\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Converts `map` to its key-value pairs.\r\n   *\r\n   * @private\r\n   * @param {Object} map The map to convert.\r\n   * @returns {Array} Returns the key-value pairs.\r\n   */\r\n  function mapToArray(map) {\r\n    var index = -1,\r\n        result = Array(map.size);\r\n\r\n    map.forEach(function(value, key) {\r\n      result[++index] = [key, value];\r\n    });\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Creates a unary function that invokes `func` with its argument transformed.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to wrap.\r\n   * @param {Function} transform The argument transform.\r\n   * @returns {Function} Returns the new function.\r\n   */\r\n  function overArg(func, transform) {\r\n    return function(arg) {\r\n      return func(transform(arg));\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Replaces all `placeholder` elements in `array` with an internal placeholder\r\n   * and returns an array of their indexes.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to modify.\r\n   * @param {*} placeholder The placeholder to replace.\r\n   * @returns {Array} Returns the new array of placeholder indexes.\r\n   */\r\n  function replaceHolders(array, placeholder) {\r\n    var index = -1,\r\n        length = array.length,\r\n        resIndex = 0,\r\n        result = [];\r\n\r\n    while (++index < length) {\r\n      var value = array[index];\r\n      if (value === placeholder || value === PLACEHOLDER) {\r\n        array[index] = PLACEHOLDER;\r\n        result[resIndex++] = index;\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Gets the value at `key`, unless `key` is \"__proto__\".\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @param {string} key The key of the property to get.\r\n   * @returns {*} Returns the property value.\r\n   */\r\n  function safeGet(object, key) {\r\n    return key == '__proto__'\r\n      ? undefined\r\n      : object[key];\r\n  }\r\n\r\n  /**\r\n   * Converts `set` to an array of its values.\r\n   *\r\n   * @private\r\n   * @param {Object} set The set to convert.\r\n   * @returns {Array} Returns the values.\r\n   */\r\n  function setToArray(set) {\r\n    var index = -1,\r\n        result = Array(set.size);\r\n\r\n    set.forEach(function(value) {\r\n      result[++index] = value;\r\n    });\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.indexOf` which performs strict equality\r\n   * comparisons of values, i.e. `===`.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to inspect.\r\n   * @param {*} value The value to search for.\r\n   * @param {number} fromIndex The index to search from.\r\n   * @returns {number} Returns the index of the matched value, else `-1`.\r\n   */\r\n  function strictIndexOf(array, value, fromIndex) {\r\n    var index = fromIndex - 1,\r\n        length = array.length;\r\n\r\n    while (++index < length) {\r\n      if (array[index] === value) {\r\n        return index;\r\n      }\r\n    }\r\n    return -1;\r\n  }\r\n\r\n  /**\r\n   * Gets the number of symbols in `string`.\r\n   *\r\n   * @private\r\n   * @param {string} string The string to inspect.\r\n   * @returns {number} Returns the string size.\r\n   */\r\n  function stringSize(string) {\r\n    return hasUnicode(string)\r\n      ? unicodeSize(string)\r\n      : asciiSize(string);\r\n  }\r\n\r\n  /**\r\n   * Converts `string` to an array.\r\n   *\r\n   * @private\r\n   * @param {string} string The string to convert.\r\n   * @returns {Array} Returns the converted array.\r\n   */\r\n  function stringToArray(string) {\r\n    return hasUnicode(string)\r\n      ? unicodeToArray(string)\r\n      : asciiToArray(string);\r\n  }\r\n\r\n  /**\r\n   * Used by `_.unescape` to convert HTML entities to characters.\r\n   *\r\n   * @private\r\n   * @param {string} chr The matched character to unescape.\r\n   * @returns {string} Returns the unescaped character.\r\n   */\r\n  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);\r\n\r\n  /**\r\n   * Gets the size of a Unicode `string`.\r\n   *\r\n   * @private\r\n   * @param {string} string The string inspect.\r\n   * @returns {number} Returns the string size.\r\n   */\r\n  function unicodeSize(string) {\r\n    var result = reUnicode.lastIndex = 0;\r\n    while (reUnicode.test(string)) {\r\n      ++result;\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Converts a Unicode `string` to an array.\r\n   *\r\n   * @private\r\n   * @param {string} string The string to convert.\r\n   * @returns {Array} Returns the converted array.\r\n   */\r\n  function unicodeToArray(string) {\r\n    return string.match(reUnicode) || [];\r\n  }\r\n\r\n  /*--------------------------------------------------------------------------*/\r\n\r\n  /** Used for built-in method references. */\r\n  var arrayProto = Array.prototype,\r\n      funcProto = Function.prototype,\r\n      objectProto = Object.prototype;\r\n\r\n  /** Used to detect overreaching core-js shims. */\r\n  var coreJsData = root['__core-js_shared__'];\r\n\r\n  /** Used to resolve the decompiled source of functions. */\r\n  var funcToString = funcProto.toString;\r\n\r\n  /** Used to check objects for own properties. */\r\n  var hasOwnProperty = objectProto.hasOwnProperty;\r\n\r\n  /** Used to generate unique IDs. */\r\n  var idCounter = 0;\r\n\r\n  /** Used to detect methods masquerading as native. */\r\n  var maskSrcKey = (function() {\r\n    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');\r\n    return uid ? ('Symbol(src)_1.' + uid) : '';\r\n  }());\r\n\r\n  /**\r\n   * Used to resolve the\r\n   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)\r\n   * of values.\r\n   */\r\n  var nativeObjectToString = objectProto.toString;\r\n\r\n  /** Used to infer the `Object` constructor. */\r\n  var objectCtorString = funcToString.call(Object);\r\n\r\n  /** Used to restore the original `_` reference in `_.noConflict`. */\r\n  var oldDash = root._;\r\n\r\n  /** Used to detect if a method is native. */\r\n  var reIsNative = RegExp('^' +\r\n    funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\\\$&')\r\n    .replace(/hasOwnProperty|(function).*?(?=\\\\\\()| for .+?(?=\\\\\\])/g, '$1.*?') + '$'\r\n  );\r\n\r\n  /** Built-in value references. */\r\n  var Buffer = moduleExports ? root.Buffer : undefined,\r\n      Symbol = root.Symbol,\r\n      Uint8Array = root.Uint8Array,\r\n      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,\r\n      getPrototype = overArg(Object.getPrototypeOf, Object),\r\n      objectCreate = Object.create,\r\n      propertyIsEnumerable = objectProto.propertyIsEnumerable,\r\n      splice = arrayProto.splice,\r\n      spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,\r\n      symIterator = Symbol ? Symbol.iterator : undefined,\r\n      symToStringTag = Symbol ? Symbol.toStringTag : undefined;\r\n\r\n  var defineProperty = (function() {\r\n    try {\r\n      var func = getNative(Object, 'defineProperty');\r\n      func({}, '', {});\r\n      return func;\r\n    } catch (e) {}\r\n  }());\r\n\r\n  /* Built-in method references for those with the same name as other `lodash` methods. */\r\n  var nativeCeil = Math.ceil,\r\n      nativeFloor = Math.floor,\r\n      nativeGetSymbols = Object.getOwnPropertySymbols,\r\n      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,\r\n      nativeIsFinite = root.isFinite,\r\n      nativeKeys = overArg(Object.keys, Object),\r\n      nativeMax = Math.max,\r\n      nativeMin = Math.min,\r\n      nativeNow = Date.now,\r\n      nativeRandom = Math.random,\r\n      nativeReverse = arrayProto.reverse;\r\n\r\n  /* Built-in method references that are verified to be native. */\r\n  var DataView = getNative(root, 'DataView'),\r\n      Map = getNative(root, 'Map'),\r\n      Promise = getNative(root, 'Promise'),\r\n      Set = getNative(root, 'Set'),\r\n      WeakMap = getNative(root, 'WeakMap'),\r\n      nativeCreate = getNative(Object, 'create');\r\n\r\n  /** Used to store function metadata. */\r\n  var metaMap = WeakMap && new WeakMap;\r\n\r\n  /** Used to lookup unminified function names. */\r\n  var realNames = {};\r\n\r\n  /** Used to detect maps, sets, and weakmaps. */\r\n  var dataViewCtorString = toSource(DataView),\r\n      mapCtorString = toSource(Map),\r\n      promiseCtorString = toSource(Promise),\r\n      setCtorString = toSource(Set),\r\n      weakMapCtorString = toSource(WeakMap);\r\n\r\n  /** Used to convert symbols to primitives and strings. */\r\n  var symbolProto = Symbol ? Symbol.prototype : undefined,\r\n      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,\r\n      symbolToString = symbolProto ? symbolProto.toString : undefined;\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates a `lodash` object which wraps `value` to enable implicit method\r\n   * chain sequences. Methods that operate on and return arrays, collections,\r\n   * and functions can be chained together. Methods that retrieve a single value\r\n   * or may return a primitive value will automatically end the chain sequence\r\n   * and return the unwrapped value. Otherwise, the value must be unwrapped\r\n   * with `_#value`.\r\n   *\r\n   * Explicit chain sequences, which must be unwrapped with `_#value`, may be\r\n   * enabled using `_.chain`.\r\n   *\r\n   * The execution of chained methods is lazy, that is, it's deferred until\r\n   * `_#value` is implicitly or explicitly called.\r\n   *\r\n   * Lazy evaluation allows several methods to support shortcut fusion.\r\n   * Shortcut fusion is an optimization to merge iteratee calls; this avoids\r\n   * the creation of intermediate arrays and can greatly reduce the number of\r\n   * iteratee executions. Sections of a chain sequence qualify for shortcut\r\n   * fusion if the section is applied to an array and iteratees accept only\r\n   * one argument. The heuristic for whether a section qualifies for shortcut\r\n   * fusion is subject to change.\r\n   *\r\n   * Chaining is supported in custom builds as long as the `_#value` method is\r\n   * directly or indirectly included in the build.\r\n   *\r\n   * In addition to lodash methods, wrappers have `Array` and `String` methods.\r\n   *\r\n   * The wrapper `Array` methods are:\r\n   * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`\r\n   *\r\n   * The wrapper `String` methods are:\r\n   * `replace` and `split`\r\n   *\r\n   * The wrapper methods that support shortcut fusion are:\r\n   * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,\r\n   * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,\r\n   * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`\r\n   *\r\n   * The chainable wrapper methods are:\r\n   * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,\r\n   * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,\r\n   * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,\r\n   * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,\r\n   * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,\r\n   * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,\r\n   * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,\r\n   * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,\r\n   * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,\r\n   * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,\r\n   * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,\r\n   * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,\r\n   * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,\r\n   * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,\r\n   * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,\r\n   * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,\r\n   * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,\r\n   * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,\r\n   * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,\r\n   * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,\r\n   * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,\r\n   * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,\r\n   * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,\r\n   * `zipObject`, `zipObjectDeep`, and `zipWith`\r\n   *\r\n   * The wrapper methods that are **not** chainable by default are:\r\n   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,\r\n   * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,\r\n   * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,\r\n   * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,\r\n   * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,\r\n   * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,\r\n   * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,\r\n   * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,\r\n   * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,\r\n   * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,\r\n   * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,\r\n   * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,\r\n   * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,\r\n   * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,\r\n   * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,\r\n   * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,\r\n   * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,\r\n   * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,\r\n   * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,\r\n   * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,\r\n   * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,\r\n   * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,\r\n   * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,\r\n   * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,\r\n   * `upperFirst`, `value`, and `words`\r\n   *\r\n   * @name _\r\n   * @constructor\r\n   * @category Seq\r\n   * @param {*} value The value to wrap in a `lodash` instance.\r\n   * @returns {Object} Returns the new `lodash` wrapper instance.\r\n   * @example\r\n   *\r\n   * function square(n) {\r\n   *   return n * n;\r\n   * }\r\n   *\r\n   * var wrapped = _([1, 2, 3]);\r\n   *\r\n   * // Returns an unwrapped value.\r\n   * wrapped.reduce(_.add);\r\n   * // => 6\r\n   *\r\n   * // Returns a wrapped value.\r\n   * var squares = wrapped.map(square);\r\n   *\r\n   * _.isArray(squares);\r\n   * // => false\r\n   *\r\n   * _.isArray(squares.value());\r\n   * // => true\r\n   */\r\n  function lodash(value) {\r\n    if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {\r\n      if (value instanceof LodashWrapper) {\r\n        return value;\r\n      }\r\n      if (hasOwnProperty.call(value, '__wrapped__')) {\r\n        return wrapperClone(value);\r\n      }\r\n    }\r\n    return new LodashWrapper(value);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.create` without support for assigning\r\n   * properties to the created object.\r\n   *\r\n   * @private\r\n   * @param {Object} proto The object to inherit from.\r\n   * @returns {Object} Returns the new object.\r\n   */\r\n  var baseCreate = (function() {\r\n    function object() {}\r\n    return function(proto) {\r\n      if (!isObject(proto)) {\r\n        return {};\r\n      }\r\n      if (objectCreate) {\r\n        return objectCreate(proto);\r\n      }\r\n      object.prototype = proto;\r\n      var result = new object;\r\n      object.prototype = undefined;\r\n      return result;\r\n    };\r\n  }());\r\n\r\n  /**\r\n   * The function whose prototype chain sequence wrappers inherit from.\r\n   *\r\n   * @private\r\n   */\r\n  function baseLodash() {\r\n    // No operation performed.\r\n  }\r\n\r\n  /**\r\n   * The base constructor for creating `lodash` wrapper objects.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to wrap.\r\n   * @param {boolean} [chainAll] Enable explicit method chain sequences.\r\n   */\r\n  function LodashWrapper(value, chainAll) {\r\n    this.__wrapped__ = value;\r\n    this.__actions__ = [];\r\n    this.__chain__ = !!chainAll;\r\n    this.__index__ = 0;\r\n    this.__values__ = undefined;\r\n  }\r\n\r\n  // Ensure wrappers are instances of `baseLodash`.\r\n  lodash.prototype = baseLodash.prototype;\r\n  lodash.prototype.constructor = lodash;\r\n\r\n  LodashWrapper.prototype = baseCreate(baseLodash.prototype);\r\n  LodashWrapper.prototype.constructor = LodashWrapper;\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.\r\n   *\r\n   * @private\r\n   * @constructor\r\n   * @param {*} value The value to wrap.\r\n   */\r\n  function LazyWrapper(value) {\r\n    this.__wrapped__ = value;\r\n    this.__actions__ = [];\r\n    this.__dir__ = 1;\r\n    this.__filtered__ = false;\r\n    this.__iteratees__ = [];\r\n    this.__takeCount__ = MAX_ARRAY_LENGTH;\r\n    this.__views__ = [];\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of the lazy wrapper object.\r\n   *\r\n   * @private\r\n   * @name clone\r\n   * @memberOf LazyWrapper\r\n   * @returns {Object} Returns the cloned `LazyWrapper` object.\r\n   */\r\n  function lazyClone() {\r\n    var result = new LazyWrapper(this.__wrapped__);\r\n    result.__actions__ = copyArray(this.__actions__);\r\n    result.__dir__ = this.__dir__;\r\n    result.__filtered__ = this.__filtered__;\r\n    result.__iteratees__ = copyArray(this.__iteratees__);\r\n    result.__takeCount__ = this.__takeCount__;\r\n    result.__views__ = copyArray(this.__views__);\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Reverses the direction of lazy iteration.\r\n   *\r\n   * @private\r\n   * @name reverse\r\n   * @memberOf LazyWrapper\r\n   * @returns {Object} Returns the new reversed `LazyWrapper` object.\r\n   */\r\n  function lazyReverse() {\r\n    if (this.__filtered__) {\r\n      var result = new LazyWrapper(this);\r\n      result.__dir__ = -1;\r\n      result.__filtered__ = true;\r\n    } else {\r\n      result = this.clone();\r\n      result.__dir__ *= -1;\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Extracts the unwrapped value from its lazy wrapper.\r\n   *\r\n   * @private\r\n   * @name value\r\n   * @memberOf LazyWrapper\r\n   * @returns {*} Returns the unwrapped value.\r\n   */\r\n  function lazyValue() {\r\n    var array = this.__wrapped__.value(),\r\n        dir = this.__dir__,\r\n        isArr = isArray(array),\r\n        isRight = dir < 0,\r\n        arrLength = isArr ? array.length : 0,\r\n        view = getView(0, arrLength, this.__views__),\r\n        start = view.start,\r\n        end = view.end,\r\n        length = end - start,\r\n        index = isRight ? end : (start - 1),\r\n        iteratees = this.__iteratees__,\r\n        iterLength = iteratees.length,\r\n        resIndex = 0,\r\n        takeCount = nativeMin(length, this.__takeCount__);\r\n\r\n    if (!isArr || (!isRight && arrLength == length && takeCount == length)) {\r\n      return baseWrapperValue(array, this.__actions__);\r\n    }\r\n    var result = [];\r\n\r\n    outer:\r\n    while (length-- && resIndex < takeCount) {\r\n      index += dir;\r\n\r\n      var iterIndex = -1,\r\n          value = array[index];\r\n\r\n      while (++iterIndex < iterLength) {\r\n        var data = iteratees[iterIndex],\r\n            iteratee = data.iteratee,\r\n            type = data.type,\r\n            computed = iteratee(value);\r\n\r\n        if (type == LAZY_MAP_FLAG) {\r\n          value = computed;\r\n        } else if (!computed) {\r\n          if (type == LAZY_FILTER_FLAG) {\r\n            continue outer;\r\n          } else {\r\n            break outer;\r\n          }\r\n        }\r\n      }\r\n      result[resIndex++] = value;\r\n    }\r\n    return result;\r\n  }\r\n\r\n  // Ensure `LazyWrapper` is an instance of `baseLodash`.\r\n  LazyWrapper.prototype = baseCreate(baseLodash.prototype);\r\n  LazyWrapper.prototype.constructor = LazyWrapper;\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates a hash object.\r\n   *\r\n   * @private\r\n   * @constructor\r\n   * @param {Array} [entries] The key-value pairs to cache.\r\n   */\r\n  function Hash(entries) {\r\n    var index = -1,\r\n        length = entries == null ? 0 : entries.length;\r\n\r\n    this.clear();\r\n    while (++index < length) {\r\n      var entry = entries[index];\r\n      this.set(entry[0], entry[1]);\r\n    }\r\n  }\r\n\r\n  /**\r\n   * Removes all key-value entries from the hash.\r\n   *\r\n   * @private\r\n   * @name clear\r\n   * @memberOf Hash\r\n   */\r\n  function hashClear() {\r\n    this.__data__ = nativeCreate ? nativeCreate(null) : {};\r\n    this.size = 0;\r\n  }\r\n\r\n  /**\r\n   * Removes `key` and its value from the hash.\r\n   *\r\n   * @private\r\n   * @name delete\r\n   * @memberOf Hash\r\n   * @param {Object} hash The hash to modify.\r\n   * @param {string} key The key of the value to remove.\r\n   * @returns {boolean} Returns `true` if the entry was removed, else `false`.\r\n   */\r\n  function hashDelete(key) {\r\n    var result = this.has(key) && delete this.__data__[key];\r\n    this.size -= result ? 1 : 0;\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Gets the hash value for `key`.\r\n   *\r\n   * @private\r\n   * @name get\r\n   * @memberOf Hash\r\n   * @param {string} key The key of the value to get.\r\n   * @returns {*} Returns the entry value.\r\n   */\r\n  function hashGet(key) {\r\n    var data = this.__data__;\r\n    if (nativeCreate) {\r\n      var result = data[key];\r\n      return result === HASH_UNDEFINED ? undefined : result;\r\n    }\r\n    return hasOwnProperty.call(data, key) ? data[key] : undefined;\r\n  }\r\n\r\n  /**\r\n   * Checks if a hash value for `key` exists.\r\n   *\r\n   * @private\r\n   * @name has\r\n   * @memberOf Hash\r\n   * @param {string} key The key of the entry to check.\r\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\r\n   */\r\n  function hashHas(key) {\r\n    var data = this.__data__;\r\n    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);\r\n  }\r\n\r\n  /**\r\n   * Sets the hash `key` to `value`.\r\n   *\r\n   * @private\r\n   * @name set\r\n   * @memberOf Hash\r\n   * @param {string} key The key of the value to set.\r\n   * @param {*} value The value to set.\r\n   * @returns {Object} Returns the hash instance.\r\n   */\r\n  function hashSet(key, value) {\r\n    var data = this.__data__;\r\n    this.size += this.has(key) ? 0 : 1;\r\n    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;\r\n    return this;\r\n  }\r\n\r\n  // Add methods to `Hash`.\r\n  Hash.prototype.clear = hashClear;\r\n  Hash.prototype['delete'] = hashDelete;\r\n  Hash.prototype.get = hashGet;\r\n  Hash.prototype.has = hashHas;\r\n  Hash.prototype.set = hashSet;\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates an list cache object.\r\n   *\r\n   * @private\r\n   * @constructor\r\n   * @param {Array} [entries] The key-value pairs to cache.\r\n   */\r\n  function ListCache(entries) {\r\n    var index = -1,\r\n        length = entries == null ? 0 : entries.length;\r\n\r\n    this.clear();\r\n    while (++index < length) {\r\n      var entry = entries[index];\r\n      this.set(entry[0], entry[1]);\r\n    }\r\n  }\r\n\r\n  /**\r\n   * Removes all key-value entries from the list cache.\r\n   *\r\n   * @private\r\n   * @name clear\r\n   * @memberOf ListCache\r\n   */\r\n  function listCacheClear() {\r\n    this.__data__ = [];\r\n    this.size = 0;\r\n  }\r\n\r\n  /**\r\n   * Removes `key` and its value from the list cache.\r\n   *\r\n   * @private\r\n   * @name delete\r\n   * @memberOf ListCache\r\n   * @param {string} key The key of the value to remove.\r\n   * @returns {boolean} Returns `true` if the entry was removed, else `false`.\r\n   */\r\n  function listCacheDelete(key) {\r\n    var data = this.__data__,\r\n        index = assocIndexOf(data, key);\r\n\r\n    if (index < 0) {\r\n      return false;\r\n    }\r\n    var lastIndex = data.length - 1;\r\n    if (index == lastIndex) {\r\n      data.pop();\r\n    } else {\r\n      splice.call(data, index, 1);\r\n    }\r\n    --this.size;\r\n    return true;\r\n  }\r\n\r\n  /**\r\n   * Gets the list cache value for `key`.\r\n   *\r\n   * @private\r\n   * @name get\r\n   * @memberOf ListCache\r\n   * @param {string} key The key of the value to get.\r\n   * @returns {*} Returns the entry value.\r\n   */\r\n  function listCacheGet(key) {\r\n    var data = this.__data__,\r\n        index = assocIndexOf(data, key);\r\n\r\n    return index < 0 ? undefined : data[index][1];\r\n  }\r\n\r\n  /**\r\n   * Checks if a list cache value for `key` exists.\r\n   *\r\n   * @private\r\n   * @name has\r\n   * @memberOf ListCache\r\n   * @param {string} key The key of the entry to check.\r\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\r\n   */\r\n  function listCacheHas(key) {\r\n    return assocIndexOf(this.__data__, key) > -1;\r\n  }\r\n\r\n  /**\r\n   * Sets the list cache `key` to `value`.\r\n   *\r\n   * @private\r\n   * @name set\r\n   * @memberOf ListCache\r\n   * @param {string} key The key of the value to set.\r\n   * @param {*} value The value to set.\r\n   * @returns {Object} Returns the list cache instance.\r\n   */\r\n  function listCacheSet(key, value) {\r\n    var data = this.__data__,\r\n        index = assocIndexOf(data, key);\r\n\r\n    if (index < 0) {\r\n      ++this.size;\r\n      data.push([key, value]);\r\n    } else {\r\n      data[index][1] = value;\r\n    }\r\n    return this;\r\n  }\r\n\r\n  // Add methods to `ListCache`.\r\n  ListCache.prototype.clear = listCacheClear;\r\n  ListCache.prototype['delete'] = listCacheDelete;\r\n  ListCache.prototype.get = listCacheGet;\r\n  ListCache.prototype.has = listCacheHas;\r\n  ListCache.prototype.set = listCacheSet;\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates a map cache object to store key-value pairs.\r\n   *\r\n   * @private\r\n   * @constructor\r\n   * @param {Array} [entries] The key-value pairs to cache.\r\n   */\r\n  function MapCache(entries) {\r\n    var index = -1,\r\n        length = entries == null ? 0 : entries.length;\r\n\r\n    this.clear();\r\n    while (++index < length) {\r\n      var entry = entries[index];\r\n      this.set(entry[0], entry[1]);\r\n    }\r\n  }\r\n\r\n  /**\r\n   * Removes all key-value entries from the map.\r\n   *\r\n   * @private\r\n   * @name clear\r\n   * @memberOf MapCache\r\n   */\r\n  function mapCacheClear() {\r\n    this.size = 0;\r\n    this.__data__ = {\r\n      'hash': new Hash,\r\n      'map': new (Map || ListCache),\r\n      'string': new Hash\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Removes `key` and its value from the map.\r\n   *\r\n   * @private\r\n   * @name delete\r\n   * @memberOf MapCache\r\n   * @param {string} key The key of the value to remove.\r\n   * @returns {boolean} Returns `true` if the entry was removed, else `false`.\r\n   */\r\n  function mapCacheDelete(key) {\r\n    var result = getMapData(this, key)['delete'](key);\r\n    this.size -= result ? 1 : 0;\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Gets the map value for `key`.\r\n   *\r\n   * @private\r\n   * @name get\r\n   * @memberOf MapCache\r\n   * @param {string} key The key of the value to get.\r\n   * @returns {*} Returns the entry value.\r\n   */\r\n  function mapCacheGet(key) {\r\n    return getMapData(this, key).get(key);\r\n  }\r\n\r\n  /**\r\n   * Checks if a map value for `key` exists.\r\n   *\r\n   * @private\r\n   * @name has\r\n   * @memberOf MapCache\r\n   * @param {string} key The key of the entry to check.\r\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\r\n   */\r\n  function mapCacheHas(key) {\r\n    return getMapData(this, key).has(key);\r\n  }\r\n\r\n  /**\r\n   * Sets the map `key` to `value`.\r\n   *\r\n   * @private\r\n   * @name set\r\n   * @memberOf MapCache\r\n   * @param {string} key The key of the value to set.\r\n   * @param {*} value The value to set.\r\n   * @returns {Object} Returns the map cache instance.\r\n   */\r\n  function mapCacheSet(key, value) {\r\n    var data = getMapData(this, key),\r\n        size = data.size;\r\n\r\n    data.set(key, value);\r\n    this.size += data.size == size ? 0 : 1;\r\n    return this;\r\n  }\r\n\r\n  // Add methods to `MapCache`.\r\n  MapCache.prototype.clear = mapCacheClear;\r\n  MapCache.prototype['delete'] = mapCacheDelete;\r\n  MapCache.prototype.get = mapCacheGet;\r\n  MapCache.prototype.has = mapCacheHas;\r\n  MapCache.prototype.set = mapCacheSet;\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   *\r\n   * Creates an array cache object to store unique values.\r\n   *\r\n   * @private\r\n   * @constructor\r\n   * @param {Array} [values] The values to cache.\r\n   */\r\n  function SetCache(values) {\r\n    var index = -1,\r\n        length = values == null ? 0 : values.length;\r\n\r\n    this.__data__ = new MapCache;\r\n    while (++index < length) {\r\n      this.add(values[index]);\r\n    }\r\n  }\r\n\r\n  /**\r\n   * Adds `value` to the array cache.\r\n   *\r\n   * @private\r\n   * @name add\r\n   * @memberOf SetCache\r\n   * @alias push\r\n   * @param {*} value The value to cache.\r\n   * @returns {Object} Returns the cache instance.\r\n   */\r\n  function setCacheAdd(value) {\r\n    this.__data__.set(value, HASH_UNDEFINED);\r\n    return this;\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is in the array cache.\r\n   *\r\n   * @private\r\n   * @name has\r\n   * @memberOf SetCache\r\n   * @param {*} value The value to search for.\r\n   * @returns {number} Returns `true` if `value` is found, else `false`.\r\n   */\r\n  function setCacheHas(value) {\r\n    return this.__data__.has(value);\r\n  }\r\n\r\n  // Add methods to `SetCache`.\r\n  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;\r\n  SetCache.prototype.has = setCacheHas;\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates a stack cache object to store key-value pairs.\r\n   *\r\n   * @private\r\n   * @constructor\r\n   * @param {Array} [entries] The key-value pairs to cache.\r\n   */\r\n  function Stack(entries) {\r\n    var data = this.__data__ = new ListCache(entries);\r\n    this.size = data.size;\r\n  }\r\n\r\n  /**\r\n   * Removes all key-value entries from the stack.\r\n   *\r\n   * @private\r\n   * @name clear\r\n   * @memberOf Stack\r\n   */\r\n  function stackClear() {\r\n    this.__data__ = new ListCache;\r\n    this.size = 0;\r\n  }\r\n\r\n  /**\r\n   * Removes `key` and its value from the stack.\r\n   *\r\n   * @private\r\n   * @name delete\r\n   * @memberOf Stack\r\n   * @param {string} key The key of the value to remove.\r\n   * @returns {boolean} Returns `true` if the entry was removed, else `false`.\r\n   */\r\n  function stackDelete(key) {\r\n    var data = this.__data__,\r\n        result = data['delete'](key);\r\n\r\n    this.size = data.size;\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Gets the stack value for `key`.\r\n   *\r\n   * @private\r\n   * @name get\r\n   * @memberOf Stack\r\n   * @param {string} key The key of the value to get.\r\n   * @returns {*} Returns the entry value.\r\n   */\r\n  function stackGet(key) {\r\n    return this.__data__.get(key);\r\n  }\r\n\r\n  /**\r\n   * Checks if a stack value for `key` exists.\r\n   *\r\n   * @private\r\n   * @name has\r\n   * @memberOf Stack\r\n   * @param {string} key The key of the entry to check.\r\n   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\r\n   */\r\n  function stackHas(key) {\r\n    return this.__data__.has(key);\r\n  }\r\n\r\n  /**\r\n   * Sets the stack `key` to `value`.\r\n   *\r\n   * @private\r\n   * @name set\r\n   * @memberOf Stack\r\n   * @param {string} key The key of the value to set.\r\n   * @param {*} value The value to set.\r\n   * @returns {Object} Returns the stack cache instance.\r\n   */\r\n  function stackSet(key, value) {\r\n    var data = this.__data__;\r\n    if (data instanceof ListCache) {\r\n      var pairs = data.__data__;\r\n      if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {\r\n        pairs.push([key, value]);\r\n        this.size = ++data.size;\r\n        return this;\r\n      }\r\n      data = this.__data__ = new MapCache(pairs);\r\n    }\r\n    data.set(key, value);\r\n    this.size = data.size;\r\n    return this;\r\n  }\r\n\r\n  // Add methods to `Stack`.\r\n  Stack.prototype.clear = stackClear;\r\n  Stack.prototype['delete'] = stackDelete;\r\n  Stack.prototype.get = stackGet;\r\n  Stack.prototype.has = stackHas;\r\n  Stack.prototype.set = stackSet;\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates an array of the enumerable property names of the array-like `value`.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to query.\r\n   * @param {boolean} inherited Specify returning inherited property names.\r\n   * @returns {Array} Returns the array of property names.\r\n   */\r\n  function arrayLikeKeys(value, inherited) {\r\n    var isArr = isArray(value),\r\n        isArg = !isArr && isArguments(value),\r\n        isBuff = !isArr && !isArg && isBuffer(value),\r\n        isType = !isArr && !isArg && !isBuff && isTypedArray(value),\r\n        skipIndexes = isArr || isArg || isBuff || isType,\r\n        result = skipIndexes ? baseTimes(value.length, String) : [],\r\n        length = result.length;\r\n\r\n    for (var key in value) {\r\n      if ((inherited || hasOwnProperty.call(value, key)) &&\r\n          !(skipIndexes && (\r\n             // Safari 9 has enumerable `arguments.length` in strict mode.\r\n             key == 'length' ||\r\n             // Node.js 0.10 has enumerable non-index properties on buffers.\r\n             (isBuff && (key == 'offset' || key == 'parent')) ||\r\n             // PhantomJS 2 has enumerable non-index properties on typed arrays.\r\n             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||\r\n             // Skip index properties.\r\n             isIndex(key, length)\r\n          ))) {\r\n        result.push(key);\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * This function is like `assignValue` except that it doesn't assign\r\n   * `undefined` values.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to modify.\r\n   * @param {string} key The key of the property to assign.\r\n   * @param {*} value The value to assign.\r\n   */\r\n  function assignMergeValue(object, key, value) {\r\n    if ((value !== undefined && !eq(object[key], value)) ||\r\n        (value === undefined && !(key in object))) {\r\n      baseAssignValue(object, key, value);\r\n    }\r\n  }\r\n\r\n  /**\r\n   * Assigns `value` to `key` of `object` if the existing value is not equivalent\r\n   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\r\n   * for equality comparisons.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to modify.\r\n   * @param {string} key The key of the property to assign.\r\n   * @param {*} value The value to assign.\r\n   */\r\n  function assignValue(object, key, value) {\r\n    var objValue = object[key];\r\n    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||\r\n        (value === undefined && !(key in object))) {\r\n      baseAssignValue(object, key, value);\r\n    }\r\n  }\r\n\r\n  /**\r\n   * Gets the index at which the `key` is found in `array` of key-value pairs.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to inspect.\r\n   * @param {*} key The key to search for.\r\n   * @returns {number} Returns the index of the matched value, else `-1`.\r\n   */\r\n  function assocIndexOf(array, key) {\r\n    var length = array.length;\r\n    while (length--) {\r\n      if (eq(array[length][0], key)) {\r\n        return length;\r\n      }\r\n    }\r\n    return -1;\r\n  }\r\n\r\n  /**\r\n   * Aggregates elements of `collection` on `accumulator` with keys transformed\r\n   * by `iteratee` and values set by `setter`.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} setter The function to set `accumulator` values.\r\n   * @param {Function} iteratee The iteratee to transform keys.\r\n   * @param {Object} accumulator The initial aggregated object.\r\n   * @returns {Function} Returns `accumulator`.\r\n   */\r\n  function baseAggregator(collection, setter, iteratee, accumulator) {\r\n    baseEach(collection, function(value, key, collection) {\r\n      setter(accumulator, value, iteratee(value), collection);\r\n    });\r\n    return accumulator;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.assign` without support for multiple sources\r\n   * or `customizer` functions.\r\n   *\r\n   * @private\r\n   * @param {Object} object The destination object.\r\n   * @param {Object} source The source object.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  function baseAssign(object, source) {\r\n    return object && copyObject(source, keys(source), object);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.assignIn` without support for multiple sources\r\n   * or `customizer` functions.\r\n   *\r\n   * @private\r\n   * @param {Object} object The destination object.\r\n   * @param {Object} source The source object.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  function baseAssignIn(object, source) {\r\n    return object && copyObject(source, keysIn(source), object);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `assignValue` and `assignMergeValue` without\r\n   * value checks.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to modify.\r\n   * @param {string} key The key of the property to assign.\r\n   * @param {*} value The value to assign.\r\n   */\r\n  function baseAssignValue(object, key, value) {\r\n    if (key == '__proto__' && defineProperty) {\r\n      defineProperty(object, key, {\r\n        'configurable': true,\r\n        'enumerable': true,\r\n        'value': value,\r\n        'writable': true\r\n      });\r\n    } else {\r\n      object[key] = value;\r\n    }\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.at` without support for individual paths.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to iterate over.\r\n   * @param {string[]} paths The property paths to pick.\r\n   * @returns {Array} Returns the picked elements.\r\n   */\r\n  function baseAt(object, paths) {\r\n    var index = -1,\r\n        length = paths.length,\r\n        result = Array(length),\r\n        skip = object == null;\r\n\r\n    while (++index < length) {\r\n      result[index] = skip ? undefined : get(object, paths[index]);\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.clamp` which doesn't coerce arguments.\r\n   *\r\n   * @private\r\n   * @param {number} number The number to clamp.\r\n   * @param {number} [lower] The lower bound.\r\n   * @param {number} upper The upper bound.\r\n   * @returns {number} Returns the clamped number.\r\n   */\r\n  function baseClamp(number, lower, upper) {\r\n    if (number === number) {\r\n      if (upper !== undefined) {\r\n        number = number <= upper ? number : upper;\r\n      }\r\n      if (lower !== undefined) {\r\n        number = number >= lower ? number : lower;\r\n      }\r\n    }\r\n    return number;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.clone` and `_.cloneDeep` which tracks\r\n   * traversed objects.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to clone.\r\n   * @param {boolean} bitmask The bitmask flags.\r\n   *  1 - Deep clone\r\n   *  2 - Flatten inherited properties\r\n   *  4 - Clone symbols\r\n   * @param {Function} [customizer] The function to customize cloning.\r\n   * @param {string} [key] The key of `value`.\r\n   * @param {Object} [object] The parent object of `value`.\r\n   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.\r\n   * @returns {*} Returns the cloned value.\r\n   */\r\n  function baseClone(value, bitmask, customizer, key, object, stack) {\r\n    var result,\r\n        isDeep = bitmask & CLONE_DEEP_FLAG,\r\n        isFlat = bitmask & CLONE_FLAT_FLAG,\r\n        isFull = bitmask & CLONE_SYMBOLS_FLAG;\r\n\r\n    if (customizer) {\r\n      result = object ? customizer(value, key, object, stack) : customizer(value);\r\n    }\r\n    if (result !== undefined) {\r\n      return result;\r\n    }\r\n    if (!isObject(value)) {\r\n      return value;\r\n    }\r\n    var isArr = isArray(value);\r\n    if (isArr) {\r\n      result = initCloneArray(value);\r\n      if (!isDeep) {\r\n        return copyArray(value, result);\r\n      }\r\n    } else {\r\n      var tag = getTag(value),\r\n          isFunc = tag == funcTag || tag == genTag;\r\n\r\n      if (isBuffer(value)) {\r\n        return cloneBuffer(value, isDeep);\r\n      }\r\n      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {\r\n        result = (isFlat || isFunc) ? {} : initCloneObject(value);\r\n        if (!isDeep) {\r\n          return isFlat\r\n            ? copySymbolsIn(value, baseAssignIn(result, value))\r\n            : copySymbols(value, baseAssign(result, value));\r\n        }\r\n      } else {\r\n        if (!cloneableTags[tag]) {\r\n          return object ? value : {};\r\n        }\r\n        result = initCloneByTag(value, tag, isDeep);\r\n      }\r\n    }\r\n    // Check for circular references and return its corresponding clone.\r\n    stack || (stack = new Stack);\r\n    var stacked = stack.get(value);\r\n    if (stacked) {\r\n      return stacked;\r\n    }\r\n    stack.set(value, result);\r\n\r\n    if (isSet(value)) {\r\n      value.forEach(function(subValue) {\r\n        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));\r\n      });\r\n\r\n      return result;\r\n    }\r\n\r\n    if (isMap(value)) {\r\n      value.forEach(function(subValue, key) {\r\n        result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));\r\n      });\r\n\r\n      return result;\r\n    }\r\n\r\n    var keysFunc = isFull\r\n      ? (isFlat ? getAllKeysIn : getAllKeys)\r\n      : (isFlat ? keysIn : keys);\r\n\r\n    var props = isArr ? undefined : keysFunc(value);\r\n    arrayEach(props || value, function(subValue, key) {\r\n      if (props) {\r\n        key = subValue;\r\n        subValue = value[key];\r\n      }\r\n      // Recursively populate clone (susceptible to call stack limits).\r\n      assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));\r\n    });\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.delay` and `_.defer` which accepts `args`\r\n   * to provide to `func`.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to delay.\r\n   * @param {number} wait The number of milliseconds to delay invocation.\r\n   * @param {Array} args The arguments to provide to `func`.\r\n   * @returns {number|Object} Returns the timer id or timeout object.\r\n   */\r\n  function baseDelay(func, wait, args) {\r\n    if (typeof func != 'function') {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    return setTimeout(function() { func.apply(undefined, args); }, wait);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of methods like `_.difference` without support\r\n   * for excluding multiple arrays or iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to inspect.\r\n   * @param {Array} values The values to exclude.\r\n   * @param {Function} [iteratee] The iteratee invoked per element.\r\n   * @param {Function} [comparator] The comparator invoked per element.\r\n   * @returns {Array} Returns the new array of filtered values.\r\n   */\r\n  function baseDifference(array, values, iteratee, comparator) {\r\n    var index = -1,\r\n        includes = arrayIncludes,\r\n        isCommon = true,\r\n        length = array.length,\r\n        result = [],\r\n        valuesLength = values.length;\r\n\r\n    if (!length) {\r\n      return result;\r\n    }\r\n    if (iteratee) {\r\n      values = arrayMap(values, baseUnary(iteratee));\r\n    }\r\n    if (comparator) {\r\n      includes = arrayIncludesWith;\r\n      isCommon = false;\r\n    }\r\n    else if (values.length >= LARGE_ARRAY_SIZE) {\r\n      includes = cacheHas;\r\n      isCommon = false;\r\n      values = new SetCache(values);\r\n    }\r\n    outer:\r\n    while (++index < length) {\r\n      var value = array[index],\r\n          computed = iteratee == null ? value : iteratee(value);\r\n\r\n      value = (comparator || value !== 0) ? value : 0;\r\n      if (isCommon && computed === computed) {\r\n        var valuesIndex = valuesLength;\r\n        while (valuesIndex--) {\r\n          if (values[valuesIndex] === computed) {\r\n            continue outer;\r\n          }\r\n        }\r\n        result.push(value);\r\n      }\r\n      else if (!includes(values, computed, comparator)) {\r\n        result.push(value);\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.forEach` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @returns {Array|Object} Returns `collection`.\r\n   */\r\n  var baseEach = createBaseEach(baseForOwn);\r\n\r\n  /**\r\n   * The base implementation of `_.every` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} predicate The function invoked per iteration.\r\n   * @returns {boolean} Returns `true` if all elements pass the predicate check,\r\n   *  else `false`\r\n   */\r\n  function baseEvery(collection, predicate) {\r\n    var result = true;\r\n    baseEach(collection, function(value, index, collection) {\r\n      result = !!predicate(value, index, collection);\r\n      return result;\r\n    });\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of methods like `_.max` and `_.min` which accepts a\r\n   * `comparator` to determine the extremum value.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to iterate over.\r\n   * @param {Function} iteratee The iteratee invoked per iteration.\r\n   * @param {Function} comparator The comparator used to compare values.\r\n   * @returns {*} Returns the extremum value.\r\n   */\r\n  function baseExtremum(array, iteratee, comparator) {\r\n    var index = -1,\r\n        length = array.length;\r\n\r\n    while (++index < length) {\r\n      var value = array[index],\r\n          current = iteratee(value);\r\n\r\n      if (current != null && (computed === undefined\r\n            ? (current === current && !isSymbol(current))\r\n            : comparator(current, computed)\r\n          )) {\r\n        var computed = current,\r\n            result = value;\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.filter` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} predicate The function invoked per iteration.\r\n   * @returns {Array} Returns the new filtered array.\r\n   */\r\n  function baseFilter(collection, predicate) {\r\n    var result = [];\r\n    baseEach(collection, function(value, index, collection) {\r\n      if (predicate(value, index, collection)) {\r\n        result.push(value);\r\n      }\r\n    });\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.flatten` with support for restricting flattening.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to flatten.\r\n   * @param {number} depth The maximum recursion depth.\r\n   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.\r\n   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.\r\n   * @param {Array} [result=[]] The initial result value.\r\n   * @returns {Array} Returns the new flattened array.\r\n   */\r\n  function baseFlatten(array, depth, predicate, isStrict, result) {\r\n    var index = -1,\r\n        length = array.length;\r\n\r\n    predicate || (predicate = isFlattenable);\r\n    result || (result = []);\r\n\r\n    while (++index < length) {\r\n      var value = array[index];\r\n      if (depth > 0 && predicate(value)) {\r\n        if (depth > 1) {\r\n          // Recursively flatten arrays (susceptible to call stack limits).\r\n          baseFlatten(value, depth - 1, predicate, isStrict, result);\r\n        } else {\r\n          arrayPush(result, value);\r\n        }\r\n      } else if (!isStrict) {\r\n        result[result.length] = value;\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `baseForOwn` which iterates over `object`\r\n   * properties returned by `keysFunc` and invokes `iteratee` for each property.\r\n   * Iteratee functions may exit iteration early by explicitly returning `false`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @param {Function} keysFunc The function to get the keys of `object`.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  var baseFor = createBaseFor();\r\n\r\n  /**\r\n   * This function is like `baseFor` except that it iterates over properties\r\n   * in the opposite order.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @param {Function} keysFunc The function to get the keys of `object`.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  var baseForRight = createBaseFor(true);\r\n\r\n  /**\r\n   * The base implementation of `_.forOwn` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  function baseForOwn(object, iteratee) {\r\n    return object && baseFor(object, iteratee, keys);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.forOwnRight` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  function baseForOwnRight(object, iteratee) {\r\n    return object && baseForRight(object, iteratee, keys);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.functions` which creates an array of\r\n   * `object` function property names filtered from `props`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to inspect.\r\n   * @param {Array} props The property names to filter.\r\n   * @returns {Array} Returns the function names.\r\n   */\r\n  function baseFunctions(object, props) {\r\n    return arrayFilter(props, function(key) {\r\n      return isFunction(object[key]);\r\n    });\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.get` without support for default values.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @param {Array|string} path The path of the property to get.\r\n   * @returns {*} Returns the resolved value.\r\n   */\r\n  function baseGet(object, path) {\r\n    path = castPath(path, object);\r\n\r\n    var index = 0,\r\n        length = path.length;\r\n\r\n    while (object != null && index < length) {\r\n      object = object[toKey(path[index++])];\r\n    }\r\n    return (index && index == length) ? object : undefined;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses\r\n   * `keysFunc` and `symbolsFunc` to get the enumerable property names and\r\n   * symbols of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @param {Function} keysFunc The function to get the keys of `object`.\r\n   * @param {Function} symbolsFunc The function to get the symbols of `object`.\r\n   * @returns {Array} Returns the array of property names and symbols.\r\n   */\r\n  function baseGetAllKeys(object, keysFunc, symbolsFunc) {\r\n    var result = keysFunc(object);\r\n    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `getTag` without fallbacks for buggy environments.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to query.\r\n   * @returns {string} Returns the `toStringTag`.\r\n   */\r\n  function baseGetTag(value) {\r\n    if (value == null) {\r\n      return value === undefined ? undefinedTag : nullTag;\r\n    }\r\n    return (symToStringTag && symToStringTag in Object(value))\r\n      ? getRawTag(value)\r\n      : objectToString(value);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.gt` which doesn't coerce arguments.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to compare.\r\n   * @param {*} other The other value to compare.\r\n   * @returns {boolean} Returns `true` if `value` is greater than `other`,\r\n   *  else `false`.\r\n   */\r\n  function baseGt(value, other) {\r\n    return value > other;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.has` without support for deep paths.\r\n   *\r\n   * @private\r\n   * @param {Object} [object] The object to query.\r\n   * @param {Array|string} key The key to check.\r\n   * @returns {boolean} Returns `true` if `key` exists, else `false`.\r\n   */\r\n  function baseHas(object, key) {\r\n    return object != null && hasOwnProperty.call(object, key);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.hasIn` without support for deep paths.\r\n   *\r\n   * @private\r\n   * @param {Object} [object] The object to query.\r\n   * @param {Array|string} key The key to check.\r\n   * @returns {boolean} Returns `true` if `key` exists, else `false`.\r\n   */\r\n  function baseHasIn(object, key) {\r\n    return object != null && key in Object(object);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of methods like `_.intersection`, without support\r\n   * for iteratee shorthands, that accepts an array of arrays to inspect.\r\n   *\r\n   * @private\r\n   * @param {Array} arrays The arrays to inspect.\r\n   * @param {Function} [iteratee] The iteratee invoked per element.\r\n   * @param {Function} [comparator] The comparator invoked per element.\r\n   * @returns {Array} Returns the new array of shared values.\r\n   */\r\n  function baseIntersection(arrays, iteratee, comparator) {\r\n    var includes = comparator ? arrayIncludesWith : arrayIncludes,\r\n        length = arrays[0].length,\r\n        othLength = arrays.length,\r\n        othIndex = othLength,\r\n        caches = Array(othLength),\r\n        maxLength = Infinity,\r\n        result = [];\r\n\r\n    while (othIndex--) {\r\n      var array = arrays[othIndex];\r\n      if (othIndex && iteratee) {\r\n        array = arrayMap(array, baseUnary(iteratee));\r\n      }\r\n      maxLength = nativeMin(array.length, maxLength);\r\n      caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))\r\n        ? new SetCache(othIndex && array)\r\n        : undefined;\r\n    }\r\n    array = arrays[0];\r\n\r\n    var index = -1,\r\n        seen = caches[0];\r\n\r\n    outer:\r\n    while (++index < length && result.length < maxLength) {\r\n      var value = array[index],\r\n          computed = iteratee ? iteratee(value) : value;\r\n\r\n      value = (comparator || value !== 0) ? value : 0;\r\n      if (!(seen\r\n            ? cacheHas(seen, computed)\r\n            : includes(result, computed, comparator)\r\n          )) {\r\n        othIndex = othLength;\r\n        while (--othIndex) {\r\n          var cache = caches[othIndex];\r\n          if (!(cache\r\n                ? cacheHas(cache, computed)\r\n                : includes(arrays[othIndex], computed, comparator))\r\n              ) {\r\n            continue outer;\r\n          }\r\n        }\r\n        if (seen) {\r\n          seen.push(computed);\r\n        }\r\n        result.push(value);\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.invert` and `_.invertBy` which inverts\r\n   * `object` with values transformed by `iteratee` and set by `setter`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to iterate over.\r\n   * @param {Function} setter The function to set `accumulator` values.\r\n   * @param {Function} iteratee The iteratee to transform values.\r\n   * @param {Object} accumulator The initial inverted object.\r\n   * @returns {Function} Returns `accumulator`.\r\n   */\r\n  function baseInverter(object, setter, iteratee, accumulator) {\r\n    baseForOwn(object, function(value, key, object) {\r\n      setter(accumulator, iteratee(value), key, object);\r\n    });\r\n    return accumulator;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.invoke` without support for individual\r\n   * method arguments.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @param {Array|string} path The path of the method to invoke.\r\n   * @param {Array} args The arguments to invoke the method with.\r\n   * @returns {*} Returns the result of the invoked method.\r\n   */\r\n  function baseInvoke(object, path, args) {\r\n    path = castPath(path, object);\r\n    object = parent(object, path);\r\n    var func = object == null ? object : object[toKey(last(path))];\r\n    return func == null ? undefined : apply(func, object, args);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isArguments`.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is an `arguments` object,\r\n   */\r\n  function baseIsArguments(value) {\r\n    return isObjectLike(value) && baseGetTag(value) == argsTag;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isDate` without Node.js optimizations.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a date object, else `false`.\r\n   */\r\n  function baseIsDate(value) {\r\n    return isObjectLike(value) && baseGetTag(value) == dateTag;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isEqual` which supports partial comparisons\r\n   * and tracks traversed objects.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to compare.\r\n   * @param {*} other The other value to compare.\r\n   * @param {boolean} bitmask The bitmask flags.\r\n   *  1 - Unordered comparison\r\n   *  2 - Partial comparison\r\n   * @param {Function} [customizer] The function to customize comparisons.\r\n   * @param {Object} [stack] Tracks traversed `value` and `other` objects.\r\n   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\r\n   */\r\n  function baseIsEqual(value, other, bitmask, customizer, stack) {\r\n    if (value === other) {\r\n      return true;\r\n    }\r\n    if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {\r\n      return value !== value && other !== other;\r\n    }\r\n    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseIsEqual` for arrays and objects which performs\r\n   * deep comparisons and tracks traversed objects enabling objects with circular\r\n   * references to be compared.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to compare.\r\n   * @param {Object} other The other object to compare.\r\n   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\r\n   * @param {Function} customizer The function to customize comparisons.\r\n   * @param {Function} equalFunc The function to determine equivalents of values.\r\n   * @param {Object} [stack] Tracks traversed `object` and `other` objects.\r\n   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\r\n   */\r\n  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {\r\n    var objIsArr = isArray(object),\r\n        othIsArr = isArray(other),\r\n        objTag = objIsArr ? arrayTag : getTag(object),\r\n        othTag = othIsArr ? arrayTag : getTag(other);\r\n\r\n    objTag = objTag == argsTag ? objectTag : objTag;\r\n    othTag = othTag == argsTag ? objectTag : othTag;\r\n\r\n    var objIsObj = objTag == objectTag,\r\n        othIsObj = othTag == objectTag,\r\n        isSameTag = objTag == othTag;\r\n\r\n    if (isSameTag && isBuffer(object)) {\r\n      if (!isBuffer(other)) {\r\n        return false;\r\n      }\r\n      objIsArr = true;\r\n      objIsObj = false;\r\n    }\r\n    if (isSameTag && !objIsObj) {\r\n      stack || (stack = new Stack);\r\n      return (objIsArr || isTypedArray(object))\r\n        ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)\r\n        : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);\r\n    }\r\n    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {\r\n      var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),\r\n          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');\r\n\r\n      if (objIsWrapped || othIsWrapped) {\r\n        var objUnwrapped = objIsWrapped ? object.value() : object,\r\n            othUnwrapped = othIsWrapped ? other.value() : other;\r\n\r\n        stack || (stack = new Stack);\r\n        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);\r\n      }\r\n    }\r\n    if (!isSameTag) {\r\n      return false;\r\n    }\r\n    stack || (stack = new Stack);\r\n    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isMap` without Node.js optimizations.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a map, else `false`.\r\n   */\r\n  function baseIsMap(value) {\r\n    return isObjectLike(value) && getTag(value) == mapTag;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isMatch` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to inspect.\r\n   * @param {Object} source The object of property values to match.\r\n   * @param {Array} matchData The property names, values, and compare flags to match.\r\n   * @param {Function} [customizer] The function to customize comparisons.\r\n   * @returns {boolean} Returns `true` if `object` is a match, else `false`.\r\n   */\r\n  function baseIsMatch(object, source, matchData, customizer) {\r\n    var index = matchData.length,\r\n        length = index,\r\n        noCustomizer = !customizer;\r\n\r\n    if (object == null) {\r\n      return !length;\r\n    }\r\n    object = Object(object);\r\n    while (index--) {\r\n      var data = matchData[index];\r\n      if ((noCustomizer && data[2])\r\n            ? data[1] !== object[data[0]]\r\n            : !(data[0] in object)\r\n          ) {\r\n        return false;\r\n      }\r\n    }\r\n    while (++index < length) {\r\n      data = matchData[index];\r\n      var key = data[0],\r\n          objValue = object[key],\r\n          srcValue = data[1];\r\n\r\n      if (noCustomizer && data[2]) {\r\n        if (objValue === undefined && !(key in object)) {\r\n          return false;\r\n        }\r\n      } else {\r\n        var stack = new Stack;\r\n        if (customizer) {\r\n          var result = customizer(objValue, srcValue, key, object, source, stack);\r\n        }\r\n        if (!(result === undefined\r\n              ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)\r\n              : result\r\n            )) {\r\n          return false;\r\n        }\r\n      }\r\n    }\r\n    return true;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isNative` without bad shim checks.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a native function,\r\n   *  else `false`.\r\n   */\r\n  function baseIsNative(value) {\r\n    if (!isObject(value) || isMasked(value)) {\r\n      return false;\r\n    }\r\n    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;\r\n    return pattern.test(toSource(value));\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isRegExp` without Node.js optimizations.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.\r\n   */\r\n  function baseIsRegExp(value) {\r\n    return isObjectLike(value) && baseGetTag(value) == regexpTag;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isSet` without Node.js optimizations.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a set, else `false`.\r\n   */\r\n  function baseIsSet(value) {\r\n    return isObjectLike(value) && getTag(value) == setTag;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.isTypedArray` without Node.js optimizations.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.\r\n   */\r\n  function baseIsTypedArray(value) {\r\n    return isObjectLike(value) &&\r\n      isLength(value.length) && !!typedArrayTags[baseGetTag(value)];\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.iteratee`.\r\n   *\r\n   * @private\r\n   * @param {*} [value=_.identity] The value to convert to an iteratee.\r\n   * @returns {Function} Returns the iteratee.\r\n   */\r\n  function baseIteratee(value) {\r\n    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.\r\n    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.\r\n    if (typeof value == 'function') {\r\n      return value;\r\n    }\r\n    if (value == null) {\r\n      return identity;\r\n    }\r\n    if (typeof value == 'object') {\r\n      return isArray(value)\r\n        ? baseMatchesProperty(value[0], value[1])\r\n        : baseMatches(value);\r\n    }\r\n    return property(value);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of property names.\r\n   */\r\n  function baseKeys(object) {\r\n    if (!isPrototype(object)) {\r\n      return nativeKeys(object);\r\n    }\r\n    var result = [];\r\n    for (var key in Object(object)) {\r\n      if (hasOwnProperty.call(object, key) && key != 'constructor') {\r\n        result.push(key);\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of property names.\r\n   */\r\n  function baseKeysIn(object) {\r\n    if (!isObject(object)) {\r\n      return nativeKeysIn(object);\r\n    }\r\n    var isProto = isPrototype(object),\r\n        result = [];\r\n\r\n    for (var key in object) {\r\n      if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {\r\n        result.push(key);\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.lt` which doesn't coerce arguments.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to compare.\r\n   * @param {*} other The other value to compare.\r\n   * @returns {boolean} Returns `true` if `value` is less than `other`,\r\n   *  else `false`.\r\n   */\r\n  function baseLt(value, other) {\r\n    return value < other;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.map` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} iteratee The function invoked per iteration.\r\n   * @returns {Array} Returns the new mapped array.\r\n   */\r\n  function baseMap(collection, iteratee) {\r\n    var index = -1,\r\n        result = isArrayLike(collection) ? Array(collection.length) : [];\r\n\r\n    baseEach(collection, function(value, key, collection) {\r\n      result[++index] = iteratee(value, key, collection);\r\n    });\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.matches` which doesn't clone `source`.\r\n   *\r\n   * @private\r\n   * @param {Object} source The object of property values to match.\r\n   * @returns {Function} Returns the new spec function.\r\n   */\r\n  function baseMatches(source) {\r\n    var matchData = getMatchData(source);\r\n    if (matchData.length == 1 && matchData[0][2]) {\r\n      return matchesStrictComparable(matchData[0][0], matchData[0][1]);\r\n    }\r\n    return function(object) {\r\n      return object === source || baseIsMatch(object, source, matchData);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.\r\n   *\r\n   * @private\r\n   * @param {string} path The path of the property to get.\r\n   * @param {*} srcValue The value to match.\r\n   * @returns {Function} Returns the new spec function.\r\n   */\r\n  function baseMatchesProperty(path, srcValue) {\r\n    if (isKey(path) && isStrictComparable(srcValue)) {\r\n      return matchesStrictComparable(toKey(path), srcValue);\r\n    }\r\n    return function(object) {\r\n      var objValue = get(object, path);\r\n      return (objValue === undefined && objValue === srcValue)\r\n        ? hasIn(object, path)\r\n        : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.merge` without support for multiple sources.\r\n   *\r\n   * @private\r\n   * @param {Object} object The destination object.\r\n   * @param {Object} source The source object.\r\n   * @param {number} srcIndex The index of `source`.\r\n   * @param {Function} [customizer] The function to customize merged values.\r\n   * @param {Object} [stack] Tracks traversed source values and their merged\r\n   *  counterparts.\r\n   */\r\n  function baseMerge(object, source, srcIndex, customizer, stack) {\r\n    if (object === source) {\r\n      return;\r\n    }\r\n    baseFor(source, function(srcValue, key) {\r\n      if (isObject(srcValue)) {\r\n        stack || (stack = new Stack);\r\n        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);\r\n      }\r\n      else {\r\n        var newValue = customizer\r\n          ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)\r\n          : undefined;\r\n\r\n        if (newValue === undefined) {\r\n          newValue = srcValue;\r\n        }\r\n        assignMergeValue(object, key, newValue);\r\n      }\r\n    }, keysIn);\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseMerge` for arrays and objects which performs\r\n   * deep merges and tracks traversed objects enabling objects with circular\r\n   * references to be merged.\r\n   *\r\n   * @private\r\n   * @param {Object} object The destination object.\r\n   * @param {Object} source The source object.\r\n   * @param {string} key The key of the value to merge.\r\n   * @param {number} srcIndex The index of `source`.\r\n   * @param {Function} mergeFunc The function to merge values.\r\n   * @param {Function} [customizer] The function to customize assigned values.\r\n   * @param {Object} [stack] Tracks traversed source values and their merged\r\n   *  counterparts.\r\n   */\r\n  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {\r\n    var objValue = safeGet(object, key),\r\n        srcValue = safeGet(source, key),\r\n        stacked = stack.get(srcValue);\r\n\r\n    if (stacked) {\r\n      assignMergeValue(object, key, stacked);\r\n      return;\r\n    }\r\n    var newValue = customizer\r\n      ? customizer(objValue, srcValue, (key + ''), object, source, stack)\r\n      : undefined;\r\n\r\n    var isCommon = newValue === undefined;\r\n\r\n    if (isCommon) {\r\n      var isArr = isArray(srcValue),\r\n          isBuff = !isArr && isBuffer(srcValue),\r\n          isTyped = !isArr && !isBuff && isTypedArray(srcValue);\r\n\r\n      newValue = srcValue;\r\n      if (isArr || isBuff || isTyped) {\r\n        if (isArray(objValue)) {\r\n          newValue = objValue;\r\n        }\r\n        else if (isArrayLikeObject(objValue)) {\r\n          newValue = copyArray(objValue);\r\n        }\r\n        else if (isBuff) {\r\n          isCommon = false;\r\n          newValue = cloneBuffer(srcValue, true);\r\n        }\r\n        else if (isTyped) {\r\n          isCommon = false;\r\n          newValue = cloneTypedArray(srcValue, true);\r\n        }\r\n        else {\r\n          newValue = [];\r\n        }\r\n      }\r\n      else if (isPlainObject(srcValue) || isArguments(srcValue)) {\r\n        newValue = objValue;\r\n        if (isArguments(objValue)) {\r\n          newValue = toPlainObject(objValue);\r\n        }\r\n        else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {\r\n          newValue = initCloneObject(srcValue);\r\n        }\r\n      }\r\n      else {\r\n        isCommon = false;\r\n      }\r\n    }\r\n    if (isCommon) {\r\n      // Recursively merge objects and arrays (susceptible to call stack limits).\r\n      stack.set(srcValue, newValue);\r\n      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);\r\n      stack['delete'](srcValue);\r\n    }\r\n    assignMergeValue(object, key, newValue);\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.orderBy` without param guards.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.\r\n   * @param {string[]} orders The sort orders of `iteratees`.\r\n   * @returns {Array} Returns the new sorted array.\r\n   */\r\n  function baseOrderBy(collection, iteratees, orders) {\r\n    var index = -1;\r\n    iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));\r\n\r\n    var result = baseMap(collection, function(value, key, collection) {\r\n      var criteria = arrayMap(iteratees, function(iteratee) {\r\n        return iteratee(value);\r\n      });\r\n      return { 'criteria': criteria, 'index': ++index, 'value': value };\r\n    });\r\n\r\n    return baseSortBy(result, function(object, other) {\r\n      return compareMultiple(object, other, orders);\r\n    });\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.pick` without support for individual\r\n   * property identifiers.\r\n   *\r\n   * @private\r\n   * @param {Object} object The source object.\r\n   * @param {string[]} paths The property paths to pick.\r\n   * @returns {Object} Returns the new object.\r\n   */\r\n  function basePick(object, paths) {\r\n    return basePickBy(object, paths, function(value, path) {\r\n      return hasIn(object, path);\r\n    });\r\n  }\r\n\r\n  /**\r\n   * The base implementation of  `_.pickBy` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Object} object The source object.\r\n   * @param {string[]} paths The property paths to pick.\r\n   * @param {Function} predicate The function invoked per property.\r\n   * @returns {Object} Returns the new object.\r\n   */\r\n  function basePickBy(object, paths, predicate) {\r\n    var index = -1,\r\n        length = paths.length,\r\n        result = {};\r\n\r\n    while (++index < length) {\r\n      var path = paths[index],\r\n          value = baseGet(object, path);\r\n\r\n      if (predicate(value, path)) {\r\n        baseSet(result, castPath(path, object), value);\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseProperty` which supports deep paths.\r\n   *\r\n   * @private\r\n   * @param {Array|string} path The path of the property to get.\r\n   * @returns {Function} Returns the new accessor function.\r\n   */\r\n  function basePropertyDeep(path) {\r\n    return function(object) {\r\n      return baseGet(object, path);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.random` without support for returning\r\n   * floating-point numbers.\r\n   *\r\n   * @private\r\n   * @param {number} lower The lower bound.\r\n   * @param {number} upper The upper bound.\r\n   * @returns {number} Returns the random number.\r\n   */\r\n  function baseRandom(lower, upper) {\r\n    return lower + nativeFloor(nativeRandom() * (upper - lower + 1));\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.range` and `_.rangeRight` which doesn't\r\n   * coerce arguments.\r\n   *\r\n   * @private\r\n   * @param {number} start The start of the range.\r\n   * @param {number} end The end of the range.\r\n   * @param {number} step The value to increment or decrement by.\r\n   * @param {boolean} [fromRight] Specify iterating from right to left.\r\n   * @returns {Array} Returns the range of numbers.\r\n   */\r\n  function baseRange(start, end, step, fromRight) {\r\n    var index = -1,\r\n        length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),\r\n        result = Array(length);\r\n\r\n    while (length--) {\r\n      result[fromRight ? length : ++index] = start;\r\n      start += step;\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.rest` which doesn't validate or coerce arguments.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to apply a rest parameter to.\r\n   * @param {number} [start=func.length-1] The start position of the rest parameter.\r\n   * @returns {Function} Returns the new function.\r\n   */\r\n  function baseRest(func, start) {\r\n    return setToString(overRest(func, start, identity), func + '');\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.set`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to modify.\r\n   * @param {Array|string} path The path of the property to set.\r\n   * @param {*} value The value to set.\r\n   * @param {Function} [customizer] The function to customize path creation.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  function baseSet(object, path, value, customizer) {\r\n    if (!isObject(object)) {\r\n      return object;\r\n    }\r\n    path = castPath(path, object);\r\n\r\n    var index = -1,\r\n        length = path.length,\r\n        lastIndex = length - 1,\r\n        nested = object;\r\n\r\n    while (nested != null && ++index < length) {\r\n      var key = toKey(path[index]),\r\n          newValue = value;\r\n\r\n      if (index != lastIndex) {\r\n        var objValue = nested[key];\r\n        newValue = customizer ? customizer(objValue, key, nested) : undefined;\r\n        if (newValue === undefined) {\r\n          newValue = isObject(objValue)\r\n            ? objValue\r\n            : (isIndex(path[index + 1]) ? [] : {});\r\n        }\r\n      }\r\n      assignValue(nested, key, newValue);\r\n      nested = nested[key];\r\n    }\r\n    return object;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `setData` without support for hot loop shorting.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to associate metadata with.\r\n   * @param {*} data The metadata.\r\n   * @returns {Function} Returns `func`.\r\n   */\r\n  var baseSetData = !metaMap ? identity : function(func, data) {\r\n    metaMap.set(func, data);\r\n    return func;\r\n  };\r\n\r\n  /**\r\n   * The base implementation of `setToString` without support for hot loop shorting.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to modify.\r\n   * @param {Function} string The `toString` result.\r\n   * @returns {Function} Returns `func`.\r\n   */\r\n  var baseSetToString = !defineProperty ? identity : function(func, string) {\r\n    return defineProperty(func, 'toString', {\r\n      'configurable': true,\r\n      'enumerable': false,\r\n      'value': constant(string),\r\n      'writable': true\r\n    });\r\n  };\r\n\r\n  /**\r\n   * The base implementation of `_.slice` without an iteratee call guard.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to slice.\r\n   * @param {number} [start=0] The start position.\r\n   * @param {number} [end=array.length] The end position.\r\n   * @returns {Array} Returns the slice of `array`.\r\n   */\r\n  function baseSlice(array, start, end) {\r\n    var index = -1,\r\n        length = array.length;\r\n\r\n    if (start < 0) {\r\n      start = -start > length ? 0 : (length + start);\r\n    }\r\n    end = end > length ? length : end;\r\n    if (end < 0) {\r\n      end += length;\r\n    }\r\n    length = start > end ? 0 : ((end - start) >>> 0);\r\n    start >>>= 0;\r\n\r\n    var result = Array(length);\r\n    while (++index < length) {\r\n      result[index] = array[index + start];\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.some` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} predicate The function invoked per iteration.\r\n   * @returns {boolean} Returns `true` if any element passes the predicate check,\r\n   *  else `false`.\r\n   */\r\n  function baseSome(collection, predicate) {\r\n    var result;\r\n\r\n    baseEach(collection, function(value, index, collection) {\r\n      result = predicate(value, index, collection);\r\n      return !result;\r\n    });\r\n    return !!result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.toString` which doesn't convert nullish\r\n   * values to empty strings.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to process.\r\n   * @returns {string} Returns the string.\r\n   */\r\n  function baseToString(value) {\r\n    // Exit early for strings to avoid a performance hit in some environments.\r\n    if (typeof value == 'string') {\r\n      return value;\r\n    }\r\n    if (isArray(value)) {\r\n      // Recursively convert values (susceptible to call stack limits).\r\n      return arrayMap(value, baseToString) + '';\r\n    }\r\n    if (isSymbol(value)) {\r\n      return symbolToString ? symbolToString.call(value) : '';\r\n    }\r\n    var result = (value + '');\r\n    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.uniqBy` without support for iteratee shorthands.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to inspect.\r\n   * @param {Function} [iteratee] The iteratee invoked per element.\r\n   * @param {Function} [comparator] The comparator invoked per element.\r\n   * @returns {Array} Returns the new duplicate free array.\r\n   */\r\n  function baseUniq(array, iteratee, comparator) {\r\n    var index = -1,\r\n        includes = arrayIncludes,\r\n        length = array.length,\r\n        isCommon = true,\r\n        result = [],\r\n        seen = result;\r\n\r\n    if (comparator) {\r\n      isCommon = false;\r\n      includes = arrayIncludesWith;\r\n    }\r\n    else if (length >= LARGE_ARRAY_SIZE) {\r\n      var set = iteratee ? null : createSet(array);\r\n      if (set) {\r\n        return setToArray(set);\r\n      }\r\n      isCommon = false;\r\n      includes = cacheHas;\r\n      seen = new SetCache;\r\n    }\r\n    else {\r\n      seen = iteratee ? [] : result;\r\n    }\r\n    outer:\r\n    while (++index < length) {\r\n      var value = array[index],\r\n          computed = iteratee ? iteratee(value) : value;\r\n\r\n      value = (comparator || value !== 0) ? value : 0;\r\n      if (isCommon && computed === computed) {\r\n        var seenIndex = seen.length;\r\n        while (seenIndex--) {\r\n          if (seen[seenIndex] === computed) {\r\n            continue outer;\r\n          }\r\n        }\r\n        if (iteratee) {\r\n          seen.push(computed);\r\n        }\r\n        result.push(value);\r\n      }\r\n      else if (!includes(seen, computed, comparator)) {\r\n        if (seen !== result) {\r\n          seen.push(computed);\r\n        }\r\n        result.push(value);\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `_.unset`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to modify.\r\n   * @param {Array|string} path The property path to unset.\r\n   * @returns {boolean} Returns `true` if the property is deleted, else `false`.\r\n   */\r\n  function baseUnset(object, path) {\r\n    path = castPath(path, object);\r\n    object = parent(object, path);\r\n    return object == null || delete object[toKey(last(path))];\r\n  }\r\n\r\n  /**\r\n   * The base implementation of `wrapperValue` which returns the result of\r\n   * performing a sequence of actions on the unwrapped `value`, where each\r\n   * successive action is supplied the return value of the previous.\r\n   *\r\n   * @private\r\n   * @param {*} value The unwrapped value.\r\n   * @param {Array} actions Actions to perform to resolve the unwrapped value.\r\n   * @returns {*} Returns the resolved value.\r\n   */\r\n  function baseWrapperValue(value, actions) {\r\n    var result = value;\r\n    if (result instanceof LazyWrapper) {\r\n      result = result.value();\r\n    }\r\n    return arrayReduce(actions, function(result, action) {\r\n      return action.func.apply(action.thisArg, arrayPush([result], action.args));\r\n    }, result);\r\n  }\r\n\r\n  /**\r\n   * This base implementation of `_.zipObject` which assigns values using `assignFunc`.\r\n   *\r\n   * @private\r\n   * @param {Array} props The property identifiers.\r\n   * @param {Array} values The property values.\r\n   * @param {Function} assignFunc The function to assign values.\r\n   * @returns {Object} Returns the new object.\r\n   */\r\n  function baseZipObject(props, values, assignFunc) {\r\n    var index = -1,\r\n        length = props.length,\r\n        valsLength = values.length,\r\n        result = {};\r\n\r\n    while (++index < length) {\r\n      var value = index < valsLength ? values[index] : undefined;\r\n      assignFunc(result, props[index], value);\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Casts `value` to an empty array if it's not an array like object.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to inspect.\r\n   * @returns {Array|Object} Returns the cast array-like object.\r\n   */\r\n  function castArrayLikeObject(value) {\r\n    return isArrayLikeObject(value) ? value : [];\r\n  }\r\n\r\n  /**\r\n   * Casts `value` to a path array if it's not one.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to inspect.\r\n   * @param {Object} [object] The object to query keys on.\r\n   * @returns {Array} Returns the cast property path array.\r\n   */\r\n  function castPath(value, object) {\r\n    if (isArray(value)) {\r\n      return value;\r\n    }\r\n    return isKey(value, object) ? [value] : stringToPath(toString(value));\r\n  }\r\n\r\n  /**\r\n   * Casts `array` to a slice if it's needed.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to inspect.\r\n   * @param {number} start The start position.\r\n   * @param {number} [end=array.length] The end position.\r\n   * @returns {Array} Returns the cast slice.\r\n   */\r\n  function castSlice(array, start, end) {\r\n    var length = array.length;\r\n    end = end === undefined ? length : end;\r\n    return (!start && end >= length) ? array : baseSlice(array, start, end);\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of  `buffer`.\r\n   *\r\n   * @private\r\n   * @param {Buffer} buffer The buffer to clone.\r\n   * @param {boolean} [isDeep] Specify a deep clone.\r\n   * @returns {Buffer} Returns the cloned buffer.\r\n   */\r\n  function cloneBuffer(buffer, isDeep) {\r\n    if (isDeep) {\r\n      return buffer.slice();\r\n    }\r\n    var length = buffer.length,\r\n        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);\r\n\r\n    buffer.copy(result);\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of `arrayBuffer`.\r\n   *\r\n   * @private\r\n   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.\r\n   * @returns {ArrayBuffer} Returns the cloned array buffer.\r\n   */\r\n  function cloneArrayBuffer(arrayBuffer) {\r\n    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);\r\n    new Uint8Array(result).set(new Uint8Array(arrayBuffer));\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of `dataView`.\r\n   *\r\n   * @private\r\n   * @param {Object} dataView The data view to clone.\r\n   * @param {boolean} [isDeep] Specify a deep clone.\r\n   * @returns {Object} Returns the cloned data view.\r\n   */\r\n  function cloneDataView(dataView, isDeep) {\r\n    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;\r\n    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of `regexp`.\r\n   *\r\n   * @private\r\n   * @param {Object} regexp The regexp to clone.\r\n   * @returns {Object} Returns the cloned regexp.\r\n   */\r\n  function cloneRegExp(regexp) {\r\n    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));\r\n    result.lastIndex = regexp.lastIndex;\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of the `symbol` object.\r\n   *\r\n   * @private\r\n   * @param {Object} symbol The symbol object to clone.\r\n   * @returns {Object} Returns the cloned symbol object.\r\n   */\r\n  function cloneSymbol(symbol) {\r\n    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of `typedArray`.\r\n   *\r\n   * @private\r\n   * @param {Object} typedArray The typed array to clone.\r\n   * @param {boolean} [isDeep] Specify a deep clone.\r\n   * @returns {Object} Returns the cloned typed array.\r\n   */\r\n  function cloneTypedArray(typedArray, isDeep) {\r\n    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;\r\n    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);\r\n  }\r\n\r\n  /**\r\n   * Compares values to sort them in ascending order.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to compare.\r\n   * @param {*} other The other value to compare.\r\n   * @returns {number} Returns the sort order indicator for `value`.\r\n   */\r\n  function compareAscending(value, other) {\r\n    if (value !== other) {\r\n      var valIsDefined = value !== undefined,\r\n          valIsNull = value === null,\r\n          valIsReflexive = value === value,\r\n          valIsSymbol = isSymbol(value);\r\n\r\n      var othIsDefined = other !== undefined,\r\n          othIsNull = other === null,\r\n          othIsReflexive = other === other,\r\n          othIsSymbol = isSymbol(other);\r\n\r\n      if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||\r\n          (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||\r\n          (valIsNull && othIsDefined && othIsReflexive) ||\r\n          (!valIsDefined && othIsReflexive) ||\r\n          !valIsReflexive) {\r\n        return 1;\r\n      }\r\n      if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||\r\n          (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||\r\n          (othIsNull && valIsDefined && valIsReflexive) ||\r\n          (!othIsDefined && valIsReflexive) ||\r\n          !othIsReflexive) {\r\n        return -1;\r\n      }\r\n    }\r\n    return 0;\r\n  }\r\n\r\n  /**\r\n   * Used by `_.orderBy` to compare multiple properties of a value to another\r\n   * and stable sort them.\r\n   *\r\n   * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,\r\n   * specify an order of \"desc\" for descending or \"asc\" for ascending sort order\r\n   * of corresponding values.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to compare.\r\n   * @param {Object} other The other object to compare.\r\n   * @param {boolean[]|string[]} orders The order to sort by for each property.\r\n   * @returns {number} Returns the sort order indicator for `object`.\r\n   */\r\n  function compareMultiple(object, other, orders) {\r\n    var index = -1,\r\n        objCriteria = object.criteria,\r\n        othCriteria = other.criteria,\r\n        length = objCriteria.length,\r\n        ordersLength = orders.length;\r\n\r\n    while (++index < length) {\r\n      var result = compareAscending(objCriteria[index], othCriteria[index]);\r\n      if (result) {\r\n        if (index >= ordersLength) {\r\n          return result;\r\n        }\r\n        var order = orders[index];\r\n        return result * (order == 'desc' ? -1 : 1);\r\n      }\r\n    }\r\n    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications\r\n    // that causes it, under certain circumstances, to provide the same value for\r\n    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247\r\n    // for more details.\r\n    //\r\n    // This also ensures a stable sort in V8 and other engines.\r\n    // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.\r\n    return object.index - other.index;\r\n  }\r\n\r\n  /**\r\n   * Creates an array that is the composition of partially applied arguments,\r\n   * placeholders, and provided arguments into a single array of arguments.\r\n   *\r\n   * @private\r\n   * @param {Array} args The provided arguments.\r\n   * @param {Array} partials The arguments to prepend to those provided.\r\n   * @param {Array} holders The `partials` placeholder indexes.\r\n   * @params {boolean} [isCurried] Specify composing for a curried function.\r\n   * @returns {Array} Returns the new array of composed arguments.\r\n   */\r\n  function composeArgs(args, partials, holders, isCurried) {\r\n    var argsIndex = -1,\r\n        argsLength = args.length,\r\n        holdersLength = holders.length,\r\n        leftIndex = -1,\r\n        leftLength = partials.length,\r\n        rangeLength = nativeMax(argsLength - holdersLength, 0),\r\n        result = Array(leftLength + rangeLength),\r\n        isUncurried = !isCurried;\r\n\r\n    while (++leftIndex < leftLength) {\r\n      result[leftIndex] = partials[leftIndex];\r\n    }\r\n    while (++argsIndex < holdersLength) {\r\n      if (isUncurried || argsIndex < argsLength) {\r\n        result[holders[argsIndex]] = args[argsIndex];\r\n      }\r\n    }\r\n    while (rangeLength--) {\r\n      result[leftIndex++] = args[argsIndex++];\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * This function is like `composeArgs` except that the arguments composition\r\n   * is tailored for `_.partialRight`.\r\n   *\r\n   * @private\r\n   * @param {Array} args The provided arguments.\r\n   * @param {Array} partials The arguments to append to those provided.\r\n   * @param {Array} holders The `partials` placeholder indexes.\r\n   * @params {boolean} [isCurried] Specify composing for a curried function.\r\n   * @returns {Array} Returns the new array of composed arguments.\r\n   */\r\n  function composeArgsRight(args, partials, holders, isCurried) {\r\n    var argsIndex = -1,\r\n        argsLength = args.length,\r\n        holdersIndex = -1,\r\n        holdersLength = holders.length,\r\n        rightIndex = -1,\r\n        rightLength = partials.length,\r\n        rangeLength = nativeMax(argsLength - holdersLength, 0),\r\n        result = Array(rangeLength + rightLength),\r\n        isUncurried = !isCurried;\r\n\r\n    while (++argsIndex < rangeLength) {\r\n      result[argsIndex] = args[argsIndex];\r\n    }\r\n    var offset = argsIndex;\r\n    while (++rightIndex < rightLength) {\r\n      result[offset + rightIndex] = partials[rightIndex];\r\n    }\r\n    while (++holdersIndex < holdersLength) {\r\n      if (isUncurried || argsIndex < argsLength) {\r\n        result[offset + holders[holdersIndex]] = args[argsIndex++];\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Copies the values of `source` to `array`.\r\n   *\r\n   * @private\r\n   * @param {Array} source The array to copy values from.\r\n   * @param {Array} [array=[]] The array to copy values to.\r\n   * @returns {Array} Returns `array`.\r\n   */\r\n  function copyArray(source, array) {\r\n    var index = -1,\r\n        length = source.length;\r\n\r\n    array || (array = Array(length));\r\n    while (++index < length) {\r\n      array[index] = source[index];\r\n    }\r\n    return array;\r\n  }\r\n\r\n  /**\r\n   * Copies properties of `source` to `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} source The object to copy properties from.\r\n   * @param {Array} props The property identifiers to copy.\r\n   * @param {Object} [object={}] The object to copy properties to.\r\n   * @param {Function} [customizer] The function to customize copied values.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  function copyObject(source, props, object, customizer) {\r\n    var isNew = !object;\r\n    object || (object = {});\r\n\r\n    var index = -1,\r\n        length = props.length;\r\n\r\n    while (++index < length) {\r\n      var key = props[index];\r\n\r\n      var newValue = customizer\r\n        ? customizer(object[key], source[key], key, object, source)\r\n        : undefined;\r\n\r\n      if (newValue === undefined) {\r\n        newValue = source[key];\r\n      }\r\n      if (isNew) {\r\n        baseAssignValue(object, key, newValue);\r\n      } else {\r\n        assignValue(object, key, newValue);\r\n      }\r\n    }\r\n    return object;\r\n  }\r\n\r\n  /**\r\n   * Copies own symbols of `source` to `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} source The object to copy symbols from.\r\n   * @param {Object} [object={}] The object to copy symbols to.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  function copySymbols(source, object) {\r\n    return copyObject(source, getSymbols(source), object);\r\n  }\r\n\r\n  /**\r\n   * Copies own and inherited symbols of `source` to `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} source The object to copy symbols from.\r\n   * @param {Object} [object={}] The object to copy symbols to.\r\n   * @returns {Object} Returns `object`.\r\n   */\r\n  function copySymbolsIn(source, object) {\r\n    return copyObject(source, getSymbolsIn(source), object);\r\n  }\r\n\r\n  /**\r\n   * Creates a function like `_.groupBy`.\r\n   *\r\n   * @private\r\n   * @param {Function} setter The function to set accumulator values.\r\n   * @param {Function} [initializer] The accumulator object initializer.\r\n   * @returns {Function} Returns the new aggregator function.\r\n   */\r\n  function createAggregator(setter, initializer) {\r\n    return function(collection, iteratee) {\r\n      var func = isArray(collection) ? arrayAggregator : baseAggregator,\r\n          accumulator = initializer ? initializer() : {};\r\n\r\n      return func(collection, setter, baseIteratee(iteratee, 2), accumulator);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function like `_.assign`.\r\n   *\r\n   * @private\r\n   * @param {Function} assigner The function to assign values.\r\n   * @returns {Function} Returns the new assigner function.\r\n   */\r\n  function createAssigner(assigner) {\r\n    return baseRest(function(object, sources) {\r\n      var index = -1,\r\n          length = sources.length,\r\n          customizer = length > 1 ? sources[length - 1] : undefined,\r\n          guard = length > 2 ? sources[2] : undefined;\r\n\r\n      customizer = (assigner.length > 3 && typeof customizer == 'function')\r\n        ? (length--, customizer)\r\n        : undefined;\r\n\r\n      if (guard && isIterateeCall(sources[0], sources[1], guard)) {\r\n        customizer = length < 3 ? undefined : customizer;\r\n        length = 1;\r\n      }\r\n      object = Object(object);\r\n      while (++index < length) {\r\n        var source = sources[index];\r\n        if (source) {\r\n          assigner(object, source, index, customizer);\r\n        }\r\n      }\r\n      return object;\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Creates a `baseEach` or `baseEachRight` function.\r\n   *\r\n   * @private\r\n   * @param {Function} eachFunc The function to iterate over a collection.\r\n   * @param {boolean} [fromRight] Specify iterating from right to left.\r\n   * @returns {Function} Returns the new base function.\r\n   */\r\n  function createBaseEach(eachFunc, fromRight) {\r\n    return function(collection, iteratee) {\r\n      if (collection == null) {\r\n        return collection;\r\n      }\r\n      if (!isArrayLike(collection)) {\r\n        return eachFunc(collection, iteratee);\r\n      }\r\n      var length = collection.length,\r\n          index = fromRight ? length : -1,\r\n          iterable = Object(collection);\r\n\r\n      while ((fromRight ? index-- : ++index < length)) {\r\n        if (iteratee(iterable[index], index, iterable) === false) {\r\n          break;\r\n        }\r\n      }\r\n      return collection;\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a base function for methods like `_.forIn` and `_.forOwn`.\r\n   *\r\n   * @private\r\n   * @param {boolean} [fromRight] Specify iterating from right to left.\r\n   * @returns {Function} Returns the new base function.\r\n   */\r\n  function createBaseFor(fromRight) {\r\n    return function(object, iteratee, keysFunc) {\r\n      var index = -1,\r\n          iterable = Object(object),\r\n          props = keysFunc(object),\r\n          length = props.length;\r\n\r\n      while (length--) {\r\n        var key = props[fromRight ? length : ++index];\r\n        if (iteratee(iterable[key], key, iterable) === false) {\r\n          break;\r\n        }\r\n      }\r\n      return object;\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function that wraps `func` to invoke it with the optional `this`\r\n   * binding of `thisArg`.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to wrap.\r\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\r\n   * @param {*} [thisArg] The `this` binding of `func`.\r\n   * @returns {Function} Returns the new wrapped function.\r\n   */\r\n  function createBind(func, bitmask, thisArg) {\r\n    var isBind = bitmask & WRAP_BIND_FLAG,\r\n        Ctor = createCtor(func);\r\n\r\n    function wrapper() {\r\n      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;\r\n      return fn.apply(isBind ? thisArg : this, arguments);\r\n    }\r\n    return wrapper;\r\n  }\r\n\r\n  /**\r\n   * Creates a function that produces an instance of `Ctor` regardless of\r\n   * whether it was invoked as part of a `new` expression or by `call` or `apply`.\r\n   *\r\n   * @private\r\n   * @param {Function} Ctor The constructor to wrap.\r\n   * @returns {Function} Returns the new wrapped function.\r\n   */\r\n  function createCtor(Ctor) {\r\n    return function() {\r\n      // Use a `switch` statement to work with class constructors. See\r\n      // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist\r\n      // for more details.\r\n      var args = arguments;\r\n      switch (args.length) {\r\n        case 0: return new Ctor;\r\n        case 1: return new Ctor(args[0]);\r\n        case 2: return new Ctor(args[0], args[1]);\r\n        case 3: return new Ctor(args[0], args[1], args[2]);\r\n        case 4: return new Ctor(args[0], args[1], args[2], args[3]);\r\n        case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);\r\n        case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);\r\n        case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);\r\n      }\r\n      var thisBinding = baseCreate(Ctor.prototype),\r\n          result = Ctor.apply(thisBinding, args);\r\n\r\n      // Mimic the constructor's `return` behavior.\r\n      // See https://es5.github.io/#x13.2.2 for more details.\r\n      return isObject(result) ? result : thisBinding;\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function that wraps `func` to enable currying.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to wrap.\r\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\r\n   * @param {number} arity The arity of `func`.\r\n   * @returns {Function} Returns the new wrapped function.\r\n   */\r\n  function createCurry(func, bitmask, arity) {\r\n    var Ctor = createCtor(func);\r\n\r\n    function wrapper() {\r\n      var length = arguments.length,\r\n          args = Array(length),\r\n          index = length,\r\n          placeholder = getHolder(wrapper);\r\n\r\n      while (index--) {\r\n        args[index] = arguments[index];\r\n      }\r\n      var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)\r\n        ? []\r\n        : replaceHolders(args, placeholder);\r\n\r\n      length -= holders.length;\r\n      if (length < arity) {\r\n        return createRecurry(\r\n          func, bitmask, createHybrid, wrapper.placeholder, undefined,\r\n          args, holders, undefined, undefined, arity - length);\r\n      }\r\n      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;\r\n      return apply(fn, this, args);\r\n    }\r\n    return wrapper;\r\n  }\r\n\r\n  /**\r\n   * Creates a `_.find` or `_.findLast` function.\r\n   *\r\n   * @private\r\n   * @param {Function} findIndexFunc The function to find the collection index.\r\n   * @returns {Function} Returns the new find function.\r\n   */\r\n  function createFind(findIndexFunc) {\r\n    return function(collection, predicate, fromIndex) {\r\n      var iterable = Object(collection);\r\n      if (!isArrayLike(collection)) {\r\n        var iteratee = baseIteratee(predicate, 3);\r\n        collection = keys(collection);\r\n        predicate = function(key) { return iteratee(iterable[key], key, iterable); };\r\n      }\r\n      var index = findIndexFunc(collection, predicate, fromIndex);\r\n      return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function that wraps `func` to invoke it with optional `this`\r\n   * binding of `thisArg`, partial application, and currying.\r\n   *\r\n   * @private\r\n   * @param {Function|string} func The function or method name to wrap.\r\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\r\n   * @param {*} [thisArg] The `this` binding of `func`.\r\n   * @param {Array} [partials] The arguments to prepend to those provided to\r\n   *  the new function.\r\n   * @param {Array} [holders] The `partials` placeholder indexes.\r\n   * @param {Array} [partialsRight] The arguments to append to those provided\r\n   *  to the new function.\r\n   * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.\r\n   * @param {Array} [argPos] The argument positions of the new function.\r\n   * @param {number} [ary] The arity cap of `func`.\r\n   * @param {number} [arity] The arity of `func`.\r\n   * @returns {Function} Returns the new wrapped function.\r\n   */\r\n  function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {\r\n    var isAry = bitmask & WRAP_ARY_FLAG,\r\n        isBind = bitmask & WRAP_BIND_FLAG,\r\n        isBindKey = bitmask & WRAP_BIND_KEY_FLAG,\r\n        isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),\r\n        isFlip = bitmask & WRAP_FLIP_FLAG,\r\n        Ctor = isBindKey ? undefined : createCtor(func);\r\n\r\n    function wrapper() {\r\n      var length = arguments.length,\r\n          args = Array(length),\r\n          index = length;\r\n\r\n      while (index--) {\r\n        args[index] = arguments[index];\r\n      }\r\n      if (isCurried) {\r\n        var placeholder = getHolder(wrapper),\r\n            holdersCount = countHolders(args, placeholder);\r\n      }\r\n      if (partials) {\r\n        args = composeArgs(args, partials, holders, isCurried);\r\n      }\r\n      if (partialsRight) {\r\n        args = composeArgsRight(args, partialsRight, holdersRight, isCurried);\r\n      }\r\n      length -= holdersCount;\r\n      if (isCurried && length < arity) {\r\n        var newHolders = replaceHolders(args, placeholder);\r\n        return createRecurry(\r\n          func, bitmask, createHybrid, wrapper.placeholder, thisArg,\r\n          args, newHolders, argPos, ary, arity - length\r\n        );\r\n      }\r\n      var thisBinding = isBind ? thisArg : this,\r\n          fn = isBindKey ? thisBinding[func] : func;\r\n\r\n      length = args.length;\r\n      if (argPos) {\r\n        args = reorder(args, argPos);\r\n      } else if (isFlip && length > 1) {\r\n        args.reverse();\r\n      }\r\n      if (isAry && ary < length) {\r\n        args.length = ary;\r\n      }\r\n      if (this && this !== root && this instanceof wrapper) {\r\n        fn = Ctor || createCtor(fn);\r\n      }\r\n      return fn.apply(thisBinding, args);\r\n    }\r\n    return wrapper;\r\n  }\r\n\r\n  /**\r\n   * Creates a function like `_.invertBy`.\r\n   *\r\n   * @private\r\n   * @param {Function} setter The function to set accumulator values.\r\n   * @param {Function} toIteratee The function to resolve iteratees.\r\n   * @returns {Function} Returns the new inverter function.\r\n   */\r\n  function createInverter(setter, toIteratee) {\r\n    return function(object, iteratee) {\r\n      return baseInverter(object, setter, toIteratee(iteratee), {});\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function that wraps `func` to invoke it with the `this` binding\r\n   * of `thisArg` and `partials` prepended to the arguments it receives.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to wrap.\r\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\r\n   * @param {*} thisArg The `this` binding of `func`.\r\n   * @param {Array} partials The arguments to prepend to those provided to\r\n   *  the new function.\r\n   * @returns {Function} Returns the new wrapped function.\r\n   */\r\n  function createPartial(func, bitmask, thisArg, partials) {\r\n    var isBind = bitmask & WRAP_BIND_FLAG,\r\n        Ctor = createCtor(func);\r\n\r\n    function wrapper() {\r\n      var argsIndex = -1,\r\n          argsLength = arguments.length,\r\n          leftIndex = -1,\r\n          leftLength = partials.length,\r\n          args = Array(leftLength + argsLength),\r\n          fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;\r\n\r\n      while (++leftIndex < leftLength) {\r\n        args[leftIndex] = partials[leftIndex];\r\n      }\r\n      while (argsLength--) {\r\n        args[leftIndex++] = arguments[++argsIndex];\r\n      }\r\n      return apply(fn, isBind ? thisArg : this, args);\r\n    }\r\n    return wrapper;\r\n  }\r\n\r\n  /**\r\n   * Creates a `_.range` or `_.rangeRight` function.\r\n   *\r\n   * @private\r\n   * @param {boolean} [fromRight] Specify iterating from right to left.\r\n   * @returns {Function} Returns the new range function.\r\n   */\r\n  function createRange(fromRight) {\r\n    return function(start, end, step) {\r\n      if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {\r\n        end = step = undefined;\r\n      }\r\n      // Ensure the sign of `-0` is preserved.\r\n      start = toFinite(start);\r\n      if (end === undefined) {\r\n        end = start;\r\n        start = 0;\r\n      } else {\r\n        end = toFinite(end);\r\n      }\r\n      step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);\r\n      return baseRange(start, end, step, fromRight);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function that wraps `func` to continue currying.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to wrap.\r\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\r\n   * @param {Function} wrapFunc The function to create the `func` wrapper.\r\n   * @param {*} placeholder The placeholder value.\r\n   * @param {*} [thisArg] The `this` binding of `func`.\r\n   * @param {Array} [partials] The arguments to prepend to those provided to\r\n   *  the new function.\r\n   * @param {Array} [holders] The `partials` placeholder indexes.\r\n   * @param {Array} [argPos] The argument positions of the new function.\r\n   * @param {number} [ary] The arity cap of `func`.\r\n   * @param {number} [arity] The arity of `func`.\r\n   * @returns {Function} Returns the new wrapped function.\r\n   */\r\n  function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {\r\n    var isCurry = bitmask & WRAP_CURRY_FLAG,\r\n        newHolders = isCurry ? holders : undefined,\r\n        newHoldersRight = isCurry ? undefined : holders,\r\n        newPartials = isCurry ? partials : undefined,\r\n        newPartialsRight = isCurry ? undefined : partials;\r\n\r\n    bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);\r\n    bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);\r\n\r\n    if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {\r\n      bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);\r\n    }\r\n    var newData = [\r\n      func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,\r\n      newHoldersRight, argPos, ary, arity\r\n    ];\r\n\r\n    var result = wrapFunc.apply(undefined, newData);\r\n    if (isLaziable(func)) {\r\n      setData(result, newData);\r\n    }\r\n    result.placeholder = placeholder;\r\n    return setWrapToString(result, func, bitmask);\r\n  }\r\n\r\n  /**\r\n   * Creates a set object of `values`.\r\n   *\r\n   * @private\r\n   * @param {Array} values The values to add to the set.\r\n   * @returns {Object} Returns the new set.\r\n   */\r\n  var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {\r\n    return new Set(values);\r\n  };\r\n\r\n  /**\r\n   * Creates a function that either curries or invokes `func` with optional\r\n   * `this` binding and partially applied arguments.\r\n   *\r\n   * @private\r\n   * @param {Function|string} func The function or method name to wrap.\r\n   * @param {number} bitmask The bitmask flags.\r\n   *    1 - `_.bind`\r\n   *    2 - `_.bindKey`\r\n   *    4 - `_.curry` or `_.curryRight` of a bound function\r\n   *    8 - `_.curry`\r\n   *   16 - `_.curryRight`\r\n   *   32 - `_.partial`\r\n   *   64 - `_.partialRight`\r\n   *  128 - `_.rearg`\r\n   *  256 - `_.ary`\r\n   *  512 - `_.flip`\r\n   * @param {*} [thisArg] The `this` binding of `func`.\r\n   * @param {Array} [partials] The arguments to be partially applied.\r\n   * @param {Array} [holders] The `partials` placeholder indexes.\r\n   * @param {Array} [argPos] The argument positions of the new function.\r\n   * @param {number} [ary] The arity cap of `func`.\r\n   * @param {number} [arity] The arity of `func`.\r\n   * @returns {Function} Returns the new wrapped function.\r\n   */\r\n  function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {\r\n    var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;\r\n    if (!isBindKey && typeof func != 'function') {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    var length = partials ? partials.length : 0;\r\n    if (!length) {\r\n      bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);\r\n      partials = holders = undefined;\r\n    }\r\n    ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);\r\n    arity = arity === undefined ? arity : toInteger(arity);\r\n    length -= holders ? holders.length : 0;\r\n\r\n    if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {\r\n      var partialsRight = partials,\r\n          holdersRight = holders;\r\n\r\n      partials = holders = undefined;\r\n    }\r\n    var data = isBindKey ? undefined : getData(func);\r\n\r\n    var newData = [\r\n      func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,\r\n      argPos, ary, arity\r\n    ];\r\n\r\n    if (data) {\r\n      mergeData(newData, data);\r\n    }\r\n    func = newData[0];\r\n    bitmask = newData[1];\r\n    thisArg = newData[2];\r\n    partials = newData[3];\r\n    holders = newData[4];\r\n    arity = newData[9] = newData[9] === undefined\r\n      ? (isBindKey ? 0 : func.length)\r\n      : nativeMax(newData[9] - length, 0);\r\n\r\n    if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {\r\n      bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);\r\n    }\r\n    if (!bitmask || bitmask == WRAP_BIND_FLAG) {\r\n      var result = createBind(func, bitmask, thisArg);\r\n    } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {\r\n      result = createCurry(func, bitmask, arity);\r\n    } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {\r\n      result = createPartial(func, bitmask, thisArg, partials);\r\n    } else {\r\n      result = createHybrid.apply(undefined, newData);\r\n    }\r\n    var setter = data ? baseSetData : setData;\r\n    return setWrapToString(setter(result, newData), func, bitmask);\r\n  }\r\n\r\n  /**\r\n   * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source\r\n   * objects into destination objects that are passed thru.\r\n   *\r\n   * @private\r\n   * @param {*} objValue The destination value.\r\n   * @param {*} srcValue The source value.\r\n   * @param {string} key The key of the property to merge.\r\n   * @param {Object} object The parent object of `objValue`.\r\n   * @param {Object} source The parent object of `srcValue`.\r\n   * @param {Object} [stack] Tracks traversed source values and their merged\r\n   *  counterparts.\r\n   * @returns {*} Returns the value to assign.\r\n   */\r\n  function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {\r\n    if (isObject(objValue) && isObject(srcValue)) {\r\n      // Recursively merge objects and arrays (susceptible to call stack limits).\r\n      stack.set(srcValue, objValue);\r\n      baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);\r\n      stack['delete'](srcValue);\r\n    }\r\n    return objValue;\r\n  }\r\n\r\n  /**\r\n   * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain\r\n   * objects.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to inspect.\r\n   * @param {string} key The key of the property to inspect.\r\n   * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.\r\n   */\r\n  function customOmitClone(value) {\r\n    return isPlainObject(value) ? undefined : value;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseIsEqualDeep` for arrays with support for\r\n   * partial deep comparisons.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to compare.\r\n   * @param {Array} other The other array to compare.\r\n   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\r\n   * @param {Function} customizer The function to customize comparisons.\r\n   * @param {Function} equalFunc The function to determine equivalents of values.\r\n   * @param {Object} stack Tracks traversed `array` and `other` objects.\r\n   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.\r\n   */\r\n  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {\r\n    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,\r\n        arrLength = array.length,\r\n        othLength = other.length;\r\n\r\n    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {\r\n      return false;\r\n    }\r\n    // Assume cyclic values are equal.\r\n    var stacked = stack.get(array);\r\n    if (stacked && stack.get(other)) {\r\n      return stacked == other;\r\n    }\r\n    var index = -1,\r\n        result = true,\r\n        seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;\r\n\r\n    stack.set(array, other);\r\n    stack.set(other, array);\r\n\r\n    // Ignore non-index properties.\r\n    while (++index < arrLength) {\r\n      var arrValue = array[index],\r\n          othValue = other[index];\r\n\r\n      if (customizer) {\r\n        var compared = isPartial\r\n          ? customizer(othValue, arrValue, index, other, array, stack)\r\n          : customizer(arrValue, othValue, index, array, other, stack);\r\n      }\r\n      if (compared !== undefined) {\r\n        if (compared) {\r\n          continue;\r\n        }\r\n        result = false;\r\n        break;\r\n      }\r\n      // Recursively compare arrays (susceptible to call stack limits).\r\n      if (seen) {\r\n        if (!arraySome(other, function(othValue, othIndex) {\r\n              if (!cacheHas(seen, othIndex) &&\r\n                  (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {\r\n                return seen.push(othIndex);\r\n              }\r\n            })) {\r\n          result = false;\r\n          break;\r\n        }\r\n      } else if (!(\r\n            arrValue === othValue ||\r\n              equalFunc(arrValue, othValue, bitmask, customizer, stack)\r\n          )) {\r\n        result = false;\r\n        break;\r\n      }\r\n    }\r\n    stack['delete'](array);\r\n    stack['delete'](other);\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseIsEqualDeep` for comparing objects of\r\n   * the same `toStringTag`.\r\n   *\r\n   * **Note:** This function only supports comparing values with tags of\r\n   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to compare.\r\n   * @param {Object} other The other object to compare.\r\n   * @param {string} tag The `toStringTag` of the objects to compare.\r\n   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\r\n   * @param {Function} customizer The function to customize comparisons.\r\n   * @param {Function} equalFunc The function to determine equivalents of values.\r\n   * @param {Object} stack Tracks traversed `object` and `other` objects.\r\n   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\r\n   */\r\n  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {\r\n    switch (tag) {\r\n      case dataViewTag:\r\n        if ((object.byteLength != other.byteLength) ||\r\n            (object.byteOffset != other.byteOffset)) {\r\n          return false;\r\n        }\r\n        object = object.buffer;\r\n        other = other.buffer;\r\n\r\n      case arrayBufferTag:\r\n        if ((object.byteLength != other.byteLength) ||\r\n            !equalFunc(new Uint8Array(object), new Uint8Array(other))) {\r\n          return false;\r\n        }\r\n        return true;\r\n\r\n      case boolTag:\r\n      case dateTag:\r\n      case numberTag:\r\n        // Coerce booleans to `1` or `0` and dates to milliseconds.\r\n        // Invalid dates are coerced to `NaN`.\r\n        return eq(+object, +other);\r\n\r\n      case errorTag:\r\n        return object.name == other.name && object.message == other.message;\r\n\r\n      case regexpTag:\r\n      case stringTag:\r\n        // Coerce regexes to strings and treat strings, primitives and objects,\r\n        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring\r\n        // for more details.\r\n        return object == (other + '');\r\n\r\n      case mapTag:\r\n        var convert = mapToArray;\r\n\r\n      case setTag:\r\n        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;\r\n        convert || (convert = setToArray);\r\n\r\n        if (object.size != other.size && !isPartial) {\r\n          return false;\r\n        }\r\n        // Assume cyclic values are equal.\r\n        var stacked = stack.get(object);\r\n        if (stacked) {\r\n          return stacked == other;\r\n        }\r\n        bitmask |= COMPARE_UNORDERED_FLAG;\r\n\r\n        // Recursively compare objects (susceptible to call stack limits).\r\n        stack.set(object, other);\r\n        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);\r\n        stack['delete'](object);\r\n        return result;\r\n\r\n      case symbolTag:\r\n        if (symbolValueOf) {\r\n          return symbolValueOf.call(object) == symbolValueOf.call(other);\r\n        }\r\n    }\r\n    return false;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseIsEqualDeep` for objects with support for\r\n   * partial deep comparisons.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to compare.\r\n   * @param {Object} other The other object to compare.\r\n   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.\r\n   * @param {Function} customizer The function to customize comparisons.\r\n   * @param {Function} equalFunc The function to determine equivalents of values.\r\n   * @param {Object} stack Tracks traversed `object` and `other` objects.\r\n   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.\r\n   */\r\n  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {\r\n    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,\r\n        objProps = getAllKeys(object),\r\n        objLength = objProps.length,\r\n        othProps = getAllKeys(other),\r\n        othLength = othProps.length;\r\n\r\n    if (objLength != othLength && !isPartial) {\r\n      return false;\r\n    }\r\n    var index = objLength;\r\n    while (index--) {\r\n      var key = objProps[index];\r\n      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {\r\n        return false;\r\n      }\r\n    }\r\n    // Assume cyclic values are equal.\r\n    var stacked = stack.get(object);\r\n    if (stacked && stack.get(other)) {\r\n      return stacked == other;\r\n    }\r\n    var result = true;\r\n    stack.set(object, other);\r\n    stack.set(other, object);\r\n\r\n    var skipCtor = isPartial;\r\n    while (++index < objLength) {\r\n      key = objProps[index];\r\n      var objValue = object[key],\r\n          othValue = other[key];\r\n\r\n      if (customizer) {\r\n        var compared = isPartial\r\n          ? customizer(othValue, objValue, key, other, object, stack)\r\n          : customizer(objValue, othValue, key, object, other, stack);\r\n      }\r\n      // Recursively compare objects (susceptible to call stack limits).\r\n      if (!(compared === undefined\r\n            ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))\r\n            : compared\r\n          )) {\r\n        result = false;\r\n        break;\r\n      }\r\n      skipCtor || (skipCtor = key == 'constructor');\r\n    }\r\n    if (result && !skipCtor) {\r\n      var objCtor = object.constructor,\r\n          othCtor = other.constructor;\r\n\r\n      // Non `Object` object instances with different constructors are not equal.\r\n      if (objCtor != othCtor &&\r\n          ('constructor' in object && 'constructor' in other) &&\r\n          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&\r\n            typeof othCtor == 'function' && othCtor instanceof othCtor)) {\r\n        result = false;\r\n      }\r\n    }\r\n    stack['delete'](object);\r\n    stack['delete'](other);\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseRest` which flattens the rest array.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to apply a rest parameter to.\r\n   * @returns {Function} Returns the new function.\r\n   */\r\n  function flatRest(func) {\r\n    return setToString(overRest(func, undefined, flatten), func + '');\r\n  }\r\n\r\n  /**\r\n   * Creates an array of own enumerable property names and symbols of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of property names and symbols.\r\n   */\r\n  function getAllKeys(object) {\r\n    return baseGetAllKeys(object, keys, getSymbols);\r\n  }\r\n\r\n  /**\r\n   * Creates an array of own and inherited enumerable property names and\r\n   * symbols of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of property names and symbols.\r\n   */\r\n  function getAllKeysIn(object) {\r\n    return baseGetAllKeys(object, keysIn, getSymbolsIn);\r\n  }\r\n\r\n  /**\r\n   * Gets metadata for `func`.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to query.\r\n   * @returns {*} Returns the metadata for `func`.\r\n   */\r\n  var getData = !metaMap ? noop : function(func) {\r\n    return metaMap.get(func);\r\n  };\r\n\r\n  /**\r\n   * Gets the name of `func`.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to query.\r\n   * @returns {string} Returns the function name.\r\n   */\r\n  function getFuncName(func) {\r\n    var result = (func.name + ''),\r\n        array = realNames[result],\r\n        length = hasOwnProperty.call(realNames, result) ? array.length : 0;\r\n\r\n    while (length--) {\r\n      var data = array[length],\r\n          otherFunc = data.func;\r\n      if (otherFunc == null || otherFunc == func) {\r\n        return data.name;\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Gets the argument placeholder value for `func`.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to inspect.\r\n   * @returns {*} Returns the placeholder value.\r\n   */\r\n  function getHolder(func) {\r\n    var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;\r\n    return object.placeholder;\r\n  }\r\n\r\n  /**\r\n   * Gets the data for `map`.\r\n   *\r\n   * @private\r\n   * @param {Object} map The map to query.\r\n   * @param {string} key The reference key.\r\n   * @returns {*} Returns the map data.\r\n   */\r\n  function getMapData(map, key) {\r\n    var data = map.__data__;\r\n    return isKeyable(key)\r\n      ? data[typeof key == 'string' ? 'string' : 'hash']\r\n      : data.map;\r\n  }\r\n\r\n  /**\r\n   * Gets the property names, values, and compare flags of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the match data of `object`.\r\n   */\r\n  function getMatchData(object) {\r\n    var result = keys(object),\r\n        length = result.length;\r\n\r\n    while (length--) {\r\n      var key = result[length],\r\n          value = object[key];\r\n\r\n      result[length] = [key, value, isStrictComparable(value)];\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Gets the native function at `key` of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @param {string} key The key of the method to get.\r\n   * @returns {*} Returns the function if it's native, else `undefined`.\r\n   */\r\n  function getNative(object, key) {\r\n    var value = getValue(object, key);\r\n    return baseIsNative(value) ? value : undefined;\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to query.\r\n   * @returns {string} Returns the raw `toStringTag`.\r\n   */\r\n  function getRawTag(value) {\r\n    var isOwn = hasOwnProperty.call(value, symToStringTag),\r\n        tag = value[symToStringTag];\r\n\r\n    try {\r\n      value[symToStringTag] = undefined;\r\n      var unmasked = true;\r\n    } catch (e) {}\r\n\r\n    var result = nativeObjectToString.call(value);\r\n    if (unmasked) {\r\n      if (isOwn) {\r\n        value[symToStringTag] = tag;\r\n      } else {\r\n        delete value[symToStringTag];\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Creates an array of the own enumerable symbols of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of symbols.\r\n   */\r\n  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {\r\n    if (object == null) {\r\n      return [];\r\n    }\r\n    object = Object(object);\r\n    return arrayFilter(nativeGetSymbols(object), function(symbol) {\r\n      return propertyIsEnumerable.call(object, symbol);\r\n    });\r\n  };\r\n\r\n  /**\r\n   * Creates an array of the own and inherited enumerable symbols of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of symbols.\r\n   */\r\n  var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {\r\n    var result = [];\r\n    while (object) {\r\n      arrayPush(result, getSymbols(object));\r\n      object = getPrototype(object);\r\n    }\r\n    return result;\r\n  };\r\n\r\n  /**\r\n   * Gets the `toStringTag` of `value`.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to query.\r\n   * @returns {string} Returns the `toStringTag`.\r\n   */\r\n  var getTag = baseGetTag;\r\n\r\n  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.\r\n  if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||\r\n      (Map && getTag(new Map) != mapTag) ||\r\n      (Promise && getTag(Promise.resolve()) != promiseTag) ||\r\n      (Set && getTag(new Set) != setTag) ||\r\n      (WeakMap && getTag(new WeakMap) != weakMapTag)) {\r\n    getTag = function(value) {\r\n      var result = baseGetTag(value),\r\n          Ctor = result == objectTag ? value.constructor : undefined,\r\n          ctorString = Ctor ? toSource(Ctor) : '';\r\n\r\n      if (ctorString) {\r\n        switch (ctorString) {\r\n          case dataViewCtorString: return dataViewTag;\r\n          case mapCtorString: return mapTag;\r\n          case promiseCtorString: return promiseTag;\r\n          case setCtorString: return setTag;\r\n          case weakMapCtorString: return weakMapTag;\r\n        }\r\n      }\r\n      return result;\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Gets the view, applying any `transforms` to the `start` and `end` positions.\r\n   *\r\n   * @private\r\n   * @param {number} start The start of the view.\r\n   * @param {number} end The end of the view.\r\n   * @param {Array} transforms The transformations to apply to the view.\r\n   * @returns {Object} Returns an object containing the `start` and `end`\r\n   *  positions of the view.\r\n   */\r\n  function getView(start, end, transforms) {\r\n    var index = -1,\r\n        length = transforms.length;\r\n\r\n    while (++index < length) {\r\n      var data = transforms[index],\r\n          size = data.size;\r\n\r\n      switch (data.type) {\r\n        case 'drop':      start += size; break;\r\n        case 'dropRight': end -= size; break;\r\n        case 'take':      end = nativeMin(end, start + size); break;\r\n        case 'takeRight': start = nativeMax(start, end - size); break;\r\n      }\r\n    }\r\n    return { 'start': start, 'end': end };\r\n  }\r\n\r\n  /**\r\n   * Extracts wrapper details from the `source` body comment.\r\n   *\r\n   * @private\r\n   * @param {string} source The source to inspect.\r\n   * @returns {Array} Returns the wrapper details.\r\n   */\r\n  function getWrapDetails(source) {\r\n    var match = source.match(reWrapDetails);\r\n    return match ? match[1].split(reSplitDetails) : [];\r\n  }\r\n\r\n  /**\r\n   * Checks if `path` exists on `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @param {Array|string} path The path to check.\r\n   * @param {Function} hasFunc The function to check properties.\r\n   * @returns {boolean} Returns `true` if `path` exists, else `false`.\r\n   */\r\n  function hasPath(object, path, hasFunc) {\r\n    path = castPath(path, object);\r\n\r\n    var index = -1,\r\n        length = path.length,\r\n        result = false;\r\n\r\n    while (++index < length) {\r\n      var key = toKey(path[index]);\r\n      if (!(result = object != null && hasFunc(object, key))) {\r\n        break;\r\n      }\r\n      object = object[key];\r\n    }\r\n    if (result || ++index != length) {\r\n      return result;\r\n    }\r\n    length = object == null ? 0 : object.length;\r\n    return !!length && isLength(length) && isIndex(key, length) &&\r\n      (isArray(object) || isArguments(object));\r\n  }\r\n\r\n  /**\r\n   * Initializes an array clone.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to clone.\r\n   * @returns {Array} Returns the initialized clone.\r\n   */\r\n  function initCloneArray(array) {\r\n    var length = array.length,\r\n        result = new array.constructor(length);\r\n\r\n    // Add properties assigned by `RegExp#exec`.\r\n    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {\r\n      result.index = array.index;\r\n      result.input = array.input;\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Initializes an object clone.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to clone.\r\n   * @returns {Object} Returns the initialized clone.\r\n   */\r\n  function initCloneObject(object) {\r\n    return (typeof object.constructor == 'function' && !isPrototype(object))\r\n      ? baseCreate(getPrototype(object))\r\n      : {};\r\n  }\r\n\r\n  /**\r\n   * Initializes an object clone based on its `toStringTag`.\r\n   *\r\n   * **Note:** This function only supports cloning values with tags of\r\n   * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to clone.\r\n   * @param {string} tag The `toStringTag` of the object to clone.\r\n   * @param {boolean} [isDeep] Specify a deep clone.\r\n   * @returns {Object} Returns the initialized clone.\r\n   */\r\n  function initCloneByTag(object, tag, isDeep) {\r\n    var Ctor = object.constructor;\r\n    switch (tag) {\r\n      case arrayBufferTag:\r\n        return cloneArrayBuffer(object);\r\n\r\n      case boolTag:\r\n      case dateTag:\r\n        return new Ctor(+object);\r\n\r\n      case dataViewTag:\r\n        return cloneDataView(object, isDeep);\r\n\r\n      case float32Tag: case float64Tag:\r\n      case int8Tag: case int16Tag: case int32Tag:\r\n      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:\r\n        return cloneTypedArray(object, isDeep);\r\n\r\n      case mapTag:\r\n        return new Ctor;\r\n\r\n      case numberTag:\r\n      case stringTag:\r\n        return new Ctor(object);\r\n\r\n      case regexpTag:\r\n        return cloneRegExp(object);\r\n\r\n      case setTag:\r\n        return new Ctor;\r\n\r\n      case symbolTag:\r\n        return cloneSymbol(object);\r\n    }\r\n  }\r\n\r\n  /**\r\n   * Inserts wrapper `details` in a comment at the top of the `source` body.\r\n   *\r\n   * @private\r\n   * @param {string} source The source to modify.\r\n   * @returns {Array} details The details to insert.\r\n   * @returns {string} Returns the modified source.\r\n   */\r\n  function insertWrapDetails(source, details) {\r\n    var length = details.length;\r\n    if (!length) {\r\n      return source;\r\n    }\r\n    var lastIndex = length - 1;\r\n    details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];\r\n    details = details.join(length > 2 ? ', ' : ' ');\r\n    return source.replace(reWrapComment, '{\\n/* [wrapped with ' + details + '] */\\n');\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is a flattenable `arguments` object or array.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.\r\n   */\r\n  function isFlattenable(value) {\r\n    return isArray(value) || isArguments(value) ||\r\n      !!(spreadableSymbol && value && value[spreadableSymbol]);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is a valid array-like index.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.\r\n   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.\r\n   */\r\n  function isIndex(value, length) {\r\n    var type = typeof value;\r\n    length = length == null ? MAX_SAFE_INTEGER : length;\r\n\r\n    return !!length &&\r\n      (type == 'number' ||\r\n        (type != 'symbol' && reIsUint.test(value))) &&\r\n          (value > -1 && value % 1 == 0 && value < length);\r\n  }\r\n\r\n  /**\r\n   * Checks if the given arguments are from an iteratee call.\r\n   *\r\n   * @private\r\n   * @param {*} value The potential iteratee value argument.\r\n   * @param {*} index The potential iteratee index or key argument.\r\n   * @param {*} object The potential iteratee object argument.\r\n   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,\r\n   *  else `false`.\r\n   */\r\n  function isIterateeCall(value, index, object) {\r\n    if (!isObject(object)) {\r\n      return false;\r\n    }\r\n    var type = typeof index;\r\n    if (type == 'number'\r\n          ? (isArrayLike(object) && isIndex(index, object.length))\r\n          : (type == 'string' && index in object)\r\n        ) {\r\n      return eq(object[index], value);\r\n    }\r\n    return false;\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is a property name and not a property path.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @param {Object} [object] The object to query keys on.\r\n   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.\r\n   */\r\n  function isKey(value, object) {\r\n    if (isArray(value)) {\r\n      return false;\r\n    }\r\n    var type = typeof value;\r\n    if (type == 'number' || type == 'symbol' || type == 'boolean' ||\r\n        value == null || isSymbol(value)) {\r\n      return true;\r\n    }\r\n    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||\r\n      (object != null && value in Object(object));\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is suitable for use as unique object key.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.\r\n   */\r\n  function isKeyable(value) {\r\n    var type = typeof value;\r\n    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')\r\n      ? (value !== '__proto__')\r\n      : (value === null);\r\n  }\r\n\r\n  /**\r\n   * Checks if `func` has a lazy counterpart.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to check.\r\n   * @returns {boolean} Returns `true` if `func` has a lazy counterpart,\r\n   *  else `false`.\r\n   */\r\n  function isLaziable(func) {\r\n    var funcName = getFuncName(func),\r\n        other = lodash[funcName];\r\n\r\n    if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {\r\n      return false;\r\n    }\r\n    if (func === other) {\r\n      return true;\r\n    }\r\n    var data = getData(other);\r\n    return !!data && func === data[0];\r\n  }\r\n\r\n  /**\r\n   * Checks if `func` has its source masked.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to check.\r\n   * @returns {boolean} Returns `true` if `func` is masked, else `false`.\r\n   */\r\n  function isMasked(func) {\r\n    return !!maskSrcKey && (maskSrcKey in func);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is likely a prototype object.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.\r\n   */\r\n  function isPrototype(value) {\r\n    var Ctor = value && value.constructor,\r\n        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;\r\n\r\n    return value === proto;\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` if suitable for strict\r\n   *  equality comparisons, else `false`.\r\n   */\r\n  function isStrictComparable(value) {\r\n    return value === value && !isObject(value);\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `matchesProperty` for source values suitable\r\n   * for strict equality comparisons, i.e. `===`.\r\n   *\r\n   * @private\r\n   * @param {string} key The key of the property to get.\r\n   * @param {*} srcValue The value to match.\r\n   * @returns {Function} Returns the new spec function.\r\n   */\r\n  function matchesStrictComparable(key, srcValue) {\r\n    return function(object) {\r\n      if (object == null) {\r\n        return false;\r\n      }\r\n      return object[key] === srcValue &&\r\n        (srcValue !== undefined || (key in Object(object)));\r\n    };\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `_.memoize` which clears the memoized function's\r\n   * cache when it exceeds `MAX_MEMOIZE_SIZE`.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to have its output memoized.\r\n   * @returns {Function} Returns the new memoized function.\r\n   */\r\n  function memoizeCapped(func) {\r\n    var result = memoize(func, function(key) {\r\n      if (cache.size === MAX_MEMOIZE_SIZE) {\r\n        cache.clear();\r\n      }\r\n      return key;\r\n    });\r\n\r\n    var cache = result.cache;\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Merges the function metadata of `source` into `data`.\r\n   *\r\n   * Merging metadata reduces the number of wrappers used to invoke a function.\r\n   * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`\r\n   * may be applied regardless of execution order. Methods like `_.ary` and\r\n   * `_.rearg` modify function arguments, making the order in which they are\r\n   * executed important, preventing the merging of metadata. However, we make\r\n   * an exception for a safe combined case where curried functions have `_.ary`\r\n   * and or `_.rearg` applied.\r\n   *\r\n   * @private\r\n   * @param {Array} data The destination metadata.\r\n   * @param {Array} source The source metadata.\r\n   * @returns {Array} Returns `data`.\r\n   */\r\n  function mergeData(data, source) {\r\n    var bitmask = data[1],\r\n        srcBitmask = source[1],\r\n        newBitmask = bitmask | srcBitmask,\r\n        isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);\r\n\r\n    var isCombo =\r\n      ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||\r\n      ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||\r\n      ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));\r\n\r\n    // Exit early if metadata can't be merged.\r\n    if (!(isCommon || isCombo)) {\r\n      return data;\r\n    }\r\n    // Use source `thisArg` if available.\r\n    if (srcBitmask & WRAP_BIND_FLAG) {\r\n      data[2] = source[2];\r\n      // Set when currying a bound function.\r\n      newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;\r\n    }\r\n    // Compose partial arguments.\r\n    var value = source[3];\r\n    if (value) {\r\n      var partials = data[3];\r\n      data[3] = partials ? composeArgs(partials, value, source[4]) : value;\r\n      data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];\r\n    }\r\n    // Compose partial right arguments.\r\n    value = source[5];\r\n    if (value) {\r\n      partials = data[5];\r\n      data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;\r\n      data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];\r\n    }\r\n    // Use source `argPos` if available.\r\n    value = source[7];\r\n    if (value) {\r\n      data[7] = value;\r\n    }\r\n    // Use source `ary` if it's smaller.\r\n    if (srcBitmask & WRAP_ARY_FLAG) {\r\n      data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);\r\n    }\r\n    // Use source `arity` if one is not provided.\r\n    if (data[9] == null) {\r\n      data[9] = source[9];\r\n    }\r\n    // Use source `func` and merge bitmasks.\r\n    data[0] = source[0];\r\n    data[1] = newBitmask;\r\n\r\n    return data;\r\n  }\r\n\r\n  /**\r\n   * This function is like\r\n   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)\r\n   * except that it includes inherited enumerable properties.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of property names.\r\n   */\r\n  function nativeKeysIn(object) {\r\n    var result = [];\r\n    if (object != null) {\r\n      for (var key in Object(object)) {\r\n        result.push(key);\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Converts `value` to a string using `Object.prototype.toString`.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to convert.\r\n   * @returns {string} Returns the converted string.\r\n   */\r\n  function objectToString(value) {\r\n    return nativeObjectToString.call(value);\r\n  }\r\n\r\n  /**\r\n   * A specialized version of `baseRest` which transforms the rest array.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to apply a rest parameter to.\r\n   * @param {number} [start=func.length-1] The start position of the rest parameter.\r\n   * @param {Function} transform The rest array transform.\r\n   * @returns {Function} Returns the new function.\r\n   */\r\n  function overRest(func, start, transform) {\r\n    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);\r\n    return function() {\r\n      var args = arguments,\r\n          index = -1,\r\n          length = nativeMax(args.length - start, 0),\r\n          array = Array(length);\r\n\r\n      while (++index < length) {\r\n        array[index] = args[start + index];\r\n      }\r\n      index = -1;\r\n      var otherArgs = Array(start + 1);\r\n      while (++index < start) {\r\n        otherArgs[index] = args[index];\r\n      }\r\n      otherArgs[start] = transform(array);\r\n      return apply(func, this, otherArgs);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Gets the parent value at `path` of `object`.\r\n   *\r\n   * @private\r\n   * @param {Object} object The object to query.\r\n   * @param {Array} path The path to get the parent value of.\r\n   * @returns {*} Returns the parent value.\r\n   */\r\n  function parent(object, path) {\r\n    return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));\r\n  }\r\n\r\n  /**\r\n   * Reorder `array` according to the specified indexes where the element at\r\n   * the first index is assigned as the first element, the element at\r\n   * the second index is assigned as the second element, and so on.\r\n   *\r\n   * @private\r\n   * @param {Array} array The array to reorder.\r\n   * @param {Array} indexes The arranged array indexes.\r\n   * @returns {Array} Returns `array`.\r\n   */\r\n  function reorder(array, indexes) {\r\n    var arrLength = array.length,\r\n        length = nativeMin(indexes.length, arrLength),\r\n        oldArray = copyArray(array);\r\n\r\n    while (length--) {\r\n      var index = indexes[length];\r\n      array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;\r\n    }\r\n    return array;\r\n  }\r\n\r\n  /**\r\n   * Sets metadata for `func`.\r\n   *\r\n   * **Note:** If this function becomes hot, i.e. is invoked a lot in a short\r\n   * period of time, it will trip its breaker and transition to an identity\r\n   * function to avoid garbage collection pauses in V8. See\r\n   * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)\r\n   * for more details.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to associate metadata with.\r\n   * @param {*} data The metadata.\r\n   * @returns {Function} Returns `func`.\r\n   */\r\n  var setData = shortOut(baseSetData);\r\n\r\n  /**\r\n   * Sets the `toString` method of `func` to return `string`.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to modify.\r\n   * @param {Function} string The `toString` result.\r\n   * @returns {Function} Returns `func`.\r\n   */\r\n  var setToString = shortOut(baseSetToString);\r\n\r\n  /**\r\n   * Sets the `toString` method of `wrapper` to mimic the source of `reference`\r\n   * with wrapper details in a comment at the top of the source body.\r\n   *\r\n   * @private\r\n   * @param {Function} wrapper The function to modify.\r\n   * @param {Function} reference The reference function.\r\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\r\n   * @returns {Function} Returns `wrapper`.\r\n   */\r\n  function setWrapToString(wrapper, reference, bitmask) {\r\n    var source = (reference + '');\r\n    return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));\r\n  }\r\n\r\n  /**\r\n   * Creates a function that'll short out and invoke `identity` instead\r\n   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`\r\n   * milliseconds.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to restrict.\r\n   * @returns {Function} Returns the new shortable function.\r\n   */\r\n  function shortOut(func) {\r\n    var count = 0,\r\n        lastCalled = 0;\r\n\r\n    return function() {\r\n      var stamp = nativeNow(),\r\n          remaining = HOT_SPAN - (stamp - lastCalled);\r\n\r\n      lastCalled = stamp;\r\n      if (remaining > 0) {\r\n        if (++count >= HOT_COUNT) {\r\n          return arguments[0];\r\n        }\r\n      } else {\r\n        count = 0;\r\n      }\r\n      return func.apply(undefined, arguments);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Converts `string` to a property path array.\r\n   *\r\n   * @private\r\n   * @param {string} string The string to convert.\r\n   * @returns {Array} Returns the property path array.\r\n   */\r\n  var stringToPath = memoizeCapped(function(string) {\r\n    var result = [];\r\n    if (string.charCodeAt(0) === 46 /* . */) {\r\n      result.push('');\r\n    }\r\n    string.replace(rePropName, function(match, number, quote, subString) {\r\n      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));\r\n    });\r\n    return result;\r\n  });\r\n\r\n  /**\r\n   * Converts `value` to a string key if it's not a string or symbol.\r\n   *\r\n   * @private\r\n   * @param {*} value The value to inspect.\r\n   * @returns {string|symbol} Returns the key.\r\n   */\r\n  function toKey(value) {\r\n    if (typeof value == 'string' || isSymbol(value)) {\r\n      return value;\r\n    }\r\n    var result = (value + '');\r\n    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;\r\n  }\r\n\r\n  /**\r\n   * Converts `func` to its source code.\r\n   *\r\n   * @private\r\n   * @param {Function} func The function to convert.\r\n   * @returns {string} Returns the source code.\r\n   */\r\n  function toSource(func) {\r\n    if (func != null) {\r\n      try {\r\n        return funcToString.call(func);\r\n      } catch (e) {}\r\n      try {\r\n        return (func + '');\r\n      } catch (e) {}\r\n    }\r\n    return '';\r\n  }\r\n\r\n  /**\r\n   * Updates wrapper `details` based on `bitmask` flags.\r\n   *\r\n   * @private\r\n   * @returns {Array} details The details to modify.\r\n   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.\r\n   * @returns {Array} Returns `details`.\r\n   */\r\n  function updateWrapDetails(details, bitmask) {\r\n    arrayEach(wrapFlags, function(pair) {\r\n      var value = '_.' + pair[0];\r\n      if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {\r\n        details.push(value);\r\n      }\r\n    });\r\n    return details.sort();\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of `wrapper`.\r\n   *\r\n   * @private\r\n   * @param {Object} wrapper The wrapper to clone.\r\n   * @returns {Object} Returns the cloned wrapper.\r\n   */\r\n  function wrapperClone(wrapper) {\r\n    if (wrapper instanceof LazyWrapper) {\r\n      return wrapper.clone();\r\n    }\r\n    var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);\r\n    result.__actions__ = copyArray(wrapper.__actions__);\r\n    result.__index__  = wrapper.__index__;\r\n    result.__values__ = wrapper.__values__;\r\n    return result;\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates an array with all falsey values removed. The values `false`, `null`,\r\n   * `0`, `\"\"`, `undefined`, and `NaN` are falsey.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to compact.\r\n   * @returns {Array} Returns the new array of filtered values.\r\n   * @example\r\n   *\r\n   * _.compact([0, 1, false, 2, '', 3]);\r\n   * // => [1, 2, 3]\r\n   */\r\n  function compact(array) {\r\n    var index = -1,\r\n        length = array == null ? 0 : array.length,\r\n        resIndex = 0,\r\n        result = [];\r\n\r\n    while (++index < length) {\r\n      var value = array[index];\r\n      if (value) {\r\n        result[resIndex++] = value;\r\n      }\r\n    }\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * Creates a new array concatenating `array` with any additional arrays\r\n   * and/or values.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Array\r\n   * @param {Array} array The array to concatenate.\r\n   * @param {...*} [values] The values to concatenate.\r\n   * @returns {Array} Returns the new concatenated array.\r\n   * @example\r\n   *\r\n   * var array = [1];\r\n   * var other = _.concat(array, 2, [3], [[4]]);\r\n   *\r\n   * console.log(other);\r\n   * // => [1, 2, 3, [4]]\r\n   *\r\n   * console.log(array);\r\n   * // => [1]\r\n   */\r\n  function concat() {\r\n    var length = arguments.length;\r\n    if (!length) {\r\n      return [];\r\n    }\r\n    var args = Array(length - 1),\r\n        array = arguments[0],\r\n        index = length;\r\n\r\n    while (index--) {\r\n      args[index - 1] = arguments[index];\r\n    }\r\n    return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));\r\n  }\r\n\r\n  /**\r\n   * Creates an array of `array` values not included in the other given arrays\r\n   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\r\n   * for equality comparisons. The order and references of result values are\r\n   * determined by the first array.\r\n   *\r\n   * **Note:** Unlike `_.pullAll`, this method returns a new array.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to inspect.\r\n   * @param {...Array} [values] The values to exclude.\r\n   * @returns {Array} Returns the new array of filtered values.\r\n   * @see _.without, _.xor\r\n   * @example\r\n   *\r\n   * _.difference([2, 1], [2, 3]);\r\n   * // => [1]\r\n   */\r\n  var difference = baseRest(function(array, values) {\r\n    return isArrayLikeObject(array)\r\n      ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))\r\n      : [];\r\n  });\r\n\r\n  /**\r\n   * Creates a slice of `array` with `n` elements dropped from the beginning.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.5.0\r\n   * @category Array\r\n   * @param {Array} array The array to query.\r\n   * @param {number} [n=1] The number of elements to drop.\r\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\r\n   * @returns {Array} Returns the slice of `array`.\r\n   * @example\r\n   *\r\n   * _.drop([1, 2, 3]);\r\n   * // => [2, 3]\r\n   *\r\n   * _.drop([1, 2, 3], 2);\r\n   * // => [3]\r\n   *\r\n   * _.drop([1, 2, 3], 5);\r\n   * // => []\r\n   *\r\n   * _.drop([1, 2, 3], 0);\r\n   * // => [1, 2, 3]\r\n   */\r\n  function drop(array, n, guard) {\r\n    var length = array == null ? 0 : array.length;\r\n    if (!length) {\r\n      return [];\r\n    }\r\n    n = (guard || n === undefined) ? 1 : toInteger(n);\r\n    return baseSlice(array, n < 0 ? 0 : n, length);\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.find` except that it returns the index of the first\r\n   * element `predicate` returns truthy for instead of the element itself.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 1.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to inspect.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @param {number} [fromIndex=0] The index to search from.\r\n   * @returns {number} Returns the index of the found element, else `-1`.\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney',  'active': false },\r\n   *   { 'user': 'fred',    'active': false },\r\n   *   { 'user': 'pebbles', 'active': true }\r\n   * ];\r\n   *\r\n   * _.findIndex(users, function(o) { return o.user == 'barney'; });\r\n   * // => 0\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.findIndex(users, { 'user': 'fred', 'active': false });\r\n   * // => 1\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.findIndex(users, ['active', false]);\r\n   * // => 0\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.findIndex(users, 'active');\r\n   * // => 2\r\n   */\r\n  function findIndex(array, predicate, fromIndex) {\r\n    var length = array == null ? 0 : array.length;\r\n    if (!length) {\r\n      return -1;\r\n    }\r\n    var index = fromIndex == null ? 0 : toInteger(fromIndex);\r\n    if (index < 0) {\r\n      index = nativeMax(length + index, 0);\r\n    }\r\n    return baseFindIndex(array, baseIteratee(predicate, 3), index);\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.findIndex` except that it iterates over elements\r\n   * of `collection` from right to left.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 2.0.0\r\n   * @category Array\r\n   * @param {Array} array The array to inspect.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @param {number} [fromIndex=array.length-1] The index to search from.\r\n   * @returns {number} Returns the index of the found element, else `-1`.\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney',  'active': true },\r\n   *   { 'user': 'fred',    'active': false },\r\n   *   { 'user': 'pebbles', 'active': false }\r\n   * ];\r\n   *\r\n   * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });\r\n   * // => 2\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.findLastIndex(users, { 'user': 'barney', 'active': true });\r\n   * // => 0\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.findLastIndex(users, ['active', false]);\r\n   * // => 2\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.findLastIndex(users, 'active');\r\n   * // => 0\r\n   */\r\n  function findLastIndex(array, predicate, fromIndex) {\r\n    var length = array == null ? 0 : array.length;\r\n    if (!length) {\r\n      return -1;\r\n    }\r\n    var index = length - 1;\r\n    if (fromIndex !== undefined) {\r\n      index = toInteger(fromIndex);\r\n      index = fromIndex < 0\r\n        ? nativeMax(length + index, 0)\r\n        : nativeMin(index, length - 1);\r\n    }\r\n    return baseFindIndex(array, baseIteratee(predicate, 3), index, true);\r\n  }\r\n\r\n  /**\r\n   * Flattens `array` a single level deep.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to flatten.\r\n   * @returns {Array} Returns the new flattened array.\r\n   * @example\r\n   *\r\n   * _.flatten([1, [2, [3, [4]], 5]]);\r\n   * // => [1, 2, [3, [4]], 5]\r\n   */\r\n  function flatten(array) {\r\n    var length = array == null ? 0 : array.length;\r\n    return length ? baseFlatten(array, 1) : [];\r\n  }\r\n\r\n  /**\r\n   * Recursively flattens `array`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Array\r\n   * @param {Array} array The array to flatten.\r\n   * @returns {Array} Returns the new flattened array.\r\n   * @example\r\n   *\r\n   * _.flattenDeep([1, [2, [3, [4]], 5]]);\r\n   * // => [1, 2, 3, 4, 5]\r\n   */\r\n  function flattenDeep(array) {\r\n    var length = array == null ? 0 : array.length;\r\n    return length ? baseFlatten(array, INFINITY) : [];\r\n  }\r\n\r\n  /**\r\n   * Gets the first element of `array`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @alias first\r\n   * @category Array\r\n   * @param {Array} array The array to query.\r\n   * @returns {*} Returns the first element of `array`.\r\n   * @example\r\n   *\r\n   * _.head([1, 2, 3]);\r\n   * // => 1\r\n   *\r\n   * _.head([]);\r\n   * // => undefined\r\n   */\r\n  function head(array) {\r\n    return (array && array.length) ? array[0] : undefined;\r\n  }\r\n\r\n  /**\r\n   * Gets the index at which the first occurrence of `value` is found in `array`\r\n   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\r\n   * for equality comparisons. If `fromIndex` is negative, it's used as the\r\n   * offset from the end of `array`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to inspect.\r\n   * @param {*} value The value to search for.\r\n   * @param {number} [fromIndex=0] The index to search from.\r\n   * @returns {number} Returns the index of the matched value, else `-1`.\r\n   * @example\r\n   *\r\n   * _.indexOf([1, 2, 1, 2], 2);\r\n   * // => 1\r\n   *\r\n   * // Search from the `fromIndex`.\r\n   * _.indexOf([1, 2, 1, 2], 2, 2);\r\n   * // => 3\r\n   */\r\n  function indexOf(array, value, fromIndex) {\r\n    var length = array == null ? 0 : array.length;\r\n    if (!length) {\r\n      return -1;\r\n    }\r\n    var index = fromIndex == null ? 0 : toInteger(fromIndex);\r\n    if (index < 0) {\r\n      index = nativeMax(length + index, 0);\r\n    }\r\n    return baseIndexOf(array, value, index);\r\n  }\r\n\r\n  /**\r\n   * Gets all but the last element of `array`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to query.\r\n   * @returns {Array} Returns the slice of `array`.\r\n   * @example\r\n   *\r\n   * _.initial([1, 2, 3]);\r\n   * // => [1, 2]\r\n   */\r\n  function initial(array) {\r\n    var length = array == null ? 0 : array.length;\r\n    return length ? baseSlice(array, 0, -1) : [];\r\n  }\r\n\r\n  /**\r\n   * Creates an array of unique values that are included in all given arrays\r\n   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\r\n   * for equality comparisons. The order and references of result values are\r\n   * determined by the first array.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {...Array} [arrays] The arrays to inspect.\r\n   * @returns {Array} Returns the new array of intersecting values.\r\n   * @example\r\n   *\r\n   * _.intersection([2, 1], [2, 3]);\r\n   * // => [2]\r\n   */\r\n  var intersection = baseRest(function(arrays) {\r\n    var mapped = arrayMap(arrays, castArrayLikeObject);\r\n    return (mapped.length && mapped[0] === arrays[0])\r\n      ? baseIntersection(mapped)\r\n      : [];\r\n  });\r\n\r\n  /**\r\n   * Gets the last element of `array`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to query.\r\n   * @returns {*} Returns the last element of `array`.\r\n   * @example\r\n   *\r\n   * _.last([1, 2, 3]);\r\n   * // => 3\r\n   */\r\n  function last(array) {\r\n    var length = array == null ? 0 : array.length;\r\n    return length ? array[length - 1] : undefined;\r\n  }\r\n\r\n  /**\r\n   * Reverses `array` so that the first element becomes the last, the second\r\n   * element becomes the second to last, and so on.\r\n   *\r\n   * **Note:** This method mutates `array` and is based on\r\n   * [`Array#reverse`](https://mdn.io/Array/reverse).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Array\r\n   * @param {Array} array The array to modify.\r\n   * @returns {Array} Returns `array`.\r\n   * @example\r\n   *\r\n   * var array = [1, 2, 3];\r\n   *\r\n   * _.reverse(array);\r\n   * // => [3, 2, 1]\r\n   *\r\n   * console.log(array);\r\n   * // => [3, 2, 1]\r\n   */\r\n  function reverse(array) {\r\n    return array == null ? array : nativeReverse.call(array);\r\n  }\r\n\r\n  /**\r\n   * Creates a slice of `array` from `start` up to, but not including, `end`.\r\n   *\r\n   * **Note:** This method is used instead of\r\n   * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are\r\n   * returned.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Array\r\n   * @param {Array} array The array to slice.\r\n   * @param {number} [start=0] The start position.\r\n   * @param {number} [end=array.length] The end position.\r\n   * @returns {Array} Returns the slice of `array`.\r\n   */\r\n  function slice(array, start, end) {\r\n    var length = array == null ? 0 : array.length;\r\n    if (!length) {\r\n      return [];\r\n    }\r\n    if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {\r\n      start = 0;\r\n      end = length;\r\n    }\r\n    else {\r\n      start = start == null ? 0 : toInteger(start);\r\n      end = end === undefined ? length : toInteger(end);\r\n    }\r\n    return baseSlice(array, start, end);\r\n  }\r\n\r\n  /**\r\n   * Creates a slice of `array` with `n` elements taken from the beginning.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to query.\r\n   * @param {number} [n=1] The number of elements to take.\r\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\r\n   * @returns {Array} Returns the slice of `array`.\r\n   * @example\r\n   *\r\n   * _.take([1, 2, 3]);\r\n   * // => [1]\r\n   *\r\n   * _.take([1, 2, 3], 2);\r\n   * // => [1, 2]\r\n   *\r\n   * _.take([1, 2, 3], 5);\r\n   * // => [1, 2, 3]\r\n   *\r\n   * _.take([1, 2, 3], 0);\r\n   * // => []\r\n   */\r\n  function take(array, n, guard) {\r\n    if (!(array && array.length)) {\r\n      return [];\r\n    }\r\n    n = (guard || n === undefined) ? 1 : toInteger(n);\r\n    return baseSlice(array, 0, n < 0 ? 0 : n);\r\n  }\r\n\r\n  /**\r\n   * Creates a slice of `array` with `n` elements taken from the end.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Array\r\n   * @param {Array} array The array to query.\r\n   * @param {number} [n=1] The number of elements to take.\r\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\r\n   * @returns {Array} Returns the slice of `array`.\r\n   * @example\r\n   *\r\n   * _.takeRight([1, 2, 3]);\r\n   * // => [3]\r\n   *\r\n   * _.takeRight([1, 2, 3], 2);\r\n   * // => [2, 3]\r\n   *\r\n   * _.takeRight([1, 2, 3], 5);\r\n   * // => [1, 2, 3]\r\n   *\r\n   * _.takeRight([1, 2, 3], 0);\r\n   * // => []\r\n   */\r\n  function takeRight(array, n, guard) {\r\n    var length = array == null ? 0 : array.length;\r\n    if (!length) {\r\n      return [];\r\n    }\r\n    n = (guard || n === undefined) ? 1 : toInteger(n);\r\n    n = length - n;\r\n    return baseSlice(array, n < 0 ? 0 : n, length);\r\n  }\r\n\r\n  /**\r\n   * Creates an array of unique values, in order, from all given arrays using\r\n   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\r\n   * for equality comparisons.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {...Array} [arrays] The arrays to inspect.\r\n   * @returns {Array} Returns the new array of combined values.\r\n   * @example\r\n   *\r\n   * _.union([2], [1, 2]);\r\n   * // => [2, 1]\r\n   */\r\n  var union = baseRest(function(arrays) {\r\n    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));\r\n  });\r\n\r\n  /**\r\n   * Creates a duplicate-free version of an array, using\r\n   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\r\n   * for equality comparisons, in which only the first occurrence of each element\r\n   * is kept. The order of result values is determined by the order they occur\r\n   * in the array.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to inspect.\r\n   * @returns {Array} Returns the new duplicate free array.\r\n   * @example\r\n   *\r\n   * _.uniq([2, 1, 2]);\r\n   * // => [2, 1]\r\n   */\r\n  function uniq(array) {\r\n    return (array && array.length) ? baseUniq(array) : [];\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.uniq` except that it accepts `iteratee` which is\r\n   * invoked for each element in `array` to generate the criterion by which\r\n   * uniqueness is computed. The order of result values is determined by the\r\n   * order they occur in the array. The iteratee is invoked with one argument:\r\n   * (value).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Array\r\n   * @param {Array} array The array to inspect.\r\n   * @param {Function} [iteratee=_.identity] The iteratee invoked per element.\r\n   * @returns {Array} Returns the new duplicate free array.\r\n   * @example\r\n   *\r\n   * _.uniqBy([2.1, 1.2, 2.3], Math.floor);\r\n   * // => [2.1, 1.2]\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');\r\n   * // => [{ 'x': 1 }, { 'x': 2 }]\r\n   */\r\n  function uniqBy(array, iteratee) {\r\n    return (array && array.length) ? baseUniq(array, baseIteratee(iteratee, 2)) : [];\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.zip` except that it accepts an array of grouped\r\n   * elements and creates an array regrouping the elements to their pre-zip\r\n   * configuration.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 1.2.0\r\n   * @category Array\r\n   * @param {Array} array The array of grouped elements to process.\r\n   * @returns {Array} Returns the new array of regrouped elements.\r\n   * @example\r\n   *\r\n   * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);\r\n   * // => [['a', 1, true], ['b', 2, false]]\r\n   *\r\n   * _.unzip(zipped);\r\n   * // => [['a', 'b'], [1, 2], [true, false]]\r\n   */\r\n  function unzip(array) {\r\n    if (!(array && array.length)) {\r\n      return [];\r\n    }\r\n    var length = 0;\r\n    array = arrayFilter(array, function(group) {\r\n      if (isArrayLikeObject(group)) {\r\n        length = nativeMax(group.length, length);\r\n        return true;\r\n      }\r\n    });\r\n    return baseTimes(length, function(index) {\r\n      return arrayMap(array, baseProperty(index));\r\n    });\r\n  }\r\n\r\n  /**\r\n   * Creates an array excluding all given values using\r\n   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\r\n   * for equality comparisons.\r\n   *\r\n   * **Note:** Unlike `_.pull`, this method returns a new array.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {Array} array The array to inspect.\r\n   * @param {...*} [values] The values to exclude.\r\n   * @returns {Array} Returns the new array of filtered values.\r\n   * @see _.difference, _.xor\r\n   * @example\r\n   *\r\n   * _.without([2, 1, 2, 3], 1, 2);\r\n   * // => [3]\r\n   */\r\n  var without = baseRest(function(array, values) {\r\n    return isArrayLikeObject(array)\r\n      ? baseDifference(array, values)\r\n      : [];\r\n  });\r\n\r\n  /**\r\n   * Creates an array of grouped elements, the first of which contains the\r\n   * first elements of the given arrays, the second of which contains the\r\n   * second elements of the given arrays, and so on.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Array\r\n   * @param {...Array} [arrays] The arrays to process.\r\n   * @returns {Array} Returns the new array of grouped elements.\r\n   * @example\r\n   *\r\n   * _.zip(['a', 'b'], [1, 2], [true, false]);\r\n   * // => [['a', 1, true], ['b', 2, false]]\r\n   */\r\n  var zip = baseRest(unzip);\r\n\r\n  /**\r\n   * This method is like `_.fromPairs` except that it accepts two arrays,\r\n   * one of property identifiers and one of corresponding values.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.4.0\r\n   * @category Array\r\n   * @param {Array} [props=[]] The property identifiers.\r\n   * @param {Array} [values=[]] The property values.\r\n   * @returns {Object} Returns the new object.\r\n   * @example\r\n   *\r\n   * _.zipObject(['a', 'b'], [1, 2]);\r\n   * // => { 'a': 1, 'b': 2 }\r\n   */\r\n  function zipObject(props, values) {\r\n    return baseZipObject(props || [], values || [], assignValue);\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates a `lodash` wrapper instance that wraps `value` with explicit method\r\n   * chain sequences enabled. The result of such sequences must be unwrapped\r\n   * with `_#value`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 1.3.0\r\n   * @category Seq\r\n   * @param {*} value The value to wrap.\r\n   * @returns {Object} Returns the new `lodash` wrapper instance.\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney',  'age': 36 },\r\n   *   { 'user': 'fred',    'age': 40 },\r\n   *   { 'user': 'pebbles', 'age': 1 }\r\n   * ];\r\n   *\r\n   * var youngest = _\r\n   *   .chain(users)\r\n   *   .sortBy('age')\r\n   *   .map(function(o) {\r\n   *     return o.user + ' is ' + o.age;\r\n   *   })\r\n   *   .head()\r\n   *   .value();\r\n   * // => 'pebbles is 1'\r\n   */\r\n  function chain(value) {\r\n    var result = lodash(value);\r\n    result.__chain__ = true;\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * This method invokes `interceptor` and returns `value`. The interceptor\r\n   * is invoked with one argument; (value). The purpose of this method is to\r\n   * \"tap into\" a method chain sequence in order to modify intermediate results.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Seq\r\n   * @param {*} value The value to provide to `interceptor`.\r\n   * @param {Function} interceptor The function to invoke.\r\n   * @returns {*} Returns `value`.\r\n   * @example\r\n   *\r\n   * _([1, 2, 3])\r\n   *  .tap(function(array) {\r\n   *    // Mutate input array.\r\n   *    array.pop();\r\n   *  })\r\n   *  .reverse()\r\n   *  .value();\r\n   * // => [2, 1]\r\n   */\r\n  function tap(value, interceptor) {\r\n    interceptor(value);\r\n    return value;\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.tap` except that it returns the result of `interceptor`.\r\n   * The purpose of this method is to \"pass thru\" values replacing intermediate\r\n   * results in a method chain sequence.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Seq\r\n   * @param {*} value The value to provide to `interceptor`.\r\n   * @param {Function} interceptor The function to invoke.\r\n   * @returns {*} Returns the result of `interceptor`.\r\n   * @example\r\n   *\r\n   * _('  abc  ')\r\n   *  .chain()\r\n   *  .trim()\r\n   *  .thru(function(value) {\r\n   *    return [value];\r\n   *  })\r\n   *  .value();\r\n   * // => ['abc']\r\n   */\r\n  function thru(value, interceptor) {\r\n    return interceptor(value);\r\n  }\r\n\r\n  /**\r\n   * This method is the wrapper version of `_.at`.\r\n   *\r\n   * @name at\r\n   * @memberOf _\r\n   * @since 1.0.0\r\n   * @category Seq\r\n   * @param {...(string|string[])} [paths] The property paths to pick.\r\n   * @returns {Object} Returns the new `lodash` wrapper instance.\r\n   * @example\r\n   *\r\n   * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };\r\n   *\r\n   * _(object).at(['a[0].b.c', 'a[1]']).value();\r\n   * // => [3, 4]\r\n   */\r\n  var wrapperAt = flatRest(function(paths) {\r\n    var length = paths.length,\r\n        start = length ? paths[0] : 0,\r\n        value = this.__wrapped__,\r\n        interceptor = function(object) { return baseAt(object, paths); };\r\n\r\n    if (length > 1 || this.__actions__.length ||\r\n        !(value instanceof LazyWrapper) || !isIndex(start)) {\r\n      return this.thru(interceptor);\r\n    }\r\n    value = value.slice(start, +start + (length ? 1 : 0));\r\n    value.__actions__.push({\r\n      'func': thru,\r\n      'args': [interceptor],\r\n      'thisArg': undefined\r\n    });\r\n    return new LodashWrapper(value, this.__chain__).thru(function(array) {\r\n      if (length && !array.length) {\r\n        array.push(undefined);\r\n      }\r\n      return array;\r\n    });\r\n  });\r\n\r\n  /**\r\n   * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.\r\n   *\r\n   * @name chain\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Seq\r\n   * @returns {Object} Returns the new `lodash` wrapper instance.\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney', 'age': 36 },\r\n   *   { 'user': 'fred',   'age': 40 }\r\n   * ];\r\n   *\r\n   * // A sequence without explicit chaining.\r\n   * _(users).head();\r\n   * // => { 'user': 'barney', 'age': 36 }\r\n   *\r\n   * // A sequence with explicit chaining.\r\n   * _(users)\r\n   *   .chain()\r\n   *   .head()\r\n   *   .pick('user')\r\n   *   .value();\r\n   * // => { 'user': 'barney' }\r\n   */\r\n  function wrapperChain() {\r\n    return chain(this);\r\n  }\r\n\r\n  /**\r\n   * Executes the chain sequence and returns the wrapped result.\r\n   *\r\n   * @name commit\r\n   * @memberOf _\r\n   * @since 3.2.0\r\n   * @category Seq\r\n   * @returns {Object} Returns the new `lodash` wrapper instance.\r\n   * @example\r\n   *\r\n   * var array = [1, 2];\r\n   * var wrapped = _(array).push(3);\r\n   *\r\n   * console.log(array);\r\n   * // => [1, 2]\r\n   *\r\n   * wrapped = wrapped.commit();\r\n   * console.log(array);\r\n   * // => [1, 2, 3]\r\n   *\r\n   * wrapped.last();\r\n   * // => 3\r\n   *\r\n   * console.log(array);\r\n   * // => [1, 2, 3]\r\n   */\r\n  function wrapperCommit() {\r\n    return new LodashWrapper(this.value(), this.__chain__);\r\n  }\r\n\r\n  /**\r\n   * Gets the next value on a wrapped object following the\r\n   * [iterator protocol](https://mdn.io/iteration_protocols#iterator).\r\n   *\r\n   * @name next\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Seq\r\n   * @returns {Object} Returns the next iterator value.\r\n   * @example\r\n   *\r\n   * var wrapped = _([1, 2]);\r\n   *\r\n   * wrapped.next();\r\n   * // => { 'done': false, 'value': 1 }\r\n   *\r\n   * wrapped.next();\r\n   * // => { 'done': false, 'value': 2 }\r\n   *\r\n   * wrapped.next();\r\n   * // => { 'done': true, 'value': undefined }\r\n   */\r\n  function wrapperNext() {\r\n    if (this.__values__ === undefined) {\r\n      this.__values__ = toArray(this.value());\r\n    }\r\n    var done = this.__index__ >= this.__values__.length,\r\n        value = done ? undefined : this.__values__[this.__index__++];\r\n\r\n    return { 'done': done, 'value': value };\r\n  }\r\n\r\n  /**\r\n   * Enables the wrapper to be iterable.\r\n   *\r\n   * @name Symbol.iterator\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Seq\r\n   * @returns {Object} Returns the wrapper object.\r\n   * @example\r\n   *\r\n   * var wrapped = _([1, 2]);\r\n   *\r\n   * wrapped[Symbol.iterator]() === wrapped;\r\n   * // => true\r\n   *\r\n   * Array.from(wrapped);\r\n   * // => [1, 2]\r\n   */\r\n  function wrapperToIterator() {\r\n    return this;\r\n  }\r\n\r\n  /**\r\n   * Creates a clone of the chain sequence planting `value` as the wrapped value.\r\n   *\r\n   * @name plant\r\n   * @memberOf _\r\n   * @since 3.2.0\r\n   * @category Seq\r\n   * @param {*} value The value to plant.\r\n   * @returns {Object} Returns the new `lodash` wrapper instance.\r\n   * @example\r\n   *\r\n   * function square(n) {\r\n   *   return n * n;\r\n   * }\r\n   *\r\n   * var wrapped = _([1, 2]).map(square);\r\n   * var other = wrapped.plant([3, 4]);\r\n   *\r\n   * other.value();\r\n   * // => [9, 16]\r\n   *\r\n   * wrapped.value();\r\n   * // => [1, 4]\r\n   */\r\n  function wrapperPlant(value) {\r\n    var result,\r\n        parent = this;\r\n\r\n    while (parent instanceof baseLodash) {\r\n      var clone = wrapperClone(parent);\r\n      clone.__index__ = 0;\r\n      clone.__values__ = undefined;\r\n      if (result) {\r\n        previous.__wrapped__ = clone;\r\n      } else {\r\n        result = clone;\r\n      }\r\n      var previous = clone;\r\n      parent = parent.__wrapped__;\r\n    }\r\n    previous.__wrapped__ = value;\r\n    return result;\r\n  }\r\n\r\n  /**\r\n   * This method is the wrapper version of `_.reverse`.\r\n   *\r\n   * **Note:** This method mutates the wrapped array.\r\n   *\r\n   * @name reverse\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Seq\r\n   * @returns {Object} Returns the new `lodash` wrapper instance.\r\n   * @example\r\n   *\r\n   * var array = [1, 2, 3];\r\n   *\r\n   * _(array).reverse().value()\r\n   * // => [3, 2, 1]\r\n   *\r\n   * console.log(array);\r\n   * // => [3, 2, 1]\r\n   */\r\n  function wrapperReverse() {\r\n    var value = this.__wrapped__;\r\n    if (value instanceof LazyWrapper) {\r\n      var wrapped = value;\r\n      if (this.__actions__.length) {\r\n        wrapped = new LazyWrapper(this);\r\n      }\r\n      wrapped = wrapped.reverse();\r\n      wrapped.__actions__.push({\r\n        'func': thru,\r\n        'args': [reverse],\r\n        'thisArg': undefined\r\n      });\r\n      return new LodashWrapper(wrapped, this.__chain__);\r\n    }\r\n    return this.thru(reverse);\r\n  }\r\n\r\n  /**\r\n   * Executes the chain sequence to resolve the unwrapped value.\r\n   *\r\n   * @name value\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @alias toJSON, valueOf\r\n   * @category Seq\r\n   * @returns {*} Returns the resolved unwrapped value.\r\n   * @example\r\n   *\r\n   * _([1, 2, 3]).value();\r\n   * // => [1, 2, 3]\r\n   */\r\n  function wrapperValue() {\r\n    return baseWrapperValue(this.__wrapped__, this.__actions__);\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates an object composed of keys generated from the results of running\r\n   * each element of `collection` thru `iteratee`. The corresponding value of\r\n   * each key is the number of times the key was returned by `iteratee`. The\r\n   * iteratee is invoked with one argument: (value).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.5.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [iteratee=_.identity] The iteratee to transform keys.\r\n   * @returns {Object} Returns the composed aggregate object.\r\n   * @example\r\n   *\r\n   * _.countBy([6.1, 4.2, 6.3], Math.floor);\r\n   * // => { '4': 1, '6': 2 }\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.countBy(['one', 'two', 'three'], 'length');\r\n   * // => { '3': 2, '5': 1 }\r\n   */\r\n  var countBy = createAggregator(function(result, value, key) {\r\n    if (hasOwnProperty.call(result, key)) {\r\n      ++result[key];\r\n    } else {\r\n      baseAssignValue(result, key, 1);\r\n    }\r\n  });\r\n\r\n  /**\r\n   * Checks if `predicate` returns truthy for **all** elements of `collection`.\r\n   * Iteration is stopped once `predicate` returns falsey. The predicate is\r\n   * invoked with three arguments: (value, index|key, collection).\r\n   *\r\n   * **Note:** This method returns `true` for\r\n   * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because\r\n   * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of\r\n   * elements of empty collections.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\r\n   * @returns {boolean} Returns `true` if all elements pass the predicate check,\r\n   *  else `false`.\r\n   * @example\r\n   *\r\n   * _.every([true, 1, null, 'yes'], Boolean);\r\n   * // => false\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney', 'age': 36, 'active': false },\r\n   *   { 'user': 'fred',   'age': 40, 'active': false }\r\n   * ];\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.every(users, { 'user': 'barney', 'active': false });\r\n   * // => false\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.every(users, ['active', false]);\r\n   * // => true\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.every(users, 'active');\r\n   * // => false\r\n   */\r\n  function every(collection, predicate, guard) {\r\n    var func = isArray(collection) ? arrayEvery : baseEvery;\r\n    if (guard && isIterateeCall(collection, predicate, guard)) {\r\n      predicate = undefined;\r\n    }\r\n    return func(collection, baseIteratee(predicate, 3));\r\n  }\r\n\r\n  /**\r\n   * Iterates over elements of `collection`, returning an array of all elements\r\n   * `predicate` returns truthy for. The predicate is invoked with three\r\n   * arguments: (value, index|key, collection).\r\n   *\r\n   * **Note:** Unlike `_.remove`, this method returns a new array.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @returns {Array} Returns the new filtered array.\r\n   * @see _.reject\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney', 'age': 36, 'active': true },\r\n   *   { 'user': 'fred',   'age': 40, 'active': false }\r\n   * ];\r\n   *\r\n   * _.filter(users, function(o) { return !o.active; });\r\n   * // => objects for ['fred']\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.filter(users, { 'age': 36, 'active': true });\r\n   * // => objects for ['barney']\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.filter(users, ['active', false]);\r\n   * // => objects for ['fred']\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.filter(users, 'active');\r\n   * // => objects for ['barney']\r\n   */\r\n  function filter(collection, predicate) {\r\n    var func = isArray(collection) ? arrayFilter : baseFilter;\r\n    return func(collection, baseIteratee(predicate, 3));\r\n  }\r\n\r\n  /**\r\n   * Iterates over elements of `collection`, returning the first element\r\n   * `predicate` returns truthy for. The predicate is invoked with three\r\n   * arguments: (value, index|key, collection).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to inspect.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @param {number} [fromIndex=0] The index to search from.\r\n   * @returns {*} Returns the matched element, else `undefined`.\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney',  'age': 36, 'active': true },\r\n   *   { 'user': 'fred',    'age': 40, 'active': false },\r\n   *   { 'user': 'pebbles', 'age': 1,  'active': true }\r\n   * ];\r\n   *\r\n   * _.find(users, function(o) { return o.age < 40; });\r\n   * // => object for 'barney'\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.find(users, { 'age': 1, 'active': true });\r\n   * // => object for 'pebbles'\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.find(users, ['active', false]);\r\n   * // => object for 'fred'\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.find(users, 'active');\r\n   * // => object for 'barney'\r\n   */\r\n  var find = createFind(findIndex);\r\n\r\n  /**\r\n   * Iterates over elements of `collection` and invokes `iteratee` for each element.\r\n   * The iteratee is invoked with three arguments: (value, index|key, collection).\r\n   * Iteratee functions may exit iteration early by explicitly returning `false`.\r\n   *\r\n   * **Note:** As with other \"Collections\" methods, objects with a \"length\"\r\n   * property are iterated like arrays. To avoid this behavior use `_.forIn`\r\n   * or `_.forOwn` for object iteration.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @alias each\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [iteratee=_.identity] The function invoked per iteration.\r\n   * @returns {Array|Object} Returns `collection`.\r\n   * @see _.forEachRight\r\n   * @example\r\n   *\r\n   * _.forEach([1, 2], function(value) {\r\n   *   console.log(value);\r\n   * });\r\n   * // => Logs `1` then `2`.\r\n   *\r\n   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {\r\n   *   console.log(key);\r\n   * });\r\n   * // => Logs 'a' then 'b' (iteration order is not guaranteed).\r\n   */\r\n  function forEach(collection, iteratee) {\r\n    var func = isArray(collection) ? arrayEach : baseEach;\r\n    return func(collection, baseIteratee(iteratee, 3));\r\n  }\r\n\r\n  /**\r\n   * Creates an object composed of keys generated from the results of running\r\n   * each element of `collection` thru `iteratee`. The order of grouped values\r\n   * is determined by the order they occur in `collection`. The corresponding\r\n   * value of each key is an array of elements responsible for generating the\r\n   * key. The iteratee is invoked with one argument: (value).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [iteratee=_.identity] The iteratee to transform keys.\r\n   * @returns {Object} Returns the composed aggregate object.\r\n   * @example\r\n   *\r\n   * _.groupBy([6.1, 4.2, 6.3], Math.floor);\r\n   * // => { '4': [4.2], '6': [6.1, 6.3] }\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.groupBy(['one', 'two', 'three'], 'length');\r\n   * // => { '3': ['one', 'two'], '5': ['three'] }\r\n   */\r\n  var groupBy = createAggregator(function(result, value, key) {\r\n    if (hasOwnProperty.call(result, key)) {\r\n      result[key].push(value);\r\n    } else {\r\n      baseAssignValue(result, key, [value]);\r\n    }\r\n  });\r\n\r\n  /**\r\n   * Creates an array of values by running each element in `collection` thru\r\n   * `iteratee`. The iteratee is invoked with three arguments:\r\n   * (value, index|key, collection).\r\n   *\r\n   * Many lodash methods are guarded to work as iteratees for methods like\r\n   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.\r\n   *\r\n   * The guarded methods are:\r\n   * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,\r\n   * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,\r\n   * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,\r\n   * `template`, `trim`, `trimEnd`, `trimStart`, and `words`\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [iteratee=_.identity] The function invoked per iteration.\r\n   * @returns {Array} Returns the new mapped array.\r\n   * @example\r\n   *\r\n   * function square(n) {\r\n   *   return n * n;\r\n   * }\r\n   *\r\n   * _.map([4, 8], square);\r\n   * // => [16, 64]\r\n   *\r\n   * _.map({ 'a': 4, 'b': 8 }, square);\r\n   * // => [16, 64] (iteration order is not guaranteed)\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney' },\r\n   *   { 'user': 'fred' }\r\n   * ];\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.map(users, 'user');\r\n   * // => ['barney', 'fred']\r\n   */\r\n  function map(collection, iteratee) {\r\n    var func = isArray(collection) ? arrayMap : baseMap;\r\n    return func(collection, baseIteratee(iteratee, 3));\r\n  }\r\n\r\n  /**\r\n   * Reduces `collection` to a value which is the accumulated result of running\r\n   * each element in `collection` thru `iteratee`, where each successive\r\n   * invocation is supplied the return value of the previous. If `accumulator`\r\n   * is not given, the first element of `collection` is used as the initial\r\n   * value. The iteratee is invoked with four arguments:\r\n   * (accumulator, value, index|key, collection).\r\n   *\r\n   * Many lodash methods are guarded to work as iteratees for methods like\r\n   * `_.reduce`, `_.reduceRight`, and `_.transform`.\r\n   *\r\n   * The guarded methods are:\r\n   * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,\r\n   * and `sortBy`\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [iteratee=_.identity] The function invoked per iteration.\r\n   * @param {*} [accumulator] The initial value.\r\n   * @returns {*} Returns the accumulated value.\r\n   * @see _.reduceRight\r\n   * @example\r\n   *\r\n   * _.reduce([1, 2], function(sum, n) {\r\n   *   return sum + n;\r\n   * }, 0);\r\n   * // => 3\r\n   *\r\n   * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {\r\n   *   (result[value] || (result[value] = [])).push(key);\r\n   *   return result;\r\n   * }, {});\r\n   * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)\r\n   */\r\n  function reduce(collection, iteratee, accumulator) {\r\n    var func = isArray(collection) ? arrayReduce : baseReduce,\r\n        initAccum = arguments.length < 3;\r\n\r\n    return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);\r\n  }\r\n\r\n  /**\r\n   * The opposite of `_.filter`; this method returns the elements of `collection`\r\n   * that `predicate` does **not** return truthy for.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @returns {Array} Returns the new filtered array.\r\n   * @see _.filter\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney', 'age': 36, 'active': false },\r\n   *   { 'user': 'fred',   'age': 40, 'active': true }\r\n   * ];\r\n   *\r\n   * _.reject(users, function(o) { return !o.active; });\r\n   * // => objects for ['fred']\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.reject(users, { 'age': 40, 'active': true });\r\n   * // => objects for ['barney']\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.reject(users, ['active', false]);\r\n   * // => objects for ['fred']\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.reject(users, 'active');\r\n   * // => objects for ['barney']\r\n   */\r\n  function reject(collection, predicate) {\r\n    var func = isArray(collection) ? arrayFilter : baseFilter;\r\n    return func(collection, negate(baseIteratee(predicate, 3)));\r\n  }\r\n\r\n  /**\r\n   * Gets the size of `collection` by returning its length for array-like\r\n   * values or the number of own enumerable string keyed properties for objects.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object|string} collection The collection to inspect.\r\n   * @returns {number} Returns the collection size.\r\n   * @example\r\n   *\r\n   * _.size([1, 2, 3]);\r\n   * // => 3\r\n   *\r\n   * _.size({ 'a': 1, 'b': 2 });\r\n   * // => 2\r\n   *\r\n   * _.size('pebbles');\r\n   * // => 7\r\n   */\r\n  function size(collection) {\r\n    if (collection == null) {\r\n      return 0;\r\n    }\r\n    if (isArrayLike(collection)) {\r\n      return isString(collection) ? stringSize(collection) : collection.length;\r\n    }\r\n    var tag = getTag(collection);\r\n    if (tag == mapTag || tag == setTag) {\r\n      return collection.size;\r\n    }\r\n    return baseKeys(collection).length;\r\n  }\r\n\r\n  /**\r\n   * Checks if `predicate` returns truthy for **any** element of `collection`.\r\n   * Iteration is stopped once `predicate` returns truthy. The predicate is\r\n   * invoked with three arguments: (value, index|key, collection).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\r\n   * @returns {boolean} Returns `true` if any element passes the predicate check,\r\n   *  else `false`.\r\n   * @example\r\n   *\r\n   * _.some([null, 0, 'yes', false], Boolean);\r\n   * // => true\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney', 'active': true },\r\n   *   { 'user': 'fred',   'active': false }\r\n   * ];\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.some(users, { 'user': 'barney', 'active': false });\r\n   * // => false\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.some(users, ['active', false]);\r\n   * // => true\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.some(users, 'active');\r\n   * // => true\r\n   */\r\n  function some(collection, predicate, guard) {\r\n    var func = isArray(collection) ? arraySome : baseSome;\r\n    if (guard && isIterateeCall(collection, predicate, guard)) {\r\n      predicate = undefined;\r\n    }\r\n    return func(collection, baseIteratee(predicate, 3));\r\n  }\r\n\r\n  /**\r\n   * Creates an array of elements, sorted in ascending order by the results of\r\n   * running each element in a collection thru each iteratee. This method\r\n   * performs a stable sort, that is, it preserves the original sort order of\r\n   * equal elements. The iteratees are invoked with one argument: (value).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Collection\r\n   * @param {Array|Object} collection The collection to iterate over.\r\n   * @param {...(Function|Function[])} [iteratees=[_.identity]]\r\n   *  The iteratees to sort by.\r\n   * @returns {Array} Returns the new sorted array.\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'fred',   'age': 48 },\r\n   *   { 'user': 'barney', 'age': 36 },\r\n   *   { 'user': 'fred',   'age': 40 },\r\n   *   { 'user': 'barney', 'age': 34 }\r\n   * ];\r\n   *\r\n   * _.sortBy(users, [function(o) { return o.user; }]);\r\n   * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]\r\n   *\r\n   * _.sortBy(users, ['user', 'age']);\r\n   * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]\r\n   */\r\n  var sortBy = baseRest(function(collection, iteratees) {\r\n    if (collection == null) {\r\n      return [];\r\n    }\r\n    var length = iteratees.length;\r\n    if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {\r\n      iteratees = [];\r\n    } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {\r\n      iteratees = [iteratees[0]];\r\n    }\r\n    return baseOrderBy(collection, baseFlatten(iteratees, 1), []);\r\n  });\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Gets the timestamp of the number of milliseconds that have elapsed since\r\n   * the Unix epoch (1 January 1970 00:00:00 UTC).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 2.4.0\r\n   * @category Date\r\n   * @returns {number} Returns the timestamp.\r\n   * @example\r\n   *\r\n   * _.defer(function(stamp) {\r\n   *   console.log(_.now() - stamp);\r\n   * }, _.now());\r\n   * // => Logs the number of milliseconds it took for the deferred invocation.\r\n   */\r\n  var now = function() {\r\n    return root.Date.now();\r\n  };\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * The opposite of `_.before`; this method creates a function that invokes\r\n   * `func` once it's called `n` or more times.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Function\r\n   * @param {number} n The number of calls before `func` is invoked.\r\n   * @param {Function} func The function to restrict.\r\n   * @returns {Function} Returns the new restricted function.\r\n   * @example\r\n   *\r\n   * var saves = ['profile', 'settings'];\r\n   *\r\n   * var done = _.after(saves.length, function() {\r\n   *   console.log('done saving!');\r\n   * });\r\n   *\r\n   * _.forEach(saves, function(type) {\r\n   *   asyncSave({ 'type': type, 'complete': done });\r\n   * });\r\n   * // => Logs 'done saving!' after the two async saves have completed.\r\n   */\r\n  function after(n, func) {\r\n    if (typeof func != 'function') {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    n = toInteger(n);\r\n    return function() {\r\n      if (--n < 1) {\r\n        return func.apply(this, arguments);\r\n      }\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function that invokes `func`, with the `this` binding and arguments\r\n   * of the created function, while it's called less than `n` times. Subsequent\r\n   * calls to the created function return the result of the last `func` invocation.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Function\r\n   * @param {number} n The number of calls at which `func` is no longer invoked.\r\n   * @param {Function} func The function to restrict.\r\n   * @returns {Function} Returns the new restricted function.\r\n   * @example\r\n   *\r\n   * jQuery(element).on('click', _.before(5, addContactToList));\r\n   * // => Allows adding up to 4 contacts to the list.\r\n   */\r\n  function before(n, func) {\r\n    var result;\r\n    if (typeof func != 'function') {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    n = toInteger(n);\r\n    return function() {\r\n      if (--n > 0) {\r\n        result = func.apply(this, arguments);\r\n      }\r\n      if (n <= 1) {\r\n        func = undefined;\r\n      }\r\n      return result;\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function that invokes `func` with the `this` binding of `thisArg`\r\n   * and `partials` prepended to the arguments it receives.\r\n   *\r\n   * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,\r\n   * may be used as a placeholder for partially applied arguments.\r\n   *\r\n   * **Note:** Unlike native `Function#bind`, this method doesn't set the \"length\"\r\n   * property of bound functions.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Function\r\n   * @param {Function} func The function to bind.\r\n   * @param {*} thisArg The `this` binding of `func`.\r\n   * @param {...*} [partials] The arguments to be partially applied.\r\n   * @returns {Function} Returns the new bound function.\r\n   * @example\r\n   *\r\n   * function greet(greeting, punctuation) {\r\n   *   return greeting + ' ' + this.user + punctuation;\r\n   * }\r\n   *\r\n   * var object = { 'user': 'fred' };\r\n   *\r\n   * var bound = _.bind(greet, object, 'hi');\r\n   * bound('!');\r\n   * // => 'hi fred!'\r\n   *\r\n   * // Bound with placeholders.\r\n   * var bound = _.bind(greet, object, _, '!');\r\n   * bound('hi');\r\n   * // => 'hi fred!'\r\n   */\r\n  var bind = baseRest(function(func, thisArg, partials) {\r\n    var bitmask = WRAP_BIND_FLAG;\r\n    if (partials.length) {\r\n      var holders = replaceHolders(partials, getHolder(bind));\r\n      bitmask |= WRAP_PARTIAL_FLAG;\r\n    }\r\n    return createWrap(func, bitmask, thisArg, partials, holders);\r\n  });\r\n\r\n  /**\r\n   * Creates a debounced function that delays invoking `func` until after `wait`\r\n   * milliseconds have elapsed since the last time the debounced function was\r\n   * invoked. The debounced function comes with a `cancel` method to cancel\r\n   * delayed `func` invocations and a `flush` method to immediately invoke them.\r\n   * Provide `options` to indicate whether `func` should be invoked on the\r\n   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked\r\n   * with the last arguments provided to the debounced function. Subsequent\r\n   * calls to the debounced function return the result of the last `func`\r\n   * invocation.\r\n   *\r\n   * **Note:** If `leading` and `trailing` options are `true`, `func` is\r\n   * invoked on the trailing edge of the timeout only if the debounced function\r\n   * is invoked more than once during the `wait` timeout.\r\n   *\r\n   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred\r\n   * until to the next tick, similar to `setTimeout` with a timeout of `0`.\r\n   *\r\n   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)\r\n   * for details over the differences between `_.debounce` and `_.throttle`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Function\r\n   * @param {Function} func The function to debounce.\r\n   * @param {number} [wait=0] The number of milliseconds to delay.\r\n   * @param {Object} [options={}] The options object.\r\n   * @param {boolean} [options.leading=false]\r\n   *  Specify invoking on the leading edge of the timeout.\r\n   * @param {number} [options.maxWait]\r\n   *  The maximum time `func` is allowed to be delayed before it's invoked.\r\n   * @param {boolean} [options.trailing=true]\r\n   *  Specify invoking on the trailing edge of the timeout.\r\n   * @returns {Function} Returns the new debounced function.\r\n   * @example\r\n   *\r\n   * // Avoid costly calculations while the window size is in flux.\r\n   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));\r\n   *\r\n   * // Invoke `sendMail` when clicked, debouncing subsequent calls.\r\n   * jQuery(element).on('click', _.debounce(sendMail, 300, {\r\n   *   'leading': true,\r\n   *   'trailing': false\r\n   * }));\r\n   *\r\n   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.\r\n   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });\r\n   * var source = new EventSource('/stream');\r\n   * jQuery(source).on('message', debounced);\r\n   *\r\n   * // Cancel the trailing debounced invocation.\r\n   * jQuery(window).on('popstate', debounced.cancel);\r\n   */\r\n  function debounce(func, wait, options) {\r\n    var lastArgs,\r\n        lastThis,\r\n        maxWait,\r\n        result,\r\n        timerId,\r\n        lastCallTime,\r\n        lastInvokeTime = 0,\r\n        leading = false,\r\n        maxing = false,\r\n        trailing = true;\r\n\r\n    if (typeof func != 'function') {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    wait = toNumber(wait) || 0;\r\n    if (isObject(options)) {\r\n      leading = !!options.leading;\r\n      maxing = 'maxWait' in options;\r\n      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;\r\n      trailing = 'trailing' in options ? !!options.trailing : trailing;\r\n    }\r\n\r\n    function invokeFunc(time) {\r\n      var args = lastArgs,\r\n          thisArg = lastThis;\r\n\r\n      lastArgs = lastThis = undefined;\r\n      lastInvokeTime = time;\r\n      result = func.apply(thisArg, args);\r\n      return result;\r\n    }\r\n\r\n    function leadingEdge(time) {\r\n      // Reset any `maxWait` timer.\r\n      lastInvokeTime = time;\r\n      // Start the timer for the trailing edge.\r\n      timerId = setTimeout(timerExpired, wait);\r\n      // Invoke the leading edge.\r\n      return leading ? invokeFunc(time) : result;\r\n    }\r\n\r\n    function remainingWait(time) {\r\n      var timeSinceLastCall = time - lastCallTime,\r\n          timeSinceLastInvoke = time - lastInvokeTime,\r\n          timeWaiting = wait - timeSinceLastCall;\r\n\r\n      return maxing\r\n        ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)\r\n        : timeWaiting;\r\n    }\r\n\r\n    function shouldInvoke(time) {\r\n      var timeSinceLastCall = time - lastCallTime,\r\n          timeSinceLastInvoke = time - lastInvokeTime;\r\n\r\n      // Either this is the first call, activity has stopped and we're at the\r\n      // trailing edge, the system time has gone backwards and we're treating\r\n      // it as the trailing edge, or we've hit the `maxWait` limit.\r\n      return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||\r\n        (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));\r\n    }\r\n\r\n    function timerExpired() {\r\n      var time = now();\r\n      if (shouldInvoke(time)) {\r\n        return trailingEdge(time);\r\n      }\r\n      // Restart the timer.\r\n      timerId = setTimeout(timerExpired, remainingWait(time));\r\n    }\r\n\r\n    function trailingEdge(time) {\r\n      timerId = undefined;\r\n\r\n      // Only invoke if we have `lastArgs` which means `func` has been\r\n      // debounced at least once.\r\n      if (trailing && lastArgs) {\r\n        return invokeFunc(time);\r\n      }\r\n      lastArgs = lastThis = undefined;\r\n      return result;\r\n    }\r\n\r\n    function cancel() {\r\n      if (timerId !== undefined) {\r\n        clearTimeout(timerId);\r\n      }\r\n      lastInvokeTime = 0;\r\n      lastArgs = lastCallTime = lastThis = timerId = undefined;\r\n    }\r\n\r\n    function flush() {\r\n      return timerId === undefined ? result : trailingEdge(now());\r\n    }\r\n\r\n    function debounced() {\r\n      var time = now(),\r\n          isInvoking = shouldInvoke(time);\r\n\r\n      lastArgs = arguments;\r\n      lastThis = this;\r\n      lastCallTime = time;\r\n\r\n      if (isInvoking) {\r\n        if (timerId === undefined) {\r\n          return leadingEdge(lastCallTime);\r\n        }\r\n        if (maxing) {\r\n          // Handle invocations in a tight loop.\r\n          timerId = setTimeout(timerExpired, wait);\r\n          return invokeFunc(lastCallTime);\r\n        }\r\n      }\r\n      if (timerId === undefined) {\r\n        timerId = setTimeout(timerExpired, wait);\r\n      }\r\n      return result;\r\n    }\r\n    debounced.cancel = cancel;\r\n    debounced.flush = flush;\r\n    return debounced;\r\n  }\r\n\r\n  /**\r\n   * Defers invoking the `func` until the current call stack has cleared. Any\r\n   * additional arguments are provided to `func` when it's invoked.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Function\r\n   * @param {Function} func The function to defer.\r\n   * @param {...*} [args] The arguments to invoke `func` with.\r\n   * @returns {number} Returns the timer id.\r\n   * @example\r\n   *\r\n   * _.defer(function(text) {\r\n   *   console.log(text);\r\n   * }, 'deferred');\r\n   * // => Logs 'deferred' after one millisecond.\r\n   */\r\n  var defer = baseRest(function(func, args) {\r\n    return baseDelay(func, 1, args);\r\n  });\r\n\r\n  /**\r\n   * Invokes `func` after `wait` milliseconds. Any additional arguments are\r\n   * provided to `func` when it's invoked.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Function\r\n   * @param {Function} func The function to delay.\r\n   * @param {number} wait The number of milliseconds to delay invocation.\r\n   * @param {...*} [args] The arguments to invoke `func` with.\r\n   * @returns {number} Returns the timer id.\r\n   * @example\r\n   *\r\n   * _.delay(function(text) {\r\n   *   console.log(text);\r\n   * }, 1000, 'later');\r\n   * // => Logs 'later' after one second.\r\n   */\r\n  var delay = baseRest(function(func, wait, args) {\r\n    return baseDelay(func, toNumber(wait) || 0, args);\r\n  });\r\n\r\n  /**\r\n   * Creates a function that memoizes the result of `func`. If `resolver` is\r\n   * provided, it determines the cache key for storing the result based on the\r\n   * arguments provided to the memoized function. By default, the first argument\r\n   * provided to the memoized function is used as the map cache key. The `func`\r\n   * is invoked with the `this` binding of the memoized function.\r\n   *\r\n   * **Note:** The cache is exposed as the `cache` property on the memoized\r\n   * function. Its creation may be customized by replacing the `_.memoize.Cache`\r\n   * constructor with one whose instances implement the\r\n   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)\r\n   * method interface of `clear`, `delete`, `get`, `has`, and `set`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Function\r\n   * @param {Function} func The function to have its output memoized.\r\n   * @param {Function} [resolver] The function to resolve the cache key.\r\n   * @returns {Function} Returns the new memoized function.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1, 'b': 2 };\r\n   * var other = { 'c': 3, 'd': 4 };\r\n   *\r\n   * var values = _.memoize(_.values);\r\n   * values(object);\r\n   * // => [1, 2]\r\n   *\r\n   * values(other);\r\n   * // => [3, 4]\r\n   *\r\n   * object.a = 2;\r\n   * values(object);\r\n   * // => [1, 2]\r\n   *\r\n   * // Modify the result cache.\r\n   * values.cache.set(object, ['a', 'b']);\r\n   * values(object);\r\n   * // => ['a', 'b']\r\n   *\r\n   * // Replace `_.memoize.Cache`.\r\n   * _.memoize.Cache = WeakMap;\r\n   */\r\n  function memoize(func, resolver) {\r\n    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    var memoized = function() {\r\n      var args = arguments,\r\n          key = resolver ? resolver.apply(this, args) : args[0],\r\n          cache = memoized.cache;\r\n\r\n      if (cache.has(key)) {\r\n        return cache.get(key);\r\n      }\r\n      var result = func.apply(this, args);\r\n      memoized.cache = cache.set(key, result) || cache;\r\n      return result;\r\n    };\r\n    memoized.cache = new (memoize.Cache || MapCache);\r\n    return memoized;\r\n  }\r\n\r\n  // Expose `MapCache`.\r\n  memoize.Cache = MapCache;\r\n\r\n  /**\r\n   * Creates a function that negates the result of the predicate `func`. The\r\n   * `func` predicate is invoked with the `this` binding and arguments of the\r\n   * created function.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Function\r\n   * @param {Function} predicate The predicate to negate.\r\n   * @returns {Function} Returns the new negated function.\r\n   * @example\r\n   *\r\n   * function isEven(n) {\r\n   *   return n % 2 == 0;\r\n   * }\r\n   *\r\n   * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));\r\n   * // => [1, 3, 5]\r\n   */\r\n  function negate(predicate) {\r\n    if (typeof predicate != 'function') {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    return function() {\r\n      var args = arguments;\r\n      switch (args.length) {\r\n        case 0: return !predicate.call(this);\r\n        case 1: return !predicate.call(this, args[0]);\r\n        case 2: return !predicate.call(this, args[0], args[1]);\r\n        case 3: return !predicate.call(this, args[0], args[1], args[2]);\r\n      }\r\n      return !predicate.apply(this, args);\r\n    };\r\n  }\r\n\r\n  /**\r\n   * Creates a function that is restricted to invoking `func` once. Repeat calls\r\n   * to the function return the value of the first invocation. The `func` is\r\n   * invoked with the `this` binding and arguments of the created function.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Function\r\n   * @param {Function} func The function to restrict.\r\n   * @returns {Function} Returns the new restricted function.\r\n   * @example\r\n   *\r\n   * var initialize = _.once(createApplication);\r\n   * initialize();\r\n   * initialize();\r\n   * // => `createApplication` is invoked once\r\n   */\r\n  function once(func) {\r\n    return before(2, func);\r\n  }\r\n\r\n  /**\r\n   * Creates a function that invokes `func` with the `this` binding of the\r\n   * created function and arguments from `start` and beyond provided as\r\n   * an array.\r\n   *\r\n   * **Note:** This method is based on the\r\n   * [rest parameter](https://mdn.io/rest_parameters).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Function\r\n   * @param {Function} func The function to apply a rest parameter to.\r\n   * @param {number} [start=func.length-1] The start position of the rest parameter.\r\n   * @returns {Function} Returns the new function.\r\n   * @example\r\n   *\r\n   * var say = _.rest(function(what, names) {\r\n   *   return what + ' ' + _.initial(names).join(', ') +\r\n   *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);\r\n   * });\r\n   *\r\n   * say('hello', 'fred', 'barney', 'pebbles');\r\n   * // => 'hello fred, barney, & pebbles'\r\n   */\r\n  function rest(func, start) {\r\n    if (typeof func != 'function') {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    start = start === undefined ? start : toInteger(start);\r\n    return baseRest(func, start);\r\n  }\r\n\r\n  /**\r\n   * Creates a throttled function that only invokes `func` at most once per\r\n   * every `wait` milliseconds. The throttled function comes with a `cancel`\r\n   * method to cancel delayed `func` invocations and a `flush` method to\r\n   * immediately invoke them. Provide `options` to indicate whether `func`\r\n   * should be invoked on the leading and/or trailing edge of the `wait`\r\n   * timeout. The `func` is invoked with the last arguments provided to the\r\n   * throttled function. Subsequent calls to the throttled function return the\r\n   * result of the last `func` invocation.\r\n   *\r\n   * **Note:** If `leading` and `trailing` options are `true`, `func` is\r\n   * invoked on the trailing edge of the timeout only if the throttled function\r\n   * is invoked more than once during the `wait` timeout.\r\n   *\r\n   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred\r\n   * until to the next tick, similar to `setTimeout` with a timeout of `0`.\r\n   *\r\n   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)\r\n   * for details over the differences between `_.throttle` and `_.debounce`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Function\r\n   * @param {Function} func The function to throttle.\r\n   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.\r\n   * @param {Object} [options={}] The options object.\r\n   * @param {boolean} [options.leading=true]\r\n   *  Specify invoking on the leading edge of the timeout.\r\n   * @param {boolean} [options.trailing=true]\r\n   *  Specify invoking on the trailing edge of the timeout.\r\n   * @returns {Function} Returns the new throttled function.\r\n   * @example\r\n   *\r\n   * // Avoid excessively updating the position while scrolling.\r\n   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));\r\n   *\r\n   * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.\r\n   * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });\r\n   * jQuery(element).on('click', throttled);\r\n   *\r\n   * // Cancel the trailing throttled invocation.\r\n   * jQuery(window).on('popstate', throttled.cancel);\r\n   */\r\n  function throttle(func, wait, options) {\r\n    var leading = true,\r\n        trailing = true;\r\n\r\n    if (typeof func != 'function') {\r\n      throw new TypeError(FUNC_ERROR_TEXT);\r\n    }\r\n    if (isObject(options)) {\r\n      leading = 'leading' in options ? !!options.leading : leading;\r\n      trailing = 'trailing' in options ? !!options.trailing : trailing;\r\n    }\r\n    return debounce(func, wait, {\r\n      'leading': leading,\r\n      'maxWait': wait,\r\n      'trailing': trailing\r\n    });\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates a shallow clone of `value`.\r\n   *\r\n   * **Note:** This method is loosely based on the\r\n   * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)\r\n   * and supports cloning arrays, array buffers, booleans, date objects, maps,\r\n   * numbers, `Object` objects, regexes, sets, strings, symbols, and typed\r\n   * arrays. The own enumerable properties of `arguments` objects are cloned\r\n   * as plain objects. An empty object is returned for uncloneable values such\r\n   * as error objects, functions, DOM nodes, and WeakMaps.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to clone.\r\n   * @returns {*} Returns the cloned value.\r\n   * @see _.cloneDeep\r\n   * @example\r\n   *\r\n   * var objects = [{ 'a': 1 }, { 'b': 2 }];\r\n   *\r\n   * var shallow = _.clone(objects);\r\n   * console.log(shallow[0] === objects[0]);\r\n   * // => true\r\n   */\r\n  function clone(value) {\r\n    return baseClone(value, CLONE_SYMBOLS_FLAG);\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.clone` except that it recursively clones `value`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 1.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to recursively clone.\r\n   * @returns {*} Returns the deep cloned value.\r\n   * @see _.clone\r\n   * @example\r\n   *\r\n   * var objects = [{ 'a': 1 }, { 'b': 2 }];\r\n   *\r\n   * var deep = _.cloneDeep(objects);\r\n   * console.log(deep[0] === objects[0]);\r\n   * // => false\r\n   */\r\n  function cloneDeep(value) {\r\n    return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);\r\n  }\r\n\r\n  /**\r\n   * Performs a\r\n   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\r\n   * comparison between two values to determine if they are equivalent.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to compare.\r\n   * @param {*} other The other value to compare.\r\n   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1 };\r\n   * var other = { 'a': 1 };\r\n   *\r\n   * _.eq(object, object);\r\n   * // => true\r\n   *\r\n   * _.eq(object, other);\r\n   * // => false\r\n   *\r\n   * _.eq('a', 'a');\r\n   * // => true\r\n   *\r\n   * _.eq('a', Object('a'));\r\n   * // => false\r\n   *\r\n   * _.eq(NaN, NaN);\r\n   * // => true\r\n   */\r\n  function eq(value, other) {\r\n    return value === other || (value !== value && other !== other);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is likely an `arguments` object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is an `arguments` object,\r\n   *  else `false`.\r\n   * @example\r\n   *\r\n   * _.isArguments(function() { return arguments; }());\r\n   * // => true\r\n   *\r\n   * _.isArguments([1, 2, 3]);\r\n   * // => false\r\n   */\r\n  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {\r\n    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&\r\n      !propertyIsEnumerable.call(value, 'callee');\r\n  };\r\n\r\n  /**\r\n   * Checks if `value` is classified as an `Array` object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is an array, else `false`.\r\n   * @example\r\n   *\r\n   * _.isArray([1, 2, 3]);\r\n   * // => true\r\n   *\r\n   * _.isArray(document.body.children);\r\n   * // => false\r\n   *\r\n   * _.isArray('abc');\r\n   * // => false\r\n   *\r\n   * _.isArray(_.noop);\r\n   * // => false\r\n   */\r\n  var isArray = Array.isArray;\r\n\r\n  /**\r\n   * Checks if `value` is array-like. A value is considered array-like if it's\r\n   * not a function and has a `value.length` that's an integer greater than or\r\n   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.\r\n   * @example\r\n   *\r\n   * _.isArrayLike([1, 2, 3]);\r\n   * // => true\r\n   *\r\n   * _.isArrayLike(document.body.children);\r\n   * // => true\r\n   *\r\n   * _.isArrayLike('abc');\r\n   * // => true\r\n   *\r\n   * _.isArrayLike(_.noop);\r\n   * // => false\r\n   */\r\n  function isArrayLike(value) {\r\n    return value != null && isLength(value.length) && !isFunction(value);\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.isArrayLike` except that it also checks if `value`\r\n   * is an object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is an array-like object,\r\n   *  else `false`.\r\n   * @example\r\n   *\r\n   * _.isArrayLikeObject([1, 2, 3]);\r\n   * // => true\r\n   *\r\n   * _.isArrayLikeObject(document.body.children);\r\n   * // => true\r\n   *\r\n   * _.isArrayLikeObject('abc');\r\n   * // => false\r\n   *\r\n   * _.isArrayLikeObject(_.noop);\r\n   * // => false\r\n   */\r\n  function isArrayLikeObject(value) {\r\n    return isObjectLike(value) && isArrayLike(value);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is classified as a boolean primitive or object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.\r\n   * @example\r\n   *\r\n   * _.isBoolean(false);\r\n   * // => true\r\n   *\r\n   * _.isBoolean(null);\r\n   * // => false\r\n   */\r\n  function isBoolean(value) {\r\n    return value === true || value === false ||\r\n      (isObjectLike(value) && baseGetTag(value) == boolTag);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is a buffer.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.3.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.\r\n   * @example\r\n   *\r\n   * _.isBuffer(new Buffer(2));\r\n   * // => true\r\n   *\r\n   * _.isBuffer(new Uint8Array(2));\r\n   * // => false\r\n   */\r\n  var isBuffer = nativeIsBuffer || stubFalse;\r\n\r\n  /**\r\n   * Checks if `value` is classified as a `Date` object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a date object, else `false`.\r\n   * @example\r\n   *\r\n   * _.isDate(new Date);\r\n   * // => true\r\n   *\r\n   * _.isDate('Mon April 23 2012');\r\n   * // => false\r\n   */\r\n  var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;\r\n\r\n  /**\r\n   * Checks if `value` is an empty object, collection, map, or set.\r\n   *\r\n   * Objects are considered empty if they have no own enumerable string keyed\r\n   * properties.\r\n   *\r\n   * Array-like values such as `arguments` objects, arrays, buffers, strings, or\r\n   * jQuery-like collections are considered empty if they have a `length` of `0`.\r\n   * Similarly, maps and sets are considered empty if they have a `size` of `0`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is empty, else `false`.\r\n   * @example\r\n   *\r\n   * _.isEmpty(null);\r\n   * // => true\r\n   *\r\n   * _.isEmpty(true);\r\n   * // => true\r\n   *\r\n   * _.isEmpty(1);\r\n   * // => true\r\n   *\r\n   * _.isEmpty([1, 2, 3]);\r\n   * // => false\r\n   *\r\n   * _.isEmpty({ 'a': 1 });\r\n   * // => false\r\n   */\r\n  function isEmpty(value) {\r\n    if (value == null) {\r\n      return true;\r\n    }\r\n    if (isArrayLike(value) &&\r\n        (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||\r\n          isBuffer(value) || isTypedArray(value) || isArguments(value))) {\r\n      return !value.length;\r\n    }\r\n    var tag = getTag(value);\r\n    if (tag == mapTag || tag == setTag) {\r\n      return !value.size;\r\n    }\r\n    if (isPrototype(value)) {\r\n      return !baseKeys(value).length;\r\n    }\r\n    for (var key in value) {\r\n      if (hasOwnProperty.call(value, key)) {\r\n        return false;\r\n      }\r\n    }\r\n    return true;\r\n  }\r\n\r\n  /**\r\n   * Performs a deep comparison between two values to determine if they are\r\n   * equivalent.\r\n   *\r\n   * **Note:** This method supports comparing arrays, array buffers, booleans,\r\n   * date objects, error objects, maps, numbers, `Object` objects, regexes,\r\n   * sets, strings, symbols, and typed arrays. `Object` objects are compared\r\n   * by their own, not inherited, enumerable properties. Functions and DOM\r\n   * nodes are compared by strict equality, i.e. `===`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to compare.\r\n   * @param {*} other The other value to compare.\r\n   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1 };\r\n   * var other = { 'a': 1 };\r\n   *\r\n   * _.isEqual(object, other);\r\n   * // => true\r\n   *\r\n   * object === other;\r\n   * // => false\r\n   */\r\n  function isEqual(value, other) {\r\n    return baseIsEqual(value, other);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is a finite primitive number.\r\n   *\r\n   * **Note:** This method is based on\r\n   * [`Number.isFinite`](https://mdn.io/Number/isFinite).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.\r\n   * @example\r\n   *\r\n   * _.isFinite(3);\r\n   * // => true\r\n   *\r\n   * _.isFinite(Number.MIN_VALUE);\r\n   * // => true\r\n   *\r\n   * _.isFinite(Infinity);\r\n   * // => false\r\n   *\r\n   * _.isFinite('3');\r\n   * // => false\r\n   */\r\n  function isFinite(value) {\r\n    return typeof value == 'number' && nativeIsFinite(value);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is classified as a `Function` object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a function, else `false`.\r\n   * @example\r\n   *\r\n   * _.isFunction(_);\r\n   * // => true\r\n   *\r\n   * _.isFunction(/abc/);\r\n   * // => false\r\n   */\r\n  function isFunction(value) {\r\n    if (!isObject(value)) {\r\n      return false;\r\n    }\r\n    // The use of `Object#toString` avoids issues with the `typeof` operator\r\n    // in Safari 9 which returns 'object' for typed arrays and other constructors.\r\n    var tag = baseGetTag(value);\r\n    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is a valid array-like length.\r\n   *\r\n   * **Note:** This method is loosely based on\r\n   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.\r\n   * @example\r\n   *\r\n   * _.isLength(3);\r\n   * // => true\r\n   *\r\n   * _.isLength(Number.MIN_VALUE);\r\n   * // => false\r\n   *\r\n   * _.isLength(Infinity);\r\n   * // => false\r\n   *\r\n   * _.isLength('3');\r\n   * // => false\r\n   */\r\n  function isLength(value) {\r\n    return typeof value == 'number' &&\r\n      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is the\r\n   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)\r\n   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is an object, else `false`.\r\n   * @example\r\n   *\r\n   * _.isObject({});\r\n   * // => true\r\n   *\r\n   * _.isObject([1, 2, 3]);\r\n   * // => true\r\n   *\r\n   * _.isObject(_.noop);\r\n   * // => true\r\n   *\r\n   * _.isObject(null);\r\n   * // => false\r\n   */\r\n  function isObject(value) {\r\n    var type = typeof value;\r\n    return value != null && (type == 'object' || type == 'function');\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is object-like. A value is object-like if it's not `null`\r\n   * and has a `typeof` result of \"object\".\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.\r\n   * @example\r\n   *\r\n   * _.isObjectLike({});\r\n   * // => true\r\n   *\r\n   * _.isObjectLike([1, 2, 3]);\r\n   * // => true\r\n   *\r\n   * _.isObjectLike(_.noop);\r\n   * // => false\r\n   *\r\n   * _.isObjectLike(null);\r\n   * // => false\r\n   */\r\n  function isObjectLike(value) {\r\n    return value != null && typeof value == 'object';\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is classified as a `Map` object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.3.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a map, else `false`.\r\n   * @example\r\n   *\r\n   * _.isMap(new Map);\r\n   * // => true\r\n   *\r\n   * _.isMap(new WeakMap);\r\n   * // => false\r\n   */\r\n  var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;\r\n\r\n  /**\r\n   * Checks if `value` is `NaN`.\r\n   *\r\n   * **Note:** This method is based on\r\n   * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as\r\n   * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for\r\n   * `undefined` and other non-number values.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.\r\n   * @example\r\n   *\r\n   * _.isNaN(NaN);\r\n   * // => true\r\n   *\r\n   * _.isNaN(new Number(NaN));\r\n   * // => true\r\n   *\r\n   * isNaN(undefined);\r\n   * // => true\r\n   *\r\n   * _.isNaN(undefined);\r\n   * // => false\r\n   */\r\n  function isNaN(value) {\r\n    // An `NaN` primitive is the only value that is not equal to itself.\r\n    // Perform the `toStringTag` check first to avoid errors with some\r\n    // ActiveX objects in IE.\r\n    return isNumber(value) && value != +value;\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is `null`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is `null`, else `false`.\r\n   * @example\r\n   *\r\n   * _.isNull(null);\r\n   * // => true\r\n   *\r\n   * _.isNull(void 0);\r\n   * // => false\r\n   */\r\n  function isNull(value) {\r\n    return value === null;\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is classified as a `Number` primitive or object.\r\n   *\r\n   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are\r\n   * classified as numbers, use the `_.isFinite` method.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a number, else `false`.\r\n   * @example\r\n   *\r\n   * _.isNumber(3);\r\n   * // => true\r\n   *\r\n   * _.isNumber(Number.MIN_VALUE);\r\n   * // => true\r\n   *\r\n   * _.isNumber(Infinity);\r\n   * // => true\r\n   *\r\n   * _.isNumber('3');\r\n   * // => false\r\n   */\r\n  function isNumber(value) {\r\n    return typeof value == 'number' ||\r\n      (isObjectLike(value) && baseGetTag(value) == numberTag);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is a plain object, that is, an object created by the\r\n   * `Object` constructor or one with a `[[Prototype]]` of `null`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.8.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.\r\n   * @example\r\n   *\r\n   * function Foo() {\r\n   *   this.a = 1;\r\n   * }\r\n   *\r\n   * _.isPlainObject(new Foo);\r\n   * // => false\r\n   *\r\n   * _.isPlainObject([1, 2, 3]);\r\n   * // => false\r\n   *\r\n   * _.isPlainObject({ 'x': 0, 'y': 0 });\r\n   * // => true\r\n   *\r\n   * _.isPlainObject(Object.create(null));\r\n   * // => true\r\n   */\r\n  function isPlainObject(value) {\r\n    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {\r\n      return false;\r\n    }\r\n    var proto = getPrototype(value);\r\n    if (proto === null) {\r\n      return true;\r\n    }\r\n    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;\r\n    return typeof Ctor == 'function' && Ctor instanceof Ctor &&\r\n      funcToString.call(Ctor) == objectCtorString;\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is classified as a `RegExp` object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.1.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.\r\n   * @example\r\n   *\r\n   * _.isRegExp(/abc/);\r\n   * // => true\r\n   *\r\n   * _.isRegExp('/abc/');\r\n   * // => false\r\n   */\r\n  var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;\r\n\r\n  /**\r\n   * Checks if `value` is classified as a `Set` object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.3.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a set, else `false`.\r\n   * @example\r\n   *\r\n   * _.isSet(new Set);\r\n   * // => true\r\n   *\r\n   * _.isSet(new WeakSet);\r\n   * // => false\r\n   */\r\n  var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;\r\n\r\n  /**\r\n   * Checks if `value` is classified as a `String` primitive or object.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a string, else `false`.\r\n   * @example\r\n   *\r\n   * _.isString('abc');\r\n   * // => true\r\n   *\r\n   * _.isString(1);\r\n   * // => false\r\n   */\r\n  function isString(value) {\r\n    return typeof value == 'string' ||\r\n      (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is classified as a `Symbol` primitive or object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.\r\n   * @example\r\n   *\r\n   * _.isSymbol(Symbol.iterator);\r\n   * // => true\r\n   *\r\n   * _.isSymbol('abc');\r\n   * // => false\r\n   */\r\n  function isSymbol(value) {\r\n    return typeof value == 'symbol' ||\r\n      (isObjectLike(value) && baseGetTag(value) == symbolTag);\r\n  }\r\n\r\n  /**\r\n   * Checks if `value` is classified as a typed array.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.\r\n   * @example\r\n   *\r\n   * _.isTypedArray(new Uint8Array);\r\n   * // => true\r\n   *\r\n   * _.isTypedArray([]);\r\n   * // => false\r\n   */\r\n  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;\r\n\r\n  /**\r\n   * Checks if `value` is `undefined`.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Lang\r\n   * @param {*} value The value to check.\r\n   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.\r\n   * @example\r\n   *\r\n   * _.isUndefined(void 0);\r\n   * // => true\r\n   *\r\n   * _.isUndefined(null);\r\n   * // => false\r\n   */\r\n  function isUndefined(value) {\r\n    return value === undefined;\r\n  }\r\n\r\n  /**\r\n   * Converts `value` to an array.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Lang\r\n   * @param {*} value The value to convert.\r\n   * @returns {Array} Returns the converted array.\r\n   * @example\r\n   *\r\n   * _.toArray({ 'a': 1, 'b': 2 });\r\n   * // => [1, 2]\r\n   *\r\n   * _.toArray('abc');\r\n   * // => ['a', 'b', 'c']\r\n   *\r\n   * _.toArray(1);\r\n   * // => []\r\n   *\r\n   * _.toArray(null);\r\n   * // => []\r\n   */\r\n  function toArray(value) {\r\n    if (!value) {\r\n      return [];\r\n    }\r\n    if (isArrayLike(value)) {\r\n      return isString(value) ? stringToArray(value) : copyArray(value);\r\n    }\r\n    if (symIterator && value[symIterator]) {\r\n      return iteratorToArray(value[symIterator]());\r\n    }\r\n    var tag = getTag(value),\r\n        func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);\r\n\r\n    return func(value);\r\n  }\r\n\r\n  /**\r\n   * Converts `value` to a finite number.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.12.0\r\n   * @category Lang\r\n   * @param {*} value The value to convert.\r\n   * @returns {number} Returns the converted number.\r\n   * @example\r\n   *\r\n   * _.toFinite(3.2);\r\n   * // => 3.2\r\n   *\r\n   * _.toFinite(Number.MIN_VALUE);\r\n   * // => 5e-324\r\n   *\r\n   * _.toFinite(Infinity);\r\n   * // => 1.7976931348623157e+308\r\n   *\r\n   * _.toFinite('3.2');\r\n   * // => 3.2\r\n   */\r\n  function toFinite(value) {\r\n    if (!value) {\r\n      return value === 0 ? value : 0;\r\n    }\r\n    value = toNumber(value);\r\n    if (value === INFINITY || value === -INFINITY) {\r\n      var sign = (value < 0 ? -1 : 1);\r\n      return sign * MAX_INTEGER;\r\n    }\r\n    return value === value ? value : 0;\r\n  }\r\n\r\n  /**\r\n   * Converts `value` to an integer.\r\n   *\r\n   * **Note:** This method is loosely based on\r\n   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to convert.\r\n   * @returns {number} Returns the converted integer.\r\n   * @example\r\n   *\r\n   * _.toInteger(3.2);\r\n   * // => 3\r\n   *\r\n   * _.toInteger(Number.MIN_VALUE);\r\n   * // => 0\r\n   *\r\n   * _.toInteger(Infinity);\r\n   * // => 1.7976931348623157e+308\r\n   *\r\n   * _.toInteger('3.2');\r\n   * // => 3\r\n   */\r\n  function toInteger(value) {\r\n    var result = toFinite(value),\r\n        remainder = result % 1;\r\n\r\n    return result === result ? (remainder ? result - remainder : result) : 0;\r\n  }\r\n\r\n  /**\r\n   * Converts `value` to a number.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to process.\r\n   * @returns {number} Returns the number.\r\n   * @example\r\n   *\r\n   * _.toNumber(3.2);\r\n   * // => 3.2\r\n   *\r\n   * _.toNumber(Number.MIN_VALUE);\r\n   * // => 5e-324\r\n   *\r\n   * _.toNumber(Infinity);\r\n   * // => Infinity\r\n   *\r\n   * _.toNumber('3.2');\r\n   * // => 3.2\r\n   */\r\n  function toNumber(value) {\r\n    if (typeof value == 'number') {\r\n      return value;\r\n    }\r\n    if (isSymbol(value)) {\r\n      return NAN;\r\n    }\r\n    if (isObject(value)) {\r\n      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;\r\n      value = isObject(other) ? (other + '') : other;\r\n    }\r\n    if (typeof value != 'string') {\r\n      return value === 0 ? value : +value;\r\n    }\r\n    value = value.replace(reTrim, '');\r\n    var isBinary = reIsBinary.test(value);\r\n    return (isBinary || reIsOctal.test(value))\r\n      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)\r\n      : (reIsBadHex.test(value) ? NAN : +value);\r\n  }\r\n\r\n  /**\r\n   * Converts `value` to a plain object flattening inherited enumerable string\r\n   * keyed properties of `value` to own properties of the plain object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to convert.\r\n   * @returns {Object} Returns the converted plain object.\r\n   * @example\r\n   *\r\n   * function Foo() {\r\n   *   this.b = 2;\r\n   * }\r\n   *\r\n   * Foo.prototype.c = 3;\r\n   *\r\n   * _.assign({ 'a': 1 }, new Foo);\r\n   * // => { 'a': 1, 'b': 2 }\r\n   *\r\n   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));\r\n   * // => { 'a': 1, 'b': 2, 'c': 3 }\r\n   */\r\n  function toPlainObject(value) {\r\n    return copyObject(value, keysIn(value));\r\n  }\r\n\r\n  /**\r\n   * Converts `value` to a string. An empty string is returned for `null`\r\n   * and `undefined` values. The sign of `-0` is preserved.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Lang\r\n   * @param {*} value The value to convert.\r\n   * @returns {string} Returns the converted string.\r\n   * @example\r\n   *\r\n   * _.toString(null);\r\n   * // => ''\r\n   *\r\n   * _.toString(-0);\r\n   * // => '-0'\r\n   *\r\n   * _.toString([1, 2, 3]);\r\n   * // => '1,2,3'\r\n   */\r\n  function toString(value) {\r\n    return value == null ? '' : baseToString(value);\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * This method is like `_.assign` except that it iterates over own and\r\n   * inherited source properties.\r\n   *\r\n   * **Note:** This method mutates `object`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @alias extend\r\n   * @category Object\r\n   * @param {Object} object The destination object.\r\n   * @param {...Object} [sources] The source objects.\r\n   * @returns {Object} Returns `object`.\r\n   * @see _.assign\r\n   * @example\r\n   *\r\n   * function Foo() {\r\n   *   this.a = 1;\r\n   * }\r\n   *\r\n   * function Bar() {\r\n   *   this.c = 3;\r\n   * }\r\n   *\r\n   * Foo.prototype.b = 2;\r\n   * Bar.prototype.d = 4;\r\n   *\r\n   * _.assignIn({ 'a': 0 }, new Foo, new Bar);\r\n   * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }\r\n   */\r\n  var assignIn = createAssigner(function(object, source) {\r\n    copyObject(source, keysIn(source), object);\r\n  });\r\n\r\n  /**\r\n   * Creates an object that inherits from the `prototype` object. If a\r\n   * `properties` object is given, its own enumerable string keyed properties\r\n   * are assigned to the created object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 2.3.0\r\n   * @category Object\r\n   * @param {Object} prototype The object to inherit from.\r\n   * @param {Object} [properties] The properties to assign to the object.\r\n   * @returns {Object} Returns the new object.\r\n   * @example\r\n   *\r\n   * function Shape() {\r\n   *   this.x = 0;\r\n   *   this.y = 0;\r\n   * }\r\n   *\r\n   * function Circle() {\r\n   *   Shape.call(this);\r\n   * }\r\n   *\r\n   * Circle.prototype = _.create(Shape.prototype, {\r\n   *   'constructor': Circle\r\n   * });\r\n   *\r\n   * var circle = new Circle;\r\n   * circle instanceof Circle;\r\n   * // => true\r\n   *\r\n   * circle instanceof Shape;\r\n   * // => true\r\n   */\r\n  function create(prototype, properties) {\r\n    var result = baseCreate(prototype);\r\n    return properties == null ? result : baseAssign(result, properties);\r\n  }\r\n\r\n  /**\r\n   * Assigns own and inherited enumerable string keyed properties of source\r\n   * objects to the destination object for all destination properties that\r\n   * resolve to `undefined`. Source objects are applied from left to right.\r\n   * Once a property is set, additional values of the same property are ignored.\r\n   *\r\n   * **Note:** This method mutates `object`.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Object\r\n   * @param {Object} object The destination object.\r\n   * @param {...Object} [sources] The source objects.\r\n   * @returns {Object} Returns `object`.\r\n   * @see _.defaultsDeep\r\n   * @example\r\n   *\r\n   * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });\r\n   * // => { 'a': 1, 'b': 2 }\r\n   */\r\n  var defaults = baseRest(function(object, sources) {\r\n    object = Object(object);\r\n\r\n    var index = -1;\r\n    var length = sources.length;\r\n    var guard = length > 2 ? sources[2] : undefined;\r\n\r\n    if (guard && isIterateeCall(sources[0], sources[1], guard)) {\r\n      length = 1;\r\n    }\r\n\r\n    while (++index < length) {\r\n      var source = sources[index];\r\n      var props = keysIn(source);\r\n      var propsIndex = -1;\r\n      var propsLength = props.length;\r\n\r\n      while (++propsIndex < propsLength) {\r\n        var key = props[propsIndex];\r\n        var value = object[key];\r\n\r\n        if (value === undefined ||\r\n            (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {\r\n          object[key] = source[key];\r\n        }\r\n      }\r\n    }\r\n\r\n    return object;\r\n  });\r\n\r\n  /**\r\n   * This method is like `_.defaults` except that it recursively assigns\r\n   * default properties.\r\n   *\r\n   * **Note:** This method mutates `object`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.10.0\r\n   * @category Object\r\n   * @param {Object} object The destination object.\r\n   * @param {...Object} [sources] The source objects.\r\n   * @returns {Object} Returns `object`.\r\n   * @see _.defaults\r\n   * @example\r\n   *\r\n   * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });\r\n   * // => { 'a': { 'b': 2, 'c': 3 } }\r\n   */\r\n  var defaultsDeep = baseRest(function(args) {\r\n    args.push(undefined, customDefaultsMerge);\r\n    return apply(mergeWith, undefined, args);\r\n  });\r\n\r\n  /**\r\n   * This method is like `_.find` except that it returns the key of the first\r\n   * element `predicate` returns truthy for instead of the element itself.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 1.1.0\r\n   * @category Object\r\n   * @param {Object} object The object to inspect.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @returns {string|undefined} Returns the key of the matched element,\r\n   *  else `undefined`.\r\n   * @example\r\n   *\r\n   * var users = {\r\n   *   'barney':  { 'age': 36, 'active': true },\r\n   *   'fred':    { 'age': 40, 'active': false },\r\n   *   'pebbles': { 'age': 1,  'active': true }\r\n   * };\r\n   *\r\n   * _.findKey(users, function(o) { return o.age < 40; });\r\n   * // => 'barney' (iteration order is not guaranteed)\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.findKey(users, { 'age': 1, 'active': true });\r\n   * // => 'pebbles'\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.findKey(users, ['active', false]);\r\n   * // => 'fred'\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.findKey(users, 'active');\r\n   * // => 'barney'\r\n   */\r\n  function findKey(object, predicate) {\r\n    return baseFindKey(object, baseIteratee(predicate, 3), baseForOwn);\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.findKey` except that it iterates over elements of\r\n   * a collection in the opposite order.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 2.0.0\r\n   * @category Object\r\n   * @param {Object} object The object to inspect.\r\n   * @param {Function} [predicate=_.identity] The function invoked per iteration.\r\n   * @returns {string|undefined} Returns the key of the matched element,\r\n   *  else `undefined`.\r\n   * @example\r\n   *\r\n   * var users = {\r\n   *   'barney':  { 'age': 36, 'active': true },\r\n   *   'fred':    { 'age': 40, 'active': false },\r\n   *   'pebbles': { 'age': 1,  'active': true }\r\n   * };\r\n   *\r\n   * _.findLastKey(users, function(o) { return o.age < 40; });\r\n   * // => returns 'pebbles' assuming `_.findKey` returns 'barney'\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.findLastKey(users, { 'age': 36, 'active': true });\r\n   * // => 'barney'\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.findLastKey(users, ['active', false]);\r\n   * // => 'fred'\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.findLastKey(users, 'active');\r\n   * // => 'pebbles'\r\n   */\r\n  function findLastKey(object, predicate) {\r\n    return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);\r\n  }\r\n\r\n  /**\r\n   * Gets the value at `path` of `object`. If the resolved value is\r\n   * `undefined`, the `defaultValue` is returned in its place.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.7.0\r\n   * @category Object\r\n   * @param {Object} object The object to query.\r\n   * @param {Array|string} path The path of the property to get.\r\n   * @param {*} [defaultValue] The value returned for `undefined` resolved values.\r\n   * @returns {*} Returns the resolved value.\r\n   * @example\r\n   *\r\n   * var object = { 'a': [{ 'b': { 'c': 3 } }] };\r\n   *\r\n   * _.get(object, 'a[0].b.c');\r\n   * // => 3\r\n   *\r\n   * _.get(object, ['a', '0', 'b', 'c']);\r\n   * // => 3\r\n   *\r\n   * _.get(object, 'a.b.c', 'default');\r\n   * // => 'default'\r\n   */\r\n  function get(object, path, defaultValue) {\r\n    var result = object == null ? undefined : baseGet(object, path);\r\n    return result === undefined ? defaultValue : result;\r\n  }\r\n\r\n  /**\r\n   * Checks if `path` is a direct property of `object`.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Object\r\n   * @param {Object} object The object to query.\r\n   * @param {Array|string} path The path to check.\r\n   * @returns {boolean} Returns `true` if `path` exists, else `false`.\r\n   * @example\r\n   *\r\n   * var object = { 'a': { 'b': 2 } };\r\n   * var other = _.create({ 'a': _.create({ 'b': 2 }) });\r\n   *\r\n   * _.has(object, 'a');\r\n   * // => true\r\n   *\r\n   * _.has(object, 'a.b');\r\n   * // => true\r\n   *\r\n   * _.has(object, ['a', 'b']);\r\n   * // => true\r\n   *\r\n   * _.has(other, 'a');\r\n   * // => false\r\n   */\r\n  function has(object, path) {\r\n    return object != null && hasPath(object, path, baseHas);\r\n  }\r\n\r\n  /**\r\n   * Checks if `path` is a direct or inherited property of `object`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Object\r\n   * @param {Object} object The object to query.\r\n   * @param {Array|string} path The path to check.\r\n   * @returns {boolean} Returns `true` if `path` exists, else `false`.\r\n   * @example\r\n   *\r\n   * var object = _.create({ 'a': _.create({ 'b': 2 }) });\r\n   *\r\n   * _.hasIn(object, 'a');\r\n   * // => true\r\n   *\r\n   * _.hasIn(object, 'a.b');\r\n   * // => true\r\n   *\r\n   * _.hasIn(object, ['a', 'b']);\r\n   * // => true\r\n   *\r\n   * _.hasIn(object, 'b');\r\n   * // => false\r\n   */\r\n  function hasIn(object, path) {\r\n    return object != null && hasPath(object, path, baseHasIn);\r\n  }\r\n\r\n  /**\r\n   * Creates an object composed of the inverted keys and values of `object`.\r\n   * If `object` contains duplicate values, subsequent values overwrite\r\n   * property assignments of previous values.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.7.0\r\n   * @category Object\r\n   * @param {Object} object The object to invert.\r\n   * @returns {Object} Returns the new inverted object.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1, 'b': 2, 'c': 1 };\r\n   *\r\n   * _.invert(object);\r\n   * // => { '1': 'c', '2': 'b' }\r\n   */\r\n  var invert = createInverter(function(result, value, key) {\r\n    if (value != null &&\r\n        typeof value.toString != 'function') {\r\n      value = nativeObjectToString.call(value);\r\n    }\r\n\r\n    result[value] = key;\r\n  }, constant(identity));\r\n\r\n  /**\r\n   * This method is like `_.invert` except that the inverted object is generated\r\n   * from the results of running each element of `object` thru `iteratee`. The\r\n   * corresponding inverted value of each inverted key is an array of keys\r\n   * responsible for generating the inverted value. The iteratee is invoked\r\n   * with one argument: (value).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.1.0\r\n   * @category Object\r\n   * @param {Object} object The object to invert.\r\n   * @param {Function} [iteratee=_.identity] The iteratee invoked per element.\r\n   * @returns {Object} Returns the new inverted object.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1, 'b': 2, 'c': 1 };\r\n   *\r\n   * _.invertBy(object);\r\n   * // => { '1': ['a', 'c'], '2': ['b'] }\r\n   *\r\n   * _.invertBy(object, function(value) {\r\n   *   return 'group' + value;\r\n   * });\r\n   * // => { 'group1': ['a', 'c'], 'group2': ['b'] }\r\n   */\r\n  var invertBy = createInverter(function(result, value, key) {\r\n    if (value != null &&\r\n        typeof value.toString != 'function') {\r\n      value = nativeObjectToString.call(value);\r\n    }\r\n\r\n    if (hasOwnProperty.call(result, value)) {\r\n      result[value].push(key);\r\n    } else {\r\n      result[value] = [key];\r\n    }\r\n  }, baseIteratee);\r\n\r\n  /**\r\n   * Creates an array of the own enumerable property names of `object`.\r\n   *\r\n   * **Note:** Non-object values are coerced to objects. See the\r\n   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)\r\n   * for more details.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Object\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of property names.\r\n   * @example\r\n   *\r\n   * function Foo() {\r\n   *   this.a = 1;\r\n   *   this.b = 2;\r\n   * }\r\n   *\r\n   * Foo.prototype.c = 3;\r\n   *\r\n   * _.keys(new Foo);\r\n   * // => ['a', 'b'] (iteration order is not guaranteed)\r\n   *\r\n   * _.keys('hi');\r\n   * // => ['0', '1']\r\n   */\r\n  function keys(object) {\r\n    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);\r\n  }\r\n\r\n  /**\r\n   * Creates an array of the own and inherited enumerable property names of `object`.\r\n   *\r\n   * **Note:** Non-object values are coerced to objects.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Object\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of property names.\r\n   * @example\r\n   *\r\n   * function Foo() {\r\n   *   this.a = 1;\r\n   *   this.b = 2;\r\n   * }\r\n   *\r\n   * Foo.prototype.c = 3;\r\n   *\r\n   * _.keysIn(new Foo);\r\n   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)\r\n   */\r\n  function keysIn(object) {\r\n    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.assign` except that it recursively merges own and\r\n   * inherited enumerable string keyed properties of source objects into the\r\n   * destination object. Source properties that resolve to `undefined` are\r\n   * skipped if a destination value exists. Array and plain object properties\r\n   * are merged recursively. Other objects and value types are overridden by\r\n   * assignment. Source objects are applied from left to right. Subsequent\r\n   * sources overwrite property assignments of previous sources.\r\n   *\r\n   * **Note:** This method mutates `object`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.5.0\r\n   * @category Object\r\n   * @param {Object} object The destination object.\r\n   * @param {...Object} [sources] The source objects.\r\n   * @returns {Object} Returns `object`.\r\n   * @example\r\n   *\r\n   * var object = {\r\n   *   'a': [{ 'b': 2 }, { 'd': 4 }]\r\n   * };\r\n   *\r\n   * var other = {\r\n   *   'a': [{ 'c': 3 }, { 'e': 5 }]\r\n   * };\r\n   *\r\n   * _.merge(object, other);\r\n   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }\r\n   */\r\n  var merge = createAssigner(function(object, source, srcIndex) {\r\n    baseMerge(object, source, srcIndex);\r\n  });\r\n\r\n  /**\r\n   * This method is like `_.merge` except that it accepts `customizer` which\r\n   * is invoked to produce the merged values of the destination and source\r\n   * properties. If `customizer` returns `undefined`, merging is handled by the\r\n   * method instead. The `customizer` is invoked with six arguments:\r\n   * (objValue, srcValue, key, object, source, stack).\r\n   *\r\n   * **Note:** This method mutates `object`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Object\r\n   * @param {Object} object The destination object.\r\n   * @param {...Object} sources The source objects.\r\n   * @param {Function} customizer The function to customize assigned values.\r\n   * @returns {Object} Returns `object`.\r\n   * @example\r\n   *\r\n   * function customizer(objValue, srcValue) {\r\n   *   if (_.isArray(objValue)) {\r\n   *     return objValue.concat(srcValue);\r\n   *   }\r\n   * }\r\n   *\r\n   * var object = { 'a': [1], 'b': [2] };\r\n   * var other = { 'a': [3], 'b': [4] };\r\n   *\r\n   * _.mergeWith(object, other, customizer);\r\n   * // => { 'a': [1, 3], 'b': [2, 4] }\r\n   */\r\n  var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {\r\n    baseMerge(object, source, srcIndex, customizer);\r\n  });\r\n\r\n  /**\r\n   * The opposite of `_.pick`; this method creates an object composed of the\r\n   * own and inherited enumerable property paths of `object` that are not omitted.\r\n   *\r\n   * **Note:** This method is considerably slower than `_.pick`.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Object\r\n   * @param {Object} object The source object.\r\n   * @param {...(string|string[])} [paths] The property paths to omit.\r\n   * @returns {Object} Returns the new object.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1, 'b': '2', 'c': 3 };\r\n   *\r\n   * _.omit(object, ['a', 'c']);\r\n   * // => { 'b': '2' }\r\n   */\r\n  var omit = flatRest(function(object, paths) {\r\n    var result = {};\r\n    if (object == null) {\r\n      return result;\r\n    }\r\n    var isDeep = false;\r\n    paths = arrayMap(paths, function(path) {\r\n      path = castPath(path, object);\r\n      isDeep || (isDeep = path.length > 1);\r\n      return path;\r\n    });\r\n    copyObject(object, getAllKeysIn(object), result);\r\n    if (isDeep) {\r\n      result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);\r\n    }\r\n    var length = paths.length;\r\n    while (length--) {\r\n      baseUnset(result, paths[length]);\r\n    }\r\n    return result;\r\n  });\r\n\r\n  /**\r\n   * The opposite of `_.pickBy`; this method creates an object composed of\r\n   * the own and inherited enumerable string keyed properties of `object` that\r\n   * `predicate` doesn't return truthy for. The predicate is invoked with two\r\n   * arguments: (value, key).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Object\r\n   * @param {Object} object The source object.\r\n   * @param {Function} [predicate=_.identity] The function invoked per property.\r\n   * @returns {Object} Returns the new object.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1, 'b': '2', 'c': 3 };\r\n   *\r\n   * _.omitBy(object, _.isNumber);\r\n   * // => { 'b': '2' }\r\n   */\r\n  function omitBy(object, predicate) {\r\n    return pickBy(object, negate(baseIteratee(predicate)));\r\n  }\r\n\r\n  /**\r\n   * Creates an object composed of the picked `object` properties.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Object\r\n   * @param {Object} object The source object.\r\n   * @param {...(string|string[])} [paths] The property paths to pick.\r\n   * @returns {Object} Returns the new object.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1, 'b': '2', 'c': 3 };\r\n   *\r\n   * _.pick(object, ['a', 'c']);\r\n   * // => { 'a': 1, 'c': 3 }\r\n   */\r\n  var pick = flatRest(function(object, paths) {\r\n    return object == null ? {} : basePick(object, paths);\r\n  });\r\n\r\n  /**\r\n   * Creates an object composed of the `object` properties `predicate` returns\r\n   * truthy for. The predicate is invoked with two arguments: (value, key).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Object\r\n   * @param {Object} object The source object.\r\n   * @param {Function} [predicate=_.identity] The function invoked per property.\r\n   * @returns {Object} Returns the new object.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1, 'b': '2', 'c': 3 };\r\n   *\r\n   * _.pickBy(object, _.isNumber);\r\n   * // => { 'a': 1, 'c': 3 }\r\n   */\r\n  function pickBy(object, predicate) {\r\n    if (object == null) {\r\n      return {};\r\n    }\r\n    var props = arrayMap(getAllKeysIn(object), function(prop) {\r\n      return [prop];\r\n    });\r\n    predicate = baseIteratee(predicate);\r\n    return basePickBy(object, props, function(value, path) {\r\n      return predicate(value, path[0]);\r\n    });\r\n  }\r\n\r\n  /**\r\n   * This method is like `_.get` except that if the resolved value is a\r\n   * function it's invoked with the `this` binding of its parent object and\r\n   * its result is returned.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Object\r\n   * @param {Object} object The object to query.\r\n   * @param {Array|string} path The path of the property to resolve.\r\n   * @param {*} [defaultValue] The value returned for `undefined` resolved values.\r\n   * @returns {*} Returns the resolved value.\r\n   * @example\r\n   *\r\n   * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };\r\n   *\r\n   * _.result(object, 'a[0].b.c1');\r\n   * // => 3\r\n   *\r\n   * _.result(object, 'a[0].b.c2');\r\n   * // => 4\r\n   *\r\n   * _.result(object, 'a[0].b.c3', 'default');\r\n   * // => 'default'\r\n   *\r\n   * _.result(object, 'a[0].b.c3', _.constant('default'));\r\n   * // => 'default'\r\n   */\r\n  function result(object, path, defaultValue) {\r\n    path = castPath(path, object);\r\n\r\n    var index = -1,\r\n        length = path.length;\r\n\r\n    // Ensure the loop is entered when path is empty.\r\n    if (!length) {\r\n      length = 1;\r\n      object = undefined;\r\n    }\r\n    while (++index < length) {\r\n      var value = object == null ? undefined : object[toKey(path[index])];\r\n      if (value === undefined) {\r\n        index = length;\r\n        value = defaultValue;\r\n      }\r\n      object = isFunction(value) ? value.call(object) : value;\r\n    }\r\n    return object;\r\n  }\r\n\r\n  /**\r\n   * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,\r\n   * it's created. Arrays are created for missing index properties while objects\r\n   * are created for all other missing properties. Use `_.setWith` to customize\r\n   * `path` creation.\r\n   *\r\n   * **Note:** This method mutates `object`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.7.0\r\n   * @category Object\r\n   * @param {Object} object The object to modify.\r\n   * @param {Array|string} path The path of the property to set.\r\n   * @param {*} value The value to set.\r\n   * @returns {Object} Returns `object`.\r\n   * @example\r\n   *\r\n   * var object = { 'a': [{ 'b': { 'c': 3 } }] };\r\n   *\r\n   * _.set(object, 'a[0].b.c', 4);\r\n   * console.log(object.a[0].b.c);\r\n   * // => 4\r\n   *\r\n   * _.set(object, ['x', '0', 'y', 'z'], 5);\r\n   * console.log(object.x[0].y.z);\r\n   * // => 5\r\n   */\r\n  function set(object, path, value) {\r\n    return object == null ? object : baseSet(object, path, value);\r\n  }\r\n\r\n  /**\r\n   * Creates an array of the own enumerable string keyed property values of `object`.\r\n   *\r\n   * **Note:** Non-object values are coerced to objects.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Object\r\n   * @param {Object} object The object to query.\r\n   * @returns {Array} Returns the array of property values.\r\n   * @example\r\n   *\r\n   * function Foo() {\r\n   *   this.a = 1;\r\n   *   this.b = 2;\r\n   * }\r\n   *\r\n   * Foo.prototype.c = 3;\r\n   *\r\n   * _.values(new Foo);\r\n   * // => [1, 2] (iteration order is not guaranteed)\r\n   *\r\n   * _.values('hi');\r\n   * // => ['h', 'i']\r\n   */\r\n  function values(object) {\r\n    return object == null ? [] : baseValues(object, keys(object));\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Clamps `number` within the inclusive `lower` and `upper` bounds.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.0.0\r\n   * @category Number\r\n   * @param {number} number The number to clamp.\r\n   * @param {number} [lower] The lower bound.\r\n   * @param {number} upper The upper bound.\r\n   * @returns {number} Returns the clamped number.\r\n   * @example\r\n   *\r\n   * _.clamp(-10, -5, 5);\r\n   * // => -5\r\n   *\r\n   * _.clamp(10, -5, 5);\r\n   * // => 5\r\n   */\r\n  function clamp(number, lower, upper) {\r\n    if (upper === undefined) {\r\n      upper = lower;\r\n      lower = undefined;\r\n    }\r\n    if (upper !== undefined) {\r\n      upper = toNumber(upper);\r\n      upper = upper === upper ? upper : 0;\r\n    }\r\n    if (lower !== undefined) {\r\n      lower = toNumber(lower);\r\n      lower = lower === lower ? lower : 0;\r\n    }\r\n    return baseClamp(toNumber(number), lower, upper);\r\n  }\r\n\r\n  /**\r\n   * Produces a random number between the inclusive `lower` and `upper` bounds.\r\n   * If only one argument is provided a number between `0` and the given number\r\n   * is returned. If `floating` is `true`, or either `lower` or `upper` are\r\n   * floats, a floating-point number is returned instead of an integer.\r\n   *\r\n   * **Note:** JavaScript follows the IEEE-754 standard for resolving\r\n   * floating-point values which can produce unexpected results.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.7.0\r\n   * @category Number\r\n   * @param {number} [lower=0] The lower bound.\r\n   * @param {number} [upper=1] The upper bound.\r\n   * @param {boolean} [floating] Specify returning a floating-point number.\r\n   * @returns {number} Returns the random number.\r\n   * @example\r\n   *\r\n   * _.random(0, 5);\r\n   * // => an integer between 0 and 5\r\n   *\r\n   * _.random(5);\r\n   * // => also an integer between 0 and 5\r\n   *\r\n   * _.random(5, true);\r\n   * // => a floating-point number between 0 and 5\r\n   *\r\n   * _.random(1.2, 5.2);\r\n   * // => a floating-point number between 1.2 and 5.2\r\n   */\r\n  function random(lower, upper, floating) {\r\n    if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {\r\n      upper = floating = undefined;\r\n    }\r\n    if (floating === undefined) {\r\n      if (typeof upper == 'boolean') {\r\n        floating = upper;\r\n        upper = undefined;\r\n      }\r\n      else if (typeof lower == 'boolean') {\r\n        floating = lower;\r\n        lower = undefined;\r\n      }\r\n    }\r\n    if (lower === undefined && upper === undefined) {\r\n      lower = 0;\r\n      upper = 1;\r\n    }\r\n    else {\r\n      lower = toFinite(lower);\r\n      if (upper === undefined) {\r\n        upper = lower;\r\n        lower = 0;\r\n      } else {\r\n        upper = toFinite(upper);\r\n      }\r\n    }\r\n    if (lower > upper) {\r\n      var temp = lower;\r\n      lower = upper;\r\n      upper = temp;\r\n    }\r\n    if (floating || lower % 1 || upper % 1) {\r\n      var rand = nativeRandom();\r\n      return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);\r\n    }\r\n    return baseRandom(lower, upper);\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Converts the characters \"&\", \"<\", \">\", '\"', and \"'\" in `string` to their\r\n   * corresponding HTML entities.\r\n   *\r\n   * **Note:** No other characters are escaped. To escape additional\r\n   * characters use a third-party library like [_he_](https://mths.be/he).\r\n   *\r\n   * Though the \">\" character is escaped for symmetry, characters like\r\n   * \">\" and \"/\" don't need escaping in HTML and have no special meaning\r\n   * unless they're part of a tag or unquoted attribute value. See\r\n   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)\r\n   * (under \"semi-related fun fact\") for more details.\r\n   *\r\n   * When working with HTML you should always\r\n   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce\r\n   * XSS vectors.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category String\r\n   * @param {string} [string=''] The string to escape.\r\n   * @returns {string} Returns the escaped string.\r\n   * @example\r\n   *\r\n   * _.escape('fred, barney, & pebbles');\r\n   * // => 'fred, barney, &amp; pebbles'\r\n   */\r\n  function escape(string) {\r\n    string = toString(string);\r\n    return (string && reHasUnescapedHtml.test(string))\r\n      ? string.replace(reUnescapedHtml, escapeHtmlChar)\r\n      : string;\r\n  }\r\n\r\n  /**\r\n   * Removes leading and trailing whitespace or specified characters from `string`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category String\r\n   * @param {string} [string=''] The string to trim.\r\n   * @param {string} [chars=whitespace] The characters to trim.\r\n   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.\r\n   * @returns {string} Returns the trimmed string.\r\n   * @example\r\n   *\r\n   * _.trim('  abc  ');\r\n   * // => 'abc'\r\n   *\r\n   * _.trim('-_-abc-_-', '_-');\r\n   * // => 'abc'\r\n   *\r\n   * _.map(['  foo  ', '  bar  '], _.trim);\r\n   * // => ['foo', 'bar']\r\n   */\r\n  function trim(string, chars, guard) {\r\n    string = toString(string);\r\n    if (string && (guard || chars === undefined)) {\r\n      return string.replace(reTrim, '');\r\n    }\r\n    if (!string || !(chars = baseToString(chars))) {\r\n      return string;\r\n    }\r\n    var strSymbols = stringToArray(string),\r\n        chrSymbols = stringToArray(chars),\r\n        start = charsStartIndex(strSymbols, chrSymbols),\r\n        end = charsEndIndex(strSymbols, chrSymbols) + 1;\r\n\r\n    return castSlice(strSymbols, start, end).join('');\r\n  }\r\n\r\n  /**\r\n   * The inverse of `_.escape`; this method converts the HTML entities\r\n   * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to\r\n   * their corresponding characters.\r\n   *\r\n   * **Note:** No other HTML entities are unescaped. To unescape additional\r\n   * HTML entities use a third-party library like [_he_](https://mths.be/he).\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 0.6.0\r\n   * @category String\r\n   * @param {string} [string=''] The string to unescape.\r\n   * @returns {string} Returns the unescaped string.\r\n   * @example\r\n   *\r\n   * _.unescape('fred, barney, &amp; pebbles');\r\n   * // => 'fred, barney, & pebbles'\r\n   */\r\n  function unescape(string) {\r\n    string = toString(string);\r\n    return (string && reHasEscapedHtml.test(string))\r\n      ? string.replace(reEscapedHtml, unescapeHtmlChar)\r\n      : string;\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Creates a function that returns `value`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 2.4.0\r\n   * @category Util\r\n   * @param {*} value The value to return from the new function.\r\n   * @returns {Function} Returns the new constant function.\r\n   * @example\r\n   *\r\n   * var objects = _.times(2, _.constant({ 'a': 1 }));\r\n   *\r\n   * console.log(objects);\r\n   * // => [{ 'a': 1 }, { 'a': 1 }]\r\n   *\r\n   * console.log(objects[0] === objects[1]);\r\n   * // => true\r\n   */\r\n  function constant(value) {\r\n    return function() {\r\n      return value;\r\n    };\r\n  }\r\n\r\n  /**\r\n   * This method returns the first argument it receives.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Util\r\n   * @param {*} value Any value.\r\n   * @returns {*} Returns `value`.\r\n   * @example\r\n   *\r\n   * var object = { 'a': 1 };\r\n   *\r\n   * console.log(_.identity(object) === object);\r\n   * // => true\r\n   */\r\n  function identity(value) {\r\n    return value;\r\n  }\r\n\r\n  /**\r\n   * Creates a function that invokes `func` with the arguments of the created\r\n   * function. If `func` is a property name, the created function returns the\r\n   * property value for a given element. If `func` is an array or object, the\r\n   * created function returns `true` for elements that contain the equivalent\r\n   * source properties, otherwise it returns `false`.\r\n   *\r\n   * @static\r\n   * @since 4.0.0\r\n   * @memberOf _\r\n   * @category Util\r\n   * @param {*} [func=_.identity] The value to convert to a callback.\r\n   * @returns {Function} Returns the callback.\r\n   * @example\r\n   *\r\n   * var users = [\r\n   *   { 'user': 'barney', 'age': 36, 'active': true },\r\n   *   { 'user': 'fred',   'age': 40, 'active': false }\r\n   * ];\r\n   *\r\n   * // The `_.matches` iteratee shorthand.\r\n   * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));\r\n   * // => [{ 'user': 'barney', 'age': 36, 'active': true }]\r\n   *\r\n   * // The `_.matchesProperty` iteratee shorthand.\r\n   * _.filter(users, _.iteratee(['user', 'fred']));\r\n   * // => [{ 'user': 'fred', 'age': 40 }]\r\n   *\r\n   * // The `_.property` iteratee shorthand.\r\n   * _.map(users, _.iteratee('user'));\r\n   * // => ['barney', 'fred']\r\n   *\r\n   * // Create custom iteratee shorthands.\r\n   * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {\r\n   *   return !_.isRegExp(func) ? iteratee(func) : function(string) {\r\n   *     return func.test(string);\r\n   *   };\r\n   * });\r\n   *\r\n   * _.filter(['abc', 'def'], /ef/);\r\n   * // => ['def']\r\n   */\r\n  function iteratee(func) {\r\n    return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));\r\n  }\r\n\r\n  /**\r\n   * Creates a function that performs a partial deep comparison between a given\r\n   * object and `source`, returning `true` if the given object has equivalent\r\n   * property values, else `false`.\r\n   *\r\n   * **Note:** The created function is equivalent to `_.isMatch` with `source`\r\n   * partially applied.\r\n   *\r\n   * Partial comparisons will match empty array and empty object `source`\r\n   * values against any array or object value, respectively. See `_.isEqual`\r\n   * for a list of supported value comparisons.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 3.0.0\r\n   * @category Util\r\n   * @param {Object} source The object of property values to match.\r\n   * @returns {Function} Returns the new spec function.\r\n   * @example\r\n   *\r\n   * var objects = [\r\n   *   { 'a': 1, 'b': 2, 'c': 3 },\r\n   *   { 'a': 4, 'b': 5, 'c': 6 }\r\n   * ];\r\n   *\r\n   * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));\r\n   * // => [{ 'a': 4, 'b': 5, 'c': 6 }]\r\n   */\r\n  function matches(source) {\r\n    return baseMatches(baseClone(source, CLONE_DEEP_FLAG));\r\n  }\r\n\r\n  /**\r\n   * Adds all own enumerable string keyed function properties of a source\r\n   * object to the destination object. If `object` is a function, then methods\r\n   * are added to its prototype as well.\r\n   *\r\n   * **Note:** Use `_.runInContext` to create a pristine `lodash` function to\r\n   * avoid conflicts caused by modifying the original.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Util\r\n   * @param {Function|Object} [object=lodash] The destination object.\r\n   * @param {Object} source The object of functions to add.\r\n   * @param {Object} [options={}] The options object.\r\n   * @param {boolean} [options.chain=true] Specify whether mixins are chainable.\r\n   * @returns {Function|Object} Returns `object`.\r\n   * @example\r\n   *\r\n   * function vowels(string) {\r\n   *   return _.filter(string, function(v) {\r\n   *     return /[aeiou]/i.test(v);\r\n   *   });\r\n   * }\r\n   *\r\n   * _.mixin({ 'vowels': vowels });\r\n   * _.vowels('fred');\r\n   * // => ['e']\r\n   *\r\n   * _('fred').vowels().value();\r\n   * // => ['e']\r\n   *\r\n   * _.mixin({ 'vowels': vowels }, { 'chain': false });\r\n   * _('fred').vowels();\r\n   * // => ['e']\r\n   */\r\n  function mixin(object, source, options) {\r\n    var props = keys(source),\r\n        methodNames = baseFunctions(source, props);\r\n\r\n    if (options == null &&\r\n        !(isObject(source) && (methodNames.length || !props.length))) {\r\n      options = source;\r\n      source = object;\r\n      object = this;\r\n      methodNames = baseFunctions(source, keys(source));\r\n    }\r\n    var chain = !(isObject(options) && 'chain' in options) || !!options.chain,\r\n        isFunc = isFunction(object);\r\n\r\n    arrayEach(methodNames, function(methodName) {\r\n      var func = source[methodName];\r\n      object[methodName] = func;\r\n      if (isFunc) {\r\n        object.prototype[methodName] = function() {\r\n          var chainAll = this.__chain__;\r\n          if (chain || chainAll) {\r\n            var result = object(this.__wrapped__),\r\n                actions = result.__actions__ = copyArray(this.__actions__);\r\n\r\n            actions.push({ 'func': func, 'args': arguments, 'thisArg': object });\r\n            result.__chain__ = chainAll;\r\n            return result;\r\n          }\r\n          return func.apply(object, arrayPush([this.value()], arguments));\r\n        };\r\n      }\r\n    });\r\n\r\n    return object;\r\n  }\r\n\r\n  /**\r\n   * Reverts the `_` variable to its previous value and returns a reference to\r\n   * the `lodash` function.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Util\r\n   * @returns {Function} Returns the `lodash` function.\r\n   * @example\r\n   *\r\n   * var lodash = _.noConflict();\r\n   */\r\n  function noConflict() {\r\n    if (root._ === this) {\r\n      root._ = oldDash;\r\n    }\r\n    return this;\r\n  }\r\n\r\n  /**\r\n   * This method returns `undefined`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 2.3.0\r\n   * @category Util\r\n   * @example\r\n   *\r\n   * _.times(2, _.noop);\r\n   * // => [undefined, undefined]\r\n   */\r\n  function noop() {\r\n    // No operation performed.\r\n  }\r\n\r\n  /**\r\n   * Creates a function that returns the value at `path` of a given object.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 2.4.0\r\n   * @category Util\r\n   * @param {Array|string} path The path of the property to get.\r\n   * @returns {Function} Returns the new accessor function.\r\n   * @example\r\n   *\r\n   * var objects = [\r\n   *   { 'a': { 'b': 2 } },\r\n   *   { 'a': { 'b': 1 } }\r\n   * ];\r\n   *\r\n   * _.map(objects, _.property('a.b'));\r\n   * // => [2, 1]\r\n   *\r\n   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');\r\n   * // => [1, 2]\r\n   */\r\n  function property(path) {\r\n    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);\r\n  }\r\n\r\n  /**\r\n   * Creates an array of numbers (positive and/or negative) progressing from\r\n   * `start` up to, but not including, `end`. A step of `-1` is used if a negative\r\n   * `start` is specified without an `end` or `step`. If `end` is not specified,\r\n   * it's set to `start` with `start` then set to `0`.\r\n   *\r\n   * **Note:** JavaScript follows the IEEE-754 standard for resolving\r\n   * floating-point values which can produce unexpected results.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Util\r\n   * @param {number} [start=0] The start of the range.\r\n   * @param {number} end The end of the range.\r\n   * @param {number} [step=1] The value to increment or decrement by.\r\n   * @returns {Array} Returns the range of numbers.\r\n   * @see _.inRange, _.rangeRight\r\n   * @example\r\n   *\r\n   * _.range(4);\r\n   * // => [0, 1, 2, 3]\r\n   *\r\n   * _.range(-4);\r\n   * // => [0, -1, -2, -3]\r\n   *\r\n   * _.range(1, 5);\r\n   * // => [1, 2, 3, 4]\r\n   *\r\n   * _.range(0, 20, 5);\r\n   * // => [0, 5, 10, 15]\r\n   *\r\n   * _.range(0, -4, -1);\r\n   * // => [0, -1, -2, -3]\r\n   *\r\n   * _.range(1, 4, 0);\r\n   * // => [1, 1, 1]\r\n   *\r\n   * _.range(0);\r\n   * // => []\r\n   */\r\n  var range = createRange();\r\n\r\n  /**\r\n   * This method returns a new empty array.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.13.0\r\n   * @category Util\r\n   * @returns {Array} Returns the new empty array.\r\n   * @example\r\n   *\r\n   * var arrays = _.times(2, _.stubArray);\r\n   *\r\n   * console.log(arrays);\r\n   * // => [[], []]\r\n   *\r\n   * console.log(arrays[0] === arrays[1]);\r\n   * // => false\r\n   */\r\n  function stubArray() {\r\n    return [];\r\n  }\r\n\r\n  /**\r\n   * This method returns `false`.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @since 4.13.0\r\n   * @category Util\r\n   * @returns {boolean} Returns `false`.\r\n   * @example\r\n   *\r\n   * _.times(2, _.stubFalse);\r\n   * // => [false, false]\r\n   */\r\n  function stubFalse() {\r\n    return false;\r\n  }\r\n\r\n  /**\r\n   * Generates a unique ID. If `prefix` is given, the ID is appended to it.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Util\r\n   * @param {string} [prefix=''] The value to prefix the ID with.\r\n   * @returns {string} Returns the unique ID.\r\n   * @example\r\n   *\r\n   * _.uniqueId('contact_');\r\n   * // => 'contact_104'\r\n   *\r\n   * _.uniqueId();\r\n   * // => '105'\r\n   */\r\n  function uniqueId(prefix) {\r\n    var id = ++idCounter;\r\n    return toString(prefix) + id;\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * Computes the maximum value of `array`. If `array` is empty or falsey,\r\n   * `undefined` is returned.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Math\r\n   * @param {Array} array The array to iterate over.\r\n   * @returns {*} Returns the maximum value.\r\n   * @example\r\n   *\r\n   * _.max([4, 2, 8, 6]);\r\n   * // => 8\r\n   *\r\n   * _.max([]);\r\n   * // => undefined\r\n   */\r\n  function max(array) {\r\n    return (array && array.length)\r\n      ? baseExtremum(array, identity, baseGt)\r\n      : undefined;\r\n  }\r\n\r\n  /**\r\n   * Computes the minimum value of `array`. If `array` is empty or falsey,\r\n   * `undefined` is returned.\r\n   *\r\n   * @static\r\n   * @since 0.1.0\r\n   * @memberOf _\r\n   * @category Math\r\n   * @param {Array} array The array to iterate over.\r\n   * @returns {*} Returns the minimum value.\r\n   * @example\r\n   *\r\n   * _.min([4, 2, 8, 6]);\r\n   * // => 2\r\n   *\r\n   * _.min([]);\r\n   * // => undefined\r\n   */\r\n  function min(array) {\r\n    return (array && array.length)\r\n      ? baseExtremum(array, identity, baseLt)\r\n      : undefined;\r\n  }\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  // Add methods that return wrapped values in chain sequences.\r\n  lodash.after = after;\r\n  lodash.assignIn = assignIn;\r\n  lodash.before = before;\r\n  lodash.bind = bind;\r\n  lodash.chain = chain;\r\n  lodash.compact = compact;\r\n  lodash.concat = concat;\r\n  lodash.countBy = countBy;\r\n  lodash.create = create;\r\n  lodash.debounce = debounce;\r\n  lodash.defaults = defaults;\r\n  lodash.defaultsDeep = defaultsDeep;\r\n  lodash.defer = defer;\r\n  lodash.delay = delay;\r\n  lodash.difference = difference;\r\n  lodash.drop = drop;\r\n  lodash.filter = filter;\r\n  lodash.flatten = flatten;\r\n  lodash.flattenDeep = flattenDeep;\r\n  lodash.groupBy = groupBy;\r\n  lodash.initial = initial;\r\n  lodash.intersection = intersection;\r\n  lodash.invert = invert;\r\n  lodash.invertBy = invertBy;\r\n  lodash.iteratee = iteratee;\r\n  lodash.keys = keys;\r\n  lodash.map = map;\r\n  lodash.matches = matches;\r\n  lodash.merge = merge;\r\n  lodash.mixin = mixin;\r\n  lodash.negate = negate;\r\n  lodash.omit = omit;\r\n  lodash.omitBy = omitBy;\r\n  lodash.once = once;\r\n  lodash.pick = pick;\r\n  lodash.range = range;\r\n  lodash.reject = reject;\r\n  lodash.rest = rest;\r\n  lodash.set = set;\r\n  lodash.slice = slice;\r\n  lodash.sortBy = sortBy;\r\n  lodash.take = take;\r\n  lodash.takeRight = takeRight;\r\n  lodash.tap = tap;\r\n  lodash.throttle = throttle;\r\n  lodash.thru = thru;\r\n  lodash.toArray = toArray;\r\n  lodash.union = union;\r\n  lodash.uniq = uniq;\r\n  lodash.uniqBy = uniqBy;\r\n  lodash.unzip = unzip;\r\n  lodash.values = values;\r\n  lodash.without = without;\r\n  lodash.zip = zip;\r\n  lodash.zipObject = zipObject;\r\n\r\n  // Add aliases.\r\n  lodash.extend = assignIn;\r\n\r\n  // Add methods to `lodash.prototype`.\r\n  mixin(lodash, lodash);\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  // Add methods that return unwrapped values in chain sequences.\r\n  lodash.clamp = clamp;\r\n  lodash.clone = clone;\r\n  lodash.cloneDeep = cloneDeep;\r\n  lodash.escape = escape;\r\n  lodash.every = every;\r\n  lodash.find = find;\r\n  lodash.findIndex = findIndex;\r\n  lodash.findKey = findKey;\r\n  lodash.findLastIndex = findLastIndex;\r\n  lodash.findLastKey = findLastKey;\r\n  lodash.forEach = forEach;\r\n  lodash.get = get;\r\n  lodash.has = has;\r\n  lodash.head = head;\r\n  lodash.identity = identity;\r\n  lodash.indexOf = indexOf;\r\n  lodash.isArguments = isArguments;\r\n  lodash.isArray = isArray;\r\n  lodash.isArrayLike = isArrayLike;\r\n  lodash.isBoolean = isBoolean;\r\n  lodash.isDate = isDate;\r\n  lodash.isEmpty = isEmpty;\r\n  lodash.isEqual = isEqual;\r\n  lodash.isFinite = isFinite;\r\n  lodash.isFunction = isFunction;\r\n  lodash.isNaN = isNaN;\r\n  lodash.isNull = isNull;\r\n  lodash.isNumber = isNumber;\r\n  lodash.isObject = isObject;\r\n  lodash.isPlainObject = isPlainObject;\r\n  lodash.isRegExp = isRegExp;\r\n  lodash.isString = isString;\r\n  lodash.isUndefined = isUndefined;\r\n  lodash.last = last;\r\n  lodash.max = max;\r\n  lodash.min = min;\r\n  lodash.noConflict = noConflict;\r\n  lodash.noop = noop;\r\n  lodash.random = random;\r\n  lodash.reduce = reduce;\r\n  lodash.result = result;\r\n  lodash.size = size;\r\n  lodash.some = some;\r\n  lodash.trim = trim;\r\n  lodash.unescape = unescape;\r\n  lodash.uniqueId = uniqueId;\r\n\r\n  // Add aliases.\r\n  lodash.each = forEach;\r\n  lodash.first = head;\r\n\r\n  mixin(lodash, (function() {\r\n    var source = {};\r\n    baseForOwn(lodash, function(func, methodName) {\r\n      if (!hasOwnProperty.call(lodash.prototype, methodName)) {\r\n        source[methodName] = func;\r\n      }\r\n    });\r\n    return source;\r\n  }()), { 'chain': false });\r\n\r\n  /*------------------------------------------------------------------------*/\r\n\r\n  /**\r\n   * The semantic version number.\r\n   *\r\n   * @static\r\n   * @memberOf _\r\n   * @type {string}\r\n   */\r\n  lodash.VERSION = VERSION;\r\n\r\n  // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.\r\n  arrayEach(['drop', 'take'], function(methodName, index) {\r\n    LazyWrapper.prototype[methodName] = function(n) {\r\n      n = n === undefined ? 1 : nativeMax(toInteger(n), 0);\r\n\r\n      var result = (this.__filtered__ && !index)\r\n        ? new LazyWrapper(this)\r\n        : this.clone();\r\n\r\n      if (result.__filtered__) {\r\n        result.__takeCount__ = nativeMin(n, result.__takeCount__);\r\n      } else {\r\n        result.__views__.push({\r\n          'size': nativeMin(n, MAX_ARRAY_LENGTH),\r\n          'type': methodName + (result.__dir__ < 0 ? 'Right' : '')\r\n        });\r\n      }\r\n      return result;\r\n    };\r\n\r\n    LazyWrapper.prototype[methodName + 'Right'] = function(n) {\r\n      return this.reverse()[methodName](n).reverse();\r\n    };\r\n  });\r\n\r\n  // Add `LazyWrapper` methods that accept an `iteratee` value.\r\n  arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {\r\n    var type = index + 1,\r\n        isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;\r\n\r\n    LazyWrapper.prototype[methodName] = function(iteratee) {\r\n      var result = this.clone();\r\n      result.__iteratees__.push({\r\n        'iteratee': getIteratee(iteratee, 3),\r\n        'type': type\r\n      });\r\n      result.__filtered__ = result.__filtered__ || isFilter;\r\n      return result;\r\n    };\r\n  });\r\n\r\n  // Add `LazyWrapper` methods for `_.head` and `_.last`.\r\n  arrayEach(['head', 'last'], function(methodName, index) {\r\n    var takeName = 'take' + (index ? 'Right' : '');\r\n\r\n    LazyWrapper.prototype[methodName] = function() {\r\n      return this[takeName](1).value()[0];\r\n    };\r\n  });\r\n\r\n  // Add `LazyWrapper` methods for `_.initial` and `_.tail`.\r\n  arrayEach(['initial', 'tail'], function(methodName, index) {\r\n    var dropName = 'drop' + (index ? '' : 'Right');\r\n\r\n    LazyWrapper.prototype[methodName] = function() {\r\n      return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);\r\n    };\r\n  });\r\n\r\n  LazyWrapper.prototype.compact = function() {\r\n    return this.filter(identity);\r\n  };\r\n\r\n  LazyWrapper.prototype.find = function(predicate) {\r\n    return this.filter(predicate).head();\r\n  };\r\n\r\n  LazyWrapper.prototype.findLast = function(predicate) {\r\n    return this.reverse().find(predicate);\r\n  };\r\n\r\n  LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {\r\n    if (typeof path == 'function') {\r\n      return new LazyWrapper(this);\r\n    }\r\n    return this.map(function(value) {\r\n      return baseInvoke(value, path, args);\r\n    });\r\n  });\r\n\r\n  LazyWrapper.prototype.reject = function(predicate) {\r\n    return this.filter(negate(getIteratee(predicate)));\r\n  };\r\n\r\n  LazyWrapper.prototype.slice = function(start, end) {\r\n    start = toInteger(start);\r\n\r\n    var result = this;\r\n    if (result.__filtered__ && (start > 0 || end < 0)) {\r\n      return new LazyWrapper(result);\r\n    }\r\n    if (start < 0) {\r\n      result = result.takeRight(-start);\r\n    } else if (start) {\r\n      result = result.drop(start);\r\n    }\r\n    if (end !== undefined) {\r\n      end = toInteger(end);\r\n      result = end < 0 ? result.dropRight(-end) : result.take(end - start);\r\n    }\r\n    return result;\r\n  };\r\n\r\n  LazyWrapper.prototype.takeRightWhile = function(predicate) {\r\n    return this.reverse().takeWhile(predicate).reverse();\r\n  };\r\n\r\n  LazyWrapper.prototype.toArray = function() {\r\n    return this.take(MAX_ARRAY_LENGTH);\r\n  };\r\n\r\n  // Add `LazyWrapper` methods to `lodash.prototype`.\r\n  baseForOwn(LazyWrapper.prototype, function(func, methodName) {\r\n    var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),\r\n        isTaker = /^(?:head|last)$/.test(methodName),\r\n        lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],\r\n        retUnwrapped = isTaker || /^find/.test(methodName);\r\n\r\n    if (!lodashFunc) {\r\n      return;\r\n    }\r\n    lodash.prototype[methodName] = function() {\r\n      var value = this.__wrapped__,\r\n          args = isTaker ? [1] : arguments,\r\n          isLazy = value instanceof LazyWrapper,\r\n          iteratee = args[0],\r\n          useLazy = isLazy || isArray(value);\r\n\r\n      var interceptor = function(value) {\r\n        var result = lodashFunc.apply(lodash, arrayPush([value], args));\r\n        return (isTaker && chainAll) ? result[0] : result;\r\n      };\r\n\r\n      if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {\r\n        // Avoid lazy use if the iteratee has a \"length\" value other than `1`.\r\n        isLazy = useLazy = false;\r\n      }\r\n      var chainAll = this.__chain__,\r\n          isHybrid = !!this.__actions__.length,\r\n          isUnwrapped = retUnwrapped && !chainAll,\r\n          onlyLazy = isLazy && !isHybrid;\r\n\r\n      if (!retUnwrapped && useLazy) {\r\n        value = onlyLazy ? value : new LazyWrapper(this);\r\n        var result = func.apply(value, args);\r\n        result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });\r\n        return new LodashWrapper(result, chainAll);\r\n      }\r\n      if (isUnwrapped && onlyLazy) {\r\n        return func.apply(this, args);\r\n      }\r\n      result = this.thru(interceptor);\r\n      return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;\r\n    };\r\n  });\r\n\r\n  // Add `Array` methods to `lodash.prototype`.\r\n  arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {\r\n    var func = arrayProto[methodName],\r\n        chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',\r\n        retUnwrapped = /^(?:pop|shift)$/.test(methodName);\r\n\r\n    lodash.prototype[methodName] = function() {\r\n      var args = arguments;\r\n      if (retUnwrapped && !this.__chain__) {\r\n        var value = this.value();\r\n        return func.apply(isArray(value) ? value : [], args);\r\n      }\r\n      return this[chainName](function(value) {\r\n        return func.apply(isArray(value) ? value : [], args);\r\n      });\r\n    };\r\n  });\r\n\r\n  // Map minified method names to their real names.\r\n  baseForOwn(LazyWrapper.prototype, function(func, methodName) {\r\n    var lodashFunc = lodash[methodName];\r\n    if (lodashFunc) {\r\n      var key = (lodashFunc.name + ''),\r\n          names = realNames[key] || (realNames[key] = []);\r\n\r\n      names.push({ 'name': methodName, 'func': lodashFunc });\r\n    }\r\n  });\r\n\r\n  realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{\r\n    'name': 'wrapper',\r\n    'func': undefined\r\n  }];\r\n\r\n  // Add methods to `LazyWrapper`.\r\n  LazyWrapper.prototype.clone = lazyClone;\r\n  LazyWrapper.prototype.reverse = lazyReverse;\r\n  LazyWrapper.prototype.value = lazyValue;\r\n\r\n  // Add lazy aliases.\r\n  lodash.prototype.first = lodash.prototype.head;\r\n\r\n  if (symIterator) {\r\n    lodash.prototype[symIterator] = wrapperToIterator;\r\n  }\r\n\r\n  /*--------------------------------------------------------------------------*/\r\n\r\n  // Some AMD build optimizers, like r.js, check for condition patterns like:\r\n  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {\r\n    // Expose Lodash on the global object to prevent errors when Lodash is\r\n    // loaded by a script tag in the presence of an AMD loader.\r\n    // See http://requirejs.org/docs/errors.html#mismatch for more details.\r\n    // Use `_.noConflict` to remove Lodash from the global object.\r\n    root._ = lodash;\r\n\r\n    // Define as an anonymous module so, through path mapping, it can be\r\n    // referenced as the \"underscore\" module.\r\n    define(function() {\r\n      return lodash;\r\n    });\r\n  }\r\n  // Check for `exports` after `define` in case a build optimizer adds it.\r\n  else if (freeModule) {\r\n    // Export for Node.js.\r\n    (freeModule.exports = lodash)._ = lodash;\r\n    // Export for CommonJS support.\r\n    freeExports._ = lodash;\r\n  }\r\n  else {\r\n    // Export to the global object.\r\n    root._ = lodash;\r\n  }\r\n}.call(this));\r\n"

/***/ }),

/***/ 95:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/**
 * 基本函数
 * Create By GUY 2014\11\17
 *
 */
_global = undefined;
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

!(function (undefined) {
    var traverse = function (func, context) {
        return function (value, key, obj) {
            return func.call(context, key, value, obj);
        };
    };
    var _apply = function (name) {
        return function () {
            return _[name].apply(_, arguments);
        };
    };
    var _applyFunc = function (name) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args[1] = _.isFunction(args[1]) ? traverse(args[1], args[2]) : args[1];
            return _[name].apply(_, args);
        };
    };

    // Utility
    _.extend(BI, {
        assert: function (v, is) {
            if (this.isFunction(is)) {
                if (!is(v)) {
                    throw new Error(v + " error");
                } else {
                    return true;
                }
            }
            if (!this.isArray(is)) {
                is = [is];
            }
            if (!this.deepContains(is, v)) {
                throw new Error(v + " error");
            }
            return true;
        },

        warn: function (message) {
            console.warn(message);
        },

        UUID: function () {
            var f = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            var str = "";
            for (var i = 0; i < 16; i++) {
                var r = parseInt(f.length * Math.random(), 10);
                str += f[r];
            }
            return str;
        },

        isWidget: function (widget) {
            return widget instanceof BI.Widget;
        },

        createWidgets: function (items, options, context) {
            if (!BI.isArray(items)) {
                throw new Error("items必须是数组", items);
            }
            if (BI.isWidget(options)) {
                context = options;
                options = {};
            } else {
                options || (options = {});
            }
            return BI.map(BI.flatten(items), function (i, item) {
                return BI.createWidget(item, BI.deepClone(options), context);
            });
        },

        createItems: function (data, innerAttr, outerAttr) {
            innerAttr = BI.isArray(innerAttr) ? innerAttr : BI.makeArray(BI.flatten(data).length, innerAttr || {});
            outerAttr = BI.isArray(outerAttr) ? outerAttr : BI.makeArray(BI.flatten(data).length, outerAttr || {});
            return BI.map(data, function (i, item) {
                if (BI.isArray(item)) {
                    return BI.createItems(item, innerAttr, outerAttr);
                }
                if (item instanceof BI.Widget) {
                    return BI.extend({}, innerAttr.shift(), outerAttr.shift(), {
                        type: null,
                        el: item
                    });
                }
                if (innerAttr[0] instanceof BI.Widget) {
                    outerAttr.shift();
                    return BI.extend({}, item, {
                        el: innerAttr.shift()
                    });
                }
                if (item.el instanceof BI.Widget) {
                    innerAttr.shift();
                    return BI.extend({}, outerAttr.shift(), { type: null }, item);
                }
                if (item.el) {
                    return BI.extend({}, outerAttr.shift(), item, {
                        el: BI.extend({}, innerAttr.shift(), item.el)
                    });
                }
                return BI.extend({}, outerAttr.shift(), {
                    el: BI.extend({}, innerAttr.shift(), item)
                });
            });
        },

        // 用容器包装items
        packageItems: function (items, layouts) {
            for (var i = layouts.length - 1; i >= 0; i--) {
                items = BI.map(items, function (k, it) {
                    return BI.extend({}, layouts[i], {
                        items: [
                            BI.extend({}, layouts[i].el, {
                                el: it
                            })
                        ]
                    });
                });
            }
            return items;
        },

        formatEL: function (obj) {
            if (obj && !obj.type && obj.el) {
                return obj;
            }
            return {
                el: obj
            };
        },

        // 剥开EL
        stripEL: function (obj) {
            return obj.type && obj || obj.el || obj;
        },

        trans2Element: function (widgets) {
            return BI.map(widgets, function (i, wi) {
                return wi.element;
            });
        }
    });

    // 集合相关方法
    _.each(["where", "findWhere", "invoke", "pluck", "shuffle", "sample", "toArray", "size"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["get", "set", "each", "map", "reduce", "reduceRight", "find", "filter", "reject", "every", "all", "some", "any", "max", "min",
        "sortBy", "groupBy", "indexBy", "countBy", "partition", "clamp"], function (name) {
        if (name === "any") {
            BI[name] = _applyFunc("some");
        } else {
            BI[name] = _applyFunc(name);
        }
    });
    _.extend(BI, {
        // 数数
        count: function (from, to, predicate) {
            var t;
            if (predicate) {
                for (t = from; t < to; t++) {
                    predicate(t);
                }
            }
            return to - from;
        },

        // 倒数
        inverse: function (from, to, predicate) {
            return BI.count(to, from, predicate);
        },

        firstKey: function (obj) {
            var res = undefined;
            BI.any(obj, function (key, value) {
                res = key;
                return true;
            });
            return res;
        },

        lastKey: function (obj) {
            var res = undefined;
            BI.each(obj, function (key, value) {
                res = key;
                return true;
            });
            return res;
        },

        firstObject: function (obj) {
            var res = undefined;
            BI.any(obj, function (key, value) {
                res = value;
                return true;
            });
            return res;
        },

        lastObject: function (obj) {
            var res = undefined;
            BI.each(obj, function (key, value) {
                res = value;
                return true;
            });
            return res;
        },

        concat: function (obj1, obj2) {
            if (BI.isKey(obj1)) {
                return BI.map([].slice.apply(arguments), function (idx, v) {
                    return v;
                }).join("");
            }
            if (BI.isArray(obj1)) {
                return _.concat.apply([], arguments);
            }
            if (BI.isObject(obj1)) {
                return _.extend.apply({}, arguments);
            }
        },

        backEach: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                predicate(index, obj[index], obj);
            }
            return false;
        },

        backAny: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                if (predicate(index, obj[index], obj)) {
                    return true;
                }
            }
            return false;
        },

        backEvery: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                if (!predicate(index, obj[index], obj)) {
                    return false;
                }
            }
            return true;
        },

        backFindKey: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            var keys = _.keys(obj), key;
            for (var i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
                if (predicate(obj[key], key, obj)) {
                    return key;
                }
            }
        },

        backFind: function (obj, predicate, context) {
            var key;
            if (BI.isArray(obj)) {
                key = BI.findLastIndex(obj, predicate, context);
            } else {
                key = BI.backFindKey(obj, predicate, context);
            }
            if (key !== void 0 && key !== -1) {
                return obj[key];
            }
        },

        remove: function (obj, target, context) {
            var isFunction = BI.isFunction(target);
            target = isFunction || BI.isArray(target) ? target : [target];
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if ((isFunction && target.apply(context, [i, obj[i]]) === true) || (!isFunction && BI.contains(target, obj[i]))) {
                        obj.splice(i--, 1);
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if ((isFunction && target.apply(context, [i, obj[i]]) === true) || (!isFunction && BI.contains(target, obj[i]))) {
                        delete obj[i];
                    }
                });
            }
        },

        removeAt: function (obj, index) {
            index = BI.isArray(index) ? index : [index];
            var isArray = BI.isArray(obj), i;
            for (i = 0; i < index.length; i++) {
                if (isArray) {
                    obj[index[i]] = "$deleteIndex";
                } else {
                    delete obj[index[i]];
                }
            }
            if (isArray) {
                BI.remove(obj, "$deleteIndex");
            }
        },

        string2Array: function (str) {
            return str.split("&-&");
        },

        array2String: function (array) {
            return array.join("&-&");
        },

        abc2Int: function (str) {
            var idx = 0, start = "A", str = str.toUpperCase();
            for (var i = 0, len = str.length; i < len; ++i) {
                idx = str.charAt(i).charCodeAt(0) - start.charCodeAt(0) + 26 * idx + 1;
                if (idx > (2147483646 - str.charAt(i).charCodeAt(0) + start.charCodeAt(0)) / 26) {
                    return 0;
                }
            }
            return idx;
        },

        int2Abc: function (num) {
            var DIGITS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            var idx = num, str = "";
            if (num === 0) {
                return "";
            }
            while (idx !== 0) {
                var t = idx % 26;
                if (t === 0) {
                    t = 26;
                }
                str = DIGITS[t - 1] + str;
                idx = (idx - t) / 26;
            }
            return str;
        }
    });

    // 数组相关的方法
    _.each(["first", "initial", "last", "rest", "compact", "flatten", "without", "union", "intersection",
        "difference", "zip", "unzip", "object", "indexOf", "lastIndexOf", "sortedIndex", "range", "take", "takeRight", "uniqBy"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["findIndex", "findLastIndex"], function (name) {
        BI[name] = _applyFunc(name);
    });
    _.extend(BI, {
        // 构建一个长度为length的数组
        makeArray: function (length, value) {
            var res = [];
            for (var i = 0; i < length; i++) {
                if (BI.isNull(value)) {
                    res.push(i);
                } else {
                    res.push(BI.deepClone(value));
                }
            }
            return res;
        },

        makeObject: function (array, value) {
            var map = {};
            for (var i = 0; i < array.length; i++) {
                if (BI.isNull(value)) {
                    map[array[i]] = array[i];
                } else if (BI.isFunction(value)) {
                    map[array[i]] = value(i, array[i]);
                } else {
                    map[array[i]] = BI.deepClone(value);
                }
            }
            return map;
        },

        makeArrayByArray: function (array, value) {
            var res = [];
            if (!array) {
                return res;
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (BI.isArray(array[i])) {
                    res.push(arguments.callee(array[i], value));
                } else {
                    res.push(BI.deepClone(value));
                }
            }
            return res;
        },

        uniq: function (array, isSorted, iteratee, context) {
            if (array == null) {
                return [];
            }
            if (!_.isBoolean(isSorted)) {
                context = iteratee;
                iteratee = isSorted;
                isSorted = false;
            }
            iteratee && (iteratee = traverse(iteratee, context));
            return _.uniq.call(_, array, isSorted, iteratee, context);
        }
    });

    // 对象相关方法
    _.each(["keys", "allKeys", "values", "pairs", "invert", "create", "functions", "extend", "extendOwn",
        "defaults", "clone", "property", "propertyOf", "matcher", "isEqual", "isMatch", "isEmpty",
        "isElement", "isNumber", "isString", "isArray", "isObject", "isPlainObject", "isArguments", "isFunction", "isFinite",
        "isBoolean", "isDate", "isRegExp", "isError", "isNaN", "isUndefined", "zipObject", "cloneDeep"], function (name) {
        BI[name] = _apply(name);
    });
    _.each(["mapObject", "findKey", "pick", "omit", "tap"], function (name) {
        BI[name] = _applyFunc(name);
    });
    _.extend(BI, {

        inherit: function (sp, overrides) {
            var sb = function () {
                return sp.apply(this, arguments);
            };
            var F = function () {
            }, spp = sp.prototype;
            F.prototype = spp;
            sb.prototype = new F();
            sb.superclass = spp;
            _.extend(sb.prototype, overrides, {
                superclass: sp
            });
            return sb;
        },

        init: function () {
            // 先把准备环境准备好
            while (BI.prepares && BI.prepares.length > 0) {
                BI.prepares.shift()();
            }
            while (_global.___fineuiExposedFunction && _global.___fineuiExposedFunction.length > 0) {
                _global.___fineuiExposedFunction.shift()();
            }
            BI.initialized = true;
        },

        has: function (obj, keys) {
            if (BI.isArray(keys)) {
                if (keys.length === 0) {
                    return false;
                }
                return BI.every(keys, function (i, key) {
                    return _.has(obj, key);
                });
            }
            return _.has.apply(_, arguments);
        },

        freeze: function (value) {
            // 在ES5中，如果这个方法的参数不是一个对象（一个原始值），那么它会导致 TypeError
            // 在ES2015中，非对象参数将被视为要被冻结的普通对象，并被简单地返回
            if (Object.freeze && BI.isObject(value)) {
                return Object.freeze(value);
            }
            return value;
        },

        // 数字和字符串可以作为key
        isKey: function (key) {
            return BI.isNumber(key) || (BI.isString(key) && key.length > 0);
        },

        // 忽略大小写的等于
        isCapitalEqual: function (a, b) {
            a = BI.isNull(a) ? a : ("" + a).toLowerCase();
            b = BI.isNull(b) ? b : ("" + b).toLowerCase();
            return BI.isEqual(a, b);
        },

        isWidthOrHeight: function (w) {
            if (typeof w === "number") {
                return w >= 0;
            } else if (typeof w === "string") {
                return /^\d{1,3}(\.\d)?%$/.test(w) || w === "auto" || /^\d+px$/.test(w) || /^calc/.test(w);
            }
        },

        isNotNull: function (obj) {
            return !BI.isNull(obj);
        },

        isNull: function (obj) {
            return typeof obj === "undefined" || obj === null;
        },

        isEmptyArray: function (arr) {
            return BI.isArray(arr) && BI.isEmpty(arr);
        },

        isNotEmptyArray: function (arr) {
            return BI.isArray(arr) && !BI.isEmpty(arr);
        },

        isEmptyObject: function (obj) {
            return BI.isEqual(obj, {});
        },

        isNotEmptyObject: function (obj) {
            return BI.isPlainObject(obj) && !BI.isEmptyObject(obj);
        },

        isEmptyString: function (obj) {
            return BI.isString(obj) && obj.length === 0;
        },

        isNotEmptyString: function (obj) {
            return BI.isString(obj) && !BI.isEmptyString(obj);
        },

        isWindow: function (obj) {
            return obj != null && obj == obj.window;
        }
    });

    // deep方法
    _.extend(BI, {
        deepClone: _.cloneDeep,
        deepExtend: _.merge,

        isDeepMatch: function (object, attrs) {
            var keys = BI.keys(attrs), length = keys.length;
            if (object == null) {
                return !length;
            }
            var obj = Object(object);
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (!BI.isEqual(attrs[key], obj[key]) || !(key in obj)) {
                    return false;
                }
            }
            return true;
        },

        contains: function (obj, target, fromIndex) {
            if (!_.isArrayLike(obj)) obj = _.values(obj);
            return _.indexOf(obj, target, typeof fromIndex === "number" && fromIndex) >= 0;
        },

        deepContains: function (obj, copy) {
            if (BI.isObject(copy)) {
                return BI.any(obj, function (i, v) {
                    if (BI.isEqual(v, copy)) {
                        return true;
                    }
                });
            }
            return BI.contains(obj, copy);
        },

        deepIndexOf: function (obj, target) {
            for (var i = 0; i < obj.length; i++) {
                if (BI.isEqual(target, obj[i])) {
                    return i;
                }
            }
            return -1;
        },

        deepRemove: function (obj, target) {
            var done = false;
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if (BI.isEqual(target, obj[i])) {
                        obj.splice(i--, 1);
                        done = true;
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if (BI.isEqual(target, obj[i])) {
                        delete obj[i];
                        done = true;
                    }
                });
            }
            return done;
        },

        deepWithout: function (obj, target) {
            if (BI.isArray(obj)) {
                var result = [];
                for (var i = 0; i < obj.length; i++) {
                    if (!BI.isEqual(target, obj[i])) {
                        result.push(obj[i]);
                    }
                }
                return result;
            }
            var result = {};
            BI.each(obj, function (i, v) {
                if (!BI.isEqual(target, obj[i])) {
                    result[i] = v;
                }
            });
            return result;

        },

        deepUnique: function (array) {
            var result = [];
            BI.each(array, function (i, item) {
                if (!BI.deepContains(result, item)) {
                    result.push(item);
                }
            });
            return result;
        },

        // 比较两个对象得出不一样的key值
        deepDiff: function (object, other) {
            object || (object = {});
            other || (other = {});
            var result = [];
            var used = [];
            for (var b in object) {
                if (this.has(object, b)) {
                    if (!this.isEqual(object[b], other[b])) {
                        result.push(b);
                    }
                    used.push(b);
                }
            }
            for (var b in other) {
                if (this.has(other, b) && !BI.contains(used, b)) {
                    result.push(b);
                }
            }
            return result;
        }
    });

    // 通用方法
    _.each(["uniqueId", "result", "chain", "iteratee", "escape", "unescape", "before", "after"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        };
    });

    // 事件相关方法
    _.each(["bind", "once", "partial", "debounce", "throttle", "delay", "defer", "wrap"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        };
    });

    _.extend(BI, {
        nextTick: (function () {
            var callbacks = [];
            var pending = false;
            var timerFunc = void 0;

            function nextTickHandler() {
                pending = false;
                var copies = callbacks.slice(0);
                callbacks.length = 0;
                for (var i = 0; i < copies.length; i++) {
                    copies[i]();
                }
            }

            if (typeof Promise !== "undefined") {
                var p = Promise.resolve();
                timerFunc = function timerFunc() {
                    p.then(nextTickHandler);
                };
            } else if (typeof MutationObserver !== "undefined") {
                var counter = 1;
                var observer = new MutationObserver(nextTickHandler);
                var textNode = document.createTextNode(String(counter));
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function timerFunc() {
                    counter = (counter + 1) % 2;
                    textNode.data = String(counter);
                };
            } else if (typeof setImmediate !== "undefined") {
                timerFunc = function timerFunc() {
                    setImmediate(nextTickHandler);
                };
            } else {
                // Fallback to setTimeout.
                timerFunc = function timerFunc() {
                    setTimeout(nextTickHandler, 0);
                };
            }

            return function queueNextTick(cb) {
                var _resolve = void 0;
                var args = [].slice.call(arguments, 1);
                callbacks.push(function () {
                    if (cb) {
                        try {
                            cb.apply(null, args);
                        } catch (e) {
                            console.error(e);
                        }
                    } else if (_resolve) {
                        _resolve.apply(null, args);
                    }
                });
                if (!pending) {
                    pending = true;
                    timerFunc();
                }
                // $flow-disable-line
                if (!cb && typeof Promise !== 'undefined') {
                    return new Promise(function (resolve, reject) {
                        _resolve = resolve;
                    });
                }
            };
        })()
    });

    // 数字相关方法
    _.each(["random"], function (name) {
        BI[name] = _apply(name);
    });
    _.extend(BI, {
        getTime: function () {
            if (_global.performance && _global.performance.now) {
                return _global.performance.now();
            }
            if (_global.performance && _global.performance.webkitNow) {
                return _global.performance.webkitNow();
            }
            if (Date.now) {
                return Date.now();
            }
            return BI.getDate().getTime();


        },

        parseInt: function (number) {
            var radix = 10;
            if (/^0x/g.test(number)) {
                radix = 16;
            }
            try {
                return parseInt(number, radix);
            } catch (e) {
                throw new Error(number + "parse int error");
                return NaN;
            }
        },

        parseSafeInt: function (value) {
            var MAX_SAFE_INTEGER = 9007199254740991;
            return value
                ? this.clamp(this.parseInt(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
                : (value === 0 ? value : 0);
        },

        parseFloat: function (number) {
            try {
                return parseFloat(number);
            } catch (e) {
                throw new Error(number + "parse float error");
                return NaN;
            }
        },

        isNaturalNumber: function (number) {
            if (/^\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isPositiveInteger: function (number) {
            if (/^\+?[1-9][0-9]*$/.test(number)) {
                return true;
            }
            return false;
        },

        isNegativeInteger: function (number) {
            if (/^\-[1-9][0-9]*$/.test(number)) {
                return true;
            }
            return false;
        },

        isInteger: function (number) {
            if (/^\-?\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isNumeric: function (number) {
            return !isNaN(parseFloat(number)) && isFinite(number);
        },

        isFloat: function (number) {
            if (/^([+-]?)\d*\.\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isOdd: function (number) {
            if (!BI.isInteger(number)) {
                return false;
            }
            return (number & 1) === 1;
        },

        isEven: function (number) {
            if (!BI.isInteger(number)) {
                return false;
            }
            return (number & 1) === 0;
        },

        sum: function (array, iteratee, context) {
            var sum = 0;
            BI.each(array, function (i, item) {
                if (iteratee) {
                    sum += Number(iteratee.apply(context, [i, item]));
                } else {
                    sum += Number(item);
                }
            });
            return sum;
        },

        average: function (array, iteratee, context) {
            var sum = BI.sum(array, iteratee, context);
            return sum / array.length;
        }
    });

    // 字符串相关方法
    _.extend(BI, {
        trim: function () {
            return _.trim.apply(_, arguments);
        },

        toUpperCase: function (string) {
            return (string + "").toLocaleUpperCase();
        },

        toLowerCase: function (string) {
            return (string + "").toLocaleLowerCase();
        },

        isEndWithBlank: function (string) {
            return /(\s|\u00A0)$/.test(string);
        },

        isLiteral: function (exp) {
            var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;
            return literalValueRE.test(exp);
        },

        stripQuotes: function (str) {
            var a = str.charCodeAt(0);
            var b = str.charCodeAt(str.length - 1);
            return a === b && (a === 0x22 || a === 0x27)
                ? str.slice(1, -1)
                : str;
        },

        // background-color => backgroundColor
        camelize: function (str) {
            return str.replace(/-(.)/g, function (_, character) {
                return character.toUpperCase();
            });
        },

        // backgroundColor => background-color
        hyphenate: function (str) {
            return str.replace(/([A-Z])/g, "-$1").toLowerCase();
        },

        isNotEmptyString: function (str) {
            return BI.isString(str) && !BI.isEmpty(str);
        },

        isEmptyString: function (str) {
            return BI.isString(str) && BI.isEmpty(str);
        },

        /**
         * 通用加密方法
         */
        encrypt: function (type, text, key) {
            switch (type) {
                case BI.CRYPT_TYPE.AES:
                default:
                    return BI.aesEncrypt(text, key);
            }
        },

        /**
         * 通用解密方法
         * @param type 解密方式
         * @param text 文本
         * @param key 种子
         * @return {*}
         */
        decrypt: function (type, text, key) {
            switch (type) {
                case BI.CRYPT_TYPE.AES:
                default:
                    return BI.aesDecrypt(text, key);
            }
        },

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
         *      var s = BI.leftPad('123', 5, '0');//s的值为：'00123'
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
         *      var res = BI.format('<div class="{0}">{1}</div>', cls, text);
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

    // 日期相关方法
    _.extend(BI, {
        /**
         * 是否是闰年
         * @param year
         * @returns {boolean}
         */
        isLeapYear: function (year) {
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },

        /**
         * 检测是否在有效期
         *
         * @param YY 年
         * @param MM 月
         * @param DD 日
         * @param minDate '1900-01-01'
         * @param maxDate '2099-12-31'
         * @returns {Array} 若无效返回无效状态
         */
        checkDateVoid: function (YY, MM, DD, minDate, maxDate) {
            var back = [];
            YY = YY | 0;
            MM = MM | 0;
            DD = DD | 0;
            minDate = BI.isString(minDate) ? minDate.match(/\d+/g) : minDate;
            maxDate = BI.isString(maxDate) ? maxDate.match(/\d+/g) : maxDate;
            if (YY < minDate[0]) {
                back = ["y"];
            } else if (YY > maxDate[0]) {
                back = ["y", 1];
            } else if (YY >= minDate[0] && YY <= maxDate[0]) {
                if (YY == minDate[0]) {
                    if (MM < minDate[1]) {
                        back = ["m"];
                    } else if (MM == minDate[1]) {
                        if (DD < minDate[2]) {
                            back = ["d"];
                        }
                    }
                }
                if (YY == maxDate[0]) {
                    if (MM > maxDate[1]) {
                        back = ["m", 1];
                    } else if (MM == maxDate[1]) {
                        if (DD > maxDate[2]) {
                            back = ["d", 1];
                        }
                    }
                }
            }
            return back;
        },

        checkDateLegal: function (str) {
            var ar = str.match(/\d+/g);
            var YY = ar[0] | 0, MM = ar[1] | 0, DD = ar[2] | 0;
            if (ar.length <= 1) {
                return true;
            }
            if (ar.length <= 2) {
                return MM >= 1 && MM <= 12;
            }
            var MD = BI.Date._MD.slice(0);
            MD[1] = BI.isLeapYear(YY) ? 29 : 28;
            return MM >= 1 && MM <= 12 && DD <= MD[MM - 1];
        },

        parseDateTime: function (str, fmt) {
            var today = BI.getDate();
            var y = 0;
            var m = 0;
            var d = 1;
            // wei : 对于fmt为‘YYYYMM’或者‘YYYYMMdd’的格式，str的值为类似'201111'的形式，因为年月之间没有分隔符，所以正则表达式分割无效，导致bug7376。
            var a = str.split(/\W+/);
            if (fmt.toLowerCase() == "%y%x" || fmt.toLowerCase() == "%y%x%d") {
                var yearlength = 4;
                var otherlength = 2;
                a[0] = str.substring(0, yearlength);
                a[1] = str.substring(yearlength, yearlength + otherlength);
                a[2] = str.substring(yearlength + otherlength, yearlength + otherlength * 2);
            }
            var b = fmt.match(/%./g);
            var i = 0, j = 0;
            var hr = 0;
            var min = 0;
            var sec = 0;
            for (i = 0; i < a.length; ++i) {
                switch (b[i]) {
                    case "%d":
                    case "%e":
                        d = parseInt(a[i], 10);
                        break;

                    case "%X":
                        m = parseInt(a[i], 10) - 1;
                        break;
                    case "%x":
                        m = parseInt(a[i], 10) - 1;
                        break;

                    case "%Y":
                    case "%y":
                        y = parseInt(a[i], 10);
                        (y < 100) && (y += (y > 29) ? 1900 : 2000);
                        break;

                    case "%b":
                    case "%B":
                        for (j = 0; j < 12; ++j) {
                            if (BI.Date._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) {
                                m = j;
                                break;
                            }
                        }
                        break;

                    case "%H":
                    case "%I":
                    case "%k":
                    case "%l":
                        hr = parseInt(a[i], 10);
                        break;

                    case "%P":
                    case "%p":
                        if (/pm/i.test(a[i]) && hr < 12) {
                            hr += 12;
                        } else if (/am/i.test(a[i]) && hr >= 12) {
                            hr -= 12;
                        }
                        break;
                    case "%Q":
                    case "%q":
                        m = (parseInt(a[i], 10) - 1) * 3;
                        break;
                    case "%M":
                        min = parseInt(a[i], 10);
                        break;
                    case "%S":
                        sec = parseInt(a[i], 10);
                        break;
                }
            }
            //    if (!a[i]) {
            //        continue;
            //	}
            if (isNaN(y)) {
                y = today.getFullYear();
            }
            if (isNaN(m)) {
                m = today.getMonth();
            }
            if (isNaN(d)) {
                d = today.getDate();
            }
            if (isNaN(hr)) {
                hr = today.getHours();
            }
            if (isNaN(min)) {
                min = today.getMinutes();
            }
            if (isNaN(sec)) {
                sec = today.getSeconds();
            }
            if (y != 0) {
                return BI.getDate(y, m, d, hr, min, sec);
            }
            y = 0;
            m = -1;
            d = 0;
            for (i = 0; i < a.length; ++i) {
                if (a[i].search(/[a-zA-Z]+/) != -1) {
                    var t = -1;
                    for (j = 0; j < 12; ++j) {
                        if (BI.Date._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) {
                            t = j;
                            break;
                        }
                    }
                    if (t != -1) {
                        if (m != -1) {
                            d = m + 1;
                        }
                        m = t;
                    }
                } else if (parseInt(a[i], 10) <= 12 && m == -1) {
                    m = a[i] - 1;
                } else if (parseInt(a[i], 10) > 31 && y == 0) {
                    y = parseInt(a[i], 10);
                    (y < 100) && (y += (y > 29) ? 1900 : 2000);
                } else if (d == 0) {
                    d = a[i];
                }
            }
            if (y == 0) {
                y = today.getFullYear();
            }
            if (m === -1) {
                m = today.getMonth();
            }
            if (m != -1 && d != 0) {
                return BI.getDate(y, m, d, hr, min, sec);
            }
            return today;
        },

        getDate: function () {
            var length = arguments.length;
            var args = arguments;
            var dt;
            switch (length) {
                // new Date()
                case 0:
                    dt = new Date();
                    break;
                // new Date(long)
                case 1:
                    dt = new Date(args[0]);
                    break;
                // new Date(year, month)
                case 2:
                    dt = new Date(args[0], args[1]);
                    break;
                // new Date(year, month, day)
                case 3:
                    dt = new Date(args[0], args[1], args[2]);
                    break;
                // new Date(year, month, day, hour)
                case 4:
                    dt = new Date(args[0], args[1], args[2], args[3]);
                    break;
                // new Date(year, month, day, hour, minute)
                case 5:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4]);
                    break;
                // new Date(year, month, day, hour, minute, second)
                case 6:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4], args[5]);
                    break;
                // new Date(year, month, day, hour, minute, second, millisecond)
                case 7:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                    break;
                default:
                    dt = new Date();
                    break;
            }
            if (BI.isNotNull(BI.timeZone) && (arguments.length === 0 || (arguments.length === 1 && BI.isNumber(arguments[0])))) {
                var localTime = dt.getTime();
                // BI-33791 1901年以前的东8区标准是GMT+0805, 统一无论是什么时间，都以整的0800这样的为基准
                var localOffset = dt.getTimezoneOffset() * 60000; // 获得当地时间偏移的毫秒数
                var utc = localTime + localOffset; // utc即GMT时间标准时区
                return new Date(utc + BI.timeZone);// + Pool.timeZone.offset);
            }
            return dt;

        },

        getTime: function () {
            var length = arguments.length;
            var args = arguments;
            var dt;
            switch (length) {
                // new Date()
                case 0:
                    dt = new Date();
                    break;
                // new Date(long)
                case 1:
                    dt = new Date(args[0]);
                    break;
                // new Date(year, month)
                case 2:
                    dt = new Date(args[0], args[1]);
                    break;
                // new Date(year, month, day)
                case 3:
                    dt = new Date(args[0], args[1], args[2]);
                    break;
                // new Date(year, month, day, hour)
                case 4:
                    dt = new Date(args[0], args[1], args[2], args[3]);
                    break;
                // new Date(year, month, day, hour, minute)
                case 5:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4]);
                    break;
                // new Date(year, month, day, hour, minute, second)
                case 6:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4], args[5]);
                    break;
                // new Date(year, month, day, hour, minute, second, millisecond)
                case 7:
                    dt = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                    break;
                default:
                    dt = new Date();
                    break;
            }
            if (BI.isNotNull(BI.timeZone)) {
                // BI-33791 1901年以前的东8区标准是GMT+0805, 统一无论是什么时间，都以整的0800这样的为基准
                return dt.getTime() - BI.timeZone - new Date().getTimezoneOffset() * 60000;
            }
            return dt.getTime();

        }
    });
})();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(14), __webpack_require__(61).setImmediate))

/***/ }),

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
  "use strict";

  if (global.setImmediate) {
    return;
  }

  var nextHandle = 1; // Spec says greater than zero

  var tasksByHandle = {};
  var currentlyRunningATask = false;
  var doc = global.document;
  var registerImmediate;

  function setImmediate(callback) {
    // Callback can either be a function or a string
    if (typeof callback !== "function") {
      callback = new Function("" + callback);
    } // Copy function arguments


    var args = new Array(arguments.length - 1);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    } // Store and register the task


    var task = {
      callback: callback,
      args: args
    };
    tasksByHandle[nextHandle] = task;
    registerImmediate(nextHandle);
    return nextHandle++;
  }

  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }

  function run(task) {
    var callback = task.callback;
    var args = task.args;

    switch (args.length) {
      case 0:
        callback();
        break;

      case 1:
        callback(args[0]);
        break;

      case 2:
        callback(args[0], args[1]);
        break;

      case 3:
        callback(args[0], args[1], args[2]);
        break;

      default:
        callback.apply(undefined, args);
        break;
    }
  }

  function runIfPresent(handle) {
    // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
    // So if we're currently running a task, we'll need to delay this invocation.
    if (currentlyRunningATask) {
      // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
      // "too much recursion" error.
      setTimeout(runIfPresent, 0, handle);
    } else {
      var task = tasksByHandle[handle];

      if (task) {
        currentlyRunningATask = true;

        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }

  function installNextTickImplementation() {
    registerImmediate = function registerImmediate(handle) {
      process.nextTick(function () {
        runIfPresent(handle);
      });
    };
  }

  function canUsePostMessage() {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can't be used for this purpose.
    if (global.postMessage && !global.importScripts) {
      var postMessageIsAsynchronous = true;
      var oldOnMessage = global.onmessage;

      global.onmessage = function () {
        postMessageIsAsynchronous = false;
      };

      global.postMessage("", "*");
      global.onmessage = oldOnMessage;
      return postMessageIsAsynchronous;
    }
  }

  function installPostMessageImplementation() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
    var messagePrefix = "setImmediate$" + Math.random() + "$";

    var onGlobalMessage = function onGlobalMessage(event) {
      if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    if (global.addEventListener) {
      global.addEventListener("message", onGlobalMessage, false);
    } else {
      global.attachEvent("onmessage", onGlobalMessage);
    }

    registerImmediate = function registerImmediate(handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }

  function installMessageChannelImplementation() {
    var channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      var handle = event.data;
      runIfPresent(handle);
    };

    registerImmediate = function registerImmediate(handle) {
      channel.port2.postMessage(handle);
    };
  }

  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;

    registerImmediate = function registerImmediate(handle) {
      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var script = doc.createElement("script");

      script.onreadystatechange = function () {
        runIfPresent(handle);
        script.onreadystatechange = null;
        html.removeChild(script);
        script = null;
      };

      html.appendChild(script);
    };
  }

  function installSetTimeoutImplementation() {
    registerImmediate = function registerImmediate(handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  } // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.


  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  attachTo = attachTo && attachTo.setTimeout ? attachTo : global; // Don't get fooled by e.g. browserify environments.

  if ({}.toString.call(global.process) === "[object process]") {
    // For Node.js before 0.9
    installNextTickImplementation();
  } else if (canUsePostMessage()) {
    // For non-IE10 modern browsers
    installPostMessageImplementation();
  } else if (global.MessageChannel) {
    // For web workers, where supported
    installMessageChannelImplementation();
  } else if (doc && "onreadystatechange" in doc.createElement("script")) {
    // For IE 6–8
    installReadyStateChangeImplementation();
  } else {
    // For older browsers
    installSetTimeoutImplementation();
  }

  attachTo.setImmediate = setImmediate;
  attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? void 0 : global : self);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(14), __webpack_require__(75)))

/***/ }),

/***/ 97:
/***/ (function(module, exports) {

!(function () {
    function extend () {
        var target = arguments[0] || {}, length = arguments.length, i = 1, options, name, src, copy;
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }

    /**
     * 客户端观察者，主要处理事件的添加、删除、执行等
     * @class BI.OB
     * @abstract
     */
    var OB = function (config) {
        this._constructor(config);
    };
    _.extend(OB.prototype, {
        props: {},
        init: null,
        destroyed: null,

        _constructor: function (config) {
            this._initProps(config);
            this._init();
            this._initRef();
        },

        _defaultConfig: function (config) {
            return {};
        },

        _initProps: function (config) {
            var props = this.props;
            if (BI.isFunction(this.props)) {
                props = this.props(config);
            }
            this.options = extend(this._defaultConfig(config), props, config);
        },

        _init: function () {
            this._initListeners();
            this.init && this.init();
        },

        _initListeners: function () {
            var self = this;
            if (this.options.listeners != null) {
                _.each(this.options.listeners, function (lis) {
                    (lis.target ? lis.target : self)[lis.once ? "once" : "on"]
                    (lis.eventName, _.bind(lis.action, self));
                });
                delete this.options.listeners;
            }
        },

        // 获得一个当前对象的引用
        _initRef: function () {
            if (this.options.__ref) {
                this.options.__ref.call(this, this);
            }
            if (this.options.ref) {
                this.options.ref.call(this, this);
            }
        },

        //释放当前对象
        _purgeRef: function () {
            if (this.options.__ref) {
                this.options.__ref.call(null);
                this.options.__ref = null;
            }
            if (this.options.ref) {
                this.options.ref.call(null);
                this.options.ref = null;
            }
        },

        _getEvents: function () {
            if (!_.isObject(this.events)) {
                this.events = {};
            }
            return this.events;
        },

        /**
         * 给观察者绑定一个事件
         * @param {String} eventName 事件的名字
         * @param {Function} fn 事件对应的执行函数
         */
        on: function (eventName, fn) {
            var self = this;
            eventName = eventName.toLowerCase();
            var fns = this._getEvents()[eventName];
            if (!_.isArray(fns)) {
                fns = [];
                this._getEvents()[eventName] = fns;
            }
            fns.push(fn);

            return function () {
                self.un(eventName, fn);
            };
        },

        /**
         * 给观察者绑定一个只执行一次的事件
         * @param {String} eventName 事件的名字
         * @param {Function} fn 事件对应的执行函数
         */
        once: function (eventName, fn) {
            var proxy = function () {
                fn.apply(this, arguments);
                this.un(eventName, proxy);
            };
            this.on(eventName, proxy);
        },
        /**
         * 解除观察者绑定的指定事件
         * @param {String} eventName 要解除绑定事件的名字
         * @param {Function} fn 事件对应的执行函数，该参数是可选的，没有该参数时，将解除绑定所有同名字的事件
         */
        un: function (eventName, fn) {
            eventName = eventName.toLowerCase();

            /* alex:如果fn是null,就是把eventName上面所有方法都un掉*/
            if (fn == null) {
                delete this._getEvents()[eventName];
            } else {
                var fns = this._getEvents()[eventName];
                if (_.isArray(fns)) {
                    var newFns = [];
                    _.each(fns, function (ifn) {
                        if (ifn != fn) {
                            newFns.push(ifn);
                        }
                    });
                    this._getEvents()[eventName] = newFns;
                }
            }
        },
        /**
         * 清除观察者的所有事件绑定
         */
        purgeListeners: function () {
            /* alex:清空events*/
            this.events = {};
        },
        /**
         * 触发绑定过的事件
         *
         * @param {String} eventName 要触发的事件的名字
         * @returns {Boolean} 如果事件函数返回false，则返回false并中断其他同名事件的执行，否则执行所有的同名事件并返回true
         */
        fireEvent: function () {
            var eventName = arguments[0].toLowerCase();
            var fns = this._getEvents()[eventName];
            if (BI.isArray(fns)) {
                if (BI.isArguments(arguments[1])) {
                    for (var i = 0; i < fns.length; i++) {
                        if (fns[i].apply(this, arguments[1]) === false) {
                            return false;
                        }
                    }
                } else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    for (var i = 0; i < fns.length; i++) {
                        if (fns[i].apply(this, args) === false) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },

        destroy: function () {
            this.destroyed && this.destroyed();
            this._purgeRef();
            this.purgeListeners();
        }
    });
    BI.OB = BI.OB || OB;
})();


/***/ }),

/***/ 98:
/***/ (function(module, exports) {

(function () {
    var moduleInjection = {}, moduleInjectionMap = {
        components: {},
        constants: {},
        stores: {},
        services: {},
        models: {},
        providers: {}
    };
    BI.module = BI.module || function (xtype, cls) {
        if (moduleInjection[xtype] != null) {
            _global.console && console.error("module： [" + xtype + "] 已经注册过了");
        }
        if (BI.isFunction(cls)) {
            cls = cls();
        }
        for (var k in moduleInjectionMap) {
            if (cls[k]) {
                for (var key in cls[k]) {
                    if (!moduleInjectionMap[k]) {
                        continue;
                    }
                    if (!moduleInjectionMap[k][key]) {
                        moduleInjectionMap[k][key] = [];
                    }
                    moduleInjectionMap[k][key].push({
                        version: cls[k][key],
                        moduleId: xtype
                    });
                }
            }
        }
        moduleInjection[xtype] = cls;
    };

    var constantInjection = {};
    BI.constant = BI.constant || function (xtype, cls) {
        if (constantInjection[xtype] != null) {
            _global.console && console.error("constant: [" + xtype + "]已经注册过了");
        }
        constantInjection[xtype] = cls;
    };

    var modelInjection = {};
    BI.model = BI.model || function (xtype, cls) {
        if (modelInjection[xtype] != null) {
            _global.console && console.error("model: [" + xtype + "] 已经注册过了");
        }
        modelInjection[xtype] = cls;
    };

    var storeInjection = {};
    BI.store = BI.store || function (xtype, cls) {
        if (storeInjection[xtype] != null) {
            _global.console && console.error("store: [" + xtype + "] 已经注册过了");
        }
        storeInjection[xtype] = cls;
    };

    var serviceInjection = {};
    BI.service = BI.service || function (xtype, cls) {
        if (serviceInjection[xtype] != null) {
            _global.console && console.error("service: [" + xtype + "] 已经注册过了");
        }
        serviceInjection[xtype] = cls;
    };

    var providerInjection = {};
    BI.provider = BI.provider || function (xtype, cls) {
        if (providerInjection[xtype] != null) {
            _global.console && console.error("provider: [" + xtype + "] 已经注册过了");
        }
        providerInjection[xtype] = cls;
    };

    var configFunctions = {};
    BI.config = BI.config || function (type, configFn, opt) {
        opt = opt || {};
        // 初始化过或者系统配置需要立刻执行
        if (BI.initialized || "bi.provider.system" === type) {
            if (constantInjection[type]) {
                return (constantInjection[type] = configFn(constantInjection[type]));
            }
            if (providerInjection[type]) {
                if (!providers[type]) {
                    providers[type] = new providerInjection[type]();
                }
                // 如果config被重新配置的话，需要删除掉之前的实例
                if (providerInstance[type]) {
                    delete providerInstance[type];
                }
                return configFn(providers[type]);
            }
            return BI.Plugin.configWidget(type, configFn, opt);
        }
        if (!configFunctions[type]) {
            configFunctions[type] = [];
            BI.prepares.push(function () {
                var queue = configFunctions[type];
                var dependencies = BI.Providers.getProvider("bi.provider.system").getDependencies();
                var modules = moduleInjectionMap.components[type]
                    || moduleInjectionMap.constants[type]
                    || moduleInjectionMap.services[type]
                    || moduleInjectionMap.stores[type]
                    || moduleInjectionMap.models[type]
                    || moduleInjectionMap.providers[type];
                for (var i = 0; i < queue.length; i++) {
                    var conf = queue[i];
                    var version = conf.opt.version;
                    var fn = conf.fn;
                    if (modules && version) {
                        var findVersion = false;
                        for (var j = 0; j < modules.length; j++) {
                            var module = modules[i];
                            if (module && dependencies[module.moduleId] && module.version === version) {
                                var minVersion = dependencies[module.moduleId].minVersion,
                                    maxVersion = dependencies[module.moduleId].maxVersion;
                                if (minVersion && (moduleInjection[module.moduleId].version || version) < minVersion) {
                                    findVersion = true;
                                    break;
                                }
                                if (maxVersion && (moduleInjection[module.moduleId].version || version) > maxVersion) {
                                    findVersion = true;
                                    break;
                                }
                            }
                        }
                        if (findVersion === true) {
                            _global.console && console.error("moduleId: [" + module.moduleId + "] 接口: [" + type + "] 接口版本: [" + version + "] 已过期，版本要求为：", dependencies[module.moduleId], "=>", moduleInjection[module.moduleId]);
                            continue;
                        }
                    }
                    if (constantInjection[type]) {
                        constantInjection[type] = fn(constantInjection[type]);
                        continue;
                    }
                    if (providerInjection[type]) {
                        if (!providers[type]) {
                            providers[type] = new providerInjection[type]();
                        }
                        if (providerInstance[type]) {
                            delete providerInstance[type];
                        }
                        fn(providers[type]);
                        continue;
                    }
                    BI.Plugin.configWidget(type, fn);
                }
                configFunctions[type] = null;
            });
        }
        configFunctions[type].push({
            fn: configFn,
            opt: opt
        });
    };

    BI.getReference = BI.getReference || function (type, fn) {
        return BI.Plugin.registerObject(type, fn);
    };

    var actions = {};
    var globalAction = [];
    BI.action = BI.action || function (type, actionFn) {
        if (BI.isFunction(type)) {
            globalAction.push(type);
            return function () {
                BI.remove(globalAction, function (idx) {
                    return globalAction.indexOf(actionFn) === idx;
                });
            };
        }
        if (!actions[type]) {
            actions[type] = [];
        }
        actions[type].push(actionFn);
        return function () {
            BI.remove(actions[type], function (idx) {
                return actions[type].indexOf(actionFn) === idx;
            });
            if (actions[type].length === 0) {
                delete actions[type];
            }
        };
    };

    var points = {};
    BI.point = BI.point || function (type, action, pointFn, after) {
        if (!points[type]) {
            points[type] = {};
        }
        if (!points[type][action]) {
            points[type][action] = {};
        }
        if (!points[type][action][after ? "after" : "before"]) {
            points[type][action][after ? "after" : "before"] = [];
        }
        points[type][action][after ? "after" : "before"].push(pointFn);
    };

    BI.Modules = BI.Modules || {
        getModule: function (type) {
            if (!moduleInjection[type]) {
                _global.console && console.error("module: [" + type + "] 未定义");
            }
            return moduleInjection[type];
        },
        getAllModules: function () {
            return moduleInjection;
        }
    };

    BI.Constants = BI.Constants || {
        getConstant: function (type) {
            if (BI.isNull(constantInjection[type])) {
                _global.console && console.error("constant: [" + type + "] 未定义");
            }
            return constantInjection[type];
        }
    };

    var callPoint = function (inst, types) {
        types = BI.isArray(types) ? types : [types];
        BI.each(types, function (idx, type) {
            if (points[type]) {
                for (var action in points[type]) {
                    var bfns = points[type][action].before;
                    if (bfns) {
                        BI.aspect.before(inst, action, function (bfns) {
                            return function () {
                                for (var i = 0, len = bfns.length; i < len; i++) {
                                    try {
                                        bfns[i].apply(inst, arguments);
                                    } catch (e) {
                                        _global.console && console.error(e);
                                    }
                                }
                            };
                        }(bfns));
                    }
                    var afns = points[type][action].after;
                    if (afns) {
                        BI.aspect.after(inst, action, function (afns) {
                            return function () {
                                for (var i = 0, len = afns.length; i < len; i++) {
                                    try {
                                        afns[i].apply(inst, arguments);
                                    } catch (e) {
                                        _global.console && console.error(e);
                                    }
                                }
                            };
                        }(afns));
                    }
                }
            }
        });
    };

    BI.Models = BI.Models || {
        getModel: function (type, config) {
            if (!modelInjection[type]) {
                _global.console && console.error("model: [" + type + "] 未定义");
            }
            var inst = new modelInjection[type](config);
            inst._constructor && inst._constructor(config);
            inst.mixins && callPoint(inst, inst.mixins);
            callPoint(inst, type);
            return inst;
        }
    };

    var stores = {};

    BI.Stores = BI.Stores || {
        getStore: function (type, config) {
            if (!storeInjection[type]) {
                _global.console && console.error("store: [" + type + "] 未定义");
            }
            if (stores[type]) {
                return stores[type];
            }
            var inst = stores[type] = new storeInjection[type](config);
            inst._constructor && inst._constructor(config, function () {
                delete stores[type];
            });
            callPoint(inst, type);
            return inst;
        }
    };

    var services = {};

    BI.Services = BI.Services || {
        getService: function (type, config) {
            if (!serviceInjection[type]) {
                _global.console && console.error("service: [" + type + "] 未定义");
            }
            if (services[type]) {
                return services[type];
            }
            services[type] = new serviceInjection[type](config);
            callPoint(services[type], type);
            return services[type];
        }
    };

    var providers = {},
        providerInstance = {};

    BI.Providers = BI.Providers || {
        getProvider: function (type, config) {
            if (!providerInjection[type]) {
                _global.console && console.error("provider: [" + type + "] 未定义");
            }
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            if (!providerInstance[type]) {
                providerInstance[type] = new (providers[type].$get())(config);
            }
            return providerInstance[type];
        }
    };

    BI.Actions = BI.Actions || {
        runAction: function (type, event, config) {
            BI.each(actions[type], function (i, act) {
                try {
                    act(event, config);
                } catch (e) {
                    _global.console && console.error(e);
                }
            });
        },
        runGlobalAction: function () {
            var args = [].slice.call(arguments);
            BI.each(globalAction, function (i, act) {
                try {
                    act.apply(null, args);
                } catch (e) {
                    _global.console && console.error(e);
                }
            });
        }
    };

    BI.getResource = BI.getResource || function (type, config) {
        if (BI.isNotNull(constantInjection[type])) {
            return BI.Constants.getConstant(type);
        }
        if (modelInjection[type]) {
            return BI.Models.getModel(type, config);
        }
        if (storeInjection[type]) {
            return BI.Stores.getStore(type, config);
        }
        if (serviceInjection[type]) {
            return BI.Services.getService(type, config);
        }
        if (providerInjection[type]) {
            return BI.Providers.getProvider(type, config);
        }
        throw new Error("未知类型: [" + type + "] 未定义");
    };
})();


/***/ }),

/***/ 99:
/***/ (function(module, exports) {

BI.prepares.push(function () {
    BI.Date = BI.Date || {};
    // 牵扯到国际化这些常量在页面加载后再生效
    // full day names
    BI.Date._DN = [BI.i18nText("BI-Basic_Sunday"),
        BI.i18nText("BI-Basic_Monday"),
        BI.i18nText("BI-Basic_Tuesday"),
        BI.i18nText("BI-Basic_Wednesday"),
        BI.i18nText("BI-Basic_Thursday"),
        BI.i18nText("BI-Basic_Friday"),
        BI.i18nText("BI-Basic_Saturday"),
        BI.i18nText("BI-Basic_Sunday")];

    // short day names
    BI.Date._SDN = [BI.i18nText("BI-Basic_Simple_Sunday"),
        BI.i18nText("BI-Basic_Simple_Monday"),
        BI.i18nText("BI-Basic_Simple_Tuesday"),
        BI.i18nText("BI-Basic_Simple_Wednesday"),
        BI.i18nText("BI-Basic_Simple_Thursday"),
        BI.i18nText("BI-Basic_Simple_Friday"),
        BI.i18nText("BI-Basic_Simple_Saturday"),
        BI.i18nText("BI-Basic_Simple_Sunday")];

    // Monday first, etc.
    BI.Date._FD = 1;

    // full month namesdat
    BI.Date._MN = [
        BI.i18nText("BI-Basic_January"),
        BI.i18nText("BI-Basic_February"),
        BI.i18nText("BI-Basic_March"),
        BI.i18nText("BI-Basic_April"),
        BI.i18nText("BI-Basic_May"),
        BI.i18nText("BI-Basic_June"),
        BI.i18nText("BI-Basic_July"),
        BI.i18nText("BI-Basic_August"),
        BI.i18nText("BI-Basic_September"),
        BI.i18nText("BI-Basic_October"),
        BI.i18nText("BI-Basic_November"),
        BI.i18nText("BI-Basic_December")];

    // short month names
    BI.Date._SMN = [0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11];

    BI.Date._QN = ["", BI.i18nText("BI-Quarter_1"),
        BI.i18nText("BI-Quarter_2"),
        BI.i18nText("BI-Quarter_3"),
        BI.i18nText("BI-Quarter_4")];

    /** Adds the number of days array to the Date object. */
    BI.Date._MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 实际上无论周几作为一周的第一天，周初周末都是在-6-0间做偏移，用一个数组就可以
    BI.Date._OFFSET = [0, -1, -2, -3, -4, -5, -6];
});

/***/ })

/******/ });