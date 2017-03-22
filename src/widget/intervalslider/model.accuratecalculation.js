/**
 * Created by zcf on 2017/3/1.
 * 万恶的IEEE-754
 * 使用字符串精确计算含小数加法、减法、乘法和10的指数倍除法，支持负数
 */
BI.AccurateCalculationModel = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.AccurateCalculationModel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: ""
        })
    },

    _init: function () {
        BI.AccurateCalculationModel.superclass._init.apply(this, arguments);
    },

    _getMagnitude: function (n) {
        var magnitude = "1";
        for (var i = 0; i < n; i++) {
            magnitude += "0";
        }
        return BI.parseInt(magnitude);
    },

    _formatDecimal: function (stringNumber1, stringNumber2) {
        if (stringNumber1.numDecimalLength === stringNumber2.numDecimalLength) {
            return;
        }
        var magnitudeDiff = stringNumber1.numDecimalLength - stringNumber2.numDecimalLength;
        if (magnitudeDiff > 0) {
            var needAddZero = stringNumber2
        } else {
            var needAddZero = stringNumber1;
            magnitudeDiff = (0 - magnitudeDiff);
        }
        for (var i = 0; i < magnitudeDiff; i++) {
            if (needAddZero.numDecimal === "0" && i === 0) {
                continue
            }
            needAddZero.numDecimal += "0"
        }
    },

    _stringNumberFactory: function (num) {
        var strNum = num.toString();
        var numStrArray = strNum.split(".");
        var numInteger = numStrArray[0];
        if (numStrArray.length === 1) {
            var numDecimal = "0";
            var numDecimalLength = 0;
        } else {
            var numDecimal = numStrArray[1];
            var numDecimalLength = numStrArray[1].length;
        }
        return {
            "numInteger": numInteger,
            "numDecimal": numDecimal,
            "numDecimalLength": numDecimalLength
        }
    },

    _accurateSubtraction: function (num1, num2) {//num1-num2 && num1>num2
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        //整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) - BI.parseInt(stringNumber2.numInteger);
        //小数部分
        this._formatDecimal(stringNumber1, stringNumber2);
        var decimalMaxLength = getDecimalMaxLength(stringNumber1, stringNumber2);

        if (BI.parseInt(stringNumber1.numDecimal) >= BI.parseInt(stringNumber2.numDecimal)) {
            var decimalResultTemp = (BI.parseInt(stringNumber1.numDecimal) - BI.parseInt(stringNumber2.numDecimal)).toString();
            var decimalResult = addZero(decimalResultTemp, decimalMaxLength);
        } else {//否则借位
            integerResult--;
            var borrow = this._getMagnitude(decimalMaxLength);
            var decimalResultTemp = (borrow + BI.parseInt(stringNumber1.numDecimal) - BI.parseInt(stringNumber2.numDecimal)).toString();
            var decimalResult = addZero(decimalResultTemp, decimalMaxLength);
        }
        var result = integerResult + "." + decimalResult;
        return BI.parseFloat(result);

        function getDecimalMaxLength(num1, num2) {
            if (num1.numDecimal.length >= num2.numDecimal.length) {
                return num1.numDecimal.length
            }
            return num2.numDecimal.length
        }

        function addZero(resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp
        }
    },

    _accurateAddition: function (num1, num2) {//加法结合律
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        //整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) + BI.parseInt(stringNumber2.numInteger);
        //小数部分
        this._formatDecimal(stringNumber1, stringNumber2);

        var decimalResult = (BI.parseInt(stringNumber1.numDecimal) + BI.parseInt(stringNumber2.numDecimal)).toString();

        if (decimalResult !== "0") {
            if (decimalResult.length <= stringNumber1.numDecimal.length) {
                decimalResult = addZero(decimalResult, stringNumber1.numDecimal.length)
            } else {
                integerResult++;//进一
                decimalResult = decimalResult.slice(1);
            }
        }
        var result = integerResult + "." + decimalResult;
        return BI.parseFloat(result);

        function addZero(resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp
        }
    },

    _accurateMultiplication: function (num1, num2) {//乘法分配律
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        //整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) * BI.parseInt(stringNumber2.numInteger);
        //num1的小数和num2的整数
        var dec1Int2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numDecimal) * BI.parseInt(stringNumber2.numInteger), stringNumber1.numDecimalLength);
        //num1的整数和num2的小数
        var int1dec2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numInteger) * BI.parseInt(stringNumber2.numDecimal), stringNumber2.numDecimalLength);
        //小数*小数
        var dec1dec2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numDecimal) * BI.parseInt(stringNumber2.numDecimal), (stringNumber1.numDecimalLength + stringNumber2.numDecimalLength));

        return this._accurateAddition(this._accurateAddition(this._accurateAddition(integerResult, dec1Int2), int1dec2), dec1dec2);
    },

    _accurateDivisionTenExponent: function (num, n) {// num/10^n && n>0
        var stringNumber = this._stringNumberFactory(num);
        if (stringNumber.numInteger.length > n) {
            var integerResult = stringNumber.numInteger.slice(0, (stringNumber.numInteger.length - n));
            var partDecimalResult = stringNumber.numInteger.slice(-n);
        } else {
            var integerResult = "0";
            var partDecimalResult = addZero(stringNumber.numInteger, n);
        }
        var result = integerResult + "." + partDecimalResult + stringNumber.numDecimal;
        return BI.parseFloat(result);

        function addZero(resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp
        }
    },

    accurateSubtraction: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            if (num1 >= num2) {
                return this._accurateSubtraction(num1, num2)
            }
            return this._accurateSubtraction(num2, num1)
        }
        if (num1 >= 0 && num2 < 0) {
            return this._accurateAddition(num1, -num2)
        }
        if (num1 < 0 && num2 >= 0) {
            return -this._accurateAddition(-num1, num2)
        }
        if (num1 < 0 && num2 < 0) {
            if (num1 >= num2) {
                return this._accurateSubtraction(-num2, -num1)
            }
            return this._accurateSubtraction(-num1, -num2)
        }
    },

    accurateAddition: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            return this._accurateAddition(num1, num2)
        }
        if (num1 >= 0 && num2 < 0) {
            return this.accurateSubtraction(num1, -num2)
        }
        if (num1 < 0 && num2 >= 0) {
            return this.accurateSubtraction(num2, -num1)
        }
        if (num1 < 0 && num2 < 0) {
            return -this._accurateAddition(-num1, -num2)
        }
    },

    accurateMultiplication: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            return this._accurateMultiplication(num1, num2)
        }
        if (num1 >= 0 && num2 < 0) {
            return -this._accurateMultiplication(num1, -num2)
        }
        if (num1 < 0 && num2 >= 0) {
            return -this._accurateMultiplication(-num1, num2)
        }
        if (num1 < 0 && num2 < 0) {
            return this._accurateMultiplication(-num1, -num2)
        }
    },

    accurateDivisionTenExponent: function (num1, n) {
        if (num1 >= 0) {
            return this._accurateDivisionTenExponent(num1, n);
        }
        return -this._accurateDivisionTenExponent(-num1, n);
    }
});