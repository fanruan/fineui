import _array from "./array";
import _string from "./string";
import _number from "./number";
import _function from "./function";
import { _Date } from "./date";
export interface _func extends _array, _string, _number, _function {
    Date: _Date;
}
