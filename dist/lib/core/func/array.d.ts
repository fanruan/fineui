export declare type _pushArray = (sArray: any[], array: any[]) => void;
export declare type _pushDistinct = (sArray: any[], obj: any) => void;
export declare type _pushDistinctArray = (sArray: any[], array: any[]) => void;
declare type _array = {
    pushArray: _pushArray;
    pushDistinct: _pushDistinct;
    pushDistinctArray: _pushDistinctArray;
};
export default _array;
