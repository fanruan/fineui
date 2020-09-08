import { _Widget } from "./widget";
declare type configWidgetFn = (options: object) => object;
declare type configObjectFn = (widget: _Widget) => void;
export declare type _config = (widgetFunction: configWidgetFn | configWidgetFn[], objectFunction: configObjectFn | configObjectFn[]) => void;
export declare type _configWidget = (shorcut: string, widgetFunction: configWidgetFn) => void;
export declare type _registerObject = (shorcut: string, objectFunction: configObjectFn) => void;
export declare type _Plugin = {
    config: _config;
    configWidget: _configWidget;
    registerObject: _registerObject;
};
export {};
