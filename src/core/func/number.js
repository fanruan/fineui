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