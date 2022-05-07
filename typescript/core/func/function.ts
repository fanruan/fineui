export type _function = {

    /**
     * 创建唯一的名字
     * @param array 已有的名字集合
     * @param name 待生成的名字
     * @return  生成后的名字
     */
    createDistinctName: (array: any[], name: string) => string;

    /**
     * 获取搜索结果
     * @param items 待搜索的数据
     * @param keyword 关键字
     * @param param  搜索哪个属性
     */
    getSearchResult: (items: any, keyword: any, param?: string) => { find: any[], match: any[] };

    /**
     * 获取编码后的url
     * @param urlTemplate url模板
     * @param param 参数
     */
    getEncodeURL: (urlTemplate: string, param: any) => string;

    /**
     * 获取按GB2312排序的结果
     * @param items
     * @param key
     */
    getSortedResult: <T>(items: T[], key?: string | Function) => T[];

    /**
     * 在方法A执行之前执行方法B
     * @param sFunc 方法A
     * @param func 方法B
     */
    beforeFunc: (sFunc: Function, func: Function) => Function;

    /**
     * 在方法A执行之后执行方法B
     * @param sFunc 方法A
     * @param func 方法B
     */
    afterFunc: (sFunc: Function, func: Function) => Function;
}
