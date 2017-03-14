/**
 * 基本函数
 * Create By GUY 2014\11\17
 *
 */

if (!window.BI) {
    window.BI = {};
}
;
!(function ($, undefined) {
    _.extend(BI, {
        version: "4.0"
    });
    var traverse = function (func, context) {
        return function (value, key, obj) {
            return func.call(context, key, value, obj);
        }
    };
    var _apply = function (name) {
        return function () {
            return _[name].apply(_, arguments);
        }
    };
    var _applyFunc = function (name) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args[1] = _.isFunction(args[1]) ? traverse(args[1], args[2]) : args[1];
            return _[name].apply(_, args);
        }
    };

    //Utility
    _.extend(BI, {
        i18nText: function (key) {
            var localeText = key;
            if (!localeText) {
                localeText = key;
            }
            var len = arguments.length;
            if (len > 1) {
                for (var i = 1; i < len; i++) {
                    var key = "{R" + i + "}";
                    localeText = localeText.replaceAll(key, arguments[i] + "");
                }
            }
            return localeText;
        },

        assert: function (v, is) {
            if (this.isFunction(is)) {
                if (!is(v)) {
                    throw new Error(v + "值不合法");
                } else {
                    return true;
                }
            }
            if (!this.isArray(is)) {
                is = [is];
            }
            if (!this.deepContains(is, v)) {
                throw new Error(v + "值不合法");
            }
        },

        warn: function (message) {
            console.warn(message)
        },

        UUID: function () {
            var f = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
            var str = "";
            for (var i = 0; i < 16; i++) {
                var r = parseInt(f.length * Math.random(), 10);
                str += f[r];
            }
            return str;
        },

        isWidget: function (widget) {
            return widget instanceof BI.Widget || (BI.View && widget instanceof BI.View);
        },

        createWidgets: function (items, options) {
            if (!BI.isArray(items)) {
                throw new Error("无法根据items创建组件?")
            }
            return BI.map(BI.flatten(items), function (i, item) {
                return BI.createWidget(item, BI.deepClone(options));
            });
        },

        createItems: function (data, innerAttr, outerAttr) {
            innerAttr = BI.isArray(innerAttr) ? innerAttr : BI.makeArray(BI.flatten(data).length, innerAttr);
            outerAttr = BI.isArray(outerAttr) ? outerAttr : BI.makeArray(BI.flatten(data).length, outerAttr);
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
                    })
                }
                if (item.el instanceof BI.Widget || (BI.View && item.el instanceof BI.View)) {
                    innerAttr.shift();
                    return BI.extend({}, outerAttr.shift(), {type: null}, item);
                }
                if (item.el) {
                    return BI.extend({}, outerAttr.shift(), item, {
                        el: BI.extend({}, innerAttr.shift(), item.el)
                    })
                }
                return BI.extend({}, outerAttr.shift(), {
                    el: BI.extend({}, innerAttr.shift(), item)
                })
            })
        },

        //用容器包装items
        packageItems: function (items, layouts) {
            for (var i = layouts.length - 1; i >= 0; i--) {
                items = BI.map(items, function (k, it) {
                    return BI.extend({}, layouts[i], {
                        items: [
                            BI.extend({}, layouts[i].el, {
                                el: it
                            })
                        ]
                    })
                })
            }
            return items;
        },

        formatEL: function (obj) {
            if (obj && obj.el) {
                return obj;
            }
            return {
                el: obj
            };
        },

        //剥开EL
        stripEL: function (obj) {
            return obj.type && obj || obj.el || obj;
        },

        trans2Element: function (widgets) {
            return BI.map(widgets, function (i, wi) {
                return wi.element;
            });
        }
    });

    //集合相关方法
    _.each(["where", "findWhere", "contains", "invoke", "pluck", "shuffle", "sample", "toArray", "size"], function (name) {
        BI[name] = _apply(name)
    });
    _.each(["each", "map", "reduce", "reduceRight", "find", "filter", "reject", "every", "all", "some", "any", "max", "min",
        "sortBy", "groupBy", "indexBy", "countBy", "partition"], function (name) {
        BI[name] = _applyFunc(name)
    });
    _.extend(BI, {
        clamp: function (value, minValue, maxValue) {
            if (value < minValue) {
                value = minValue;
            }
            if (value > maxValue) {
                value = maxValue;
            }
            return value;
        },
        //数数
        count: function (from, to, predicate) {
            var t;
            if (predicate) {
                for (t = from; t < to; t++) {
                    predicate(t);
                }
            }
            return to - from;
        },

        //倒数
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
                return obj1 + "" + obj2;
            }
            if (BI.isArray(obj1)) {
                return obj1.concat(obj2);
            }
            if (BI.isObject(obj1)) {
                return _.extend({}, obj1, obj2);
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
                if (predicate(index, obj[index], obj)) return true;
            }
            return false;
        },

        backEvery: function (obj, predicate, context) {
            predicate = BI.iteratee(predicate, context);
            for (var index = obj.length - 1; index >= 0; index--) {
                if (!predicate(index, obj[index], obj)) return false;
            }
            return true;
        },

        remove: function (obj, target, context) {
            var isFunction = BI.isFunction(target);
            target = isFunction || BI.isArray(target) ? target : [target];
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if ((isFunction && target.apply(context, [i, obj[i]]) === true) || (!isFunction && target.contains(obj[i]))) {
                        obj.splice(i--, 1);
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if ((isFunction && target.apply(context, [i, obj[i]]) === true) || (!isFunction && target.contains(obj[i]))) {
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
            return str.split('&-&');
        },

        array2String: function (array) {
            return array.join("&-&");
        },

        abc2Int: function (str) {
            var idx = 0, start = 'A', str = str.toUpperCase();
            for (var i = 0, len = str.length; i < len; ++i) {
                idx = str.charAt(i).charCodeAt(0) - start.charCodeAt(0) + 26 * idx + 1;
                if (idx > (2147483646 - str.charAt(i).charCodeAt(0) + start.charCodeAt(0)) / 26) {
                    return 0;
                }
            }
            return idx;
        },

        int2Abc: function (num) {
            var DIGITS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
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

    //数组相关的方法
    _.each(["first", "initial", "last", "rest", "compact", "flatten", "without", "union", "intersection",
        "difference", "zip", "unzip", "object", "indexOf", "lastIndexOf", "sortedIndex", "range"], function (name) {
        BI[name] = _apply(name)
    });
    _.each(["findIndex", "findLastIndex"], function (name) {
        BI[name] = _applyFunc(name)
    });
    _.extend(BI, {
        //构建一个长度为length的数组
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
            if (array == null) return [];
            if (!_.isBoolean(isSorted)) {
                context = iteratee;
                iteratee = isSorted;
                isSorted = false;
            }
            iteratee && (iteratee = traverse(iteratee, context));
            return _.uniq.call(_, array, isSorted, iteratee, context);
        }
    });

    //对象相关方法
    _.each(["keys", "allKeys", "values", "pairs", "invert", "create", "functions", "extend", "extendOwn",
        "defaults", "clone", "property", "propertyOf", "matcher", "isEqual", "isMatch", "isEmpty",
        "isElement", "isNumber", "isString", "isArray", "isObject", "isArguments", "isFunction", "isFinite",
        "isBoolean", "isDate", "isRegExp", "isError", "isNaN", "isUndefined"], function (name) {
        BI[name] = _apply(name)
    });
    _.each(["mapObject", "findKey", "pick", "omit", "tap"], function (name) {
        BI[name] = _applyFunc(name)
    });
    _.extend(BI, {

        inherit: function (sb, sp, overrides) {
            if (typeof sp == 'object') {
                overrides = sp;
                sp = sb;
                sb = function () {
                    sp.apply(this, arguments);
                };
            }
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

        has: function (obj, keys) {
            if (BI.isKey(keys)) {
                return _.has.apply(_, arguments);
            }
            if (!keys || BI.isEmpty(keys)) {
                return false;
            }
            return BI.every(keys, function (i, key) {
                return _.has(obj, key);
            });
        },

        //数字和字符串可以作为key
        isKey: function (key) {
            return BI.isNumber(key) || (BI.isString(key) && key.length > 0);
        },

        //忽略大小写的等于
        isCapitalEqual: function (a, b) {
            a = BI.isNull(a) ? a : ("" + a).toLowerCase();
            b = BI.isNull(b) ? b : ("" + b).toLowerCase();
            return BI.isEqual(a, b);
        },

        isWidthOrHeight: function (w) {
            if (typeof w == 'number') {
                return w >= 0;
            } else if (typeof w == 'string') {
                return /^\d{1,3}%$/.exec(w) || w == 'auto' || /^\d+px$/.exec(w);
            }
        },

        isNotNull: function (obj) {
            return !BI.isNull(obj);
        },

        isNull: function (obj) {
            return typeof  obj === "undefined" || obj === null;
        },

        isPlainObject: function () {
            return $.isPlainObject.apply($, arguments);
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

        isWindow: function () {
            return $.isWindow.apply($, arguments);
        }
    });

    //deep方法
    _.extend(BI, {
        /**
         *完全克隆�?个js对象
         * @param obj
         * @returns {*}
         */
        deepClone: function (obj) {
            if (obj === null || obj === undefined) {
                return obj;
            }

            var type = Object.prototype.toString.call(obj);

            // Date
            if (type === '[object Date]') {
                return new Date(obj.getTime());
            }

            var i, clone, key;

            // Array
            if (type === '[object Array]') {
                i = obj.length;

                clone = [];

                while (i--) {
                    clone[i] = BI.deepClone(obj[i]);
                }
            }
            // Object
            else if (type === '[object Object]' && obj.constructor === Object) {
                clone = {};

                for (var i in obj) {
                    if (_.has(obj, i)) {
                        clone[i] = BI.deepClone(obj[i]);
                    }
                }
            }

            return clone || obj;
        },

        isDeepMatch: function (object, attrs) {
            var keys = BI.keys(attrs), length = keys.length;
            if (object == null) return !length;
            var obj = Object(object);
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (!BI.isEqual(attrs[key], obj[key]) || !(key in obj)) return false;
            }
            return true;
        },

        deepContains: function (obj, copy) {
            if (BI.isObject(copy)) {
                return BI.any(obj, function (i, v) {
                    if (BI.isEqual(v, copy)) {
                        return true;
                    }
                })
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
            var i;
            if (BI.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if (BI.isEqual(target, obj[i])) {
                        obj.splice(i--, 1);
                    }
                }
            } else {
                BI.each(obj, function (i, v) {
                    if (BI.isEqual(target, obj[i])) {
                        delete obj[i];
                    }
                });
            }
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
            } else {
                var result = {};
                BI.each(obj, function (i, v) {
                    if (!BI.isEqual(target, obj[i])) {
                        result[i] = v;
                    }
                });
                return result;
            }
        },

        deepUniq: function () {

        },

        //比较两个对象得出不一样的key值
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
                if (this.has(other, b) && !used.contains(b)) {
                    result.push(b);
                }
            }
            return result;
        }
    });

    //通用方法
    _.each(["uniqueId", "result", "chain", "iteratee", "escape", "unescape"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        }
    });

    //事件相关方法
    _.each(["bind", "once", "partial", "debounce", "throttle", "delay", "defer", "wrap"], function (name) {
        BI[name] = function () {
            return _[name].apply(_, arguments);
        }
    });

    _.extend(BI, {
        nextTick: (function () {
            var callbacks = [];
            var pending = false;
            var timerFunc;

            function nextTickHandler() {
                pending = false;
                var copies = callbacks.slice(0);
                callbacks = [];
                for (var i = 0; i < copies.length; i++) {
                    copies[i].func.apply(null, copies[i].args);
                }
            }

            /* istanbul ignore if */
            if (typeof MutationObserver !== 'undefined') {
                var counter = 1;
                var observer = new MutationObserver(nextTickHandler);
                var textNode = document.createTextNode(counter);
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function () {
                    counter = (counter + 1) % 2;
                    textNode.data = counter;
                }
            } else {
                timerFunc = setTimeout
            }
            return function (cb) {
                var args = [].slice.call(arguments, 1);
                callbacks.push({func: cb, args: args});
                if (pending) return;
                pending = true;
                timerFunc(nextTickHandler, 0);
            }
        })()
    });

    //数字相关方法
    _.each(["random"], function (name) {
        BI[name] = _apply(name)
    });
    _.extend(BI, {
        getTime: function () {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            } else {
                if (window.performance && window.performance.webkitNow) {
                    return window.performance.webkitNow();
                } else {
                    if (Date.now) {
                        return Date.now();
                    } else {
                        return new Date().getTime();
                    }
                }
            }
        },

        parseInt: function (number) {
            var radix = 10;
            if (/^0x/g.test(number)) {
                radix = 16;
            }
            try {
                return parseInt(number, radix);
            } catch (e) {
                throw new Error("转成int类型失败");
                return NaN;
            }
        },

        parseFloat: function (number) {
            try {
                return parseFloat(number);
            } catch (e) {
                throw new Error("转成float类型失败");
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
            return $.isNumeric(number);
        },

        isFloat: function (number) {
            if (/^([+-]?)\\d*\\.\\d+$/.test(number)) {
                return true;
            }
            return false;
        },

        isOdd: function (number) {
            if (!BI.isInteger(number)) {
                return false;
            }
            return number & 1 === 1;
        },

        isEven: function (number) {
            if (!BI.isInteger(number)) {
                return false;
            }
            return number & 1 === 0;
        },

        sum: function (array, iteratee, context) {
            var sum = 0;
            BI.each(array, function (i, item) {
                if (iteratee) {
                    sum += new Number(iteratee.apply(context, [i, item]));
                } else {
                    sum += new Number(item);
                }
            });
            return sum;
        },

        average: function (array, iteratee, context) {
            var sum = BI.sum(array, iteratee, context);
            return sum / array.length;
        }
    });

    //字符串相关方法
    _.extend(BI, {
        trim: function () {
            return $.trim.apply($, arguments);
        },

        toUpperCase: function (string) {
            return (string + "").toLocaleUpperCase();
        },

        toLowerCase: function (string) {
            return (string + "").toLocaleLowerCase();
        },

        isLiteral: function (exp) {
            var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/
            return literalValueRE.test(exp)
        },

        stripQuotes: function (str) {
            var a = str.charCodeAt(0)
            var b = str.charCodeAt(str.length - 1)
            return a === b && (a === 0x22 || a === 0x27)
                ? str.slice(1, -1)
                : str
        },

        //background-color => backgroundColor
        camelize: function (str) {
            return str.replace(/-(.)/g, function (_, character) {
                return character.toUpperCase();
            });
        },

        //backgroundColor => background-color
        hyphenate: function (str) {
            return str.replace(/([A-Z])/g, '-$1').toLowerCase();
        },

        isNotEmptyString: function (str) {
            return BI.isString(str) && !BI.isEmpty(str);
        },

        isEmptyString: function (str) {
            return BI.isString(str) && BI.isEmpty(str);
        },

        /**
         * 对字符串进行加密 {@link #decrypt}
         * @static
         * @param str 原始字符�?
         * @param keyt 密钥
         * @returns {String} 加密后的字符�?
         */
        encrypt: function (str, keyt) {
            if (str == "") {
                return "";
            }
            str = escape(str);
            if (!keyt || keyt == "") {
                keyt = "655";
            }
            keyt = escape(keyt);
            if (keyt == null || keyt.length <= 0) {
                alert("Please enter a password with which to encrypt the message.");
                return null;
            }
            var prand = "";
            for (var i = 0; i < keyt.length; i++) {
                prand += keyt.charCodeAt(i).toString();
            }
            var sPos = Math.floor(prand.length / 5);
            var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));

            var incr = Math.ceil(keyt.length / 2);
            var modu = Math.pow(2, 31) - 1;
            if (mult < 2) {
                alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
                return null;
            }
//        var salt = Math.round(Math.random() * 1000000000) % 100000000;
            var salt = 101;
            prand += salt;
            while (prand.length > 10) {
                prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length), 10)).toString();
            }
            prand = (mult * prand + incr) % modu;
            var enc_chr = "";
            var enc_str = "";
            for (var i = 0; i < str.length; i++) {
                enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
                if (enc_chr < 16) {
                    enc_str += "0" + enc_chr.toString(16);
                } else {
                    enc_str += enc_chr.toString(16);
                }
                prand = (mult * prand + incr) % modu;
            }
            salt = salt.toString(16);
            while (salt.length < 8) {
                salt = "0" + salt;
            }
            enc_str += salt;
            return enc_str;
        },

        /**
         * 对加密后的字符串解密 {@link #encrypt}
         * @static
         * @param str 加密过的字符�?
         * @param keyt 密钥
         * @returns {String} 解密后的字符�?
         */
        decrypt: function (str, keyt) {
            if (str == "") {
                return "";
            }
            if (!keyt || keyt == "") {
                keyt = "655";
            }
            keyt = escape(keyt);
            if (str == null || str.length < 8) {
                return;
            }
            if (keyt == null || keyt.length <= 0) {
                return;
            }
            var prand = "";
            for (var i = 0; i < keyt.length; i++) {
                prand += keyt.charCodeAt(i).toString();
            }
            var sPos = Math.floor(prand.length / 5);
            var tempmult = prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4);
            if (sPos * 5 < prand.length) {
                tempmult += prand.charAt(sPos * 5);
            }
            var mult = parseInt(tempmult);
            var incr = Math.round(keyt.length / 2);
            var modu = Math.pow(2, 31) - 1;
            var salt = parseInt(str.substring(str.length - 8, str.length), 16);
            str = str.substring(0, str.length - 8);
            prand += salt;
            while (prand.length > 10) {
                prand = (parseInt(prand.substring(0, 10), 10) + parseInt(prand.substring(10, prand.length), 10)).toString();
            }
            prand = (mult * prand + incr) % modu;
            var enc_chr = "";
            var enc_str = "";
            for (var i = 0; i < str.length; i += 2) {
                enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
                enc_str += String.fromCharCode(enc_chr);
                prand = (mult * prand + incr) % modu;
            }
            return unescape(enc_str);
        }
    });

    //浏览器相关方法
    _.extend(BI, {
        isIE: function () {
            return $.browser.msie;
        },

        isChrome: function () {
            return $.browser.chrome;
        },

        isFireFox: function () {
            return $.browser.mozilla;
        },

        isOpera: function () {
            return $.browser.opera;
        },

        isSafari: function () {
            return $.browser.safari;
        },

        isKhtml: function () {
            return /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
        },

        isSupportCss3: function (style) {
            var prefix = ['webkit', 'Moz', 'ms', 'o'],
                i, len,
                humpString = [],
                htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };

            for (i in prefix) {
                humpString.push(_toHumb(prefix[i] + '-' + style));
            }
            humpString.push(_toHumb(style));

            for (i = 0, len = humpString.length; i < len; i++) {
                if (humpString[i] in htmlStyle) {
                    return true;
                }
            }
            return false;
        }
    });
    //BI请求
    _.extend(BI, {

        /**
         * 异步ajax请求
         * @param {String} op op参数
         * @param {String} cmd cmd参数
         * @param {JSON} data ajax请求的参数
         * @param {Function} callback 回调函数
         * @param {Function} complete 回调
         */
        requestAsync: function (op, cmd, data, callback, complete) {
            // if (BI.isNull(BI.REQUEST_LOADING)) {
            //     BI.REQUEST_LOADING = BI.createWidget({
            //         type: "bi.request_loading"
            //     });
            // }
            data = data || {};
            if (!BI.isKey(op)) {
                op = 'fr_bi_dezi';
            }
            if (op === "fr_bi_dezi") {
                data.sessionID = Data.SharingPool.get("sessionID");
            }
            var url = FR.servletURL + '?op=' + op + '&cmd=' + cmd + "&_=" + Math.random();
            (BI.ajax || FR.ajax)({
                url: url,
                type: 'POST',
                data: data,
                error: function () {
                    // BI.Msg.toast(BI.i18nText("BI-Ajax_Error"));
                    //失败 取消、重新加载
                    // BI.REQUEST_LOADING.setCallback(function () {
                    //     BI.requestAsync(op, cmd, data, callback, complete);
                    // });
                    // BI.REQUEST_LOADING.showError();
                },
                complete: function (res, status) {
                    if (BI.isFunction(callback) && status === 'success') {
                        callback(BI.jsonDecode(res.responseText));
                        BI.Maskers.hide(BI.RequstLoading.MASK_ID);
                    }
                    if (BI.isFunction(complete)) {
                        complete();
                    }
                }
            });
        },

        /**
         * 同步ajax请求
         * @param {String} op op参数
         * @param {String} cmd cmd参数
         * @param {JSON} data ajax请求的参�?
         * @returns {Object} ajax同步请求返回的JSON对象
         */
        requestSync: function (op, cmd, data) {
            data = data || {};
            if (!BI.isKey(op)) {
                op = 'fr_bi_dezi';
            }
            if (op === "fr_bi_dezi") {
                data.sessionID = Data.SharingPool.get("sessionID");
            }
            var url = FR.servletURL + '?op=' + op + '&cmd=' + cmd + "&_=" + Math.random();
            var result = {};
            (BI.ajax || FR.ajax)({
                url: url,
                type: 'POST',
                async: false,
                data: data,
                error: function () {
                    BI.Msg.toast(BI.i18nText("BI-Ajax_Error"));
                },
                complete: function (res, status) {
                    if (status === 'success') {
                        result = BI.jsonDecode(res.responseText);
                    }
                }
            });
            return result;
        },

        /**
         * 请求方法
         * @param cmd 命令
         * @param data 数据
         * @param extend 参数
         * @returns {*}
         */
        request: function (cmd, data, extend) {
            extend = extend || {};
            data = data || {};
            var op = extend.op;
            if (!BI.isKey(op)) {
                op = 'fr_bi_dezi';
            }
            if (op === "fr_bi_dezi") {
                data.sessionID = Data.SharingPool.get("sessionID");
            }
            if (extend.async === true) {
                BI.requestAsync(op, cmd, data, extend.complete || extend.success);
            } else {
                return BI.requestSync(op, cmd, data);
            }
        }
    });
})(jQuery);