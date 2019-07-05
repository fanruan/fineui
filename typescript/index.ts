import { _addI18n, _i18nText } from "./core/i18n";
import { _OB } from "./core/ob";
import { _pushArray, _pushDistinct, _pushDistinctArray} from "./core/func/array";
import {_startWith, _allIndexOf, _appendQuery, _endWith, _getQuery, _perfectStart, _replaceAll} from "./core/func/string";

export declare module BI {
    namespace i18n {
        const addI18n: _addI18n;
        const i18nText: _i18nText;
    }

    const OB: _OB;
    
    const pushArray: _pushArray;
    const pushDistinct: _pushDistinct;
    const pushDistinctArray: _pushDistinctArray;

    /**
     * 判断字符串是否已指定的字符串开始
     * @param str source字符串
     * @param {String} startTag   指定的开始字符串
     * @return {Boolean}  如果字符串以指定字符串开始则返回true，否则返回false
     */
    const startWith: _startWith;

    /**
     * 判断字符串是否以指定的字符串结束
     * @param str source字符串
     * @param {String} endTag 指定的字符串
     * @return {Boolean}  如果字符串以指定字符串结束则返回true，否则返回false
     */
    const endWith: _endWith;

    /**
     * 获取url中指定名字的参数
     * @param str source字符串
     * @param {String} name 参数的名字
     * @return {String} 参数的值
     */
    const getQuery: _getQuery;

    /**
     * 给url加上给定的参数
     * @param str source字符串
     * @param {Object} paras 参数对象，是一个键值对对象
     * @return {String} 添加了给定参数的url
     */
    const appendQuery: _appendQuery;

    /**
     * 将所有符合第一个字符串所表示的字符串替换成为第二个字符串
     * @param str source字符串
     * @param {String} s1 要替换的字符串的正则表达式
     * @param {String} s2 替换的结果字符串
     * @returns {String} 替换后的字符串
     */
    const replaceAll: _replaceAll;
    
    /**
     * 总是让字符串以指定的字符开头
     * @param str source字符串
     * @param {String} start 指定的字符
     * @returns {String} 以指定字符开头的字符串
     */
    const perfectStart: _perfectStart;

    /**
     * 获取字符串中某字符串的所有项位置数组
     * @param str source字符串
     * @param {String} sub 子字符串
     * @return {Number[]} 子字符串在父字符串中出现的所有位置组成的数组
     */
    const allIndexOf: _allIndexOf;
}
