/**
 * 加法函数，用来得到精确的加法结果
 * @param {Number} num 被加数
 * @param {Number} arg 加数
 * @return {Number}  两个数字相加后的结果
 */
export declare type _add = (num: number, arg: number) => number;
/**
 * 减法函数，用来得到精确的减法结果
 * @param {Number} num 被减数
 * @param {Number} arg 减数
 * @return {Number}  两个数字相减后的结果
 */
export declare type _sub = (num: number, arg: number) => number;
/**
 * 乘法函数，用来得到精确的乘法结果
 * @param {Number} num 被乘数
 * @param {Number} arg 乘数
 * @return {Number}  两个数字相乘后的结果
 */
export declare type _mul = (num: number, arg: number) => number;
/**
 * 除法函数，用来得到精确的除法结果
 * @param {Number} num 被除数
 * @param {Number} arg 除数
 * @return {Number}  两个数字相除后的结果
 */
export declare type _div = (num: number, arg: number) => number;
declare type _number = {
    add: _add;
    sub: _sub;
    mul: _mul;
    div: _div;
};
export default _number;
