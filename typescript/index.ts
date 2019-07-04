import { _addI18n, _i18nText } from "./core/i18n";
import { _OB } from "./core/ob";
import { _pushArray, _pushDistinct, _pushDistinctArray} from "./core/func/array";

export declare module BI {
    namespace i18n {
        const addI18n: _addI18n;
        const i18nText: _i18nText;
    }

    const OB: _OB;
    
    const pushArray: _pushArray;
    const pushDistinct: _pushDistinct;
    const pushDistinctArray: _pushDistinctArray;
}
