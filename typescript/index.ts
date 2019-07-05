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

    const startWith: _startWith;
    const endWith: _endWith;
    const getQuery: _getQuery;
    const appendQuery: _appendQuery;
    const replaceAll: _replaceAll;
    const perfectStart: _perfectStart;
    const allIndexOf: _allIndexOf;
}
