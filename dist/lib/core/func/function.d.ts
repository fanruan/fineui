/**
 * 创建唯一的名字
 * @param array 已有的名字集合
 * @param name 待生成的名字
 * @return  生成后的名字
 */
export declare type _createDistinctName = (array: any[], name: string) => string;
/**
 * 获取搜索结果
 * @param items 待搜索的数据
 * @param keyword 关键字
 * @param param  搜索哪个属性
 */
export declare type _getSearchResult = (items: any, keyword: any, param: string) => {
    find: any;
    match: any;
};
/**
 * 在方法A执行之前执行方法B
 * @param sFunc 方法A
 * @param func 方法B
 */
export declare type _beforeFunc = (sFunc: Function, func: Function) => Function;
/**
 * 在方法A执行之后执行方法B
 * @param sFunc 方法A
 * @param func 方法B
 */
export declare type _afterFunc = (sFunc: Function, func: Function) => Function;
declare type _function = {
    createDistinctName: _createDistinctName;
    getSearchResult: _getSearchResult;
    beforeFunc: _beforeFunc;
    afterFunc: _afterFunc;
};
export default _function;
