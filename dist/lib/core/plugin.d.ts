import { _Widget } from "./widget";
declare type configWidgetFn = (type: string, options: Obj) => void;
declare type configObjectFn = (type: string, widget: _Widget) => void;
export declare type _config = (widgetFunction: configWidgetFn | configWidgetFn[], objectFunction: configObjectFn | configObjectFn[]) => void;
export declare type _configWidget = (shortcut: string, widgetFunction: configWidgetFn) => void;
export declare type _registerObject = (shortcut: string, objectFunction: configObjectFn) => void;
export declare type _Plugin = {
    config: _config;
    configWidget: _configWidget;
    registerObject: _registerObject;
};
export {};
